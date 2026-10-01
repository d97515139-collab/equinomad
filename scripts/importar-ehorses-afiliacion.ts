/**
 * Importe les annonces de remorques ehorses comme offres affiliées.
 *
 * Essai à blanc :
 *   node --env-file=.env.local --import tsx scripts/importar-ehorses-afiliacion.ts
 * Écriture :
 *   node --env-file=.env.local --import tsx scripts/importar-ehorses-afiliacion.ts --ejecutar
 */
import { prisma } from "../src/server/prisma";
import { slugify } from "../src/lib/slugify";

const EJECUTAR = process.argv.includes("--ejecutar");
const BASE = "https://www.ehorses.es/search?sub=kleinanzeigen&categorybyname=%2Fcarros-y-vehiculos%2Fremolque-para-caballos&inserate=48";
const GOOGLE_REMOLQUE = "Vehículos y piezas > Vehículos > Vehículos de motor > Remolques";
const HEADERS = {
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36",
  "accept-language": "es-ES,es;q=0.9,en;q=0.7",
};

interface Listing {
  id: string;
  url: string;
  title: string;
  category: string;
  condition: "new" | "used";
  priceCents: number;
  country: string;
  city: string;
  images: string[];
}

function clean(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function euroCents(value: string): number | null {
  const match = clean(value).match(/(\d[\d.]*)\s*,\d{2}\s*€/);
  if (!match) return null;
  const euros = Number.parseInt(match[1].replace(/\./g, ""), 10);
  return Number.isFinite(euros) && euros >= 1_000 ? euros * 100 : null;
}

function blocks(html: string): string[] {
  const starts = [...html.matchAll(/<div onclick="redirectToDetails\('/g)];
  return starts.map((entry, index) => {
    const start = entry.index ?? 0;
    const end = starts[index + 1]?.index ?? html.length;
    return html.slice(start, end);
  });
}

function parseBlock(block: string): Listing | null {
  const url = block.match(/redirectToDetails\('(https:\/\/www\.ehorses\.es\/anuncios\/[^']+\.html)'/)?.[1] ?? "";
  const id = url.match(/\/(\d+)\.html$/)?.[1] ?? "";
  const title = clean(block.match(/<div class="headline(?: [^"]*)?">([\s\S]*?)<\/div>/)?.[1] ?? "");
  const meta = clean(block.match(/class="noline truncate-2-lines fs16[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? "");
  const priceCents = euroCents(block.match(/<div class="price">([\s\S]*?)<\/div>/)?.[1] ?? "");
  const country = clean(block.match(/<div class="flag inserat-btm-flag [^"]+">[\s\S]*?<p>([^<]+)<\/p>/)?.[1] ?? "");
  const city = clean(block.match(/<div class="city truncate"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? "");
  const images = [...block.matchAll(/(?:src|data-src)="(https:\/\/cdn\.ehorses\.media\/image\/[^"?]+)"/g)].map((match) => match[1]);
  if (!url || !id || !priceCents || images.length === 0) return null;
  return {
    id,
    url,
    title,
    category: meta.split(",")[0]?.trim() || "Remolque para caballos",
    condition: /usado/i.test(meta) ? "used" : "new",
    priceCents,
    country,
    city,
    images: [...new Set(images)],
  };
}

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, { headers: HEADERS });
  if (!response.ok) throw new Error(`${url} -> HTTP ${response.status}`);
  return response.text();
}

async function enrich(listing: Listing): Promise<Listing> {
  const html = await fetchHtml(listing.url);
  const title = listing.title || clean(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
  const images = [...html.matchAll(/https:\/\/cdn\.ehorses\.media\/image\/xxl\/anuncios\/[^"' )\\]+?\.(?:jpg|jpeg|png|webp)/gi)]
    .map((match) => match[0].replace(/&amp;/g, "&"));
  return {
    ...listing,
    title: title || `Remolque para caballos ${listing.id}`,
    images: images.length > 0 ? [...new Set(images)] : listing.images,
  };
}

function brandOf(title: string): string {
  const brands = ["Ifor Williams", "Cheval Liberté", "Böckmann", "Humbaur", "Fautras", "Westfalia", "Wörmann", "Sirius", "Barbieri"];
  return brands.find((brand) => title.toLocaleLowerCase("es").includes(brand.toLocaleLowerCase("es"))) ?? "Multimarca";
}

function capacityOf(text: string): 1 | 2 | 3 | 4 {
  const normalized = text.toLowerCase();
  if (/\b(?:4|cuatro|four|vier)\s+(?:caballos|horses|pferde)/.test(normalized)) return 4;
  if (/\b(?:3|tres|three|drei)\s+(?:caballos|horses|pferde)/.test(normalized)) return 3;
  if (/\b(?:1|un|uno|one|single)\s+(?:caballo|horse|pferd)/.test(normalized)) return 1;
  return 2;
}

function categorySlug(capacity: number): string {
  if (capacity === 1) return "un-caballo";
  if (capacity === 2) return "dos-caballos";
  return "tres-cuatro-caballos";
}

function descriptions(listing: Listing, capacity: number): { short: string; long: string; shortEn: string; longEn: string } {
  const place = [listing.city, listing.country].filter(Boolean).join(", ");
  const state = listing.condition === "used" ? "de ocasión" : "nuevo";
  const stateEn = listing.condition === "used" ? "pre-owned" : "new";
  return {
    short: `Remolque ${state} para ${capacity} ${capacity === 1 ? "caballo" : "caballos"}${place ? `, disponible en ${place}` : ""}.`,
    long: `Remolque ${state} configurado para transportar ${capacity} ${capacity === 1 ? "caballo" : "caballos"}. Una opción práctica para desplazamientos, competiciones y uso ecuestre habitual, con un espacio diseñado para facilitar el embarque y el transporte${place ? `. Vehículo ubicado en ${place}` : ""}. Recomendamos comprobar la documentación, el estado del suelo, los frenos, los neumáticos y el sistema de enganche antes de la entrega.`,
    shortEn: `${stateEn[0].toUpperCase()}${stateEn.slice(1)} trailer for ${capacity} ${capacity === 1 ? "horse" : "horses"}${place ? `, available in ${place}` : ""}.`,
    longEn: `${stateEn[0].toUpperCase()}${stateEn.slice(1)} trailer configured to transport ${capacity} ${capacity === 1 ? "horse" : "horses"}. A practical choice for travel, competitions and regular equestrian use, with space designed for easier loading and transport${place ? `. Vehicle located in ${place}` : ""}. Check the documentation, floor, brakes, tyres and coupling system before delivery.`,
  };
}

async function main() {
  const first = await fetchHtml(`${BASE}&seite=1`);
  const total = Number.parseInt(clean(first.match(/(\d+)\s+resultados/)?.[1] ?? "0"), 10) || 0;
  // ehorses ne respecte pas toujours `inserate=48`, et les annonces mises en
  // avant faussent le nombre de cartes. On avance jusqu'à la première page vide.
  const pages = [first];
  for (let page = 2; page <= 20; page += 1) {
    let html: string;
    try {
      html = await fetchHtml(`${BASE}&seite=${page}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes("HTTP 404")) break;
      throw error;
    }
    if (blocks(html).length === 0) break;
    pages.push(html);
  }
  const byId = new Map<string, Listing>();
  for (const page of pages) for (const block of blocks(page)) {
    const listing = parseBlock(block);
    if (listing) byId.set(listing.id, listing);
  }
  const listings: Listing[] = [];
  for (const batchStart of Array.from({ length: Math.ceil(byId.size / 8) }, (_, index) => index * 8)) {
    listings.push(...await Promise.all([...byId.values()].slice(batchStart, batchStart + 8).map(enrich)));
  }

  const categories = await prisma.category.findMany({ where: { group: { slug: "ocasion" } }, select: { id: true, slug: true } });
  const categoryIds = new Map(categories.map((category) => [category.slug, category.id]));
  let created = 0;
  let updated = 0;
  console.log(`${EJECUTAR ? "Import" : "Essai à blanc"}: ${listings.length} annonces uniques sur ${total} résultats annoncés.`);

  for (const listing of listings) {
    const capacity = capacityOf(`${listing.title} ${listing.category}`);
    const categoryId = categoryIds.get(categorySlug(capacity));
    if (!categoryId) throw new Error(`Catégorie absente: ${categorySlug(capacity)}`);
    const brand = brandOf(listing.title);
    const slug = `eh-${slugify(listing.title).slice(0, 60) || "remolque"}-${listing.id}`;
    const copy = descriptions(listing, capacity);
    const priceCents = Math.round(listing.priceCents * 0.9);
    const data = {
      categoryId, brand, name: listing.title, nameEn: listing.title,
      sku: `EH-${listing.id}`, shortDescription: copy.short, shortDescriptionEn: copy.shortEn,
      description: copy.long, descriptionEn: copy.longEn,
      bullets: JSON.stringify([`${capacity} ${capacity === 1 ? "caballo" : "caballos"}`, listing.condition === "used" ? "Ocasión" : "Nuevo", [listing.city, listing.country].filter(Boolean).join(", ")]),
      bulletsEn: JSON.stringify([`${capacity} ${capacity === 1 ? "horse" : "horses"}`, listing.condition === "used" ? "Pre-owned" : "New", [listing.city, listing.country].filter(Boolean).join(", ")]),
      specs: JSON.stringify({ plazas: capacity }), sourceRef: listing.url,
      condition: listing.condition, stock: 1, googleProductCategory: GOOGLE_REMOLQUE,
      oldPriceCents: listing.priceCents, priceCents, saleMode: "cart",
      badge: "−10 %", active: true, image: listing.images[0], images: JSON.stringify(listing.images.slice(1, 6)),
    } as const;
    if (!EJECUTAR) continue;
    const existing = await prisma.product.findUnique({ where: { slug }, select: { id: true } });
    await prisma.product.upsert({ where: { slug }, create: { slug, ...data }, update: data });
    if (existing) updated += 1; else created += 1;
  }
  console.log(EJECUTAR ? `Créées: ${created}; mises à jour: ${updated}.` : "Aucune écriture. Ajouter --ejecutar pour appliquer.");
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
