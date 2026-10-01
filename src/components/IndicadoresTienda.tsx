import { getTranslations } from "next-intl/server";
import { leerIndicadores } from "@/server/indicadores";

/**
 * Bande d'indicateurs, à gauche de la barre de service.
 *
 * Un seul message à la fois, pris dans une liste qui tourne. Deux compteurs
 * figés côte à côte se lisent une fois puis deviennent du décor ; une phrase
 * qui change est encore lue à la dixième visite.
 *
 * ROTATION — le message est choisi par tranche de dix minutes, pas au hasard :
 *
 *   - un tirage aléatoire changerait à *chaque* rechargement, ce qui donne
 *     l'impression d'un bandeau qui clignote et détruit toute crédibilité aux
 *     chiffres qu'il porte ;
 *   - une valeur figée ne changerait jamais.
 *
 * La tranche donne le comportement demandé : recharger deux fois de suite
 * montre la même phrase, revenir un quart d'heure plus tard en montre une
 * autre. Le numéro de tranche vient de `leerIndicadores` — lire l'heure ici
 * rendrait le rendu impur ; le reste-à-faire, un modulo, ne l'est pas.
 */

/**
 * Clés de traduction dans l'ordre de passage. Les trois premières portent un
 * chiffre relevé en base, les trois suivantes un engagement déjà pris ailleurs
 * sur le site — la garantie, le délai, les frais de mise à la route. Aucune
 * n'avance quoi que ce soit que la boutique ne tienne.
 */
const MENSAJES = [
  "modelos",
  "matriculacion",
  "disponibles",
  "entrega",
  "marcas",
  "garantia",
] as const;

export async function IndicadoresTienda() {
  const [t, cifras] = await Promise.all([
    getTranslations("indicadores"),
    leerIndicadores(),
  ]);

  if (!cifras) return null;

  const clave = MENSAJES[cifras.tranche % MENSAJES.length];

  const valores: Record<(typeof MENSAJES)[number], number | undefined> = {
    modelos: cifras.modelos,
    disponibles: cifras.disponibles,
    marcas: cifras.marcas,
    matriculacion: undefined,
    entrega: undefined,
    garantia: undefined,
  };

  const valor = valores[clave];

  return (
    // `truncate` plutôt qu'un retour à la ligne : la barre de service fait
    // 32 px de haut et l'en-tête colle en étant remonté d'exactement cette
    // hauteur. Une deuxième ligne décalerait la position collante de tout
    // l'en-tête sur les écrans étroits.
    <p className="min-w-0 truncate">
      {/* Le point rouge est le seul ornement : il signale que la ligne est
          vivante sans ajouter de mot. */}
      <span
        className="mr-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rojo align-middle"
        aria-hidden
      />
      <span className="align-middle text-white/80">
        {valor === undefined ? t(clave) : t(clave, { count: valor })}
      </span>
    </p>
  );
}
