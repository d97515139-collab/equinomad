import { test } from "node:test";
import assert from "node:assert/strict";
import { COMPANY } from "@/config/company";
import {
  hasLegacyIdentity,
  isLegacyOrderNumber,
  pickLegacyAdmin,
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

test("l'intitulé générique « Remolque caballos » des annonces devient « Remolque para caballos »", () => {
  assert.equal(
    rebrandProductText("Remolque caballos Ifor Williams HB506"),
    "Remolque para caballos Ifor Williams HB506",
  );
  const phrase = "En Remolque Caballos, el Remolque caballos SM PROVAN 2 plazas se presenta.";
  const une = rebrandProductText(phrase);
  assert.equal(une, "En Equinomad, el Remolque para caballos SM PROVAN 2 plazas se presenta.");
  assert.equal(rebrandProductText(une), une);
  assert.equal(hasLegacyIdentity(une), false);
});

test("seules les commandes à l'ancien préfixe sont visées", () => {
  assert.equal(isLegacyOrderNumber("RC-2026-014679"), true);
  assert.equal(isLegacyOrderNumber("EQ-2026-014679"), false);
});

test("seul un administrateur à l'ancienne adresse est basculé", () => {
  const ancien = { id: "a1", email: "contacto@remolquecaballos.com" };
  const nouveau = { id: "a2", email: "d97515139@gmail.com" };
  assert.equal(pickLegacyAdmin([nouveau, ancien])?.id, "a1");
  assert.equal(pickLegacyAdmin([nouveau]), undefined);
});

test("le gérant et l'hébergeur d'exemple de l'ancien client deviennent les champs à compléter", () => {
  const source = JSON.stringify({
    es: "Administrador único y responsable de los contenidos: Nombre Apellidos (a completar).",
    en: "Sole administrator responsible for the contents: First name Last name (to be completed).",
    hostEs: "El sitio está alojado por Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Alemania",
    hostEn: "The site is hosted by Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Germany",
  });
  const sortie = rebrandLegalText(source);
  assert.doesNotThrow(() => JSON.parse(sortie));
  assert.doesNotMatch(sortie, /Hetzner|Nombre Apellidos|First name Last name/);
  assert.ok(sortie.includes(`contenidos: ${COMPANY.managingDirector}.`));
  assert.ok(sortie.includes(`hosted by ${COMPANY.host}`));
  assert.equal(rebrandLegalText(sortie), sortie);
});
