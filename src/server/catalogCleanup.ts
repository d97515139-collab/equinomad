/**
 * Logique pure du nettoyage du catalogue hérité (scripts/nettoyer-catalogue.ts),
 * isolée ici pour être testée sans base.
 *
 * Deux opérations :
 * - désactiver une liste d'annonces nommées (hors sujet ou sans prix) : elles
 *   restent en base et se réactivent depuis le back-office ;
 * - ranger chaque remorque dans le rayon de son état : une occasion classée
 *   dans « nuevos » rejoint le même gabarit dans « ocasion », et inversement.
 */

export interface CleanupProduct {
  slug: string;
  categoryId: string;
  condition: string;
  active: boolean;
}

export interface CleanupCategory {
  id: string;
  group: string;
  slug: string;
}

export interface CategoryMove {
  slug: string;
  from: string;
  to: string;
  toId: string;
}

export interface CleanupPlan {
  /** Annonces actives à désactiver. */
  deactivate: string[];
  /** Slugs demandés mais absents de la base. */
  missing: string[];
  /** Annonces à changer de rayon. */
  moves: CategoryMove[];
  /** Annonces au mauvais rayon sans catégorie équivalente dans le bon. */
  unmovable: string[];
}

const RAYON_PAR_ETAT: Readonly<Record<string, string>> = { new: "nuevos", used: "ocasion" };

export function planCatalogCleanup(
  products: readonly CleanupProduct[],
  categories: readonly CleanupCategory[],
  toDeactivate: readonly string[],
): CleanupPlan {
  const parId = new Map(categories.map((c) => [c.id, c]));
  const parChemin = new Map(categories.map((c) => [`${c.group}/${c.slug}`, c]));
  const parSlug = new Map(products.map((p) => [p.slug, p]));
  const retirees = new Set(toDeactivate);

  const plan: CleanupPlan = {
    deactivate: toDeactivate.filter((slug) => parSlug.get(slug)?.active === true),
    missing: toDeactivate.filter((slug) => !parSlug.has(slug)),
    moves: [],
    unmovable: [],
  };

  for (const p of products) {
    if (!p.active || retirees.has(p.slug)) continue;
    const categorie = parId.get(p.categoryId);
    const rayon = RAYON_PAR_ETAT[p.condition];
    if (!categorie || !rayon || categorie.group === rayon) continue;
    const cible = parChemin.get(`${rayon}/${categorie.slug}`);
    if (!cible) {
      plan.unmovable.push(p.slug);
      continue;
    }
    plan.moves.push({
      slug: p.slug,
      from: `${categorie.group}/${categorie.slug}`,
      to: `${cible.group}/${cible.slug}`,
      toId: cible.id,
    });
  }
  return plan;
}
