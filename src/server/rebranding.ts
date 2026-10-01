import { BRAND } from "@/config/brand";
import { COMPANY } from "@/config/company";

/**
 * Logique pure du nettoyage de la base copiée depuis Remolque Caballos
 * (scripts/rebranding-equinomad.ts). Isolée ici pour être testée sans base.
 */

/** Toute trace de l'ancienne identité, quelle qu'en soit la casse. */
export const LEGACY_PATTERN = /remolque\s+caballos|remolquecaballos|equivan|612\s?553\s?303|\bPetra\b/i;

export function hasLegacyIdentity(text: string): boolean {
  return LEGACY_PATTERN.test(text);
}

/**
 * Le script ne vise que ce qui vient de l'ancien client, jamais « tout ce qui
 * existe » : relancé une fois la boutique en service, il ne doit toucher ni aux
 * commandes Equinomad ni au compte administrateur en place.
 */
const LEGACY_ORDER_PREFIX = "RC-";

/** Clé de la ligne Setting écrite dans la même transaction que le nettoyage. */
export const REBRANDING_MARKER_KEY = "rebranding_equinomad";

export function isLegacyOrderNumber(orderNumber: string): boolean {
  return orderNumber.startsWith(LEGACY_ORDER_PREFIX);
}

export function pickLegacyAdmin<T extends { email: string }>(admins: readonly T[]): T | undefined {
  return admins.find((admin) => hasLegacyIdentity(admin.email));
}

/**
 * Textes produit. L'ancien nom y joue deux rôles : la boutique (« En Remolque
 * Caballos, el … ») et, pour quelques occasions sans marque, le nom du produit
 * lui-même (« el Remolque Caballos para 2 caballos »). Le second rôle devient
 * un nom générique, le premier devient Equinomad.
 *
 * S'y ajoutent les intitulés d'annonces importées, « Remolque caballos Ifor
 * Williams … » : le c minuscule en fait un nom commun, mais le visiteur y lit
 * l'ancienne marque. Ils prennent la tournure correcte « Remolque para caballos ».
 */
export function rebrandProductText(text: string): string {
  return text
    .replaceAll("Remolque Caballos para ", "Remolque para ")
    .replaceAll("Remolque Caballos - ", "Remolque para caballos - ")
    .replaceAll("Remolque Caballos Furgo", "Remolque para caballos Furgo")
    .replaceAll("Remolque Caballos", BRAND.name)
    .replaceAll("Remolque caballos ", "Remolque para caballos ");
}

/** Remplacements des pages légales, des plus longs aux plus courts. */
const LEGAL_REPLACEMENTS: ReadonlyArray<readonly [string, string]> = [
  ["REMOLQUE CABALLOS, S.L.", COMPANY.name],
  ["Remolque Caballos, S.L.", COMPANY.name],
  ["EQUIVAN REMOLQUES, S.L.", COMPANY.name],
  ["Ctra. Petra - Santa Margalida, km 3", COMPANY.street],
  ["07520 Petra (Illes Balears)", COMPANY.city],
  ["07520 Petra (Balearic Islands)", COMPANY.city],
  ["privacidad@remolquecaballos.com", COMPANY.email],
  ["contacto@remolquecaballos.com", COMPANY.email],
  ["www.remolquecaballos.com", COMPANY.domain],
  ["remolquecaballos.com", COMPANY.domain],
  ["+34 612 553 303", COMPANY.phone],
  // Valeurs d'exemple de l'ancien client : elles prennent le marqueur, que
  // `npm run check:launch` repère ensuite dans les pages en base.
  ["Nombre Apellidos (a completar)", COMPANY.managingDirector],
  ["First name Last name (to be completed)", COMPANY.managingDirector],
  ["Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Alemania", COMPANY.host],
  ["Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Germany", COMPANY.host],
  ["Remolque Caballos", BRAND.name],
];

/**
 * Pages légales réécrites en base (colonne LegalContent.data, du JSON sérialisé).
 * Les valeurs de remplacement ne contiennent ni guillemet ni barre oblique
 * inverse : le JSON reste valide.
 */
export function rebrandLegalText(text: string): string {
  return LEGAL_REPLACEMENTS.reduce((acc, [avant, apres]) => acc.replaceAll(avant, apres), text);
}

export interface StockMovementRow {
  id: string;
  productId: string;
  delta: number;
  reason: string;
  note: string | null;
}

export interface StockRestorationPlan {
  /** Mouvements de vente à supprimer avec leurs commandes. */
  movementIds: string[];
  /** Quantité à rendre au stock, par produit. */
  increments: Record<string, number>;
  /** Ventes impossibles à rattacher à une commande supprimée : le script s'arrête. */
  unmatched: string[];
}

/**
 * Les mouvements de vente n'ont pas de clé étrangère vers Order : la commande
 * n'apparaît que dans la note, sous la forme « Commande <numéro> ». Toute vente
 * qui ne suit pas ce format, ou qui cite une commande absente de la liste, est
 * signalée au lieu d'être devinée.
 *
 * Un autre mouvement qui cite une de ces commandes (« Stornierung <numéro> »
 * après une annulation) a déjà rendu tout ou partie du stock : rétablir la
 * vente en plus compterait deux fois. Il est signalé de la même façon.
 */
export function planStockRestoration(
  movements: readonly StockMovementRow[],
  orderNumbers: readonly string[],
): StockRestorationPlan {
  const numeros = new Set(orderNumbers);
  const plan: StockRestorationPlan = { movementIds: [], increments: {}, unmatched: [] };

  for (const m of movements) {
    if (m.reason !== "verkauf") {
      const mots = m.note?.split(/\s+/) ?? [];
      if (mots.some((mot) => numeros.has(mot))) plan.unmatched.push(m.id);
      continue;
    }
    const numero = /^Commande (\S+)$/.exec(m.note?.trim() ?? "")?.[1];
    if (!numero || !numeros.has(numero)) {
      plan.unmatched.push(m.id);
      continue;
    }
    plan.movementIds.push(m.id);
    plan.increments[m.productId] = (plan.increments[m.productId] ?? 0) - m.delta;
  }

  return plan;
}
