import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CategoryProductBrowser } from "@/components/CategoryProductBrowser";
import { getCategoryPages } from "@/server/store";
import { loadCatalogTranslations, localizeCategoryPages } from "@/server/localizedContent";
import type { Locale } from "@/i18n/routing";
import type { Product } from "@/types/home";
import { BRAND } from "@/config/brand";
import { priceRangeById, selectProducts, type SelectionCriteria } from "@/lib/catalogSelection";

type SearchPageParams = Promise<{ locale: Locale }>;
type SearchPageSearchParams = Promise<{
  q?: string | string[];
  plazas?: string | string[];
  precio?: string | string[];
}>;

/** Recherche du site : ni index ni suivi, une page par requête est du contenu
 * fin et changeant, pas une page à faire indexer. */
const ROBOTS_NOINDEX: Metadata["robots"] = { index: false, follow: false };

/** Même normalisation que src/lib/slugify.ts pour les accents, mais sans
 * réduire aux tirets : la recherche doit garder les mots séparés pour que
 * chaque terme se retrouve indépendamment dans le texte du produit. */
function fold(value: string): string {
  return value
    .toLowerCase()
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Chaque mot de la requête doit se retrouver dans la marque ou le nom,
 * peu importe l'ordre : « hetre 25 » trouve « Hêtre prêt à brûler 25 cm ». */
function matches(product: Product, tokens: readonly string[]): boolean {
  const haystack = fold(`${product.brand} ${product.name}`);
  return tokens.every((token) => haystack.includes(token));
}

function firstValue(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

/**
 * Critères venus du sélecteur de l'en-tête (places, budget). Une tranche de
 * budget inconnue — une ancienne adresse par exemple — est ignorée.
 */
function selectionCriteria(params: Awaited<SearchPageSearchParams>): SelectionCriteria | null {
  const plazas = firstValue(params.plazas).trim();
  const precio = firstValue(params.precio).trim();
  const criteria: SelectionCriteria = {
    plazas: plazas || undefined,
    precio: priceRangeById(precio) ? precio : undefined,
  };
  return criteria.plazas || criteria.precio ? criteria : null;
}

/** Remorques neuves et d'occasion répondant aux critères du sélecteur. */
async function selectionResults(locale: Locale, criteria: SelectionCriteria): Promise<Product[]> {
  const [rawCategories, translations] = await Promise.all([
    getCategoryPages(),
    loadCatalogTranslations(locale),
  ]);
  return selectProducts(localizeCategoryPages(rawCategories, translations), criteria);
}

async function searchResults(locale: Locale, query: string): Promise<Product[]> {
  const tokens = fold(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const [rawCategories, translations] = await Promise.all([
    getCategoryPages(),
    loadCatalogTranslations(locale),
  ]);
  const products = localizeCategoryPages(rawCategories, translations).flatMap(
    (category) => category.products,
  );

  return products.filter((product) => matches(product, tokens));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: SearchPageParams;
  searchParams: SearchPageSearchParams;
}): Promise<Metadata> {
  const { locale } = await params;
  const sp = await searchParams;
  const query = firstValue(sp.q).trim();
  const t = await getTranslations({ locale, namespace: "recherche" });
  if (!query) {
    return selectionCriteria(sp)
      ? { title: `${t("seleccionTitulo")} | ${BRAND.name}`, robots: ROBOTS_NOINDEX }
      : { robots: ROBOTS_NOINDEX };
  }
  return { title: t("metaTitle", { query }), robots: ROBOTS_NOINDEX };
}

export default async function RecherchePage({
  params,
  searchParams,
}: {
  params: SearchPageParams;
  searchParams: SearchPageSearchParams;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sp = await searchParams;
  const query = firstValue(sp.q).trim();
  const criteria = query ? null : selectionCriteria(sp);
  const common = await getTranslations("common");
  const t = await getTranslations("recherche");
  const rangeLabels = await getTranslations("category.priceRanges");
  const results = query
    ? await searchResults(locale, query)
    : criteria
      ? await selectionResults(locale, criteria)
      : [];
  // Rappel des critères sous le titre : places, budget, puis le mélange neuf et occasion.
  const criteres = criteria
    ? [
        criteria.plazas && common.has(`categoryNames.${criteria.plazas}`)
          ? common(`categoryNames.${criteria.plazas}`)
          : null,
        criteria.precio ? rangeLabels(criteria.precio) : null,
        t("seleccionNuevoOcasion"),
      ].filter(Boolean)
    : [];

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="border-b border-border bg-white">
          <div className="mx-auto max-w-screen-xl px-3 py-3">
            <Breadcrumb
              items={[{ label: common("home"), href: "/" }, { label: t("breadcrumb") }]}
            />
          </div>
        </div>

        <div className="mx-auto max-w-screen-xl px-3 py-6">
          {criteria ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-foreground sm:text-3xl">{t("seleccionTitulo")}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {criteres.join(" · ")} — {t("resultats", { count: results.length })}
                </p>
              </div>
              <CategoryProductBrowser products={results} />
            </>
          ) : query ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-foreground sm:text-3xl">
                  {t("titre", { query })}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("resultats", { count: results.length })}
                </p>
              </div>
              <CategoryProductBrowser products={results} />
            </>
          ) : (
            <p className="py-12 text-center text-sm text-muted-foreground">{t("vide")}</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
