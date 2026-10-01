# Identité Equinomad — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** retirer toute trace de l'ancien client (Remolque Caballos / Equivan) du code, des données livrées, des scripts et de la base Neon, et installer l'identité Equinomad depuis une configuration centrale.

**Architecture:** deux modules de configuration (`src/config/brand.ts`, `src/config/company.ts`) deviennent la seule source du nom, du domaine, de l'e-mail et des coordonnées. Le code les importe ; les fichiers JSON (messages, données livrées) portent le texte « Equinomad ». La base est nettoyée par un script unique, à blanc par défaut, transactionnel avec `--apply`, dont la logique de texte vit dans des fonctions pures testées.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript strict, Prisma 7 + PostgreSQL (Neon), next-intl, tests `node --test` via `tsx`, sharp pour les images.

**Spec:** `docs/superpowers/specs/2026-10-01-identite-equinomad-design.md`

## Global Constraints

- Travailler uniquement dans `D:\PROJETS\PRUDENCE\bockmann`. Ne jamais toucher `D:\PROJETS\PRUDENCE\remolquecaballos`.
- Marque : `Equinomad`. Domaine : `equinomad.com`. URL : `https://equinomad.com` (sans `www`). E-mail public : `info@equinomad.com`.
- Préfixe de commande : `EQ` → `EQ-AAAA-NNNNNN`. Le plancher `ORDER_NUMBER_BASE = 14_678` est conservé.
- Dossier Cloudinary des envois futurs : `equinomad/products`. Clé du panier local : `equinomad.cart.v1`.
- Valeurs inconnues de la société : marqueur `[A COMPLETAR: …]`.
- Compte admin : `d97515139@gmail.com`.
- TypeScript strict, pas de `any`, exports nommés, indentation 2 espaces, commentaires en français comme le reste du dépôt.
- Next.js 16 diffère des versions connues : lire le guide concerné dans `node_modules/next/dist/docs/` avant tout code spécifique à Next.
- Commits au nom de `d97515139-collab` (configuration locale déjà en place), **sans** ligne `Co-Authored-By` (demande du client).
- Commandes : tests `npm test` ; lint `npm run lint` ; types `npx tsc --noEmit`.
- Le build de production complet ne tourne pas sur le poste (mémoire) : ne pas le lancer.

## Review Focus

1. **Données légales en base** : après remplacement, `LegalContent.data` doit rester un JSON valide et ne plus contenir ni Petra, ni l'ancien téléphone, ni l'ancien domaine — test dans la tâche 11.
2. **Re-lancement du script** : appliquer deux fois les fonctions de remplacement doit donner le même texte (idempotence) — test dans la tâche 11.
3. **Pied de page avec téléphone non renseigné** : aucun lien `https://wa.me/` vide — test `companyWhatsappDigits` dans la tâche 1.
4. **Noms de produits** : « Remolque Caballos para 2 caballos » doit devenir « Remolque para 2 caballos », pas « Equinomad para 2 caballos » — test dans la tâche 11.
5. **Flux Merchant** : une occasion sans marque reste prête à la diffusion ; un produit neuf sans marque reste bloqué — tests dans la tâche 3.

---

### Task 1: Configuration centrale de la marque et de la société

**Files:**
- Create: `src/config/brand.ts`, `src/config/brand.test.ts`
- Create: `src/config/company.ts`, `src/config/company.test.ts`
- Modify: `src/content/legal/es.ts:1-100` (retirer `COMPANY`, l'importer)
- Modify: `src/content/legal/en.ts:1-30,120,200,561,630`
- Modify: `src/content/legal/index.ts:23`
- Modify: `src/components/Footer.tsx:12,66-80`
- Modify: `src/components/ContactBubble.tsx:18-19`

**Interfaces:**
- Produces: `BRAND` (`name`, `domain`, `siteUrl`, `email`, `orderPrefix`, `cloudinaryFolder`, `cartStorageKey`), `publicSiteUrl(): string`, `COMPANY` (mêmes champs qu'aujourd'hui), `PENDING_MARK`, `missingCompanyFields(company?): string[]`, `companyWhatsappDigits(): string`.

- [ ] **Step 1: Écrire les tests**

`src/config/brand.test.ts` :

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { BRAND, publicSiteUrl } from "./brand";

test("BRAND porte l'identité Equinomad", () => {
  assert.equal(BRAND.name, "Equinomad");
  assert.equal(BRAND.domain, "equinomad.com");
  assert.equal(BRAND.siteUrl, "https://equinomad.com");
  assert.equal(BRAND.email, "info@equinomad.com");
  assert.equal(BRAND.orderPrefix, "EQ");
});

test("publicSiteUrl retombe sur BRAND.siteUrl sans variable d'environnement", () => {
  const avant = process.env.NEXT_PUBLIC_SITE_URL;
  delete process.env.NEXT_PUBLIC_SITE_URL;
  try {
    assert.equal(publicSiteUrl(), "https://equinomad.com");
  } finally {
    if (avant !== undefined) process.env.NEXT_PUBLIC_SITE_URL = avant;
  }
});

test("publicSiteUrl suit la variable d'environnement et retire la barre finale", () => {
  const avant = process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000/";
  try {
    assert.equal(publicSiteUrl(), "http://localhost:3000");
  } finally {
    if (avant === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = avant;
  }
});
```

`src/config/company.test.ts` :

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { COMPANY, PENDING_MARK, companyWhatsappDigits, missingCompanyFields } from "./company";

test("les coordonnées inconnues portent le marqueur et sont listées", () => {
  assert.deepEqual(missingCompanyFields(), [
    "name", "legalForm", "street", "city", "phone", "managingDirector",
    "register", "siren", "siret", "capital", "vatId", "host",
  ]);
  assert.ok(COMPANY.name.startsWith(PENDING_MARK));
});

test("les champs connus viennent de la marque", () => {
  assert.equal(COMPANY.email, "info@equinomad.com");
  assert.equal(COMPANY.domain, "equinomad.com");
  assert.equal(COMPANY.country, "España");
});

test("une société complète n'a plus de champ manquant", () => {
  assert.deepEqual(missingCompanyFields({ name: "Equinomad, S.L.", city: "28001 Madrid" }), []);
});

test("sans numéro renseigné ni surcharge, pas de chiffres WhatsApp", () => {
  const avant = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  try {
    assert.equal(companyWhatsappDigits(), "");
  } finally {
    if (avant !== undefined) process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = avant;
  }
});

test("la surcharge NEXT_PUBLIC_WHATSAPP_NUMBER est réduite à ses chiffres", () => {
  const avant = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "+34 600 11 22 33";
  try {
    assert.equal(companyWhatsappDigits(), "34600112233");
  } finally {
    if (avant === undefined) delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    else process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = avant;
  }
});
```

- [ ] **Step 2: Vérifier l'échec**

Run: `npx tsx --test src/config/brand.test.ts src/config/company.test.ts`
Expected: FAIL, modules `./brand` et `./company` introuvables.

- [ ] **Step 3: Écrire les modules**

`src/config/brand.ts` :

```ts
/**
 * Identité de la marque : seule source du nom, du domaine et des identifiants
 * techniques qui en dérivent (préfixe de commande, dossier d'images, clé du
 * panier). Les fichiers JSON, qui ne peuvent rien importer, écrivent
 * « Equinomad » en toutes lettres ; tout le code TypeScript passe par ici.
 */
export const BRAND = {
  name: "Equinomad",
  domain: "equinomad.com",
  siteUrl: "https://equinomad.com",
  email: "info@equinomad.com",
  orderPrefix: "EQ",
  cloudinaryFolder: "equinomad/products",
  cartStorageKey: "equinomad.cart.v1",
} as const;

/**
 * URL publique de la boutique, sans barre finale. NEXT_PUBLIC_SITE_URL garde la
 * priorité (développement, préproduction) ; le domaine de la marque sert de repli.
 */
export function publicSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? BRAND.siteUrl).replace(/\/+$/, "");
}
```

`src/config/company.ts` :

```ts
import { BRAND } from "./brand";

/**
 * Coordonnées de la société éditrice, source unique pour les pages légales, la
 * facture, le pied de page, la bulle de contact, le flux Merchant et les
 * e-mails. Elles ne dépendent pas de la base : ces mentions engagent la société
 * et ne se modifient pas depuis le back-office.
 *
 * Tant que le client n'a pas transmis ses coordonnées, les champs inconnus
 * portent le marqueur PENDING_MARK. `npm run check:launch` refuse la mise en
 * ligne tant qu'il en reste un.
 */
export const PENDING_MARK = "[A COMPLETAR";

function pending(what: string): string {
  return `${PENDING_MARK}: ${what}]`;
}

export const COMPANY = {
  name: pending("razón social"),
  /** Forme sociale. */
  legalForm: pending("forma jurídica"),
  /** Adresse du siège, reprise dans les pages légales, la facture et l'adresse de retour. */
  street: pending("dirección del domicilio social"),
  /** Le code postal ouvre la ligne, comme le veut l'usage espagnol. */
  city: pending("código postal y municipio"),
  country: "España",
  email: BRAND.email,
  /** Ligne WhatsApp publiée (messages uniquement). */
  phone: pending("teléfono o WhatsApp"),
  /** Administrateur — responsable éditorial au sens de la LSSI-CE. */
  managingDirector: pending("administrador"),
  /** Inscription au Registro Mercantil (art. 10 LSSI-CE). */
  register: pending("datos del Registro Mercantil"),
  /** Noms hérités du gabarit : siren = CIF, siret = code d'établissement du siège. */
  siren: pending("CIF"),
  siret: pending("código del establecimiento"),
  capital: pending("capital social"),
  /** Numéro de TVA intracommunautaire espagnol. */
  vatId: pending("NIF-IVA"),
  domain: BRAND.domain,
  /** Hébergeur, à nommer au titre de l'article 10 de la LSSI-CE. */
  host: pending("proveedor de alojamiento"),
} as const;

/** Champs qui portent encore le marqueur, dans l'ordre de déclaration. */
export function missingCompanyFields(
  company: Readonly<Record<string, string>> = COMPANY,
): string[] {
  return Object.entries(company)
    .filter(([, value]) => value.includes(PENDING_MARK))
    .map(([key]) => key);
}

/**
 * Chiffres du numéro WhatsApp, prêts pour wa.me. La variable
 * NEXT_PUBLIC_WHATSAPP_NUMBER prime ; un numéro encore à compléter donne une
 * chaîne vide, et l'interface masque alors le lien au lieu d'ouvrir « wa.me/ ».
 */
export function companyWhatsappDigits(): string {
  const override = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  if (override) return override;
  return COMPANY.phone.includes(PENDING_MARK) ? "" : COMPANY.phone.replace(/\D/g, "");
}
```

- [ ] **Step 4: Vérifier le succès**

Run: `npx tsx --test src/config/brand.test.ts src/config/company.test.ts`
Expected: PASS (8 tests).

- [ ] **Step 5: Brancher les pages légales**

Dans `src/content/legal/es.ts` :
- ligne 2, remplacer `— Remolque Caballos.` par `— Equinomad.` ;
- supprimer tout le bloc `const COMPANY = { … } as const;` (lignes 27-90 environ, commentaire de tête compris) et ajouter en haut, après `import type { LegalPageMap } from "./types";` :

```ts
import { BRAND } from "@/config/brand";
import { COMPANY } from "@/config/company";
```

- ligne `DISCLAIMER` : remplacer `"Aviso: este texto es un modelo redactado para la tienda en línea Remolque Caballos. Antes…` par un gabarit `` `Aviso: este texto es un modelo redactado para la tienda en línea ${BRAND.name}. Antes…` `` (reste de la phrase inchangé) ;
- ligne 165 environ : `a través de www.remolquecaballos.com,` devient `` a través de ${COMPANY.domain}, `` (la chaîne passe en gabarit à backticks).

Dans `src/content/legal/en.ts` :
- `import { COMPANY } from "./es";` devient `import { COMPANY } from "@/config/company";` et ajouter `import { BRAND } from "@/config/brand";` ;
- ligne 2 : `— Remolque Caballos.` devient `— Equinomad.` ;
- lignes 26, 120 et 561 : chaque `Remolque Caballos` devient `${BRAND.name}` (passer la chaîne en gabarit à backticks si elle est entre guillemets) ;
- lignes 200 et 630 : `privacidad@remolquecaballos.com` devient `${COMPANY.email}` (chaîne passée en gabarit).

Dans `src/content/legal/index.ts`, ligne 23 : `export { COMPANY } from "./es";` devient `export { COMPANY } from "@/config/company";`.

- [ ] **Step 6: Masquer WhatsApp quand le numéro manque**

`src/components/ContactBubble.tsx`, lignes 18-19 :

```ts
const WHATSAPP_NUMBER = companyWhatsappDigits();
```

avec `import { companyWhatsappDigits } from "@/config/company";` (l'import de `COMPANY` reste pour l'e-mail). Le reste du composant gère déjà une valeur vide (`whatsappHref` à `undefined`).

`src/components/Footer.tsx` :
- ligne 12 : remplacer `const WHATSAPP_HREF = …` par `const WHATSAPP_DIGITS = companyWhatsappDigits();` et importer `companyWhatsappDigits` depuis `@/config/company` ;
- envelopper le paragraphe WhatsApp (le `<p className="flex items-center gap-2">` qui contient `<MessageCircle …/>` et le lien `href={WHATSAPP_HREF}`) **et** le paragraphe d'avertissement qui le suit (« La ligne ne prend pas d'appel… ») dans `{WHATSAPP_DIGITS ? (<>…</>) : null}` ;
- dans ce bloc, `href={WHATSAPP_HREF}` devient `` href={`https://wa.me/${WHATSAPP_DIGITS}`} ``.

- [ ] **Step 7: Vérifier**

Run: `npm test` puis `npx tsc --noEmit`
Expected: tous les tests passent, aucune erreur de types.

- [ ] **Step 8: Commit**

```bash
git add src/config src/content/legal src/components/Footer.tsx src/components/ContactBubble.tsx
git commit -m "feat: configuration centrale de la marque et de la société Equinomad"
```

---

### Task 2: Affichage d'un produit sans marque

**Files:**
- Create: `src/lib/brandName.ts`, `src/lib/brandName.test.ts`
- Modify: `src/components/cart/CartDrawer.tsx:125,135,175`
- Modify: `src/components/cart/CartView.tsx:150,160,219`
- Modify: `src/components/checkout/CheckoutFlow.tsx:571`, `src/components/checkout/CheckoutSummary.tsx:39,48`
- Modify: `src/components/ProductCard.tsx:53`, `src/components/RecentlyViewedView.tsx:62`, `src/components/wishlist/WishlistView.tsx:68`
- Modify: `src/components/CategoryProductBrowser.tsx:79`
- Modify: `src/components/seo/ProductJsonLd.tsx:150`
- Modify: `src/server/store.ts:596`
- Modify: `src/app/[locale]/[group]/[category]/[product]/page.tsx:76,149`
- Modify: `src/app/[locale]/compte/commandes/[orderNumber]/page.tsx:120,129`
- Modify: `src/app/[locale]/confirmation/[orderNumber]/page.tsx:207,216`

**Interfaces:**
- Produces: `withBrand(brand: string | null | undefined, name: string): string`.

- [ ] **Step 1: Écrire le test**

`src/lib/brandName.test.ts` :

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { withBrand } from "./brandName";

test("marque et modèle sont séparés par une espace", () => {
  assert.equal(withBrand("Böckmann", "Portax"), "Böckmann Portax");
});

test("sans marque, le modèle seul, sans espace en tête", () => {
  assert.equal(withBrand("", "Van para dos caballos"), "Van para dos caballos");
  assert.equal(withBrand("   ", "Van"), "Van");
  assert.equal(withBrand(null, "Van"), "Van");
});
```

- [ ] **Step 2: Vérifier l'échec**

Run: `npx tsx --test src/lib/brandName.test.ts`
Expected: FAIL, module introuvable.

- [ ] **Step 3: Écrire le module**

`src/lib/brandName.ts` :

```ts
/**
 * Nom affiché d'un produit : « Marque Modèle », ou le modèle seul quand la
 * marque est vide — cas des remorques d'occasion dont le fabricant est inconnu.
 */
export function withBrand(brand: string | null | undefined, name: string): string {
  return [brand?.trim(), name.trim()].filter(Boolean).join(" ");
}
```

- [ ] **Step 4: Vérifier le succès**

Run: `npx tsx --test src/lib/brandName.test.ts`
Expected: PASS.

- [ ] **Step 5: Utiliser `withBrand` et masquer la marque vide**

Partout où un gabarit écrit `` `${x.brand} ${x.name}` `` (attributs `alt`, `aria-label`, `metaTitle`, `alt` de `store.ts:596`), le remplacer par `withBrand(x.brand, x.name)` et importer `withBrand` depuis `@/lib/brandName`. Fichiers : `CartDrawer.tsx:125,175`, `CartView.tsx:150,219`, `CheckoutSummary.tsx:39`, `store.ts:596`, `[product]/page.tsx:76`, `compte/commandes/[orderNumber]/page.tsx:120`, `confirmation/[orderNumber]/page.tsx:207`.

Partout où la marque est rendue seule dans un élément (`{line.brand}`, `{product.brand}`, `{item.brand}`, `{productData.brand}`), n'afficher l'élément que si la marque n'est pas vide. Exemple pour `CartDrawer.tsx:135`, à reproduire tel quel sur chaque site :

```tsx
{line.brand.trim() ? (
  <p className="…classes existantes…">{line.brand}</p>
) : null}
```

(garder la balise et les classes existantes de chaque fichier). Sites : `CartDrawer.tsx:135`, `CartView.tsx:160`, `CheckoutFlow.tsx:571`, `CheckoutSummary.tsx:48`, `ProductCard.tsx:53`, `RecentlyViewedView.tsx:62`, `WishlistView.tsx:68`, `[product]/page.tsx:149`, `compte/commandes/[orderNumber]/page.tsx:129`, `confirmation/[orderNumber]/page.tsx:216`.

`CategoryProductBrowser.tsx:79` : ne compter que les marques non vides, pour qu'aucun filtre « vide » n'apparaisse :

```ts
if (product.brand.trim()) counts.set(product.brand, (counts.get(product.brand) ?? 0) + 1);
```

`ProductJsonLd.tsx:150` : n'émettre la marque que si elle existe :

```ts
...(row.brand.trim() ? { brand: { "@type": "Brand", name: row.brand } } : {}),
```

- [ ] **Step 6: Vérifier**

Run: `npm test`, `npx tsc --noEmit`, `npm run lint`
Expected: tout passe.

- [ ] **Step 7: Commit**

```bash
git add src/lib/brandName.ts src/lib/brandName.test.ts src/components src/server/store.ts "src/app/[locale]"
git commit -m "feat: afficher proprement un produit sans marque"
```

---

### Task 3: Flux Google Merchant

**Files:**
- Modify: `src/server/merchant.ts:40-55,326-345,422,497,625-631`
- Modify: `src/server/merchant.test.ts:15` (+ nouveaux tests)
- Modify: `src/app/feed/google/route.ts:15,116`
- Modify: `src/app/feed/google-csv/route.ts:12,126`

**Interfaces:**
- Consumes: `BRAND`, `publicSiteUrl()` (Task 1), `COMPANY` (Task 1), `withBrand()` (Task 2).
- Produces: `MerchantRecord.brand` devient optionnel (`brand?: string`) ; `SHOP_NAME`, `SHOP_PHONE`, `siteUrl()` gardent leur nom et leur signature.

- [ ] **Step 1: Adapter la fixture et écrire les tests**

Dans `src/server/merchant.test.ts`, ligne 15 : `brand: "Remolque Caballos",` devient `brand: "Böckmann",`. Ajouter à la fin du fichier :

```ts
test("une occasion sans marque reste diffusable, sans attribut brand", () => {
  const p = produit({ brand: "", condition: "used", name: "Van para dos caballos" });
  const record = buildMerchantRecord(p);
  assert.equal(record.brand, undefined);
  assert.equal(record.identifierExists, "no");
  assert.equal(record.title, "Van para dos caballos");
  const audit = auditMerchantProduct(p);
  assert.equal(audit.ready, true);
  assert.ok(audit.issues.some((i) => i.attribute === "brand" && i.level === "warning"));
});

test("un produit neuf sans marque reste bloqué", () => {
  const audit = auditMerchantProduct(produit({ brand: "", condition: "new" }));
  assert.equal(audit.ready, false);
  assert.ok(audit.issues.some((i) => i.attribute === "brand" && i.level === "error"));
});

test("la description de repli ne laisse pas de marque vide", () => {
  const texte = merchantDescription(
    produit({ brand: "", condition: "used", description: "", shortDescription: "" }),
  );
  assert.ok(!texte.startsWith(" "));
  assert.ok(!texte.includes(" par ."));
});
```

- [ ] **Step 2: Vérifier l'échec**

Run: `npx tsx --test src/server/merchant.test.ts`
Expected: FAIL sur les trois nouveaux tests.

- [ ] **Step 3: Modifier `src/server/merchant.ts`**

Imports en tête :

```ts
import { BRAND, publicSiteUrl } from "@/config/brand";
import { COMPANY } from "@/config/company";
import { withBrand } from "@/lib/brandName";
```

Lignes 42-45 :

```ts
// Alignés sur la configuration centrale (src/config), qui fait autorité pour
// les mentions légales, la facture PDF et ce flux.
export const SHOP_NAME = BRAND.name;
export const SHOP_PHONE = COMPANY.phone;
```

`siteUrl()` (ligne 51) :

```ts
export function siteUrl(): string {
  return publicSiteUrl();
}
```

`merchantTitle` (ligne 326) :

```ts
export function merchantTitle(product: MerchantProduct): string {
  return plainText(withBrand(product.brand, product.name)).slice(0, 150);
}
```

Dans `merchantDescription`, la première entrée de `parts` devient :

```ts
    product.brand.trim()
      ? `${withBrand(product.brand, product.name)} — ${product.category.label} par ${product.brand.trim()}.`
      : `${product.name} — ${product.category.label}.`,
```

Interface `MerchantRecord` (ligne 422) : `brand: string;` devient `brand?: string;`. Dans `buildMerchantRecord` (ligne 497) :

```ts
    brand: product.brand.trim() ? product.brand.trim().slice(0, 70) : undefined,
```

Dans `auditMerchantProduct`, remplacer le bloc `if (!product.brand.trim()) { … }` (ligne 625) par :

```ts
  if (!product.brand.trim()) {
    if (conditionFor(product.condition) === "new") {
      issues.push({
        level: "error",
        attribute: "brand",
        message: "Marque manquante — c'est un attribut obligatoire pour les articles neufs.",
      });
    } else {
      issues.push({
        level: "warning",
        attribute: "brand",
        message:
          "Occasion sans marque connue : le flux omet g:brand et déclare identifier_exists=no, comme Google l'admet pour un article d'occasion.",
      });
    }
  }
```

`MerchantAudit.brand` (ligne 541) reste `string`.

Dans les routes de flux, si `record.brand` est passé à une fonction typée `string`, utiliser `record.brand ?? ""` (le `tag()` XML ligne 36 et la cellule CSV ignorent déjà une valeur vide : le vérifier en lisant ces fonctions).

- [ ] **Step 4: Nettoyer les routes de flux**

- `src/app/feed/google/route.ts:15` et `src/app/feed/google-csv/route.ts:12` : dans le commentaire, `https://remolquecaballos.com/feed/…` devient `https://equinomad.com/feed/…`.
- `src/app/feed/google/route.ts:116` : la description de canal « bois de chauffage » devient `` `Remorques et vans pour chevaux — ${SHOP_NAME}` `` (importer `SHOP_NAME` depuis `@/server/merchant` s'il ne l'est pas déjà).
- `src/app/feed/google-csv/route.ts:126` : `hausgeraete-pfeffer-google-feed.tsv` devient `equinomad-google-feed.tsv`.

- [ ] **Step 5: Vérifier le succès**

Run: `npx tsx --test src/server/merchant.test.ts` puis `npx tsc --noEmit`
Expected: PASS, aucune erreur de types.

- [ ] **Step 6: Commit**

```bash
git add src/server/merchant.ts src/server/merchant.test.ts src/app/feed
git commit -m "feat: flux Merchant Equinomad, occasions sans marque diffusables"
```

---

### Task 4: Identifiants techniques et URL de repli

**Files:**
- Modify: `src/server/orders.ts:325-352` ; Test: `src/server/orderNumber.test.ts` (nouveau)
- Modify: `src/lib/cart.ts:14`, `src/server/cloudinary.ts:18`, `src/lib/mailer.ts:7,10,22`
- Modify: `src/server/gateways/paypal.ts:188`, `src/server/gateways/types.ts:95`
- Modify: `src/lib/hreflang.ts:9`, `src/app/sitemap.ts:5`, `src/app/robots.ts:3`, `src/components/legal/LegalPageView.tsx:11`
- Modify: `src/app/api/cron/campaigns/route.ts:15`

**Interfaces:**
- Consumes: `BRAND`, `publicSiteUrl()` (Task 1).
- Produces: `orderNumberPrefix(year: number): string`.

- [ ] **Step 1: Écrire le test**

`src/server/orderNumber.test.ts` :

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { orderNumberPrefix } from "../lib/orderNumber";

test("le préfixe de commande est EQ-AAAA-", () => {
  assert.equal(orderNumberPrefix(2026), "EQ-2026-");
});
```

- [ ] **Step 2: Vérifier l'échec**

Run: `npx tsx --test src/server/orderNumber.test.ts`
Expected: FAIL, module `../lib/orderNumber` introuvable.

- [ ] **Step 3: Implémenter**

`src/lib/orderNumber.ts` (module sans dépendance serveur, testable sans base) :

```ts
import { BRAND } from "@/config/brand";

/** Préfixe des numéros de commande de l'année : « EQ-2026- ». */
export function orderNumberPrefix(year: number): string {
  return `${BRAND.orderPrefix}-${year}-`;
}
```

Dans `src/server/orders.ts`, `nextOrderNumber` : `` const prefix = `RC-${year}-`; `` devient `const prefix = orderNumberPrefix(year);` (import depuis `@/lib/orderNumber`), et le commentaire « RC-AAAA-NNNNNN » devient « EQ-AAAA-NNNNNN ».

- [ ] **Step 4: Vérifier le succès**

Run: `npx tsx --test src/server/orderNumber.test.ts`
Expected: PASS.

- [ ] **Step 5: Remplacer les autres identifiants**

| Fichier:ligne | Avant | Après |
|---|---|---|
| `src/lib/cart.ts:14` | `export const CART_STORAGE_KEY = "equivan.cart.v1";` | `export const CART_STORAGE_KEY = BRAND.cartStorageKey;` |
| `src/server/cloudinary.ts:18` | `export const CLOUDINARY_PRODUCT_FOLDER = "remorqueb-ckmann/productos";` | `export const CLOUDINARY_PRODUCT_FOLDER = BRAND.cloudinaryFolder;` |
| `src/lib/mailer.ts:7` | `ex. "contacto@remolquecaballos.com"` | `ex. "info@equinomad.com"` |
| `src/lib/mailer.ts:10` | `défaut « Remolque Caballos »` | `défaut : le nom de la marque` |
| `src/lib/mailer.ts:22` | `const DEFAULT_FROM_NAME = "Remolque Caballos";` | `const DEFAULT_FROM_NAME = BRAND.name;` |
| `src/server/gateways/paypal.ts:188` | `brand_name: "Remolque Caballos",` | `brand_name: BRAND.name,` |
| `src/server/gateways/types.ts:95` | `« Compte Remolque Caballos — France, EUR »` | `« Compte Equinomad — Espagne, EUR »` |
| `src/lib/hreflang.ts:9` | `const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.remolquecaballos.com").replace(/\/+$/, "");` | `const SITE_URL = publicSiteUrl();` |
| `src/app/sitemap.ts:5` | `const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://remolquecaballos.com";` | `const SITE_URL = publicSiteUrl();` |
| `src/app/robots.ts:3` | idem | `const SITE_URL = publicSiteUrl();` |
| `src/components/legal/LegalPageView.tsx:11` | idem | `const SITE_URL = publicSiteUrl();` |
| `src/app/api/cron/campaigns/route.ts:15` | `https://remolquecaballos.com/api/cron/campaigns` | `https://equinomad.com/api/cron/campaigns` |

Ajouter l'import adapté dans chaque fichier : `import { BRAND } from "@/config/brand";` ou `import { publicSiteUrl } from "@/config/brand";`.

Puis :

Run: `grep -rn "RC-20" src`
Expected: aucune occurrence ; si un test en contient, remplacer `RC-` par `EQ-` dans sa fixture.

- [ ] **Step 6: Vérifier**

Run: `npm test`, `npx tsc --noEmit`, `npm run lint`
Expected: tout passe.

- [ ] **Step 7: Commit**

```bash
git add src
git commit -m "feat: préfixe de commande EQ et identifiants techniques Equinomad"
```

---

### Task 5: Libellés visibles (métadonnées, back-office, textes serveur)

**Files:**
- Modify: `src/app/layout.tsx:28`, `src/app/[locale]/favoris/page.tsx:15`, `src/app/[locale]/vus-recemment/page.tsx:15`, `src/app/[locale]/promo/[slug]/page.tsx:20,23`, `src/components/legal/LegalPageView.tsx:32`
- Modify: `src/app/admin/login/page.tsx:302`, `src/components/admin/AdminSidebar.tsx:109,190`, `src/app/api/admin/products/export/route.ts:197`
- Modify: `src/components/admin/BankTransferForm.tsx:53`, `src/components/admin/CategoryForm.tsx:302`, `src/components/admin/ProductForm.tsx:484`, `src/components/admin/CategoryPreview.tsx:83`, `src/components/admin/RichTextField.tsx:65`, `src/components/admin/ProductImportForm.tsx:45-46`
- Modify: `src/lib/campaigns.ts:347,357`, `src/server/customers.ts:743`, `src/lib/maintenancePage.ts:21,89`

**Interfaces:**
- Consumes: `BRAND` (Task 1).

- [ ] **Step 1: Remplacer les libellés**

| Fichier:ligne | Avant | Après |
|---|---|---|
| `src/app/layout.tsx:28` | `title: "Remolque Caballos \| Remolques para caballos — venta, matriculación y entrega a domicilio",` | `` title: `${BRAND.name} \| Remolques para caballos — venta, matriculación y entrega a domicilio`, `` |
| `favoris/page.tsx:15` | `` title: `${t("title")} \| Remolque Caballos`, `` | `` title: `${t("title")} \| ${BRAND.name}`, `` |
| `vus-recemment/page.tsx:15` | idem | idem |
| `promo/[slug]/page.tsx:20` | `return { title: "Remolque Caballos" };` | `return { title: BRAND.name };` |
| `promo/[slug]/page.tsx:23` | `` `${landing.headline} \| Remolque Caballos` `` | `` `${landing.headline} \| ${BRAND.name}` `` |
| `LegalPageView.tsx:32` | `` `${page.title} \| Remolque Caballos` `` | `` `${page.title} \| ${BRAND.name}` `` |
| `admin/login/page.tsx:302` | `Remolque Caballos — administration` | `{BRAND.name} — administration` |
| `AdminSidebar.tsx:109,190` | `aria-label="Remolque Caballos — administration"` | `` aria-label={`${BRAND.name} — administration`} `` |
| `products/export/route.ts:197` | `title: "Remolque Caballos — Catalogue produits",` | `` title: `${BRAND.name} — Catalogue produits`, `` |
| `BankTransferForm.tsx:53` | `placeholder="ex. Remolque Caballos"` | `` placeholder={`ex. ${BRAND.name}, S.L.`} `` |
| `CategoryForm.tsx:302` | `` url={`remolquecaballos.com/${…}`} `` | `` url={`${BRAND.domain}/${…}`} `` (reste du gabarit inchangé) |
| `ProductForm.tsx:484` | `` url={`remolquecaballos.com/${…}`} `` | `` url={`${BRAND.domain}/${…}`} `` |
| `CategoryPreview.tsx:83` | `` `${displayLabel} chez Remolque Caballos` `` | `` `${displayLabel} chez ${BRAND.name}` `` |
| `RichTextField.tsx:65` | `mailto:contacto@remolquecaballos.com` | `` `mailto:${BRAND.email}` `` (la chaîne passe en gabarit) |
| `campaigns.ts:347` | `headline: "Nouveau chez Remolque Caballos",` | `` headline: `Nouveau chez ${BRAND.name}`, `` |
| `campaigns.ts:357` | `headline: "New at Remolque Caballos",` | `` headline: `New at ${BRAND.name}`, `` |
| `customers.ts:743` | `"… que Remolque Caballos a enregistrées pour " +` | `` `… que ${BRAND.name} a enregistrées pour ` + `` |
| `maintenancePage.ts:21` | `<title>Maintenance en cours — Remolque Caballos</title>` | `<title>Maintenance en cours — ${BRAND.name}</title>` (la page est déjà un gabarit ; sinon le convertir) |
| `maintenancePage.ts:89` | `<a href="mailto:contacto@remolquecaballos.com">contacto@remolquecaballos.com</a>` | `<a href="mailto:${BRAND.email}">${BRAND.email}</a>` |

Dans chaque fichier modifié, ajouter `import { BRAND } from "@/config/brand";`.

`ProductImportForm.tsx:45-46` : les deux lignes d'exemple décrivent encore du bois de chauffage. Les remplacer par deux remorques, au format du `CSV_HEADER` existant (mêmes colonnes, même ordre, séparateur `;`) :

```ts
    `${categoryId};Böckmann;Portax Esprit 2 caballos;9.450,00 €;;Nuevo;Suelo de aluminio|Rampa trasera|Tempo 100;Remolque de dos caballos con suelo de aluminio y rampa trasera amortiguada.`,
    `${categoryId};Cheval Liberté;Gold Origins 2 caballos;7.380,00 €;7.900,00 €;-7%;Poliéster|Puerta lateral|Freno de inercia;Van de dos caballos en poliéster con puerta lateral de salida.`,
```

Avant d'écrire ces lignes, lire `CSV_HEADER` dans le même fichier et ajuster le nombre de colonnes s'il diffère des lignes actuelles (elles en sont le modèle exact).

- [ ] **Step 2: Vérifier**

Run: `npm test`, `npx tsc --noEmit`, `npm run lint`
Expected: tout passe.

- [ ] **Step 3: Commit**

```bash
git add src
git commit -m "feat: libellés du site et du back-office au nom d'Equinomad"
```

---

### Task 6: E-mails transactionnels et marketing

**Files:**
- Create: `src/components/brand/logoDimensions.ts`
- Modify: `src/server/emails/order.ts:34-36,117,406-407,524`
- Modify: `src/server/emails/customerAccount.ts:16-18,48-49,91,203,207`
- Modify: `src/server/emails/adminOtp.ts:21-23,70,122,134`
- Modify: `src/server/emails/campaign.ts:33-52,364-374,399,466-469`
- Modify: `src/components/admin/CampaignStepMessage.tsx:301`
- Modify: `src/server/emails/order.test.ts:19,71`

**Interfaces:**
- Consumes: `BRAND`, `COMPANY` (Task 1).
- Produces: `LOGO_FULL: { width: number; height: number }`, `LOGO_ICON: { width: number; height: number }` exportés par `src/components/brand/logoDimensions.ts` (relus par la tâche 7).

- [ ] **Step 1: Créer les dimensions du logo**

`src/components/brand/logoDimensions.ts` :

```ts
/**
 * Dimensions des images bitmap du logo, produites par scripts/generer-logos.mjs.
 * Les e-mails et le composant Logo les lisent ici : un seul endroit à changer
 * si le logo change de proportions.
 */
export const LOGO_FULL = { width: 1200, height: 256 } as const;
export const LOGO_ICON = { width: 512, height: 512 } as const;
```

- [ ] **Step 2: Aligner les quatre modèles d'e-mail**

Dans `order.ts`, `customerAccount.ts`, `adminOtp.ts` et `campaign.ts`, remplacer :

```ts
const LOGO_HEIGHT = Math.round((LOGO_WIDTH * 162) / 747);
```

par :

```ts
const LOGO_HEIGHT = Math.round((LOGO_WIDTH * LOGO_FULL.height) / LOGO_FULL.width);
```

avec `import { LOGO_FULL } from "@/components/brand/logoDimensions";`, et supprimer le commentaire qui cite le ratio 747×162 s'il y en a un. Dans les mêmes fichiers :

| Fichier:ligne | Avant | Après |
|---|---|---|
| `order.ts:117`, `customerAccount.ts:91`, `adminOtp.ts:70`, `campaign.ts:399` | `alt="Remolque Caballos"` | `alt="${BRAND.name}"` (ces lignes sont déjà dans un gabarit HTML) |
| `order.ts:406` | `"Remolque Caballos — mensaje automático relativo a su pedido."` | `` `${BRAND.name} — mensaje automático relativo a su pedido.` `` |
| `order.ts:407` | `"Remolque Caballos — automated message about your order."` | `` `${BRAND.name} — automated message about your order.` `` |
| `order.ts:524` | `footer: "Remolque Caballos — notificación automática del back-office.",` | `` footer: `${BRAND.name} — notificación automática del back-office.`, `` |
| `customerAccount.ts:48-49` | `"Remolque Caballos — automated message…"` / `"Remolque Caballos — message automatique…"` | `` `${BRAND.name} — automated message…` `` / `` `${BRAND.name} — message automatique…` `` |
| `customerAccount.ts:203` | `"su cuenta de cliente de Remolque Caballos ya está creada…"` | `` `su cuenta de cliente de ${BRAND.name} ya está creada…` `` |
| `customerAccount.ts:207` | `"your Remolque Caballos customer account has been created…"` | `` `your ${BRAND.name} customer account has been created…` `` |
| `adminOtp.ts:122` | `Remolque Caballos — message automatique, merci de ne pas y répondre.` | `${BRAND.name} — message automatique, merci de ne pas y répondre.` |
| `adminOtp.ts:134` | `"Votre code de connexion à l'administration Remolque Caballos",` | `` `Votre code de connexion à l'administration ${BRAND.name}`, `` |

(Le reste de chaque phrase est conservé à l'identique ; ajouter `import { BRAND } from "@/config/brand";`.)

- [ ] **Step 3: Pied d'e-mail marketing depuis COMPANY**

Dans `src/server/emails/campaign.ts`, supprimer la constante `IMPRESSUM` et son commentaire (lignes 33-52 environ, en gardant `LOGO_WIDTH`/`LOGO_HEIGHT`). Ajouter `import { COMPANY } from "@/config/company";` et remplacer chaque `IMPRESSUM.` par `COMPANY.` (lignes 364-374 et 466-469) : les champs `name`, `street`, `city`, `country`, `managingDirector`, `register`, `vatId` existent sous ces noms dans `COMPANY`.

Dans `src/components/admin/CampaignStepMessage.tsx:301`, la ligne d'aperçu

```tsx
EQUIVAN · 27 Grande Rue · 21700 Villebichot
```

devient

```tsx
{COMPANY.name} · {COMPANY.street} · {COMPANY.city}
```

avec `import { COMPANY } from "@/config/company";`.

- [ ] **Step 4: Adapter le test des e-mails**

`src/server/emails/order.test.ts:19` : `const SITE = "https://remolquecaballos.com";` devient `const SITE = "https://equinomad.com";`. Ligne 71 : `brand: "Remolque Caballos",` devient `brand: "Böckmann",`. Si une assertion attend le texte « Remolque Caballos », la remplacer par « Equinomad ».

- [ ] **Step 5: Vérifier**

Run: `npm test`, `npx tsc --noEmit`
Expected: tout passe.

- [ ] **Step 6: Commit**

```bash
git add src/components/brand/logoDimensions.ts src/server/emails src/components/admin/CampaignStepMessage.tsx
git commit -m "feat: e-mails Equinomad, pied marketing tiré des coordonnées centrales"
```

---

### Task 7: Logo provisoire

**Files:**
- Modify: `src/components/brand/Logo.tsx` (réécriture)
- Modify: `scripts/generer-logos.mjs:1-75`
- Regenerate: `public/images/logo-full.png`, `public/images/logo-full-light.png`, `public/images/logo-icon.png`, `src/app/icon.png`

**Interfaces:**
- Consumes: `BRAND` (Task 1), `LOGO_FULL`, `LOGO_ICON` (Task 6).
- Produces: `Logo({ tone?, className?, priority? })` et `BrandMark({ className? })` gardent leur signature (les appels existants ne changent pas).

- [ ] **Step 1: Lire la doc Next.js concernée**

Lire `node_modules/next/dist/docs/` pour la convention des fichiers d'icône d'application (`app/icon.png`), afin de confirmer que le remplacement du fichier suffit.

- [ ] **Step 2: Réécrire `src/components/brand/Logo.tsx`**

```tsx
import { BRAND } from "@/config/brand";
import { cn } from "@/lib/utils";

/**
 * Marque de la boutique — version provisoire.
 *
 * En attendant le logo définitif (sous-projet design), la marque est le nom
 * « Equinomad » composé en Fraunces, précédé d'un sigle : l'initiale E en blanc
 * sur un carré rouge. Le tracé est en SVG : net à toutes les tailles, sans
 * fichier à charger. Les versions bitmap des e-mails sortent de
 * scripts/generer-logos.mjs, qui reproduit ce dessin.
 */

interface LogoProps {
  /** "light" sur fond sombre (pied de page, back-office), "dark" sur fond clair. */
  tone?: "light" | "dark";
  className?: string;
  /** Conservé pour la compatibilité des appels : un SVG en ligne n'a rien à précharger. */
  priority?: boolean;
}

export function Logo({ tone = "light", className }: LogoProps) {
  const claro = tone === "light";

  return (
    <svg
      viewBox="0 0 300 64"
      role="img"
      aria-label={BRAND.name}
      className={cn("h-8 w-auto sm:h-11", className)}
    >
      <rect x="0" y="4" width="56" height="56" rx="12" className="fill-[var(--rojo)]" />
      <text
        x="28"
        y="46"
        textAnchor="middle"
        className="fill-white font-[family-name:var(--font-fraunces)] text-[38px] font-bold"
      >
        E
      </text>
      <text
        x="70"
        y="45"
        className={cn(
          "font-[family-name:var(--font-fraunces)] text-[34px] font-bold tracking-tight",
          claro ? "fill-white" : "fill-[var(--tinta)]",
        )}
      >
        {BRAND.name}
      </text>
    </svg>
  );
}

/** Sigle seul, pour les espaces trop étroits pour le logo complet. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={cn("h-9 w-9", className)}>
      <rect x="0" y="0" width="64" height="64" rx="14" className="fill-[var(--rojo)]" />
      <text
        x="32"
        y="45"
        textAnchor="middle"
        className="fill-white font-[family-name:var(--font-fraunces)] text-[40px] font-bold"
      >
        E
      </text>
    </svg>
  );
}
```

Vérifier dans `src/app/globals.css` que `--rojo` et `--tinta` sont bien définis dans `:root` (ils le sont aujourd'hui) et que `--font-fraunces` est la variable posée par `next/font` dans `src/app/layout.tsx` (c'est le cas).

- [ ] **Step 3: Réécrire les fonctions de dessin de `scripts/generer-logos.mjs`**

Remplacer la constante `CABEZA` et les fonctions `logo()` et `sigle()` par :

```js
const SERIF = "Georgia, 'Times New Roman', serif";
const NOMBRE = "Equinomad";

function logo({ claro }) {
  const letras = claro ? "#ffffff" : "#001424";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 64" width="300" height="64">
  <rect x="0" y="4" width="56" height="56" rx="12" fill="#e3000e"/>
  <text x="28" y="46" text-anchor="middle" font-family="${SERIF}" font-size="38" font-weight="700" fill="#ffffff">E</text>
  <text x="70" y="45" font-family="${SERIF}" font-size="34" font-weight="700" letter-spacing="-0.5" fill="${letras}">${NOMBRE}</text>
</svg>`;
}

function sigle() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect x="0" y="0" width="64" height="64" rx="14" fill="#e3000e"/>
  <text x="32" y="45" text-anchor="middle" font-family="${SERIF}" font-size="40" font-weight="700" fill="#ffffff">E</text>
</svg>`;
}
```

Supprimer `SANS` s'il n'est plus utilisé. Dans la boucle de sortie, fixer la taille de chaque image pour qu'elle corresponde à `logoDimensions.ts`, et ajouter l'icône d'application :

```js
const sorties = [
  ["public/images/logo-full.png", logo({ claro: false }), { r: 255, g: 255, b: 255, alpha: 1 }, 1200],
  ["public/images/logo-full-light.png", logo({ claro: true }), { r: 0, g: 20, b: 36, alpha: 1 }, 1200],
  ["public/images/logo-icon.png", sigle(), { r: 0, g: 0, b: 0, alpha: 0 }, 512],
  ["src/app/icon.png", sigle(), { r: 0, g: 0, b: 0, alpha: 0 }, 512],
];

for (const [chemin, svg, fondo, ancho] of sorties) {
  const png = await sharp(Buffer.from(svg), { density: 600 })
    .resize({ width: ancho })
    .flatten({ background: fondo })
    .png()
    .toBuffer();
  writeFileSync(path.join(RACINE, chemin), png);
  console.log(`${chemin} — ${Math.round(png.length / 1024)} Ko`);
}
```

(`SORTIE` et `mkdirSync` deviennent inutiles si les chemins partent de `RACINE` ; garder `mkdirSync(path.join(RACINE, "public", "images"), { recursive: true })`.) Mettre à jour le commentaire de tête : le script reproduit le logo provisoire Equinomad.

- [ ] **Step 4: Générer et contrôler les images**

Run: `node scripts/generer-logos.mjs`
Expected: quatre lignes de sortie, sans erreur.

Run: `node -e "const s=require('sharp');(async()=>{for(const f of ['public/images/logo-full.png','public/images/logo-full-light.png','public/images/logo-icon.png','src/app/icon.png']){const m=await s(f).metadata();console.log(f,m.width+'x'+m.height)}})()"`
Expected: `1200x256` pour les deux logos complets, `512x512` pour les deux icônes.

Ouvrir `public/images/logo-full.png` (outil de lecture d'image) et vérifier visuellement : sigle rouge avec E blanc, « Equinomad » lisible et non tronqué.

- [ ] **Step 5: Vérifier**

Run: `npx tsc --noEmit`, `npm run lint`
Expected: aucune erreur.

- [ ] **Step 6: Commit**

```bash
git add src/components/brand/Logo.tsx scripts/generer-logos.mjs public/images/logo-full.png public/images/logo-full-light.png public/images/logo-icon.png src/app/icon.png
git commit -m "feat: logo provisoire Equinomad"
```

---

### Task 8: Générateur de textes produit

**Files:**
- Modify: `src/lib/productContent.ts` (40 occurrences, lignes 1064-1342)
- Modify: `src/lib/productContent.test.ts` (15 occurrences + un test nouveau)

**Interfaces:**
- Consumes: `BRAND` (Task 1).
- Produces: `buildNewProductCopy` et `buildOccasionCopy` gardent leur signature ; seul le nom du vendeur change dans les textes.

- [ ] **Step 1: Adapter les tests existants et ajouter le cas sans marque**

Dans `src/lib/productContent.test.ts`, remplacer chaque `/Remolque Caballos/` par `/Equinomad/` (15 occurrences, dont lignes 221, 222, 227, 228, 289). Ajouter :

```ts
test("buildOccasionCopy sans marque ne produit ni marque vide ni ancien nom", () => {
  const entry = productContentLib.buildOccasionCopy({
    slug: "oc-sin-marca",
    name: "Van de ocasión para dos caballos",
    brand: "",
    categorySlug: "dos-caballos",
    categoryLabel: "Remolques de dos caballos de ocasión",
    categoryLabelEn: "Used two-horse trailers",
    description: "Van de dos caballos con matrícula roja, luz interior e ITV al día.",
    bullets: ["Capacidad 2 caballos", "Matrícula roja"],
  });
  const tout = JSON.stringify(entry);
  assert.doesNotMatch(tout, /Remolque Caballos/);
  assert.doesNotMatch(tout, /de marca\s*[,.]|by\s*[,.]|von\s*[,.]/);
  assert.match(entry.shortDescription, /Equinomad/);
});
```

- [ ] **Step 2: Vérifier l'échec**

Run: `npx tsx --test src/lib/productContent.test.ts`
Expected: FAIL, les textes contiennent encore « Remolque Caballos ».

- [ ] **Step 3: Remplacer le nom du vendeur**

Les 40 occurrences sont toutes dans des gabarits à backticks (lignes 1064-1342). Remplacer chacune par `${BRAND.name}` :

Run: `sed -i 's/Remolque Caballos/${BRAND.name}/g' src/lib/productContent.ts`

puis ajouter en tête du fichier `import { BRAND } from "@/config/brand";`.

Contrôle :

Run: `grep -n 'BRAND.name' src/lib/productContent.ts | grep -v '\`' `
Expected: aucune ligne (toutes les occurrences sont dans un gabarit à backticks ; sinon convertir la chaîne concernée en gabarit).

La fonction `inferOccasionBrand` gère déjà une marque vide (elle renvoie `null` et les tournures `identity` omettent la marque) : aucune autre modification.

- [ ] **Step 4: Vérifier le succès**

Run: `npx tsx --test src/lib/productContent.test.ts` puis `npx tsc --noEmit`
Expected: PASS, aucune erreur.

- [ ] **Step 5: Commit**

```bash
git add src/lib/productContent.ts src/lib/productContent.test.ts
git commit -m "feat: textes produit générés au nom d'Equinomad"
```

---

### Task 9: Messages, données livrées et scripts

**Files:**
- Modify: `src/messages/es.json`, `src/messages/en.json` (17 occurrences chacun)
- Modify: `data/store/products.json` (6)
- Modify: `scripts/traduire-vitrine.mjs` (27), `scripts/traduire-tunnel.mjs` (8), `scripts/traduire-emails.mjs` (4)
- Modify: `scripts/local-postgres.mjs:124-126`, `scripts/generer-visuels.mjs:2`
- Modify: `scripts/importar-fotos-marcas.ts:53`, `scripts/migrar-imagenes-ehorses-cloudinary.ts:78,116`
- Modify: `src/lib/richText.test.ts:98,100`, `src/server/legalPageInput.test.ts:30,44`

- [ ] **Step 1: Remplacer dans les fichiers de texte**

Dans `src/messages/es.json`, `src/messages/en.json`, `scripts/traduire-vitrine.mjs`, `scripts/traduire-tunnel.mjs` et `scripts/traduire-emails.mjs`, appliquer dans cet ordre :

```bash
for f in src/messages/es.json src/messages/en.json scripts/traduire-vitrine.mjs scripts/traduire-tunnel.mjs scripts/traduire-emails.mjs; do
  sed -i -e 's/privacidad@remolquecaballos\.com/info@equinomad.com/g' \
         -e 's/contacto@remolquecaballos\.com/info@equinomad.com/g' \
         -e 's/www\.remolquecaballos\.com/equinomad.com/g' \
         -e 's/remolquecaballos\.com/equinomad.com/g' \
         -e 's/Remolque Caballos/Equinomad/g' "$f"
done
```

Relire ensuite le diff de `es.json` et `en.json` (`git diff src/messages`) : une phrase où « Remolque Caballos » désignait le produit et non la boutique doit être reformulée à la main (par exemple « el remolque » / « the trailer »).

- [ ] **Step 2: Données livrées**

Dans `data/store/products.json`, le champ `"brand": "Remolque Caballos"` devient `"brand": ""` (produits sans marque), et toute autre occurrence de « Remolque Caballos » dans un texte devient « Equinomad » :

```bash
sed -i -e 's/"brand": "Remolque Caballos"/"brand": ""/g' -e 's/Remolque Caballos/Equinomad/g' data/store/products.json
```

Puis : `node -e "JSON.parse(require('fs').readFileSync('data/store/products.json','utf8')); console.log('JSON valide')"`
Expected: `JSON valide`.

- [ ] **Step 3: Scripts**

| Fichier:ligne | Avant | Après |
|---|---|---|
| `scripts/local-postgres.mjs:124-126` | `"equivan"` (trois fois) | `"equinomad"` |
| `scripts/generer-visuels.mjs:2` | `du catalogue Remolque Caballos` | `du catalogue Equinomad` |
| `scripts/importar-fotos-marcas.ts:53` | `` `remolquecaballos/productos/${marcaSlug}/${slug}` `` | `` `${BRAND.cloudinaryFolder}/${marcaSlug}/${slug}` `` (+ `import { BRAND } from "../src/config/brand";`) |
| `scripts/migrar-imagenes-ehorses-cloudinary.ts:78,116` | `` `remolquecaballos/productos/ehorses/${product.slug}` `` | `` `${BRAND.cloudinaryFolder}/ehorses/${product.slug}` `` (+ même import) |

Si `.env.local` ou la documentation locale référence l'utilisateur `equivan` de la base de développement locale, l'ancien dossier `.postgres/` n'existe pas dans cette copie : rien d'autre à migrer.

- [ ] **Step 4: Fixtures de tests**

- `src/lib/richText.test.ts:98` : `"https://remolquecaballos.com"` devient `"https://equinomad.com"` ; ligne 100 : `"mailto:contacto@remolquecaballos.com"` devient `"mailto:info@equinomad.com"`.
- `src/server/legalPageInput.test.ts:30,44` : `"Remolque Caballos SAS"` devient `"Equinomad, S.L."` (les deux lignes doivent rester identiques entre elles).

- [ ] **Step 5: Vérifier**

Run: `npm test`, `npx tsc --noEmit`, `npm run lint`
Expected: tout passe.

- [ ] **Step 6: Commit**

```bash
git add src/messages data/store/products.json scripts src/lib/richText.test.ts src/server/legalPageInput.test.ts
git commit -m "feat: textes, données livrées et scripts au nom d'Equinomad"
```

---

### Task 10: Garde-fou, contrôle avant mise en ligne et documentation

**Files:**
- Create: `src/config/legacyBrand.test.ts`
- Create: `scripts/check-launch.ts`
- Modify: `package.json` (`name`, script `check:launch`)
- Modify: `.env.example:1`, `README.md`, `TARGET.md`

**Interfaces:**
- Consumes: `missingCompanyFields()` (Task 1).

- [ ] **Step 1: Écrire le test d'absence de l'ancienne identité**

`src/config/legacyBrand.test.ts` :

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

/**
 * Garde-fou du changement d'identité : l'ancien client ne doit réapparaître
 * nulle part dans ce que le dépôt livre. docs/ est exclu (historique du
 * clonage et anciennes conceptions), comme ce fichier lui-même.
 */
const RACINE = process.cwd();
const DOSSIERS = ["src", "data", "scripts", "prisma"];
const FICHIERS = ["README.md", "TARGET.md", ".env.example", "package.json"];
const MOTIF = /remolque\s+caballos|remolquecaballos|equivan/i;
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".mjs", ".cjs", ".json", ".md", ".css", ".prisma", ".sql", ".txt"]);
const IGNORES = new Set(["node_modules", "generated", ".next"]);
const CE_FICHIER = path.join("src", "config", "legacyBrand.test.ts");

function parcourir(dossier: string, sortie: string[]): void {
  for (const nom of readdirSync(dossier)) {
    if (IGNORES.has(nom)) continue;
    const chemin = path.join(dossier, nom);
    if (statSync(chemin).isDirectory()) parcourir(chemin, sortie);
    else if (EXTENSIONS.has(path.extname(nom))) sortie.push(chemin);
  }
}

test("aucune trace de l'ancienne identité dans les fichiers livrés", () => {
  const fichiers: string[] = [];
  for (const d of DOSSIERS) parcourir(path.join(RACINE, d), fichiers);
  for (const f of FICHIERS) fichiers.push(path.join(RACINE, f));

  const fautes = fichiers
    .filter((f) => path.relative(RACINE, f) !== CE_FICHIER)
    .flatMap((f) =>
      readFileSync(f, "utf8")
        .split("\n")
        .map((ligne, i) => ({ ligne, i }))
        .filter(({ ligne }) => MOTIF.test(ligne))
        .map(({ i }) => `${path.relative(RACINE, f)}:${i + 1}`),
    );

  assert.deepEqual(fautes, [], `Ancienne identité trouvée :\n${fautes.join("\n")}`);
});
```

- [ ] **Step 2: Lancer le test**

Run: `npx tsx --test src/config/legacyBrand.test.ts`
Expected: FAIL tant que `README.md`, `TARGET.md` et `.env.example` ne sont pas réécrits ; la liste des fautes ne doit citer que ces fichiers. Toute autre ligne listée est un oubli des tâches 1 à 9 : la corriger (même règle de remplacement) avant de continuer.

- [ ] **Step 3: Documentation et configuration**

`.env.example`, ligne 1 : `# Modèle des variables d'environnement d'Equivan.` devient `# Modèle des variables d'environnement d'Equinomad.` ; s'il porte `MAIL_FROM_NAME=…`, mettre `MAIL_FROM_NAME=Equinomad`.

`package.json` : `"name": "remorqueb-ckmann"` devient `"name": "equinomad"`, et ajouter dans `scripts` :

```json
    "check:launch": "tsx scripts/check-launch.ts",
```

`README.md` : remplacer la première phrase (« Copie indépendante de la boutique Remolque Caballos… ») par « Boutique en ligne Equinomad : remorques et vans pour chevaux, vendus et livrés depuis l'Espagne vers huit pays européens. », remplacer le titre `# remorqueb-ckmann` par `# Equinomad`, et le lien du dépôt par `https://github.com/d97515139-collab/equinomad`. Le reste du README (développement, vérification, identité Git) est conservé.

`TARGET.md` : remplacer tout le contenu par :

```markdown
# Projet Equinomad

## Origine

Copie indépendante de la boutique Remolque Caballos, reprise pour un nouveau
client (voir `docs/CLONAGE.md`). Base Neon `eu-central-1`, compte Cloudinary et
dépôt GitHub propres à ce projet.

## Marque

- Nom : **Equinomad**
- Domaine : `equinomad.com` — e-mail public `info@equinomad.com`
- Société : espagnole, coordonnées à recevoir (`src/config/company.ts`,
  valeurs `[A COMPLETAR]`)
- Configuration centrale : `src/config/brand.ts` et `src/config/company.ts`

## Marchés visés

Espagne, France, Portugal, Belgique, Suisse, Norvège, Suède, Irlande. Un seul
site, un dossier par pays-langue, TVA du pays de livraison (OSS), devises
EUR, CHF, NOK et SEK.

## Découpage du chantier

1. Identité Equinomad — `docs/superpowers/specs/2026-10-01-identite-equinomad-design.md`
2. Socle multi-pays (URL par pays-langue, hreflang, TVA OSS, devises,
   livraison par zone, flux Merchant par pays)
3. Langues portugais, néerlandais, norvégien, suédois
4. Nouveau design et logo définitif
5. Pages légales par pays

## Avant mise en ligne

`npm run check:launch` doit passer : coordonnées de la société complètes,
SMTP configuré, IBAN renseigné.
```

- [ ] **Step 4: Écrire `scripts/check-launch.ts`**

```ts
import { missingCompanyFields } from "../src/config/company";

/**
 * Contrôle avant mise en ligne : liste ce qui manque encore et se termine en
 * erreur tant qu'il reste quelque chose.
 *
 *   npm run check:launch
 */
try {
  process.loadEnvFile(".env.local");
} catch {
  // Pas de .env.local : en production, les variables viennent de l'hébergeur.
}

async function main(): Promise<void> {
  const manques: string[] = missingCompanyFields().map(
    (champ) => `COMPANY.${champ} est encore une valeur d'exemple (src/config/company.ts)`,
  );

  for (const variable of ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD", "MAIL_FROM"]) {
    if (!process.env[variable]?.trim()) manques.push(`${variable} n'est pas définie`);
  }

  const { prisma } = await import("../src/server/prisma");
  const ligne = await prisma.setting.findUnique({ where: { key: "bank_transfer" } });
  const virement = ligne ? (JSON.parse(ligne.value) as { iban?: string }) : {};
  if (!virement.iban?.trim()) manques.push("IBAN du virement non renseigné (back-office, Paiements)");
  await prisma.$disconnect();

  if (manques.length === 0) {
    console.log("Prêt pour la mise en ligne.");
    return;
  }
  console.error(`${manques.length} point(s) à régler avant la mise en ligne :`);
  for (const m of manques) console.error(`  - ${m}`);
  process.exitCode = 1;
}

main().catch((erreur: unknown) => {
  console.error(erreur instanceof Error ? erreur.message : erreur);
  process.exitCode = 1;
});
```

- [ ] **Step 5: Vérifier**

Run: `npm test`
Expected: tout passe, `legacyBrand.test.ts` compris.

Run: `npm run check:launch`
Expected: code de sortie 1, avec la liste des 12 champs `COMPANY` à compléter, les variables SMTP manquantes et l'IBAN (vide après la tâche 13 ; tant que la tâche 13 n'a pas tourné, l'ancien IBAN est encore présent et la ligne IBAN n'apparaît pas).

Run: `npx tsc --noEmit`, `npm run lint`
Expected: aucune erreur.

- [ ] **Step 6: Commit**

```bash
git add src/config/legacyBrand.test.ts scripts/check-launch.ts package.json .env.example README.md TARGET.md
git commit -m "feat: garde-fou contre l'ancienne identité et contrôle avant mise en ligne"
```

---

### Task 11: Fonctions de nettoyage des données

**Files:**
- Create: `src/server/rebranding.ts`, `src/server/rebranding.test.ts`

**Interfaces:**
- Consumes: `BRAND`, `COMPANY` (Task 1).
- Produces:
  - `LEGACY_PATTERN: RegExp`
  - `hasLegacyIdentity(text: string): boolean`
  - `rebrandProductText(text: string): string`
  - `rebrandLegalText(text: string): string`
  - `interface StockMovementRow { id: string; productId: string; delta: number; reason: string; note: string | null }`
  - `interface StockRestorationPlan { movementIds: string[]; increments: Record<string, number>; unmatched: string[] }`
  - `planStockRestoration(movements: readonly StockMovementRow[], orderNumbers: readonly string[]): StockRestorationPlan`

- [ ] **Step 1: Écrire les tests**

`src/server/rebranding.test.ts` :

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { COMPANY } from "@/config/company";
import {
  hasLegacyIdentity,
  planStockRestoration,
  rebrandLegalText,
  rebrandProductText,
} from "./rebranding";

test("la boutique vendeuse devient Equinomad", () => {
  assert.equal(
    rebrandProductText("En Remolque Caballos, el Böckmann Portax se presenta como un remolque nuevo."),
    "En Equinomad, el Böckmann Portax se presenta como un remolque nuevo.",
  );
  assert.equal(
    rebrandProductText("Bei Remolque Caballos wird der Portax vorgestellt."),
    "Bei Equinomad wird der Portax vorgestellt.",
  );
});

test("l'ancien nom employé comme nom de produit devient un nom générique", () => {
  assert.equal(
    rebrandProductText("El vehículo El Remolque Caballos para 2 caballos es una unidad de segunda mano."),
    "El vehículo El Remolque para 2 caballos es una unidad de segunda mano.",
  );
  assert.equal(rebrandProductText("Remolque Caballos - 2 caballos"), "Remolque para caballos - 2 caballos");
  assert.equal(rebrandProductText("Remolque Caballos Furgo 2"), "Remolque para caballos Furgo 2");
});

test("le remplacement des textes produit est idempotent", () => {
  const source = "En Remolque Caballos, el Remolque Caballos para 2 caballos.";
  const une = rebrandProductText(source);
  assert.equal(rebrandProductText(une), une);
  assert.equal(hasLegacyIdentity(une), false);
});

test("les pages légales perdent l'ancienne identité et restent du JSON valide", () => {
  const source = JSON.stringify({
    sections: [
      {
        body:
          "Remolque Caballos, S.L., Ctra. Petra - Santa Margalida, km 3, 07520 Petra (Illes Balears), España. " +
          "Correo: contacto@remolquecaballos.com. Web: www.remolquecaballos.com. WhatsApp: +34 612 553 303.",
        list: ["REMOLQUE CABALLOS, S.L.", "07520 Petra (Balearic Islands)", "privacidad@remolquecaballos.com"],
      },
    ],
    intro: "un modelo para la tienda en línea Remolque Caballos.",
  });
  const sortie = rebrandLegalText(source);
  assert.doesNotThrow(() => JSON.parse(sortie));
  assert.equal(hasLegacyIdentity(sortie), false);
  assert.ok(sortie.includes(COMPANY.name));
  assert.ok(sortie.includes(COMPANY.street));
  assert.ok(sortie.includes("info@equinomad.com"));
  assert.ok(sortie.includes("la tienda en línea Equinomad"));
  assert.equal(rebrandLegalText(sortie), sortie);
});

test("le stock des commandes supprimées est rétabli", () => {
  const plan = planStockRestoration(
    [
      { id: "m1", productId: "p1", delta: -1, reason: "verkauf", note: "Commande RC-2026-014679" },
      { id: "m2", productId: "p1", delta: -1, reason: "verkauf", note: "Commande RC-2026-014681" },
      { id: "m3", productId: "p2", delta: 5, reason: "wareneingang", note: null },
    ],
    ["RC-2026-014679", "RC-2026-014681"],
  );
  assert.deepEqual(plan.movementIds, ["m1", "m2"]);
  assert.deepEqual(plan.increments, { p1: 2 });
  assert.deepEqual(plan.unmatched, []);
});

test("une vente impossible à rattacher est signalée, pas devinée", () => {
  const plan = planStockRestoration(
    [
      { id: "m1", productId: "p1", delta: -1, reason: "verkauf", note: "vente comptoir" },
      { id: "m2", productId: "p1", delta: -1, reason: "verkauf", note: "Commande RC-2026-999999" },
    ],
    ["RC-2026-014679"],
  );
  assert.deepEqual(plan.movementIds, []);
  assert.deepEqual(plan.unmatched, ["m1", "m2"]);
});
```

- [ ] **Step 2: Vérifier l'échec**

Run: `npx tsx --test src/server/rebranding.test.ts`
Expected: FAIL, module `./rebranding` introuvable.

- [ ] **Step 3: Écrire le module**

`src/server/rebranding.ts` :

```ts
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
 * Textes produit. L'ancien nom y joue deux rôles : la boutique (« En Remolque
 * Caballos, el … ») et, pour quelques occasions sans marque, le nom du produit
 * lui-même (« el Remolque Caballos para 2 caballos »). Le second rôle devient
 * un nom générique, le premier devient Equinomad.
 */
export function rebrandProductText(text: string): string {
  return text
    .replaceAll("Remolque Caballos para ", "Remolque para ")
    .replaceAll("Remolque Caballos - ", "Remolque para caballos - ")
    .replaceAll("Remolque Caballos Furgo", "Remolque para caballos Furgo")
    .replaceAll("Remolque Caballos", BRAND.name);
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
 */
export function planStockRestoration(
  movements: readonly StockMovementRow[],
  orderNumbers: readonly string[],
): StockRestorationPlan {
  const numeros = new Set(orderNumbers);
  const plan: StockRestorationPlan = { movementIds: [], increments: {}, unmatched: [] };

  for (const m of movements) {
    if (m.reason !== "verkauf") continue;
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
```

- [ ] **Step 4: Vérifier le succès**

Run: `npx tsx --test src/server/rebranding.test.ts`
Expected: PASS (6 tests).

Le test `legacyBrand.test.ts` (Task 10) va signaler ce fichier et son test, qui contiennent volontairement l'ancienne identité. Ajouter à `legacyBrand.test.ts` une exclusion explicite :

```ts
const EXCLUS = new Set([
  path.join("src", "config", "legacyBrand.test.ts"),
  path.join("src", "server", "rebranding.ts"),
  path.join("src", "server", "rebranding.test.ts"),
  path.join("scripts", "rebranding-equinomad.ts"),
]);
```

et remplacer le filtre `path.relative(RACINE, f) !== CE_FICHIER` par `!EXCLUS.has(path.relative(RACINE, f))` (supprimer `CE_FICHIER`).

Run: `npm test`
Expected: tout passe.

- [ ] **Step 5: Commit**

```bash
git add src/server/rebranding.ts src/server/rebranding.test.ts src/config/legacyBrand.test.ts
git commit -m "feat: règles de nettoyage des données héritées de l'ancien client"
```

---

### Task 12: Script de nettoyage de la base et secrets administrateur

**Files:**
- Create: `scripts/rebranding-equinomad.ts`
- Modify (non versionné): `.env.local` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`)

**Interfaces:**
- Consumes: tout le module `src/server/rebranding.ts` (Task 11), `hashPassword`, `verifyPassword` de `src/lib/password.ts`, `prisma` de `src/server/prisma.ts`.

- [ ] **Step 1: Générer les secrets administrateur**

Sans jamais afficher les valeurs :

```bash
node -e "
const fs=require('fs'),c=require('crypto');const f='.env.local';let s=fs.readFileSync(f,'utf8');
const set=(k,v)=>{const re=new RegExp('^'+k+'=.*$','m');s=re.test(s)?s.replace(re,k+'='+v):s.replace(/\s*$/,'\n'+k+'='+v+'\n');};
set('ADMIN_EMAIL','d97515139@gmail.com');
set('ADMIN_PASSWORD',c.randomBytes(18).toString('base64url'));
set('ADMIN_SESSION_SECRET',c.randomBytes(48).toString('base64url'));
fs.writeFileSync(f,s);console.log('secrets mis à jour');"
```

Le changement de `ADMIN_SESSION_SECRET` invalide toutes les sessions administrateur ouvertes (elles sont signées avec ce secret).

- [ ] **Step 2: Vérifier le nom de la clé composée de LegalContent**

Run: `grep -n -A12 "model LegalContent" prisma/schema.prisma`
Noter la clé (`@@id([slug, locale])` donne `slug_locale` dans Prisma) et l'utiliser telle quelle à l'étape suivante.

- [ ] **Step 3: Écrire `scripts/rebranding-equinomad.ts`**

```ts
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Retire de la base l'identité de l'ancien client et installe celle
 * d'Equinomad. À blanc par défaut ; `--apply` sauvegarde puis écrit tout en une
 * seule transaction. Relancé, il ne trouve plus rien à faire.
 *
 *   npx tsx scripts/rebranding-equinomad.ts            # à blanc
 *   npx tsx scripts/rebranding-equinomad.ts --apply    # écriture
 */
try {
  process.loadEnvFile(".env.local");
} catch {
  // Variables déjà présentes dans l'environnement.
}

const APPLY = process.argv.includes("--apply");
const NEW_ADMIN_EMAIL = "d97515139@gmail.com";
const OLD_BRAND = "Remolque Caballos";
const PRODUCT_TEXT_FIELDS = [
  "name", "shortDescription", "description", "bullets",
  "nameEn", "shortDescriptionEn", "descriptionEn", "bulletsEn",
  "nameFr", "shortDescriptionFr", "descriptionFr", "bulletsFr",
  "nameDe", "shortDescriptionDe", "descriptionDe", "bulletsDe",
  "nameIt", "shortDescriptionIt", "descriptionIt", "bulletsIt",
] as const;
type ProductTextField = (typeof PRODUCT_TEXT_FIELDS)[number];

async function main(): Promise<void> {
  const { prisma } = await import("../src/server/prisma");
  const { hashPassword, verifyPassword } = await import("../src/lib/password");
  const { hasLegacyIdentity, planStockRestoration, rebrandLegalText, rebrandProductText } =
    await import("../src/server/rebranding");

  // ---- Lecture ----
  const orders = await prisma.order.findMany({ select: { id: true, orderNumber: true } });
  const orderIds = orders.map((o) => o.id);
  const [itemCount, eventCount] = await Promise.all([
    prisma.orderItem.count({ where: { orderId: { in: orderIds } } }),
    prisma.orderEvent.count({ where: { orderId: { in: orderIds } } }),
  ]);
  const movements = await prisma.stockMovement.findMany({
    select: { id: true, productId: true, delta: true, reason: true, note: true },
  });
  const stock = planStockRestoration(movements, orders.map((o) => o.orderNumber));
  if (stock.unmatched.length > 0) {
    throw new Error(`Ventes impossibles à rattacher à une commande : ${stock.unmatched.join(", ")}`);
  }

  const products = await prisma.product.findMany();
  const productChanges = products
    .map((p) => {
      const data: Partial<Record<ProductTextField | "brand", string>> = {};
      if (p.brand === OLD_BRAND) data.brand = "";
      for (const field of PRODUCT_TEXT_FIELDS) {
        const after = rebrandProductText(p[field]);
        if (after !== p[field]) data[field] = after;
      }
      return { id: p.id, slug: p.slug, before: p, data };
    })
    .filter((c) => Object.keys(c.data).length > 0);
  const productLeftovers = productChanges.flatMap((c) =>
    PRODUCT_TEXT_FIELDS.filter((f) => hasLegacyIdentity(c.data[f] ?? c.before[f])).map((f) => `${c.slug}.${f}`),
  );

  const legalRows = await prisma.legalContent.findMany();
  const legalChanges = legalRows
    .map((row) => ({ row, data: rebrandLegalText(row.data) }))
    .filter((c) => c.data !== c.row.data || hasLegacyIdentity(c.row.updatedBy ?? ""));
  const legalLeftovers = legalChanges
    .filter((c) => hasLegacyIdentity(c.data))
    .map((c) => `${c.row.locale}/${c.row.slug}`);

  const bankRow = await prisma.setting.findUnique({ where: { key: "bank_transfer" } });
  const bank = bankRow ? (JSON.parse(bankRow.value) as Record<string, string>) : null;
  const bankNeedsReset = Boolean(bank && (bank.holder || bank.iban || bank.bic));
  const transfer = await prisma.paymentMethod.findUnique({ where: { key: "transferencia" } });
  const transferNeedsDisable = Boolean(transfer?.enabled);

  const admins = await prisma.adminUser.findMany();
  const password = process.env.ADMIN_PASSWORD ?? "";
  const adminTarget = admins.find((a) => a.email === NEW_ADMIN_EMAIL) ?? admins.find((a) => hasLegacyIdentity(a.email));
  const adminNeedsUpdate = Boolean(
    adminTarget &&
      (adminTarget.email !== NEW_ADMIN_EMAIL || !password || !verifyPassword(password, adminTarget.passwordHash)),
  );

  // ---- Rapport ----
  console.log(APPLY ? "Mode écriture" : "Mode à blanc (ajouter --apply pour écrire)");
  console.log(`Commandes à supprimer : ${orders.length} (${itemCount} lignes, ${eventCount} événements)`);
  console.log(`Mouvements de stock à supprimer : ${stock.movementIds.length} ; stock rendu : ${JSON.stringify(stock.increments)}`);
  console.log(`Produits à modifier : ${productChanges.length} (dont marque vidée : ${productChanges.filter((c) => c.data.brand === "").length})`);
  for (const c of productChanges.slice(0, 5)) {
    const champ = (Object.keys(c.data).find((k) => k !== "brand") ?? "brand") as ProductTextField | "brand";
    console.log(`  ${c.slug} · ${champ} → ${String(c.data[champ]).slice(0, 140)}`);
  }
  console.log(`Pages légales à modifier : ${legalChanges.length}`);
  console.log(`Virement : ${bankNeedsReset ? "coordonnées bancaires à vider" : "rien"} ; méthode : ${transferNeedsDisable ? "à désactiver" : "rien"}`);
  console.log(`Administrateur : ${adminNeedsUpdate ? `à basculer vers ${NEW_ADMIN_EMAIL}` : "rien"}`);
  if (productLeftovers.length || legalLeftovers.length) {
    console.error("Textes encore marqués par l'ancienne identité après remplacement :");
    for (const l of [...productLeftovers, ...legalLeftovers]) console.error(`  - ${l}`);
    throw new Error("Remplacements incomplets : compléter les règles de src/server/rebranding.ts.");
  }

  const nothing =
    orders.length === 0 && stock.movementIds.length === 0 && productChanges.length === 0 &&
    legalChanges.length === 0 && !bankNeedsReset && !transferNeedsDisable && !adminNeedsUpdate;
  if (nothing) {
    console.log("Rien à faire.");
    return;
  }
  if (!APPLY) return;
  if (adminNeedsUpdate && !password) throw new Error("ADMIN_PASSWORD manque dans .env.local.");

  // ---- Sauvegarde ----
  const dossier = path.join(process.cwd(), ".migration");
  await mkdir(dossier, { recursive: true });
  const fichier = path.join(dossier, `rebranding-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  const backup = {
    orders: await prisma.order.findMany({ where: { id: { in: orderIds } }, include: { items: true, events: true } }),
    movements: movements.filter((m) => stock.movementIds.includes(m.id)),
    products: productChanges.map((c) => c.before),
    legal: legalChanges.map((c) => c.row),
    bank: bankRow,
    transfer,
    admins,
  };
  await writeFile(fichier, JSON.stringify(backup, null, 2), "utf8");
  console.log(`Sauvegarde : ${fichier}`);

  // ---- Écriture ----
  await prisma.$transaction(
    async (tx) => {
      await tx.orderEvent.deleteMany({ where: { orderId: { in: orderIds } } });
      await tx.orderItem.deleteMany({ where: { orderId: { in: orderIds } } });
      await tx.order.deleteMany({ where: { id: { in: orderIds } } });
      await tx.stockMovement.deleteMany({ where: { id: { in: stock.movementIds } } });
      for (const [productId, quantite] of Object.entries(stock.increments)) {
        await tx.product.update({ where: { id: productId }, data: { stock: { increment: quantite } } });
      }
      for (const c of productChanges) {
        await tx.product.update({ where: { id: c.id }, data: c.data });
      }
      for (const c of legalChanges) {
        await tx.legalContent.update({
          where: { slug_locale: { slug: c.row.slug, locale: c.row.locale } },
          data: { data: c.data, updatedBy: "rebranding-equinomad" },
        });
      }
      if (bankRow && bank && bankNeedsReset) {
        await tx.setting.update({
          where: { key: "bank_transfer" },
          data: { value: JSON.stringify({ ...bank, holder: "", iban: "", bic: "" }) },
        });
      }
      if (transferNeedsDisable) {
        await tx.paymentMethod.update({ where: { key: "transferencia" }, data: { enabled: false } });
      }
      if (adminTarget && adminNeedsUpdate) {
        await tx.adminUser.update({
          where: { id: adminTarget.id },
          data: { email: NEW_ADMIN_EMAIL, name: "Administración Equinomad", passwordHash: hashPassword(password) },
        });
      }
    },
    { timeout: 600_000, maxWait: 60_000 },
  );
  console.log("Écriture terminée.");
  await prisma.$disconnect();
}

main().catch((erreur: unknown) => {
  console.error(erreur instanceof Error ? erreur.message : erreur);
  process.exitCode = 1;
});
```

Avant de lancer, adapter aux noms réels du schéma si l'un diffère (vérifier avec `grep -n "model Order\b\|model OrderItem\|model OrderEvent\|model PaymentMethod" -A20 prisma/schema.prisma`) : relations `items`/`events` sur `Order`, clé unique `key` sur `PaymentMethod`, champ `enabled`, `updatedBy` nullable sur `LegalContent`. Un nom qui diffère se corrige dans le script, pas en devinant à l'exécution : `npx tsc --noEmit` le signale.

- [ ] **Step 4: Vérifier les types et lancer à blanc**

Run: `npx tsc --noEmit`
Expected: aucune erreur.

Run: `npx tsx scripts/rebranding-equinomad.ts`
Expected (ordre de grandeur relevé le 1er octobre) :
- `Commandes à supprimer : 9 (10 lignes, 18 événements)` ;
- `Mouvements de stock à supprimer : 6` et un stock rendu sur 4 produits (3 + 1 + 1 + 1) ;
- `Produits à modifier : 293` environ, dont `134` marques vidées ;
- `Pages légales à modifier : 19` ;
- virement à vider, méthode à désactiver, administrateur à basculer ;
- **aucune** ligne « Textes encore marqués ».

Relire les cinq exemples de produits affichés : la tournure doit être naturelle (« En Equinomad, el … », « El Remolque para 2 caballos … »).

- [ ] **Step 5: Commit**

```bash
git add scripts/rebranding-equinomad.ts
git commit -m "feat: script de nettoyage de la base héritée"
```

---

### Task 13: Application en base et vérification finale

**Files:**
- Aucun fichier de code ; écrit dans la base Neon et dans `.migration/` (ignoré par Git).

- [ ] **Step 1: Appliquer**

Run: `npx tsx scripts/rebranding-equinomad.ts --apply`
Expected : le même rapport qu'à blanc, puis `Sauvegarde : .migration/rebranding-backup-….json` et `Écriture terminée.`

- [ ] **Step 2: Vérifier l'idempotence**

Run: `npx tsx scripts/rebranding-equinomad.ts`
Expected: `Rien à faire.`

- [ ] **Step 3: Balayer toute la base**

Run: `node .migration/scan-identity.cjs`
Expected : aucune table ne signale `Remolque Caballos`, `remolquecaballos`, `Equivan`, `612 553 303` ni `Petra` ; `ADMIN` affiche `d***@gmail.com` ; `Order 0`, `OrderItem 0`, `OrderEvent 0`.

- [ ] **Step 4: Vérifier le mot de passe administrateur**

```bash
npx tsx -e "
process.loadEnvFile('.env.local');
const { prisma } = await import('./src/server/prisma');
const { verifyPassword } = await import('./src/lib/password');
const a = await prisma.adminUser.findUnique({ where: { email: 'd97515139@gmail.com' } });
console.log(a && verifyPassword(process.env.ADMIN_PASSWORD!, a.passwordHash) ? 'mot de passe admin OK' : 'ÉCHEC');
await prisma.\$disconnect();"
```

Expected: `mot de passe admin OK`.

- [ ] **Step 5: Suite de vérifications du code**

Run: `npm test`, `npm run lint`, `npx tsc --noEmit`
Expected: tout passe.

Run: `npm run check:launch`
Expected : code de sortie 1, listant les 12 champs `COMPANY`, les variables SMTP et l'IBAN — c'est le comportement attendu tant que le client n'a pas fourni ces informations.

- [ ] **Step 6: Contrôle visuel en local**

Lancer le serveur de développement en arrière-plan : `npx next dev --port 3100`. Puis :

```bash
for p in / /en /nuevos/dos-caballos /cgv /mentions-legales /panier /admin/login; do
  code=$(curl -s -o /tmp/page.html -w '%{http_code}' --max-time 180 "http://localhost:3100$p")
  ancien=$(grep -c -i -E 'remolque caballos|remolquecaballos|equivan|Petra' /tmp/page.html)
  nouveau=$(grep -c 'Equinomad' /tmp/page.html)
  echo "$p $code ancien=$ancien equinomad=$nouveau"
done
```

Expected : chaque page répond `200` (ou `307` vers la connexion pour l'admin), `ancien=0`, `equinomad` supérieur à 0. Ouvrir aussi une fiche d'occasion sans marque (prendre un slug parmi les 134, par exemple via `npx tsx -e` sur `prisma.product.findFirst({ where: { brand: "", condition: "used" } })`) : pas de marque affichée, titre sans espace en tête. Arrêter ensuite le serveur de développement.

- [ ] **Step 7: Pousser**

```bash
git push origin main
```

Vérifier sur GitHub que les commits sont attribués à `d97515139-collab`.
