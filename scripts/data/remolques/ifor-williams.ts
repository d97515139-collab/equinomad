import type { FichaRemolque } from "./tipos";

/**
 * Gamme Ifor Williams, série HB.
 *
 * Le constructeur gallois refuse les requêtes automatisées sur son site : les
 * masses et les dimensions viennent donc de ses distributeurs officiels
 * britanniques et irlandais — West Wood Trailers et TH Jenkinson — relevées en
 * août 2026, et recoupées entre eux avant d'être écrites ici.
 *
 * DEUX MODÈLES MANQUENT VOLONTAIREMENT. Le HBX403, version aluminium du 403, et
 * le HB610, le grand modèle de 3.500 kg, sont bien distribués : leurs masses
 * sont publiées, mais leur hauteur intérieure ne l'est nulle part. Or c'est la
 * cote qui décide si un cheval de 17 mains rentre. Elle ne s'estime pas, et une
 * fiche qui l'omettrait ferait perdre un déplacement à l'acheteur. Ils entreront
 * au catalogue le jour où le distributeur espagnol nous donnera le chiffre.
 *
 * Les textes sont rédigés ici, aucune phrase n'est reprise du constructeur.
 */

const IWT = "https://www.iwt.co.uk/products/horsebox";

export const IFOR_WILLIAMS: readonly FichaRemolque[] = [
  {
    slug: "iw-hb403",
    slugExistente: "ifor-williams-hb-403",
    brand: "Ifor Williams",
    name: "HB403",
    nameEn: "HB403",
    sku: "IW-HB403",
    shortDescription:
      "Van británico de un caballo, homologado hasta 16.2 manos. MMA de 1.600 kg y 833 kg de carga útil, dentro del permiso B.",
    shortDescriptionEn:
      "British single-horse trailer, rated up to 16.2hh. 1,600 kg gross weight and 833 kg payload, within a category B licence.",
    bullets: [
      "Un caballo de hasta 16.2 manos",
      "MMA 1.600 kg, tara 767 kg, carga útil 833 kg",
      "Interior de 3,08 × 1,30 × 2,20 m",
      "Chasis galvanizado en caliente",
      "Permiso B con vehículo de hasta 1.900 kg de MMA",
    ],
    bulletsEn: [
      "One horse up to 16.2hh",
      "1,600 kg gross weight, 767 kg unladen, 833 kg payload",
      "Inner space of 3.08 × 1.30 × 2.20 m",
      "Hot-dip galvanised chassis",
      "Category B licence with a towing vehicle up to 1,900 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Ifor Williams homologa este van para un caballo de hasta 16.2 manos, es decir alrededor de 1,68 m a la cruz. Es una indicación del fabricante, no una estimación: conviene medir el tuyo antes de encargar. Los 833 kg de carga útil cubren ese animal con su silla y su equipo. La altura interior de 2,20 m es la cota que hay que contrastar con la alzada real.",
        bodyEn: "Ifor Williams rates this trailer for one horse up to 16.2hh, that is around 1.68 m at the withers. That is the manufacturer's figure, not an estimate: it is worth measuring yours before ordering. The 833 kg payload covers that animal with its saddle and equipment. The 2.20 m inner height is the dimension to check against the real height.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Chasis galvanizado en caliente, procedimiento por el que la marca es conocida: el acero se sumerge en zinc fundido, que penetra en la superficie en lugar de recubrirla como haría una pintura. En un remolque que pasa su vida a la intemperie y recibe orina y agua de lavado, esa diferencia se mide en años de vida útil, no en aspecto.",
        bodyEn: "Hot-dip galvanised chassis, the process the brand is known for: the steel is dipped in molten zinc, which penetrates the surface rather than coating it as paint would. On a trailer that lives outdoors and takes urine and wash water, that difference is measured in years of service life, not in looks.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 1.600 kg de MMA, el conjunto se mantiene bajo los 3.500 kg del permiso B mientras el vehículo tractor no supere 1.900 kg de masa máxima autorizada. Esa cifra admite la mayoría de los turismos medianos y de los SUV compactos. Con B96 el margen sube a 2.650 kg de vehículo, y con B+E hasta 3.500 kg.",
        bodyEn: "At 1,600 kg gross, the combination stays under the 3,500 kg of a category B licence as long as the towing vehicle does not exceed 1,900 kg gross. That figure takes most mid-size cars and compact SUVs. With B96 the margin rises to 2,650 kg of vehicle, and with B+E up to 3,500 kg.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Barras de pecho y de grupa montadas de serie, ventana de inspección frontal y techo de una sola pieza sin juntas, que es por donde entra el agua en los remolques que las tienen. El ancho interior de 1,30 m deja la plaza libre de separador. Arcón, ventilación adicional, rueda de repuesto y acabado se concretan en el pedido con el plazo del fabricante.",
        bodyEn: "Breast and breeching bars fitted as standard, front inspection window and a one-piece roof with no seams, which is where water gets in on trailers that have them. The 1.30 m inner width leaves the place free of a partition. Chest, extra ventilation, spare wheel and finish are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 1,
      mmaKg: 1600,
      taraKg: 767,
      cargaUtilKg: 833,
      largoInteriorCm: 308,
      anchoInteriorCm: 130,
      altoInteriorCm: 220,
    },
    sourceRef: `${IWT}/hb-range/`,
  },

  {
    slug: "iw-hb506",
    slugExistente: "ifor-williams-hb-506",
    brand: "Ifor Williams",
    name: "HB506",
    nameEn: "HB506",
    sku: "IW-HB506",
    shortDescription:
      "Van de dos caballos de hasta 16.2 manos, con suelo de aluminio sobre madera tratada. MMA de 2.600 kg y 1.680 kg de carga útil.",
    shortDescriptionEn:
      "Two-horse trailer for animals up to 16.2hh, with aluminium flooring over treated timber. 2,600 kg gross weight and 1,680 kg payload.",
    bullets: [
      "Dos caballos de hasta 16.2 manos",
      "MMA 2.600 kg, tara 920 kg, carga útil 1.680 kg",
      "Interior de 3,16 × 1,67 × 2,26 m",
      "Suelo de aluminio antideslizante sobre madera tratada a presión",
      "Permiso B96 con vehículo de hasta 1.650 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses up to 16.2hh",
      "2,600 kg gross weight, 920 kg unladen, 1,680 kg payload",
      "Inner space of 3.16 × 1.67 × 2.26 m",
      "Slip-resistant aluminium floor over pressure-treated timber",
      "B96 licence with a vehicle up to 1,650 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Con 920 kg de tara sobre 2.600 de MMA, este van deja 1.680 kg de carga útil, cifra generosa para dos caballos de hasta 16.2 manos. Los 1,67 m de ancho reparten dos plazas de 83 cm y la altura de 2,26 m acompaña esa homologación. Es el modelo de referencia de la marca en dos plazas, y el más extendido de la gama en Europa.",
        bodyEn: "With 920 kg unladen on 2,600 kg gross, this trailer leaves 1,680 kg of payload, a generous figure for two horses up to 16.2hh. The 1.67 m width gives two 83 cm places and the 2.26 m height matches that rating. It is the brand's reference two-place model, and the most widespread of the range in Europe.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo de madera tratada a presión protegido por una chapa de aluminio antideslizante de 2 mm, y chasis galvanizado en caliente. Esa combinación es la firma de la marca: la madera aporta rigidez y aislamiento, el aluminio la protege del casco y de los líquidos. El techo es de una sola pieza, sin junta por donde el agua pueda entrar.",
        bodyEn: "Pressure-treated timber floor protected by a 2 mm slip-resistant aluminium plate, and hot-dip galvanised chassis. That combination is the brand's signature: the timber brings rigidity and insulation, the aluminium protects it from hooves and liquids. The roof is one piece, with no seam for water to get through.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.600 kg de MMA, el permiso B exigiría un vehículo tractor de 900 kg, masa que ningún turismo actual respeta. Con B96 el conjunto llega a 4.250 kg y admite un vehículo de hasta 1.650 kg de masa máxima autorizada; con B+E, hasta 3.500 kg. El B96 se obtiene con un curso y una prueba de circulación, sin examen teórico.",
        bodyEn: "At 2,600 kg gross, a category B licence would require a 900 kg towing vehicle, a mass no current car meets. With B96 the combination reaches 4,250 kg and takes a vehicle up to 1,650 kg gross; with B+E, up to 3,500 kg. B96 is obtained with a course and a driving test, with no theory exam.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Separador central, barras de pecho y de grupa montados de serie. Ventanas laterales y ventana de inspección frontal ampliada, que permite ver a los animales sin detenerse. Si tus caballos superan las 16.2 manos, el HB511 sube a 1,79 m de ancho con la misma altura. Las opciones se concretan en el pedido con el plazo del fabricante.",
        bodyEn: "Central partition, breast and breeching bars fitted as standard. Side windows and an enlarged front inspection window, which lets you see the animals without stopping. If your horses exceed 16.2hh, the HB511 rises to 1.79 m of width at the same height. Options are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2600,
      taraKg: 920,
      cargaUtilKg: 1680,
      largoInteriorCm: 316,
      anchoInteriorCm: 167,
      altoInteriorCm: 226,
      suelo: "Aluminio antideslizante sobre madera tratada a presión",
    },
    sourceRef: `${IWT}/hb-range/`,
  },

  {
    slug: "iw-hb511",
    slugExistente: "ifor-williams-hb-511",
    brand: "Ifor Williams",
    name: "HB511",
    nameEn: "HB511",
    sku: "IW-HB511",
    shortDescription:
      "Van de dos caballos de hasta 17.2 manos, con 1,79 m de ancho interior. MMA de 2.700 kg y 1.700 kg de carga útil.",
    shortDescriptionEn:
      "Two-horse trailer for animals up to 17.2hh, 1.79 m wide inside. 2,700 kg gross weight and 1,700 kg payload.",
    bullets: [
      "Dos caballos de hasta 17.2 manos",
      "MMA 2.700 kg, tara 1.000 kg, carga útil 1.700 kg",
      "Interior de 3,52 × 1,79 × 2,26 m",
      "Suelo de aluminio antideslizante con goma sobre madera tratada",
      "Permiso B96 con vehículo de hasta 1.550 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses up to 17.2hh",
      "2,700 kg gross weight, 1,000 kg unladen, 1,700 kg payload",
      "Inner space of 3.52 × 1.79 × 2.26 m",
      "Slip-resistant aluminium floor with rubber over treated timber",
      "B96 licence with a vehicle up to 1,550 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Ifor Williams homologa este modelo para dos caballos de hasta 17.2 manos, alrededor de 1,78 m a la cruz. Es la razón de sus 1,79 m de ancho y de sus 3,52 m de largo: treinta y seis centímetros más largo y doce más ancho que el HB506. Con 1.700 kg de carga útil, dos animales de gran alzada viajan con su equipo sin acercarse al límite.",
        bodyEn: "Ifor Williams rates this model for two horses up to 17.2hh, around 1.78 m at the withers. That is the reason for its 1.79 m width and 3.52 m length: thirty-six centimetres longer and twelve wider than the HB506. With 1,700 kg of payload, two tall animals travel with their equipment without approaching the limit.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo de madera tratada a presión, protegido por chapa de aluminio antideslizante de 2 mm y cubierto de goma. Chasis galvanizado en caliente y techo de una sola pieza. Los 1.000 kg de tara son contenidos para un habitáculo de 3,52 por 1,79 m: la construcción mixta madera-aluminio pesa menos que un aluminio integral de rigidez equivalente.",
        bodyEn: "Pressure-treated timber floor, protected by a 2 mm slip-resistant aluminium plate and covered with rubber. Hot-dip galvanised chassis and one-piece roof. The 1,000 kg unladen weight is contained for a compartment of 3.52 by 1.79 m: the mixed timber-aluminium build weighs less than full aluminium of equivalent rigidity.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.700 kg de MMA, el permiso B queda descartado y el B96 solo admite un vehículo tractor de 1.550 kg como máximo, cifra que deja fuera a casi todos los SUV. El B+E, que permite hasta 3.500 kg de vehículo, es la opción realista. Comprueba además la masa remolcable con freno de tu coche, en el apartado O.1 de su ficha técnica.",
        bodyEn: "At 2,700 kg gross, a category B licence is ruled out and B96 only allows a towing vehicle of 1,550 kg at most, a figure that rules out almost every SUV. B+E, permitting up to 3,500 kg of vehicle, is the realistic option. Also check your car's braked towable mass, in section O.1 of its registration document.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Separador central, barras de pecho y de grupa, par de ventanas laterales y ventana de inspección frontal ampliada, de serie. La goma sobre el suelo de aluminio amortigua las vibraciones en trayectos largos. Arcón delantero, ventilación adicional, rueda de repuesto y acabado exterior se definen en el pedido con el plazo del fabricante.",
        bodyEn: "Central partition, breast and breeching bars, a pair of side windows and an enlarged front inspection window, as standard. The rubber over the aluminium floor damps vibration on long journeys. Front chest, extra ventilation, spare wheel and exterior finish are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2700,
      taraKg: 1000,
      cargaUtilKg: 1700,
      largoInteriorCm: 352,
      anchoInteriorCm: 179,
      altoInteriorCm: 226,
      suelo: "Aluminio antideslizante con goma sobre madera tratada a presión",
    },
    sourceRef: `${IWT}/hb-range/`,
  },

  {
    slug: "iw-hb610",
    brand: "Ifor Williams",
    name: "HB610",
    nameEn: "HB610",
    sku: "IW-HB610",
    shortDescription:
      "Van de dos caballos grandes o hasta cinco ponis, con 4,25 m de largo y 2,07 m de ancho interior. MMA de 3.500 kg.",
    shortDescriptionEn:
      "Trailer for two large horses or up to five ponies, 4.25 m long and 2.07 m wide inside. 3,500 kg gross weight.",
    bullets: [
      "Dos caballos de 17.2 manos, o hasta cinco ponis",
      "MMA 3.500 kg, tara 1.450 kg, carga útil 2.050 kg",
      "Interior de 4,25 × 2,07 × 2,30 m",
      "Suelo de aluminio",
      "Permiso B+E con vehículo de hasta 3.500 kg de MMA",
    ],
    bulletsEn: [
      "Two 17.2hh horses, or up to five ponies",
      "3,500 kg gross weight, 1,450 kg unladen, 2,050 kg payload",
      "Inner space of 4.25 × 2.07 × 2.30 m",
      "Aluminium floor",
      "B+E licence with a towing vehicle up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Es el mayor van de la gama HB: 4,25 m de largo y 2,07 m de ancho interior, con 2.050 kg de carga útil. Ifor Williams lo homologa para dos caballos de hasta 17.2 manos con mucho espacio, o hasta cinco ponis. Esa polivalencia interesa a clubes y a centros hípicos que mueven grupos de tamaño variable según la salida.",
        bodyEn: "This is the largest trailer in the HB range: 4.25 m long and 2.07 m wide inside, with 2,050 kg of payload. Ifor Williams rates it for two horses up to 17.2hh with plenty of room, or up to five ponies. That versatility appeals to clubs and equestrian centres moving groups of varying size from one outing to the next.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo de aluminio y chasis galvanizado en caliente, procedimiento por el que la marca es conocida: el zinc penetra en el acero en lugar de recubrirlo. Los 1.450 kg de tara corresponden a la estructura que exige homologar 3.500 kg sobre más de cuatro metros. Seis ventanas laterales fijas y ventilaciones de techo completan la circulación de aire, que con cinco animales a bordo deja de ser un detalle.",
        bodyEn: "Aluminium floor and hot-dip galvanised chassis, the process the brand is known for: zinc penetrates the steel rather than coating it. The 1,450 kg unladen weight matches the structure needed to homologate 3,500 kg over more than four metres. Six fixed side windows and roof vents complete the airflow, which with five animals aboard stops being a detail.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 3.500 kg de MMA, este van exige permiso B+E: ni el B ni el B96 lo permiten con ningún vehículo real. Con B+E el conjunto llega a 7.000 kg y admite un tractor de hasta 3.500 kg de masa máxima autorizada. Con 2,07 m de ancho, los espejos de extensión son obligatorios en circulación, y la masa remolcable con freno de tu vehículo, en el apartado O.1, debe alcanzar los 3.500 kg.",
        bodyEn: "At 3,500 kg gross, this trailer requires a B+E licence: neither B nor B96 allows it with any real vehicle. With B+E the combination reaches 7,000 kg and takes a tow car up to 3,500 kg gross. At 2.07 m wide, extension mirrors are compulsory on the road, and your vehicle's braked towable mass, in section O.1, must reach 3,500 kg.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Suelo de aluminio, rampa delantera, seis ventanas laterales fijas, ventilaciones de techo e iluminación interior, de serie. Las mamparas se piden en aluminio o en madera, y la tapicería bajo solicitud. La configuración de plazas, de dos caballos grandes a cinco ponis, se define en el pedido: dinos qué animales mueves y te preparamos el presupuesto con el plazo del fabricante.",
        bodyEn: "Aluminium floor, front ramp, six fixed side windows, roof vents and interior lighting, as standard. Partitions are ordered in aluminium or timber, and upholstery on request. The layout, from two large horses to five ponies, is set at order time: tell us which animals you move and we will prepare the quote with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 4,
      mmaKg: 3500,
      taraKg: 1450,
      cargaUtilKg: 2050,
      largoInteriorCm: 425,
      anchoInteriorCm: 207,
      altoInteriorCm: 230,
      suelo: "Aluminio",
    },
    sourceRef: "https://sarlgeavida.com/product/camioneta-ifor-williams-hb-610-4-5-asientos/",
  },
];
