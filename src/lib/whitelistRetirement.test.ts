import assert from "node:assert/strict";
import { test } from "node:test";

import { buildWhitelistRetirementPlan, type WhitelistRetirementInput } from "./whitelistRetirement";

function produit(surcharge: Partial<WhitelistRetirementInput> = {}): WhitelistRetirementInput {
  return {
    slug: "producto-a",
    active: true,
    ...surcharge,
  };
}

test("ne garde actifs que les slugs de la liste blanche", () => {
  const plan = buildWhitelistRetirementPlan(
    [
      produit({ slug: "a-conserver" }),
      produit({ slug: "a-retirer" }),
      produit({ slug: "a-reactiver", active: false }),
      produit({ slug: "deja-inactif", active: false }),
    ],
    ["a-conserver", "a-reactiver", "introuvable"],
  );

  assert.deepEqual(plan.keepActive.map((item) => item.slug), ["a-conserver"]);
  assert.deepEqual(plan.activate.map((item) => item.slug), ["a-reactiver"]);
  assert.deepEqual(plan.deactivate.map((item) => item.slug), ["a-retirer"]);
  assert.deepEqual(plan.alreadyInactive.map((item) => item.slug), ["deja-inactif"]);
  assert.deepEqual(plan.missingKeepSlugs, ["introuvable"]);
});
