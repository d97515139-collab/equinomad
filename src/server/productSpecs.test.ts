/**
 * Tests de la lecture des caractéristiques techniques.
 *
 * Ce module reçoit du JSON écrit par les scripts d'import et par le
 * back-office. Deux familles de cas comptent : le JSON malformé, qui ne doit
 * jamais faire tomber une page produit, et l'incohérence arithmétique — une
 * charge utile qui ne vaut pas la MMA moins la tara trahit une faute de saisie
 * qu'il vaut mieux refuser que publier.
 *
 * Lancer avec : npm test
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { escribirEspecificaciones, leerEspecificaciones } from "./productSpecs";

const COMPLETAS = {
  plazas: 2,
  mmaKg: 2000,
  taraKg: 700,
  cargaUtilKg: 1300,
  largoInteriorCm: 300,
  anchoInteriorCm: 160,
  altoInteriorCm: 230,
  suelo: "Aluminio",
  ejes: 1,
  frenos: "Inercia",
} as const;

/**
 * Jeu sans essieux ni freins. Les distributeurs publient les masses et les
 * dimensions, presque jamais le nombre d'essieux ni le type de freinage : les
 * exiger reviendrait à refuser toute la gamme, ou à inventer.
 */
const SIN_EJES_NI_FRENOS = {
  plazas: 2,
  mmaKg: 2600,
  taraKg: 850,
  cargaUtilKg: 1750,
  largoInteriorCm: 331,
  anchoInteriorCm: 168,
  altoInteriorCm: 238,
  suelo: "Aluminio con goma antideslizante de 8 mm",
} as const;

/** Le jeu ci-dessus privé d'un champ, pour vérifier ce qui est exigé. */
function sin(campo: keyof typeof SIN_EJES_NI_FRENOS): Record<string, unknown> {
  const copia: Record<string, unknown> = { ...SIN_EJES_NI_FRENOS };
  delete copia[campo];
  return copia;
}

describe("leerEspecificaciones", () => {
  it("lit un jeu complet et cohérent", () => {
    const specs = leerEspecificaciones(JSON.stringify(COMPLETAS));
    assert.equal(specs?.mmaKg, 2000);
    assert.equal(specs?.plazas, 2);
    assert.equal(specs?.suelo, "Aluminio");
  });

  it("refuse un JSON malformé sans lever d'exception", () => {
    assert.equal(leerEspecificaciones("{pas du json"), null);
  });

  it("refuse le défaut du schéma, qui est un objet vide", () => {
    assert.equal(leerEspecificaciones("{}"), null);
  });

  it("refuse une charge utile qui ne vaut pas la MMA moins la tara", () => {
    const faux = { ...COMPLETAS, cargaUtilKg: 999 };
    assert.equal(leerEspecificaciones(JSON.stringify(faux)), null);
  });

  it("refuse une tara supérieure à la MMA", () => {
    const faux = { ...COMPLETAS, taraKg: 2500, cargaUtilKg: -500 };
    assert.equal(leerEspecificaciones(JSON.stringify(faux)), null);
  });

  it("refuse un nombre de places hors de 1 à 6", () => {
    assert.equal(leerEspecificaciones(JSON.stringify({ ...COMPLETAS, plazas: 0 })), null);
    assert.equal(leerEspecificaciones(JSON.stringify({ ...COMPLETAS, plazas: 7 })), null);
  });

  it("refuse une dimension nulle ou négative", () => {
    const faux = { ...COMPLETAS, altoInteriorCm: 0 };
    assert.equal(leerEspecificaciones(JSON.stringify(faux)), null);
  });

  it("refuse un champ texte vide", () => {
    assert.equal(leerEspecificaciones(JSON.stringify({ ...COMPLETAS, suelo: "  " })), null);
  });

  it("accepte une fiche sans essieux ni freins, que les sources ne publient pas", () => {
    const specs = leerEspecificaciones(JSON.stringify(SIN_EJES_NI_FRENOS));
    assert.equal(specs?.mmaKg, 2600);
    assert.equal(specs?.ejes, undefined);
    assert.equal(specs?.frenos, undefined);
  });

  it("refuse un nombre d'essieux présent mais absurde", () => {
    const faux = { ...SIN_EJES_NI_FRENOS, ejes: 0 };
    assert.equal(leerEspecificaciones(JSON.stringify(faux)), null);
  });

  it("refuse un type de freins présent mais vide", () => {
    const faux = { ...SIN_EJES_NI_FRENOS, frenos: "   " };
    assert.equal(leerEspecificaciones(JSON.stringify(faux)), null);
  });

  it("accepte une fiche sans plancher, que Böckmann ne publie pas partout", () => {
    const specs = leerEspecificaciones(JSON.stringify(sin("suelo")));
    assert.equal(specs?.mmaKg, 2600);
    assert.equal(specs?.suelo, undefined);
  });

  it("refuse un plancher présent mais vide", () => {
    assert.equal(leerEspecificaciones(JSON.stringify({ ...SIN_EJES_NI_FRENOS, suelo: " " })), null);
  });

  it("exige toujours les masses et les dimensions", () => {
    assert.equal(leerEspecificaciones(JSON.stringify(sin("mmaKg"))), null);
    assert.equal(leerEspecificaciones(JSON.stringify(sin("largoInteriorCm"))), null);
  });
});

describe("escribirEspecificaciones", () => {
  it("produit un JSON que leerEspecificaciones relit à l'identique", () => {
    const json = escribirEspecificaciones(COMPLETAS);
    assert.deepEqual(leerEspecificaciones(json), COMPLETAS);
  });
});
