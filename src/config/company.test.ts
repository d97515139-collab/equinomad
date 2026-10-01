import { test } from "node:test";
import assert from "node:assert/strict";
import {
  COMPANY,
  PENDING_MARK,
  companyWhatsappDigits,
  legalPagesWithPendingMark,
  missingCompanyFields,
} from "./company";

test("les coordonnées inconnues portent le marqueur et sont listées", () => {
  assert.deepEqual(missingCompanyFields(), [
    "name", "legalForm", "street", "city", "phone", "managingDirector",
    "register", "siren", "siret", "capital", "vatId", "host",
  ]);
  assert.ok(COMPANY.name.startsWith(PENDING_MARK));
});

test("les champs connus viennent de la marque", () => {
  assert.equal(COMPANY.email, "info@equinomad.com");
  assert.equal(COMPANY.domain, "equinomad.com");
  assert.equal(COMPANY.country, "España");
});

test("une société complète n'a plus de champ manquant", () => {
  assert.deepEqual(missingCompanyFields({ name: "Equinomad, S.L.", city: "28001 Madrid" }), []);
});

test("sans numéro renseigné ni surcharge, pas de chiffres WhatsApp", () => {
  const avant = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  try {
    assert.equal(companyWhatsappDigits(), "");
  } finally {
    if (avant !== undefined) process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = avant;
  }
});

test("la surcharge NEXT_PUBLIC_WHATSAPP_NUMBER est réduite à ses chiffres", () => {
  const avant = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "+34 600 11 22 33";
  try {
    assert.equal(companyWhatsappDigits(), "34600112233");
  } finally {
    if (avant === undefined) delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    else process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = avant;
  }
});

test("les pages légales en base qui portent encore le marqueur sont listées", () => {
  const pages = [
    { locale: "es", slug: "mentions-legales", data: `{"body":"${PENDING_MARK}: CIF]"}` },
    { locale: "en", slug: "faq", data: '{"body":"Equinomad"}' },
  ];
  assert.deepEqual(legalPagesWithPendingMark(pages), ["es/mentions-legales"]);
});
