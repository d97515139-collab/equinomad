import { cache } from "react";
import { prisma } from "@/server/prisma";

/**
 * Chiffres de la boutique affichés dans la barre de service de l'en-tête.
 *
 * Tous sont **relevés en base**, aucun n'est écrit à la main ni tiré au sort.
 * C'est la seule forme défendable : un compteur de ventes inventé est une
 * pratique commerciale trompeuse (directive 2005/29/CE, art. 6), et le corpus
 * juridique espagnol du site rendrait la contradiction difficile à tenir. Les
 * vrais chiffres se trouvent d'ailleurs être les plus vendeurs — le nombre de
 * remorques disponibles tout de suite dit quelque chose qu'un total de ventes
 * cumulé ne dit pas.
 */
export type IndicadoresTienda = {
  /** Fiches publiées, tous univers confondus. */
  modelos: number;
  /** Fiches publiées dont le stock est supérieur à zéro. */
  disponibles: number;
  /** Constructeurs distincts au catalogue. */
  marcas: number;
  /**
   * Numéro de la tranche de dix minutes en cours, qui sert à choisir le
   * message affiché.
   *
   * Il est calculé ici et non dans le composant : lire l'heure pendant un
   * rendu est impur, et React l'interdit à juste titre — deux rendus du même
   * arbre donneraient deux résultats. Le calcul appartient à la couche qui
   * lit déjà l'état du monde, et `cache()` le fige pour toute la requête.
   */
  tranche: number;
};

/** Durée pendant laquelle le même message est servi, en millisecondes. */
const TRANCHE_MS = 10 * 60 * 1000;

/**
 * Une seule requête pour les trois compteurs, et non trois `count()`.
 *
 * La base est distante : chaque aller-retour se paie en latence sur *toutes*
 * les pages, puisque l'en-tête est rendu partout. Les agrégats conditionnels
 * de PostgreSQL (`filter`) les ramènent en un seul passage. C'est du SQL
 * spécifique au moteur, assumé ici : le schéma reste portable, cette lecture
 * ne l'est pas.
 */
export const leerIndicadores = cache(async (): Promise<IndicadoresTienda | null> => {
  try {
    const filas = await prisma.$queryRaw<
      { modelos: number; disponibles: number; marcas: number }[]
    >`
      select
        count(*) filter (where active)::int as modelos,
        count(*) filter (where active and stock > 0)::int as disponibles,
        count(distinct brand) filter (where active)::int as marcas
      from "Product"
    `;

    const fila = filas[0];
    if (!fila || fila.modelos === 0) return null;

    return { ...fila, tranche: Math.floor(Date.now() / TRANCHE_MS) };
  } catch {
    // La barre de service n'est pas essentielle : une base injoignable la fait
    // disparaître, elle n'empêche pas l'en-tête de se rendre.
    return null;
  }
});
