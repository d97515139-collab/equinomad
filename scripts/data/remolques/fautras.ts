import type { FichaRemolque } from "./tipos";

/**
 * Gamme Fautras, constructeur français.
 *
 * Masses et dimensions relevées sur fautras.com en août 2026.
 *
 * PARTICULARITÉ DE LA GAMME OBLIC. Ces vans transportent les chevaux en
 * diagonale, d'où leur largeur de 1,90 m et leur PTAC élevé. Le chiffre du nom
 * désigne le nombre de places, pas la masse : un Oblic X2 est un deux-places de
 * 2.600 kg, un Oblic X3 un trois-places de 3.000 kg.
 *
 * CONVENTION SUR LE PROVAN. Le constructeur publie son PTAC en fourchette,
 * de 1.300 à 2.000 kg selon la version homologuée, et une tare de 920 kg. On
 * retient ici la version haute, 2.000 kg : c'est celle qui se vend, et la
 * charge utile annoncée reste alors exacte. Les versions allégées existent sur
 * demande, avec une charge utile moindre.
 *
 * Les textes sont rédigés ici, aucune phrase n'est reprise du constructeur.
 */

const FAUTRAS = "https://www.fautras.com/van-remorque";

export const FAUTRAS_LOTE: readonly FichaRemolque[] = [
  {
    slug: "ft-oblic-x2",
    brand: "Fautras",
    name: "Oblic X2",
    nameEn: "Oblic X2",
    sku: "FT-OBX2",
    shortDescription:
      "Van français de dos caballos en transporte diagonal, con 1,90 m de ancho interior. MMA de 2.600 kg y 1.320 kg de carga útil.",
    shortDescriptionEn:
      "French two-horse trailer with diagonal transport, 1.90 m wide inside. 2,600 kg gross weight and 1,320 kg payload.",
    bullets: [
      "Dos caballos, en transporte diagonal",
      "MMA 2.600 kg, tara 1.280 kg, carga útil 1.320 kg",
      "Interior de 3,64 × 1,90 × 2,25 m",
      "Suelo de polietileno imputrescible y antirruido",
      "Permiso B96 con vehículo de hasta 1.650 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses, carried diagonally",
      "2,600 kg gross weight, 1,280 kg unladen, 1,320 kg payload",
      "Inner space of 3.64 × 1.90 × 2.25 m",
      "Rot-proof, noise-reducing polyethylene floor",
      "B96 licence with a vehicle up to 1,650 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Fautras coloca los caballos en diagonal, no en paralelo. Esa disposición reparte el peso de otra manera y da a cada animal una postura que sigue el sentido de la marcha, lo que reduce las correcciones que hace con las patas al frenar. Los 1,90 m de ancho interior son la consecuencia directa de ese principio, y explican por qué este van es más ancho que un dos plazas convencional.",
        bodyEn: "Fautras places horses diagonally, not in parallel. That arrangement spreads weight differently and gives each animal a stance aligned with the direction of travel, which reduces the corrections it makes with its legs when braking. The 1.90 m inner width is the direct consequence of that principle, and explains why this trailer is wider than a conventional two-place.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo de polietileno, imputrescible de por vida y antirruido. Es la diferencia con los suelos de madera protegida y con los de aluminio desnudo: el polietileno no absorbe líquidos, no se corroe y amortigua el ruido de los cascos, que en un habitáculo cerrado altera a los animales nerviosos. Los 1.280 kg de tara son el precio de esa construcción y del ancho.",
        bodyEn: "Polyethylene floor, rot-proof for life and noise-reducing. That is the difference from protected timber floors and from bare aluminium: polyethylene absorbs no liquids, does not corrode and damps hoof noise, which unsettles nervous animals in a closed compartment. The 1,280 kg unladen weight is the price of that build and of the width.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.600 kg de MMA, el permiso B exigiría un vehículo tractor de 900 kg, masa que ningún turismo respeta. Con B96 el conjunto llega a 4.250 kg y admite un vehículo de hasta 1.650 kg; con B+E, hasta 3.500 kg. El PTAC puede elevarse a 3.000 o 3.500 kg de fábrica, lo que cambia el permiso necesario: dilo al pedir el presupuesto.",
        bodyEn: "At 2,600 kg gross, a category B licence would require a 900 kg towing vehicle, a mass no car meets. With B96 the combination reaches 4,250 kg and takes a vehicle up to 1,650 kg; with B+E, up to 3,500 kg. The gross weight can be raised to 3,000 or 3,500 kg at the factory, which changes the licence needed: say so when asking for a quote.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Suelo de polietileno, separadores para el transporte diagonal y altura interior de 2,25 m, de serie. La misma carrocería admite configuraciones de tres y cuatro plazas, que corresponden a los modelos Oblic X3 y X4. Elevación del PTAC, arcón, ventilación adicional y acabado exterior se concretan en el pedido con el plazo del fabricante.",
        bodyEn: "Polyethylene floor, partitions for diagonal transport and 2.25 m inner height, as standard. The same body takes three- and four-place configurations, matching the Oblic X3 and X4 models. Gross weight upgrade, chest, extra ventilation and exterior finish are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2600,
      taraKg: 1280,
      cargaUtilKg: 1320,
      largoInteriorCm: 364,
      anchoInteriorCm: 190,
      altoInteriorCm: 225,
      suelo: "Polietileno imputrescible y antirruido",
    },
    sourceRef: `${FAUTRAS}/oblicx2/`,
  },

  {
    slug: "ft-oblic-x3",
    slugExistente: "fautras-oblic-x3",
    brand: "Fautras",
    name: "Oblic X3",
    nameEn: "Oblic X3",
    sku: "FT-OBX3",
    shortDescription:
      "Van de tres caballos en transporte diagonal, con 4,49 m de largo interior. MMA de 3.000 kg y 1.420 kg de carga útil.",
    shortDescriptionEn:
      "Three-horse trailer with diagonal transport, 4.49 m long inside. 3,000 kg gross weight and 1,420 kg payload.",
    bullets: [
      "Tres caballos, en transporte diagonal",
      "MMA 3.000 kg, tara 1.580 kg, carga útil 1.420 kg",
      "Interior de 4,49 × 1,90 × 2,25 m",
      "Suelo de polietileno imputrescible y antirruido",
      "Permiso B+E con vehículo de hasta 3.500 kg de MMA",
    ],
    bulletsEn: [
      "Three horses, carried diagonally",
      "3,000 kg gross weight, 1,580 kg unladen, 1,420 kg payload",
      "Inner space of 4.49 × 1.90 × 2.25 m",
      "Rot-proof, noise-reducing polyethylene floor",
      "B+E licence with a towing vehicle up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Tres caballos en diagonal sobre 4,49 m de largo, con la misma anchura que el Oblic X2. La disposición diagonal es lo que permite ese número de plazas en una longitud que en paralelo daría dos. La carga útil de 1.420 kg repartida entre tres animales deja unos 473 kg por plaza con el equipo: conviene pesar tus caballos antes de decidir, porque tres adultos pesados superan esa cifra.",
        bodyEn: "Three horses diagonally over 4.49 m of length, with the same width as the Oblic X2. The diagonal arrangement is what allows that number of places in a length that would give two in parallel. The 1,420 kg payload split among three animals leaves about 473 kg per place with equipment: it is worth weighing your horses before deciding, because three heavy adults exceed that figure.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo de polietileno imputrescible y antirruido, como el resto de la gama Oblic. Los 1.580 kg de tara corresponden a la estructura que exige un habitáculo de 4,49 m homologado a 3.000 kg. El polietileno amortigua el ruido de los cascos, punto que cuenta más aún con tres animales a bordo: el eco de un suelo metálico en un habitáculo largo altera a los caballos sensibles.",
        bodyEn: "Rot-proof, noise-reducing polyethylene floor, like the rest of the Oblic range. The 1,580 kg unladen weight matches the structure a 4.49 m compartment rated at 3,000 kg demands. Polyethylene damps hoof noise, a point that counts even more with three animals aboard: the echo of a metal floor in a long compartment unsettles sensitive horses.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 3.000 kg de MMA, ni el permiso B ni el B96 son viables: el B96 admitiría un vehículo de 1.250 kg, masa que ningún coche actual respeta. Hace falta B+E, que lleva el conjunto a 7.000 kg y admite un vehículo tractor de hasta 3.500 kg. El PTAC puede elevarse a 3.500 kg de fábrica sin cambiar el permiso necesario.",
        bodyEn: "At 3,000 kg gross, neither a category B nor a B96 licence is workable: B96 would allow a 1,250 kg vehicle, a mass no current car meets. B+E is required, taking the combination to 7,000 kg and allowing a towing vehicle up to 3,500 kg. The gross weight can be raised to 3,500 kg at the factory without changing the licence needed.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Suelo de polietileno, separadores para tres plazas en diagonal y altura interior de 2,25 m, de serie. Retirando un separador se pasa a dos plazas muy holgadas. La misma carrocería existe en versión de cuatro plazas. Elevación del PTAC, arcón, ventilación adicional y acabado se definen en el pedido con el plazo del fabricante.",
        bodyEn: "Polyethylene floor, partitions for three diagonal places and 2.25 m inner height, as standard. Removing one partition gives two very roomy places. The same body exists in a four-place version. Gross weight upgrade, chest, extra ventilation and finish are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 3,
      mmaKg: 3000,
      taraKg: 1580,
      cargaUtilKg: 1420,
      largoInteriorCm: 449,
      anchoInteriorCm: 190,
      altoInteriorCm: 225,
      suelo: "Polietileno imputrescible y antirruido",
    },
    sourceRef: `${FAUTRAS}/oblicx3/`,
  },

  {
    slug: "ft-provan-premium",
    brand: "Fautras",
    name: "Provan Premium",
    nameEn: "Provan Premium",
    sku: "FT-PVP",
    shortDescription:
      "Van de dos caballos en transporte recto, con carrocería integral de poliéster. MMA de 2.000 kg y 1.080 kg de carga útil.",
    shortDescriptionEn:
      "Two-horse trailer with straight transport and a full polyester body. 2,000 kg gross weight and 1,080 kg payload.",
    bullets: [
      "Dos caballos, en transporte recto",
      "MMA 2.000 kg, tara 920 kg, carga útil 1.080 kg",
      "Interior de 3,00 × 1,63 × 2,25 m",
      "Carrocería integral de poliéster, suelo de polietileno",
      "Permiso B con vehículo de hasta 1.500 kg de MMA",
    ],
    bulletsEn: [
      "Two horses, carried straight",
      "2,000 kg gross weight, 920 kg unladen, 1,080 kg payload",
      "Inner space of 3.00 × 1.63 × 2.25 m",
      "Full polyester body, polyethylene floor",
      "Category B licence with a towing vehicle up to 1,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "El Provan es el van de dos plazas de Fautras en transporte recto, por oposición a la gama Oblic. Su MMA de 2.000 kg lo sitúa entre los pocos dos plazas que un turismo puede remolcar con permiso B. La carga útil de 1.080 kg admite dos caballos ligeros o de talla media con su equipo; dos animales pesados superan esa cifra y piden un Oblic.",
        bodyEn: "The Provan is Fautras's two-place trailer with straight transport, as opposed to the Oblic range. Its 2,000 kg gross weight places it among the few two-place trailers a car can tow on a category B licence. The 1,080 kg payload takes two light or medium horses with their equipment; two heavy animals exceed that figure and call for an Oblic.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Carrocería integral de poliéster y suelo de polietileno imputrescible. El poliéster no se abolla ni se corroe, y aísla del calor mejor que un panel metálico. Los 920 kg de tara son notables para un van de dos plazas con esta construcción: es lo que deja 1.080 kg de carga útil sobre una MMA voluntariamente contenida a 2.000 kg.",
        bodyEn: "Full polyester body and rot-proof polyethylene floor. Polyester neither dents nor corrodes, and insulates against heat better than a metal panel. The 920 kg unladen weight is notable for a two-place trailer with this build: it is what leaves 1,080 kg of payload on a gross weight deliberately held at 2,000 kg.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.000 kg de MMA, el conjunto se mantiene bajo 3.500 kg mientras el vehículo tractor no pase de 1.500 kg de masa máxima autorizada. Ese umbral deja fuera a la mayoría de los SUV pero admite turismos compactos y familiares. Con B96 el margen sube a 2.250 kg de vehículo, y con B+E a 3.500 kg. Es uno de los pocos dos plazas accesibles con permiso B.",
        bodyEn: "At 2,000 kg gross, the combination stays under 3,500 kg as long as the towing vehicle does not exceed 1,500 kg gross. That threshold rules out most SUVs but takes compact cars and estates. With B96 the margin rises to 2,250 kg of vehicle, and with B+E to 3,500 kg. It is one of the few two-place trailers within reach of a category B licence.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Carrocería de poliéster, suelo de polietileno y separador central, de serie. El constructeur homologa esta carrocería de 1.300 a 2.000 kg según la versión: la ficha anterior corresponde a la de 2.000 kg, que es la que deja más carga útil. Las versiones aligeradas se piden expresamente. Arcón, ventilación y acabado se concretan en el pedido.",
        bodyEn: "Polyester body, polyethylene floor and central partition, as standard. The manufacturer rates this body from 1,300 to 2,000 kg depending on version: the figures above are those of the 2,000 kg version, which leaves the most payload. Lighter versions are ordered expressly. Chest, ventilation and finish are settled at order time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2000,
      taraKg: 920,
      cargaUtilKg: 1080,
      largoInteriorCm: 300,
      anchoInteriorCm: 163,
      altoInteriorCm: 225,
      suelo: "Polietileno imputrescible y antirruido",
    },
    sourceRef: `${FAUTRAS}/provan-premium/`,
  },
];
