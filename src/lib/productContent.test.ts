// src/lib/productContent.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import * as productContentLib from "./productContent";
import { validateProductContent, type ProductContent } from "./productContent";

function entree(surcharge: Partial<ProductContent> = {}): ProductContent {
  return {
    slug: "hetre-pret-a-bruler-25-cm",
    description: "a".repeat(1200),
    shortDescription: "Bûches de hêtre fendues à 25 cm, séchées sous 18 % d'humidité.",
    descriptionEn: "b".repeat(1200),
    shortDescriptionEn: "Beech logs split to 25 cm, kiln dried below 18 % moisture.",
    ...surcharge,
  };
}

function champLocale(entry: object, key: string): string[] | string | undefined {
  const value = Reflect.get(entry, key);
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(String);
  return undefined;
}

test("une entrée conforme ne remonte aucune anomalie", () => {
  assert.deepEqual(validateProductContent([entree()]), []);
});

test("une description hors de la fourchette 1100-3800 est signalée", () => {
  assert.ok(validateProductContent([entree({ description: "a".repeat(120) })])[0].includes("1100"));
  assert.ok(validateProductContent([entree({ description: "a".repeat(4200) })])[0].includes("3800"));
});

test("une description identique à la description courte est signalée", () => {
  const texte = "a".repeat(1200);
  const anomalies = validateProductContent([entree({ description: texte, shortDescription: texte })]);
  assert.ok(anomalies.some((a) => a.includes("identique")), anomalies.join(" | "));
});

test("le vocabulaire promotionnel est signalé", () => {
  const anomalies = validateProductContent([
    entree({ description: `Livraison offerte sur ce produit. ${"a".repeat(1200)}` }),
  ]);
  assert.ok(anomalies.some((a) => a.includes("promotionnel")), anomalies.join(" | "));
});

test("le HTML est signalé", () => {
  const anomalies = validateProductContent([entree({ description: `<b>Hêtre</b> ${"a".repeat(1200)}` })]);
  assert.ok(anomalies.some((a) => a.includes("HTML")), anomalies.join(" | "));
});

test("un GTIN au checksum faux est signalé", () => {
  const anomalies = validateProductContent([entree({ gtin: "4006381333930" })]);
  assert.ok(anomalies.some((a) => a.includes("GTIN")), anomalies.join(" | "));
});

test("un GTIN valide passe", () => {
  assert.deepEqual(validateProductContent([entree({ gtin: "4006381333931" })]), []);
});

test("un slug en double est signalé", () => {
  const anomalies = validateProductContent([entree(), entree()]);
  assert.ok(anomalies.some((a) => a.includes("double")), anomalies.join(" | "));
});

test("une shortDescription vide est signalée", () => {
  const anomalies = validateProductContent([entree({ shortDescription: "   " })]);
  assert.ok(anomalies.some((a) => a.includes("shortDescription") && a.includes("vide")), anomalies.join(" | "));
});

test("le vocabulaire promotionnel dans shortDescription est signalé", () => {
  const anomalies = validateProductContent([
    entree({ shortDescription: "Livraison offerte, profitez-en !" }),
  ]);
  assert.ok(anomalies.some((a) => a.includes("shortDescription") && a.includes("promotionnel")), anomalies.join(" | "));
});

test("le HTML dans shortDescriptionEn est signalé", () => {
  const anomalies = validateProductContent([
    entree({ shortDescriptionEn: "<b>Beech</b> logs split to 25 cm." }),
  ]);
  assert.ok(anomalies.some((a) => a.includes("shortDescriptionEn") && a.includes("HTML")), anomalies.join(" | "));
});

test("shortDescription hors fourchette 400-800 n'est pas signalée pour sa longueur", () => {
  // Les champs courts visent ~140 caractères : la fourchette 400-800 ne doit
  // pas s'y appliquer.
  const anomalies = validateProductContent([entree({ shortDescription: "Bûches de hêtre." })]);
  assert.ok(!anomalies.some((a) => a.includes("shortDescription") && a.includes("caractères")), anomalies.join(" | "));
});

test("le vocabulaire promotionnel anglais est signalé dans descriptionEn", () => {
  const anomalies = validateProductContent([
    entree({ descriptionEn: `Free shipping on this order. ${"b".repeat(1200)}` }),
  ]);
  assert.ok(anomalies.some((a) => a.includes("descriptionEn") && a.includes("promotionnel")), anomalies.join(" | "));
});

test("« sale » n'est pas détecté comme sous-chaîne de mots anglais légitimes", () => {
  const anomalies = validateProductContent([
    entree({ descriptionEn: `Wholesale pricing available for resale partners. ${"b".repeat(1200)}` }),
  ]);
  assert.ok(!anomalies.some((a) => a.includes("promotionnel")), anomalies.join(" | "));
});

test("un mot allemand en minuscules est détecté (insensible à la casse)", () => {
  const anomalies = validateProductContent([
    entree({ description: `Ce produit a une bonne ausstattung. ${"a".repeat(1200)}` }),
  ]);
  assert.ok(anomalies.some((a) => a.includes("allemand")), anomalies.join(" | "));
});

test("un GTIN en double entre deux entrées est signalé", () => {
  const anomalies = validateProductContent([
    entree({ slug: "produit-un", gtin: "4006381333931" }),
    entree({ slug: "produit-deux", gtin: "4006381333931" }),
  ]);
  assert.ok(anomalies.some((a) => a.includes("GTIN") && a.includes("double")), anomalies.join(" | "));
});

test("un MPN en double entre deux entrées est signalé", () => {
  const anomalies = validateProductContent([
    entree({ slug: "produit-un", mpn: "REF-123" }),
    entree({ slug: "produit-deux", mpn: "REF-123" }),
  ]);
  assert.ok(anomalies.some((a) => a.includes("MPN") && a.includes("double")), anomalies.join(" | "));
});

// --- Caractéristiques (bullets) ---
//
// Le commerçant a relevé deux défauts sur des fiches en ligne : des
// caractéristiques absentes, et une phrase de description recopiée en guise de
// caractéristique. Les tests ci-dessous verrouillent les deux.

test("des caractéristiques conformes ne remontent aucune anomalie", () => {
  const anomalies = validateProductContent([
    entree({
      bullets: ["Humidité sous 18 %", "Longueur 25 cm", "Livré sur palette filmée"],
      bulletsEn: ["Moisture below 18%", "25 cm length", "Delivered on a wrapped pallet"],
    }),
  ]);
  assert.deepEqual(anomalies, []);
});

test("une caractéristique trop longue est signalée", () => {
  const phrase = "Sciures locales comprimées sans additif chimique. ".repeat(3);
  const anomalies = validateProductContent([
    entree({ bullets: [phrase, "Court", "Court aussi"], bulletsEn: ["a", "b", "c"] }),
  ]);
  assert.ok(anomalies.some((a) => a.includes("maximum 120")), anomalies.join(" | "));
});

test("une ligne « intitulé : valeur » d'une centaine de caractères reste acceptée", () => {
  // Le format tabulaire des fiches consomme une vingtaine de caractères en
  // intitulé avant la valeur utile : l'ancienne borne de 90 le refusait.
  const ligne = "Appareils compatibles : inserts, poêles à bûches et foyers fermés à grande chambre de combustion";
  const anomalies = validateProductContent([
    entree({ bullets: [ligne, "Court", "Court aussi"], bulletsEn: ["a", "b", "c"] }),
  ]);
  assert.deepEqual(anomalies, []);
});

test("une liste de caractéristiques trop longue est signalée", () => {
  const liste = Array.from({ length: 17 }, (_, i) => `Ligne ${i}`);
  const anomalies = validateProductContent([entree({ bullets: liste, bulletsEn: liste })]);
  assert.ok(anomalies.some((a) => a.includes("et 16")), anomalies.join(" | "));
});

test("une liste de caractéristiques trop courte est signalée", () => {
  const anomalies = validateProductContent([
    entree({ bullets: ["Seule"], bulletsEn: ["Alone"] }),
  ]);
  assert.ok(anomalies.some((a) => a.includes("attendu entre 3")), anomalies.join(" | "));
});

test("des caractéristiques renseignées dans une seule langue sont signalées", () => {
  const anomalies = validateProductContent([
    entree({ bullets: ["Une", "Deux", "Trois"] }),
  ]);
  assert.ok(anomalies.some((a) => a.includes("bulletsEn est absent")), anomalies.join(" | "));
});

test("un décompte différent entre les deux langues est signalé", () => {
  const anomalies = validateProductContent([
    entree({ bullets: ["Une", "Deux", "Trois"], bulletsEn: ["One", "Two", "Three", "Four"] }),
  ]);
  assert.ok(anomalies.some((a) => a.includes("même nombre")), anomalies.join(" | "));
});

test("une caractéristique vide est signalée", () => {
  const anomalies = validateProductContent([
    entree({ bullets: ["Une", "   ", "Trois"], bulletsEn: ["One", "Two", "Three"] }),
  ]);
  assert.ok(anomalies.some((a) => a.includes("entrée vide")), anomalies.join(" | "));
});

test("le vocabulaire promotionnel est refusé aussi dans les caractéristiques", () => {
  const anomalies = validateProductContent([
    entree({ bullets: ["Livraison offerte", "Deux", "Trois"], bulletsEn: ["One", "Two", "Three"] }),
  ]);
  assert.ok(anomalies.some((a) => a.includes("promotionnel")), anomalies.join(" | "));
});

test("buildOccasionCopy réécrit une fiche d'occasion sans fuite vers la source externe", () => {
  assert.equal(typeof productContentLib.buildOccasionCopy, "function");

  const entry = productContentLib.buildOccasionCopy({
    slug: "oc-ma-562496955",
    name: "Remolque de caballos. Van",
    brand: "Sin marca",
    categorySlug: "dos-caballos",
    categoryLabel: "Remolques de dos caballos de ocasión",
    categoryLabelEn: "Used two-horse trailers",
    description:
      "Se vende van de dos caballos con matrícula roja. Se encuentra en perfecto estado con luz interior, instalación de cámara, luces Led, guadarnes para dos monturas en la parte delantera e ITV al día. Tlf 637538110. www.origen-demo.es",
    bullets: ["Capacidad 2 caballos", "Matrícula roja", "ITV al día", "Ubicación Toledo"],
    province: "Toledo",
  });

  assert.equal(entry.slug, "oc-ma-562496955");
  assert.match(entry.shortDescription, /Equinomad/);
  assert.match(entry.description, /Equinomad/);
  assert.match(entry.description, /matrícula roja/i);
  assert.match(entry.description, /luz interior/i);
  assert.doesNotMatch(entry.shortDescription, /www\.|https?:\/\/|Tlf|637538110|Milanuncios/i);
  assert.doesNotMatch(entry.description, /www\.|https?:\/\/|Tlf|637538110|Milanuncios/i);
  assert.match(entry.shortDescriptionEn, /Equinomad/);
  assert.match(entry.descriptionEn, /Equinomad/);
  assert.match(entry.descriptionEn, /interior light|camera/i);
  assert.ok(entry.bullets?.some((bullet) => /Matrícula: Roja/i.test(bullet)));
  assert.ok(entry.bulletsEn?.some((bullet) => /Registration: Red plate/i.test(bullet)));
  assert.deepEqual(validateProductContent([entry]), []);
});

test("buildOccasionCopy produit une fiche propre même quand les données d'origine sont pauvres", () => {
  assert.equal(typeof productContentLib.buildOccasionCopy, "function");

  const entry = productContentLib.buildOccasionCopy({
    slug: "oc-ma-560341041",
    name: "Van de carro",
    brand: "Sin marca",
    categorySlug: "dos-caballos",
    categoryLabel: "Remolques de dos caballos de ocasión",
    categoryLabelEn: "Used two-horse trailers",
    description: "Dos matrículas al día de ITV y sello dos caballos tara 1660 Max",
    bullets: ["Capacidad 2 caballos", "ITV al día", "Ubicación Cádiz"],
    province: "Cádiz",
  });

  assert.doesNotMatch(entry.shortDescription, /\bSin marca\b/i);
  assert.doesNotMatch(entry.description, /\bSin marca\b/i);
  assert.match(entry.description, /dos caballos/i);
  assert.match(entry.description, /ITV/i);
  assert.match(entry.descriptionEn, /two-horse/i);
  assert.ok(entry.bullets?.some((bullet) => /Zona: Cádiz/i.test(bullet)));
  assert.ok(entry.bulletsEn?.some((bullet) => /Area: Cádiz/i.test(bullet)));
  assert.deepEqual(validateProductContent([entry]), []);
});

test("buildOccasionCopy génère aussi les versions fr, de et it", () => {
  assert.equal(typeof productContentLib.buildOccasionCopy, "function");

  const entry = productContentLib.buildOccasionCopy({
    slug: "oc-ma-562496955",
    name: "Remolque de caballos. Van",
    brand: "Sin marca",
    categorySlug: "dos-caballos",
    categoryLabel: "Remolques de dos caballos de ocasión",
    categoryLabelEn: "Used two-horse trailers",
    description:
      "Se vende van de dos caballos con matrícula roja. Se encuentra en perfecto estado con luz interior, instalación de cámara, luces Led, guadarnes para dos monturas en la parte delantera e ITV al día. Tlf 637538110. www.origen-demo.es",
    bullets: ["Capacidad 2 caballos", "Matrícula roja", "ITV al día", "Ubicación Toledo"],
    province: "Toledo",
  });

  const shortFr = champLocale(entry, "shortDescriptionFr");
  const longFr = champLocale(entry, "descriptionFr");
  const bulletsFr = champLocale(entry, "bulletsFr");
  const shortDe = champLocale(entry, "shortDescriptionDe");
  const longDe = champLocale(entry, "descriptionDe");
  const bulletsDe = champLocale(entry, "bulletsDe");
  const shortIt = champLocale(entry, "shortDescriptionIt");
  const longIt = champLocale(entry, "descriptionIt");
  const bulletsIt = champLocale(entry, "bulletsIt");

  assert.equal(typeof shortFr, "string");
  assert.equal(typeof longFr, "string");
  assert.ok(Array.isArray(bulletsFr));
  assert.match(shortFr as string, /Equinomad/);
  assert.match(longFr as string, /Equinomad/);
  assert.ok((bulletsFr as string[]).some((bullet) => /Immatriculation : Plaque rouge/i.test(bullet)));

  assert.equal(typeof shortDe, "string");
  assert.equal(typeof longDe, "string");
  assert.ok(Array.isArray(bulletsDe));
  assert.match(shortDe as string, /Equinomad/);
  assert.match(longDe as string, /Equinomad/);
  assert.ok((bulletsDe as string[]).some((bullet) => /Zulassung: Rotes Kennzeichen/i.test(bullet)));

  assert.equal(typeof shortIt, "string");
  assert.equal(typeof longIt, "string");
  assert.ok(Array.isArray(bulletsIt));
  assert.match(shortIt as string, /Equinomad/);
  assert.match(longIt as string, /Equinomad/);
  assert.ok((bulletsIt as string[]).some((bullet) => /Immatricolazione: Targa rossa/i.test(bullet)));
});

test("buildNewProductCopy génère une fiche neuve multilingue propre", () => {
  assert.equal(typeof Reflect.get(productContentLib, "buildNewProductCopy"), "function");

  const entry = Reflect.get(productContentLib, "buildNewProductCopy")({
    slug: "bk-uno-esprit",
    name: "Uno Esprit",
    brand: "Böckmann",
    categorySlug: "un-caballo",
    categoryLabel: "Remolques para un caballo",
    categoryLabelEn: "Single-horse trailers",
    shortDescription:
      "Van de un caballo con carrocería de aluminio y 896 kg de carga útil. Con 1.600 kg de MMA, entra en el permiso B con la mayoría de los turismos.",
    description:
      "Uso previsto\nUn van de una plaza para quien se desplaza con un solo caballo y no quiere cambiar de coche ni de permiso. Los 896 kg de carga útil cubren un caballo adulto de talla media con su silla y su equipo, con margen para el agua de la jornada.",
    bullets: [
      "Un caballo, o una yegua con su potro",
      "MMA 1.600 kg, tara 704 kg, carga útil 896 kg",
      "Interior de 3,10 × 1,30 × 2,30 m",
      "Suelo integral de aluminio",
      "Permiso B con vehículo de hasta 1.900 kg de MMA",
    ],
  }) as ProductContent;

  assert.match(entry.shortDescription, /Equinomad/);
  assert.match(entry.description, /Uno Esprit/);
  assert.match(entry.description, /896 kg/);
  assert.match(entry.descriptionEn, /Equinomad/);
  assert.match(entry.descriptionEn, /single-horse|payload/i);
  assert.match(entry.shortDescriptionFr ?? "", /Equinomad/);
  assert.match(entry.descriptionFr ?? "", /896 kg/);
  assert.match(entry.shortDescriptionDe ?? "", /Equinomad/);
  assert.match(entry.shortDescriptionDe ?? "", /Vollaluminiumboden/);
  assert.match(entry.shortDescriptionIt ?? "", /Equinomad/);
  assert.ok(entry.bulletsFr?.some((bullet) => /PTAC : 1\.600 kg/i.test(bullet)));
  assert.ok(entry.bulletsDe?.some((bullet) => /zGG: 1\.600 kg/i.test(bullet)));
  assert.ok(entry.bulletsIt?.some((bullet) => /MMA: 1\.600 kg/i.test(bullet)));
  assert.deepEqual(validateProductContent([entry]), []);
});

test("buildOccasionCopy sans marque ne produit ni marque vide ni ancien nom", () => {
  const entry = productContentLib.buildOccasionCopy({
    slug: "oc-sin-marca",
    name: "Van de ocasión para dos caballos",
    brand: "",
    categorySlug: "dos-caballos",
    categoryLabel: "Remolques de dos caballos de ocasión",
    categoryLabelEn: "Used two-horse trailers",
    description: "Van de dos caballos con matrícula roja, luz interior e ITV al día.",
    bullets: ["Capacidad 2 caballos", "Matrícula roja"],
  });
  const tout = JSON.stringify(entry);
  assert.doesNotMatch(tout, /Remolque\s+Caballos/i);
  assert.doesNotMatch(tout, /de marca\s*[,.]|by\s*[,.]|von\s*[,.]/);
  assert.match(entry.shortDescription, /Equinomad/);
});
