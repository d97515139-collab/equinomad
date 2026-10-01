import type { EspecificacionesRemolque } from "../../../src/server/productSpecs";
import type { FichaRemolque, SeccionFicha } from "./tipos";

/**
 * Véhicules d'occasion relevés sur ehorses.es en août 2026.
 *
 * CE QUE CES FICHES SONT, ET CE QU'ELLES NE SONT PAS. Chaque entrée correspond
 * à une annonce réelle : marque, modèle, prix et pays du vendeur sont ceux de
 * l'annonce. Les caractéristiques techniques, elles, sont celles du modèle de
 * série — un Böckmann Champion R d'occasion a les cotes d'un Champion R. C'est
 * exact tant que le véhicule n'a pas été modifié, ce qui se vérifie sur sa carte
 * grise avant la vente.
 *
 * Aucune photographie n'est reprise : elles appartiennent aux vendeurs qui ont
 * publié les annonces, et l'autorisation du fournisseur ne couvre pas celle
 * d'un particulier allemand. Ces fiches attendent les photos du véhicule réel.
 *
 * SEULS LES MODÈLES CONNUS FIGURENT ICI. Une quinzaine d'annonces ont été
 * écartées — Fautras Promax 3, Humbaur Pegasus, Ifor Williams HBX 506 et
 * quelques autres — parce que leurs caractéristiques ne sont publiées nulle
 * part de fiable. Une fiche d'occasion sans masse ni dimension ne dit pas à
 * l'acheteur s'il peut la tracter, ce qui est la seule question qui compte.
 *
 * Le prix est celui de l'annonce ; la marge du pipeline s'y ajoute comme
 * partout ailleurs.
 */

/** Caractéristiques des modèles de série, reprises pour leurs occasions. */
export const MODELOS: Readonly<Record<string, EspecificacionesRemolque>> = {
  "bk-champion-esprit": {
    plazas: 2, mmaKg: 2400, taraKg: 835, cargaUtilKg: 1565,
    largoInteriorCm: 310, anchoInteriorCm: 165, altoInteriorCm: 230,
    suelo: "Aluminio integral",
  },
  "bk-champion-c": {
    plazas: 2, mmaKg: 2400, taraKg: 936, cargaUtilKg: 1464,
    largoInteriorCm: 310, anchoInteriorCm: 165, altoInteriorCm: 232,
    suelo: "Goma con listones antideslizantes",
  },
  "bk-champion-r": {
    plazas: 2, mmaKg: 2400, taraKg: 940, cargaUtilKg: 1460,
    largoInteriorCm: 333, anchoInteriorCm: 165, altoInteriorCm: 232,
    suelo: "Aluminio integral",
  },
  "bk-comfort": {
    plazas: 2, mmaKg: 2400, taraKg: 978, cargaUtilKg: 1422,
    largoInteriorCm: 335, anchoInteriorCm: 165, altoInteriorCm: 232,
    suelo: "Aluminio integral con goma pegada y sellada",
  },
  "bk-master": {
    plazas: 2, mmaKg: 2400, taraKg: 1084, cargaUtilKg: 1316,
    largoInteriorCm: 356, anchoInteriorCm: 165, altoInteriorCm: 235,
    suelo: "Aluminio integral",
  },
  "bk-big-master": {
    plazas: 2, mmaKg: 2400, taraKg: 1162, cargaUtilKg: 1238,
    largoInteriorCm: 390, anchoInteriorCm: 175, altoInteriorCm: 230,
    suelo: "Aluminio integral",
  },
  "bk-big-champion-e": {
    plazas: 2, mmaKg: 2400, taraKg: 1033, cargaUtilKg: 1367,
    largoInteriorCm: 356, anchoInteriorCm: 175, altoInteriorCm: 235,
    suelo: "Aluminio integral",
  },
  "bk-big-champion-ska": {
    plazas: 2, mmaKg: 2400, taraKg: 859, cargaUtilKg: 1541,
    largoInteriorCm: 356, anchoInteriorCm: 175, altoInteriorCm: 235,
    suelo: "Aluminio integral",
  },
  "bk-portax-e": {
    plazas: 2, mmaKg: 2400, taraKg: 1100, cargaUtilKg: 1300,
    largoInteriorCm: 356, anchoInteriorCm: 175, altoInteriorCm: 235,
  },
  "bk-portax-e-ska": {
    plazas: 2, mmaKg: 2400, taraKg: 1100, cargaUtilKg: 1300,
    largoInteriorCm: 356, anchoInteriorCm: 175, altoInteriorCm: 235,
  },
  "bk-portax-k": {
    plazas: 2, mmaKg: 2400, taraKg: 1135, cargaUtilKg: 1265,
    largoInteriorCm: 356, anchoInteriorCm: 175, altoInteriorCm: 235,
  },
  "bk-portax-l-ska": {
    plazas: 2, mmaKg: 2700, taraKg: 1220, cargaUtilKg: 1480,
    largoInteriorCm: 419, anchoInteriorCm: 175, altoInteriorCm: 235,
  },
  "bk-duo-esprit": {
    plazas: 2, mmaKg: 2400, taraKg: 809, cargaUtilKg: 1591,
    largoInteriorCm: 310, anchoInteriorCm: 165, altoInteriorCm: 230,
  },
  "bk-duo-r": {
    plazas: 2, mmaKg: 2400, taraKg: 891, cargaUtilKg: 1509,
    largoInteriorCm: 328, anchoInteriorCm: 165, altoInteriorCm: 230,
  },
  "cl-touring-one": {
    plazas: 1, mmaKg: 1600, taraKg: 765, cargaUtilKg: 835,
    largoInteriorCm: 334, anchoInteriorCm: 137, altoInteriorCm: 234,
    suelo: "Aluminio con goma antideslizante de 8 mm",
  },
  "cl-gold-one-origins": {
    plazas: 1, mmaKg: 1600, taraKg: 650, cargaUtilKg: 950,
    largoInteriorCm: 317, anchoInteriorCm: 133, altoInteriorCm: 234,
    suelo: "Aluminio con goma antideslizante de 8 mm",
  },
  "cl-touring-country": {
    plazas: 2, mmaKg: 2600, taraKg: 900, cargaUtilKg: 1700,
    largoInteriorCm: 331, anchoInteriorCm: 168, altoInteriorCm: 231,
    suelo: "Aluminio con goma antideslizante de 8 mm",
  },
  "cl-gold-origins": {
    plazas: 2, mmaKg: 2000, taraKg: 790, cargaUtilKg: 1210,
    largoInteriorCm: 317, anchoInteriorCm: 166, altoInteriorCm: 235,
    suelo: "Tablero finlandés de 21 mm o aluminio, con goma antideslizante de 8 mm",
  },
  "cl-gold-3": {
    plazas: 2, mmaKg: 2600, taraKg: 820, cargaUtilKg: 1780,
    largoInteriorCm: 317, anchoInteriorCm: 160, altoInteriorCm: 234,
    suelo: "Aluminio con goma antideslizante de 8 mm",
  },
  "cl-gold-marathon": {
    plazas: 2, mmaKg: 2600, taraKg: 950, cargaUtilKg: 1650,
    largoInteriorCm: 317, anchoInteriorCm: 160, altoInteriorCm: 234,
    suelo: "Aluminio con goma antideslizante de 8 mm",
  },
  "cl-touring-jumping": {
    plazas: 2, mmaKg: 2600, taraKg: 850, cargaUtilKg: 1750,
    largoInteriorCm: 331, anchoInteriorCm: 168, altoInteriorCm: 238,
    suelo: "Aluminio con goma antideslizante de 8 mm",
  },
  "cl-touring-xl": {
    plazas: 2, mmaKg: 2600, taraKg: 971, cargaUtilKg: 1629,
    largoInteriorCm: 380, anchoInteriorCm: 181, altoInteriorCm: 238,
    suelo: "Aluminio de 25 mm con goma antideslizante de 8 mm",
  },
  "cl-maxi-2": {
    plazas: 2, mmaKg: 2600, taraKg: 960, cargaUtilKg: 1640,
    largoInteriorCm: 378, anchoInteriorCm: 181, altoInteriorCm: 238,
    suelo: "Aluminio con goma antideslizante de 8 mm",
  },
  "cl-multimax": {
    plazas: 2, mmaKg: 2600, taraKg: 970, cargaUtilKg: 1630,
    largoInteriorCm: 378, anchoInteriorCm: 181, altoInteriorCm: 238,
    suelo: "Aluminio con goma antideslizante de 8 mm",
  },
  "cl-minimax": {
    plazas: 3, mmaKg: 3500, taraKg: 1395, cargaUtilKg: 2105,
    largoInteriorCm: 420, anchoInteriorCm: 202, altoInteriorCm: 235,
    suelo: "Aluminio con goma antideslizante de 8 mm",
  },
  "cl-maxi-3-living": {
    plazas: 3, mmaKg: 3500, taraKg: 1455, cargaUtilKg: 2045,
    largoInteriorCm: 490, anchoInteriorCm: 202, altoInteriorCm: 235,
    suelo: "Aluminio con goma antideslizante de 8 mm",
  },
  "cl-maxi-4": {
    plazas: 4, mmaKg: 3500, taraKg: 1550, cargaUtilKg: 1950,
    largoInteriorCm: 490, anchoInteriorCm: 220, altoInteriorCm: 235,
    suelo: "Aluminio con goma antideslizante de 8 mm",
  },
  "iw-hb506": {
    plazas: 2, mmaKg: 2600, taraKg: 920, cargaUtilKg: 1680,
    largoInteriorCm: 316, anchoInteriorCm: 167, altoInteriorCm: 226,
    suelo: "Aluminio antideslizante sobre madera tratada a presión",
  },
  "iw-hb403": {
    plazas: 1, mmaKg: 1600, taraKg: 767, cargaUtilKg: 833,
    largoInteriorCm: 308, anchoInteriorCm: 130, altoInteriorCm: 220,
  },
  "iw-hb511": {
    plazas: 2, mmaKg: 2700, taraKg: 1000, cargaUtilKg: 1700,
    largoInteriorCm: 352, anchoInteriorCm: 179, altoInteriorCm: 226,
    suelo: "Aluminio antideslizante con goma sobre madera tratada a presión",
  },
  "iw-hb610": {
    plazas: 4, mmaKg: 3500, taraKg: 1450, cargaUtilKg: 2050,
    largoInteriorCm: 425, anchoInteriorCm: 207, altoInteriorCm: 230,
    suelo: "Aluminio",
  },
  "hb-xanthos-aero-2400": {
    plazas: 2, mmaKg: 2400, taraKg: 855, cargaUtilKg: 1545,
    largoInteriorCm: 345, anchoInteriorCm: 171, altoInteriorCm: 236,
    suelo: "AluBiComp de 21 mm",
  },
  "hb-xanthos-aero-2700": {
    plazas: 2, mmaKg: 2700, taraKg: 859, cargaUtilKg: 1841,
    largoInteriorCm: 345, anchoInteriorCm: 171, altoInteriorCm: 236,
    suelo: "AluBiComp de 21 mm",
  },
  "hb-notos-xtra-pro": {
    plazas: 2, mmaKg: 2700, taraKg: 1231, cargaUtilKg: 1469,
    largoInteriorCm: 413, anchoInteriorCm: 171, altoInteriorCm: 240,
    suelo: "AluBiComp de 21 mm",
  },
  "hb-notos-xtra-up": {
    plazas: 2, mmaKg: 2700, taraKg: 1234, cargaUtilKg: 1466,
    largoInteriorCm: 413, anchoInteriorCm: 171, altoInteriorCm: 240,
    suelo: "AluBiComp de 21 mm",
  },
  "ft-oblic-x2": {
    plazas: 2, mmaKg: 2600, taraKg: 1280, cargaUtilKg: 1320,
    largoInteriorCm: 364, anchoInteriorCm: 190, altoInteriorCm: 225,
    suelo: "Polietileno imputrescible y antirruido",
  },
  "ft-oblic-x3": {
    plazas: 3, mmaKg: 3000, taraKg: 1580, cargaUtilKg: 1420,
    largoInteriorCm: 449, anchoInteriorCm: 190, altoInteriorCm: 225,
    suelo: "Polietileno imputrescible y antirruido",
  },
  "ft-provan-premium": {
    plazas: 2, mmaKg: 2000, taraKg: 920, cargaUtilKg: 1080,
    largoInteriorCm: 300, anchoInteriorCm: 163, altoInteriorCm: 225,
    suelo: "Polietileno imputrescible y antirruido",
  },
};

/** Un véhicule d'occasion, tel qu'il figure dans l'annonce. */
export type ModeloOcasion = keyof typeof MODELOS;

export interface Anuncio {
  readonly slug: string;
  readonly modelo: ModeloOcasion;
  readonly brand: string;
  readonly name: string;
  readonly precioEuros: number;
  /** Pays du vendeur, en toutes lettres. */
  readonly pais: string;
  readonly paisEn: string;
  /** Année de mise en circulation, quand l'annonce la donne. */
  readonly anio?: number;
  /** Ce que l'annonce dit de particulier sur cet exemplaire. */
  readonly detalle?: string;
  readonly detalleEn?: string;
}

/** Seuils du permis espagnol, pour la section correspondante. */
function permiso(mma: number): { es: string; en: string } {
  const conB = Math.max(0, Math.min(3500, 3500 - mma));
  const conB96 = Math.max(0, Math.min(3500, 4250 - mma));
  if (mma > 3500) {
    return {
      es: "Con más de 3.500 kg de MMA, este remolque queda fuera del permiso B+E y exige permiso C1E o CE.",
      en: "Above 3,500 kg gross, this trailer falls outside B+E and requires a C1E or CE licence.",
    };
  }
  if (conB >= 1000) {
    return {
      es: `Con ${mma} kg de MMA, el permiso B basta si el vehículo tractor no supera ${conB} kg de masa máxima autorizada, porque el conjunto no puede pasar de 3.500 kg. Con B96 el vehículo puede llegar a ${conB96} kg, y con B+E hasta 3.500 kg. La cifra que cuenta figura en el apartado F.1 de la ficha técnica de tu coche.`,
      en: `At ${mma} kg gross, a category B licence is enough provided the towing vehicle does not exceed ${conB} kg, since the combination may not pass 3,500 kg. With B96 the vehicle can reach ${conB96} kg, and with B+E up to 3,500 kg. The figure that counts is in section F.1 of your car's registration document.`,
    };
  }
  return {
    es: `Con ${mma} kg de MMA, el permiso B queda descartado en la práctica: exigiría un vehículo tractor de ${conB} kg, masa que ningún turismo actual respeta. ${conB96 >= 1000 ? `Con B96 el conjunto llega a 4.250 kg y admite un vehículo de hasta ${conB96} kg` : "El B96 tampoco basta"}; con B+E, hasta 3.500 kg de vehículo.`,
    en: `At ${mma} kg gross, a category B licence is ruled out in practice: it would need a ${conB} kg towing vehicle, a mass no current car meets. ${conB96 >= 1000 ? `With B96 the combination reaches 4,250 kg and takes a vehicle up to ${conB96} kg` : "B96 is not enough either"}; with B+E, up to 3,500 kg of vehicle.`,
  };
}

/** Construit la fiche complète d'une annonce à partir du modèle de série. */
export function fichaDe(anuncio: Anuncio): FichaRemolque {
  const specs = MODELOS[anuncio.modelo];
  const p = permiso(specs.mmaKg);
  const anio = anuncio.anio ? ` de ${anuncio.anio}` : "";
  const anioEn = anuncio.anio ? ` from ${anuncio.anio}` : "";

  const secciones: SeccionFicha[] = [
    {
      heading: "El vehículo",
      headingEn: "The vehicle",
      body: `${anuncio.brand} ${anuncio.name}${anio} de ocasión, procedente de ${anuncio.pais}. ${anuncio.detalle ?? ""} Se trata de una unidad única: cuando se vende, la ficha desaparece del catálogo. Antes de cerrar la operación te pasamos su documentación, su historial de mantenimiento y las fotografías del vehículo real, no las del modelo de serie.`.replace(/\s+/g, " "),
      bodyEn: `${anuncio.brand} ${anuncio.name}${anioEn}, second-hand, from ${anuncio.paisEn}. ${anuncio.detalleEn ?? ""} This is a single unit: once sold, the listing leaves the catalogue. Before closing we send you its documentation, its service history and photographs of the actual vehicle, not of the series model.`.replace(/\s+/g, " "),
    },
    {
      heading: "Características del modelo",
      headingEn: "Model specifications",
      body: `Las cifras del cuadro técnico son las del ${anuncio.brand} ${anuncio.name} de serie: ${specs.mmaKg} kg de MMA, ${specs.taraKg} kg de tara y ${specs.cargaUtilKg} kg de carga útil, sobre un habitáculo de ${(specs.largoInteriorCm / 100).toFixed(2)} × ${(specs.anchoInteriorCm / 100).toFixed(2)} × ${(specs.altoInteriorCm / 100).toFixed(2)} m. Siguen siendo válidas mientras el vehículo no haya sido modificado, cosa que se comprueba en su ficha técnica antes de la compra. Es el primer documento que te enviamos.`,
      bodyEn: `The figures in the technical table are those of the series ${anuncio.brand} ${anuncio.name}: ${specs.mmaKg} kg gross, ${specs.taraKg} kg unladen and ${specs.cargaUtilKg} kg payload, in a compartment of ${(specs.largoInteriorCm / 100).toFixed(2)} × ${(specs.anchoInteriorCm / 100).toFixed(2)} × ${(specs.altoInteriorCm / 100).toFixed(2)} m. They hold as long as the vehicle has not been modified, which is checked on its registration document before purchase. That is the first paper we send you.`,
    },
    {
      heading: "Permiso y vehículo tractor",
      headingEn: "Licence and towing vehicle",
      body: `${p.es} Que el remolque sea de ocasión no cambia nada: el permiso depende de las masas máximas inscritas en la ficha técnica, no de la edad del vehículo ni de su precio.`,
      bodyEn: `${p.en} A second-hand trailer changes nothing here: the licence depends on maximum masses, not on the vehicle's age.`,
    },
    {
      heading: "Compra y entrega",
      headingEn: "Purchase and delivery",
      body: `El precio mostrado incluye nuestra intervención: verificación del vehículo, gestión de la documentación y coordinación del transporte desde ${anuncio.pais} hasta tu dirección. Escríbenos y te confirmamos disponibilidad, plazo y coste de entrega antes de cualquier compromiso. Un vehículo de ocasión se reserva en el orden de llegada de las peticiones.`,
      bodyEn: `The price shown includes our work: checking the vehicle, handling the paperwork and arranging transport from ${anuncio.paisEn} to your address. Write to us and we will confirm availability, lead time and delivery cost before any commitment. A second-hand vehicle is reserved in the order requests arrive.`,
    },
  ];

  return {
    slug: anuncio.slug,
    brand: anuncio.brand,
    name: `${anuncio.name}${anio}`,
    nameEn: `${anuncio.name}${anioEn}`,
    sku: anuncio.slug.toUpperCase(),
    shortDescription: `${anuncio.brand} ${anuncio.name} de ocasión procedente de ${anuncio.pais}. MMA ${specs.mmaKg} kg, carga útil ${specs.cargaUtilKg} kg. Unidad única.`,
    shortDescriptionEn: `Second-hand ${anuncio.brand} ${anuncio.name} from ${anuncio.paisEn}. ${specs.mmaKg} kg gross, ${specs.cargaUtilKg} kg payload. Single unit.`,
    bullets: [
      `${specs.plazas === 1 ? "Un caballo" : specs.plazas === 2 ? "Dos caballos" : `${specs.plazas} caballos`}`,
      `MMA ${specs.mmaKg} kg, tara ${specs.taraKg} kg, carga útil ${specs.cargaUtilKg} kg`,
      `Interior de ${(specs.largoInteriorCm / 100).toFixed(2)} × ${(specs.anchoInteriorCm / 100).toFixed(2)} × ${(specs.altoInteriorCm / 100).toFixed(2)} m`,
      `Vehículo de ocasión, unidad única`,
      `Procedencia: ${anuncio.pais}`,
    ],
    bulletsEn: [
      `${specs.plazas === 1 ? "One horse" : specs.plazas === 2 ? "Two horses" : `${specs.plazas} horses`}`,
      `${specs.mmaKg} kg gross, ${specs.taraKg} kg unladen, ${specs.cargaUtilKg} kg payload`,
      `Inner space of ${(specs.largoInteriorCm / 100).toFixed(2)} × ${(specs.anchoInteriorCm / 100).toFixed(2)} × ${(specs.altoInteriorCm / 100).toFixed(2)} m`,
      `Second-hand vehicle, single unit`,
      `Origin: ${anuncio.paisEn}`,
    ],
    sections: secciones,
    specs,
    sourceRef: "https://www.ehorses.es/ — anuncio de ocasión, agosto de 2026",
    universo: "ocasion",
    precioEuros: anuncio.precioEuros,
  };
}

const ANUNCIOS: readonly Anuncio[] = [
  // --- Böckmann
  { slug: "oc-bk-champion-esprit-ch", modelo: "bk-champion-esprit", brand: "Böckmann", name: "Champion Esprit", precioEuros: 7500, pais: "Suiza", paisEn: "Switzerland", detalle: "Carrocería de aluminio." , detalleEn: "Aluminium body." },
  { slug: "oc-bk-champion-esprit-de", modelo: "bk-champion-esprit", brand: "Böckmann", name: "Champion Esprit", precioEuros: 8500, anio: 2024, pais: "Alemania", paisEn: "Germany", detalle: "Unidad reciente, dos años de uso.", detalleEn: "Recent unit, two years' use." },
  { slug: "oc-bk-champion-r-de-1", modelo: "bk-champion-r", brand: "Böckmann", name: "Champion R", precioEuros: 8400, pais: "Alemania", paisEn: "Germany" },
  { slug: "oc-bk-champion-r-de-2", modelo: "bk-champion-r", brand: "Böckmann", name: "Champion R", precioEuros: 7490, pais: "Alemania", paisEn: "Germany", detalle: "Carrocería de aluminio.", detalleEn: "Aluminium body." },
  { slug: "oc-bk-comfort-de-1", modelo: "bk-comfort", brand: "Böckmann", name: "Comfort", precioEuros: 6700, pais: "Alemania", paisEn: "Germany" },
  { slug: "oc-bk-comfort-de-2", modelo: "bk-comfort", brand: "Böckmann", name: "Comfort", precioEuros: 6250, pais: "Alemania", paisEn: "Germany", detalle: "Carrocería integral de poliéster.", detalleEn: "Full polyester body." },
  { slug: "oc-bk-comfort-de-3", modelo: "bk-comfort", brand: "Böckmann", name: "Comfort", precioEuros: 10300, pais: "Alemania", paisEn: "Germany", detalle: "Carrocería integral de poliéster.", detalleEn: "Full polyester body." },
  { slug: "oc-bk-master-de", modelo: "bk-master", brand: "Böckmann", name: "Master", precioEuros: 5200, pais: "Alemania", paisEn: "Germany", detalle: "Carrocería integral de poliéster.", detalleEn: "Full polyester body." },
  { slug: "oc-bk-big-master-fr", modelo: "bk-big-master", brand: "Böckmann", name: "Big Master", precioEuros: 3750, pais: "Francia", paisEn: "France" },
  { slug: "oc-bk-portax-e-de", modelo: "bk-portax-e", brand: "Böckmann", name: "Portax E", precioEuros: 10850, pais: "Alemania", paisEn: "Germany", detalle: "Carrocería de aluminio.", detalleEn: "Aluminium body." },
  { slug: "oc-bk-portax-l-ska-de", modelo: "bk-portax-l-ska", brand: "Böckmann", name: "Portax L SKA", precioEuros: 15990, pais: "Alemania", paisEn: "Germany", detalle: "Carrocería de aluminio.", detalleEn: "Aluminium body." },
  { slug: "oc-bk-duo-de-1", modelo: "bk-duo-esprit", brand: "Böckmann", name: "Duo", precioEuros: 3049, pais: "Alemania", paisEn: "Germany", detalle: "Carrocería de contrachapado.", detalleEn: "Plywood body." },
  { slug: "oc-bk-duo-de-2", modelo: "bk-duo-esprit", brand: "Böckmann", name: "Duo", precioEuros: 4350, pais: "Alemania", paisEn: "Germany", detalle: "Carrocería de contrachapado.", detalleEn: "Plywood body." },
  { slug: "oc-bk-duo-r-de", modelo: "bk-duo-r", brand: "Böckmann", name: "Duo R", precioEuros: 5450, pais: "Alemania", paisEn: "Germany", detalle: "Carrocería de contrachapado.", detalleEn: "Plywood body." },

  // --- Cheval Liberté
  { slug: "oc-cl-touring-one-de", modelo: "cl-touring-one", brand: "Cheval Liberté", name: "Touring One", precioEuros: 6750, pais: "Alemania", paisEn: "Germany", detalle: "Carrocería de aluminio.", detalleEn: "Aluminium body." },
  { slug: "oc-cl-touring-country-de", modelo: "cl-touring-country", brand: "Cheval Liberté", name: "Touring Country", precioEuros: 8800, pais: "Alemania", paisEn: "Germany", detalle: "Carrocería de aluminio.", detalleEn: "Aluminium body." },
  { slug: "oc-cl-minimax-fr-1", modelo: "cl-minimax", brand: "Cheval Liberté", name: "Minimax", precioEuros: 5500, pais: "Francia", paisEn: "France", detalle: "Configuración de tres plazas.", detalleEn: "Three-place layout." },
  { slug: "oc-cl-minimax-fr-2", modelo: "cl-minimax", brand: "Cheval Liberté", name: "Minimax", precioEuros: 6000, pais: "Francia", paisEn: "France", detalle: "Configuración de tres plazas.", detalleEn: "Three-place layout." },

  // --- Ifor Williams
  { slug: "oc-iw-hb506-fr", modelo: "iw-hb506", brand: "Ifor Williams", name: "HB506", precioEuros: 4890, pais: "Francia", paisEn: "France" },
  { slug: "oc-iw-hb506-de-1", modelo: "iw-hb506", brand: "Ifor Williams", name: "HB506", precioEuros: 7800, anio: 2018, pais: "Alemania", paisEn: "Germany" },
  { slug: "oc-iw-hb506-de-2", modelo: "iw-hb506", brand: "Ifor Williams", name: "HB506", precioEuros: 8600, pais: "Alemania", paisEn: "Germany", detalle: "Carrocería de aluminio.", detalleEn: "Aluminium body." },
  { slug: "oc-iw-hb403-fr-1", modelo: "iw-hb403", brand: "Ifor Williams", name: "HB403", precioEuros: 3100, pais: "Francia", paisEn: "France" },
  { slug: "oc-iw-hb403-fr-2", modelo: "iw-hb403", brand: "Ifor Williams", name: "HB403", precioEuros: 3000, pais: "Francia", paisEn: "France" },
  { slug: "oc-iw-hb403-fr-3", modelo: "iw-hb403", brand: "Ifor Williams", name: "HB403", precioEuros: 2500, pais: "Francia", paisEn: "France", detalle: "Carrocería de aluminio.", detalleEn: "Aluminium body." },

  // --- Humbaur
  { slug: "oc-hb-xanthos-aero-de", modelo: "hb-xanthos-aero-2400", brand: "Humbaur", name: "Xanthos Aero 2400", precioEuros: 6200, pais: "Alemania", paisEn: "Germany", detalle: "Carrocería de aluminio.", detalleEn: "Aluminium body." },
];

export const OCASION: readonly FichaRemolque[] = ANUNCIOS.map(fichaDe);
