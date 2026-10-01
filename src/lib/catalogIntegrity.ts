export interface CatalogIntegrityInput {
  id: string;
  brand: string;
  name: string;
  image: string | null;
  priceCents: number;
  saleMode: string;
  categoryLabel: string;
}

export interface CatalogIntegrityItem {
  id: string;
  title: string;
  note: string;
}

export interface CatalogIntegrityReport {
  withoutOwnPhoto: CatalogIntegrityItem[];
  withIllustration: CatalogIntegrityItem[];
  withoutValidatedPrice: CatalogIntegrityItem[];
}

function cleanImage(image: string | null | undefined): string {
  return image?.trim() ?? "";
}

/** Les dessins historiques vivent sous /images/remolques/. */
export function isCatalogIllustration(image: string | null | undefined): boolean {
  return cleanImage(image).startsWith("/images/remolques/");
}

/**
 * Une vraie photo produit peut venir de Cloudinary, d'un téléversement local
 * ou du repli local des scripts d'import.
 */
export function hasOwnCatalogPhoto(image: string | null | undefined): boolean {
  const value = cleanImage(image);
  if (!value) return false;
  if (/^https?:\/\//.test(value)) return true;
  if (value.startsWith("/uploads/")) return true;
  if (value.startsWith("/images/productos/")) return true;
  return false;
}

function itemOf(product: CatalogIntegrityInput): CatalogIntegrityItem {
  return {
    id: product.id,
    title: `${product.brand} ${product.name}`,
    note: product.categoryLabel,
  };
}

export function buildCatalogIntegrityReport(
  products: readonly CatalogIntegrityInput[],
): CatalogIntegrityReport {
  return {
    withoutOwnPhoto: products.filter((product) => !hasOwnCatalogPhoto(product.image)).map(itemOf),
    withIllustration: products.filter((product) => isCatalogIllustration(product.image)).map(itemOf),
    withoutValidatedPrice: products
      .filter((product) => product.priceCents <= 0 || product.saleMode !== "cart")
      .map(itemOf),
  };
}
