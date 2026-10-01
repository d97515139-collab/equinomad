// Utilitaires de conversion de prix — module pur, sans dépendance à la base.
// Importable dans les parseurs de saisie et les tests sans déclencher Prisma.

/**
 * Convertit une chaîne de prix espagnole ("9.280,00 €") en centimes.
 * Retourne 0 si la valeur est manquante ou non numérique.
 */
export function toCents(value: string): number {
  const normalized = value.replace(/\./g, "").replace(",", ".").replace(/[^0-9.]/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : 0;
}

/**
 * Formate des centimes en chaîne de prix espagnole ("9.280,00 €").
 *
 * `useGrouping: "always"` est explicite : par défaut, l'espagnol ne sépare pas
 * les milliers en dessous de cinq chiffres, si bien qu'une colonne de prix
 * affichait « 5980,00 € » au-dessus de « 16.480,00 € ». La règle
 * typographique est juste, mais dans un tableau comparatif elle casse
 * l'alignement des ordres de grandeur — la seule chose que cette colonne sert
 * à lire.
 */
export function formatPrice(cents: number): string {
  return `${(cents / 100).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: "always",
  })} €`;
}
