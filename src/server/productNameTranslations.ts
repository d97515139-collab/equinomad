import table from "../../scripts/data/noms-produits-traduits.json";

/**
 * Correction des noms et caractéristiques de produits mal traduits dans les
 * données d'origine (scripts/traduire-noms-produits.ts). Isolée ici pour être
 * testée sans base.
 *
 * Deux défauts : des noms d'annonces d'occasion restés en espagnol dans les
 * colonnes en/fr/de/it, et des valeurs remplacées par le message d'erreur du
 * service de traduction automatique, dont le quota était épuisé.
 */

export type Langue = "En" | "Fr" | "De" | "It";

const ERREUR_TRADUCTEUR = /MYMEMORY WARNING|QUERY LENGTH LIMIT|INVALID LANGUAGE PAIR|PLEASE SELECT TWO DISTINCT/i;
const MOTS_ESPAGNOLS =
  /\b(Remolque|remolque|caballos?|plazas?|NUEVO|precio|promocion|toldo|lona|cerrado|ganadero|carga|turismo|tapadera|metálico|Matrícula|Oblicuo|portacaballos|Alquiler|Se vende|ganga)\b/;

/** Vrai pour une valeur à refaire : erreur du traducteur ou texte resté en espagnol. */
export function besoinDeTraduction(valeur: string): boolean {
  return ERREUR_TRADUCTEUR.test(valeur) || MOTS_ESPAGNOLS.test(valeur);
}

const NOMS: Readonly<Record<string, Record<Langue, string>>> = table;

/** Traduction relue d'un nom d'annonce, ou null s'il est absent de la table. */
export function traduireNom(nomEspagnol: string, langue: Langue): string | null {
  return NOMS[nomEspagnol.trim()]?.[langue] ?? null;
}

const NOMBRE_DE_CHEVAUX: Readonly<Record<string, Record<Langue, string>>> = {
  "Un caballo": { En: "One horse", Fr: "Un cheval", De: "Ein Pferd", It: "Un cavallo" },
  "Dos caballos": { En: "Two horses", Fr: "Deux chevaux", De: "Zwei Pferde", It: "Due cavalli" },
};

/**
 * Caractéristique traduite selon les tournures déjà employées par le catalogue
 * (« PTAC : … », « zGG: … », « Innenraum … »). Les nombres sont repris tels
 * quels. Une tournure inconnue rend null : le script s'arrête plutôt que de
 * deviner.
 */
export function traduirePuce(puce: string, langue: Langue): string | null {
  const texte = puce.trim();
  const chevaux = NOMBRE_DE_CHEVAUX[texte];
  if (chevaux) return chevaux[langue];

  const masses = /^MMA (\S+) kg, tara (\S+) kg, carga útil (\S+) kg$/.exec(texte);
  if (masses) {
    const [, mma, tara, carga] = masses;
    return {
      En: `GVW ${mma} kg, unladen weight ${tara} kg, payload ${carga} kg`,
      Fr: `PTAC : ${mma} kg, tare : ${tara} kg, charge utile : ${carga} kg`,
      De: `zGG: ${mma} kg, Leergewicht: ${tara} kg, Nutzlast: ${carga} kg`,
      It: `MMA: ${mma} kg, tara: ${tara} kg, portata utile: ${carga} kg`,
    }[langue];
  }

  const interieur = /^Interior de (.+) m$/.exec(texte);
  if (interieur) {
    const mesures = interieur[1];
    return { En: `Interior ${mesures} m`, Fr: `Intérieur ${mesures} m`, De: `Innenraum ${mesures} m`, It: `Interno ${mesures} m` }[
      langue
    ];
  }

  return null;
}
