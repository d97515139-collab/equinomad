import { slugify } from "./slugify";

export interface ParsedOccasionCard {
  id: string;
  source: "equirodi" | "truckscout24";
  sourceRef: string;
  title: string;
  brand: string;
  priceEuros: number;
  year?: number;
  condition: string;
  countryEs: string;
  sellerType: string;
  imageUrls: string[];
}

interface ModelAlias {
  readonly brand: string;
  readonly modelKey: string;
  readonly displayName: string;
  readonly aliases: readonly string[];
}

const MODEL_ALIASES: readonly ModelAlias[] = [
  { brand: "Cheval Liberté", modelKey: "cl-maxi-3-living", displayName: "Maxi 3 Living", aliases: ["maxi 3 living"] },
  { brand: "Cheval Liberté", modelKey: "cl-gold-one-origins", displayName: "Gold One Origins", aliases: ["gold one origins", "gold origins one"] },
  { brand: "Cheval Liberté", modelKey: "cl-gold-origins", displayName: "Gold Origins", aliases: ["gold origins aluline", "gold origins"] },
  { brand: "Cheval Liberté", modelKey: "cl-gold-touring-country", displayName: "Touring Country", aliases: ["gold touring country", "touring country"] },
  { brand: "Cheval Liberté", modelKey: "cl-gold-touring-jumping", displayName: "Gold Touring Jumping", aliases: ["gold touring jumping", "touring jumping"] },
  { brand: "Cheval Liberté", modelKey: "cl-gold-touring-one", displayName: "Touring One", aliases: ["gold touring one", "touring one"] },
  { brand: "Cheval Liberté", modelKey: "cl-gold-3", displayName: "Gold 3", aliases: ["gold 3", "gold3"] },
  { brand: "Cheval Liberté", modelKey: "cl-gold-marathon", displayName: "Gold Marathon", aliases: ["gold marathon", "marathon"] },
  { brand: "Cheval Liberté", modelKey: "cl-touring-xl", displayName: "Touring XL", aliases: ["touring xl"] },
  { brand: "Cheval Liberté", modelKey: "cl-maxi-2", displayName: "Maxi 2", aliases: ["maxi 2", "duomax"] },
  { brand: "Cheval Liberté", modelKey: "cl-multimax", displayName: "Multimax", aliases: ["multimax"] },
  { brand: "Cheval Liberté", modelKey: "cl-maxi-4", displayName: "Maxi 4", aliases: ["optimax", "maxi 4"] },
  { brand: "Cheval Liberté", modelKey: "cl-maxi-3", displayName: "Minimax", aliases: ["minimax", "maxi 3"] },

  { brand: "Böckmann", modelKey: "bk-champion-esprit", displayName: "Champion Esprit", aliases: ["champion esprit"] },
  { brand: "Böckmann", modelKey: "bk-champion-c", displayName: "Champion C", aliases: ["champion c"] },
  { brand: "Böckmann", modelKey: "bk-champion-r", displayName: "Champion R", aliases: ["champion r"] },
  { brand: "Böckmann", modelKey: "bk-big-champion-e", displayName: "Big Champion E", aliases: ["big champion e"] },
  { brand: "Böckmann", modelKey: "bk-big-champion-ska", displayName: "Big Champion SKA", aliases: ["big champion ska"] },
  { brand: "Böckmann", modelKey: "bk-duo-r", displayName: "Duo R", aliases: ["duo r"] },
  { brand: "Böckmann", modelKey: "bk-duo-esprit", displayName: "Duo", aliases: ["duo esprit", " duo "] },
  { brand: "Böckmann", modelKey: "bk-comfort", displayName: "Comfort", aliases: ["comfort"] },
  { brand: "Böckmann", modelKey: "bk-big-master", displayName: "Big Master", aliases: ["big master"] },
  { brand: "Böckmann", modelKey: "bk-master", displayName: "Master", aliases: ["master"] },
  { brand: "Böckmann", modelKey: "bk-portax-l-ska", displayName: "Portax L SKA", aliases: ["portax l ska"] },
  { brand: "Böckmann", modelKey: "bk-portax-k", displayName: "Portax K", aliases: ["portax k"] },
  { brand: "Böckmann", modelKey: "bk-portax-e-ska", displayName: "Portax E", aliases: ["portax e", "portax ska"] },

  { brand: "Ifor Williams", modelKey: "iw-hb610", displayName: "HB610", aliases: ["hb610"] },
  { brand: "Ifor Williams", modelKey: "iw-hb511", displayName: "HB511", aliases: ["hb511"] },
  { brand: "Ifor Williams", modelKey: "iw-hb506", displayName: "HB506", aliases: ["hb506", "hbx 506"] },
  { brand: "Ifor Williams", modelKey: "iw-hb403", displayName: "HB403", aliases: ["hb403"] },

  { brand: "Humbaur", modelKey: "hb-notos-xtra-up", displayName: "Notos Xtra Up", aliases: ["notos xtra up"] },
  { brand: "Humbaur", modelKey: "hb-notos-xtra-pro", displayName: "Notos Xtra Pro", aliases: ["notos xtra pro", "notos"] },
  { brand: "Humbaur", modelKey: "hb-xanthos-aero-2700", displayName: "Xanthos Aero 2700", aliases: ["xanthos aero 2700"] },
  { brand: "Humbaur", modelKey: "hb-xanthos-aero-2400", displayName: "Xanthos Aero 2400", aliases: ["xanthos aero 2400", "xanthos aero"] },

  { brand: "Fautras", modelKey: "ft-provan-premium", displayName: "Provan Premium", aliases: ["provan premium"] },
  { brand: "Fautras", modelKey: "ft-oblic-x3", displayName: "Oblic X3", aliases: ["oblic x3"] },
  { brand: "Fautras", modelKey: "ft-oblic-x2", displayName: "Oblic X2", aliases: ["oblic x2"] },
];

const COUNTRY_ENGLISH: Readonly<Record<string, string>> = {
  Alemania: "Germany",
  Austria: "Austria",
  Bélgica: "Belgium",
  Benelux: "Benelux",
  Croacia: "Croatia",
  Dinamarca: "Denmark",
  España: "Spain",
  Francia: "France",
  Irlanda: "Ireland",
  Italia: "Italy",
  Países: "Netherlands",
  "Países Bajos": "Netherlands",
  Polonia: "Poland",
  Portugal: "Portugal",
  Reino: "United Kingdom",
  "Reino Unido": "United Kingdom",
  República: "Czech Republic",
  "República Checa": "Czech Republic",
  Suiza: "Switzerland",
};

const CANONICAL_BRANDS: ReadonlyArray<{ normalized: string; canonical: string }> = [
  { normalized: "bockmann", canonical: "Böckmann" },
  { normalized: "boeckmann", canonical: "Böckmann" },
  { normalized: "cheval liberte", canonical: "Cheval Liberté" },
  { normalized: "fautras", canonical: "Fautras" },
  { normalized: "humbaur", canonical: "Humbaur" },
  { normalized: "ifor williams", canonical: "Ifor Williams" },
];

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&eacute;/g, "é")
    .replace(/&egrave;/g, "è")
    .replace(/&ecirc;/g, "ê")
    .replace(/&aacute;/g, "á")
    .replace(/&agrave;/g, "à")
    .replace(/&iacute;/g, "í")
    .replace(/&oacute;/g, "ó")
    .replace(/&uacute;/g, "ú")
    .replace(/&uuml;/g, "ü")
    .replace(/&ouml;/g, "ö")
    .replace(/&auml;/g, "ä")
    .replace(/&szlig;/g, "ß")
    .replace(/&ntilde;/g, "ñ")
    .replace(/&#(\d+);/g, (_m, digits) => String.fromCharCode(Number(digits)));
}

function stripTags(value: string): string {
  return decodeEntities(value.replace(/<[^>]+>/g, " "));
}

function cleanText(value: string): string {
  return stripTags(value).replace(/\s+/g, " ").trim();
}

function normalize(value: string): string {
  return cleanText(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function absolutize(url: string, origin: string): string {
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (trimmed.startsWith("/")) return `${origin}${trimmed}`;
  return `${origin}/${trimmed.replace(/^\/+/, "")}`;
}

function uniqueUrls(urls: readonly string[]): string[] {
  const cleaned = urls.map((url) => url.trim()).filter(Boolean);
  return [...new Set(cleaned)];
}

export function parseEuroAmount(value: string): number | null {
  const match = value.match(/\d[\d.\s]*(?:,\d+)?/);
  if (!match) return null;
  const normalized = match[0].replace(/\s+/g, "").replace(/\./g, "").replace(/,\d+$/, "");
  const euros = Number.parseInt(normalized, 10);
  return Number.isFinite(euros) && euros > 0 ? euros : null;
}

export function parseYear(value: string): number | undefined {
  const match = value.match(/\b(19\d{2}|20\d{2})\b/);
  if (!match) return undefined;
  const year = Number.parseInt(match[1], 10);
  return year >= 1900 && year <= 2100 ? year : undefined;
}

export function countryToEnglish(countryEs: string): string {
  return COUNTRY_ENGLISH[cleanText(countryEs)] ?? cleanText(countryEs);
}

export function canonicalBrand(value: string): string {
  const normalized = normalize(value);
  return CANONICAL_BRANDS.find((entry) => entry.normalized === normalized)?.canonical ?? cleanText(value);
}

export function buildOccasionSlug(
  source: "eq" | "ts",
  id: string,
  brand: string,
  title: string,
): string {
  const base = slugify(`${brand}-${title}`).slice(0, 64) || "anuncio";
  return `oc-${source}-${base}-${id}`;
}

export function isSecondHandCondition(condition: string): boolean {
  const normalized = normalize(condition);
  if (!normalized) return false;
  if (normalized.includes("de segunda mano")) return true;
  if (normalized.startsWith("usado")) return true;
  if (normalized.startsWith("como nuevo")) return true;
  return false;
}

export interface OccasionModelMatch {
  modelKey: string;
  displayName: string;
}

export function findOccasionModel(brand: string, title: string): OccasionModelMatch | null {
  const normalizedBrand = normalize(brand);
  const normalizedTitle = ` ${normalize(title)} `;
  const matches = MODEL_ALIASES.filter((entry) => normalize(entry.brand) === normalizedBrand)
    .flatMap((entry) =>
      entry.aliases
        .map((alias) => normalize(alias))
        .filter((alias) => normalizedTitle.includes(` ${alias} `))
        .map((alias) => ({ entry, aliasLength: alias.length })),
    )
    .sort((left, right) => right.aliasLength - left.aliasLength);

  const best = matches[0];
  return best ? { modelKey: best.entry.modelKey, displayName: best.entry.displayName } : null;
}

export function parseEquirodiCard(block: string): ParsedOccasionCard | null {
  const id = block.match(/data-adlisting='(\d+)'/)?.[1];
  const href =
    block.match(/<a class='display_search'[^>]*href=(?:'([^']+)'|"([^"]+)"|([^\s>]+))/)?.slice(1).find(Boolean) ??
    "";
  const title = cleanText(block.match(/<h2>([\s\S]*?)<\/h2>/)?.[1] ?? "");
  const price = parseEuroAmount(block.match(/<div class='price'[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? "");
  const meta =
    block
      .match(/<ul class='content'>([\s\S]*?)<\/ul>/)?.[1]
      ?.match(/<li>([\s\S]*?)<\/li>/g)
      ?.map((item) => cleanText(item)) ?? [];
  const brand = canonicalBrand(meta[1] ?? "");
  const year = parseYear(meta[2] ?? title);
  const condition = meta[3] ?? "";
  const locationMatches = [...block.matchAll(/<div class='location'>\s*([^<]*)\s*<\/div>/g)]
    .map((match) => cleanText(match[1]))
    .filter(Boolean);
  const countryEs = locationMatches[0] ?? "";
  const sellerType = cleanText(block.match(/<div class='type-annonce'>\s*([^<]+?)\s*<\/div>/)?.[1] ?? "");
  const imageUrl = block.match(/<img class="thumb lazyload"[^>]*src="([^"]+)"/)?.[1] ?? "";

  if (!id || !href || !title || !price || !brand || !condition || !countryEs || !imageUrl) return null;

  return {
    id,
    source: "equirodi",
    sourceRef: absolutize(href, "https://www.equirodi.es"),
    title,
    brand,
    priceEuros: price,
    ...(year ? { year } : {}),
    condition,
    countryEs,
    sellerType,
    imageUrls: uniqueUrls([absolutize(imageUrl, "https://www.equirodi.es")]),
  };
}

export function parseTruckScoutCard(block: string): ParsedOccasionCard | null {
  const id = block.match(/data-listing-id="(\d+)"/)?.[1];
  const href = block.match(/href="(\/tsp\/ts-[^"]+)"/)?.[1] ?? "";
  const titleMatch = block.match(
    /<h2[^>]*>[\s\S]*?<span class="me-1">([\s\S]*?)<\/span><span>([\s\S]*?)<\/span><\/h2>/,
  );
  const brand = canonicalBrand(titleMatch?.[1] ?? "");
  const modelTitle = cleanText(titleMatch?.[2] ?? "");
  const price = parseEuroAmount(block.match(/<div class="text-dark h4[\s\S]*?<span>\s*([\s\S]*?)\s*<\/span>/)?.[1] ?? "");
  const countryEs = cleanText(
    block.match(/class="flag24 [^"]+"[\s\S]*?title="([^"]+)"/)?.[1] ??
      block.match(/class="flag24 [^"]+"[\s\S]*?alt="([^"]+)"/)?.[1] ??
      "",
  );
  const preview =
    block.match(
      /description-preview[^>]*>([\s\S]*?)<\/div>\s*<div class="collapse long-description[^"]* description-content"/,
    )?.[1] ?? "";
  const condition = cleanText(preview.match(/Estado:\s*<b>([\s\S]*?)<\/b>/)?.[1] ?? "");
  const year =
    parseYear(preview.match(/Año de fabricación:\s*<b>(\d{4})<\/b>/)?.[1] ?? "") ??
    parseYear(preview.match(/Primera matriculación:\s*(?:<b>)?[\d.]*?(\d{4})/i)?.[1] ?? "") ??
    parseYear(modelTitle);
  const images = uniqueUrls(
    [...block.matchAll(/(?:src|data-src)="(https:\/\/cdn\.truckscout24\.com\/data\/listing\/img\/vga\/[^"]+)"/g)].map(
      (match) => match[1],
    ),
  );

  if (!id || !href || !brand || !modelTitle || !price || !countryEs || !condition || images.length === 0) {
    return null;
  }

  return {
    id,
    source: "truckscout24",
    sourceRef: absolutize(href, "https://www.truckscout24.es"),
    title: `${brand} ${modelTitle}`.trim(),
    brand,
    priceEuros: price,
    ...(year ? { year } : {}),
    condition,
    countryEs,
    sellerType: "Profesional",
    imageUrls: images,
  };
}
