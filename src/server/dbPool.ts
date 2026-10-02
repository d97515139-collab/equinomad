/**
 * Connexions PostgreSQL ouvertes par processus.
 *
 * Le build de Vercel lance plusieurs processus en parallèle (next.config.ts,
 * NEXT_BUILD_CPUS), chacun avec son propre pool : sur un serveur partagé dont
 * le compte de la boutique est limité en connexions, DATABASE_POOL_MAX réduit
 * chaque pool pour que le total reste sous cette limite.
 */
export function poolMax(env: Readonly<Record<string, string | undefined>> = process.env): number {
  const valeur = Number(env.DATABASE_POOL_MAX);
  return Number.isInteger(valeur) && valeur > 0 ? valeur : 10;
}
