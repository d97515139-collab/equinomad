import { test } from "node:test";
import assert from "node:assert/strict";
import { parseContactPayload } from "./contactInput";

const valide = { name: "  Luc Martin ", email: "Luc@Example.fr ", phone: "", message: "Livrez-vous en Suisse ?", page: "/fr/contact", locale: "fr", website: "" };

test("un message complet est accepté et nettoyé", () => {
  const r = parseContactPayload(valide);
  assert.ok(r.ok);
  if (r.ok) {
    assert.equal(r.value.name, "Luc Martin");
    assert.equal(r.value.email, "luc@example.fr");
    assert.equal(r.value.locale, "fr");
  }
});

test("champs obligatoires et adresse e-mail vérifiés", () => {
  assert.deepEqual(parseContactPayload({ ...valide, name: " " }), { ok: false, code: "invalid" });
  assert.deepEqual(parseContactPayload({ ...valide, email: "pas-une-adresse" }), { ok: false, code: "invalid" });
  assert.deepEqual(parseContactPayload({ ...valide, message: "ok" }), { ok: false, code: "invalid" });
  assert.deepEqual(parseContactPayload({ ...valide, message: "x".repeat(5001) }), { ok: false, code: "invalid" });
  assert.deepEqual(parseContactPayload(null), { ok: false, code: "invalid" });
});

test("le champ piège rempli par un robot est refusé sans le dire", () => {
  assert.deepEqual(parseContactPayload({ ...valide, website: "http://spam.example" }), { ok: false, code: "spam" });
});

test("une page ou une langue inattendue n'est pas reprise", () => {
  const r = parseContactPayload({ ...valide, page: "https://ailleurs.example/x", locale: "xx" });
  assert.ok(r.ok);
  if (r.ok) {
    assert.equal(r.value.page, "");
    assert.equal(r.value.locale, "es");
  }
});
