/**
 * Quel permis pour tracter quelle remorque, en droit espagnol (RD 818/2009,
 * transposant la directive 2006/126/CE).
 *
 * La question ne porte jamais sur la remorque seule : ce sont les masses
 * cumulées du véhicule et de la remorque qui décident. Ce module renvoie donc,
 * pour chaque permis, la MMA maximale du véhicule tracteur — c'est ce que
 * l'acheteur peut confronter à sa carte grise.
 */

/** Ensemble maximal autorisé par chaque permis, en kilogrammes. */
const CONJUNTO_B = 3500;
const CONJUNTO_B96 = 4250;
const CONJUNTO_BE = 7000;

/** MMA maximale d'un véhicule conduit avec un permis B, B96 ou B+E. */
const VEHICULO_MAX = 3500;

/** Remorque légère : elle reste au permis B sans condition d'ensemble. */
const REMOLQUE_LIGERO = 750;

/** Au-delà, le B+E ne suffit plus : il faut un permis poids lourd (C1E, CE). */
const REMOLQUE_MAX_BE = 3500;

/**
 * Voiture particulière la plus légère qu'on rencontre couramment. En dessous de
 * ce seuil, dire « permis B » serait exact sur le papier et faux en pratique :
 * aucun véhicule courant n'y entre.
 */
export const VEHICULO_MINIMO_REALISTA = 1000;

export interface ExigenciaPermiso {
  /** MMA maximale du tracteur pour rester en permis B. */
  readonly vehiculoMaxConB: number;
  /** Idem avec le B96. */
  readonly vehiculoMaxConB96: number;
  /** Idem avec le B+E. Vaut 0 quand la remorque sort du domaine du B+E. */
  readonly vehiculoMaxConBE: number;
  /** Le permis B est théoriquement possible mais aucune voiture réelle n'y entre. */
  readonly bImposibleEnLaPractica: boolean;
  /** La remorque dépasse 3 500 kg : permis poids lourd obligatoire. */
  readonly exigeCamion: boolean;
}

/** Borne un résultat entre 0 et la MMA maximale d'un véhicule de catégorie B. */
function acotar(valor: number): number {
  if (valor < 0) return 0;
  return Math.min(valor, VEHICULO_MAX);
}

export function exigenciaPermiso(mmaRemolqueKg: number): ExigenciaPermiso {
  const exigeCamion = mmaRemolqueKg > REMOLQUE_MAX_BE;

  // Une remorque d'au plus 750 kg échappe au calcul d'ensemble : le permis B
  // suffit avec tout véhicule que ce permis autorise déjà à conduire.
  const vehiculoMaxConB =
    mmaRemolqueKg <= REMOLQUE_LIGERO ? VEHICULO_MAX : acotar(CONJUNTO_B - mmaRemolqueKg);

  return {
    vehiculoMaxConB,
    vehiculoMaxConB96: acotar(CONJUNTO_B96 - mmaRemolqueKg),
    vehiculoMaxConBE: exigeCamion ? 0 : acotar(CONJUNTO_BE - mmaRemolqueKg),
    bImposibleEnLaPractica: vehiculoMaxConB < VEHICULO_MINIMO_REALISTA,
    exigeCamion,
  };
}
