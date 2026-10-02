import { parsePrice } from "@/lib/price";
import type { Product } from "@/types/home";

/**
 * Tranches de budget et sélection du catalogue, partagées par le sélecteur de
 * l'en-tête, la page de sélection (/recherche) et les filtres des catégories.
 * Module neutre (ni client ni serveur) : la page serveur et les composants
 * client lisent les mêmes valeurs.
 */

// L'identifiant "id" est stable et sert d'état comme de paramètre d'adresse
// (?precio=…) ; seul le libellé est traduit, via "category.priceRanges.<id>".
export interface PriceRange {
  id: string;
  min: number;
  max: number;
}

// Bornes calées sur les remorques : les occasions démarrent vers 900 €, le gros
// du stock se situe entre 5 000 et 12 000 €, les vans haut de gamme dépassent
// 30 000 €. Les tranches précédentes venaient de la boutique de bois dont ce
// socle est issu (« jusqu'à 500 € ») et ne renvoyaient rien pour une remorque.
//
// Intervalles fermés à gauche et ouverts à droite : 8 000 € tombe dans
// « 8 000 – 12 000 » et nulle part ailleurs, chaque prix dans une seule tranche.
export const PRICE_RANGES: readonly PriceRange[] = [
  { id: "hasta5000", min: 0, max: 5000 },
  { id: "de5000a8000", min: 5000, max: 8000 },
  { id: "de8000a12000", min: 8000, max: 12000 },
  { id: "de12000a20000", min: 12000, max: 20000 },
  { id: "mas20000", min: 20000, max: Infinity },
];

export function priceRangeById(id: string | null | undefined): PriceRange | undefined {
  return PRICE_RANGES.find((range) => range.id === id);
}

/** Un produit sans prix réel (0 €) n'entre dans aucun budget. */
export function inPriceRange(price: number, range: PriceRange): boolean {
  return price > 0 && price >= range.min && price < range.max;
}

/** Univers de remorques : les accessoires restent hors de la sélection. */
const GROUPES_REMORQUES = new Set(["nuevos", "ocasion"]);

export interface SelectionCriteria {
  /** Slug du nombre de places (« dos-caballos »), commun au neuf et à l'occasion. */
  plazas?: string;
  /** Identifiant de tranche de budget. */
  precio?: string;
}

/**
 * Remorques neuves et d'occasion répondant aux critères, du moins cher au plus
 * cher. Les produits sans prix réel passent en fin de liste.
 */
export function selectProducts(
  pages: readonly { group: string; slug: string; products: readonly Product[] }[],
  criteria: SelectionCriteria,
): Product[] {
  const range = priceRangeById(criteria.precio);
  const vus = new Set<string>();
  const produits = pages
    .filter((page) => GROUPES_REMORQUES.has(page.group) && (!criteria.plazas || page.slug === criteria.plazas))
    .flatMap((page) => page.products)
    .filter((product) => {
      const cle = product.id ?? product.href;
      if (vus.has(cle)) return false;
      vus.add(cle);
      return !range || inPriceRange(parsePrice(product.price), range);
    });
  const prix = (product: Product) => parsePrice(product.price) || Infinity;
  return produits.sort((a, b) => prix(a) - prix(b));
}

/** Adresse de la page de sélection pour ces critères. */
export function selectionHref(criteria: SelectionCriteria): string {
  const params = new URLSearchParams();
  if (criteria.plazas) params.set("plazas", criteria.plazas);
  if (criteria.precio) params.set("precio", criteria.precio);
  return `/recherche?${params.toString()}`;
}
