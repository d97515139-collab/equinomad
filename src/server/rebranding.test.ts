import { test } from "node:test";
import assert from "node:assert/strict";
import { COMPANY } from "@/config/company";
import {
  hasLegacyIdentity,
  planStockRestoration,
  rebrandLegalText,
  rebrandProductText,
} from "./rebranding";

test("la boutique vendeuse devient Equinomad", () => {
  assert.equal(
    rebrandProductText("En Remolque Caballos, el Böckmann Portax se presenta como un remolque nuevo."),
    "En Equinomad, el Böckmann Portax se presenta como un remolque nuevo.",
  );
  assert.equal(
    rebrandProductText("Bei Remolque Caballos wird der Portax vorgestellt."),
    "Bei Equinomad wird der Portax vorgestellt.",
  );
});

test("l'ancien nom employé comme nom de produit devient un nom générique", () => {
  assert.equal(
    rebrandProductText("El vehículo El Remolque Caballos para 2 caballos es una unidad de segunda mano."),
    "El vehículo El Remolque para 2 caballos es una unidad de segunda mano.",
  );
  assert.equal(rebrandProductText("Remolque Caballos - 2 caballos"), "Remolque para caballos - 2 caballos");
  assert.equal(rebrandProductText("Remolque Caballos Furgo 2"), "Remolque para caballos Furgo 2");
});

test("le remplacement des textes produit est idempotent", () => {
  const source = "En Remolque Caballos, el Remolque Caballos para 2 caballos.";
  const une = rebrandProductText(source);
  assert.equal(rebrandProductText(une), une);
  assert.equal(hasLegacyIdentity(une), false);
});

test("les pages légales perdent l'ancienne identité et restent du JSON valide", () => {
  const source = JSON.stringify({
    sections: [
      {
        body:
          "Remolque Caballos, S.L., Ctra. Petra - Santa Margalida, km 3, 07520 Petra (Illes Balears), España. " +
          "Correo: contacto@remolquecaballos.com. Web: www.remolquecaballos.com. WhatsApp: +34 612 553 303.",
        list: ["REMOLQUE CABALLOS, S.L.", "07520 Petra (Balearic Islands)", "privacidad@remolquecaballos.com"],
      },
    ],
    intro: "un modelo para la tienda en línea Remolque Caballos.",
  });
  const sortie = rebrandLegalText(source);
  assert.doesNotThrow(() => JSON.parse(sortie));
  assert.equal(hasLegacyIdentity(sortie), false);
  assert.ok(sortie.includes(COMPANY.name));
  assert.ok(sortie.includes(COMPANY.street));
  assert.ok(sortie.includes("info@equinomad.com"));
  assert.ok(sortie.includes("la tienda en línea Equinomad"));
  assert.equal(rebrandLegalText(sortie), sortie);
});

test("le stock des commandes supprimées est rétabli", () => {
  const plan = planStockRestoration(
    [
      { id: "m1", productId: "p1", delta: -1, reason: "verkauf", note: "Commande RC-2026-014679" },
      { id: "m2", productId: "p1", delta: -1, reason: "verkauf", note: "Commande RC-2026-014681" },
      { id: "m3", productId: "p2", delta: 5, reason: "wareneingang", note: null },
    ],
    ["RC-2026-014679", "RC-2026-014681"],
  );
  assert.deepEqual(plan.movementIds, ["m1", "m2"]);
  assert.deepEqual(plan.increments, { p1: 2 });
  assert.deepEqual(plan.unmatched, []);
});

test("une vente impossible à rattacher est signalée, pas devinée", () => {
  const plan = planStockRestoration(
    [
      { id: "m1", productId: "p1", delta: -1, reason: "verkauf", note: "vente comptoir" },
      { id: "m2", productId: "p1", delta: -1, reason: "verkauf", note: "Commande RC-2026-999999" },
    ],
    ["RC-2026-014679"],
  );
  assert.deepEqual(plan.movementIds, []);
  assert.deepEqual(plan.unmatched, ["m1", "m2"]);
});

test("une annulation qui cite une commande supprimée bloque au lieu de fausser le stock", () => {
  const plan = planStockRestoration(
    [
      { id: "m1", productId: "p1", delta: -1, reason: "verkauf", note: "Commande RC-2026-014679" },
      { id: "m2", productId: "p1", delta: 1, reason: "retoure", note: "Stornierung RC-2026-014679" },
      { id: "m3", productId: "p2", delta: 3, reason: "korrektur", note: "Inventaire" },
    ],
    ["RC-2026-014679"],
  );
  assert.deepEqual(plan.unmatched, ["m2"]);
});
