# i18n quatre langues Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Servir toute la boutique en `es`, `en`, `de` et `it`, avec `es` comme source de vérité, des pages légales complètes dans les quatre langues et un back-office catalogue à onglets par langue.

**Architecture:** Le site public garde `es` à la racine et préfixe `en`, `de`, `it`. Le stockage catalogue reste en colonnes Prisma (`*En`, `*De`, `*It`) avec fallback champ par champ vers `es`, tandis que l'admin manipule des objets `translations` structurés pour les groupes, catégories et produits. Les pages légales conservent leur logique « fichier d'origine + override base », simplement étendue à quatre locales.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, next-intl 4, Prisma 7, PostgreSQL, node:test via `tsx`

**Spec:** `docs/superpowers/specs/2026-08-20-i18n-quatre-langues-design.md`

## Global Constraints

- Les seules locales gérées sont exactement `es`, `en`, `de`, `it`.
- `es` est la langue source partout ; `en`, `de` et `it` retombent sur `es` si un champ traduit est vide.
- Les URLs restent `es` à la racine, puis `/en`, `/de`, `/it` pour les autres langues.
- Les slugs de catégories, produits et pages légales restent identiques dans les quatre langues.
- Les données globales produit restent communes aux quatre langues : catégorie, marque, slug, SKU, images, prix, stock, GTIN/MPN, `condition`, `saleMode`, `specs`, poids d'expédition et classe énergie.
- Les champs traduits sont : noms de groupes, catégories, guides, produits, bullets, sections produit et libellés de variantes.
- Le switcher public du top header doit devenir un select avec drapeau et nom complet : `Español`, `English`, `Deutsch`, `Italiano`.
- Aucune auto-traduction à la volée via API externe n'est introduite dans ce chantier.
- Tous les tests continuent à passer avec `npm test` ; finir par `npm run lint` si le chantier est exécutable sans dette.

## File Structure

- Modify: `src/i18n/routing.ts`
  Déclare les 4 locales et expose les libellés/options partagés.
- Modify: `src/i18n/request.ts`
  Charge dynamiquement `es`, `en`, `de`, `it`.
- Modify: `src/i18n/navigation.ts`
  Continue de déléguer à `next-intl`, inchangé côté API.
- Modify: `src/lib/hreflang.ts`
  Publie les `alternates` sur quatre langues.
- Modify: `src/components/LanguageSwitcher.tsx`
  Remplace les boutons par un select drapeau + nom.
- Create: `src/messages/de.json`
  Messages interface allemands, même arborescence que `es.json`.
- Create: `src/messages/it.json`
  Messages interface italiens, même arborescence que `es.json`.
- Create: `src/messages/messages-locales.test.ts`
  Vérifie que `en`, `de`, `it` couvrent les mêmes clés que `es`.
- Modify: `src/content/legal/types.ts`
  Étend `LegalLocale` à `es | en | de | it`.
- Modify: `src/content/legal/index.ts`
  Déclare les 4 corpus et les titres de footer.
- Create: `src/content/legal/de.ts`
  Traduction allemande complète du corpus espagnol.
- Create: `src/content/legal/it.ts`
  Traduction italienne complète du corpus espagnol.
- Create: `src/content/legal/index.test.ts`
  Vérifie locales, slugs et URLs légales.
- Modify: `src/server/legalPages.ts`
  Charge les 4 locales côté public et admin.
- Modify: `src/components/admin/LegalPageForm.tsx`
  Passe à 4 onglets.
- Modify: `src/app/admin/(protected)/pages/page.tsx`
  Affiche l'état de 4 langues.
- Modify: `src/app/admin/(protected)/pages/[slug]/page.tsx`
  Passe les 4 versions au formulaire.
- Modify: `prisma/schema.prisma`
  Ajoute les colonnes `De` et `It` sur groupe/catégorie/guide/produit/section/variante.
- Create: `prisma/migrations/<timestamp>_catalogue_i18n_de_it/migration.sql`
  Migration SQL correspondante.
- Modify: `src/generated/prisma/**`
  Régénéré après migration.
- Create: `src/lib/catalogLocales.ts`
  Source unique pour `CATALOG_LOCALES`, labels, drapeaux et helpers de fallback.
- Modify: `src/server/types.ts`
  Expose les structures `translations` pour admin.
- Modify: `src/lib/variantPricing.ts`
  Porte les labels de variantes par locale.
- Modify: `src/server/productInput.ts`
  Parse un payload `translations` produit + variantes traduites.
- Create: `src/server/groupInput.ts`
  Validation serveur des groupes multilingues.
- Create: `src/server/categoryInput.ts`
  Validation serveur des catégories multilingues.
- Create: `src/server/groupInput.test.ts`
  Tests de validation groupe.
- Create: `src/server/categoryInput.test.ts`
  Tests de validation catégorie.
- Modify: `src/server/productInput.test.ts`
  Tests de validation produit multilingue.
- Modify: `src/server/localizedContent.ts`
  Généralise `loadCatalogTranslations()` aux 4 locales.
- Create: `src/server/localizedContent.test.ts`
  Vérifie fallback et rendu localisé.
- Modify: `src/server/store.ts`
  Lit/écrit les nouvelles colonnes et renvoie les objets `translations`.
- Modify: `src/components/admin/GroupForm.tsx`
  Ajoute des onglets langue pour les labels de groupe.
- Modify: `src/components/admin/CategoryForm.tsx`
  Ajoute des onglets langue pour catégorie + guide.
- Modify: `src/components/admin/ProductForm.tsx`
  Ajoute des onglets langue pour produit, sections et variantes.
- Modify: `src/components/admin/ProductPreview.tsx`
  Suit la langue active, sans libellés figés FR/DE.
- Modify: `src/app/api/admin/groups/route.ts`
  Accepte `translations` en création.
- Modify: `src/app/api/admin/groups/[id]/route.ts`
  Accepte `translations` en mise à jour.
- Modify: `src/app/api/admin/categories/route.ts`
  Accepte `translations` en création.
- Modify: `src/app/api/admin/categories/[...id]/route.ts`
  Accepte `translations` en mise à jour.
- Modify: `src/app/api/admin/products/route.ts`
  Accepte `translations` en création.
- Modify: `src/app/api/admin/products/[id]/route.ts`
  Accepte `translations` en mise à jour.
- Create: `scripts/data/catalogTranslations.ts`
  Corpus de traduction initial du catalogue existant.
- Create: `scripts/backfill-catalog-translations.ts`
  Applique les traductions existantes en base, avec `--dry-run`.

---

### Task 1: Étendre le socle i18n public à quatre locales

**Files:**
- Create: `src/messages/de.json`
- Create: `src/messages/it.json`
- Create: `src/messages/messages-locales.test.ts`
- Modify: `src/i18n/routing.ts`
- Modify: `src/i18n/request.ts`
- Modify: `src/lib/hreflang.ts`
- Modify: `src/components/LanguageSwitcher.tsx`
- Modify: `src/messages/en.json`
- Modify: `src/messages/es.json`

**Interfaces:**
- Consumes: `type Locale = (typeof routing.locales)[number]` from `src/i18n/routing.ts`
- Produces: `export const LOCALE_OPTIONS: readonly { code: Locale; label: string; flag: string }[]`
- Produces: `export function alternatesFor(href: string, locale: Locale): Metadata["alternates"]`

- [ ] **Step 1: Write the failing tests for locale coverage and hreflang**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import es from "@/messages/es.json";
import en from "@/messages/en.json";
import de from "@/messages/de.json";
import it from "@/messages/it.json";
import { alternatesFor } from "@/lib/hreflang";

function flattenKeys(value: unknown, prefix = ""): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    flattenKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

test("les bundles en/de/it couvrent les mêmes clés que es", () => {
  const expected = flattenKeys(es).sort();
  assert.deepEqual(flattenKeys(en).sort(), expected);
  assert.deepEqual(flattenKeys(de).sort(), expected);
  assert.deepEqual(flattenKeys(it).sort(), expected);
});

test("alternatesFor publie es/en/de/it plus x-default", () => {
  const alternates = alternatesFor("/contact", "de");
  assert.deepEqual(Object.keys(alternates?.languages ?? {}).sort(), [
    "de",
    "en",
    "es",
    "it",
    "x-default",
  ]);
});
```

- [ ] **Step 2: Run the new test file and confirm it fails**

Run: `node --test --import tsx src/messages/messages-locales.test.ts`

Expected: FAIL because `de.json` and `it.json` do not exist yet and `alternatesFor()` only emits `es`/`en`.

- [ ] **Step 3: Implement the 4-locale routing, switcher select and message bundles**

```ts
// src/i18n/routing.ts
export const routing = defineRouting({
  locales: ["es", "en", "de", "it"],
  defaultLocale: "es",
  localePrefix: "as-needed",
  localeDetection: false,
});

export const LOCALE_OPTIONS = [
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
] as const;

// src/components/LanguageSwitcher.tsx
<select
  value={locale}
  onChange={(event) => switchTo(event.target.value as Locale)}
>
  {LOCALE_OPTIONS.map((option) => (
    <option key={option.code} value={option.code}>
      {`${option.flag} ${option.label}`}
    </option>
  ))}
</select>
```

- [ ] **Step 4: Re-run the locale coverage test**

Run: `node --test --import tsx src/messages/messages-locales.test.ts`

Expected: PASS with the four message bundles and `alternatesFor()` including `es`, `en`, `de`, `it`, `x-default`.

- [ ] **Step 5: Commit the locale scaffold**

```bash
git add src/i18n/routing.ts src/i18n/request.ts src/lib/hreflang.ts src/components/LanguageSwitcher.tsx src/messages/es.json src/messages/en.json src/messages/de.json src/messages/it.json src/messages/messages-locales.test.ts
git commit -m "feat: add four-locale public i18n scaffold"
```

### Task 2: Étendre les pages légales et leur administration à `de` et `it`

**Files:**
- Create: `src/content/legal/de.ts`
- Create: `src/content/legal/it.ts`
- Create: `src/content/legal/index.test.ts`
- Modify: `src/content/legal/types.ts`
- Modify: `src/content/legal/index.ts`
- Modify: `src/server/legalPages.ts`
- Modify: `src/components/admin/LegalPageForm.tsx`
- Modify: `src/app/admin/(protected)/pages/page.tsx`
- Modify: `src/app/admin/(protected)/pages/[slug]/page.tsx`

**Interfaces:**
- Consumes: `export type LegalLocale = "es" | "en"` from `src/content/legal/types.ts`
- Produces: `export type LegalLocale = "es" | "en" | "de" | "it"`
- Produces: `export const LEGAL_LOCALES: readonly LegalLocale[]`
- Produces: `async function getLegalPageVersion(slug: LegalSlug, locale: LegalLocale): Promise<LegalPageVersion>`

- [ ] **Step 1: Write the failing legal locale test**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import {
  LEGAL_LOCALES,
  LEGAL_SLUGS,
  ORIGIN_PAGES,
  getLegalHref,
  isLegalLocale,
} from "@/content/legal";

test("les pages légales exposent 4 locales", () => {
  assert.deepEqual(LEGAL_LOCALES, ["es", "en", "de", "it"]);
  assert.equal(isLegalLocale("de"), true);
  assert.equal(isLegalLocale("it"), true);
});

test("chaque locale porte tous les slugs", () => {
  for (const locale of LEGAL_LOCALES) {
    assert.deepEqual(Object.keys(ORIGIN_PAGES[locale]).sort(), [...LEGAL_SLUGS].sort());
  }
});

test("les hrefs préfixent uniquement les locales non par défaut", () => {
  assert.equal(getLegalHref("faq", "es"), "/faq");
  assert.equal(getLegalHref("faq", "de"), "/de/faq");
  assert.equal(getLegalHref("faq", "it"), "/it/faq");
});
```

- [ ] **Step 2: Run the legal locale test and confirm it fails**

Run: `node --test --import tsx src/content/legal/index.test.ts`

Expected: FAIL because `de` and `it` are absent from the legal domain.

- [ ] **Step 3: Add the German and Italian corpora and wire the 4-language admin**

```ts
// src/content/legal/types.ts
export type LegalLocale = "es" | "en" | "de" | "it";

// src/content/legal/index.ts
import { deLegalPages } from "./de";
import { itLegalPages } from "./it";

export const LEGAL_LOCALES: readonly LegalLocale[] = ["es", "en", "de", "it"];

export const ORIGIN_PAGES = {
  es: esLegalPages,
  en: enLegalPages,
  de: deLegalPages,
  it: itLegalPages,
} satisfies Readonly<Record<LegalLocale, LegalPageMap>>;

// src/components/admin/LegalPageForm.tsx
const LOCALES: readonly LegalLocale[] = ["es", "en", "de", "it"];
const LOCALE_LABELS: Record<LegalLocale, string> = {
  es: "Español",
  en: "English",
  de: "Deutsch",
  it: "Italiano",
};
```

- [ ] **Step 4: Re-run the legal tests**

Run: `node --test --import tsx src/content/legal/index.test.ts src/server/legalPageInput.test.ts`

Expected: PASS with 4 locales, all legal slugs present, and unchanged legal input normalization.

- [ ] **Step 5: Commit the legal 4-language support**

```bash
git add src/content/legal/types.ts src/content/legal/index.ts src/content/legal/de.ts src/content/legal/it.ts src/content/legal/index.test.ts src/server/legalPages.ts src/components/admin/LegalPageForm.tsx 'src/app/admin/(protected)/pages/page.tsx' 'src/app/admin/(protected)/pages/[slug]/page.tsx'
git commit -m "feat: add four-language legal pages"
```

### Task 3: Étendre le schéma Prisma et les types catalogue à `de` / `it`

**Files:**
- Create: `src/lib/catalogLocales.ts`
- Create: `prisma/migrations/<timestamp>_catalogue_i18n_de_it/migration.sql`
- Modify: `prisma/schema.prisma`
- Modify: `src/generated/prisma/**`
- Modify: `src/server/types.ts`
- Modify: `src/lib/variantPricing.ts`
- Modify: `src/server/productInput.ts`
- Modify: `src/server/productInput.test.ts`

**Interfaces:**
- Consumes: `export interface VariantInput { label: string; labelEn?: string; ... }`
- Produces: `export interface VariantInput { labels: Record<CatalogLocale, string>; priceCents: number; oldPriceCents?: number; position?: number; active?: boolean }`
- Produces: `export type CatalogLocale = "es" | "en" | "de" | "it"`
- Produces: `export interface ProductTranslationsInput { es: ProductLocaleInput; en: ProductLocaleInput; de: ProductLocaleInput; it: ProductLocaleInput }`

- [ ] **Step 1: Write the failing product input test for multilingual payloads**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { parseProductInput } from "@/server/productInput";

test("parseProductInput accepte translations et labels de variantes sur 4 locales", () => {
  const { values, errors } = parseProductInput(
    {
      categoryId: "nuevos/dos-caballos",
      brand: "Cheval Liberte",
      price: "10990,00 €",
      translations: {
        es: { name: "Gold First", shortDescription: "Base ES", description: "Desc ES", bullets: ["Uno"] },
        en: { name: "Gold First", shortDescription: "Base EN", description: "Desc EN", bullets: ["One"] },
        de: { name: "Gold First", shortDescription: "Basis DE", description: "Desc DE", bullets: ["Eins"] },
        it: { name: "Gold First", shortDescription: "Base IT", description: "Desc IT", bullets: ["Uno IT"] },
      },
      variants: [
        {
          labels: { es: "Touring", en: "Touring", de: "Touring", it: "Touring" },
          price: "10990,00 €",
        },
      ],
    },
    "create",
  );

  assert.deepEqual(errors, []);
  assert.equal(values.translations?.de.name, "Gold First");
  assert.equal(values.variants?.[0].labels.it, "Touring");
});
```

- [ ] **Step 2: Run the multilingual product input test and confirm it fails**

Run: `node --test --import tsx src/server/productInput.test.ts`

Expected: FAIL because `parseProductInput()` does not know `translations` or `labels`.

- [ ] **Step 3: Add Prisma columns, locale helpers and admin-facing translation types**

```prisma
model Product {
  nameDe             String @default("")
  shortDescriptionDe String @default("")
  descriptionDe      String @default("")
  bulletsDe          String @default("[]")
  nameIt             String @default("")
  shortDescriptionIt String @default("")
  descriptionIt      String @default("")
  bulletsIt          String @default("[]")
}

model ProductVariant {
  labelDe String @default("")
  labelIt String @default("")
}
```

```ts
// src/lib/catalogLocales.ts
export const CATALOG_LOCALES = ["es", "en", "de", "it"] as const;
export type CatalogLocale = (typeof CATALOG_LOCALES)[number];

export interface ProductLocaleInput {
  name: string;
  shortDescription: string;
  description: string;
  bullets: string[];
}

export interface ProductTranslationsInput {
  es: ProductLocaleInput;
  en: ProductLocaleInput;
  de: ProductLocaleInput;
  it: ProductLocaleInput;
}
```

- [ ] **Step 4: Run Prisma generation and the product input tests**

Run: `npx prisma migrate dev --name catalogue_i18n_de_it`

Run: `npx prisma generate`

Run: `node --test --import tsx src/server/productInput.test.ts`

Expected: PASS with generated client up to date and multilingual payload parsing accepted.

- [ ] **Step 5: Commit the schema and shared locale types**

```bash
git add prisma/schema.prisma prisma/migrations src/generated/prisma src/lib/catalogLocales.ts src/server/types.ts src/lib/variantPricing.ts src/server/productInput.ts src/server/productInput.test.ts
git commit -m "feat: add de and it catalog translation fields"
```

### Task 4: Généraliser la localisation storefront et les objets `store.ts`

**Files:**
- Create: `src/server/localizedContent.test.ts`
- Modify: `src/server/localizedContent.ts`
- Modify: `src/server/store.ts`
- Modify: `src/app/[locale]/[group]/[category]/[product]/page.tsx`
- Modify: `src/components/ProductPurchaseBox.tsx`
- Modify: `src/components/ProductSpecsTable.tsx`

**Interfaces:**
- Consumes: `CatalogLocale`, `ProductTranslationsInput`, `VariantInput["labels"]`
- Produces: `export async function loadCatalogTranslations(locale: string): Promise<CatalogTranslations>`
- Produces: `export function localizeProduct(product: Product, translations: CatalogTranslations): Product`

- [ ] **Step 1: Write the failing localization fallback test**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { localizeProduct, pickText } from "@/server/localizedContent";

test("pickText retombe sur es quand de est vide", () => {
  assert.equal(pickText("Remolque dos caballos", ""), "Remolque dos caballos");
});

test("localizeProduct applique la traduction de et garde es en fallback", () => {
  const product = {
    id: "p1",
    brand: "Fautras",
    name: "Oblic 2",
    bullets: ["Base ES"],
    alt: "Fautras Oblic 2",
  } as never;

  const translations = {
    groups: new Map(),
    categories: new Map(),
    products: new Map([
      [
        "p1",
        { name: "Oblic 2 DE", shortDescription: "", description: "", bullets: [] },
      ],
    ]),
  };

  const localized = localizeProduct(product, translations);
  assert.equal(localized.name, "Oblic 2 DE");
  assert.deepEqual(localized.bullets, ["Base ES"]);
});
```

- [ ] **Step 2: Run the localization test and confirm it fails**

Run: `node --test --import tsx src/server/localizedContent.test.ts`

Expected: FAIL because the current module is hard-coded for `en` and does not include variant labels.

- [ ] **Step 3: Generalize the translation loader and store mappers**

```ts
// src/server/localizedContent.ts
function productFieldsFor(locale: CatalogLocale) {
  if (locale === "en") return { name: "nameEn", shortDescription: "shortDescriptionEn", description: "descriptionEn", bullets: "bulletsEn" } as const;
  if (locale === "de") return { name: "nameDe", shortDescription: "shortDescriptionDe", description: "descriptionDe", bullets: "bulletsDe" } as const;
  if (locale === "it") return { name: "nameIt", shortDescription: "shortDescriptionIt", description: "descriptionIt", bullets: "bulletsIt" } as const;
  return null;
}

// src/server/store.ts
variants: row.variants.map((v) => ({
  id: v.id,
  labels: {
    es: v.label,
    en: v.labelEn,
    de: v.labelDe,
    it: v.labelIt,
  },
  priceCents: v.priceCents,
  oldPriceCents: v.oldPriceCents ?? undefined,
  position: v.position,
  active: v.active,
}))
```

- [ ] **Step 4: Re-run localization and product page tests**

Run: `node --test --import tsx src/server/localizedContent.test.ts src/lib/hreflang.test.ts`

Expected: PASS with `de`/`it` fallback behavior correct and `alternates` already intact.

- [ ] **Step 5: Commit the storefront localization engine**

```bash
git add src/server/localizedContent.ts src/server/localizedContent.test.ts src/server/store.ts 'src/app/[locale]/[group]/[category]/[product]/page.tsx' src/components/ProductPurchaseBox.tsx src/components/ProductSpecsTable.tsx
git commit -m "feat: localize storefront catalog in four languages"
```

### Task 5: Ajouter des payloads multilingues validés pour groupes et catégories

**Files:**
- Create: `src/server/groupInput.ts`
- Create: `src/server/categoryInput.ts`
- Create: `src/server/groupInput.test.ts`
- Create: `src/server/categoryInput.test.ts`
- Modify: `src/app/api/admin/groups/route.ts`
- Modify: `src/app/api/admin/groups/[id]/route.ts`
- Modify: `src/app/api/admin/categories/route.ts`
- Modify: `src/app/api/admin/categories/[...id]/route.ts`
- Modify: `src/server/store.ts`

**Interfaces:**
- Produces: `export interface GroupTranslationsInput { es: { label: string }; en: { label: string }; de: { label: string }; it: { label: string } }`
- Produces: `export interface CategoryTranslationsInput { es: CategoryLocaleInput; en: CategoryLocaleInput; de: CategoryLocaleInput; it: CategoryLocaleInput }`
- Produces: `export function parseGroupInput(raw: unknown, mode: "create" | "update"): { values: GroupRecordInput; errors: string[] }`
- Produces: `export function parseCategoryInput(raw: unknown, mode: "create" | "update"): { values: CategoryRecordInput; errors: string[] }`

- [ ] **Step 1: Write the failing group/category parser tests**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { parseGroupInput } from "@/server/groupInput";
import { parseCategoryInput } from "@/server/categoryInput";

test("parseGroupInput exige un label es et accepte en/de/it", () => {
  const { values, errors } = parseGroupInput({
    slug: "nuevos",
    translations: {
      es: { label: "Remolques nuevos" },
      en: { label: "New trailers" },
      de: { label: "Neue Anhänger" },
      it: { label: "Rimorchi nuovi" },
    },
  }, "create");

  assert.deepEqual(errors, []);
  assert.equal(values.translations.de.label, "Neue Anhänger");
});

test("parseCategoryInput garde le guide traduit par locale", () => {
  const { values, errors } = parseCategoryInput({
    group: "nuevos",
    slug: "dos-caballos",
    translations: {
      es: { label: "Dos caballos", description: "ES", guideIntro: "Intro ES", guideClosing: "Closing ES", sections: [{ heading: "Uso", body: "Texto" }] },
      en: { label: "Two horses", description: "EN", guideIntro: "", guideClosing: "", sections: [] },
      de: { label: "Zwei Pferde", description: "DE", guideIntro: "", guideClosing: "", sections: [] },
      it: { label: "Due cavalli", description: "IT", guideIntro: "", guideClosing: "", sections: [] },
    },
  }, "create");

  assert.deepEqual(errors, []);
  assert.equal(values.translations.es.sections[0].heading, "Uso");
});
```

- [ ] **Step 2: Run the new parser tests and confirm they fail**

Run: `node --test --import tsx src/server/groupInput.test.ts src/server/categoryInput.test.ts`

Expected: FAIL because no parser module exists yet.

- [ ] **Step 3: Implement shared validation and refit the admin routes**

```ts
// src/server/groupInput.ts
export function parseGroupInput(raw: unknown, mode: "create" | "update") {
  // slug/position globaux + translations.es.label obligatoire
}

// src/server/categoryInput.ts
export function parseCategoryInput(raw: unknown, mode: "create" | "update") {
  // group/slug/image globaux + translations[locale] pour label/description/guide
}

// src/app/api/admin/categories/route.ts
const { values, errors } = parseCategoryInput(body, "create");
if (errors.length > 0) return NextResponse.json({ error: errors[0], errors }, { status: 400 });
```

- [ ] **Step 4: Re-run the parser tests**

Run: `node --test --import tsx src/server/groupInput.test.ts src/server/categoryInput.test.ts`

Expected: PASS with `translations.es` required and `en/de/it` accepted as optional fallbacks.

- [ ] **Step 5: Commit the multilingual group/category API layer**

```bash
git add src/server/groupInput.ts src/server/categoryInput.ts src/server/groupInput.test.ts src/server/categoryInput.test.ts 'src/app/api/admin/groups/route.ts' 'src/app/api/admin/groups/[id]/route.ts' 'src/app/api/admin/categories/route.ts' 'src/app/api/admin/categories/[...id]/route.ts' src/server/store.ts
git commit -m "feat: validate multilingual group and category payloads"
```

### Task 6: Passer les formulaires groupe et catégorie aux onglets langue

**Files:**
- Modify: `src/components/admin/GroupForm.tsx`
- Modify: `src/components/admin/CategoryForm.tsx`
- Modify: `src/components/admin/CategoryPreview.tsx`
- Modify: `src/app/admin/(protected)/groups/new/page.tsx`
- Modify: `src/app/admin/(protected)/groups/[id]/page.tsx`
- Modify: `src/app/admin/(protected)/categories/new/page.tsx`
- Modify: `src/app/admin/(protected)/categories/[...id]/page.tsx`

**Interfaces:**
- Consumes: `GroupTranslationsInput`, `CategoryTranslationsInput`
- Produces: form payloads of shape `{ slug, position?, translations }` and `{ group, slug, image, translations }`

- [ ] **Step 1: Write the failing UI smoke tests as manual acceptance criteria in code comments**

```tsx
// Acceptance criteria to implement:
// 1. onglets ES / EN / DE / IT visibles dès l'ouverture du formulaire
// 2. changer d'onglet ne perd jamais le brouillon courant
// 3. l'aperçu catégorie suit la langue active
// 4. l'enregistrement poste `translations` à l'API
```

- [ ] **Step 2: Verify the current forms cannot meet the new payload shape**

Run: `rg -n "labelEn|descriptionEn|guideIntroEn|guideClosingEn|setLabel\\(|setDescription\\(" src/components/admin/GroupForm.tsx src/components/admin/CategoryForm.tsx`

Expected: only single-language state plus some English-only assumptions.

- [ ] **Step 3: Refactor the forms to locale-tab state**

```tsx
const [locale, setLocale] = useState<CatalogLocale>("es");
const [translations, setTranslations] = useState<CategoryTranslationsInput>(
  initialData?.translations ?? emptyCategoryTranslations(),
);

function updateLocale<K extends keyof CategoryLocaleInput>(
  code: CatalogLocale,
  key: K,
  value: CategoryLocaleInput[K],
) {
  setTranslations((current) => ({
    ...current,
    [code]: { ...current[code], [key]: value },
  }));
}
```

- [ ] **Step 4: Manually verify the forms against the acceptance criteria**

Run: `npm run dev`

Check:
- `/admin/groups/new`
- `/admin/categories/new`
- `/admin/categories/<group>/<slug>`

Expected: the 4 tabs keep their drafts, preview tracks the active locale, and save returns 200.

- [ ] **Step 5: Commit the multilingual group/category admin**

```bash
git add src/components/admin/GroupForm.tsx src/components/admin/CategoryForm.tsx src/components/admin/CategoryPreview.tsx 'src/app/admin/(protected)/groups/new/page.tsx' 'src/app/admin/(protected)/groups/[id]/page.tsx' 'src/app/admin/(protected)/categories/new/page.tsx' 'src/app/admin/(protected)/categories/[...id]/page.tsx'
git commit -m "feat: add language tabs to group and category admin"
```

### Task 7: Passer le formulaire produit, l'aperçu et l'API au multilingue

**Files:**
- Modify: `src/components/admin/ProductForm.tsx`
- Modify: `src/components/admin/ProductPreview.tsx`
- Modify: `src/app/api/admin/products/route.ts`
- Modify: `src/app/api/admin/products/[id]/route.ts`
- Modify: `src/server/productInput.ts`
- Modify: `src/server/store.ts`
- Modify: `src/app/admin/(protected)/products/new/page.tsx`
- Modify: `src/app/admin/(protected)/products/[id]/page.tsx`

**Interfaces:**
- Consumes: `ProductTranslationsInput`, `VariantInput["labels"]`
- Produces: form payload `{ categoryId, brand, image, images, price, ...globals, translations, sections, variants }`
- Produces: preview props `{ locale: CatalogLocale; translations: ProductTranslationsInput; variants: VariantInput[] }`

- [ ] **Step 1: Extend the product input test with sections and variant labels**

```ts
test("parseProductInput conserve les sections et labels de variantes par locale", () => {
  const { values, errors } = parseProductInput({
    categoryId: "nuevos/un-caballo",
    brand: "Sirius",
    price: "8990,00 €",
    translations: {
      es: { name: "S77", shortDescription: "ES", description: "Desc ES", bullets: ["Uno"] },
      en: { name: "S77", shortDescription: "EN", description: "Desc EN", bullets: ["One"] },
      de: { name: "S77", shortDescription: "DE", description: "Desc DE", bullets: ["Eins"] },
      it: { name: "S77", shortDescription: "IT", description: "Desc IT", bullets: ["Uno IT"] },
    },
    sections: [
      {
        translations: {
          es: { heading: "Uso", body: "Texto" },
          en: { heading: "Use", body: "Text" },
          de: { heading: "Einsatz", body: "Text" },
          it: { heading: "Uso", body: "Testo" },
        },
      },
    ],
    variants: [
      {
        labels: { es: "Base", en: "Base", de: "Basis", it: "Base" },
        price: "8990,00 €",
      },
    ],
  }, "create");

  assert.deepEqual(errors, []);
  assert.equal(values.sections?.[0].translations.de.heading, "Einsatz");
  assert.equal(values.variants?.[0].labels.de, "Basis");
});
```

- [ ] **Step 2: Run the product input tests and confirm they fail on sections/labels**

Run: `node --test --import tsx src/server/productInput.test.ts`

Expected: FAIL until `sections.translations` and `variants[].labels` are parsed.

- [ ] **Step 3: Refactor ProductForm and ProductPreview around the active locale**

```tsx
const [locale, setLocale] = useState<CatalogLocale>("es");
const [translations, setTranslations] = useState<ProductTranslationsInput>(
  initialData?.translations ?? emptyProductTranslations(),
);

function draft(code: CatalogLocale) {
  return translations[code];
}

<ProductPreview
  locale={locale}
  translations={translations}
  variants={variants}
  // global props...
/>
```

```tsx
// src/components/admin/ProductPreview.tsx
const copy = PRODUCT_PREVIEW_MESSAGES[locale];
<h2>{copy.features}</h2>
```

- [ ] **Step 4: Re-run product input tests and manually verify the product editor**

Run: `node --test --import tsx src/server/productInput.test.ts`

Run: `npm run dev`

Check:
- `/admin/products/new`
- `/admin/products/<id>`

Expected:
- tests PASS
- four tabs visible
- preview matches the active tab language
- saving preserves global fields and locale fields separately

- [ ] **Step 5: Commit the multilingual product admin**

```bash
git add src/components/admin/ProductForm.tsx src/components/admin/ProductPreview.tsx 'src/app/api/admin/products/route.ts' 'src/app/api/admin/products/[id]/route.ts' src/server/productInput.ts src/server/productInput.test.ts src/server/store.ts 'src/app/admin/(protected)/products/new/page.tsx' 'src/app/admin/(protected)/products/[id]/page.tsx'
git commit -m "feat: add language tabs to product admin"
```

### Task 8: Traduire les corpus versionnés et backfiller le catalogue existant

**Files:**
- Modify: `src/messages/es.json`
- Modify: `src/messages/en.json`
- Modify: `src/messages/de.json`
- Modify: `src/messages/it.json`
- Modify: `src/content/legal/en.ts`
- Modify: `src/content/legal/de.ts`
- Modify: `src/content/legal/it.ts`
- Create: `scripts/data/catalogTranslations.ts`
- Create: `scripts/backfill-catalog-translations.ts`

**Interfaces:**
- Produces: `export const catalogTranslations: { groups: ...; categories: ...; products: ... }`
- Produces: CLI `tsx scripts/backfill-catalog-translations.ts [--dry-run]`

- [ ] **Step 1: Write the dry-run contract for the catalog translation backfill**

```ts
// scripts/backfill-catalog-translations.ts
// Expected dry-run summary format:
// groups: <count> updated
// categories: <count> updated
// products: <count> updated
// variants: <count> updated
// missing: 0
```

- [ ] **Step 2: Check that the current repo has no backfill script**

Run: `rg -n "backfill-catalog-translations|catalogTranslations" scripts src`

Expected: no matching translation backfill script yet.

- [ ] **Step 3: Implement the translated corpora and the one-off backfill script**

```ts
// scripts/data/catalogTranslations.ts
export const catalogTranslations = {
  groups: {
    nuevos: { en: "New trailers", de: "Neue Anhänger", it: "Rimorchi nuovi" },
    ocasion: { en: "Used trailers", de: "Gebrauchte Anhänger", it: "Rimorchi usati" },
  },
  // categories and products keyed by stable slug/group/category ids
} as const;

// scripts/backfill-catalog-translations.ts
for (const product of await prisma.product.findMany({ select: { id: true, slug: true } })) {
  const translation = catalogTranslations.products[product.slug];
  if (!translation) missing.push(product.slug);
  else if (!dryRun) {
    await prisma.product.update({
      where: { id: product.id },
      data: {
        nameEn: translation.en.name,
        nameDe: translation.de.name,
        nameIt: translation.it.name,
        shortDescriptionEn: translation.en.shortDescription,
        shortDescriptionDe: translation.de.shortDescription,
        shortDescriptionIt: translation.it.shortDescription,
      },
    });
  }
}
```

- [ ] **Step 4: Run the dry-run and the final verification commands**

Run: `tsx scripts/backfill-catalog-translations.ts --dry-run`

Expected: summary with `missing: 0`

Run: `npm test`

Run: `npm run lint`

Expected: all automated checks PASS after the content files and backfill script land.

- [ ] **Step 5: Commit the translated corpora and backfill tooling**

```bash
git add src/messages/es.json src/messages/en.json src/messages/de.json src/messages/it.json src/content/legal/en.ts src/content/legal/de.ts src/content/legal/it.ts scripts/data/catalogTranslations.ts scripts/backfill-catalog-translations.ts
git commit -m "feat: translate legal and catalog content in four languages"
```

## Self-Review

- Spec coverage:
  - 4 locales public routing: Task 1
  - pages légales et admin 4 langues: Task 2
  - schéma Prisma `De` / `It`: Task 3
  - fallback storefront et `hreflang`: Tasks 1 and 4
  - admin groupes/catégories/produits à onglets: Tasks 5, 6, 7
  - switcher select avec drapeaux: Task 1
  - traduction des corpus et backfill catalogue: Task 8
- Placeholder scan:
  - no `TODO`, `TBD`, “implement later” or “similar to task N” left in the plan
- Type consistency:
  - locale domain centralized on `CatalogLocale`
  - admin payloads converge on `translations`
  - variant labels converge on `labels: Record<CatalogLocale, string>`

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-20-i18n-quatre-langues.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
