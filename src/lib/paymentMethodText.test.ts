import { test } from "node:test";
import assert from "node:assert/strict";
import { localizePaymentMethod, paymentFaqAnswer } from "./paymentMethodText";

const carte = { id: "1", key: "tarjeta", label: "Tarjeta bancaria", description: "Visa y Mastercard.", feeLabel: "sin recargo" };
const fr = { label: "Carte bancaire", description: "Visa et Mastercard.", fee: "sans frais" };

test("hors espagnol, un moyen connu prend la traduction du site", () => {
  assert.deepEqual(localizePaymentMethod(carte, "fr", fr), { ...carte, label: "Carte bancaire", description: "Visa et Mastercard.", feeLabel: "sans frais" });
});

test("l'espagnol garde le texte du back-office, et un moyen inconnu aussi", () => {
  assert.equal(localizePaymentMethod(carte, "es", fr), carte);
  assert.equal(localizePaymentMethod(carte, "fr", undefined), carte);
});

const phrases = {
  intro: "Vous pouvez payer par {moyens}.",
  et: "et",
  virement: "Pour ces montants, le virement est le plus simple.",
  financement: "Un financement est possible.",
};

test("la FAQ ne cite que les moyens actifs, dans l'ordre du back-office", () => {
  assert.equal(
    paymentFaqAnswer(["Carte bancaire", "PayPal"], { transferencia: false, financiacion: false }, phrases),
    "Vous pouvez payer par Carte bancaire et PayPal.",
  );
});

test("le virement et le financement ne sont mis en avant que s'ils sont actifs", () => {
  assert.equal(
    paymentFaqAnswer(["Virement bancaire", "Carte bancaire", "PayPal"], { transferencia: true, financiacion: false }, phrases),
    "Vous pouvez payer par Virement bancaire, Carte bancaire et PayPal. Pour ces montants, le virement est le plus simple.",
  );
  assert.equal(
    paymentFaqAnswer(["Virement bancaire"], { transferencia: true, financiacion: true }, phrases),
    "Vous pouvez payer par Virement bancaire. Pour ces montants, le virement est le plus simple. Un financement est possible.",
  );
});

test("sans aucun moyen actif, pas de phrase vide", () => {
  assert.equal(paymentFaqAnswer([], { transferencia: false, financiacion: false }, phrases), null);
});
