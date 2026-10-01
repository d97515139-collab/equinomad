import { test } from "node:test";
import assert from "node:assert/strict";
import {
  acceptLanguageOverride,
  browserLanguageSupported,
  isCrawler,
  localeForCountry,
} from "./localeDetection";

const CHROME =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36";

test("les robots d'indexation sont reconnus", () => {
  assert.equal(isCrawler("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"), true);
  assert.equal(isCrawler("Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"), true);
  assert.equal(isCrawler(CHROME), false);
  assert.equal(isCrawler(null), false);
});

test("le pays donne la langue la plus proche parmi celles du site", () => {
  assert.equal(localeForCountry("ES"), "es");
  assert.equal(localeForCountry("FR"), "fr");
  assert.equal(localeForCountry("BE"), "fr");
  assert.equal(localeForCountry("CH"), "de");
  assert.equal(localeForCountry("AT"), "de");
  assert.equal(localeForCountry("IT"), "it");
  assert.equal(localeForCountry("PT"), "es");
  assert.equal(localeForCountry("NO"), "en");
  assert.equal(localeForCountry("se"), "en");
  assert.equal(localeForCountry("IE"), "en");
  assert.equal(localeForCountry(null), undefined);
});

test("une langue du navigateur est reconnue si le site la propose", () => {
  assert.equal(browserLanguageSupported("fr-FR,fr;q=0.9"), true);
  assert.equal(browserLanguageSupported("nb-NO,nb;q=0.9,en;q=0.5"), true);
  assert.equal(browserLanguageSupported("pt-PT,pt;q=0.9"), false);
  assert.equal(browserLanguageSupported("*"), false);
  assert.equal(browserLanguageSupported(null), false);
});

test("le pays ne sert que si le navigateur ne parle aucune langue du site", () => {
  const sans = { hasLocaleCookie: false };
  assert.equal(acceptLanguageOverride({ ...sans, acceptLanguage: "pt-PT,pt;q=0.9", country: "PT" }), "es");
  assert.equal(acceptLanguageOverride({ ...sans, acceptLanguage: "nb-NO,nb;q=0.9", country: "NO" }), "en");
  assert.equal(acceptLanguageOverride({ ...sans, acceptLanguage: null, country: "FR" }), "fr");
  assert.equal(acceptLanguageOverride({ ...sans, acceptLanguage: "fr-FR,fr;q=0.9", country: "ES" }), undefined);
  assert.equal(acceptLanguageOverride({ ...sans, acceptLanguage: "pt-PT", country: null }), undefined);
  assert.equal(
    acceptLanguageOverride({ hasLocaleCookie: true, acceptLanguage: "pt-PT", country: "PT" }),
    undefined,
    "un choix déjà fait par le visiteur prime",
  );
});
