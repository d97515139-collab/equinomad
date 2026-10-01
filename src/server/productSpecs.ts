/**
 * Caractéristiques techniques d'une remorque, stockées en JSON dans
 * `Product.specs`.
 *
 * Le champ est une chaîne, comme `bullets` : le schéma reste portable, sans
 * type JSON natif ni liste scalaire. La contrepartie est qu'on ne fait jamais
 * confiance à son contenu — d'où la validation ci-dessous, qui refuse plutôt
 * que de corriger. Une fiche dont les caractéristiques sont incohérentes
 * s'affiche sans tableau technique ; elle ne s'affiche pas avec un tableau faux.
 */

export interface EspecificacionesRemolque {
  /** Nombre de chevaux transportables. */
  readonly plazas: number;
  /** Masse maximale autorisée, en kilogrammes. */
  readonly mmaKg: number;
  /** Masse à vide, en kilogrammes. */
  readonly taraKg: number;
  /** Charge utile : toujours la MMA moins la tara. */
  readonly cargaUtilKg: number;
  readonly largoInteriorCm: number;
  readonly anchoInteriorCm: number;
  readonly altoInteriorCm: number;
  /**
   * Plancher, essieux et freinage : facultatifs, parce que les constructeurs
   * publient les masses et les dimensions mais rarement ces trois-là. Les
   * exiger reviendrait à refuser des gammes entières, ou à les inventer.
   * Présents, ils sont validés comme le reste.
   *
   * Ce qui reste obligatoire est ce dont dépend une décision d'achat : les
   * places, les trois masses et les dimensions intérieures. Le permis se
   * calcule sur la MMA, la charge utile sur la soustraction.
   */
  readonly suelo?: string;
  readonly ejes?: number;
  readonly frenos?: string;
}

/** Bornes de vraisemblance. Au-delà, c'est une faute de saisie, pas une remorque. */
const PLAZAS_MIN = 1;
const PLAZAS_MAX = 6;

function esEnteroPositivo(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isInteger(valor) && valor > 0;
}

function esTextoLleno(valor: unknown): valor is string {
  return typeof valor === "string" && valor.trim().length > 0;
}

/**
 * Lit le JSON du champ `specs`. Renvoie `null` dès qu'une valeur manque, sort
 * des bornes ou contredit les autres — jamais d'exception : une page produit ne
 * doit pas tomber parce qu'un import a mal écrit un champ.
 */
export function leerEspecificaciones(json: string): EspecificacionesRemolque | null {
  let bruto: unknown;
  try {
    bruto = JSON.parse(json);
  } catch {
    return null;
  }

  if (typeof bruto !== "object" || bruto === null) return null;
  const datos = bruto as Record<string, unknown>;

  const numericos = [
    "plazas",
    "mmaKg",
    "taraKg",
    "cargaUtilKg",
    "largoInteriorCm",
    "anchoInteriorCm",
    "altoInteriorCm",
  ] as const;
  for (const campo of numericos) {
    if (!esEnteroPositivo(datos[campo])) return null;
  }
  // Facultatifs : absents, ils ne bloquent rien ; présents, ils sont validés.
  // Une valeur fournie mais absurde reste une faute de saisie, pas une absence.
  if (datos.suelo !== undefined && !esTextoLleno(datos.suelo)) return null;
  if (datos.ejes !== undefined && !esEnteroPositivo(datos.ejes)) return null;
  if (datos.frenos !== undefined && !esTextoLleno(datos.frenos)) return null;

  const plazas = datos.plazas as number;
  if (plazas < PLAZAS_MIN || plazas > PLAZAS_MAX) return null;

  const mmaKg = datos.mmaKg as number;
  const taraKg = datos.taraKg as number;
  const cargaUtilKg = datos.cargaUtilKg as number;

  // La charge utile n'est pas une donnée indépendante : c'est une soustraction.
  // Si les trois valeurs ne se répondent pas, l'une des trois est fausse et on
  // ne sait pas laquelle.
  if (taraKg >= mmaKg) return null;
  if (mmaKg - taraKg !== cargaUtilKg) return null;

  return {
    plazas,
    mmaKg,
    taraKg,
    cargaUtilKg,
    largoInteriorCm: datos.largoInteriorCm as number,
    anchoInteriorCm: datos.anchoInteriorCm as number,
    altoInteriorCm: datos.altoInteriorCm as number,
    ...(datos.suelo === undefined ? {} : { suelo: (datos.suelo as string).trim() }),
    ...(datos.ejes === undefined ? {} : { ejes: datos.ejes as number }),
    ...(datos.frenos === undefined ? {} : { frenos: (datos.frenos as string).trim() }),
  };
}

/** Sérialise pour le champ `specs`. */
export function escribirEspecificaciones(specs: EspecificacionesRemolque): string {
  return JSON.stringify(specs);
}
