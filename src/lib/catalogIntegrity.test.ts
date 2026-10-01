import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildCatalogIntegrityReport,
  hasOwnCatalogPhoto,
  isCatalogIllustration,
  type CatalogIntegrityInput,
} from "./catalogIntegrity";

function produit(surcharge: Partial<CatalogIntegrityInput> = {}): CatalogIntegrityInput {
  return {
    id: "prod-1",
    brand: "Cheval Liberté",
    name: "Touring One",
    image: "https://res.cloudinary.com/demo/image/upload/photo.jpg",
    priceCents: 919_500,
    saleMode: "cart",
    categoryLabel: "Un caballo",
    ...surcharge,
  };
}

test("un produit sans image propre reste signalé même si la catégorie a un visuel", () => {
  const report = buildCatalogIntegrityReport([
    produit({
      id: "prod-sans-image",
      image: null,
      categoryLabel: "Dos caballos",
    }),
  ]);

  assert.deepEqual(report.withoutOwnPhoto.map((item) => item.id), ["prod-sans-image"]);
});

test("une illustration locale est distinguée d'une vraie photo produit", () => {
  assert.equal(isCatalogIllustration("/images/remolques/bk-master.svg"), true);
  assert.equal(hasOwnCatalogPhoto("/images/remolques/bk-master.svg"), false);
  assert.equal(hasOwnCatalogPhoto("/images/productos/bk-master-1.jpg"), true);
  assert.equal(hasOwnCatalogPhoto("https://res.cloudinary.com/demo/image/upload/photo.jpg"), true);
});

test("un produit sans prix validé remonte dans le rapport d'intégrité", () => {
  const report = buildCatalogIntegrityReport([
    produit({
      id: "prod-sans-prix",
      priceCents: 0,
      saleMode: "quote",
    }),
  ]);

  assert.deepEqual(report.withoutValidatedPrice.map((item) => item.id), ["prod-sans-prix"]);
});

test("un produit avec photo et prix validés n'est pas signalé", () => {
  const report = buildCatalogIntegrityReport([produit()]);

  assert.deepEqual(report.withoutOwnPhoto, []);
  assert.deepEqual(report.withoutValidatedPrice, []);
  assert.deepEqual(report.withIllustration, []);
});
