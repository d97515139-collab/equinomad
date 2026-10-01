export interface WhitelistRetirementInput {
  slug: string;
  active: boolean;
}

export interface WhitelistRetirementPlan {
  keepActive: WhitelistRetirementInput[];
  activate: WhitelistRetirementInput[];
  deactivate: WhitelistRetirementInput[];
  alreadyInactive: WhitelistRetirementInput[];
  missingKeepSlugs: string[];
}

export function buildWhitelistRetirementPlan(
  products: readonly WhitelistRetirementInput[],
  keepSlugs: readonly string[],
): WhitelistRetirementPlan {
  const keep = new Set(keepSlugs);
  const seen = new Set(products.map((product) => product.slug));

  return {
    keepActive: products.filter((product) => product.active && keep.has(product.slug)),
    activate: products.filter((product) => !product.active && keep.has(product.slug)),
    deactivate: products.filter((product) => product.active && !keep.has(product.slug)),
    alreadyInactive: products.filter((product) => !product.active && !keep.has(product.slug)),
    missingKeepSlugs: keepSlugs.filter((slug) => !seen.has(slug)),
  };
}
