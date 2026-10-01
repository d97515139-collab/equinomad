import type { EspecificacionesRemolque } from "../../../src/server/productSpecs";

/** Section titrée de la description longue. */
export interface SeccionFicha {
  readonly heading: string;
  readonly headingEn: string;
  readonly body: string;
  readonly bodyEn: string;
}

/**
 * Fiche telle qu'elle est relevée sur le site du constructeur.
 *
 * Elle ne porte aucun prix : les prix vivent dans `precios.ts` et se rejouent
 * seuls quand la grille du client change, sans toucher aux textes ni aux
 * photographies. Elle ne porte pas non plus d'image : le rapatriement des
 * visuels est un étage distinct, qui attend l'accord écrit de chaque marque.
 */
export interface FichaRemolque {
  /** Slug préfixé par marque : cl-, bk-, iw-, ft-, hb-. */
  readonly slug: string;
  /**
   * Slug de la fiche déjà présente au catalogue, quand ce modèle y figure sous
   * un autre nom. L'import vise alors cette fiche-là et l'enrichit, au lieu
   * d'en créer une seconde : son URL est indexée, elle porte un prix, des avis
   * et parfois des commandes passées. Absent, le modèle est nouveau.
   */
  readonly slugExistente?: string;
  readonly brand: string;
  readonly name: string;
  readonly nameEn: string;
  readonly sku: string;
  readonly shortDescription: string;
  readonly shortDescriptionEn: string;
  readonly bullets: readonly string[];
  readonly bulletsEn: readonly string[];
  readonly sections: readonly SeccionFicha[];
  readonly specs: EspecificacionesRemolque;
  /** Adresse de la page constructeur d'où viennent les caractéristiques. */
  readonly sourceRef: string;
  /**
   * Univers de vente. « nuevos » par défaut : c'est le cas de toutes les
   * fiches issues des catalogues constructeurs. Les véhicules d'occasion
   * portent « ocasion », ce qui change à la fois leur rayon et leur `condition`.
   */
  readonly universo?: "nuevos" | "ocasion";
  /**
   * Prix de vente en euros, hors marge, pour un véhicule d'occasion : celle-ci
   * se négocie à l'unité et n'a pas sa place dans la table des tarifs, qui
   * suit les modèles de série. La marge du pipeline s'y applique comme
   * ailleurs. Absent, la fiche entre en « consultar precio ».
   */
  readonly precioEuros?: number;
}
