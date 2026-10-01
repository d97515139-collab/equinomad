import { isValidGtin } from "./gtin";

/**
 * Contenu rédigé pour un produit, appliqué en base par son slug.
 * On indexe par slug, pas par SKU : `slug` est `@unique` dans le schéma
 * Prisma, alors que le SKU ne l'est pas (il est dérivé par troncature du
 * slug dans `scripts/seed-bois-variations.ts` et peut entrer en collision).
 */
export interface ProductContent {
  slug: string;
  description: string;
  shortDescription: string;
  descriptionEn: string;
  shortDescriptionEn: string;
  descriptionFr?: string;
  shortDescriptionFr?: string;
  descriptionDe?: string;
  shortDescriptionDe?: string;
  descriptionIt?: string;
  shortDescriptionIt?: string;
  /**
   * Caractéristiques affichées en liste sur la fiche produit (colonne `bullets`).
   * Champ facultatif : une entrée qui ne le porte pas laisse intactes les
   * caractéristiques déjà en base.
   */
  bullets?: string[];
  bulletsEn?: string[];
  bulletsFr?: string[];
  bulletsDe?: string[];
  bulletsIt?: string[];
  /** Écrit seulement si le checksum est valide et la source identifiable. */
  gtin?: string;
  mpn?: string;
  googleProductCategory?: string;
  shippingWeightGrams?: number;
  energyEfficiencyClass?: string;
}

export interface OccasionCopySource {
  slug: string;
  name: string;
  brand: string;
  categorySlug: string;
  categoryLabel: string;
  categoryLabelEn: string;
  description: string;
  bullets: string[];
  province?: string;
}

export interface NewCatalogCopySource {
  slug: string;
  name: string;
  brand: string;
  categorySlug: string;
  categoryLabel: string;
  categoryLabelEn: string;
  shortDescription: string;
  description: string;
  bullets: string[];
}

type ProductLocale = "es" | "en" | "fr" | "de" | "it";

const OCCASION_LOCALES = ["es", "en", "fr", "de", "it"] as const satisfies readonly ProductLocale[];

type FactLabel = Record<ProductLocale, string>;

interface FactDefinition {
  key: string;
  pattern: RegExp;
  sentence: FactLabel;
  bullet?: FactLabel;
}

// Fourchette de longueur des descriptions longues.
//
// Le plafond était fixé à 800 caractères, ce qui produisait des fiches jugées
// trop maigres par le commerçant : à ce format, la description tient les
// caractéristiques techniques et rien d'autre. Il est passé à 2400 pour laisser
// place à ce qui fait vraiment décider un acheteur — quel appareil, quelle
// autonomie, comment stocker, comment choisir entre deux longueurs.
//
// Deuxième passe : le commerçant demande des fiches rédigées en plusieurs
// paragraphes (nature du produit, essence, séchage, usage, stockage). Le
// plafond monte donc à 3800 et le plancher à 1100, pour que la fiche détaillée
// soit la norme et non un cas particulier.
//
// Google Merchant accepte jusqu'à 5 000 caractères : la contrainte est
// éditoriale, pas technique.
const LONGUEUR_MIN = 1100;
const LONGUEUR_MAX = 3800;

/**
 * Nombre de caractéristiques attendues quand le champ est renseigné.
 *
 * Le plafond était de 6, calibré pour une liste d'accroches. Les fiches portent
 * désormais un vrai tableau « intitulé : valeur » (produit, composition,
 * conditionnement, humidité, appareils compatibles, stockage…), dont seules les
 * lignes réellement documentées sont écrites : 16 laisse la place au cas le
 * plus complet sans autoriser une liste fourre-tout.
 *
 * À noter : `src/server/merchant.ts` ne reprend que les 10 premières entrées
 * dans `product_highlights`. Les caractéristiques sont donc rangées de la plus
 * distinctive à la plus accessoire.
 */
const BULLETS_MIN = 3;
const BULLETS_MAX = 16;
/**
 * Une caractéristique reste une étiquette, pas un paragraphe. La borne passe de
 * 90 à 120 caractères : le format « intitulé : valeur » consomme à lui seul une
 * vingtaine de caractères avant la valeur utile.
 */
const BULLET_LONGUEUR_MAX = 120;

// Vocabulaire commercial que Google refuse dans une description : il décrit
// l'offre du marchand, pas le produit. `src/server/merchant.ts` (ligne ~336)
// retombe sur `shortDescription` quand `description` est absente : le champ
// court est une source du flux au même titre, donc soumis au même contrôle.
const MOTS_PROMOTIONNELS = [
  // Français
  "livraison offerte",
  "livraison gratuite",
  "meilleur prix",
  "prix imbattable",
  "promotion",
  "soldes",
  "déstockage",
  "offre spéciale",
  "profitez",
  "commandez",
  // Anglais — mêmes formules commerciales, pour la version /en du site.
  "free delivery",
  "free shipping",
  "best price",
  "lowest price",
  "special offer",
  "order now",
  "buy now",
  "sale",
  "discount",
  "limited time",
  // Allemand
  "kostenloser versand",
  "gratis lieferung",
  "sonderangebot",
  "jetzt bestellen",
  "jetzt kaufen",
  // Italien
  "spedizione gratuita",
  "miglior prezzo",
  "offerta speciale",
  "ordina ora",
  "compra ora",
];

// Reprend la liste utilisée par `src/server/merchant.test.ts` : les deux
// contrôles doivent traquer le même vocabulaire allemand résiduel.
const MOTS_ALLEMANDS = [
  "von",
  "Ausstattung",
  "Zustand",
  "fabrikneu",
  "originalverpackt",
  "Aktion",
  "Beschreibung",
  "Zeichen",
  "Klassifizierung",
  "Versand",
  "Energielabel",
  "Pflichtfelder",
  "Preis",
];

const OCCASION_FACTS: readonly FactDefinition[] = [
  {
    key: "red-plate",
    pattern: /\bmatr[ií]cula roja\b/i,
    sentence: {
      es: "matrícula roja",
      en: "red plate",
      fr: "plaque rouge",
      de: "rotes Kennzeichen",
      it: "targa rossa",
    },
    bullet: {
      es: "Matrícula: Roja",
      en: "Registration: Red plate",
      fr: "Immatriculation : Plaque rouge",
      de: "Zulassung: Rotes Kennzeichen",
      it: "Immatricolazione: Targa rossa",
    },
  },
  {
    key: "white-plate",
    pattern: /\bmatr[ií]cula blanca\b/i,
    sentence: {
      es: "matrícula blanca",
      en: "white plate",
      fr: "plaque blanche",
      de: "weißes Kennzeichen",
      it: "targa bianca",
    },
    bullet: {
      es: "Matrícula: Blanca",
      en: "Registration: White plate",
      fr: "Immatriculation : Plaque blanche",
      de: "Zulassung: Weißes Kennzeichen",
      it: "Immatricolazione: Targa bianca",
    },
  },
  {
    key: "itv",
    pattern: /\bitv\b/i,
    sentence: {
      es: "ITV en vigor",
      en: "valid road inspection",
      fr: "contrôle technique en cours de validité",
      de: "gültige Hauptuntersuchung",
      it: "revisione valida",
    },
    bullet: {
      es: "Documentación: ITV en vigor",
      en: "Documentation: Valid road inspection",
      fr: "Documents : Contrôle technique valide",
      de: "Unterlagen: Gültige Hauptuntersuchung",
      it: "Documenti: Revisione valida",
    },
  },
  {
    key: "camera",
    pattern: /\bc[aá]mara\b/i,
    sentence: {
      es: "instalación de cámara",
      en: "camera system",
      fr: "caméra embarquée",
      de: "Kamerasystem",
      it: "sistema di telecamera",
    },
    bullet: {
      es: "Equipamiento: Cámara",
      en: "Equipment: Camera system",
      fr: "Équipement : Caméra",
      de: "Ausstattung: Kamera",
      it: "Dotazione: Telecamera",
    },
  },
  {
    key: "interior-light",
    pattern: /\bluz interior\b/i,
    sentence: {
      es: "luz interior",
      en: "interior light",
      fr: "éclairage intérieur",
      de: "Innenbeleuchtung",
      it: "luce interna",
    },
    bullet: {
      es: "Equipamiento: Luz interior",
      en: "Equipment: Interior light",
      fr: "Équipement : Lumière intérieure",
      de: "Ausstattung: Innenbeleuchtung",
      it: "Dotazione: Luce interna",
    },
  },
  {
    key: "led-lights",
    pattern: /\bled\b|luces?\s+led/i,
    sentence: {
      es: "luces LED",
      en: "LED lighting",
      fr: "éclairage LED",
      de: "LED-Beleuchtung",
      it: "illuminazione LED",
    },
    bullet: {
      es: "Iluminación: Luces LED",
      en: "Lighting: LED lights",
      fr: "Éclairage : Feux LED",
      de: "Beleuchtung: LED-Leuchten",
      it: "Illuminazione: Luci LED",
    },
  },
  {
    key: "tack-storage",
    pattern: /\bguadarn[eé]s\b|\bmonturer[oa]s?\b/i,
    sentence: {
      es: "espacio de guadarnés",
      en: "tack storage",
      fr: "espace sellerie",
      de: "Sattelkammer",
      it: "vano selleria",
    },
    bullet: {
      es: "Equipamiento: Guadarnés",
      en: "Equipment: Tack storage",
      fr: "Équipement : Sellerie",
      de: "Ausstattung: Sattelkammer",
      it: "Dotazione: Selleria",
    },
  },
  {
    key: "fiberglass",
    pattern: /\bfibra\b/i,
    sentence: {
      es: "acabado de fibra",
      en: "fibreglass bodywork",
      fr: "carrosserie en fibre",
      de: "GFK-Aufbau",
      it: "carrozzeria in vetroresina",
    },
    bullet: {
      es: "Carrocería: Fibra",
      en: "Bodywork: Fibreglass",
      fr: "Carrosserie : Fibre",
      de: "Aufbau: GFK",
      it: "Carrozzeria: Vetroresina",
    },
  },
  {
    key: "new-tyres",
    pattern: /\bru(?:e|é)das?\s+nuevas?\b/i,
    sentence: {
      es: "ruedas renovadas",
      en: "recent tyres",
      fr: "pneus récents",
      de: "erneuerte Bereifung",
      it: "pneumatici recenti",
    },
    bullet: {
      es: "Rodadura: Ruedas renovadas",
      en: "Running gear: Recent tyres",
      fr: "Roulement : Pneus récents",
      de: "Fahrwerk: Bereifung erneuert",
      it: "Rotolamento: Pneumatici recenti",
    },
  },
  {
    key: "aluminium",
    pattern: /\baluminio\b/i,
    sentence: {
      es: "chasis de aluminio",
      en: "aluminium chassis",
      fr: "châssis aluminium",
      de: "Aluminium-Fahrgestell",
      it: "telaio in alluminio",
    },
    bullet: {
      es: "Chasis: Aluminio",
      en: "Chassis: Aluminium",
      fr: "Châssis : Aluminium",
      de: "Fahrgestell: Aluminium",
      it: "Telaio: Alluminio",
    },
  },
  {
    key: "double-axle",
    pattern: /\b2 ejes\b|\bdos ejes\b/i,
    sentence: {
      es: "doble eje",
      en: "twin axle",
      fr: "double essieu",
      de: "Tandemachse",
      it: "doppio asse",
    },
    bullet: {
      es: "Ejes: Doble eje",
      en: "Axles: Twin axle",
      fr: "Essieux : Double essieu",
      de: "Achsen: Tandemachse",
      it: "Assi: Doppio asse",
    },
  },
  {
    key: "braked",
    pattern: /\bfreno\b/i,
    sentence: {
      es: "frenado incorporado",
      en: "braked running gear",
      fr: "freinage intégré",
      de: "gebremstes Fahrwerk",
      it: "frenatura integrata",
    },
    bullet: {
      es: "Frenado: Incorporado",
      en: "Brakes: Fitted",
      fr: "Freinage : Intégré",
      de: "Bremsen: Vorhanden",
      it: "Frenata: Integrata",
    },
  },
  {
    key: "front-door",
    pattern: /\bpuerta delantera\b/i,
    sentence: {
      es: "puerta delantera",
      en: "front access door",
      fr: "porte avant",
      de: "vordere Zugangstür",
      it: "porta anteriore",
    },
    bullet: {
      es: "Acceso: Puerta delantera",
      en: "Access: Front door",
      fr: "Accès : Porte avant",
      de: "Zugang: Vordere Tür",
      it: "Accesso: Porta anteriore",
    },
  },
  {
    key: "rear-ramp",
    pattern: /\brampa\b|\bpuerta trasera\b/i,
    sentence: {
      es: "rampa trasera",
      en: "rear ramp",
      fr: "rampe arrière",
      de: "Heckrampe",
      it: "rampa posteriore",
    },
    bullet: {
      es: "Acceso: Rampa trasera",
      en: "Access: Rear ramp",
      fr: "Accès : Rampe arrière",
      de: "Zugang: Heckrampe",
      it: "Accesso: Rampa posteriore",
    },
  },
  {
    key: "documents",
    pattern: /\bpapeles\b|\bdocumentaci[oó]n en regla\b|\bseguro al d[ií]a\b/i,
    sentence: {
      es: "documentación en regla",
      en: "paperwork in order",
      fr: "documents en règle",
      de: "Unterlagen in Ordnung",
      it: "documenti in regola",
    },
    bullet: {
      es: "Estado legal: Documentación en regla",
      en: "Legal status: Paperwork in order",
      fr: "Statut légal : Documents en règle",
      de: "Rechtsstatus: Unterlagen in Ordnung",
      it: "Stato legale: Documenti in regola",
    },
  },
];

const CATEGORY_LABELS: Record<string, FactLabel> = {
  "un-caballo": {
    es: "Remolques de un caballo de ocasión",
    en: "Used single-horse trailers",
    fr: "Remorques d'occasion pour un cheval",
    de: "Gebrauchte Anhänger für ein Pferd",
    it: "Rimorchi usati per un cavallo",
  },
  "dos-caballos": {
    es: "Remolques de dos caballos de ocasión",
    en: "Used two-horse trailers",
    fr: "Remorques d'occasion pour deux chevaux",
    de: "Gebrauchte Anhänger für zwei Pferde",
    it: "Rimorchi usati per due cavalli",
  },
  "tres-cuatro-caballos": {
    es: "Remolques de tres y cuatro caballos de ocasión",
    en: "Used three- and four-horse trailers",
    fr: "Remorques d'occasion pour trois ou quatre chevaux",
    de: "Gebrauchte Anhänger für drei oder vier Pferde",
    it: "Rimorchi usati per tre o quattro cavalli",
  },
};

const NEW_CATEGORY_LABELS: Record<string, FactLabel> = {
  "un-caballo": {
    es: "Remolques nuevos para un caballo",
    en: "New single-horse trailers",
    fr: "Remorques neuves pour un cheval",
    de: "Neue Anhänger für ein Pferd",
    it: "Rimorchi nuovi per un cavallo",
  },
  "dos-caballos": {
    es: "Remolques nuevos para dos caballos",
    en: "New two-horse trailers",
    fr: "Remorques neuves pour deux chevaux",
    de: "Neue Anhänger für zwei Pferde",
    it: "Rimorchi nuovi per due cavalli",
  },
  "tres-cuatro-caballos": {
    es: "Remolques nuevos para tres y cuatro caballos",
    en: "New three- and four-horse trailers",
    fr: "Remorques neuves pour trois ou quatre chevaux",
    de: "Neue Anhänger für drei oder vier Pferde",
    it: "Rimorchi nuovi per tre o quattro cavalli",
  },
};

const NEW_CAPACITY_BULLETS: Record<string, FactLabel> = {
  "Un caballo, o una yegua con su potro": {
    es: "Un caballo, o una yegua con su potro",
    en: "One horse, or a mare with her foal",
    fr: "Un cheval, ou une jument avec son poulain",
    de: "Ein Pferd oder eine Stute mit ihrem Fohlen",
    it: "Un cavallo, oppure una giumenta con il suo puledro",
  },
  "Un caballo, o un caballo y un potro": {
    es: "Un caballo, o un caballo y un potro",
    en: "One horse, or one horse with a foal",
    fr: "Un cheval, ou un cheval avec un poulain",
    de: "Ein Pferd oder ein Pferd mit Fohlen",
    it: "Un cavallo, oppure un cavallo con un puledro",
  },
  "Dos caballos": {
    es: "Dos caballos",
    en: "Two horses",
    fr: "Deux chevaux",
    de: "Zwei Pferde",
    it: "Due cavalli",
  },
  "Dos caballos, o tres ponis": {
    es: "Dos caballos, o tres ponis",
    en: "Two horses, or three ponies",
    fr: "Deux chevaux, ou trois poneys",
    de: "Zwei Pferde oder drei Ponys",
    it: "Due cavalli, oppure tre pony",
  },
  "Dos caballos y un carruaje": {
    es: "Dos caballos y un carruaje",
    en: "Two horses and one carriage",
    fr: "Deux chevaux et une voiture hippomobile",
    de: "Zwei Pferde und eine Kutsche",
    it: "Due cavalli e una carrozza",
  },
  "Tres caballos": {
    es: "Tres caballos",
    en: "Three horses",
    fr: "Trois chevaux",
    de: "Drei Pferde",
    it: "Tre cavalli",
  },
  "Tres caballos, en transporte oblicuo": {
    es: "Tres caballos, en transporte oblicuo",
    en: "Three horses, in diagonal loading",
    fr: "Trois chevaux, en chargement oblique",
    de: "Drei Pferde in Schrägverladung",
    it: "Tre cavalli, con carico obliquo",
  },
  "Tres caballos, con zona habitable": {
    es: "Tres caballos, con zona habitable",
    en: "Three horses, with living area",
    fr: "Trois chevaux, avec zone habitable",
    de: "Drei Pferde mit Wohnbereich",
    it: "Tre cavalli, con zona abitabile",
  },
  "Cuatro caballos": {
    es: "Cuatro caballos",
    en: "Four horses",
    fr: "Quatre chevaux",
    de: "Vier Pferde",
    it: "Quattro cavalli",
  },
};

const NEW_FEATURE_BULLETS: Record<string, FactLabel> = {
  "Suelo integral de aluminio": {
    es: "Suelo integral de aluminio",
    en: "Full aluminium floor",
    fr: "Plancher intégral en aluminium",
    de: "Vollaluminiumboden",
    it: "Pavimento integrale in alluminio",
  },
  "Goma con listones antideslizantes sobre suelo de aluminio": {
    es: "Goma con listones antideslizantes sobre suelo de aluminio",
    en: "Rubber covering with anti-slip strips over an aluminium floor",
    fr: "Revêtement caoutchouc avec lattes antidérapantes sur plancher aluminium",
    de: "Gummibelag mit Antirutschleisten auf Aluminiumboden",
    it: "Rivestimento in gomma con listelli antiscivolo su pavimento in alluminio",
  },
  "Suelo y paredes de aluminio con goma antideslizante de 8 mm": {
    es: "Suelo y paredes de aluminio con goma antideslizante de 8 mm",
    en: "Aluminium floor and walls with 8 mm anti-slip rubber",
    fr: "Plancher et parois en aluminium avec caoutchouc antidérapant de 8 mm",
    de: "Aluminiumboden und -wände mit 8 mm Antirutschgummi",
    it: "Pavimento e pareti in alluminio con gomma antiscivolo da 8 mm",
  },
  "Poliéster sobre acero galvanizado": {
    es: "Poliéster sobre acero galvanizado",
    en: "Polyester body on galvanized steel",
    fr: "Polyester sur acier galvanisé",
    de: "Polyesteraufbau auf verzinktem Stahl",
    it: "Poliestere su acciaio zincato",
  },
  "Poliéster de una sola pieza": {
    es: "Poliéster de una sola pieza",
    en: "Single-piece polyester body",
    fr: "Polyester monobloc",
    de: "Einteiliger Polyesteraufbau",
    it: "Scocca in poliestere in un solo pezzo",
  },
  "Rampa completa antideslizante": {
    es: "Rampa completa antideslizante",
    en: "Full-width anti-slip ramp",
    fr: "Rampe intégrale antidérapante",
    de: "Durchgehende Antirutschrampe",
    it: "Rampa completa antiscivolo",
  },
  "Rampa completa acolchada": {
    es: "Rampa completa acolchada",
    en: "Full-width padded ramp",
    fr: "Rampe intégrale capitonnée",
    de: "Durchgehende gepolsterte Rampe",
    it: "Rampa completa imbottita",
  },
  "Chasis galvanizado en caliente": {
    es: "Chasis galvanizado en caliente",
    en: "Hot-dip galvanized chassis",
    fr: "Châssis galvanisé à chaud",
    de: "Feuerverzinktes Fahrgestell",
    it: "Telaio zincato a caldo",
  },
  "Suspensión de goma independiente": {
    es: "Suspensión de goma independiente",
    en: "Independent rubber suspension",
    fr: "Suspension indépendante en caoutchouc",
    de: "Unabhängige Gummifederung",
    it: "Sospensione indipendente in gomma",
  },
  "Garantía de chasis 5 años": {
    es: "Garantía de chasis 5 años",
    en: "5-year chassis warranty",
    fr: "Garantie châssis 5 ans",
    de: "5 Jahre Fahrgestellgarantie",
    it: "Garanzia telaio di 5 anni",
  },
  "Carrocería de contrachapado": {
    es: "Carrocería de contrachapado",
    en: "Plywood bodywork",
    fr: "Carrosserie en contreplaqué",
    de: "Aufbau aus Sperrholz",
    it: "Carrozzeria in compensato",
  },
  "Suelo integral de aluminio, chasis WCF": {
    es: "Suelo integral de aluminio, chasis WCF",
    en: "Full aluminium floor with WCF chassis",
    fr: "Plancher intégral en aluminium avec châssis WCF",
    de: "Vollaluminiumboden mit WCF-Fahrgestell",
    it: "Pavimento integrale in alluminio con telaio WCF",
  },
  "Chasis WCF de suspensión independiente": {
    es: "Chasis WCF de suspensión independiente",
    en: "WCF chassis with independent suspension",
    fr: "Châssis WCF à suspension indépendante",
    de: "WCF-Fahrgestell mit Einzelradfederung",
    it: "Telaio WCF con sospensione indipendente",
  },
  "Interior compartimentado, chasis WCF": {
    es: "Interior compartimentado, chasis WCF",
    en: "Partitioned interior with WCF chassis",
    fr: "Intérieur compartimenté avec châssis WCF",
    de: "Unterteilter Innenraum mit WCF-Fahrgestell",
    it: "Interno compartimentato con telaio WCF",
  },
  "Carrocería integral de poliéster, salida lateral, chasis WCF": {
    es: "Carrocería integral de poliéster, salida lateral, chasis WCF",
    en: "Full polyester body, side exit and WCF chassis",
    fr: "Carrosserie intégrale en polyester, sortie latérale et châssis WCF",
    de: "Vollpolyester-Aufbau, Seitenausstieg und WCF-Fahrgestell",
    it: "Carrozzeria integrale in poliestere, uscita laterale e telaio WCF",
  },
  "Espacio de sillas, carrocería de poliéster, chasis WCF": {
    es: "Espacio de sillas, carrocería de poliéster, chasis WCF",
    en: "Saddle area, polyester body and WCF chassis",
    fr: "Espace sellerie, carrosserie polyester et châssis WCF",
    de: "Sattelraum, Polyesteraufbau und WCF-Fahrgestell",
    it: "Spazio selleria, carrozzeria in poliestere e telaio WCF",
  },
};

function compactSpaces(value: string): string {
  return value.replace(/\r\n?/g, "\n").replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n").trim();
}

function dedupe<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function cleanOccasionSourceText(value: string): string {
  return compactSpaces(
    value
      .replace(/\bhttps?:\/\/\S+\b/gi, " ")
      .replace(/\bwww\.\S+\b/gi, " ")
      .replace(/\bmilanuncios\b/gi, " ")
      .replace(/\b(?:tlf|tel[ée]fono|telefono|whatsapp)\s*:?\s*\+?\d[\d .-]{6,}\b/gi, " ")
      .replace(/\+?\d(?:[\d .-]{7,}\d)\b/g, " ")
      .replace(/\bprecio\b[^\n.]*/gi, " ")
      .replace(/\bopcional\b[^\n.]*/gi, " ")
      .replace(/\bse vende\b/gi, " ")
      .replace(/\bvendo\b/gi, " "),
  );
}

function formatDescriptor(categorySlug: string): FactLabel {
  if (categorySlug === "un-caballo") {
    return {
      es: "remolque de ocasión para un caballo",
      en: "used single-horse trailer",
      fr: "remorque d'occasion pour un cheval",
      de: "gebrauchter Pferdeanhänger für ein Pferd",
      it: "rimorchio usato per un cavallo",
    };
  }
  if (categorySlug === "dos-caballos") {
    return {
      es: "van de ocasión para dos caballos",
      en: "used two-horse trailer",
      fr: "van d'occasion pour deux chevaux",
      de: "gebrauchter Pferdeanhänger für zwei Pferde",
      it: "van usato per due cavalli",
    };
  }
  return {
    es: "remolque de ocasión para tres o cuatro caballos",
    en: "used three- or four-horse trailer",
    fr: "remorque d'occasion pour trois ou quatre chevaux",
    de: "gebrauchter Pferdeanhänger für drei oder vier Pferde",
    it: "rimorchio usato per tre o quattro cavalli",
  };
}

function inferOccasionBrand(source: OccasionCopySource): string | null {
  const raw = compactSpaces(source.brand);
  if (raw && !/^sin marca$/i.test(raw)) return raw;

  const text = cleanOccasionSourceText(`${source.name}\n${source.description}`);
  const match = text.match(/\bmarca\s+([A-Z][A-Z0-9.\-]{0,15})\b/i);
  return match ? match[1].trim() : null;
}

function collectOccasionFacts(source: OccasionCopySource): FactDefinition[] {
  const pool = cleanOccasionSourceText([source.description, ...source.bullets].join("\n"));
  return OCCASION_FACTS.filter((fact) => fact.pattern.test(pool));
}

function joinNatural(values: readonly string[], locale: ProductLocale): string {
  if (values.length === 0) return "";
  if (values.length === 1) return values[0];
  const conjunction =
    locale === "es" ? "y" : locale === "fr" ? "et" : locale === "de" ? "und" : locale === "it" ? "e" : "and";
  if (values.length === 2) return `${values[0]} ${conjunction} ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} ${conjunction} ${values.at(-1)}`;
}

function formatNewDescriptor(categorySlug: string): FactLabel {
  if (categorySlug === "un-caballo") {
    return {
      es: "remolque nuevo para un caballo",
      en: "new single-horse trailer",
      fr: "remorque neuve pour un cheval",
      de: "neuer Anhänger für ein Pferd",
      it: "rimorchio nuovo per un cavallo",
    };
  }
  if (categorySlug === "dos-caballos") {
    return {
      es: "remolque nuevo para dos caballos",
      en: "new two-horse trailer",
      fr: "remorque neuve pour deux chevaux",
      de: "neuer Anhänger für zwei Pferde",
      it: "rimorchio nuovo per due cavalli",
    };
  }
  return {
    es: "remolque nuevo para tres o cuatro caballos",
    en: "new three- or four-horse trailer",
    fr: "remorque neuve pour trois ou quatre chevaux",
    de: "neuer Anhänger für drei oder vier Pferde",
    it: "rimorchio nuovo per tre o quattro cavalli",
  };
}

function categoryLabelForNewLocale(source: NewCatalogCopySource): FactLabel {
  const fallback = NEW_CATEGORY_LABELS[source.categorySlug] ?? NEW_CATEGORY_LABELS["tres-cuatro-caballos"];
  return {
    es: source.categoryLabel || fallback.es,
    en: source.categoryLabelEn || fallback.en,
    fr: fallback.fr,
    de: fallback.de,
    it: fallback.it,
  };
}

function newUseCase(categorySlug: string): FactLabel {
  if (categorySlug === "un-caballo") {
    return {
      es: "propietarios que viajan con un solo caballo, visitas veterinarias y salidas regulares de club o concurso",
      en: "owners moving one horse at a time, veterinary visits and regular club or competition journeys",
      fr: "les propriétaires qui transportent un seul cheval, les visites vétérinaires et les sorties régulières de club ou de concours",
      de: "Besitzer mit einem einzelnen Pferd, Fahrten zum Tierarzt und regelmäßige Vereins- oder Turnierwege",
      it: "proprietari che trasportano un solo cavallo, visite veterinarie e spostamenti regolari per circolo o concorso",
    };
  }
  if (categorySlug === "dos-caballos") {
    return {
      es: "cuadras privadas y jinetes que necesitan mover dos plazas con frecuencia",
      en: "private yards and riders who need to move two stalls on a regular basis",
      fr: "les écuries privées et les cavaliers qui déplacent régulièrement deux places",
      de: "private Ställe und Reiter, die regelmäßig zwei Pferde transportieren",
      it: "scuderie private e cavalieri che devono spostare regolarmente due posti",
    };
  }
  return {
    es: "cuadras con varios animales, transporte oblicuo y desplazamientos más estructurados",
    en: "yards carrying several animals, diagonal loading and more structured transport work",
    fr: "les structures qui déplacent plusieurs animaux, en chargement oblique et sur des trajets plus structurés",
    de: "Betriebe mit mehreren Tieren, Schrägverladung und stärker strukturierten Transportwegen",
    it: "strutture con più animali, carico obliquo e spostamenti più strutturati",
  };
}

function lowerFirst(value: string): string {
  if (!value) return value;
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function inlineFact(value: string, locale: ProductLocale): string {
  return locale === "de" ? value : lowerFirst(value);
}

function normalizeBullet(value: string): string {
  return compactSpaces(value.replace(/\s*·\s*/g, " · "));
}

function buildSimpleLocaleRecord(es: string, en: string, fr: string, de: string, it: string): FactLabel {
  return { es, en, fr, de, it };
}

function translateNewBullet(raw: string): FactLabel {
  const bullet = normalizeBullet(raw);

  const capacity = NEW_CAPACITY_BULLETS[bullet];
  if (capacity) return capacity;

  const feature = NEW_FEATURE_BULLETS[bullet];
  if (feature) return feature;

  const weights = bullet.match(/\bMMA\s*(?:de\s*)?([\d.,]+)\s*kg(?:,\s*tara\s*([\d.,]+)\s*kg)?(?:,\s*carga útil\s*([\d.,]+)\s*kg)?/i);
  if (weights) {
    const [, mma, tare, payload] = weights;
    const es = tare && payload ? `MMA ${mma} kg, tara ${tare} kg, carga útil ${payload} kg` : `MMA ${mma} kg`;
    const en = tare && payload ? `GVW ${mma} kg, unladen weight ${tare} kg, payload ${payload} kg` : `GVW ${mma} kg`;
    const fr = tare && payload ? `PTAC : ${mma} kg, tare : ${tare} kg, charge utile : ${payload} kg` : `PTAC : ${mma} kg`;
    const de = tare && payload ? `zGG: ${mma} kg, Leergewicht: ${tare} kg, Nutzlast: ${payload} kg` : `zGG: ${mma} kg`;
    const it = tare && payload ? `MMA: ${mma} kg, tara: ${tare} kg, portata utile: ${payload} kg` : `MMA: ${mma} kg`;
    return buildSimpleLocaleRecord(es, en, fr, de, it);
  }

  const capacityWithMma = bullet.match(/^(\d)\s*caballos?\s*·\s*MMA\s*([\d.,]+)\s*kg$/i);
  if (capacityWithMma) {
    const [, count, mma] = capacityWithMma;
    return buildSimpleLocaleRecord(
      `${count} caballos · MMA ${mma} kg`,
      `${count} horses · GVW ${mma} kg`,
      `${count} chevaux · PTAC ${mma} kg`,
      `${count} Pferde · zGG ${mma} kg`,
      `${count} cavalli · MMA ${mma} kg`,
    );
  }

  const payload = bullet.match(/^Carga útil\s*([\d.,]+)\s*kg$/i);
  if (payload) {
    return buildSimpleLocaleRecord(
      `Carga útil ${payload[1]} kg`,
      `Payload ${payload[1]} kg`,
      `Charge utile ${payload[1]} kg`,
      `Nutzlast ${payload[1]} kg`,
      `Portata utile ${payload[1]} kg`,
    );
  }

  const interior = bullet.match(/^Interior de\s+(.+)$/i);
  if (interior) {
    return buildSimpleLocaleRecord(
      `Interior de ${interior[1]}`,
      `Interior ${interior[1]}`,
      `Intérieur ${interior[1]}`,
      `Innenraum ${interior[1]}`,
      `Interno ${interior[1]}`,
    );
  }

  const permitB96 = bullet.match(/^Permiso B96 con vehículo de hasta\s*([\d.,]+)\s*kg,\s*B\+E hasta\s*([\d.,]+)\s*kg$/i);
  if (permitB96) {
    const [, towingB96, towingBe] = permitB96;
    return buildSimpleLocaleRecord(
      `Permiso B96 con vehículo de hasta ${towingB96} kg, B+E hasta ${towingBe} kg`,
      `B96 licence with a towing vehicle up to ${towingB96} kg, B+E up to ${towingBe} kg`,
      `Permis B96 avec véhicule tracteur jusqu'à ${towingB96} kg, B+E jusqu'à ${towingBe} kg`,
      `Führerschein B96 mit Zugfahrzeug bis ${towingB96} kg, B+E bis ${towingBe} kg`,
      `Patente B96 con veicolo trainante fino a ${towingB96} kg, B+E fino a ${towingBe} kg`,
    );
  }

  const permitB = bullet.match(/^Permiso B con vehículo de hasta\s*([\d.,]+)\s*kg de MMA$/i);
  if (permitB) {
    return buildSimpleLocaleRecord(
      `Permiso B con vehículo de hasta ${permitB[1]} kg de MMA`,
      `Category B licence with a towing vehicle up to ${permitB[1]} kg GVW`,
      `Permis B avec véhicule tracteur jusqu'à ${permitB[1]} kg de PTAC`,
      `Führerschein Klasse B mit Zugfahrzeug bis ${permitB[1]} kg zGG`,
      `Patente B con veicolo trainante fino a ${permitB[1]} kg di MMA`,
    );
  }

  const permitBe = bullet.match(/^Permiso B\+E con vehículo de hasta\s*([\d.,]+)\s*kg de MMA$/i);
  if (permitBe) {
    return buildSimpleLocaleRecord(
      `Permiso B+E con vehículo de hasta ${permitBe[1]} kg de MMA`,
      `B+E licence with a towing vehicle up to ${permitBe[1]} kg GVW`,
      `Permis B+E avec véhicule tracteur jusqu'à ${permitBe[1]} kg de PTAC`,
      `Führerschein B+E mit Zugfahrzeug bis ${permitBe[1]} kg zGG`,
      `Patente B+E con veicolo trainante fino a ${permitBe[1]} kg di MMA`,
    );
  }

  if (/^Carnet B$/i.test(bullet)) {
    return buildSimpleLocaleRecord("Carnet B", "Category B licence", "Permis B", "Führerschein Klasse B", "Patente B");
  }

  if (/^Carnet B\+E$/i.test(bullet)) {
    return buildSimpleLocaleRecord("Carnet B+E", "B+E licence", "Permis B+E", "Führerschein B+E", "Patente B+E");
  }

  return buildSimpleLocaleRecord(bullet, bullet, bullet, bullet, bullet);
}

function fallbackNewBullets(source: NewCatalogCopySource, descriptor: FactLabel): FactLabel[] {
  return [
    {
      es: `Formato: ${descriptor.es}`,
      en: `Format: ${descriptor.en}`,
      fr: `Format : ${descriptor.fr}`,
      de: `Format: ${descriptor.de}`,
      it: `Formato: ${descriptor.it}`,
    },
    {
      es: `Modelo: ${source.brand} ${source.name}`,
      en: `Model: ${source.brand} ${source.name}`,
      fr: `Modèle : ${source.brand} ${source.name}`,
      de: `Modell: ${source.brand} ${source.name}`,
      it: `Modello: ${source.brand} ${source.name}`,
    },
    {
      es: "Estado: Remolque nuevo",
      en: "Condition: New trailer",
      fr: "État : Remorque neuve",
      de: "Zustand: Neuer Anhänger",
      it: "Stato: Rimorchio nuovo",
    },
  ];
}

function weightSummary(text: string): { mma?: string; tare?: string; payload?: string } {
  const compact = normalizeBullet(text);
  const summary: { mma?: string; tare?: string; payload?: string } = {};
  const mma = compact.match(/\bMMA\s*(?:de\s*)?([\d.,]+)\s*kg/i);
  const tare = compact.match(/\btara\s*([\d.,]+)\s*kg/i);
  const payload = compact.match(/\bcarga útil\s*([\d.,]+)\s*kg/i);
  if (mma) summary.mma = mma[1];
  if (tare) summary.tare = tare[1];
  if (payload) summary.payload = payload[1];
  return summary;
}

function dimensionsSummary(text: string): string | undefined {
  const match = normalizeBullet(text).match(/(\d(?:[.,]\d+)?)\s*[×x]\s*(\d(?:[.,]\d+)?)\s*[×x]\s*(\d(?:[.,]\d+)?)\s*m/i);
  return match ? `${match[1]} × ${match[2]} × ${match[3]} m` : undefined;
}

export function buildNewProductCopy(source: NewCatalogCopySource): ProductContent {
  const categoryLabel = categoryLabelForNewLocale(source);
  const descriptor = formatNewDescriptor(source.categorySlug);
  const usage = newUseCase(source.categorySlug);
  const productName = compactSpaces([source.brand, source.name].filter(Boolean).join(" "));
  const translatedBullets = dedupe(source.bullets.map(normalizeBullet).filter(Boolean)).map(translateNewBullet);
  const bullets = translatedBullets.length >= BULLETS_MIN ? translatedBullets : fallbackNewBullets(source, descriptor);
  const combinedText = [source.shortDescription, source.description, ...source.bullets].join("\n");
  const weights = weightSummary(combinedText);
  const dimensions = dimensionsSummary(combinedText);
  const permit = bullets.find((bullet) => /permiso|carnet/i.test(bullet.es));
  const capacity = bullets.find((bullet) => /caballo|caballos|yegua|potro/i.test(bullet.es));
  const features = bullets.filter(
    (bullet) =>
      bullet !== capacity &&
      bullet !== permit &&
      !/\bMMA\b|\bcarga útil\b|Interior de/i.test(bullet.es),
  );
  const primaryFeature = features[0];
  const secondaryFeature = features[1];

  const weightSentence = {
    es:
      weights.mma && weights.payload
        ? `Trabaja con una MMA de ${weights.mma} kg${weights.tare ? `, una tara de ${weights.tare} kg` : ""} y una carga útil de ${weights.payload} kg.`
        : weights.mma
          ? `La MMA declarada para esta configuración es de ${weights.mma} kg.`
          : "La ficha se apoya en una configuración de masas clara para preparar el conjunto tractor con criterio.",
    en:
      weights.mma && weights.payload
        ? `It runs with a ${weights.mma} kg GVW${weights.tare ? `, an unladen weight of ${weights.tare} kg` : ""} and a payload of ${weights.payload} kg.`
        : weights.mma
          ? `Its declared GVW for this configuration is ${weights.mma} kg.`
          : "The page keeps the weight logic explicit so the towing combination can be checked properly.",
    fr:
      weights.mma && weights.payload
        ? `Elle travaille avec un PTAC de ${weights.mma} kg${weights.tare ? `, une tare de ${weights.tare} kg` : ""} et une charge utile de ${weights.payload} kg.`
        : weights.mma
          ? `Le PTAC annoncé pour cette configuration est de ${weights.mma} kg.`
          : "La fiche garde la logique de masses bien lisible pour vérifier correctement le véhicule tracteur.",
    de:
      weights.mma && weights.payload
        ? `Sie fährt mit einem zGG von ${weights.mma} kg${weights.tare ? `, einem Leergewicht von ${weights.tare} kg` : ""} und einer Nutzlast von ${weights.payload} kg.`
        : weights.mma
          ? `Das angegebene zGG dieser Konfiguration liegt bei ${weights.mma} kg.`
          : "Die Seite hält die Gewichtslogik bewusst klar, damit das Zugfahrzeug sauber geprüft werden kann.",
    it:
      weights.mma && weights.payload
        ? `Lavora con una MMA di ${weights.mma} kg${weights.tare ? `, una tara di ${weights.tare} kg` : ""} e una portata utile di ${weights.payload} kg.`
        : weights.mma
          ? `La MMA dichiarata per questa configurazione è di ${weights.mma} kg.`
          : "La scheda mantiene la logica delle masse ben leggibile per controllare correttamente il veicolo trainante.",
  };

  const dimensionSentence = {
    es: dimensions ? `El volumen útil queda organizado en un interior de ${dimensions}.` : "La implantación interior está pensada para cargar, asegurar y descargar con una lectura simple del espacio disponible.",
    en: dimensions ? `The working volume is set out in an interior space of ${dimensions}.` : "The interior layout is presented to make loading, securing and unloading easy to read.",
    fr: dimensions ? `Le volume utile s'organise dans un intérieur de ${dimensions}.` : "L'implantation intérieure est présentée pour rendre le chargement et le déchargement faciles à comprendre.",
    de: dimensions ? `Der nutzbare Raum ist mit einem Innenmaß von ${dimensions} ausgelegt.` : "Die Innenaufteilung wird so beschrieben, dass Be- und Entladen klar einschätzbar bleiben.",
    it: dimensions ? `Il volume utile è organizzato in un interno di ${dimensions}.` : "La disposizione interna è descritta per rendere chiari carico, fissaggio e scarico.",
  };

  const featureSentence = {
    es: primaryFeature ? `En construcción y uso diario, destaca por ${inlineFact(primaryFeature.es, "es")}${secondaryFeature ? ` y por ${inlineFact(secondaryFeature.es, "es")}` : ""}.` : "En uso diario, la configuración prioriza soluciones claras de construcción, acceso y durabilidad.",
    en: primaryFeature ? `In construction and day-to-day use, it stands out with ${inlineFact(primaryFeature.en, "en")}${secondaryFeature ? ` and ${inlineFact(secondaryFeature.en, "en")}` : ""}.` : "In day-to-day use, the configuration focuses on clear construction, access and durability choices.",
    fr: primaryFeature ? `En construction et à l'usage, elle se distingue par ${inlineFact(primaryFeature.fr, "fr")}${secondaryFeature ? ` et par ${inlineFact(secondaryFeature.fr, "fr")}` : ""}.` : "À l'usage, la configuration met l'accent sur des choix lisibles de construction, d'accès et de durabilité.",
    de: primaryFeature ? `In Konstruktion und Alltag fällt sie durch ${inlineFact(primaryFeature.de, "de")}${secondaryFeature ? ` und ${inlineFact(secondaryFeature.de, "de")}` : ""} auf.` : "Im Alltag setzt die Konfiguration auf klar lesbare Lösungen bei Aufbau, Zugang und Haltbarkeit.",
    it: primaryFeature ? `Nella costruzione e nell'uso quotidiano si distingue per ${inlineFact(primaryFeature.it, "it")}${secondaryFeature ? ` e per ${inlineFact(secondaryFeature.it, "it")}` : ""}.` : "Nell'uso quotidiano la configurazione privilegia scelte chiare per costruzione, accesso e durata.",
  };

  const permitSentence = {
    es: permit ? `En documentación de conducción, la referencia queda clara: ${permit.es}.` : "La combinación con el vehículo tractor debe validarse sobre la MMA real del conjunto y el permiso disponible.",
    en: permit ? `For driving documentation, the reference point is explicit: ${permit.en}.` : "The towing combination still needs to be checked against the real GVW of the outfit and the licence held.",
    fr: permit ? `Côté permis, le repère est explicite : ${permit.fr}.` : "Le couple tracteur-remorque doit malgré tout être confirmé selon le PTAC réel de l'ensemble et le permis détenu.",
    de: permit ? `Bei der Führerscheinfrage ist der Bezug eindeutig: ${permit.de}.` : "Die Kombination aus Zugfahrzeug und Anhänger muss dennoch anhand des realen Gesamtgewichts und des Führerscheins geprüft werden.",
    it: permit ? `Sul piano della patente, il riferimento è esplicito: ${permit.it}.` : "La combinazione con il veicolo trainante va comunque verificata sulla MMA reale dell'insieme e sulla patente disponibile.",
  };

  const capacitySentence = {
    es: capacity ? `La lectura de capacidad se centra en ${inlineFact(capacity.es, "es")}.` : `La ficha se orienta a un ${descriptor.es}.`,
    en: capacity ? `Capacity is framed around ${inlineFact(capacity.en, "en")}.` : `The page is framed as a ${descriptor.en}.`,
    fr: capacity ? `La lecture de capacité se concentre sur ${inlineFact(capacity.fr, "fr")}.` : `La fiche est pensée comme une ${descriptor.fr}.`,
    de: capacity ? `Die Kapazitätslogik richtet sich auf ${inlineFact(capacity.de, "de")}.` : `Die Seite ist als ${descriptor.de} aufgebaut.`,
    it: capacity ? `La lettura della capacità ruota intorno a ${inlineFact(capacity.it, "it")}.` : `La scheda è impostata come ${descriptor.it}.`,
  };

  const shortDescription = compactSpaces(
    `En Remolque Caballos, el ${productName} se presenta como ${descriptor.es}${weights.payload ? ` con ${weights.payload} kg de carga útil` : ""}${primaryFeature ? ` y ${inlineFact(primaryFeature.es, "es")}` : ""}.`,
  );
  const shortDescriptionEn = compactSpaces(
    `At Remolque Caballos, the ${productName} is presented as a ${descriptor.en}${weights.payload ? ` with a ${weights.payload} kg payload` : ""}${primaryFeature ? ` and ${inlineFact(primaryFeature.en, "en")}` : ""}.`,
  );
  const shortDescriptionFr = compactSpaces(
    `Chez Remolque Caballos, le ${productName} est présenté comme une ${descriptor.fr}${weights.payload ? ` avec ${weights.payload} kg de charge utile` : ""}${primaryFeature ? ` et ${inlineFact(primaryFeature.fr, "fr")}` : ""}.`,
  );
  const shortDescriptionDe = compactSpaces(
    `Bei Remolque Caballos wird der ${productName} als ${descriptor.de}${weights.payload ? ` mit ${weights.payload} kg Nutzlast` : ""}${primaryFeature ? ` und ${inlineFact(primaryFeature.de, "de")}` : ""} vorgestellt.`,
  );
  const shortDescriptionIt = compactSpaces(
    `Da Remolque Caballos, il ${productName} è presentato come ${descriptor.it}${weights.payload ? ` con ${weights.payload} kg di portata utile` : ""}${primaryFeature ? ` e ${inlineFact(primaryFeature.it, "it")}` : ""}.`,
  );

  const description = [
    `En Remolque Caballos incorporamos el ${productName} dentro de la categoría ${categoryLabel.es.toLowerCase()}. Lo tratamos como una ficha editorial propia del catálogo nuevo, con una lectura pensada para comparar masas homologadas, espacio interior, solución constructiva y uso real sin depender de un texto de fabricante pegado sin contexto.`,
    `${capacitySentence.es} ${weightSentence.es} ${dimensionSentence.es}`,
    `${featureSentence.es} ${permitSentence.es}`,
    `Por planteamiento, este ${descriptor.es} encaja bien en ${usage.es}. La lógica de nuestra ficha no es inflar el discurso comercial, sino dejar ordenados los datos que de verdad cambian la decisión: cuánto puede cargar, qué espacio ofrece, qué material soporta el uso continuo y qué tipo de conjunto tractor exige.`,
    `En Remolque Caballos dejamos esta unidad nueva como una referencia lista para presupuesto, comparación técnica y preparación de entrega. Antes del cierre conviene confirmar configuración exacta, accesorios elegidos y vehículo tractor previsto, pero la base de lectura del producto ya queda estructurada aquí con un tono propio y estable para toda la gama.`,
  ].join("\n\n");

  const descriptionEn = [
    `At Remolque Caballos, the ${productName} sits in the ${categoryLabel.en.toLowerCase()} category. We present it as part of our own new-stock catalogue so the buyer can compare homologated weights, interior room, build solution and real use without relying on pasted manufacturer wording.`,
    `${capacitySentence.en} ${weightSentence.en} ${dimensionSentence.en}`,
    `${featureSentence.en} ${permitSentence.en}`,
    `In practical terms, this ${descriptor.en} fits ${usage.en}. The point of our copy is not to inflate the sales language, but to keep the facts that truly change the buying decision in clear order: how much it carries, how much room it gives, what construction supports repeated use and what kind of towing combination it requires.`,
    `At Remolque Caballos, this new unit is left ready for quotation, technical comparison and delivery preparation. Before the order is closed, the exact configuration, chosen accessories and intended towing vehicle still need to be confirmed, but the product reading base is already structured here with stable in-house wording across the range.`,
  ].join("\n\n");

  const descriptionFr = [
    `Chez Remolque Caballos, le ${productName} prend place dans la catégorie ${categoryLabel.fr.toLowerCase()}. Nous le présentons comme une fiche éditoriale propre à notre catalogue neuf, afin que l'acheteur compare les masses homologuées, l'espace intérieur, la solution constructive et l'usage réel sans dépendre d'un texte fabricant repris tel quel.`,
    `${capacitySentence.fr} ${weightSentence.fr} ${dimensionSentence.fr}`,
    `${featureSentence.fr} ${permitSentence.fr}`,
    `Dans son usage concret, cette ${descriptor.fr} convient bien à ${usage.fr}. La logique de notre rédaction n'est pas de gonfler le discours commercial, mais d'ordonner les points qui font vraiment bouger la décision : ce que la remorque peut charger, l'espace qu'elle offre, le matériau qui tient dans le temps et le type de véhicule tracteur qu'elle appelle.`,
    `Chez Remolque Caballos, cette unité neuve est laissée prête pour devis, comparaison technique et préparation de livraison. Avant la validation finale, il reste utile de confirmer la configuration exacte, les équipements retenus et le véhicule tracteur prévu, mais la base de lecture du produit est déjà structurée ici avec un ton propre et stable pour l'ensemble de la gamme.`,
  ].join("\n\n");

  const descriptionDe = [
    `Bei Remolque Caballos gehört der ${productName} zur Kategorie ${categoryLabel.de.toLowerCase()}. Wir stellen ihn als eigene redaktionelle Seite unseres Neufahrzeug-Katalogs dar, damit Käufer zGG, Innenraum, Konstruktionslösung und reale Nutzung vergleichen können, ohne auf unverändert eingefügten Herstellertext angewiesen zu sein.`,
    `${capacitySentence.de} ${weightSentence.de} ${dimensionSentence.de}`,
    `${featureSentence.de} ${permitSentence.de}`,
    `In der Praxis passt dieser ${descriptor.de} gut zu ${usage.de}. Unsere Beschreibung soll keine Verkaufssprache aufblasen, sondern genau die Punkte sauber ordnen, die die Entscheidung verändern: welche Nutzlast möglich ist, wie viel Raum zur Verfügung steht, welche Bauweise den wiederholten Einsatz trägt und welches Zugfahrzeug sinnvoll dazu passt.`,
    `Bei Remolque Caballos bleibt diese neue Einheit damit bereit für Angebot, technischen Vergleich und Lieferplanung. Vor dem Abschluss sollten exakte Konfiguration, gewählte Ausstattung und vorgesehenes Zugfahrzeug noch bestätigt werden, doch die Produktbasis ist hier bereits mit einer eigenen und stabilen Sprache für das gesamte Sortiment strukturiert.`,
  ].join("\n\n");

  const descriptionIt = [
    `Da Remolque Caballos, il ${productName} rientra nella categoria ${categoryLabel.it.toLowerCase()}. Lo presentiamo come una scheda editoriale propria del nostro catalogo nuovo, così l'acquirente può confrontare masse omologate, spazio interno, soluzione costruttiva e uso reale senza dipendere da un testo di produttore incollato senza contesto.`,
    `${capacitySentence.it} ${weightSentence.it} ${dimensionSentence.it}`,
    `${featureSentence.it} ${permitSentence.it}`,
    `Nell'uso concreto, questo ${descriptor.it} si adatta bene a ${usage.it}. La logica della nostra redazione non è gonfiare il linguaggio commerciale, ma ordinare con chiarezza i punti che cambiano davvero la scelta: quanto può caricare, quale spazio offre, quale materiale sostiene l'uso continuo e quale combinazione di traino richiede.`,
    `Da Remolque Caballos, questa unità nuova resta pronta per preventivo, confronto tecnico e preparazione della consegna. Prima della conferma finale conviene verificare configurazione esatta, accessori scelti e veicolo trainante previsto, ma la base di lettura del prodotto è già strutturata qui con un tono proprietario e stabile per tutta la gamma.`,
  ].join("\n\n");

  return {
    slug: source.slug,
    shortDescription,
    description,
    shortDescriptionEn,
    descriptionEn,
    shortDescriptionFr,
    descriptionFr,
    shortDescriptionDe,
    descriptionDe,
    shortDescriptionIt,
    descriptionIt,
    bullets: bullets.map((bullet) => bullet.es),
    bulletsEn: bullets.map((bullet) => bullet.en),
    bulletsFr: bullets.map((bullet) => bullet.fr),
    bulletsDe: bullets.map((bullet) => bullet.de),
    bulletsIt: bullets.map((bullet) => bullet.it),
  };
}

function inferMmaBullet(source: OccasionCopySource): FactLabel | null {
  const text = cleanOccasionSourceText([source.description, ...source.bullets].join("\n"));
  const match = text.match(/\bMMA\s*[:.]?\s*(\d{3,4})\s*kg\b/i);
  if (!match) return null;
  return {
    es: `MMA: ${match[1]} kg`,
    en: `GVW: ${match[1]} kg`,
    fr: `PTAC : ${match[1]} kg`,
    de: `zGG: ${match[1]} kg`,
    it: `MMA: ${match[1]} kg`,
  };
}

function capacityBulletForCategory(categorySlug: string): FactLabel {
  if (categorySlug === "un-caballo") {
    return {
      es: "Capacidad: 1 caballo",
      en: "Capacity: 1 horse",
      fr: "Capacité : 1 cheval",
      de: "Kapazität: 1 Pferd",
      it: "Capacità: 1 cavallo",
    };
  }
  if (categorySlug === "dos-caballos") {
    return {
      es: "Capacidad: 2 caballos",
      en: "Capacity: 2 horses",
      fr: "Capacité : 2 chevaux",
      de: "Kapazität: 2 Pferde",
      it: "Capacità: 2 cavalli",
    };
  }
  return {
    es: "Capacidad: 3 o 4 caballos",
    en: "Capacity: 3 or 4 horses",
    fr: "Capacité : 3 ou 4 chevaux",
    de: "Kapazität: 3 oder 4 Pferde",
    it: "Capacità: 3 o 4 cavalli",
  };
}

function buildOccasionBullets(
  source: OccasionCopySource,
  descriptor: FactLabel,
  facts: readonly FactDefinition[],
  brand: string | null,
): FactLabel[] {
  const bullets: FactLabel[] = [
    {
      es: `Formato: ${descriptor.es}`,
      en: `Format: ${descriptor.en}`,
      fr: `Format : ${descriptor.fr}`,
      de: `Format: ${descriptor.de}`,
      it: `Formato: ${descriptor.it}`,
    },
    {
      es: "Estado: Unidad de ocasión",
      en: "Condition: Used unit",
      fr: "État : Modèle d'occasion",
      de: "Zustand: Gebrauchte Einheit",
      it: "Stato: Unità usata",
    },
    capacityBulletForCategory(source.categorySlug),
  ];

  if (brand) {
    bullets.push({
      es: `Marca: ${brand}`,
      en: `Brand: ${brand}`,
      fr: `Marque : ${brand}`,
      de: `Marke: ${brand}`,
      it: `Marca: ${brand}`,
    });
  }

  for (const fact of facts) {
    if (!fact.bullet) continue;
    bullets.push(fact.bullet);
  }

  const mma = inferMmaBullet(source);
  if (mma) bullets.push(mma);

  if (source.province?.trim()) {
    bullets.push({
      es: `Zona: ${source.province.trim()}`,
      en: `Area: ${source.province.trim()}`,
      fr: `Zone : ${source.province.trim()}`,
      de: `Region: ${source.province.trim()}`,
      it: `Zona: ${source.province.trim()}`,
    });
  }

  return dedupe(
    bullets.map((bullet) => OCCASION_LOCALES.map((locale) => bullet[locale]).join("|||")),
  ).map((packed) => {
    const [es, en, fr, de, it] = packed.split("|||");
    return { es, en, fr, de, it };
  });
}

function categoryLabelForLocale(source: OccasionCopySource): FactLabel {
  const fallback = CATEGORY_LABELS[source.categorySlug] ?? CATEGORY_LABELS["tres-cuatro-caballos"];
  return {
    es: source.categoryLabel || fallback.es,
    en: source.categoryLabelEn || fallback.en,
    fr: fallback.fr,
    de: fallback.de,
    it: fallback.it,
  };
}

export function buildOccasionCopy(source: OccasionCopySource): ProductContent {
  const descriptor = formatDescriptor(source.categorySlug);
  const categoryLabel = categoryLabelForLocale(source);
  const brand = inferOccasionBrand(source);
  const facts = collectOccasionFacts(source);
  const bullets = buildOccasionBullets(source, descriptor, facts, brand);
  const keyFacts = {
    es: joinNatural(facts.slice(0, 4).map((fact) => fact.sentence.es), "es"),
    en: joinNatural(facts.slice(0, 4).map((fact) => fact.sentence.en), "en"),
    fr: joinNatural(facts.slice(0, 4).map((fact) => fact.sentence.fr), "fr"),
    de: joinNatural(facts.slice(0, 4).map((fact) => fact.sentence.de), "de"),
    it: joinNatural(facts.slice(0, 4).map((fact) => fact.sentence.it), "it"),
  };
  const identity = {
    es: brand ? `${descriptor.es} de marca ${brand}` : descriptor.es,
    en: brand ? `${descriptor.en} by ${brand}` : descriptor.en,
    fr: brand ? `${descriptor.fr} de marque ${brand}` : descriptor.fr,
    de: brand ? `${descriptor.de} von ${brand}` : descriptor.de,
    it: brand ? `${descriptor.it} del marchio ${brand}` : descriptor.it,
  };
  const sourceData = {
    es:
      keyFacts.es ||
      "una base de uso real para transporte ecuestre particular, con lectura clara de la documentación y del equipamiento visible",
    en:
      keyFacts.en ||
      "a practical base for private horse transport, with a clear reading of the paperwork and visible equipment",
    fr:
      keyFacts.fr ||
      "une base concrète pour le transport équestre privé, avec une lecture claire des documents et de l'équipement visible",
    de:
      keyFacts.de ||
      "eine praxistaugliche Basis für den privaten Pferdetransport, mit klar erfassbaren Unterlagen und sichtbarer Ausstattung",
    it:
      keyFacts.it ||
      "una base pratica per il trasporto privato dei cavalli, con una lettura chiara dei documenti e dell'attrezzatura visibile",
  };

  const shortDescription = compactSpaces(
    `En Remolque Caballos incorporamos este ${identity.es} con ${sourceData.es}, reescrito como ficha propia de ocasión para una lectura directa y limpia.`,
  );
  const shortDescriptionEn = compactSpaces(
    `At Remolque Caballos, this ${identity.en} is presented with ${sourceData.en}, rewritten as our own used-stock listing for a clear and tidy reading.`,
  );
  const shortDescriptionFr = compactSpaces(
    `Chez Remolque Caballos, cette ${identity.fr} est présentée avec ${sourceData.fr}, réécrite comme fiche d'occasion de notre propre catalogue pour une lecture claire et directe.`,
  );
  const shortDescriptionDe = compactSpaces(
    `Bei Remolque Caballos wird dieser ${identity.de} mit ${sourceData.de} als eigene Gebrauchtfahrzeug-Seite unseres Katalogs präsentiert, klar neu formuliert und ohne Fremdverweise.`,
  );
  const shortDescriptionIt = compactSpaces(
    `Da Remolque Caballos, questo ${identity.it} è presentato con ${sourceData.it}, riscritto come scheda usato del nostro catalogo per una lettura chiara e ordinata.`,
  );

  const description = [
    `En Remolque Caballos presentamos este ${identity.es} dentro de la categoría ${categoryLabel.es.toLowerCase()}. La ficha se ha reconstruido con un criterio editorial propio para que el comprador vea el producto como parte de nuestra selección de ocasión, sin teléfonos, enlaces ni referencias visibles a portales externos.`,
    `La información útil que retenemos para la decisión de compra se concentra en lo que realmente impacta en el uso diario: ${sourceData.es}. Cuando una unidad usada publica menos detalle que un modelo nuevo, en Remolque Caballos priorizamos precisamente estos puntos porque son los que permiten comparar varias opciones sobre una base homogénea y comprensible.`,
    `Por formato, este ${descriptor.es} encaja bien para transporte particular, salidas de club, entrenamientos y desplazamientos regulares donde se valora un acceso sencillo, una implantación pensada para dos plazas y una lectura rápida del equipamiento disponible. La lógica de la ocasión aquí no es copiar un anuncio ajeno, sino convertir la información dispersa en una ficha comercial coherente y usable para el catálogo.`,
    `Nuestro trabajo en Remolque Caballos consiste en dejar cada unidad de ocasión con un lenguaje estable y profesional. Si la ficha original menciona inspección al día, elementos renovados o equipamiento práctico, esos datos se integran aquí dentro de una redacción limpia, sin llamadas a terceros y sin expresiones improvisadas propias de un anuncio clasificado.`,
    `Esta unidad se publica como parte de la selección de ocasión de Remolque Caballos${source.province?.trim() ? `, con referencia en la zona de ${source.province.trim()}` : ""}. Antes del cierre de venta, la verificación final debe centrarse en el estado general, la documentación disponible y el equipamiento efectivamente entregado, pero la base de lectura ya queda ordenada desde esta ficha propia de catálogo.`,
  ].join("\n\n");

  const descriptionEn = [
    `At Remolque Caballos, this ${identity.en} is published in the ${categoryLabel.en.toLowerCase()} category. The listing has been rebuilt with our own editorial standard so the buyer reads it as part of our used selection, with no phone numbers, links or visible references to outside classified platforms.`,
    `The useful information kept for the buying decision is centred on what matters in day-to-day use: ${sourceData.en}. When a used unit carries less detail than a new model, Remolque Caballos deliberately gives priority to these points because they are the ones that let a buyer compare several trailers on a consistent and readable basis.`,
    `By format, this ${descriptor.en} suits private transport, club outings, training trips and regular journeys where straightforward access, a practical two-horse layout and a clear reading of the available equipment matter more than decorative wording. The point of the used range here is not to mirror somebody else's advert, but to turn scattered source data into a coherent catalogue entry.`,
    `Our role at Remolque Caballos is to leave each used unit with stable, professional copy. If the original listing mentions current inspection status, renewed running gear or day-to-day equipment, those facts are folded into clean wording here, without third-party calls to action and without the rough phrasing typical of a classifieds post.`,
    `This unit is published as part of the Remolque Caballos used selection${source.province?.trim() ? `, referenced in the ${source.province.trim()} area` : ""}. Before the purchase is completed, the final check should still focus on general condition, available paperwork and the equipment actually delivered, but the reading base is already organised here as a proper catalogue page.`,
  ].join("\n\n");

  const descriptionFr = [
    `Chez Remolque Caballos, cette ${identity.fr} est publiée dans la catégorie ${categoryLabel.fr.toLowerCase()}. La fiche a été reconstruite selon notre propre ligne éditoriale afin que l'acheteur la lise comme un produit de notre sélection d'occasion, sans numéros, liens ni références visibles à des plateformes externes.`,
    `Les informations utiles conservées pour la décision d'achat se concentrent sur ce qui compte réellement à l'usage quotidien : ${sourceData.fr}. Lorsqu'une unité d'occasion fournit moins de détails qu'un modèle neuf, Remolque Caballos met volontairement l'accent sur ces points, car ce sont eux qui permettent de comparer plusieurs remorques sur une base homogène et lisible.`,
    `Par son format, cette ${descriptor.fr} convient bien au transport privé, aux sorties de club, aux entraînements et aux déplacements réguliers où l'on recherche un accès simple, une implantation pratique pour deux places et une lecture rapide de l'équipement disponible. La logique de l'occasion ici n'est pas de recopier une annonce tierce, mais de transformer des informations dispersées en une fiche catalogue cohérente et exploitable.`,
    `Notre rôle chez Remolque Caballos consiste à publier chaque unité d'occasion avec un texte stable et professionnel. Si la fiche d'origine mentionne un contrôle technique à jour, des éléments remis en état ou un équipement utile au quotidien, ces données sont intégrées ici dans une rédaction propre, sans appel à un tiers ni formules improvisées typiques d'une petite annonce.`,
    `Cette unité est présentée comme faisant partie de la sélection d'occasion de Remolque Caballos${source.province?.trim() ? `, avec une référence dans la zone de ${source.province.trim()}` : ""}. Avant la conclusion de la vente, la vérification finale doit toujours porter sur l'état général, les documents disponibles et l'équipement effectivement livré, mais la base de lecture est déjà ordonnée ici comme sur une véritable fiche catalogue.`,
  ].join("\n\n");

  const descriptionDe = [
    `Bei Remolque Caballos wird dieser ${identity.de} in der Kategorie ${categoryLabel.de.toLowerCase()} geführt. Die Seite wurde nach unserem eigenen redaktionellen Standard neu aufgebaut, damit der Käufer das Produkt als Teil unserer Gebraucht-Auswahl liest, ohne Telefonnummern, Links oder sichtbare Hinweise auf fremde Kleinanzeigenportale.`,
    `Für die Kaufentscheidung behalten wir nur die Informationen bei, die im Alltag wirklich relevant sind: ${sourceData.de}. Wenn eine gebrauchte Einheit weniger Details liefert als ein Neumodell, legt Remolque Caballos genau auf diese Punkte Wert, weil sie einen sauberen und verständlichen Vergleich mehrerer Anhänger ermöglichen.`,
    `Vom Format her passt dieser ${descriptor.de} gut zu privatem Transport, Vereinsfahrten, Trainingsterminen und regelmäßigen Strecken, bei denen ein einfacher Zugang, eine praxistaugliche Zwei-Pferde-Aufteilung und eine schnelle Übersicht über die Ausstattung wichtiger sind als dekorative Formulierungen. Der Sinn der Gebrauchtkategorie besteht hier nicht darin, ein fremdes Inserat zu spiegeln, sondern verstreute Angaben in einen stimmigen Katalogeintrag zu verwandeln.`,
    `Unsere Aufgabe bei Remolque Caballos ist es, jede Gebraucht-Einheit mit einer stabilen und professionellen Beschreibung zu versehen. Wenn das Ausgangsinserat eine gültige Prüfung, erneuerte Komponenten oder nützliche Ausstattung erwähnt, werden diese Fakten hier in klare Formulierungen überführt, ohne Fremdaufrufe und ohne die improvisierte Sprache typischer Kleinanzeigen.`,
    `Diese Einheit wird als Teil der Gebraucht-Auswahl von Remolque Caballos veröffentlicht${source.province?.trim() ? `, mit Bezug auf die Region ${source.province.trim()}` : ""}. Vor dem Verkaufsabschluss sollte die endgültige Kontrolle weiterhin auf Allgemeinzustand, vorhandene Unterlagen und tatsächlich mitgelieferte Ausstattung gerichtet sein, doch die Lesebasis ist hier bereits wie auf einer sauberen Katalogseite geordnet.`,
  ].join("\n\n");

  const descriptionIt = [
    `Da Remolque Caballos, questo ${identity.it} è pubblicato nella categoria ${categoryLabel.it.toLowerCase()}. La scheda è stata ricostruita secondo il nostro standard editoriale in modo che l'acquirente la legga come parte della nostra selezione usato, senza numeri di telefono, link o riferimenti visibili a portali esterni di annunci.`,
    `Le informazioni utili che manteniamo per la decisione d'acquisto si concentrano su ciò che conta davvero nell'uso quotidiano: ${sourceData.it}. Quando un'unità usata offre meno dettagli di un modello nuovo, Remolque Caballos dà volontariamente priorità a questi punti perché sono quelli che permettono di confrontare più rimorchi su una base coerente e leggibile.`,
    `Per formato, questo ${descriptor.it} si adatta bene al trasporto privato, alle uscite di circolo, agli allenamenti e agli spostamenti regolari in cui contano un accesso semplice, una disposizione pratica per due posti e una lettura rapida dell'attrezzatura disponibile. La logica dell'usato qui non è copiare un annuncio di terzi, ma trasformare dati dispersi in una scheda catalogo coerente e utilizzabile.`,
    `Il nostro lavoro in Remolque Caballos consiste nel pubblicare ogni unità usata con un testo stabile e professionale. Se la scheda originale cita revisione valida, componenti rinnovati o dotazioni utili nell'uso quotidiano, questi dati vengono integrati qui in una redazione pulita, senza richiami a terzi e senza il linguaggio improvvisato tipico degli annunci classificati.`,
    `Questa unità viene pubblicata come parte della selezione usato di Remolque Caballos${source.province?.trim() ? `, con riferimento alla zona di ${source.province.trim()}` : ""}. Prima della chiusura della vendita, la verifica finale deve comunque concentrarsi sulle condizioni generali, sui documenti disponibili e sulle dotazioni effettivamente consegnate, ma la base di lettura è già ordinata qui come in una vera scheda catalogo.`,
  ].join("\n\n");

  return {
    slug: source.slug,
    shortDescription,
    description,
    shortDescriptionEn,
    descriptionEn,
    shortDescriptionFr,
    descriptionFr,
    shortDescriptionDe,
    descriptionDe,
    shortDescriptionIt,
    descriptionIt,
    bullets: bullets.map((bullet) => bullet.es),
    bulletsEn: bullets.map((bullet) => bullet.en),
    bulletsFr: bullets.map((bullet) => bullet.fr),
    bulletsDe: bullets.map((bullet) => bullet.de),
    bulletsIt: bullets.map((bullet) => bullet.it),
  };
}

/**
 * Contrôle commun HTML / vocabulaire promotionnel / mots allemands, partagé
 * entre les champs longs et les champs courts.
 *
 * `mot` est cherché par mot entier (`\b...\b`), pas par sous-chaîne : un
 * terme anglais comme « sale » ne doit pas se déclencher sur « wholesale »,
 * un scénario réel avec la liste anglaise ajoutée ci-dessus. La casse est
 * ignorée (drapeau `i`) pour les deux listes : le vocabulaire allemand doit
 * être détecté aussi bien en début de phrase (« Ausstattung ») qu'ailleurs
 * (« ausstattung »), exactement comme le fait déjà le contrôle promotionnel.
 */
function controleContenu(
  ou: string,
  champ: string,
  texte: string,
  locale: ProductLocale,
  anomalies: string[],
): void {
  if (/<[a-z/][^>]*>/i.test(texte)) {
    anomalies.push(`${ou} ${champ} contient du HTML`);
  }
  const promo = MOTS_PROMOTIONNELS.find((mot) => new RegExp(`\\b${mot}\\b`, "i").test(texte));
  if (promo) {
    anomalies.push(`${ou} ${champ} contient le terme promotionnel « ${promo} »`);
  }
  if (locale !== "de") {
    const allemand = MOTS_ALLEMANDS.find((mot) => new RegExp(`\\b${mot}\\b`, "i").test(texte));
    if (allemand) {
      anomalies.push(`${ou} ${champ} contient le mot allemand « ${allemand} »`);
    }
  }
}

function readLocaleFields(entry: ProductContent, locale: ProductLocale) {
  switch (locale) {
    case "es":
      return {
        descriptionField: "description",
        shortField: "shortDescription",
        bulletsField: "bullets",
        description: entry.description,
        shortDescription: entry.shortDescription,
        bullets: entry.bullets,
      };
    case "en":
      return {
        descriptionField: "descriptionEn",
        shortField: "shortDescriptionEn",
        bulletsField: "bulletsEn",
        description: entry.descriptionEn,
        shortDescription: entry.shortDescriptionEn,
        bullets: entry.bulletsEn,
      };
    case "fr":
      return {
        descriptionField: "descriptionFr",
        shortField: "shortDescriptionFr",
        bulletsField: "bulletsFr",
        description: entry.descriptionFr,
        shortDescription: entry.shortDescriptionFr,
        bullets: entry.bulletsFr,
      };
    case "de":
      return {
        descriptionField: "descriptionDe",
        shortField: "shortDescriptionDe",
        bulletsField: "bulletsDe",
        description: entry.descriptionDe,
        shortDescription: entry.shortDescriptionDe,
        bullets: entry.bulletsDe,
      };
    case "it":
      return {
        descriptionField: "descriptionIt",
        shortField: "shortDescriptionIt",
        bulletsField: "bulletsIt",
        description: entry.descriptionIt,
        shortDescription: entry.shortDescriptionIt,
        bullets: entry.bulletsIt,
      };
  }
}

/**
 * Contrôle la conformité du contenu avant écriture. Rend la liste des anomalies,
 * vide si tout est conforme. Ne lève pas : l'appelant décide quoi en faire.
 */
export function validateProductContent(entries: ProductContent[]): string[] {
  const anomalies: string[] = [];
  const vus = new Set<string>();
  const gtinsVus = new Set<string>();
  const mpnsVus = new Set<string>();

  for (const entry of entries) {
    const ou = `[${entry.slug}]`;
    const anyBulletsProvided =
      entry.bullets !== undefined ||
      entry.bulletsEn !== undefined ||
      entry.bulletsFr !== undefined ||
      entry.bulletsDe !== undefined ||
      entry.bulletsIt !== undefined;

    if (vus.has(entry.slug)) anomalies.push(`${ou} slug en double`);
    vus.add(entry.slug);

    const baseBullets = entry.bullets;

    for (const locale of OCCASION_LOCALES) {
      const fields = readLocaleFields(entry, locale);
      const required = locale === "es" || locale === "en";
      const hasAny =
        required ||
        Boolean(
          fields.description?.trim() ||
            fields.shortDescription?.trim() ||
            (fields.bullets && fields.bullets.length > 0),
        );

      if (!hasAny) continue;

      if (!fields.description?.trim()) {
        anomalies.push(`${ou} ${fields.descriptionField} est vide`);
      } else {
        if (fields.description.length < LONGUEUR_MIN) {
          anomalies.push(
            `${ou} ${fields.descriptionField} fait ${fields.description.length} caractères, minimum ${LONGUEUR_MIN}`,
          );
        }
        if (fields.description.length > LONGUEUR_MAX) {
          anomalies.push(
            `${ou} ${fields.descriptionField} fait ${fields.description.length} caractères, maximum ${LONGUEUR_MAX}`,
          );
        }
        controleContenu(ou, fields.descriptionField, fields.description, locale, anomalies);
      }

      if (!fields.shortDescription?.trim()) {
        anomalies.push(`${ou} ${fields.shortField} est vide`);
      } else {
        controleContenu(ou, fields.shortField, fields.shortDescription, locale, anomalies);
      }

      if (fields.description?.trim() && fields.shortDescription?.trim() && fields.description.trim() === fields.shortDescription.trim()) {
        anomalies.push(`${ou} ${fields.descriptionField} identique à ${fields.shortField}`);
      }

      if (!anyBulletsProvided) continue;

      if (!fields.bullets || fields.bullets.length === 0) {
        anomalies.push(`${ou} ${fields.bulletsField} est absent alors qu'une autre langue est renseignée`);
        continue;
      }
      if (fields.bullets.length < BULLETS_MIN || fields.bullets.length > BULLETS_MAX) {
        anomalies.push(
          `${ou} ${fields.bulletsField} compte ${fields.bullets.length} entrées, attendu entre ${BULLETS_MIN} et ${BULLETS_MAX}`,
        );
      }
      for (const texte of fields.bullets) {
        if (!texte.trim()) {
          anomalies.push(`${ou} ${fields.bulletsField} contient une entrée vide`);
          continue;
        }
        if (texte.length > BULLET_LONGUEUR_MAX) {
          anomalies.push(
            `${ou} ${fields.bulletsField} : « ${texte.slice(0, 40)}… » fait ${texte.length} caractères, maximum ${BULLET_LONGUEUR_MAX}`,
          );
        }
        controleContenu(ou, fields.bulletsField, texte, locale, anomalies);
      }
      if (baseBullets && fields.bullets && locale !== "es" && baseBullets.length !== fields.bullets.length) {
        anomalies.push(
          `${ou} bullets (${baseBullets.length}) et ${fields.bulletsField} (${fields.bullets.length}) n'ont pas le même nombre d'entrées`,
        );
      }
    }

    if (entry.gtin !== undefined) {
      if (!isValidGtin(entry.gtin)) {
        anomalies.push(`${ou} GTIN « ${entry.gtin} » : checksum invalide`);
      } else if (gtinsVus.has(entry.gtin)) {
        anomalies.push(`${ou} GTIN « ${entry.gtin} » en double`);
      }
      gtinsVus.add(entry.gtin);
    }

    if (entry.mpn !== undefined && entry.mpn.trim()) {
      if (mpnsVus.has(entry.mpn)) {
        anomalies.push(`${ou} MPN « ${entry.mpn} » en double`);
      }
      mpnsVus.add(entry.mpn);
    }
  }

  return anomalies;
}
