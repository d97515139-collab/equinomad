/**
 * Tests du filtrage des lignes de panier.
 *
 * L'enjeu est simple : une fiche affichée en « consultar precio » n'a pas de
 * prix arrêté. Si elle entrait au panier, le client paierait un montant que
 * personne n'a validé. Le bouton masqué ne suffit pas — l'API reçoit ce qu'on
 * lui poste.
 *
 * Lancer avec : npm test
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { filtrarVendibles } from "./cartLines";

describe("filtrarVendibles", () => {
  it("garde un produit actif et achetable", () => {
    const productos = [{ id: "a", saleMode: "cart", active: true }];
    assert.deepEqual(filtrarVendibles(productos), productos);
  });

  it("écarte un produit en demande de prix", () => {
    const productos = [{ id: "a", saleMode: "quote", active: true }];
    assert.deepEqual(filtrarVendibles(productos), []);
  });

  it("écarte un produit désactivé même s'il est en mode panier", () => {
    const productos = [{ id: "a", saleMode: "cart", active: false }];
    assert.deepEqual(filtrarVendibles(productos), []);
  });

  it("écarte une valeur de saleMode inconnue plutôt que de la laisser passer", () => {
    const productos = [{ id: "a", saleMode: "peut-etre", active: true }];
    assert.deepEqual(filtrarVendibles(productos), []);
  });

  it("ne garde que les lignes vendables d'un panier mélangé", () => {
    const productos = [
      { id: "a", saleMode: "cart", active: true },
      { id: "b", saleMode: "quote", active: true },
      { id: "c", saleMode: "cart", active: true },
    ];
    assert.deepEqual(
      filtrarVendibles(productos).map((p) => p.id),
      ["a", "c"],
    );
  });
});
