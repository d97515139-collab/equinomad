import { test } from "node:test";
import assert from "node:assert/strict";
import { routing } from "./routing";

test("le routage expose les cinq langues de la boutique", () => {
  assert.deepEqual(routing.locales, ["es", "en", "fr", "de", "it"]);
  assert.equal(routing.defaultLocale, "es");
});
