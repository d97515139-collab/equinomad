/**
 * Nom affiché d'un produit : « Marque Modèle », ou le modèle seul quand la
 * marque est vide — cas des remorques d'occasion dont le fabricant est inconnu.
 */
export function withBrand(brand: string | null | undefined, name: string): string {
  return [brand?.trim(), name.trim()].filter(Boolean).join(" ");
}
