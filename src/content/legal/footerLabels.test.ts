import { test } from "node:test";
import assert from "node:assert/strict";
import { LEGAL_SLUGS, localizeFooterGroups } from "./index";
import type { LegalFooterGroup } from "./types";

const anglais: readonly LegalFooterGroup[] = [
  { id: "service", title: "Service", links: [{ slug: "livraison", label: "Shipping and deliveries", href: "/en/livraison" }] },
  { id: "legal", title: "Legal", links: [{ slug: "cgv", label: "General conditions of sale", href: "/en/cgv" }] },
  { id: "company", title: "Company", links: [{ slug: "a-propos", label: "Who we are", href: "/en/a-propos" }] },
];

test("le pied de page français, allemand et italien est traduit, liens inchangés", () => {
  const fr = localizeFooterGroups(anglais, "fr");
  assert.deepEqual(fr.map((g) => g.title), ["Service", "Informations légales", "Entreprise"]);
  assert.equal(fr[1].links[0].label, "Conditions générales de vente");
  assert.equal(fr[1].links[0].href, "/en/cgv");
  assert.equal(localizeFooterGroups(anglais, "de")[2].links[0].label, "Über uns");
  assert.equal(localizeFooterGroups(anglais, "it")[0].links[0].label, "Spedizioni e consegne");
});

test("espagnol et anglais gardent les titres des pages, modifiables depuis le back-office", () => {
  assert.equal(localizeFooterGroups(anglais, "en"), anglais);
  assert.equal(localizeFooterGroups(anglais, "es"), anglais);
});

test("chaque page légale a un libellé dans les trois langues", () => {
  for (const locale of ["fr", "de", "it"]) {
    const groupes: LegalFooterGroup[] = [
      { id: "legal", title: "x", links: LEGAL_SLUGS.map((slug) => ({ slug, label: "", href: "" })) },
    ];
    for (const lien of localizeFooterGroups(groupes, locale)[0].links) assert.ok(lien.label.length > 0, `${locale}/${lien.slug}`);
  }
});
