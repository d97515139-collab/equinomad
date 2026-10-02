import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { routing } from "@/i18n/routing";
import { Flag } from "./Flag";

const rendu = (locale: string) => renderToStaticMarkup(createElement(Flag, { locale }));

test("chaque langue du site a son drapeau en SVG, décoratif", () => {
  for (const locale of routing.locales) {
    const svg = rendu(locale);
    assert.match(svg, /^<svg[^>]*aria-hidden="true"/, locale);
  }
});

test("les couleurs officielles de chaque drapeau", () => {
  assert.match(rendu("es"), /#AA151B[\s\S]*#F1BF00/i);
  assert.match(rendu("fr"), /#002654[\s\S]*#CE1126/i);
  assert.match(rendu("de"), /#000000[\s\S]*#DD0000[\s\S]*#FFCE00/i);
  assert.match(rendu("it"), /#009246[\s\S]*#CE2B37/i);
  assert.match(rendu("en"), /#012169[\s\S]*#C8102E/i);
});

test("deux drapeaux britanniques sur la même page n'ont pas les mêmes identifiants de découpe", () => {
  const page = renderToStaticMarkup(createElement("div", null, createElement(Flag, { locale: "en" }), createElement(Flag, { locale: "en" })));
  const ids = [...page.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length);
});

test("une langue inconnue ne rend rien", () => {
  assert.equal(rendu("xx"), "");
});
