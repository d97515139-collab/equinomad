import { test } from "node:test";
import assert from "node:assert/strict";
import { pickList, pickLocale, pickText } from "./localizedContent";

const libelles = { en: "Used trailers", fr: "Remorques d'occasion", de: "Gebrauchte Anhänger", it: "" };

test("chaque langue lit sa propre colonne", () => {
  assert.equal(pickLocale("fr", libelles), "Remorques d'occasion");
  assert.equal(pickLocale("de", libelles), "Gebrauchte Anhänger");
  assert.equal(pickLocale("en", libelles), "Used trailers");
});

test("une colonne vide retombe sur l'anglais", () => {
  assert.equal(pickLocale("it", libelles), "Used trailers");
  assert.equal(pickLocale("fr", { ...libelles, fr: "   " }), "Used trailers");
});

const ERREUR_TRADUCTION =
  "MYMEMORY WARNING: YOU USED ALL AVAILABLE FREE TRANSLATIONS FOR TODAY. NEXT AVAILABLE IN 17 HOURS";

test("une traduction remplacée par un message d'erreur du traducteur est ignorée", () => {
  assert.equal(pickText("Remolque para caballos dos plazas", ERREUR_TRADUCTION), "Remolque para caballos dos plazas");
  assert.deepEqual(pickList(["Suelo de aluminio"], [ERREUR_TRADUCTION]), ["Suelo de aluminio"]);
  assert.deepEqual(pickList(["a"], ["Aluminiumboden", ERREUR_TRADUCTION]), ["Aluminiumboden"]);
});
