/**
 * Tests du calcul d'exigence de permis (RD 818/2009).
 *
 * Trois seuils d'ensemble — 3 500 kg pour le B, 4 250 pour le B96, 7 000 pour
 * le B+E — et une règle particulière : une remorque d'au plus 750 kg reste en
 * permis B quel que soit le véhicule, dans la limite des 3 500 kg que ce permis
 * autorise à conduire.
 *
 * Lancer avec : npm test
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { exigenciaPermiso, VEHICULO_MINIMO_REALISTA } from "./permiso";

describe("exigenciaPermiso", () => {
  it("laisse une remorque de 750 kg au permis B avec n'importe quelle voiture", () => {
    const e = exigenciaPermiso(750);
    assert.equal(e.vehiculoMaxConB, 3500);
    assert.equal(e.exigeCamion, false);
  });

  it("calcule le complément à 3 500 kg pour une remorque de 1 500 kg", () => {
    const e = exigenciaPermiso(1500);
    assert.equal(e.vehiculoMaxConB, 2000);
    assert.equal(e.vehiculoMaxConB96, 2750);
    assert.equal(e.vehiculoMaxConBE, 3500);
  });

  it("plafonne le tracteur à 3 500 kg, seuil du permis B lui-même", () => {
    // 7 000 − 800 ferait 6 200, mais aucun titulaire du B+E ne conduit un
    // tracteur de plus de 3 500 kg.
    const e = exigenciaPermiso(800);
    assert.equal(e.vehiculoMaxConBE, 3500);
  });

  it("signale qu'aucune voiture ne suffit en B pour une remorque de 2 700 kg", () => {
    const e = exigenciaPermiso(2700);
    assert.equal(e.vehiculoMaxConB, 800);
    assert.equal(e.bImposibleEnLaPractica, true);
    assert.equal(e.vehiculoMaxConB96, 1550);
  });

  it("reste praticable en B pour une remorque de 1 000 kg", () => {
    const e = exigenciaPermiso(1000);
    assert.equal(e.vehiculoMaxConB, 2500);
    assert.equal(e.bImposibleEnLaPractica, false);
  });

  it("bascule hors B+E au-delà de 3 500 kg de remorque", () => {
    const e = exigenciaPermiso(3600);
    assert.equal(e.exigeCamion, true);
    assert.equal(e.vehiculoMaxConBE, 0);
  });

  it("laisse le B96 sous le seuil réaliste pour une remorque de 3 500 kg", () => {
    // 4 250 − 3 500 = 750 kg de véhicule : aucune voiture n'y entre. La valeur
    // est exacte, c'est à l'affichage de ne pas la présenter comme une option.
    const e = exigenciaPermiso(3500);
    assert.equal(e.vehiculoMaxConB96, 750);
    assert.ok(e.vehiculoMaxConB96 < VEHICULO_MINIMO_REALISTA);
    assert.equal(e.vehiculoMaxConBE, 3500);
    assert.equal(e.exigeCamion, false);
  });
});
