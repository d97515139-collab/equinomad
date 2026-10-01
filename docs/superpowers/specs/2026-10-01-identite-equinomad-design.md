# Identité Equinomad — conception

Date : 1er octobre 2026
État : conception validée en conversation, en attente de relecture de ce document

## Contexte

Ce dépôt est une copie indépendante de la boutique Remolque Caballos, reprise
pour un nouveau client. Le code, la base Neon (`eu-central-1`) et les images
Cloudinary ont été clonés (voir `docs/CLONAGE.md`). Le site porte encore
l'identité de l'ancien client : son nom, son domaine, son adresse à Petra, son
WhatsApp, son compte administrateur et son IBAN.

Le nouveau client est une société espagnole. Il vendra sous la marque
**Equinomad** (`equinomad.com`) dans huit pays : Espagne, France, Portugal,
Belgique, Suisse, Norvège, Suède et Irlande.

Le chantier complet est découpé en cinq sous-projets, chacun avec sa propre
conception, son plan et son exécution :

1. **Identité Equinomad** — ce document ;
2. socle multi-pays : URL par pays-langue, hreflang, TVA du pays de livraison
   (OSS), devises CHF/NOK/SEK, livraison par zone, flux Merchant par pays ;
3. langues portugais, néerlandais, norvégien et suédois ;
4. nouveau design ;
5. pages légales par pays.

## Objectif

À la fin de ce sous-projet, plus aucune trace de l'ancien client ne subsiste
dans le code, les données livrées, les scripts ni la base. La marque, le
domaine et l'e-mail viennent d'un seul fichier. Les coordonnées de la société,
encore inconnues, sont des valeurs d'exemple rassemblées en un seul endroit et
signalées par un contrôle avant mise en ligne.

## Décisions prises avec le client

| Sujet | Décision |
|---|---|
| Marque | Equinomad |
| Domaine | `https://equinomad.com` (sans `www`) |
| E-mail public | `info@equinomad.com` |
| Coordonnées de la société | Pas encore connues : valeurs d'exemple `[A COMPLETAR]` |
| Commandes copiées (9) | Supprimées : données personnelles de l'ancien client |
| Logo | Provisoire, nom en lettres ; le vrai logo vient avec le sous-projet 4 |
| Remorques d'occasion sans marque connue (134) | Champ marque vide, aucune marque affichée |
| Compte administrateur | `d97515139@gmail.com`, nouveau mot de passe |
| Préfixe de commande | `EQ-AAAA-NNNNNN` |
| Approvisionnement des 134 occasions | Confirmé par le client |

## Périmètre

**Dans ce sous-projet**

- configuration centrale de la marque et de la société ;
- remplacement de l'ancienne identité dans le code, les textes, les e-mails,
  les flux, les scripts et la documentation ;
- logo provisoire et images dérivées ;
- nettoyage de la base Neon ;
- garde-fous contre le retour de l'ancienne identité.

**Hors de ce sous-projet**

- URL par pays, TVA par pays, devises, zones de livraison : sous-projet 2 ;
- bugs relevés par l'analyse du code et rattachés au sous-projet 2 : la France
  absente de la liste des pays (`"es"` à la place de `"FR"` dans
  `src/lib/countries.ts`), les commandes limitées à `es`/`en`, les pages de
  paiement Mollie et Nexi ouvertes en français, la facture sans TVA ;
- nouvelles langues : sous-projet 3 ;
- couleurs, polices, logo définitif : sous-projet 4 ;
- réécriture juridique des pages légales : sous-projet 5. Ici, seules les
  coordonnées y sont remplacées.

## Conception

### 1. Configuration centrale

Deux modules nouveaux, sans dépendance serveur, importables partout :

**`src/config/brand.ts`**

```ts
export const BRAND = {
  name: "Equinomad",
  domain: "equinomad.com",
  siteUrl: "https://equinomad.com",
  email: "info@equinomad.com",
  orderPrefix: "EQ",
  cloudinaryFolder: "equinomad/products",
  cartStorageKey: "equinomad.cart.v1",
} as const;
```

`siteUrl` reste le repli quand `NEXT_PUBLIC_SITE_URL` est absente ; la variable
d'environnement garde la priorité, comme aujourd'hui.

**`src/config/company.ts`**

L'objet `COMPANY`, aujourd'hui défini dans `src/content/legal/es.ts`, y est
déplacé avec les mêmes champs (`name`, `legalForm`, `street`, `city`,
`country`, `email`, `phone`, `managingDirector`, `register`, `siren`, `siret`,
`capital`, `vatId`, `domain`, `host`). Les valeurs inconnues portent le
marqueur `[A COMPLETAR]`. `email` et `domain` viennent de `BRAND`. Le module
exporte aussi `missingCompanyFields()`, qui renvoie la liste des champs
contenant encore le marqueur.

`src/content/legal/es.ts`, `en.ts`, `index.ts`, la facture, le pied de page,
la bulle de contact, le flux Merchant et les e-mails importent `COMPANY` depuis
ce module. Le numéro WhatsApp reste surchargeable par
`NEXT_PUBLIC_WHATSAPP_NUMBER`.

### 2. Remplacement dans le code

Toute occurrence de « Remolque Caballos », `remolquecaballos`, « Equivan » ou
« EQUIVAN » dans `src/`, `data/`, `scripts/` et `prisma/` est remplacée :

- par `BRAND.*` ou `COMPANY.*` dans le code TypeScript ;
- par le texte « Equinomad » dans les fichiers de messages
  (`src/messages/es.json`, `en.json`) et les données livrées
  (`data/store/products.json`), qui ne peuvent pas importer de module.

Points particuliers :

- **E-mails marketing** (`src/server/emails/campaign.ts`,
  `src/components/admin/CampaignStepMessage.tsx`) : le pied d'e-mail contient
  en dur une troisième identité (EQUIVAN, Villebichot, RCS Dijon, numéro de TVA
  français). Il est reconstruit à partir de `COMPANY`.
- **Flux Merchant** (`src/server/merchant.ts`) : `SHOP_NAME` vient de `BRAND`,
  `SHOP_PHONE` de `COMPANY.phone` (les deux numéros divergent aujourd'hui). Les
  textes résiduels d'anciens projets dans les routes de flux (« bois de
  chauffage », `hausgeraete-pfeffer-google-feed.tsv`) sont remplacés par
  Equinomad.
- **Panier** : la clé de stockage local devient `equinomad.cart.v1`.
- **Cloudinary** : `CLOUDINARY_PRODUCT_FOLDER` devient `BRAND.cloudinaryFolder`.
  Les images déjà envoyées gardent leur adresse actuelle.
- **Scripts** : les scripts de traduction (`scripts/traduire-*.mjs`) et
  `scripts/local-postgres.mjs` sont mis à jour pour ne pas réintroduire
  l'ancien nom s'ils sont relancés.

### 3. Textes produit et marque vide

`src/lib/productContent.ts` génère les textes des fiches. La phrase d'accroche
devient « En Equinomad, el … » (et ses équivalents en, fr, de, it).

Pour un produit dont `brand` est vide, le générateur produit une tournure sans
marque : « Este remolque para 2 caballos … » au lieu de « El Remolque Caballos
para 2 caballos … ». Le champ `Product.brand` est non nullable dans le schéma :
« aucune marque » s'écrit chaîne vide, sans migration.

Partout où la marque est affichée (carte produit, fiche, panier, back-office,
JSON-LD), une marque vide n'affiche rien : pas d'espace en tête, pas de « par »
orphelin.

Dans le flux Merchant, une marque vide ne doit plus exclure le produit
(`src/server/merchant.ts:625`). Le flux omet l'attribut `brand` et déclare
`identifier_exists` à `no`, comme Google le demande pour un produit d'occasion
sans marque ni GTIN. Le titre du flux ne commence plus par une espace.

### 4. Logo provisoire

Le logo devient le mot « Equinomad » composé en lettres, dans la police des
titres actuelle. Il est servi en SVG dans `src/components/brand/Logo.tsx`. Le
script `scripts/generer-logos.mjs` en dérive les images bitmap :
`public/images/logo-full.png`, `logo-full-light.png`, `logo-icon.png` (initiale
« E ») et `src/app/icon.png`.

Les e-mails déclarent aujourd'hui un ratio de 747×162 alors que le logo fait
1280×427. Les quatre modèles d'e-mail lisent désormais les dimensions depuis
une constante unique exportée par le module du logo.

### 5. Numéro de commande

`nextOrderNumber()` (`src/server/orders.ts`) utilise `BRAND.orderPrefix` :
`EQ-2026-014679` pour la première commande. Le plancher `ORDER_NUMBER_BASE`
est conservé : il évite d'afficher un « 000001 » qui trahirait une boutique
neuve. Les commandes copiées étant supprimées, la séquence repart de ce
plancher.

### 6. Nettoyage de la base Neon

Un script unique, `scripts/rebranding-equinomad.ts` :

- s'exécute **à blanc par défaut** et affiche ce qu'il ferait, table par table ;
- avec `--apply`, enregistre d'abord les lignes concernées en JSON dans
  `.migration/` (ignoré par Git), puis applique tout en **une seule
  transaction** ;
- est **idempotent** : relancé, il ne trouve plus rien à faire.

Opérations :

| Table | Opération |
|---|---|
| `Order`, `OrderItem`, `OrderEvent` | Suppression des 9 commandes, 10 lignes et 18 événements |
| `StockMovement` | Suppression des mouvements de vente (`reason = verkauf`) liés à ces commandes, et rétablissement du stock correspondant sur `Product.stock` |
| `Product` | `brand` vidée pour les 134 produits marqués « Remolque Caballos » ; « Remolque Caballos » remplacé par « Equinomad » dans les textes des cinq langues ; tournures « El Remolque Caballos para … » régénérées sans marque |
| `LegalContent` | Dans les 19 pages, remplacement du nom, du domaine, de l'e-mail, du téléphone et de l'adresse par les valeurs de `COMPANY` |
| `Setting` (`bank_transfer`) | Titulaire, IBAN et BIC vidés |
| `PaymentMethod` (`transferencia`) | Désactivé tant que l'IBAN n'est pas renseigné |
| `AdminUser` | E-mail `d97515139@gmail.com`, mot de passe neuf (lu dans `.env.local`), sessions existantes invalidées |

Le lien entre un mouvement de stock et une commande n'existe pas en clé
étrangère : le plan d'implémentation vérifie comment la note du mouvement
référence la commande avant d'écrire la règle de rapprochement. Si le
rapprochement est impossible, le script s'arrête et le signale au lieu de
deviner.

La sauvegarde intégrale de la base source (`.migration/source.dump`) reste
disponible : en cas de problème, la base peut être reconstruite depuis zéro.

### 7. Documentation et configuration

- `README.md` et `TARGET.md` réécrits pour Equinomad. `TARGET.md` sert de
  consigne de projet à toute session de travail : il décrit la marque, la
  société espagnole, les huit marchés et le découpage en sous-projets.
- `.env.example` : nom d'expéditeur Equinomad, plus aucune trace d'Equivan.
- `package.json` : `name` passe à `equinomad`.
- `docs/CLONAGE.md` est conservé tel quel, comme historique.

### 8. Garde-fous et tests

- **Test d'absence de l'ancienne identité** : `src/config/legacyBrand.test.ts`
  parcourt `src/`, `data/`, `scripts/`, `prisma/` ainsi que `README.md`,
  `TARGET.md`, `.env.example` et `package.json`, et échoue si l'un des motifs
  `Remolque Caballos`, `remolquecaballos`, `Equivan` (insensible à la casse)
  y apparaît. Le fichier de test lui-même et `docs/` (historique de clonage,
  anciennes conceptions) sont exclus.
- **Tests unitaires nouveaux** : format `EQ-AAAA-NNNNNN` ; tournure sans marque
  du générateur de textes ; `missingCompanyFields()` ; produit sans marque
  conservé dans le flux Merchant avec `identifier_exists = no`.
- **Tests existants** qui citent l'ancien nom (`productContent.test.ts`,
  `legalPageInput.test.ts` et ceux que le test d'absence signalera) : adaptés.
- **Contrôle avant mise en ligne** : `npm run check:launch` liste les champs
  `[A COMPLETAR]` de `COMPANY`, l'absence de SMTP et d'IBAN, et se termine en
  erreur tant qu'il en reste.

### 9. Vérification de fin

- `npm test`, `npm run lint` et la vérification TypeScript passent ;
- le script de base relancé à blanc ne trouve plus rien à faire ;
- en local, l'accueil, une catégorie, une fiche neuve, une fiche d'occasion
  sans marque, une page légale, le panier et la connexion au back-office
  affichent Equinomad et aucune trace de l'ancien client ;
- le build de production complet ne peut pas tourner sur le poste de
  développement (mémoire insuffisante) : il sera validé sur l'hébergement.

## Risques

- **Textes en base générés par des scripts** : les fiches ont été rédigées par
  des scripts à partir de gabarits. Un remplacement textuel naïf peut produire
  des tournures maladroites. Le script remplace les phrases connues des
  gabarits et liste toute occurrence restante au lieu de la modifier à
  l'aveugle.
- **Pages légales en base** : elles remplacent les textes du code. Les y
  laisser avec l'ancienne identité ferait réapparaître Petra et l'ancien
  téléphone. Le script les traite toutes, et le test de fin vérifie leur rendu.
- **Accès administrateur** : tant que le SMTP n'est pas configuré, le code de
  connexion s'affiche dans la console du serveur. C'est le comportement de
  développement existant ; en production, le SMTP est obligatoire et
  `check:launch` le rappelle.
