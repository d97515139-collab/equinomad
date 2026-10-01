import test from "node:test";
import assert from "node:assert/strict";
import { productSectionsForLocale } from "@/lib/productText";
import type { ProductSectionView } from "@/types/home";

const sections: ProductSectionView[] = [
  {
    heading: "Uso previsto",
    body: "Texto en espanol.",
    headingEn: "Intended use",
    bodyEn: "English copy.",
  },
];

test("productSectionsForLocale garde les sections espagnoles en es", () => {
  assert.deepEqual(productSectionsForLocale(sections, "es"), [
    { heading: "Uso previsto", body: "Texto en espanol." },
  ]);
});

test("productSectionsForLocale bascule sur les sections anglaises en en", () => {
  assert.deepEqual(productSectionsForLocale(sections, "en"), [
    { heading: "Intended use", body: "English copy." },
  ]);
});

test("productSectionsForLocale masque les sections non traduites en fr", () => {
  assert.deepEqual(productSectionsForLocale(sections, "fr"), []);
});
