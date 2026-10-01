import { test } from "node:test";
import assert from "node:assert/strict";
import { parseProductInput, toCreateInput } from "./productInput";

test("une fiche existante sans marque s'enregistre avec une marque vide", () => {
  const { values, errors } = parseProductInput({ brand: "", name: "Van de ocasión" }, "update");
  assert.deepEqual(errors, []);
  assert.equal(values.brand, "");
});

test("une occasion sans marque se crée, la marque restant vide", () => {
  const { values, errors } = parseProductInput(
    { categoryId: "remolques/dos-caballos", brand: "", name: "Van de ocasión", price: "4.500,00 €" },
    "create",
  );
  assert.deepEqual(errors, []);
  assert.equal(toCreateInput(values)?.brand, "");
});
