import { test } from "node:test";
import assert from "node:assert/strict";
import { withBrand } from "./brandName";

test("marque et modèle sont séparés par une espace", () => {
  assert.equal(withBrand("Böckmann", "Portax"), "Böckmann Portax");
});

test("sans marque, le modèle seul, sans espace en tête", () => {
  assert.equal(withBrand("", "Van para dos caballos"), "Van para dos caballos");
  assert.equal(withBrand("   ", "Van"), "Van");
  assert.equal(withBrand(null, "Van"), "Van");
});
