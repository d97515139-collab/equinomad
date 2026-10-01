# Socle du catalogue — plan d'implémentation

> **Pour les agents :** SOUS-COMPÉTENCE REQUISE — utiliser superpowers:subagent-driven-development (recommandé) ou superpowers:executing-plans pour dérouler ce plan tâche par tâche. Les étapes utilisent la syntaxe à cases (`- [ ]`).

**But :** poser le socle technique qui permet d'importer 223 fiches détaillées et cohérentes — caractéristiques structurées, exigence de permis calculée, fiche produit qui les affiche, et refus du panier pour les références sans prix.

**Architecture :** trois champs et un modèle s'ajoutent au schéma Prisma. Deux modules purs et testés portent la logique — l'un lit et valide les caractéristiques techniques, l'autre déduit l'exigence de permis de la MMA. La fiche produit les affiche en réutilisant le rendu `RichText` déjà en place. L'importeur générique arrive en dernier, une fois que la donnée a une forme validée.

**Pile :** Next.js 16, React 19, Prisma 7, PostgreSQL, TypeScript strict, tests `node:test` via `tsx`.

**Spec :** `docs/superpowers/specs/2026-08-14-catalogue-250-fiches-design.md`

## Découpage

Ce plan est le **premier des trois** que la spec appelle. Il produit un logiciel complet et testable seul : après lui, une fiche détaillée s'affiche correctement et s'importe.

- **Plan 1 — socle catalogue** (ce document) : schéma, logique, affichage, importeur, application de la marge.
- **Plan 2 — collecte, photographies et rédaction**, marque par marque : relevé des caractéristiques, rapatriement des visuels constructeurs sur Cloudinary dans un dossier par produit, rédaction des sections dans les deux langues. Travail répétitif de contenu, sans TDD ; il dépend du format figé par le plan 1.
- **Plan 3 — accessoires, flux Merchant `es-ES`, corrections annexes.**

## Contraintes globales

- Réponses, code et commentaires en français. Contenu du site en espagnol, traduit en anglais sous `/en`.
- TypeScript strict, jamais de `any`. Exports nommés, composants en PascalCase, utilitaires en camelCase.
- Classes Tailwind, jamais de style en ligne.
- Aucun contenu inventé : pas de valeur technique, de prix ni d'avis fabriqué.
- Jamais de `dangerouslySetInnerHTML`. Le rendu de texte enrichi passe par `src/components/RichText.tsx`.
- Marge sur les prix : constante `MARGEN = 1.10`, jamais recopiée fiche par fiche.
- Permis espagnols, RD 818/2009 : B jusqu'à 3 500 kg d'ensemble, B96 jusqu'à 4 250 kg, B+E jusqu'à 7 000 kg. Le véhicule tracteur d'un titulaire du permis B ne dépasse jamais 3 500 kg de MMA.
- Tests : `npm test`. Vérification de types : `npx tsc --noEmit`. Lint : `npm run lint`.

## Prérequis avant la tâche 1

**`DATABASE_URL` de `.env.local` vise la production.** Aucune migration ni aucun import ne se joue avant d'avoir basculé sur la base locale.

1. Dans un terminal à toi, lancer et **laisser tourner** : `npm run db:start` (PostgreSQL embarqué, port 5434).
2. Dans `.env.local`, commenter la ligne `DATABASE_URL` de production et décommenter celle de la base locale.
3. `npm run db:deploy` puis `npm run db:seed` pour repeupler la base locale.

Le passage en production se fera en fin de plan, sauvegarde faite.

## Structure des fichiers

| Fichier | Responsabilité |
|---|---|
| `prisma/schema.prisma` | modifié : trois champs sur `Product`, nouveau modèle `ProductSection` |
| `src/server/productSpecs.ts` | créé : type, lecture et validation des caractéristiques techniques |
| `src/server/productSpecs.test.ts` | créé : tests du précédent |
| `src/lib/permiso.ts` | créé : exigence de permis déduite de la MMA |
| `src/lib/permiso.test.ts` | créé : tests du précédent |
| `src/app/api/cart/route.ts` | modifié : refus des lignes en `saleMode = "quote"` |
| `src/server/cartLines.ts` | créé : filtrage des lignes non achetables, extrait pour être testable |
| `src/server/cartLines.test.ts` | créé : tests du précédent |
| `src/components/ProductSpecsTable.tsx` | créé : tableau des caractéristiques |
| `src/components/ProductPermisoBlock.tsx` | créé : bloc permis |
| `src/app/[locale]/[group]/[category]/[product]/page.tsx` | modifié : affichage des sections, du tableau et du bloc permis |
| `src/lib/margen.ts` | créé : marge et conversion en centimes |
| `src/lib/margen.test.ts` | créé : tests du précédent |
| `scripts/data/remolques/precios.ts` | créé : table des prix source, par slug |
| `scripts/data/remolques/tipos.ts` | créé : type d'une fiche source |
| `scripts/data/remolques/cheval-liberte.ts` | créé : premier lot de données |
| `scripts/importer-remolques.ts` | créé : importeur générique |

---

### Tâche 1 : schéma Prisma

**Fichiers :**
- Modifier : `prisma/schema.prisma:71-122` (modèle `Product`)
- Créer : la migration sous `prisma/migrations/`

**Interfaces :**
- Produit : les champs `Product.saleMode`, `Product.specs`, `Product.sourceRef` et le modèle `ProductSection`, consommés par toutes les tâches suivantes.

- [ ] **Étape 1 : ajouter les trois champs au modèle `Product`**

Dans `prisma/schema.prisma`, à la suite de `condition` :

```prisma
  // « cart » : achetable en ligne. « quote » : prix non arrêté, la fiche
  // affiche une demande de renseignement et l'ajout au panier est refusé
  // côté serveur — masquer le bouton ne suffirait pas.
  saleMode              String   @default("cart")
  // Caractéristiques techniques en JSON, comme `bullets`. Le schéma reste
  // portable : pas de type JSON natif, pas de liste scalaire.
  specs                 String   @default("{}")
  // Origine de la donnée, jamais affichée. Sert à retrouver la source d'une
  // fiche des années plus tard.
  sourceRef             String?
```

- [ ] **Étape 2 : déclarer la relation vers les sections**

Dans le bloc des relations de `Product`, après `variants` :

```prisma
  sections       ProductSection[]
```

- [ ] **Étape 3 : ajouter le modèle `ProductSection`**

Juste après le modèle `Product`. Il est calqué sur `GuideSection`, qui rend déjà ce service aux catégories :

```prisma
// Section titrée de la description d'un produit. Une fiche détaillée se lit en
// quatre temps — usage, construction, permis et attelage, équipement — et un
// pavé de 400 mots dans un seul champ ne se lit pas. Même forme que
// GuideSection, qui joue ce rôle pour les catégories.
model ProductSection {
  id         String @id @default(cuid())
  productId  String
  heading    String
  body       String
  headingEn  String @default("")
  bodyEn     String @default("")
  position   Int    @default(0)

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId])
}
```

- [ ] **Étape 4 : créer la migration**

Vérifier d'abord que `DATABASE_URL` vise bien la base locale du port 5434, puis :

```bash
npm run db:migrate -- --name catalogue_specs_secciones_venta
```

Attendu : la migration se crée et s'applique, `prisma generate` se relance.

- [ ] **Étape 5 : vérifier les types**

```bash
npx tsc --noEmit
```

Attendu : aucune erreur. Les nouveaux champs portent tous une valeur par défaut, donc aucun appel existant ne casse.

- [ ] **Étape 6 : commit**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "Trois champs de vente et les sections de fiche produit"
```

---

### Tâche 2 : lecture des caractéristiques techniques

**Fichiers :**
- Créer : `src/server/productSpecs.ts`
- Tester : `src/server/productSpecs.test.ts`

**Interfaces :**
- Consomme : le champ `Product.specs` de la tâche 1.
- Produit : `type EspecificacionesRemolque`, `leerEspecificaciones(json: string): EspecificacionesRemolque | null`, `escribirEspecificaciones(specs: EspecificacionesRemolque): string`.

- [ ] **Étape 1 : écrire les tests qui échouent**

Créer `src/server/productSpecs.test.ts` :

```ts
/**
 * Tests de la lecture des caractéristiques techniques.
 *
 * Ce module reçoit du JSON écrit par les scripts d'import et par le
 * back-office. Deux familles de cas comptent : le JSON malformé, qui ne doit
 * jamais faire tomber une page produit, et l'incohérence arithmétique — une
 * charge utile qui ne vaut pas la MMA moins la tara trahit une faute de saisie
 * qu'il vaut mieux refuser que publier.
 *
 * Lancer avec : npm test
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { escribirEspecificaciones, leerEspecificaciones } from "./productSpecs";

const COMPLETAS = {
  plazas: 2,
  mmaKg: 2000,
  taraKg: 700,
  cargaUtilKg: 1300,
  largoInteriorCm: 300,
  anchoInteriorCm: 160,
  altoInteriorCm: 230,
  suelo: "Aluminio",
  ejes: 1,
  frenos: "Inercia",
} as const;

describe("leerEspecificaciones", () => {
  it("lit un jeu complet et cohérent", () => {
    const specs = leerEspecificaciones(JSON.stringify(COMPLETAS));
    assert.equal(specs?.mmaKg, 2000);
    assert.equal(specs?.plazas, 2);
    assert.equal(specs?.suelo, "Aluminio");
  });

  it("refuse un JSON malformé sans lever d'exception", () => {
    assert.equal(leerEspecificaciones("{pas du json"), null);
  });

  it("refuse le défaut du schéma, qui est un objet vide", () => {
    assert.equal(leerEspecificaciones("{}"), null);
  });

  it("refuse une charge utile qui ne vaut pas la MMA moins la tara", () => {
    const faux = { ...COMPLETAS, cargaUtilKg: 999 };
    assert.equal(leerEspecificaciones(JSON.stringify(faux)), null);
  });

  it("refuse une tara supérieure à la MMA", () => {
    const faux = { ...COMPLETAS, taraKg: 2500, cargaUtilKg: -500 };
    assert.equal(leerEspecificaciones(JSON.stringify(faux)), null);
  });

  it("refuse un nombre de places hors de 1 à 6", () => {
    assert.equal(leerEspecificaciones(JSON.stringify({ ...COMPLETAS, plazas: 0 })), null);
    assert.equal(leerEspecificaciones(JSON.stringify({ ...COMPLETAS, plazas: 7 })), null);
  });

  it("refuse une dimension nulle ou négative", () => {
    const faux = { ...COMPLETAS, altoInteriorCm: 0 };
    assert.equal(leerEspecificaciones(JSON.stringify(faux)), null);
  });

  it("refuse un champ texte vide", () => {
    assert.equal(leerEspecificaciones(JSON.stringify({ ...COMPLETAS, suelo: "  " })), null);
  });
});

describe("escribirEspecificaciones", () => {
  it("produit un JSON que leerEspecificaciones relit à l'identique", () => {
    const json = escribirEspecificaciones(COMPLETAS);
    assert.deepEqual(leerEspecificaciones(json), COMPLETAS);
  });
});
```

- [ ] **Étape 2 : lancer les tests pour les voir échouer**

```bash
npm test
```

Attendu : ÉCHEC, `Cannot find module './productSpecs'`.

- [ ] **Étape 3 : écrire l'implémentation minimale**

Créer `src/server/productSpecs.ts` :

```ts
/**
 * Caractéristiques techniques d'une remorque, stockées en JSON dans
 * `Product.specs`.
 *
 * Le champ est une chaîne, comme `bullets` : le schéma reste portable, sans
 * type JSON natif ni liste scalaire. La contrepartie est qu'on ne fait jamais
 * confiance à son contenu — d'où la validation ci-dessous, qui refuse plutôt
 * que de corriger. Une fiche dont les caractéristiques sont incohérentes
 * s'affiche sans tableau technique ; elle ne s'affiche pas avec un tableau faux.
 */

export interface EspecificacionesRemolque {
  /** Nombre de chevaux transportables. */
  readonly plazas: number;
  /** Masse maximale autorisée, en kilogrammes. */
  readonly mmaKg: number;
  /** Masse à vide, en kilogrammes. */
  readonly taraKg: number;
  /** Charge utile : toujours la MMA moins la tara. */
  readonly cargaUtilKg: number;
  readonly largoInteriorCm: number;
  readonly anchoInteriorCm: number;
  readonly altoInteriorCm: number;
  /** Type de plancher, tel que le constructeur le désigne. */
  readonly suelo: string;
  readonly ejes: number;
  /** Type de freinage. */
  readonly frenos: string;
}

/** Bornes de vraisemblance. Au-delà, c'est une faute de saisie, pas une remorque. */
const PLAZAS_MIN = 1;
const PLAZAS_MAX = 6;

function esEnteroPositivo(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isInteger(valor) && valor > 0;
}

function esTextoLleno(valor: unknown): valor is string {
  return typeof valor === "string" && valor.trim().length > 0;
}

/**
 * Lit le JSON du champ `specs`. Renvoie `null` dès qu'une valeur manque, sort
 * des bornes ou contredit les autres — jamais d'exception : une page produit ne
 * doit pas tomber parce qu'un import a mal écrit un champ.
 */
export function leerEspecificaciones(json: string): EspecificacionesRemolque | null {
  let bruto: unknown;
  try {
    bruto = JSON.parse(json);
  } catch {
    return null;
  }

  if (typeof bruto !== "object" || bruto === null) return null;
  const datos = bruto as Record<string, unknown>;

  const numericos = [
    "plazas", "mmaKg", "taraKg", "cargaUtilKg",
    "largoInteriorCm", "anchoInteriorCm", "altoInteriorCm", "ejes",
  ] as const;
  for (const campo of numericos) {
    if (!esEnteroPositivo(datos[campo])) return null;
  }
  for (const campo of ["suelo", "frenos"] as const) {
    if (!esTextoLleno(datos[campo])) return null;
  }

  const plazas = datos.plazas as number;
  if (plazas < PLAZAS_MIN || plazas > PLAZAS_MAX) return null;

  const mmaKg = datos.mmaKg as number;
  const taraKg = datos.taraKg as number;
  const cargaUtilKg = datos.cargaUtilKg as number;

  // La charge utile n'est pas une donnée indépendante : c'est une soustraction.
  // Si les trois valeurs ne se répondent pas, l'une des trois est fausse et on
  // ne sait pas laquelle.
  if (taraKg >= mmaKg) return null;
  if (mmaKg - taraKg !== cargaUtilKg) return null;

  return {
    plazas,
    mmaKg,
    taraKg,
    cargaUtilKg,
    largoInteriorCm: datos.largoInteriorCm as number,
    anchoInteriorCm: datos.anchoInteriorCm as number,
    altoInteriorCm: datos.altoInteriorCm as number,
    suelo: (datos.suelo as string).trim(),
    ejes: datos.ejes as number,
    frenos: (datos.frenos as string).trim(),
  };
}

/** Sérialise pour le champ `specs`. */
export function escribirEspecificaciones(specs: EspecificacionesRemolque): string {
  return JSON.stringify(specs);
}
```

- [ ] **Étape 4 : lancer les tests pour les voir passer**

```bash
npm test
```

Attendu : les dix tests de `productSpecs` passent.

- [ ] **Étape 5 : commit**

```bash
git add src/server/productSpecs.ts src/server/productSpecs.test.ts
git commit -m "Lecture et validation des caractéristiques techniques"
```

---

### Tâche 3 : exigence de permis

**Fichiers :**
- Créer : `src/lib/permiso.ts`
- Tester : `src/lib/permiso.test.ts`

**Interfaces :**
- Consomme : `EspecificacionesRemolque.mmaKg` de la tâche 2.
- Produit : `type ExigenciaPermiso`, `exigenciaPermiso(mmaRemolqueKg: number): ExigenciaPermiso`.

C'est le cœur éditorial du catalogue : la fiche répond à « puis-je tracter ça avec mon permis et ma voiture ». La réponse ne dépend pas de la remorque seule mais de l'ensemble, donc le module renvoie, pour chaque permis, la MMA maximale du véhicule tracteur.

- [ ] **Étape 1 : écrire les tests qui échouent**

Créer `src/lib/permiso.test.ts` :

```ts
/**
 * Tests du calcul d'exigence de permis (RD 818/2009).
 *
 * Trois seuils d'ensemble — 3 500 kg pour le B, 4 250 pour le B96, 7 000 pour
 * le B+E — et une règle particulière : une remorque d'au plus 750 kg reste en
 * permis B quel que soit le véhicule, dans la limite des 3 500 kg que ce permis
 * autorise à conduire.
 *
 * Lancer avec : npm test
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { exigenciaPermiso } from "./permiso";

describe("exigenciaPermiso", () => {
  it("laisse une remorque de 750 kg au permis B avec n'importe quelle voiture", () => {
    const e = exigenciaPermiso(750);
    assert.equal(e.vehiculoMaxConB, 3500);
    assert.equal(e.exigeCamion, false);
  });

  it("calcule le complément à 3 500 kg pour une remorque de 1 500 kg", () => {
    const e = exigenciaPermiso(1500);
    assert.equal(e.vehiculoMaxConB, 2000);
    assert.equal(e.vehiculoMaxConB96, 2750);
    assert.equal(e.vehiculoMaxConBE, 3500);
  });

  it("plafonne le tracteur à 3 500 kg, seuil du permis B lui-même", () => {
    // 7 000 − 800 ferait 6 200, mais aucun titulaire du B+E ne conduit un
    // tracteur de plus de 3 500 kg.
    const e = exigenciaPermiso(800);
    assert.equal(e.vehiculoMaxConBE, 3500);
  });

  it("signale qu'aucune voiture ne suffit en B pour une remorque de 2 700 kg", () => {
    const e = exigenciaPermiso(2700);
    assert.equal(e.vehiculoMaxConB, 800);
    assert.equal(e.bImposibleEnLaPractica, true);
    assert.equal(e.vehiculoMaxConB96, 1550);
  });

  it("reste praticable en B pour une remorque de 1 000 kg", () => {
    const e = exigenciaPermiso(1000);
    assert.equal(e.vehiculoMaxConB, 2500);
    assert.equal(e.bImposibleEnLaPractica, false);
  });

  it("bascule hors B+E au-delà de 3 500 kg de remorque", () => {
    const e = exigenciaPermiso(3600);
    assert.equal(e.exigeCamion, true);
    assert.equal(e.vehiculoMaxConBE, 0);
  });
});
```

- [ ] **Étape 2 : lancer les tests pour les voir échouer**

```bash
npm test
```

Attendu : ÉCHEC, `Cannot find module './permiso'`.

- [ ] **Étape 3 : écrire l'implémentation minimale**

Créer `src/lib/permiso.ts` :

```ts
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
 * Voiture particulière la plus lourde qu'on rencontre couramment. En dessous de
 * ce seuil, dire « permis B » serait exact sur le papier et faux en pratique :
 * aucun véhicule courant ne descend si bas.
 */
const VEHICULO_MINIMO_REALISTA = 1000;

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
```

- [ ] **Étape 4 : lancer les tests pour les voir passer**

```bash
npm test
```

Attendu : les six tests de `permiso` passent.

- [ ] **Étape 5 : commit**

```bash
git add src/lib/permiso.ts src/lib/permiso.test.ts
git commit -m "L'exigence de permis se déduit de la masse de l'ensemble"
```

---

### Tâche 4 : refus du panier pour les fiches sans prix

**Fichiers :**
- Créer : `src/server/cartLines.ts`
- Tester : `src/server/cartLines.test.ts`
- Modifier : `src/app/api/cart/route.ts:67` (après la constitution de `productIds`)

**Interfaces :**
- Consomme : le champ `Product.saleMode` de la tâche 1.
- Produit : `filtrarVendibles<T extends { saleMode: string; active: boolean }>(productos: readonly T[]): T[]`.

Masquer le bouton dans l'interface ne protège de rien : l'API panier accepte un `productId` posté à la main. Le refus doit vivre côté serveur.

- [ ] **Étape 1 : écrire les tests qui échouent**

Créer `src/server/cartLines.test.ts` :

```ts
/**
 * Tests du filtrage des lignes de panier.
 *
 * L'enjeu est simple : une fiche affichée en « consultar precio » n'a pas de
 * prix arrêté. Si elle entrait au panier, le client paierait un montant que
 * personne n'a validé. Le bouton masqué ne suffit pas — l'API reçoit ce qu'on
 * lui poste.
 *
 * Lancer avec : npm test
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { filtrarVendibles } from "./cartLines";

describe("filtrarVendibles", () => {
  it("garde un produit actif et achetable", () => {
    const productos = [{ id: "a", saleMode: "cart", active: true }];
    assert.deepEqual(filtrarVendibles(productos), productos);
  });

  it("écarte un produit en demande de prix", () => {
    const productos = [{ id: "a", saleMode: "quote", active: true }];
    assert.deepEqual(filtrarVendibles(productos), []);
  });

  it("écarte un produit désactivé même s'il est en mode panier", () => {
    const productos = [{ id: "a", saleMode: "cart", active: false }];
    assert.deepEqual(filtrarVendibles(productos), []);
  });

  it("écarte une valeur de saleMode inconnue plutôt que de la laisser passer", () => {
    const productos = [{ id: "a", saleMode: "peut-etre", active: true }];
    assert.deepEqual(filtrarVendibles(productos), []);
  });

  it("ne garde que les lignes vendables d'un panier mélangé", () => {
    const productos = [
      { id: "a", saleMode: "cart", active: true },
      { id: "b", saleMode: "quote", active: true },
      { id: "c", saleMode: "cart", active: true },
    ];
    assert.deepEqual(
      filtrarVendibles(productos).map((p) => p.id),
      ["a", "c"],
    );
  });
});
```

- [ ] **Étape 2 : lancer les tests pour les voir échouer**

```bash
npm test
```

Attendu : ÉCHEC, `Cannot find module './cartLines'`.

- [ ] **Étape 3 : écrire l'implémentation minimale**

Créer `src/server/cartLines.ts` :

```ts
/**
 * Filtrage des lignes de panier selon le mode de vente.
 *
 * Extrait de la route pour être testable sans base de données ni requête HTTP.
 * La règle est volontairement une liste blanche : seul « cart » est achetable.
 * Une valeur inconnue — faute de frappe dans un script d'import, champ ajouté
 * plus tard — se traite comme non vendable, jamais l'inverse.
 */

/** Seul mode de vente qui autorise le passage en caisse. */
const MODO_VENDIBLE = "cart";

export function filtrarVendibles<T extends { saleMode: string; active: boolean }>(
  productos: readonly T[],
): T[] {
  return productos.filter((producto) => producto.active && producto.saleMode === MODO_VENDIBLE);
}
```

- [ ] **Étape 4 : lancer les tests pour les voir passer**

```bash
npm test
```

Attendu : les cinq tests de `cartLines` passent.

- [ ] **Étape 5 : brancher le filtre sur la route du panier**

Dans `src/app/api/cart/route.ts`, ajouter l'import en tête de fichier :

```ts
import { filtrarVendibles } from "@/server/cartLines";
```

Puis, juste après la requête qui charge les produits depuis `productIds`, faire passer le résultat par le filtre avant toute construction de ligne. Le `select` de cette requête doit inclure `saleMode` et `active` s'ils n'y sont pas déjà.

- [ ] **Étape 6 : vérifier types, lint et tests**

```bash
npx tsc --noEmit && npm run lint && npm test
```

Attendu : aucune erreur, tous les tests passent.

- [ ] **Étape 7 : commit**

```bash
git add src/server/cartLines.ts src/server/cartLines.test.ts src/app/api/cart/route.ts
git commit -m "Une fiche sans prix arrêté est refusée au panier côté serveur"
```

---

### Tâche 5 : affichage de la fiche enrichie

**Fichiers :**
- Créer : `src/components/ProductSpecsTable.tsx`
- Créer : `src/components/ProductPermisoBlock.tsx`
- Modifier : `src/app/[locale]/[group]/[category]/[product]/page.tsx:158-181`

**Interfaces :**
- Consomme : `leerEspecificaciones` (tâche 2), `exigenciaPermiso` (tâche 3), `RichText` de `src/components/RichText.tsx`, `ProductSection` (tâche 1).
- Produit : `<ProductSpecsTable specs={…} />` et `<ProductPermisoBlock mmaKg={…} />`.

Le rendu actuel enferme la description dans un seul `<p>` en `text-sm text-muted-foreground`. Un texte de 400 mots y devient un pavé gris. Les sections titrées, le tableau technique et le bloc permis remplacent ce bloc unique.

- [ ] **Étape 1 : créer le tableau des caractéristiques**

`src/components/ProductSpecsTable.tsx` :

```tsx
import type { EspecificacionesRemolque } from "@/server/productSpecs";

/**
 * Tableau technique d'une remorque. Sa forme est identique sur toutes les
 * fiches : c'est ce qui fait tenir la cohérence du catalogue, bien mieux qu'une
 * consigne de rédaction. La prose varie, le tableau non.
 */
export function ProductSpecsTable({
  specs,
  labels,
}: {
  specs: EspecificacionesRemolque;
  labels: Readonly<Record<string, string>>;
}) {
  const filas: readonly (readonly [string, string])[] = [
    [labels.plazas, String(specs.plazas)],
    [labels.mma, `${specs.mmaKg} kg`],
    [labels.tara, `${specs.taraKg} kg`],
    [labels.cargaUtil, `${specs.cargaUtilKg} kg`],
    [labels.medidas, `${specs.largoInteriorCm} × ${specs.anchoInteriorCm} × ${specs.altoInteriorCm} cm`],
    [labels.suelo, specs.suelo],
    [labels.ejes, String(specs.ejes)],
    [labels.frenos, specs.frenos],
  ];

  return (
    <table className="w-full text-sm">
      <tbody>
        {filas.map(([etiqueta, valor]) => (
          <tr key={etiqueta} className="border-b border-border last:border-0">
            <th scope="row" className="py-2 pr-4 text-left font-medium text-muted-foreground">
              {etiqueta}
            </th>
            <td className="py-2 text-right font-semibold text-foreground">{valor}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

- [ ] **Étape 2 : créer le bloc permis**

`src/components/ProductPermisoBlock.tsx` :

```tsx
import { exigenciaPermiso } from "@/lib/permiso";

/**
 * Bloc « quel permis pour tracter ce modèle ».
 *
 * Il ne donne pas une réponse unique — elle dépend de la voiture — mais le
 * seuil que l'acheteur confronte à sa carte grise. C'est la question qu'il se
 * pose vraiment avant d'acheter, et aucun concurrent espagnol n'y répond fiche
 * par fiche.
 */
export function ProductPermisoBlock({
  mmaKg,
  labels,
}: {
  mmaKg: number;
  labels: Readonly<Record<string, string>>;
}) {
  const exigencia = exigenciaPermiso(mmaKg);

  if (exigencia.exigeCamion) {
    return (
      <div className="rounded-[--radius] border border-border bg-muted/40 p-4 text-sm">
        <p className="font-semibold text-foreground">{labels.titulo}</p>
        <p className="mt-1 text-muted-foreground">{labels.exigeCamion}</p>
      </div>
    );
  }

  return (
    <div className="rounded-[--radius] border border-border bg-muted/40 p-4 text-sm">
      <p className="font-semibold text-foreground">{labels.titulo}</p>
      <ul className="mt-2 space-y-1 text-muted-foreground">
        {!exigencia.bImposibleEnLaPractica && (
          <li>{labels.conB.replace("{kg}", String(exigencia.vehiculoMaxConB))}</li>
        )}
        {exigencia.bImposibleEnLaPractica && <li>{labels.bInsuficiente}</li>}
        <li>{labels.conB96.replace("{kg}", String(exigencia.vehiculoMaxConB96))}</li>
        <li>{labels.conBE.replace("{kg}", String(exigencia.vehiculoMaxConBE))}</li>
      </ul>
    </div>
  );
}
```

- [ ] **Étape 3 : ajouter les libellés de traduction**

Dans les fichiers de messages `next-intl` du projet, sous la clé du produit, ajouter en espagnol et en anglais les entrées consommées ci-dessus : `plazas`, `mma`, `tara`, `cargaUtil`, `medidas`, `suelo`, `ejes`, `frenos`, ainsi que `permiso.titulo`, `permiso.conB`, `permiso.conB96`, `permiso.conBE`, `permiso.bInsuficiente`, `permiso.exigeCamion`. Les trois libellés `conB*` contiennent le marqueur `{kg}`. Repérer d'abord le fichier de messages avec `grep -rn "\"details\"" src/` afin de suivre la structure existante.

- [ ] **Étape 4 : remplacer le bloc description de la fiche produit**

Dans `src/app/[locale]/[group]/[category]/[product]/page.tsx`, la section `details` passe des deux colonnes actuelles à : sections titrées rendues par `RichText`, puis tableau technique, puis bloc permis, les puces `bullets` restant en regard. Charger `sections` dans la requête produit, avec `orderBy: { position: "asc" }`. Quand `leerEspecificaciones` renvoie `null`, ni le tableau ni le bloc permis ne s'affichent — la fiche reste valide, simplement sans caractéristiques.

- [ ] **Étape 5 : vérifier types, lint et build**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Attendu : aucune erreur.

- [ ] **Étape 6 : contrôler à l'écran**

Lancer `npm run dev -- -p 3001` dans ton terminal, ouvrir une fiche produit, vérifier que le tableau, les sections et le bloc permis s'affichent, et qu'une fiche sans `specs` s'affiche sans casser.

- [ ] **Étape 7 : commit**

```bash
git add src/components/ProductSpecsTable.tsx src/components/ProductPermisoBlock.tsx "src/app/[locale]/[group]/[category]/[product]/page.tsx"
git commit -m "La fiche produit montre les caractéristiques, les sections et le permis"
```

---

### Tâche 6 : application de la marge sur les prix

**Fichiers :**
- Créer : `scripts/data/remolques/precios.ts`
- Tester : `src/lib/margen.test.ts`
- Créer : `src/lib/margen.ts`

**Interfaces :**
- Produit : `const MARGEN = 1.1`, `precioConMargen(euros: number): number` qui renvoie des **centimes**, et `const PRECIOS: Readonly<Record<string, number>>` dans `scripts/data/remolques/precios.ts`.

Le module se construit maintenant, sans attendre la grille du client : c'est le calcul qui est à figer et à tester, la table de prix se remplira ensuite.

- [ ] **Étape 1 : écrire les tests qui échouent**

Créer `src/lib/margen.test.ts` :

```ts
/**
 * Tests de l'application de la marge.
 *
 * Deux pièges valent d'être verrouillés : la marge doit vivre à un seul
 * endroit, et le passage en centimes doit rester entier — un priceCents
 * fractionnaire ferait diverger le total du panier de la somme des lignes.
 *
 * Lancer avec : npm test
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { MARGEN, precioConMargen } from "./margen";

describe("precioConMargen", () => {
  it("applique bien dix pour cent", () => {
    assert.equal(MARGEN, 1.1);
    assert.equal(precioConMargen(10000), 1_100_000);
  });

  it("arrondit aux dix euros supérieurs, pour un prix affichable", () => {
    // 9 995 × 1,1 = 10 994,50 → 11 000 €
    assert.equal(precioConMargen(9995), 1_100_000);
  });

  it("renvoie toujours un entier de centimes", () => {
    for (const euros of [1600, 3333, 7777, 15900]) {
      assert.ok(Number.isInteger(precioConMargen(euros)), `${euros} donne un non-entier`);
    }
  });

  it("refuse un prix nul ou négatif plutôt que de publier zéro euro", () => {
    assert.throws(() => precioConMargen(0));
    assert.throws(() => precioConMargen(-100));
  });
});
```

- [ ] **Étape 2 : lancer les tests pour les voir échouer**

```bash
npm test
```

Attendu : ÉCHEC, `Cannot find module './margen'`.

- [ ] **Étape 3 : écrire l'implémentation minimale**

Créer `src/lib/margen.ts` :

```ts
/**
 * Marge appliquée aux prix fournis par le client.
 *
 * Elle vit ici et nulle part ailleurs : recopiée fiche par fiche, elle
 * deviendrait impossible à réviser sans rejouer tout le catalogue.
 *
 * ATTENTION à l'assiette. Si la grille transmise contient des PVP conseillés,
 * majorer de 10 % place le site au-dessus des distributeurs que l'acheteur
 * compare en un clic ; s'il s'agit de prix d'achat revendeur, 10 % est au
 * contraire très mince une fois le transport, l'immatriculation et la garantie
 * de deux ans payés. La constante s'ajuste à la lecture de la grille.
 */

export const MARGEN = 1.1;

/** Pas d'arrondi, en euros. Un véhicule ne s'affiche pas à 10 994,50 €. */
const REDONDEO_EUROS = 10;

/**
 * Prix de vente en centimes, marge comprise, arrondi aux dix euros supérieurs.
 * Lève sur une entrée non strictement positive : mieux vaut un import qui
 * s'arrête qu'une fiche publiée à zéro euro.
 */
export function precioConMargen(euros: number): number {
  if (!Number.isFinite(euros) || euros <= 0) {
    throw new Error(`Prix source invalide : ${euros}`);
  }
  const conMargen = euros * MARGEN;
  const redondeado = Math.ceil(conMargen / REDONDEO_EUROS) * REDONDEO_EUROS;
  return Math.round(redondeado * 100);
}
```

- [ ] **Étape 4 : lancer les tests pour les voir passer**

```bash
npm test
```

Attendu : les quatre tests de `margen` passent.

- [ ] **Étape 5 : créer la table de prix, vide en attendant la grille**

Créer `scripts/data/remolques/precios.ts` :

```ts
/**
 * Prix source par slug, en euros, tels que le client les transmet.
 *
 * La marge ne s'applique pas ici : elle vit dans `src/lib/margen.ts`. Un slug
 * absent de cette table entre au catalogue en « consultar precio » plutôt
 * qu'avec un montant approximatif.
 */
export { precioConMargen } from "../../../src/lib/margen";

export const PRECIOS: Readonly<Record<string, number>> = {
  // À remplir à réception de la grille tarifaire du client.
};
```

- [ ] **Étape 6 : commit**

```bash
git add src/lib/margen.ts src/lib/margen.test.ts scripts/data/remolques/precios.ts
git commit -m "La marge de dix pour cent vit à un seul endroit"
```

---

### Tâche 7 : format de données et importeur générique

**Fichiers :**
- Créer : `scripts/data/remolques/tipos.ts`
- Créer : `scripts/data/remolques/cheval-liberte.ts`
- Créer : `scripts/importer-remolques.ts`

**Interfaces :**
- Consomme : `escribirEspecificaciones` et `EspecificacionesRemolque` (tâche 2), `PRECIOS` et `precioConMargen` (tâche 6), les champs et le modèle `ProductSection` de la tâche 1.
- Produit : `type FichaRemolque`, `type SeccionFicha`, `const CHEVAL_LIBERTE: readonly FichaRemolque[]`, et le script d'import.

- [ ] **Étape 1 : définir le type d'une fiche source**

`scripts/data/remolques/tipos.ts` :

```ts
import type { EspecificacionesRemolque } from "../../../src/server/productSpecs";

/** Section titrée de la description longue. */
export interface SeccionFicha {
  readonly heading: string;
  readonly headingEn: string;
  readonly body: string;
  readonly bodyEn: string;
}

/**
 * Fiche telle qu'elle est relevée sur le site du constructeur.
 *
 * Elle ne porte aucun prix : les prix vivent dans `precios.ts` et se rejouent
 * seuls quand la grille du client change, sans toucher aux textes ni aux
 * photographies.
 */
export interface FichaRemolque {
  /** Slug préfixé par marque : cl-, bk-, iw-, ft-, hb-. */
  readonly slug: string;
  readonly brand: string;
  readonly name: string;
  readonly nameEn: string;
  readonly sku: string;
  readonly shortDescription: string;
  readonly shortDescriptionEn: string;
  readonly bullets: readonly string[];
  readonly bulletsEn: readonly string[];
  readonly sections: readonly SeccionFicha[];
  readonly specs: EspecificacionesRemolque;
  /** Adresse de la page constructeur d'où viennent les caractéristiques. */
  readonly sourceRef: string;
}
```

- [ ] **Étape 2 : écrire le premier lot de données**

Créer `scripts/data/remolques/cheval-liberte.ts` avec `export const CHEVAL_LIBERTE: readonly FichaRemolque[]`, rempli des modèles réellement relevés sur chevalliberte.com. Aucune valeur inventée : un modèle dont la fiche technique ne donne pas la tara n'entre pas dans le fichier tant que la donnée manque.

Forme attendue de chaque entrée — les valeurs numériques ci-dessous sont à remplacer par celles relevées, jamais à recopier telles quelles :

```ts
import type { FichaRemolque } from "./tipos";

export const CHEVAL_LIBERTE: readonly FichaRemolque[] = [
  {
    slug: "cl-gold-touring-2",
    brand: "Cheval Liberté",
    name: "Gold Touring 2",
    nameEn: "Gold Touring 2",
    sku: "CL-GT2",
    shortDescription: "…",       // deux phrases, relevé technique à l'appui
    shortDescriptionEn: "…",
    bullets: ["…"],
    bulletsEn: ["…"],
    sections: [
      { heading: "Uso previsto", headingEn: "Intended use", body: "…", bodyEn: "…" },
      { heading: "Construcción", headingEn: "Build", body: "…", bodyEn: "…" },
      { heading: "Permiso y enganche", headingEn: "Licence and towing", body: "…", bodyEn: "…" },
      { heading: "Equipamiento de serie", headingEn: "Standard equipment", body: "…", bodyEn: "…" },
    ],
    specs: {
      plazas: 2, mmaKg: 2000, taraKg: 700, cargaUtilKg: 1300,
      largoInteriorCm: 300, anchoInteriorCm: 160, altoInteriorCm: 230,
      suelo: "Aluminio", ejes: 1, frenos: "Inercia",
    },
    sourceRef: "https://www.chevalliberte.com/…",
  },
];
```

- [ ] **Étape 3 : écrire l'importeur**

`scripts/importer-remolques.ts`, sur le modèle de `scripts/importer-produits-marche.ts` — même style d'en-tête commenté, avec la ligne de lancement. Ossature :

```ts
import { prisma } from "../src/server/prisma";
import { escribirEspecificaciones } from "../src/server/productSpecs";
import { CHEVAL_LIBERTE } from "./data/remolques/cheval-liberte";
import { PRECIOS, precioConMargen } from "./data/remolques/precios";
import type { FichaRemolque } from "./data/remolques/tipos";

const LOTES: readonly (readonly FichaRemolque[])[] = [CHEVAL_LIBERTE];
const SECO = process.argv.includes("--dry-run");

/** Le nombre de places décide de la catégorie, dans l'univers « nuevos ». */
function slugCategoria(plazas: number): string {
  if (plazas <= 1) return "un-caballo";
  if (plazas === 2) return "dos-caballos";
  return "tres-cuatro-caballos";
}

async function importar(ficha: FichaRemolque) {
  const grupo = await prisma.group.findUnique({ where: { slug: "nuevos" } });
  if (!grupo) throw new Error("L'univers « nuevos » est absent de la base.");

  const categoria = await prisma.category.findUnique({
    where: { groupId_slug: { groupId: grupo.id, slug: slugCategoria(ficha.specs.plazas) } },
  });
  if (!categoria) throw new Error(`Catégorie absente pour ${ficha.slug}.`);

  // Pas de prix connu : la fiche entre en demande de renseignement plutôt
  // qu'avec un montant que personne n'a validé.
  const euros = PRECIOS[ficha.slug];
  const datosPrecio =
    euros === undefined
      ? { priceCents: 0, saleMode: "quote" }
      : { priceCents: precioConMargen(euros), saleMode: "cart" };

  const datos = {
    categoryId: categoria.id,
    brand: ficha.brand,
    name: ficha.name,
    nameEn: ficha.nameEn,
    sku: ficha.sku,
    shortDescription: ficha.shortDescription,
    shortDescriptionEn: ficha.shortDescriptionEn,
    bullets: JSON.stringify(ficha.bullets),
    bulletsEn: JSON.stringify(ficha.bulletsEn),
    specs: escribirEspecificaciones(ficha.specs),
    sourceRef: ficha.sourceRef,
    condition: "new",
    ...datosPrecio,
  };

  if (SECO) {
    console.log(`${ficha.slug} → ${categoria.slug} (${datos.saleMode})`);
    return;
  }

  const producto = await prisma.product.upsert({
    where: { slug: ficha.slug },
    create: { slug: ficha.slug, ...datos },
    update: datos,
  });

  // Les sections se remplacent en bloc : plus simple et plus sûr qu'un
  // rapprochement titre par titre, et rien d'autre ne les référence.
  await prisma.productSection.deleteMany({ where: { productId: producto.id } });
  await prisma.productSection.createMany({
    data: ficha.sections.map((seccion, position) => ({ productId: producto.id, ...seccion, position })),
  });
}

async function main() {
  for (const lote of LOTES) {
    for (const ficha of lote) await importar(ficha);
  }
  console.log(SECO ? "Essai à blanc terminé." : "Import terminé.");
}

main().finally(() => prisma.$disconnect());
```

Le script ne supprime jamais un produit existant.

- [ ] **Étape 4 : jouer l'import à blanc sur la base locale**

```bash
node --env-file=.env.local --import tsx scripts/importer-remolques.ts --dry-run
```

Attendu : la liste des fiches qui seraient créées ou mises à jour, sans écriture.

- [ ] **Étape 5 : jouer l'import pour de vrai, puis le rejouer**

```bash
node --env-file=.env.local --import tsx scripts/importer-remolques.ts
node --env-file=.env.local --import tsx scripts/importer-remolques.ts
```

Attendu : le second passage ne crée aucun doublon — l'`upsert` sur le slug rend le script relançable.

- [ ] **Étape 6 : commit**

```bash
git add scripts/data/remolques scripts/importer-remolques.ts
git commit -m "Importeur générique des remorques et premier lot Cheval Liberté"
```

---

## Vérification finale

- [ ] `npm test` — tous les tests passent
- [ ] `npx tsc --noEmit` — aucune erreur de type
- [ ] `npm run lint` — aucune alerte
- [ ] `npm run build` — la production compile
- [ ] Une fiche importée s'affiche avec tableau, sections et bloc permis
- [ ] Une fiche en `saleMode = "quote"` refuse l'ajout au panier, y compris par appel direct de l'API
- [ ] `git status` propre

Le passage de la migration en production se fait ensuite, **sauvegarde de la base faite au préalable**, en rebasculant `DATABASE_URL` sur le VPS puis `npm run db:deploy`.
