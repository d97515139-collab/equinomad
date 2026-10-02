import { prisma } from "@/server/prisma";
import { routing, type Locale } from "@/i18n/routing";
import type { CategoryPageView } from "@/server/store";
import type { CategoryGuide } from "@/server/types";
import type { Product } from "@/types/home";

// Traduction du catalogue, côté boutique uniquement.
//
// Principe : l'espagnol reste la base éditoriale du catalogue. L'anglais
// couvre tout le catalogue comme premier niveau de repli ; produits, catégories,
// groupes et sections de guide portent aussi des colonnes fr/de/it.
// Ce module charge les traductions puis les applique à des données déjà
// préparées par le store, sans jamais laisser de champ vide en boutique.

// ---- Types ----

interface CategoryTranslation {
  label: string;
  description: string;
  guideIntro: string;
  guideClosing: string;
  /** Sections dans l'ordre d'affichage : l'appariement se fait par position. */
  sections: { heading: string; body: string }[];
}

interface ProductTranslation {
  name: string;
  shortDescription: string;
  description: string;
  bullets: string[];
}

interface ProductTranslationRow {
  id: string;
  nameEn: string;
  shortDescriptionEn: string;
  descriptionEn: string;
  bulletsEn: string;
  nameFr: string;
  shortDescriptionFr: string;
  descriptionFr: string;
  bulletsFr: string;
  nameDe: string;
  shortDescriptionDe: string;
  descriptionDe: string;
  bulletsDe: string;
  nameIt: string;
  shortDescriptionIt: string;
  descriptionIt: string;
  bulletsIt: string;
}

export interface CatalogTranslations {
  /** Libellés de groupe, indexés par slug ("haushalt"). */
  groups: Map<string, string>;
  /** Catégories, indexées par identifiant "groupe/slug". */
  categories: Map<string, CategoryTranslation>;
  /** Produits, indexés par identifiant en base. */
  products: Map<string, ProductTranslation>;
}

/** Bundle vide : tout retombe alors sur les textes espagnols. */
const EMPTY: CatalogTranslations = {
  groups: new Map(),
  categories: new Map(),
  products: new Map(),
};

// ---- Fonctions pures ----

/**
 * Messages d'erreur du service de traduction automatique utilisé par l'ancien
 * catalogue, enregistrés en base à la place de la traduction quand son quota
 * gratuit était épuisé (« MYMEMORY WARNING: YOU USED ALL AVAILABLE FREE
 * TRANSLATIONS… »). Une telle valeur compte comme une traduction absente.
 */
const ERREUR_TRADUCTEUR = /MYMEMORY WARNING|QUERY LENGTH LIMIT EXCEEDED|INVALID LANGUAGE PAIR|PLEASE SELECT TWO DISTINCT LANGUAGES/i;

function traductionUtilisable(value: string): boolean {
  return value.trim().length > 0 && !ERREUR_TRADUCTEUR.test(value);
}

/** Renvoie la traduction si elle est renseignée, sinon le texte d'origine. */
export function pickText(fallback: string, translated: string | null | undefined): string {
  const value = translated?.trim();
  return value && traductionUtilisable(value) ? value : fallback;
}

/** Même règle pour une liste : une liste vide vaut « pas de traduction ». */
export function pickList(fallback: string[], translated: string[] | undefined): string[] {
  const values = translated?.filter(traductionUtilisable) ?? [];
  return values.length > 0 ? values : fallback;
}

/**
 * Texte d'une langue parmi les colonnes traduites d'une ligne (catégorie,
 * groupe, section de guide). Une colonne vide retombe sur l'anglais, qui
 * couvre tout le catalogue ; `pickText` ramène ensuite à l'espagnol au besoin.
 */
export function pickLocale(
  locale: Locale,
  values: { en: string; fr: string; de: string; it: string },
): string {
  const own = locale === "fr" ? values.fr : locale === "de" ? values.de : locale === "it" ? values.it : values.en;
  return own.trim() ? own : values.en;
}

/** Vrai dès qu'une locale connue autre que l'espagnol est demandée. */
export function needsTranslation(locale: string): locale is Locale {
  return locale !== routing.defaultLocale && (routing.locales as readonly string[]).includes(locale);
}

function parseBullets(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function productTranslationForLocale(product: ProductTranslationRow, locale: Locale): ProductTranslation {
  if (locale === "fr") {
    return {
      name: product.nameFr,
      shortDescription: product.shortDescriptionFr,
      description: product.descriptionFr,
      bullets: parseBullets(product.bulletsFr),
    };
  }
  if (locale === "de") {
    return {
      name: product.nameDe,
      shortDescription: product.shortDescriptionDe,
      description: product.descriptionDe,
      bullets: parseBullets(product.bulletsDe),
    };
  }
  if (locale === "it") {
    return {
      name: product.nameIt,
      shortDescription: product.shortDescriptionIt,
      description: product.descriptionIt,
      bullets: parseBullets(product.bulletsIt),
    };
  }

  return {
    name: product.nameEn,
    shortDescription: product.shortDescriptionEn,
    description: product.descriptionEn,
    bullets: parseBullets(product.bulletsEn),
  };
}

/** Applique la traduction à un produit déjà mis en forme par le store. */
export function localizeProduct(product: Product, translations: CatalogTranslations): Product {
  const translated = product.id ? translations.products.get(product.id) : undefined;
  if (!translated) return product;

  const name = pickText(product.name, translated.name);
  const bullets = pickList(product.bullets, translated.bullets);
  const shortDescription = pickText(product.shortDescription ?? "", translated.shortDescription);
  const description = pickText(product.description ?? "", translated.description);

  return {
    ...product,
    name,
    bullets,
    // L'alternative textuelle reprend le nom traduit, la marque ne se traduit pas
    alt: `${product.brand} ${name}`,
    shortDescription: shortDescription || undefined,
    description: description || undefined,
  };
}

function localizeGuide(guide: CategoryGuide, translated: CategoryTranslation): CategoryGuide {
  return {
    intro: pickText(guide.intro, translated.guideIntro),
    closing: pickText(guide.closing, translated.guideClosing),
    sections: guide.sections.map((section, index) => {
      const source = translated.sections[index];
      return {
        heading: pickText(section.heading, source?.heading),
        body: pickText(section.body, source?.body),
      };
    }),
  };
}

/** Applique la traduction à une page de catégorie et à tous ses produits. */
export function localizeCategoryPage(
  view: CategoryPageView,
  translations: CatalogTranslations,
): CategoryPageView {
  const id = `${view.group}/${view.slug}`;
  const translated = translations.categories.get(id);
  const products = view.products.map((product) => localizeProduct(product, translations));
  const groupLabel = pickText(view.groupLabel, translations.groups.get(view.group));

  if (!translated) {
    return { ...view, groupLabel, products };
  }

  return {
    ...view,
    groupLabel,
    label: pickText(view.label, translated.label),
    description: pickText(view.description, translated.description),
    guide: localizeGuide(view.guide, translated),
    products,
  };
}

/** Raccourci pour une liste de pages de catégorie. */
export function localizeCategoryPages(
  views: CategoryPageView[],
  translations: CatalogTranslations,
): CategoryPageView[] {
  return views.map((view) => localizeCategoryPage(view, translations));
}

// ---- Chargement ----

/**
 * Charge en une passe les traductions du catalogue.
 * Pour la langue par défaut (espagnol), aucune requête n'est émise.
 */
export async function loadCatalogTranslations(locale: string): Promise<CatalogTranslations> {
  if (!needsTranslation(locale)) return EMPTY;

  const [groups, categories, products] = await Promise.all([
    prisma.group.findMany({
      select: { slug: true, labelEn: true, labelFr: true, labelDe: true, labelIt: true },
    }),
    prisma.category.findMany({
      select: {
        slug: true,
        labelEn: true,
        labelFr: true,
        labelDe: true,
        labelIt: true,
        descriptionEn: true,
        descriptionFr: true,
        descriptionDe: true,
        descriptionIt: true,
        guideIntroEn: true,
        guideIntroFr: true,
        guideIntroDe: true,
        guideIntroIt: true,
        guideClosingEn: true,
        guideClosingFr: true,
        guideClosingDe: true,
        guideClosingIt: true,
        group: { select: { slug: true } },
        guideSections: {
          select: {
            headingEn: true,
            headingFr: true,
            headingDe: true,
            headingIt: true,
            bodyEn: true,
            bodyFr: true,
            bodyDe: true,
            bodyIt: true,
          },
          orderBy: { position: "asc" },
        },
      },
    }),
    prisma.product.findMany({
      select: {
        id: true,
        nameEn: true,
        shortDescriptionEn: true,
        descriptionEn: true,
        bulletsEn: true,
        nameFr: true,
        shortDescriptionFr: true,
        descriptionFr: true,
        bulletsFr: true,
        nameDe: true,
        shortDescriptionDe: true,
        descriptionDe: true,
        bulletsDe: true,
        nameIt: true,
        shortDescriptionIt: true,
        descriptionIt: true,
        bulletsIt: true,
      },
    }),
  ]);

  return {
    groups: new Map(
      groups.map((group) => [
        group.slug,
        pickLocale(locale, { en: group.labelEn, fr: group.labelFr, de: group.labelDe, it: group.labelIt }),
      ]),
    ),
    categories: new Map(
      categories.map((c) => [
        `${c.group.slug}/${c.slug}`,
        {
          label: pickLocale(locale, { en: c.labelEn, fr: c.labelFr, de: c.labelDe, it: c.labelIt }),
          description: pickLocale(locale, {
            en: c.descriptionEn,
            fr: c.descriptionFr,
            de: c.descriptionDe,
            it: c.descriptionIt,
          }),
          guideIntro: pickLocale(locale, {
            en: c.guideIntroEn,
            fr: c.guideIntroFr,
            de: c.guideIntroDe,
            it: c.guideIntroIt,
          }),
          guideClosing: pickLocale(locale, {
            en: c.guideClosingEn,
            fr: c.guideClosingFr,
            de: c.guideClosingDe,
            it: c.guideClosingIt,
          }),
          sections: c.guideSections.map((s) => ({
            heading: pickLocale(locale, { en: s.headingEn, fr: s.headingFr, de: s.headingDe, it: s.headingIt }),
            body: pickLocale(locale, { en: s.bodyEn, fr: s.bodyFr, de: s.bodyDe, it: s.bodyIt }),
          })),
        },
      ]),
    ),
    products: new Map(
      products.map((product) => [
        product.id,
        productTranslationForLocale(product as ProductTranslationRow, locale),
      ]),
    ),
  };
}
