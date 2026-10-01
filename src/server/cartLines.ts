/**
 * Filtrage des lignes de panier selon le mode de vente.
 *
 * Extrait de la route pour être testable sans base de données ni requête HTTP.
 * La règle est volontairement une liste blanche : seul « cart » est achetable.
 * Une valeur inconnue — faute de frappe dans un script d'import, mode ajouté
 * plus tard — se traite comme non vendable, jamais l'inverse.
 */

/** Seul mode de vente qui autorise le passage en caisse. */
const MODO_VENDIBLE = "cart";

export function filtrarVendibles<T extends { saleMode: string; active: boolean }>(
  productos: readonly T[],
): T[] {
  return productos.filter((producto) => producto.active && producto.saleMode === MODO_VENDIBLE);
}
