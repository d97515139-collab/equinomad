/**
 * Importe les remorques d'occasion depuis Equirodi et TruckScout24.
 *
 *   node --env-file=.env.local.bak --import tsx scripts/importar-ocasion-fuentes.ts
 *   node --env-file=.env.local.bak --import tsx scripts/importar-ocasion-fuentes.ts --ejecutar
 *
 * RÈGLE DE QUALITÉ. N'entre en base qu'une annonce qui cumule :
 *   1. un prix lisible ;
 *   2. au moins une vraie photo ;
 *   3. un modèle reconnu, donc des caractéristiques techniques fiables ;
 *   4. un état d'occasion explicite.
 *
 * Tout le reste est ignoré : mieux vaut rater une annonce que publier une fiche
 * bancale ou vendre du neuf dans le rayon occasion.
 */
import { precioConMargen } from "./data/remolques/precios";
import { type Anuncio, MODELOS, type ModeloOcasion, fichaDe } from "./data/remolques/ocasion";
import { prisma } from "../src/server/prisma";
import {
  buildOccasionSlug,
  countryToEnglish,
  findOccasionModel,
  isSecondHandCondition,
  parseEquirodiCard,
  parseTruckScoutCard,
  type ParsedOccasionCard,
} from "../src/lib/ocasionSources";
import { escribirEspecificaciones } from "../src/server/productSpecs";

const EJECUTAR = process.argv.includes("--ejecutar");
const GOOGLE_REMOLQUE = "Vehículos y piezas > Vehículos > Vehículos de motor > Remolques";
const MAX_PAGES = 20;
const MAX_IMAGES = 6;
const MIN_PRICE_EUROS = 1_000;

const EQURODI_BRANDS = [
  "https://www.equirodi.es/anuncios/vans-caballos/cheval-liberte.htm",
  "https://www.equirodi.es/anuncios/vans-caballos/fautras.htm",
  "https://www.equirodi.es/anuncios/vans-caballos/ifor-williams.htm",
  "https://www.equirodi.es/anuncios/vans-caballos/bockmann.htm",
] as const;

const TRUCKSCOUT_BRANDS = [
  "https://www.truckscout24.es/remolques/occasion/remolque-para-caballos/cheval-liberte",
  "https://www.truckscout24.es/remolques/occasion/remolque-para-caballos/humbaur",
  "https://www.truckscout24.es/remolques/occasion/remolque-para-caballos/boeckmann",
  "https://www.truckscout24.es/remolques/occasion/remolque-para-caballos/ifor-williams",
] as const;

function slugCategoria(plazas: number): string {
  if (plazas <= 1) return "un-caballo";
  if (plazas === 2) return "dos-caballos";
  return "tres-cuatro-caballos";
}

function descripcionDesdeSecciones(
  secciones: readonly { heading: string; body: string }[],
): string {
  return secciones.map((seccion) => `${seccion.heading}\n${seccion.body}`).join("\n\n");
}

function pageUrl(baseUrl: string, page: number): string {
  if (page <= 1) return baseUrl;
  const join = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${join}page=${page}`;
}

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "es-ES,es;q=0.9,fr;q=0.8,en;q=0.7",
    },
  });
  if (!response.ok) throw new Error(`${url} -> HTTP ${response.status}`);
  return response.text();
}

function extractEquirodiBlocks(html: string): string[] {
  return html.match(/<article class='myadlist[\s\S]*?<\/article>/g) ?? [];
}

function extractTruckScoutBlocks(html: string): string[] {
  const starts = [...html.matchAll(/<section id="section-\d+-\d+" data-listing-id="\d+" class="shadow-sm grid-card grid-card-border">/g)];
  if (starts.length === 0) return [];

  const blocks: string[] = [];
  for (let index = 0; index < starts.length; index += 1) {
    const start = starts[index].index ?? 0;
    const end = index + 1 < starts.length ? (starts[index + 1].index ?? html.length) : html.length;
    blocks.push(html.slice(start, end));
  }
  return blocks;
}

async function collectListings(): Promise<ParsedOccasionCard[]> {
  const seen = new Set<string>();
  const listings: ParsedOccasionCard[] = [];

  for (const baseUrl of EQURODI_BRANDS) {
    for (let page = 1; page <= MAX_PAGES; page += 1) {
      let html: string;
      try {
        html = await fetchHtml(pageUrl(baseUrl, page));
      } catch (error) {
        if (error instanceof Error && error.message.includes("HTTP 404")) break;
        throw error;
      }
      const blocks = extractEquirodiBlocks(html);
      if (blocks.length === 0) break;

      let newOnPage = 0;
      for (const block of blocks) {
        const parsed = parseEquirodiCard(block);
        if (!parsed) continue;
        const key = `${parsed.source}:${parsed.id}`;
        if (seen.has(key)) continue;
        seen.add(key);
        listings.push(parsed);
        newOnPage += 1;
      }
      if (newOnPage === 0) break;
    }
  }

  for (const baseUrl of TRUCKSCOUT_BRANDS) {
    for (let page = 1; page <= MAX_PAGES; page += 1) {
      let html: string;
      try {
        html = await fetchHtml(pageUrl(baseUrl, page));
      } catch (error) {
        if (error instanceof Error && error.message.includes("HTTP 404")) break;
        throw error;
      }
      const blocks = extractTruckScoutBlocks(html);
      if (blocks.length === 0) break;

      let newOnPage = 0;
      for (const block of blocks) {
        const parsed = parseTruckScoutCard(block);
        if (!parsed) continue;
        const key = `${parsed.source}:${parsed.id}`;
        if (seen.has(key)) continue;
        seen.add(key);
        listings.push(parsed);
        newOnPage += 1;
      }
      if (newOnPage === 0) break;
    }
  }

  return listings;
}

function detalleEs(listing: ParsedOccasionCard): string {
  const seller = listing.sellerType ? `${listing.sellerType.toLowerCase()}` : "anuncio";
  const source = listing.source === "equirodi" ? "Equirodi" : "TruckScout24";
  return `${seller.charAt(0).toUpperCase()}${seller.slice(1)} publicado en ${source}. Estado anunciado: ${listing.condition}.`;
}

function detalleEn(listing: ParsedOccasionCard): string {
  const seller =
    listing.sellerType.toLowerCase().includes("prof") || listing.sellerType.toLowerCase().includes("verified")
      ? "Professional"
      : listing.sellerType.toLowerCase().includes("part")
        ? "Private"
        : "Seller";
  const source = listing.source === "equirodi" ? "Equirodi" : "TruckScout24";
  return `${seller} listing published on ${source}. Advertised condition: ${listing.condition}.`;
}

function anuncioDesdeListing(listing: ParsedOccasionCard): Anuncio | null {
  if (!isSecondHandCondition(listing.condition)) return null;

  const match = findOccasionModel(listing.brand, listing.title);
  if (!match) return null;
  if (!MODELOS[match.modelKey]) return null;

  return {
    slug: buildOccasionSlug(listing.source === "equirodi" ? "eq" : "ts", listing.id, listing.brand, match.displayName),
    modelo: match.modelKey as ModeloOcasion,
    brand: listing.brand,
    name: match.displayName,
    precioEuros: listing.priceEuros,
    pais: listing.countryEs,
    paisEn: countryToEnglish(listing.countryEs),
    ...(listing.year ? { anio: listing.year } : {}),
    detalle: detalleEs(listing),
    detalleEn: detalleEn(listing),
  };
}

async function importarFicha(
  anuncio: Anuncio,
  listing: ParsedOccasionCard,
  categorias: ReadonlyMap<string, string>,
): Promise<"creado" | "actualizado"> {
  const ficha = fichaDe(anuncio);
  const categoryId = categorias.get(`ocasion/${slugCategoria(ficha.specs.plazas)}`);
  if (!categoryId) {
    throw new Error(`Catégorie occasion absente pour ${ficha.slug}.`);
  }

  const gallery = listing.imageUrls.slice(0, MAX_IMAGES);
  const image = gallery[0] ?? null;
  const images = JSON.stringify(gallery.slice(1));
  const description = descripcionDesdeSecciones(ficha.sections);
  const descriptionEn = descripcionDesdeSecciones(
    ficha.sections.map((section) => ({ heading: section.headingEn, body: section.bodyEn })),
  );

  const existing = await prisma.product.findUnique({
    where: { slug: ficha.slug },
    select: { id: true },
  });

  const product = await prisma.product.upsert({
    where: { slug: ficha.slug },
    create: {
      slug: ficha.slug,
      active: true,
      categoryId,
      brand: ficha.brand,
      name: ficha.name,
      nameEn: ficha.nameEn,
      sku: ficha.sku,
      shortDescription: ficha.shortDescription,
      shortDescriptionEn: ficha.shortDescriptionEn,
      description,
      descriptionEn,
      bullets: JSON.stringify(ficha.bullets),
      bulletsEn: JSON.stringify(ficha.bulletsEn),
      specs: escribirEspecificaciones(ficha.specs),
      sourceRef: listing.sourceRef,
      condition: "used",
      stock: 1,
      googleProductCategory: GOOGLE_REMOLQUE,
      priceCents: precioConMargen(listing.priceEuros),
      saleMode: "cart",
      image,
      images,
    },
    update: {
      categoryId,
      brand: ficha.brand,
      name: ficha.name,
      nameEn: ficha.nameEn,
      sku: ficha.sku,
      shortDescription: ficha.shortDescription,
      shortDescriptionEn: ficha.shortDescriptionEn,
      description,
      descriptionEn,
      bullets: JSON.stringify(ficha.bullets),
      bulletsEn: JSON.stringify(ficha.bulletsEn),
      specs: escribirEspecificaciones(ficha.specs),
      sourceRef: listing.sourceRef,
      condition: "used",
      stock: 1,
      googleProductCategory: GOOGLE_REMOLQUE,
      priceCents: precioConMargen(listing.priceEuros),
      saleMode: "cart",
      active: true,
      image,
      images,
    },
  });

  await prisma.productSection.deleteMany({ where: { productId: product.id } });
  await prisma.productSection.createMany({
    data: ficha.sections.map((section, position) => ({
      productId: product.id,
      heading: section.heading,
      body: section.body,
      headingEn: section.headingEn,
      bodyEn: section.bodyEn,
      position,
    })),
  });

  return existing ? "actualizado" : "creado";
}

async function main() {
  const categories = await prisma.category.findMany({
    where: { group: { slug: "ocasion" } },
    select: { id: true, slug: true, group: { select: { slug: true } } },
  });
  const categorias = new Map(categories.map((row) => [`${row.group.slug}/${row.slug}`, row.id]));

  const listings = await collectListings();
  const counters = {
    total: listings.length,
    withSecondHand: 0,
    matched: 0,
    imported: 0,
    created: 0,
    updated: 0,
    skippedLowPrice: 0,
    skippedCondition: 0,
    skippedModel: 0,
  };

  console.log(
    EJECUTAR
      ? `Import occasion live — ${listings.length} annonces relevées`
      : `Essai à blanc occasion live — ${listings.length} annonces relevées`,
  );

  for (const listing of listings) {
    if (!isSecondHandCondition(listing.condition)) {
      counters.skippedCondition += 1;
      continue;
    }
    counters.withSecondHand += 1;

    if (listing.priceEuros < MIN_PRICE_EUROS) {
      counters.skippedLowPrice += 1;
      continue;
    }

    const anuncio = anuncioDesdeListing(listing);
    if (!anuncio) {
      counters.skippedModel += 1;
      continue;
    }
    counters.matched += 1;

    if (!EJECUTAR) {
      console.log(`  · ${anuncio.slug} ← ${listing.source} | ${listing.brand} | ${listing.priceEuros} €`);
      continue;
    }

    const result = await importarFicha(anuncio, listing, categorias);
    const counterKey = result === "creado" ? "created" : "updated";
    counters.imported += 1;
    counters[counterKey] += 1;
    console.log(`  ✓ ${anuncio.slug} (${listing.source})`);
  }

  console.log("");
  console.log(`Annonces vues : ${counters.total}`);
  console.log(`Occasion explicite : ${counters.withSecondHand}`);
  console.log(`Modèle reconnu : ${counters.matched}`);
  console.log(`Ignorées car prix aberrant : ${counters.skippedLowPrice}`);
  console.log(`Ignorées car neuves : ${counters.skippedCondition}`);
  console.log(`Ignorées car modèle inconnu : ${counters.skippedModel}`);
  if (EJECUTAR) {
    console.log(`Créées : ${counters.created}`);
    console.log(`Mises à jour : ${counters.updated}`);
  } else {
    console.log("Rien n'a été écrit. Relancer avec --ejecutar pour appliquer.");
  }
}

main()
  .catch((error) => {
    console.error("ÉCHEC :", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
