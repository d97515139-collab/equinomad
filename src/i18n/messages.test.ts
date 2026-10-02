import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { routing } from "./routing";
import { messagesLocaleFor } from "./request";

type Messages = { [key: string]: string | Messages };

function cles(objet: Messages, prefixe = ""): string[] {
  return Object.entries(objet).flatMap(([cle, valeur]) =>
    typeof valeur === "string" ? [prefixe + cle] : cles(valeur, `${prefixe}${cle}.`),
  );
}

function lire(locale: string): Messages {
  return JSON.parse(readFileSync(path.join(process.cwd(), "src", "messages", `${locale}.json`), "utf8")) as Messages;
}

test("chaque langue du site a son propre fichier de messages", () => {
  for (const locale of routing.locales) {
    assert.equal(messagesLocaleFor(locale), locale, locale);
    assert.ok(existsSync(path.join(process.cwd(), "src", "messages", `${locale}.json`)), locale);
  }
});

test("tous les fichiers de messages portent exactement les clés de l'espagnol", () => {
  const reference = cles(lire("es"));
  for (const locale of routing.locales) {
    assert.deepEqual(cles(lire(locale)), reference, locale);
  }
});

test("une langue inconnue retombe sur l'espagnol", () => {
  assert.equal(messagesLocaleFor("pt"), "es");
});
