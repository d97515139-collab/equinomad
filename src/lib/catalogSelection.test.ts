import { test } from "node:test";
import assert from "node:assert/strict";
import type { Product } from "@/types/home";
import { PRICE_RANGES, inPriceRange, priceRangeById, selectProducts, selectionHref } from "./catalogSelection";

function produit(id: string, price: string): Product {
  return { id, price, name: id, brand: "", image: "", href: `/x/${id}`, bullets: [] } as unknown as Product;
}

const pages = [
  { group: "nuevos", slug: "dos-caballos", products: [produit("n2-9000", "9.000,00 €"), produit("n2-0", "0,00 €"), produit("n2-4500", "4.500,00 €")] },
  { group: "ocasion", slug: "dos-caballos", products: [produit("o2-6000", "6.000,00 €"), produit("o2-8000", "8.000,00 €")] },
  { group: "nuevos", slug: "un-caballo", products: [produit("n1-7000", "7.000,00 €")] },
  { group: "accesorios", slug: "recambios", products: [produit("acc-34", "34,00 €")] },
];

test("les tranches couvrent les prix des remorques, sans trou ni chevauchement", () => {
  assert.deepEqual(PRICE_RANGES.map((r) => r.id), ["hasta5000", "de5000a8000", "de8000a12000", "de12000a20000", "mas20000"]);
  for (const prix of [1, 4999, 5000, 7999.99, 8000, 12000, 19999, 20000, 35000]) {
    assert.equal(PRICE_RANGES.filter((r) => inPriceRange(prix, r)).length, 1, String(prix));
  }
});

test("un produit sans prix réel n'entre dans aucun budget", () => {
  assert.equal(inPriceRange(0, PRICE_RANGES[0]), false);
});

test("un identifiant de tranche inconnu est ignoré", () => {
  assert.equal(priceRangeById("hasta500"), undefined);
  assert.equal(priceRangeById("de8000a12000")?.min, 8000);
});

test("la sélection mêle neuf et occasion, filtre places et budget, du moins cher au plus cher", () => {
  assert.deepEqual(selectProducts(pages, { plazas: "dos-caballos", precio: "de5000a8000" }).map((p) => p.id), ["o2-6000"]);
  assert.deepEqual(selectProducts(pages, { plazas: "dos-caballos" }).map((p) => p.id), ["n2-4500", "o2-6000", "o2-8000", "n2-9000", "n2-0"]);
  assert.deepEqual(selectProducts(pages, { precio: "hasta5000" }).map((p) => p.id), ["n2-4500"]);
  assert.deepEqual(selectProducts(pages, { precio: "de5000a8000" }).map((p) => p.id), ["o2-6000", "n1-7000"]);
});

test("l'adresse de la sélection porte les critères choisis", () => {
  assert.equal(selectionHref({ plazas: "dos-caballos", precio: "de8000a12000" }), "/recherche?plazas=dos-caballos&precio=de8000a12000");
  assert.equal(selectionHref({ precio: "hasta5000" }), "/recherche?precio=hasta5000");
  assert.equal(selectionHref({ plazas: "un-caballo" }), "/recherche?plazas=un-caballo");
});
