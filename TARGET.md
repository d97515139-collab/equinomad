# Projet Equinomad

## Origine

Copie indépendante d'une boutique espagnole de remorques pour chevaux, reprise
pour un nouveau client (voir `docs/CLONAGE.md`). Base Neon `eu-central-1`,
compte Cloudinary et dépôt GitHub propres à ce projet.

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
