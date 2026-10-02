import { test } from "node:test";
import assert from "node:assert/strict";
import { planCatalogCleanup } from "./catalogCleanup";

const categories = [
  { id: "c-n1", group: "nuevos", slug: "un-caballo" },
  { id: "c-n2", group: "nuevos", slug: "dos-caballos" },
  { id: "c-o1", group: "ocasion", slug: "un-caballo" },
  { id: "c-o2", group: "ocasion", slug: "dos-caballos" },
];
const p = (slug: string, categoryId: string, condition: string, active = true) => ({ slug, categoryId, condition, active });

test("les annonces listées sont désactivées, une seule fois", () => {
  const plan = planCatalogCleanup(
    [p("fiat", "c-n2", "used"), p("deja-off", "c-n2", "used", false), p("bon", "c-o2", "used")],
    categories,
    ["fiat", "deja-off", "introuvable"],
  );
  assert.deepEqual(plan.deactivate, ["fiat"]);
  assert.deepEqual(plan.missing, ["introuvable"]);
});

test("une occasion rangée en neuf rejoint le même gabarit en occasion, et inversement", () => {
  const plan = planCatalogCleanup(
    [p("occ-en-neuf", "c-n1", "used"), p("neuf-en-occ", "c-o2", "new"), p("bien-range", "c-n2", "new")],
    categories,
    [],
  );
  assert.deepEqual(plan.moves, [
    { slug: "occ-en-neuf", from: "nuevos/un-caballo", to: "ocasion/un-caballo", toId: "c-o1" },
    { slug: "neuf-en-occ", from: "ocasion/dos-caballos", to: "nuevos/dos-caballos", toId: "c-n2" },
  ]);
});

test("une annonce désactivée ou inactive n'est pas déplacée ; un gabarit sans équivalent est signalé", () => {
  const plan = planCatalogCleanup(
    [p("retiree", "c-n1", "used"), p("inactive", "c-n1", "used", false), p("sans-cible", "c-n3", "used")],
    [...categories, { id: "c-n3", group: "nuevos", slug: "tres-cuatro-caballos" }],
    ["retiree"],
  );
  assert.deepEqual(plan.moves, []);
  assert.deepEqual(plan.unmovable, ["sans-cible"]);
});
