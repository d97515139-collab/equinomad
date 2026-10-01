import assert from "node:assert/strict";
import test from "node:test";

import {
  buildOccasionSlug,
  findOccasionModel,
  isSecondHandCondition,
  parseEquirodiCard,
  parseEuroAmount,
  parseTruckScoutCard,
} from "./ocasionSources";

test("parseEuroAmount lit les montants espagnols", () => {
  assert.equal(parseEuroAmount("16 875 €"), 16875);
  assert.equal(parseEuroAmount("8.394 €"), 8394);
  assert.equal(parseEuroAmount("9.989 € bruto"), 9989);
});

test("findOccasionModel reconnaît les modèles usuels des annonces", () => {
  assert.deepEqual(
    findOccasionModel("Cheval Liberté", "Van caballos cheval liberté gold origins one alu 1,5 caballos"),
    { modelKey: "cl-gold-one-origins", displayName: "Gold One Origins" },
  );
  assert.deepEqual(
    findOccasionModel("Cheval Liberté", "Cheval Liberté Maxi 4 4 caballos 2022 de segunda mano"),
    { modelKey: "cl-maxi-4", displayName: "Maxi 4" },
  );
  assert.deepEqual(
    findOccasionModel("Böckmann", "Böckmann Champion C ohne Sattelkammer Hecktürkombination"),
    { modelKey: "bk-champion-c", displayName: "Champion C" },
  );
  assert.deepEqual(findOccasionModel("Ifor Williams", "Ifor Williams HB506"), {
    modelKey: "iw-hb506",
    displayName: "HB506",
  });
});

test("isSecondHandCondition filtre le neuf et garde l'occasion", () => {
  assert.equal(isSecondHandCondition("De segunda mano"), true);
  assert.equal(isSecondHandCondition("usado"), true);
  assert.equal(isSecondHandCondition("como nuevo (artículo de exposición)"), true);
  assert.equal(isSecondHandCondition("nuevo"), false);
});

test("parseEquirodiCard extrait les champs d'une carte", () => {
  const block = `
    <article class='myadlist  ' data-adlisting='1013349' id='tab_1013349'>
      <div class='col-md-15 gallery'>
        <img class="thumb lazyload" id="theph_1013349" src="https://dux0knkimndc1.cloudfront.net/images/annonces/new/1013349_1784896463_4913.jpg" />
      </div>
      <div class='col-md-15 infos'>
        <a class='display_search' title='Van caballos cheval liberté cheval liberte maxi 4  4 caballos 2022 de segunda mano' data-bb='1' href=//www.equirodi.es/anuncios/van/ref-1013349.htm>
          <h2>Van caballos cheval liberté cheval liberte maxi 4  4 caballos 2022 de segunda mano</h2>
        </a>
        <div class='price' style='margin:0 0 8px;text-align:left;font-weight:600'>16 875 €</div>
        <ul class='content'>
          <li> Van en venta</li><li> Cheval Liberté</li><li>2022</li><li> De segunda mano</li><li> 4 Caballos</li>
        </ul>
      </div>
      <div class='col-md-6 listing_r'>
        <div class='location'> Croacia</div>
        <div class='location'></div>
        <div class='type-annonce'> Profesional</div>
      </div>
    </article>
  `;

  assert.deepEqual(parseEquirodiCard(block), {
    id: "1013349",
    source: "equirodi",
    sourceRef: "https://www.equirodi.es/anuncios/van/ref-1013349.htm",
    title: "Van caballos cheval liberté cheval liberte maxi 4 4 caballos 2022 de segunda mano",
    brand: "Cheval Liberté",
    priceEuros: 16875,
    year: 2022,
    condition: "De segunda mano",
    countryEs: "Croacia",
    sellerType: "Profesional",
    imageUrls: ["https://dux0knkimndc1.cloudfront.net/images/annonces/new/1013349_1784896463_4913.jpg"],
  });
});

test("parseTruckScoutCard extrait une carte TruckScout24", () => {
  const block = `
    <section id="section-22519872-0" data-listing-id="22519872" class="shadow-sm grid-card grid-card-border">
      <section class="grid-image">
        <a class="d-flex justify-content-center" target="_self" href="/tsp/ts-225-19-872" aria-label="Remolque para caballos Böckmann Champion C ohne Sattelkammer Hecktürkombination 2400kg 100km/H Neu">
          <img loading="lazy" src="https://cdn.truckscout24.com/data/listing/img/vga/ts/65/76/22519872-01.jpg?v=1786180409" />
        </a>
        <img loading="lazy" src="" data-src="https://cdn.truckscout24.com/data/listing/img/vga/ts/65/76/22519872-02.jpg?v=1786180409" />
      </section>
      <section class="grid-body">
        <div class="trader-location border-md-top pt-0 pt-md-3 fs-8" data-grid="location">
          <div class="country-name">
            <img class="flag24 flag24-de" title="Alemania" alt="Alemania">
            Grevenbroich
          </div>
        </div>
        <a class="d-flex flex-column text-decoration-none mb-2" data-grid="title" href="/tsp/ts-225-19-872" target="_self">
          <h2 class="h5 m-0 text-dark fw-bold break-word"><span class="text-gray-100 fs-6 fw-normal">Remolque para caballos</span><br><span class="me-1">Böckmann</span><span>Champion C ohne Sattelkammer Hecktürkombination 2400kg 100km/H Neu</span></h2>
        </a>
        <div class="price" data-grid="price">
          <div class="d-flex align-items-end justify-content-end gap-2"><div class="text-dark h4 m-0 fw-bold"><span>8.394 €</span></div></div>
        </div>
        <div class="collapse long-description-22519872-0 description-preview show fs-7">
          Estado: <b>como nuevo (artículo de exposición)</b>, peso total: <b>2.400 kg</b>, Año de fabricación: <b>2025</b>
        </div>
        <div class="collapse long-description-22519872-0 description-content"></div>
      </section>
    </section>
  `;

  assert.deepEqual(parseTruckScoutCard(block), {
    id: "22519872",
    source: "truckscout24",
    sourceRef: "https://www.truckscout24.es/tsp/ts-225-19-872",
    title: "Böckmann Champion C ohne Sattelkammer Hecktürkombination 2400kg 100km/H Neu",
    brand: "Böckmann",
    priceEuros: 8394,
    year: 2025,
    condition: "como nuevo (artículo de exposición)",
    countryEs: "Alemania",
    sellerType: "Profesional",
    imageUrls: [
      "https://cdn.truckscout24.com/data/listing/img/vga/ts/65/76/22519872-01.jpg?v=1786180409",
      "https://cdn.truckscout24.com/data/listing/img/vga/ts/65/76/22519872-02.jpg?v=1786180409",
    ],
  });
});

test("buildOccasionSlug garde une base lisible et stable", () => {
  assert.equal(
    buildOccasionSlug("eq", "1013349", "Cheval Liberté", "Maxi 4 2022"),
    "oc-eq-cheval-liberte-maxi-4-2022-1013349",
  );
});
