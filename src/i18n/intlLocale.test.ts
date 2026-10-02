import { test } from "node:test";
import assert from "node:assert/strict";
import { intlLocale } from "./intlLocale";

test("chaque langue du site a son format de date régional", () => {
  assert.equal(intlLocale("es"), "es-ES");
  assert.equal(intlLocale("en"), "en-GB");
  assert.equal(intlLocale("fr"), "fr-FR");
  assert.equal(intlLocale("de"), "de-DE");
  assert.equal(intlLocale("it"), "it-IT");
  assert.equal(intlLocale("pt"), "es-ES");
});
