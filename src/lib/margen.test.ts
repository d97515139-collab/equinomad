/**
 * Tests de l'application de la marge.
 *
 * Deux pièges valent d'être verrouillés : la marge doit vivre à un seul
 * endroit, et le passage en centimes doit rester entier — un priceCents
 * fractionnaire ferait diverger le total du panier de la somme des lignes.
 *
 * Lancer avec : npm test
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { MARGEN, precioConMargen } from "./margen";

describe("precioConMargen", () => {
  it("applique bien dix pour cent", () => {
    assert.equal(MARGEN, 1.1);
    assert.equal(precioConMargen(10000), 1_100_000);
  });

  it("arrondit aux dix euros supérieurs, pour un prix affichable", () => {
    // 9 995 × 1,1 = 10 994,50 → 11 000 €
    assert.equal(precioConMargen(9995), 1_100_000);
  });

  it("renvoie toujours un entier de centimes", () => {
    for (const euros of [1600, 3333, 7777, 15900]) {
      assert.ok(Number.isInteger(precioConMargen(euros)), `${euros} donne un non-entier`);
    }
  });

  it("refuse un prix nul ou négatif plutôt que de publier zéro euro", () => {
    assert.throws(() => precioConMargen(0));
    assert.throws(() => precioConMargen(-100));
  });
});
