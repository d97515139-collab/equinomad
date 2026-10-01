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
