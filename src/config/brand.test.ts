import { test } from "node:test";
import assert from "node:assert/strict";
import { BRAND, publicSiteUrl } from "./brand";

test("BRAND porte l'identité Equinomad", () => {
  assert.equal(BRAND.name, "Equinomad");
  assert.equal(BRAND.domain, "equinomad.com");
  assert.equal(BRAND.siteUrl, "https://equinomad.com");
  assert.equal(BRAND.email, "info@equinomad.com");
  assert.equal(BRAND.orderPrefix, "EQ");
});

test("publicSiteUrl retombe sur BRAND.siteUrl sans variable d'environnement", () => {
  const avant = process.env.NEXT_PUBLIC_SITE_URL;
  delete process.env.NEXT_PUBLIC_SITE_URL;
  try {
    assert.equal(publicSiteUrl(), "https://equinomad.com");
  } finally {
    if (avant !== undefined) process.env.NEXT_PUBLIC_SITE_URL = avant;
  }
});

test("publicSiteUrl suit la variable d'environnement et retire la barre finale", () => {
  const avant = process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000/";
  try {
    assert.equal(publicSiteUrl(), "http://localhost:3000");
  } finally {
    if (avant === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = avant;
  }
});
