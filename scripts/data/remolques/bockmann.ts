import type { FichaRemolque } from "./tipos";

/**
 * Gamme Böckmann — premier lot : Uno, Duo, Comfort, Champion, Master.
 *
 * Masses et dimensions relevées sur les fiches techniques du constructeur
 * (boeckmann.com) en août 2026, et non chez un distributeur : les cotes des
 * revendeurs espagnols divergeaient de celles de l'usine, parfois de sept
 * centimètres. En cas de désaccord, le constructeur fait foi.
 *
 * CONVENTION SUR LA TARA. Böckmann publie le poids total et la charge utile,
 * pas toujours le poids à vide. Quand il manque, la tara est la soustraction
 * des deux — une opération exacte, pas une estimation. Toutes les valeurs de ce
 * fichier ont été vérifiées : MMA moins tara égale charge utile, sans exception.
 *
 * Le plancher n'est pas publié pour toutes les variantes. Absent, il ne figure
 * pas au tableau technique plutôt que d'être approximé.
 *
 * Les textes sont rédigés ici, aucune phrase n'est reprise du constructeur.
 */

const BOECK = "https://www.boeckmann.com/de/anhaenger/pferdeanhaenger/p";

export const BOCKMANN: readonly FichaRemolque[] = [
  // ------------------------------------------------------------------- Uno
  {
    slug: "bk-uno-esprit",
    brand: "Böckmann",
    name: "Uno Esprit",
    nameEn: "Uno Esprit",
    sku: "BK-UNO-E",
    shortDescription:
      "Van de un caballo con carrocería de aluminio y 896 kg de carga útil. Con 1.600 kg de MMA, entra en el permiso B con la mayoría de los turismos.",
    shortDescriptionEn:
      "Single-horse trailer with an aluminium body and 896 kg payload. At 1,600 kg gross, it fits a category B licence with most cars.",
    bullets: [
      "Un caballo, o una yegua con su potro",
      "MMA 1.600 kg, tara 704 kg, carga útil 896 kg",
      "Interior de 3,10 × 1,30 × 2,30 m",
      "Suelo integral de aluminio",
      "Permiso B con vehículo de hasta 1.900 kg de MMA",
    ],
    bulletsEn: [
      "One horse, or a mare with her foal",
      "1,600 kg gross weight, 704 kg unladen, 896 kg payload",
      "Inner space of 3.10 × 1.30 × 2.30 m",
      "Full aluminium floor",
      "Category B licence with a towing vehicle up to 1,900 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Un van de una plaza para quien se desplaza con un solo caballo y no quiere cambiar de coche ni de permiso. Los 896 kg de carga útil cubren un caballo adulto de talla media con su silla y su equipo, con margen para el agua de la jornada. Los 1,30 m de ancho dejan la plaza libre de separador central, de modo que subir y bajar se hace sin maniobras.",
        bodyEn: "A single-place trailer for anyone travelling with one horse who does not want to change car or licence. The 896 kg payload covers an adult medium horse with saddle and equipment, with margin for the day's water. The 1.30 m width leaves the place free of a central partition, so loading and unloading take no manoeuvring.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Carrocería y suelo integrales de aluminio. Los 704 kg de tara son de los más bajos de su categoría, y esa ligereza es lo que deja 896 kg de carga útil sobre una MMA de solo 1.600 kg. El aluminio no absorbe humedad ni orina, así que la tara no aumenta con los años, al contrario de lo que ocurre con un suelo de madera que se satura y hay que sustituir.",
        bodyEn: "Full aluminium body and floor. The 704 kg unladen weight is among the lowest in its class, and that lightness is what leaves 896 kg of payload on a gross weight of only 1,600 kg. Aluminium absorbs neither damp nor urine, so the unladen weight does not creep up over the years, unlike a wooden floor that saturates and has to be replaced.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 1.600 kg de MMA, el conjunto se mantiene bajo los 3.500 kg del permiso B mientras el vehículo tractor no pase de 1.900 kg de masa máxima autorizada. Esa cifra admite la mayoría de los turismos medianos y de los SUV compactos. Con B96 el margen sube a 2.650 kg de vehículo, y con B+E hasta 3.500 kg. La MMA de tu coche figura en el apartado F.1 de su ficha técnica.",
        bodyEn: "At 1,600 kg gross, the combination stays under the 3,500 kg of a category B licence as long as the towing vehicle does not exceed 1,900 kg gross. That figure takes most mid-size cars and compact SUVs. With B96 the margin rises to 2,650 kg of vehicle, and with B+E up to 3,500 kg. Your car's gross weight is in section F.1 of its registration document.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Suelo integral de aluminio y carrocería del mismo material, montados de fábrica. La altura interior de 2,30 m corresponde a un caballo de alzada media con la cabeza levantada, postura que adopta en cada frenada. El resto de la configuración, desde el arcón hasta la rueda de repuesto, se define en el pedido con el plazo del fabricante: escríbenos con tu uso previsto.",
        bodyEn: "Full aluminium floor and body of the same material, factory fitted. The 2.30 m inner height matches a medium horse with its head raised, the posture it takes at every braking. The rest of the configuration, from the chest to the spare wheel, is settled at order time with the manufacturer's lead time: write to us with your intended use.",
      },
    ],
    specs: {
      plazas: 1,
      mmaKg: 1600,
      taraKg: 704,
      cargaUtilKg: 896,
      largoInteriorCm: 310,
      anchoInteriorCm: 130,
      altoInteriorCm: 230,
      suelo: "Aluminio integral",
    },
    sourceRef: `${BOECK}/uno`,
  },

  {
    slug: "bk-uno-c",
    brand: "Böckmann",
    name: "Uno C",
    nameEn: "Uno C",
    sku: "BK-UNO-C",
    shortDescription:
      "Van de un caballo con suelo de goma sobre base de aluminio. MMA de 1.600 kg y 840 kg de carga útil.",
    shortDescriptionEn:
      "Single-horse trailer with rubber flooring over an aluminium base. 1,600 kg gross weight and 840 kg payload.",
    bullets: [
      "Un caballo, o una yegua con su potro",
      "MMA 1.600 kg, tara 760 kg, carga útil 840 kg",
      "Interior de 3,10 × 1,30 × 2,30 m",
      "Goma con listones antideslizantes sobre suelo de aluminio",
      "Permiso B con vehículo de hasta 1.900 kg de MMA",
    ],
    bulletsEn: [
      "One horse, or a mare with her foal",
      "1,600 kg gross weight, 760 kg unladen, 840 kg payload",
      "Inner space of 3.10 × 1.30 × 2.30 m",
      "Rubber with grip battens over an aluminium floor",
      "Category B licence with a towing vehicle up to 1,900 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Misma carrocería y mismas medidas que el Uno Esprit, con el suelo tratado de otro modo: goma con listones antideslizantes sobre la base de aluminio. Esos listones dan un agarre marcado al casco, lo que tranquiliza a los caballos que dudan al subir. La contrapartida son 56 kg de tara adicional, que se descuentan de la carga útil y la dejan en 840 kg.",
        bodyEn: "Same body and same dimensions as the Uno Esprit, with the floor treated differently: rubber with grip battens over the aluminium base. Those battens give the hoof a pronounced grip, which reassures horses that hesitate when loading. The trade-off is 56 kg of extra unladen weight, which comes off the payload and leaves it at 840 kg.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Carrocería de aluminio y suelo de aluminio revestido de goma con listones. La goma amortigua las vibraciones del camino y aísla el casco del metal, que en verano se calienta y en invierno se enfría. Es la diferencia práctica con el acabado Esprit, cuyo aluminio queda a la vista: menos peso allí, más confort aquí. Ninguno de los dos se degrada con la humedad.",
        bodyEn: "Aluminium body and aluminium floor covered with battened rubber. The rubber damps road vibration and insulates the hoof from metal, which heats up in summer and chills in winter. That is the practical difference from the Esprit finish, whose aluminium is left bare: less weight there, more comfort here. Neither degrades with damp.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "La MMA de 1.600 kg deja este van dentro del permiso B con un vehículo tractor de hasta 1.900 kg de masa máxima autorizada, porque el conjunto no puede superar 3.500 kg. Con B96 el vehículo puede llegar a 2.650 kg, y con B+E a 3.500 kg. Comprueba también la masa remolcable con freno que autoriza tu coche: figura en el apartado O.1 y a veces es más restrictiva que el permiso.",
        bodyEn: "The 1,600 kg gross weight keeps this trailer within a category B licence with a towing vehicle up to 1,900 kg gross, since the combination may not exceed 3,500 kg. With B96 the vehicle can reach 2,650 kg, and with B+E 3,500 kg. Also check the braked towable mass your car allows: it is in section O.1 and is sometimes stricter than the licence.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Suelo de aluminio con revestimiento de goma y listones antideslizantes, carrocería de aluminio, altura interior de 2,30 m. La plaza única deja el ancho de 1,30 m libre de separador. Arcón delantero, ventilación adicional, rueda de repuesto y acabado exterior se concretan en el pedido: dinos cómo lo vas a usar y te preparamos la configuración con el plazo de fábrica.",
        bodyEn: "Aluminium floor with rubber covering and grip battens, aluminium body, 2.30 m inner height. The single place leaves the 1.30 m width free of a partition. Front chest, extra ventilation, spare wheel and exterior finish are settled at order time: tell us how you will use it and we will prepare the configuration with the factory lead time.",
      },
    ],
    specs: {
      plazas: 1,
      mmaKg: 1600,
      taraKg: 760,
      cargaUtilKg: 840,
      largoInteriorCm: 310,
      anchoInteriorCm: 130,
      altoInteriorCm: 230,
      suelo: "Goma con listones antideslizantes sobre aluminio",
    },
    sourceRef: `${BOECK}/uno`,
  },

  // ------------------------------------------------------------------- Duo
  {
    slug: "bk-duo-esprit",
    brand: "Böckmann",
    name: "Duo Esprit",
    nameEn: "Duo Esprit",
    sku: "BK-DUO-E",
    shortDescription:
      "Van de dos caballos con 1.591 kg de carga útil, la mayor de la gama Duo. MMA de 2.400 kg.",
    shortDescriptionEn:
      "Two-horse trailer with 1,591 kg of payload, the highest in the Duo range. 2,400 kg gross weight.",
    bullets: [
      "Dos caballos",
      "MMA 2.400 kg, tara 809 kg, carga útil 1.591 kg",
      "Interior de 3,10 × 1,65 × 2,30 m",
      "Carrocería de contrachapado",
      "Permiso B96 con vehículo de hasta 1.850 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,400 kg gross weight, 809 kg unladen, 1,591 kg payload",
      "Inner space of 3.10 × 1.65 × 2.30 m",
      "Plywood body",
      "B96 licence with a vehicle up to 1,850 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Con 809 kg de tara sobre una MMA de 2.400, este van deja 1.591 kg de carga útil: es la cifra más alta de la gama Duo y una de las mejores de su categoría. Dos caballos adultos de 600 kg dejan todavía casi 400 kg para sillas, mantas, forraje y agua. Los 1,65 m de ancho reparten dos plazas de 82 cm, medida estándar para caballos de talla media.",
        bodyEn: "With 809 kg unladen on a 2,400 kg gross weight, this trailer leaves 1,591 kg of payload: the highest figure in the Duo range and one of the best in its class. Two adult 600 kg horses still leave nearly 400 kg for saddles, rugs, forage and water. The 1.65 m width gives two 82 cm places, a standard measure for medium horses.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Carrocería de contrachapado, solución que Böckmann mantiene en la gama Duo por su relación entre peso y coste. El contrachapado aísla mejor del calor que un panel metálico fino, y su ligereza explica en parte los 809 kg de tara. A cambio, exige revisar el sellado de los cantos con los años: es ahí, y no en la superficie, por donde la humedad acaba entrando.",
        bodyEn: "Plywood body, a solution Böckmann keeps in the Duo range for its weight-to-cost ratio. Plywood insulates against heat better than a thin metal panel, and its lightness partly explains the 809 kg unladen weight. In exchange, it calls for checking the edge sealing over the years: that is where damp eventually gets in, not through the surface.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.400 kg de MMA, el permiso B exigiría un vehículo tractor de 1.100 kg como máximo, cifra que hoy solo alcanzan algunos utilitarios pequeños. En la práctica, este van pide B96, que lleva el conjunto a 4.250 kg y admite un vehículo de hasta 1.850 kg, o B+E, que permite hasta 3.500 kg de vehículo. El B96 se obtiene con un curso y una prueba, sin examen teórico.",
        bodyEn: "At 2,400 kg gross, a category B licence would demand a towing vehicle of 1,100 kg at most, a figure only a few small city cars reach today. In practice this trailer calls for B96, which takes the combination to 4,250 kg and allows a vehicle up to 1,850 kg, or B+E, which permits up to 3,500 kg of vehicle. B96 is obtained with a course and a test, with no theory exam.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Separador central para las dos plazas y carrocería de contrachapado, montados de fábrica. La altura interior de 2,30 m conviene a caballos de alzada media; por encima, conviene mirar la gama Master, que sube a 2,35 m. Arcón, ventilación adicional, rueda de repuesto y acabado se concretan en el pedido con el plazo del fabricante.",
        bodyEn: "Central partition for the two places and plywood body, factory fitted. The 2.30 m inner height suits medium horses; above that, the Master range is worth a look, as it rises to 2.35 m. Chest, extra ventilation, spare wheel and finish are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2400,
      taraKg: 809,
      cargaUtilKg: 1591,
      largoInteriorCm: 310,
      anchoInteriorCm: 165,
      altoInteriorCm: 230,
    },
    sourceRef: `${BOECK}/duo`,
  },

  {
    slug: "bk-duo-r",
    brand: "Böckmann",
    name: "Duo R",
    nameEn: "Duo R",
    sku: "BK-DUO-R",
    shortDescription:
      "Van de dos caballos con 3,28 m de largo interior, dieciocho centímetros más que el Duo Esprit. MMA de 2.400 kg.",
    shortDescriptionEn:
      "Two-horse trailer with a 3.28 m inner length, eighteen centimetres more than the Duo Esprit. 2,400 kg gross weight.",
    bullets: [
      "Dos caballos",
      "MMA 2.400 kg, tara 891 kg, carga útil 1.509 kg",
      "Interior de 3,28 × 1,65 × 2,30 m",
      "Carrocería de contrachapado",
      "Permiso B96 con vehículo de hasta 1.850 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,400 kg gross weight, 891 kg unladen, 1,509 kg payload",
      "Inner space of 3.28 × 1.65 × 2.30 m",
      "Plywood body",
      "B96 licence with a vehicle up to 1,850 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Dieciocho centímetros más largo que el Duo Esprit, con el mismo ancho y la misma altura. Ese largo suplementario se nota en caballos de cuerpo largo, que viajan sin rozar la barra trasera. La tara sube a 891 kg y deja 1.509 kg de carga útil, cifra todavía holgada para dos caballos adultos con su equipo completo.",
        bodyEn: "Eighteen centimetres longer than the Duo Esprit, with the same width and height. That extra length tells with long-bodied horses, which travel without brushing the rear bar. The unladen weight rises to 891 kg and leaves 1,509 kg of payload, still ample for two adult horses with their full equipment.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Carrocería de contrachapado, como el resto de la gama Duo. Los 82 kg que separan su tara de la del Esprit corresponden al material adicional del mayor largo. El ancho interior de 1,65 m reparte dos plazas de 82 cm. El contrachapado pide una revisión periódica del sellado de los cantos, que es por donde la humedad entra a la larga.",
        bodyEn: "Plywood body, like the rest of the Duo range. The 82 kg separating its unladen weight from the Esprit's correspond to the extra material of the greater length. The 1.65 m inner width gives two 82 cm places. Plywood calls for periodic checks of the edge sealing, which is where damp gets in over time.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Los 2.400 kg de MMA dejan el permiso B fuera de alcance salvo con un vehículo de 1.100 kg, que casi ningún coche actual respeta. Con B96 el conjunto llega a 4.250 kg y admite un vehículo de hasta 1.850 kg de masa máxima; con B+E, hasta 3.500 kg. Verifica también la masa remolcable de tu coche, en el apartado O.1 de su ficha técnica.",
        bodyEn: "The 2,400 kg gross weight puts a category B licence out of reach except with a 1,100 kg vehicle, which almost no current car meets. With B96 the combination reaches 4,250 kg and takes a vehicle up to 1,850 kg gross; with B+E, up to 3,500 kg. Also check your car's towable mass, in section O.1 of its registration document.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Separador central, carrocería de contrachapado y altura interior de 2,30 m, de serie. El largo de 3,28 m es el argumento del modelo frente al Esprit, y la razón por la que conviene medir tu caballo antes de elegir entre los dos. Arcón, ventilación y rueda de repuesto se definen en el pedido con el plazo de fábrica.",
        bodyEn: "Central partition, plywood body and 2.30 m inner height, as standard. The 3.28 m length is the model's argument against the Esprit, and the reason it is worth measuring your horse before choosing between the two. Chest, ventilation and spare wheel are settled at order time with the factory lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2400,
      taraKg: 891,
      cargaUtilKg: 1509,
      largoInteriorCm: 328,
      anchoInteriorCm: 165,
      altoInteriorCm: 230,
    },
    sourceRef: `${BOECK}/duo`,
  },

  // --------------------------------------------------------------- Comfort
  {
    slug: "bk-comfort",
    brand: "Böckmann",
    name: "Comfort",
    nameEn: "Comfort",
    sku: "BK-CMF-2",
    shortDescription:
      "Van de dos caballos con carrocería de poliéster y 3,35 m de largo interior. MMA de 2.400 kg y 1.422 kg de carga útil.",
    shortDescriptionEn:
      "Two-horse trailer with a polyester body and 3.35 m inner length. 2,400 kg gross weight and 1,422 kg payload.",
    bullets: [
      "Dos caballos",
      "MMA 2.400 kg, tara 978 kg, carga útil 1.422 kg",
      "Interior de 3,35 × 1,65 × 2,32 m",
      "Suelo integral de aluminio con goma pegada y sellada",
      "Permiso B96 con vehículo de hasta 1.850 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,400 kg gross weight, 978 kg unladen, 1,422 kg payload",
      "Inner space of 3.35 × 1.65 × 2.32 m",
      "Full aluminium floor with bonded and sealed rubber",
      "B96 licence with a vehicle up to 1,850 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "El Comfort es el van de uso corriente de la gama: 3,35 m de largo interior, dos plazas de 82 cm y 1.422 kg de carga útil. Cubre el desplazamiento semanal a clases y concursos con dos caballos de talla media y su equipo. Su altura interior de 2,32 m es superior a la de la gama Duo, lo que conviene a caballos algo más altos.",
        bodyEn: "The Comfort is the range's everyday trailer: 3.35 m of inner length, two 82 cm places and 1,422 kg of payload. It covers the weekly trip to lessons and competitions with two medium horses and their equipment. Its 2.32 m inner height is above the Duo range, which suits slightly taller horses.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Carrocería de poliéster y suelo integral de aluminio, con la goma pegada y sellada en lugar de simplemente apoyada. Ese sellado es lo que impide que los líquidos se filtren entre la goma y el aluminio, donde nadie los ve y donde acaban corroyendo. Es el detalle que separa un suelo que dura del que hay que levantar a los cinco años.",
        bodyEn: "Polyester body and full aluminium floor, with the rubber bonded and sealed rather than merely laid. That seal is what stops liquids seeping between the rubber and the aluminium, where nobody sees them and where they end up corroding. It is the detail separating a floor that lasts from one that has to be lifted after five years.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.400 kg de MMA, el permiso B queda descartado en la práctica: pediría un vehículo de 1.100 kg. Con B96 el conjunto alcanza 4.250 kg y admite un vehículo tractor de hasta 1.850 kg de masa máxima autorizada; con B+E, hasta 3.500 kg. Antes de decidir, mira el apartado F.1 de la ficha técnica de tu coche, que es la cifra que cuenta.",
        bodyEn: "At 2,400 kg gross, a category B licence is ruled out in practice: it would call for a 1,100 kg vehicle. With B96 the combination reaches 4,250 kg and takes a towing vehicle up to 1,850 kg gross; with B+E, up to 3,500 kg. Before deciding, look at section F.1 of your car's registration document, which is the figure that counts.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Separador regulable en altura, suelo integral de aluminio con goma pegada y sellada, carrocería de poliéster. El separador regulable permite ajustar la altura a caballos de alzada distinta, cosa que un separador fijo no ofrece. Las opciones de arcón, ventilación adicional y rueda de repuesto se concretan en el pedido con el plazo del fabricante.",
        bodyEn: "Height-adjustable partition, full aluminium floor with bonded and sealed rubber, polyester body. The adjustable partition allows the height to be set for horses of differing size, which a fixed partition does not offer. Chest, extra ventilation and spare wheel options are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2400,
      taraKg: 978,
      cargaUtilKg: 1422,
      largoInteriorCm: 335,
      anchoInteriorCm: 165,
      altoInteriorCm: 232,
      suelo: "Aluminio integral con goma pegada y sellada",
    },
    sourceRef: `${BOECK}/comfort`,
  },

  // -------------------------------------------------------------- Champion
  {
    slug: "bk-champion-esprit",
    slugExistente: "bockmann-champion-esprit",
    brand: "Böckmann",
    name: "Champion Esprit",
    nameEn: "Champion Esprit",
    sku: "BK-CHE-2",
    shortDescription:
      "Van de dos caballos con suelo integral de aluminio y 1.565 kg de carga útil, la mayor de la gama Champion.",
    shortDescriptionEn:
      "Two-horse trailer with a full aluminium floor and 1,565 kg payload, the highest in the Champion range.",
    bullets: [
      "Dos caballos",
      "MMA 2.400 kg, tara 835 kg, carga útil 1.565 kg",
      "Interior de 3,10 × 1,65 × 2,30 m",
      "Suelo integral de aluminio",
      "Permiso B96 con vehículo de hasta 1.850 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,400 kg gross weight, 835 kg unladen, 1,565 kg payload",
      "Inner space of 3.10 × 1.65 × 2.30 m",
      "Full aluminium floor",
      "B96 licence with a vehicle up to 1,850 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Los 835 kg de tara son el argumento de este modelo: sobre una MMA de 2.400 kg dejan 1.565 kg de carga útil, cien kilos más que el Champion C de idénticas medidas. Ese margen se traduce en tranquilidad al cargar dos caballos pesados con equipo de concurso. Los 1,65 m de ancho reparten dos plazas de 82 cm.",
        bodyEn: "The 835 kg unladen weight is this model's argument: on a 2,400 kg gross weight it leaves 1,565 kg of payload, a hundred kilos more than the identically sized Champion C. That margin turns into peace of mind when loading two heavy horses with competition equipment. The 1.65 m width gives two 82 cm places.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo integral de aluminio, sin revestimiento de goma añadido: es de ahí que viene la diferencia de peso con el Champion C. El aluminio desnudo se limpia con manguera y se seca solo, y no esconde humedad bajo una capa de goma. A cambio, transmite más el frío y el calor exteriores que un suelo revestido, algo a considerar según el clima de tu zona.",
        bodyEn: "Full aluminium floor, with no added rubber covering: that is where the weight difference with the Champion C comes from. Bare aluminium is hosed clean and dries on its own, and hides no damp under a rubber layer. In exchange, it transmits outside cold and heat more than a covered floor, worth considering depending on your local climate.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "La MMA de 2.400 kg deja el permiso B fuera de alcance salvo con un vehículo de 1.100 kg. Con B96 el conjunto llega a 4.250 kg y admite un vehículo de hasta 1.850 kg de masa máxima autorizada; con B+E, hasta 3.500 kg de vehículo. Comprueba además la masa remolcable con freno de tu coche, que figura en el apartado O.1 de su ficha técnica.",
        bodyEn: "The 2,400 kg gross weight puts a category B licence out of reach except with a 1,100 kg vehicle. With B96 the combination reaches 4,250 kg and takes a vehicle up to 1,850 kg gross; with B+E, up to 3,500 kg of vehicle. Also check your car's braked towable mass, shown in section O.1 of its registration document.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Separador central, suelo integral de aluminio y altura interior de 2,30 m, de serie. Si prefieres un suelo revestido de goma con listones, el Champion C ofrece las mismas medidas con esa terminación y cien kilos menos de carga útil. Arcón, ventilación adicional y rueda de repuesto se definen en el pedido con el plazo de fábrica.",
        bodyEn: "Central partition, full aluminium floor and 2.30 m inner height, as standard. If you prefer a battened rubber covering, the Champion C offers the same dimensions with that finish and a hundred kilos less payload. Chest, extra ventilation and spare wheel are settled at order time with the factory lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2400,
      taraKg: 835,
      cargaUtilKg: 1565,
      largoInteriorCm: 310,
      anchoInteriorCm: 165,
      altoInteriorCm: 230,
      suelo: "Aluminio integral",
    },
    sourceRef: `${BOECK}/champion`,
  },

  {
    slug: "bk-champion-c",
    brand: "Böckmann",
    name: "Champion C",
    nameEn: "Champion C",
    sku: "BK-CHC-2",
    shortDescription:
      "Van de dos caballos con goma y listones antideslizantes. MMA de 2.400 kg y 1.464 kg de carga útil.",
    shortDescriptionEn:
      "Two-horse trailer with battened anti-slip rubber. 2,400 kg gross weight and 1,464 kg payload.",
    bullets: [
      "Dos caballos",
      "MMA 2.400 kg, tara 936 kg, carga útil 1.464 kg",
      "Interior de 3,10 × 1,65 × 2,32 m",
      "Goma con listones antideslizantes",
      "Permiso B96 con vehículo de hasta 1.850 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,400 kg gross weight, 936 kg unladen, 1,464 kg payload",
      "Inner space of 3.10 × 1.65 × 2.32 m",
      "Battened anti-slip rubber",
      "B96 licence with a vehicle up to 1,850 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Mismas medidas exteriores que el Champion Esprit, con dos centímetros más de altura interior y el suelo revestido de goma con listones. Esos listones dan un agarre marcado que ayuda a los caballos que dudan al subir la rampa. La carga útil de 1.464 kg cubre dos caballos adultos con su equipo, con cien kilos menos de margen que el Esprit.",
        bodyEn: "Same outer dimensions as the Champion Esprit, with two centimetres more inner height and a floor covered in battened rubber. Those battens give a pronounced grip that helps horses hesitating on the ramp. The 1,464 kg payload covers two adult horses with their equipment, with a hundred kilos less margin than the Esprit.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo revestido de goma con listones antideslizantes, sobre la estructura Champion. La goma amortigua las vibraciones y aísla el casco del suelo, que en pleno verano alcanza temperaturas incómodas. Los 101 kg de tara adicional frente al Esprit son el precio de ese confort, y salen directamente de la carga útil: la elección entre ambos se juega ahí.",
        bodyEn: "Floor covered with battened anti-slip rubber, over the Champion structure. The rubber damps vibration and insulates the hoof from the floor, which reaches uncomfortable temperatures in high summer. The 101 kg of extra unladen weight against the Esprit is the price of that comfort, and comes straight out of the payload: that is where the choice between the two is settled.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.400 kg de MMA, el permiso B exigiría un vehículo tractor de 1.100 kg, cifra que casi ningún coche actual respeta. Con B96 el conjunto llega a 4.250 kg y admite un vehículo de hasta 1.850 kg; con B+E, hasta 3.500 kg de vehículo. El B96 se consigue con un curso y una prueba de circulación, sin examen teórico.",
        bodyEn: "At 2,400 kg gross, a category B licence would require a 1,100 kg towing vehicle, a figure almost no current car meets. With B96 the combination reaches 4,250 kg and takes a vehicle up to 1,850 kg; with B+E, up to 3,500 kg of vehicle. B96 is obtained with a course and a driving test, with no theory exam.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Separador central, suelo con goma y listones antideslizantes, altura interior de 2,32 m. Si buscas el máximo de carga útil con las mismas medidas, el Champion Esprit ofrece cien kilos más con suelo de aluminio desnudo. Arcón, ventilación adicional y rueda de repuesto se concretan en el pedido con el plazo del fabricante.",
        bodyEn: "Central partition, floor with battened anti-slip rubber, 2.32 m inner height. If you want maximum payload at the same dimensions, the Champion Esprit offers a hundred kilos more with a bare aluminium floor. Chest, extra ventilation and spare wheel are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2400,
      taraKg: 936,
      cargaUtilKg: 1464,
      largoInteriorCm: 310,
      anchoInteriorCm: 165,
      altoInteriorCm: 232,
      suelo: "Goma con listones antideslizantes",
    },
    sourceRef: `${BOECK}/champion`,
  },

  {
    slug: "bk-champion-r",
    brand: "Böckmann",
    name: "Champion R",
    nameEn: "Champion R",
    sku: "BK-CHR-2",
    shortDescription:
      "Van de dos caballos con 3,33 m de largo interior y suelo integral de aluminio. MMA de 2.400 kg.",
    shortDescriptionEn:
      "Two-horse trailer with a 3.33 m inner length and full aluminium floor. 2,400 kg gross weight.",
    bullets: [
      "Dos caballos",
      "MMA 2.400 kg, tara 940 kg, carga útil 1.460 kg",
      "Interior de 3,33 × 1,65 × 2,32 m",
      "Suelo integral de aluminio",
      "Permiso B96 con vehículo de hasta 1.850 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,400 kg gross weight, 940 kg unladen, 1,460 kg payload",
      "Inner space of 3.33 × 1.65 × 2.32 m",
      "Full aluminium floor",
      "B96 licence with a vehicle up to 1,850 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Veintitrés centímetros más largo que el Champion Esprit, con la misma anchura. Ese largo suplementario conviene a caballos de cuerpo largo, que en un van de 3,10 m acaban tocando la barra trasera. La carga útil de 1.460 kg sigue cubriendo dos caballos adultos con su equipo, aunque con menos margen que el Esprit.",
        bodyEn: "Twenty-three centimetres longer than the Champion Esprit, with the same width. That extra length suits long-bodied horses, which in a 3.10 m trailer end up touching the rear bar. The 1,460 kg payload still covers two adult horses with their equipment, though with less margin than the Esprit.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo integral de aluminio y altura interior de 2,32 m. Los 105 kg que separan su tara de la del Esprit corresponden al material del mayor largo, no a un acabado distinto: los dos llevan el mismo suelo de aluminio. El aluminio no absorbe humedad, de modo que la tara declarada aquí sigue siendo válida al cabo de diez años.",
        bodyEn: "Full aluminium floor and 2.32 m inner height. The 105 kg separating its unladen weight from the Esprit's correspond to the material of the greater length, not to a different finish: both carry the same aluminium floor. Aluminium does not absorb damp, so the unladen weight declared here still holds after ten years.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Los 2.400 kg de MMA dejan el permiso B fuera de alcance salvo con un vehículo de 1.100 kg. Con B96 el conjunto llega a 4.250 kg y admite un vehículo tractor de hasta 1.850 kg de masa máxima; con B+E, hasta 3.500 kg. Dado el largo de este modelo, conviene comprobar también la distancia entre ejes del vehículo: un remolque largo pide un tractor estable.",
        bodyEn: "The 2,400 kg gross weight puts a category B licence out of reach except with a 1,100 kg vehicle. With B96 the combination reaches 4,250 kg and takes a towing vehicle up to 1,850 kg gross; with B+E, up to 3,500 kg. Given this model's length, it is also worth checking the vehicle's wheelbase: a long trailer calls for a stable tow car.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Separador central, suelo integral de aluminio y altura interior de 2,32 m, de serie. Los 3,33 m de largo son el argumento frente al Esprit y al Champion C, ambos de 3,10 m. Arcón delantero, ventilación adicional, rueda de repuesto y acabado exterior se definen en el pedido con el plazo del fabricante.",
        bodyEn: "Central partition, full aluminium floor and 2.32 m inner height, as standard. The 3.33 m length is the argument against the Esprit and the Champion C, both at 3.10 m. Front chest, extra ventilation, spare wheel and exterior finish are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2400,
      taraKg: 940,
      cargaUtilKg: 1460,
      largoInteriorCm: 333,
      anchoInteriorCm: 165,
      altoInteriorCm: 232,
      suelo: "Aluminio integral",
    },
    sourceRef: `${BOECK}/champion`,
  },

  {
    slug: "bk-big-champion-e",
    brand: "Böckmann",
    name: "Big Champion E",
    nameEn: "Big Champion E",
    sku: "BK-BCE-2",
    shortDescription:
      "Van de dos caballos con 1,75 m de ancho y chasis WCF de suspensión independiente. MMA de 2.400 kg.",
    shortDescriptionEn:
      "Two-horse trailer with a 1.75 m width and WCF independent-suspension chassis. 2,400 kg gross weight.",
    bullets: [
      "Dos caballos",
      "MMA 2.400 kg, tara 1.015 kg, carga útil 1.385 kg",
      "Interior de 3,56 × 1,75 × 2,35 m",
      "Suelo integral de aluminio, chasis WCF",
      "Permiso B96 con vehículo de hasta 1.850 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,400 kg gross weight, 1,015 kg unladen, 1,385 kg payload",
      "Inner space of 3.56 × 1.75 × 2.35 m",
      "Full aluminium floor, WCF chassis",
      "B96 licence with a vehicle up to 1,850 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Los 1,75 m de ancho reparten dos plazas de 87 cm, diez centímetros más por animal que la gama Champion estándar. Para caballos de grupa ancha esa diferencia se nota en cada viaje. La altura de 2,35 m y el largo de 3,56 m completan un habitáculo pensado para animales de alzada alta, con 1.385 kg de carga útil.",
        bodyEn: "The 1.75 m width gives two 87 cm places, ten centimetres more per animal than the standard Champion range. For broad-hindquartered horses that difference tells on every trip. The 2.35 m height and 3.56 m length complete a compartment designed for tall animals, with 1,385 kg of payload.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo integral de aluminio y chasis WCF, que monta suspensión independiente en cada rueda en lugar de un eje rígido. La diferencia se siente en carretera irregular: cada rueda absorbe su propio bache sin transmitirlo a la otra, y el caballo compensa menos con las patas. Sobre trayectos largos, es lo que separa un animal que llega descansado de uno que llega tenso.",
        bodyEn: "Full aluminium floor and WCF chassis, which fits independent suspension at each wheel instead of a rigid axle. The difference is felt on uneven roads: each wheel absorbs its own bump without passing it to the other, and the horse braces less with its legs. Over long journeys, that is what separates an animal arriving rested from one arriving tense.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.400 kg de MMA, el permiso B pediría un vehículo tractor de 1.100 kg. Con B96 el conjunto llega a 4.250 kg y admite un vehículo de hasta 1.850 kg de masa máxima autorizada; con B+E, hasta 3.500 kg de vehículo. Comprueba la masa remolcable con freno de tu coche en el apartado O.1: en remolques anchos, la estabilidad depende tanto del tractor como del propio van.",
        bodyEn: "At 2,400 kg gross, a category B licence would call for a 1,100 kg towing vehicle. With B96 the combination reaches 4,250 kg and takes a vehicle up to 1,850 kg gross; with B+E, up to 3,500 kg of vehicle. Check your car's braked towable mass in section O.1: with wide trailers, stability depends as much on the tow car as on the trailer itself.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Chasis WCF con suspensión independiente, suelo integral de aluminio y separador central, de serie. La variante Big Champion SKA ofrece las mismas medidas con otra configuración de puerta y 18 kg menos de carga útil. Arcón, ventilación adicional y rueda de repuesto se concretan en el pedido con el plazo de fábrica.",
        bodyEn: "WCF chassis with independent suspension, full aluminium floor and central partition, as standard. The Big Champion SKA variant offers the same dimensions with a different door layout and 18 kg less payload. Chest, extra ventilation and spare wheel are settled at order time with the factory lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2400,
      taraKg: 1015,
      cargaUtilKg: 1385,
      largoInteriorCm: 356,
      anchoInteriorCm: 175,
      altoInteriorCm: 235,
      suelo: "Aluminio integral",
    },
    sourceRef: `${BOECK}/champion`,
  },

  {
    slug: "bk-big-champion-ska",
    brand: "Böckmann",
    name: "Big Champion SKA",
    nameEn: "Big Champion SKA",
    sku: "BK-BCS-2",
    shortDescription:
      "Van de dos caballos con salida lateral, 1,75 m de ancho y chasis WCF. MMA de 2.400 kg.",
    shortDescriptionEn:
      "Two-horse trailer with a side exit, 1.75 m width and WCF chassis. 2,400 kg gross weight.",
    bullets: [
      "Dos caballos",
      "MMA 2.400 kg, tara 1.033 kg, carga útil 1.367 kg",
      "Interior de 3,56 × 1,75 × 2,35 m",
      "Suelo integral de aluminio, chasis WCF",
      "Permiso B96 con vehículo de hasta 1.850 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,400 kg gross weight, 1,033 kg unladen, 1,367 kg payload",
      "Inner space of 3.56 × 1.75 × 2.35 m",
      "Full aluminium floor, WCF chassis",
      "B96 licence with a vehicle up to 1,850 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Mismas medidas que el Big Champion E, con otra configuración de acceso. Los 1,75 m de ancho dan dos plazas de 87 cm, holgadas para caballos de grupa ancha, y los 2,35 m de altura convienen a animales de alzada alta. La carga útil de 1.367 kg deja margen para dos caballos adultos con equipo de concurso completo.",
        bodyEn: "Same dimensions as the Big Champion E, with a different access layout. The 1.75 m width gives two 87 cm places, roomy for broad-hindquartered horses, and the 2.35 m height suits tall animals. The 1,367 kg payload leaves margin for two adult horses with full competition equipment.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Chasis WCF de suspensión independiente y suelo integral de aluminio. La suspensión independiente trata cada rueda por separado, lo que reduce el balanceo que el caballo compensa con las patas en carretera irregular. Los 18 kg que separan su tara de la del Big Champion E corresponden a la configuración de acceso, no a la estructura.",
        bodyEn: "WCF independent-suspension chassis and full aluminium floor. Independent suspension treats each wheel separately, reducing the roll a horse braces against with its legs on uneven roads. The 18 kg separating its unladen weight from the Big Champion E's correspond to the access layout, not the structure.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "La MMA de 2.400 kg deja el permiso B fuera de alcance salvo con un vehículo de 1.100 kg. Con B96 el conjunto alcanza 4.250 kg y admite un vehículo de hasta 1.850 kg de masa máxima; con B+E, hasta 3.500 kg de vehículo. Verifica la masa remolcable con freno de tu coche, en el apartado O.1 de su ficha técnica.",
        bodyEn: "The 2,400 kg gross weight puts a category B licence out of reach except with a 1,100 kg vehicle. With B96 the combination reaches 4,250 kg and takes a vehicle up to 1,850 kg gross; with B+E, up to 3,500 kg of vehicle. Check your car's braked towable mass, in section O.1 of its registration document.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Chasis WCF, suelo integral de aluminio y separador central, de serie. La diferencia con el Big Champion E está en la configuración de acceso, que cambia la manera de sacar al animal. Arcón delantero, ventilación adicional, rueda de repuesto y acabado exterior se definen en el pedido con el plazo del fabricante.",
        bodyEn: "WCF chassis, full aluminium floor and central partition, as standard. The difference from the Big Champion E lies in the access layout, which changes how the animal is brought out. Front chest, extra ventilation, spare wheel and exterior finish are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2400,
      taraKg: 1033,
      cargaUtilKg: 1367,
      largoInteriorCm: 356,
      anchoInteriorCm: 175,
      altoInteriorCm: 235,
      suelo: "Aluminio integral",
    },
    sourceRef: `${BOECK}/champion`,
  },

  {
    slug: "bk-champion-kutsche-c",
    brand: "Böckmann",
    name: "Champion Kutsche C",
    nameEn: "Champion Kutsche C",
    sku: "BK-CHK-2",
    shortDescription:
      "Van de dos caballos con espacio para carruaje. MMA de 2.700 kg y 1.630 kg de carga útil.",
    shortDescriptionEn:
      "Two-horse trailer with carriage space. 2,700 kg gross weight and 1,630 kg payload.",
    bullets: [
      "Dos caballos y un carruaje",
      "MMA 2.700 kg, tara 1.070 kg, carga útil 1.630 kg",
      "Interior de 3,05 × 1,65 × 2,30 m",
      "Suelo integral de aluminio",
      "Permiso B96 con vehículo de hasta 1.550 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses and a carriage",
      "2,700 kg gross weight, 1,070 kg unladen, 1,630 kg payload",
      "Inner space of 3.05 × 1.65 × 2.30 m",
      "Full aluminium floor",
      "B96 licence with a vehicle up to 1,550 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Este modelo responde a una necesidad concreta del enganche: llevar los dos caballos y el carruaje en un solo viaje. La MMA sube a 2.700 kg para absorber el peso del vehículo de tiro, y la carga útil de 1.630 kg es la mayor de la gama Champion. Si compites en enganche, es la diferencia entre un desplazamiento y dos.",
        bodyEn: "This model answers a specific need in carriage driving: taking both horses and the carriage in a single trip. The gross weight rises to 2,700 kg to absorb the carriage's weight, and the 1,630 kg payload is the highest in the Champion range. If you compete in driving, it is the difference between one journey and two.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo integral de aluminio y estructura reforzada para los 2.700 kg de MMA. El habitáculo de los caballos mide 3,05 m, algo menos que el Champion estándar, porque el espacio de carruaje ocupa su parte. Conviene medir tu carruaje antes de encargar: es la cota que decide si este modelo te sirve, y no figura en ninguna ficha genérica.",
        bodyEn: "Full aluminium floor and structure reinforced for the 2,700 kg gross weight. The horse compartment measures 3.05 m, slightly less than the standard Champion, because the carriage space takes its share. It is worth measuring your carriage before ordering: that is the dimension deciding whether this model suits you, and it appears on no generic specification.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.700 kg de MMA, el permiso B queda descartado. Con B96 el conjunto llega a 4.250 kg, lo que admite un vehículo tractor de hasta 1.550 kg de masa máxima autorizada — cifra ajustada, que deja fuera a la mayoría de los SUV. Con B+E el vehículo puede llegar a 3.500 kg, y es la opción realista para este modelo.",
        bodyEn: "At 2,700 kg gross, a category B licence is ruled out. With B96 the combination reaches 4,250 kg, allowing a towing vehicle up to 1,550 kg gross — a tight figure that rules out most SUVs. With B+E the vehicle can reach 3,500 kg, and that is the realistic option for this model.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Separador central, suelo integral de aluminio y espacio de carruaje integrado en la estructura, de serie. Los anclajes del carruaje y su disposición se definen según el modelo que transportes: envíanos sus medidas y comprobamos la compatibilidad antes del pedido, con el plazo del fabricante.",
        bodyEn: "Central partition, full aluminium floor and carriage space built into the structure, as standard. The carriage tie-down points and their layout are set according to the carriage you transport: send us its dimensions and we will check compatibility before ordering, with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2700,
      taraKg: 1070,
      cargaUtilKg: 1630,
      largoInteriorCm: 305,
      anchoInteriorCm: 165,
      altoInteriorCm: 230,
      suelo: "Aluminio integral",
    },
    sourceRef: `${BOECK}/champion`,
  },

  // ---------------------------------------------------------------- Master
  {
    slug: "bk-master",
    brand: "Böckmann",
    name: "Master",
    nameEn: "Master",
    sku: "BK-MST-2",
    shortDescription:
      "Van de dos caballos con carrocería de poliéster, chasis WCF y 2,35 m de altura interior. MMA de 2.400 kg.",
    shortDescriptionEn:
      "Two-horse trailer with a polyester body, WCF chassis and 2.35 m inner height. 2,400 kg gross weight.",
    bullets: [
      "Dos caballos",
      "MMA 2.400 kg, tara 1.084 kg, carga útil 1.316 kg",
      "Interior de 3,56 × 1,65 × 2,35 m",
      "Suelo integral de aluminio, chasis WCF",
      "Permiso B96 con vehículo de hasta 1.850 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,400 kg gross weight, 1,084 kg unladen, 1,316 kg payload",
      "Inner space of 3.56 × 1.65 × 2.35 m",
      "Full aluminium floor, WCF chassis",
      "B96 licence with a vehicle up to 1,850 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Los 3,56 m de largo y los 2,35 m de altura hacen de este van uno de los más espaciosos con 1,65 m de ancho. Conviene a caballos largos y altos que en un habitáculo de 3,10 m viajan justos. La carga útil de 1.316 kg cubre dos animales adultos con su equipo, aunque con menos margen que la gama Champion.",
        bodyEn: "The 3.56 m length and 2.35 m height make this one of the roomiest trailers at 1.65 m wide. It suits long, tall horses that travel cramped in a 3.10 m compartment. The 1,316 kg payload covers two adult animals with their equipment, though with less margin than the Champion range.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Carrocería de poliéster integral, suelo de aluminio y chasis WCF de suspensión independiente. El poliéster no se abolla como el aluminio fino ni se satura como el contrachapado, y aísla mejor del calor: en verano, la diferencia de temperatura interior con un van de paredes metálicas es perceptible. Los 1.084 kg de tara son el precio de esa construcción.",
        bodyEn: "Full polyester body, aluminium floor and WCF independent-suspension chassis. Polyester neither dents like thin aluminium nor saturates like plywood, and insulates better against heat: in summer, the difference in inner temperature from a metal-walled trailer is noticeable. The 1,084 kg unladen weight is the price of that build.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.400 kg de MMA, el permiso B pediría un vehículo de 1.100 kg. Con B96 el conjunto llega a 4.250 kg y admite un vehículo tractor de hasta 1.850 kg de masa máxima; con B+E, hasta 3.500 kg. Dado el largo de 3,56 m, conviene además un vehículo con distancia entre ejes generosa: la estabilidad de un remolque largo depende de ello.",
        bodyEn: "At 2,400 kg gross, a category B licence would call for a 1,100 kg vehicle. With B96 the combination reaches 4,250 kg and takes a towing vehicle up to 1,850 kg gross; with B+E, up to 3,500 kg. Given the 3.56 m length, a vehicle with a generous wheelbase is also advisable: a long trailer's stability depends on it.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Carrocería de poliéster, suelo integral de aluminio, chasis WCF y separador central, de serie. Si necesitas más anchura, el Big Master ofrece 1,75 m con la misma MMA. Arcón delantero, ventilación adicional, rueda de repuesto y acabado exterior se concretan en el pedido con el plazo del fabricante.",
        bodyEn: "Polyester body, full aluminium floor, WCF chassis and central partition, as standard. If you need more width, the Big Master offers 1.75 m at the same gross weight. Front chest, extra ventilation, spare wheel and exterior finish are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2400,
      taraKg: 1084,
      cargaUtilKg: 1316,
      largoInteriorCm: 356,
      anchoInteriorCm: 165,
      altoInteriorCm: 235,
      suelo: "Aluminio integral",
    },
    sourceRef: `${BOECK}/master`,
  },

  {
    slug: "bk-big-master",
    brand: "Böckmann",
    name: "Big Master",
    nameEn: "Big Master",
    sku: "BK-BMS-2",
    shortDescription:
      "Van de dos caballos con 3,90 m de largo y 1,75 m de ancho interior. MMA de 2.400 kg.",
    shortDescriptionEn:
      "Two-horse trailer with a 3.90 m length and 1.75 m inner width. 2,400 kg gross weight.",
    bullets: [
      "Dos caballos",
      "MMA 2.400 kg, tara 1.162 kg, carga útil 1.238 kg",
      "Interior de 3,90 × 1,75 × 2,30 m",
      "Suelo integral de aluminio, chasis WCF",
      "Permiso B96 con vehículo de hasta 1.850 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,400 kg gross weight, 1,162 kg unladen, 1,238 kg payload",
      "Inner space of 3.90 × 1.75 × 2.30 m",
      "Full aluminium floor, WCF chassis",
      "B96 licence with a vehicle up to 1,850 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Es el van más largo de la gama Master con MMA de 2.400 kg: 3,90 m de habitáculo y 1,75 m de ancho, que reparten dos plazas de 87 cm. Conviene a caballos grandes que necesitan espacio delante y detrás. La contrapartida está en la carga útil, 1.238 kg, la más ajustada de la gama: con dos animales de 600 kg quedan 38 kg para el equipo.",
        bodyEn: "This is the longest trailer in the Master range at 2,400 kg gross: a 3.90 m compartment and 1.75 m width, giving two 87 cm places. It suits large horses needing room fore and aft. The counterpart is the payload, 1,238 kg, the tightest in the range: with two 600 kg animals, 38 kg remain for equipment.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Carrocería de poliéster, suelo integral de aluminio y chasis WCF de suspensión independiente. Los 1.162 kg de tara son la consecuencia directa del tamaño: un habitáculo de 3,90 por 1,75 m exige una estructura que lo sostenga. Si necesitas este volumen con más carga útil, la gama Grand Master sube la MMA a 2.700 kg y libera trescientos kilos.",
        bodyEn: "Polyester body, full aluminium floor and WCF independent-suspension chassis. The 1,162 kg unladen weight is a direct consequence of the size: a compartment of 3.90 by 1.75 m demands a structure to hold it. If you need this volume with more payload, the Grand Master range raises the gross weight to 2,700 kg and frees three hundred kilos.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.400 kg de MMA, el permiso B exigiría un vehículo de 1.100 kg. Con B96 el conjunto llega a 4.250 kg y admite un vehículo de hasta 1.850 kg de masa máxima autorizada; con B+E, hasta 3.500 kg de vehículo. Con 3,90 m de habitáculo, la distancia entre ejes del tractor pesa tanto como su masa: un todoterreno largo se comporta mejor que un SUV corto.",
        bodyEn: "At 2,400 kg gross, a category B licence would require a 1,100 kg vehicle. With B96 the combination reaches 4,250 kg and takes a vehicle up to 1,850 kg gross; with B+E, up to 3,500 kg of vehicle. With a 3.90 m compartment, the tow car's wheelbase counts as much as its mass: a long 4x4 behaves better than a short SUV.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Carrocería de poliéster, suelo integral de aluminio, chasis WCF y separador central, de serie. Antes de decidir, haz la cuenta de la carga útil con tus dos caballos pesados: 1.238 kg es un margen ajustado, y el Grand Master SKA ofrece las mismas medidas con 1.541 kg. Las opciones se concretan en el pedido con el plazo de fábrica.",
        bodyEn: "Polyester body, full aluminium floor, WCF chassis and central partition, as standard. Before deciding, do the payload sum with your two heavy horses: 1,238 kg is a tight margin, and the Grand Master SKA offers the same dimensions with 1,541 kg. Options are settled at order time with the factory lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2400,
      taraKg: 1162,
      cargaUtilKg: 1238,
      largoInteriorCm: 390,
      anchoInteriorCm: 175,
      altoInteriorCm: 230,
      suelo: "Aluminio integral",
    },
    sourceRef: `${BOECK}/master`,
  },

  {
    slug: "bk-grand-master-ska",
    brand: "Böckmann",
    name: "Grand Master SKA",
    nameEn: "Grand Master SKA",
    sku: "BK-GMS-2",
    shortDescription:
      "Van de dos caballos con 2.700 kg de MMA y 1.541 kg de carga útil, la mayor de la gama Master.",
    shortDescriptionEn:
      "Two-horse trailer with a 2,700 kg gross weight and 1,541 kg payload, the highest in the Master range.",
    bullets: [
      "Dos caballos",
      "MMA 2.700 kg, tara 1.159 kg, carga útil 1.541 kg",
      "Interior de 3,90 × 1,75 × 2,30 m",
      "Chasis WCF de suspensión independiente",
      "Permiso B96 con vehículo de hasta 1.550 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,700 kg gross weight, 1,159 kg unladen, 1,541 kg payload",
      "Inner space of 3.90 × 1.75 × 2.30 m",
      "WCF independent-suspension chassis",
      "B96 licence with a vehicle up to 1,550 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Mismas medidas que el Big Master, con la MMA elevada a 2.700 kg. Ese cambio libera trescientos kilos de carga útil, que pasan de 1.238 a 1.541 kg. Es la respuesta a quien necesita el volumen del Big Master pero transporta dos caballos pesados con equipo completo, situación en la que el modelo de 2.400 kg deja demasiado poco margen.",
        bodyEn: "Same dimensions as the Big Master, with the gross weight raised to 2,700 kg. That change frees three hundred kilos of payload, rising from 1,238 to 1,541 kg. It answers anyone needing the Big Master's volume but carrying two heavy horses with full equipment, where the 2,400 kg model leaves too little margin.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Chasis WCF con suspensión independiente en cada rueda y carrocería de poliéster integral. La suspensión independiente reduce el balanceo que el caballo compensa con las patas, y su efecto se nota sobre todo en trayectos largos por carretera secundaria. La estructura está dimensionada para los 2.700 kg de MMA, con solo 1.159 kg de tara.",
        bodyEn: "WCF chassis with independent suspension at each wheel and full polyester body. Independent suspension reduces the roll a horse braces against with its legs, and its effect tells most on long trips over secondary roads. The structure is sized for the 2,700 kg gross weight, with only 1,159 kg unladen.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Los 2.700 kg de MMA dejan el permiso B fuera de alcance. Con B96 el conjunto llega a 4.250 kg, lo que admite un vehículo tractor de hasta 1.550 kg de masa máxima autorizada — cifra que deja fuera a casi todos los SUV. Con B+E el vehículo puede llegar a 3.500 kg, y es la opción realista para este modelo.",
        bodyEn: "The 2,700 kg gross weight puts a category B licence out of reach. With B96 the combination reaches 4,250 kg, allowing a towing vehicle up to 1,550 kg gross — a figure that rules out almost every SUV. With B+E the vehicle can reach 3,500 kg, and that is the realistic option for this model.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Chasis WCF, carrocería de poliéster y separador central, de serie. La variante Grand Master SR ofrece las mismas medidas con otra configuración y 79 kg menos de carga útil. Arcón delantero, ventilación adicional, rueda de repuesto y acabado exterior se definen en el pedido con el plazo del fabricante.",
        bodyEn: "WCF chassis, polyester body and central partition, as standard. The Grand Master SR variant offers the same dimensions with a different layout and 79 kg less payload. Front chest, extra ventilation, spare wheel and exterior finish are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2700,
      taraKg: 1159,
      cargaUtilKg: 1541,
      largoInteriorCm: 390,
      anchoInteriorCm: 175,
      altoInteriorCm: 230,
    },
    sourceRef: `${BOECK}/master`,
  },

  {
    slug: "bk-grand-master-sr",
    brand: "Böckmann",
    name: "Grand Master SR",
    nameEn: "Grand Master SR",
    sku: "BK-GMR-2",
    shortDescription:
      "Van de dos caballos con 2.700 kg de MMA y 1.462 kg de carga útil. Mismas medidas que el Grand Master SKA.",
    shortDescriptionEn:
      "Two-horse trailer with a 2,700 kg gross weight and 1,462 kg payload. Same dimensions as the Grand Master SKA.",
    bullets: [
      "Dos caballos",
      "MMA 2.700 kg, tara 1.238 kg, carga útil 1.462 kg",
      "Interior de 3,90 × 1,75 × 2,30 m",
      "Chasis WCF de suspensión independiente",
      "Permiso B96 con vehículo de hasta 1.550 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,700 kg gross weight, 1,238 kg unladen, 1,462 kg payload",
      "Inner space of 3.90 × 1.75 × 2.30 m",
      "WCF independent-suspension chassis",
      "B96 licence with a vehicle up to 1,550 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Comparte medidas y MMA con el Grand Master SKA, del que se separa por la configuración: 79 kg más de tara y otra disposición de acceso. La carga útil de 1.462 kg sigue siendo holgada para dos caballos pesados con equipo. La elección entre los dos se hace sobre la manera de sacar al animal, no sobre el espacio, que es idéntico.",
        bodyEn: "It shares dimensions and gross weight with the Grand Master SKA, differing in layout: 79 kg more unladen and a different access arrangement. The 1,462 kg payload remains ample for two heavy horses with equipment. The choice between the two rests on how the animal is brought out, not on space, which is identical.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Chasis WCF de suspensión independiente y carrocería de poliéster integral, dimensionados para 2.700 kg. El poliéster aísla del calor mejor que un panel metálico, ventaja que cuenta en los veranos peninsulares, y no se abolla en los roces de maniobra. Los 1.238 kg de tara son el precio de esa robustez sobre un habitáculo de casi cuatro metros.",
        bodyEn: "WCF independent-suspension chassis and full polyester body, sized for 2,700 kg. Polyester insulates against heat better than a metal panel, an advantage that counts in mainland summers, and does not dent in manoeuvring knocks. The 1,238 kg unladen weight is the price of that sturdiness over a compartment of nearly four metres.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.700 kg de MMA, el permiso B queda descartado y el B96 solo admite un vehículo tractor de 1.550 kg como máximo, cifra que deja fuera a casi todos los SUV. El B+E, que permite hasta 3.500 kg de vehículo, es la opción realista. Comprueba también la masa remolcable con freno de tu coche en el apartado O.1 de su ficha técnica.",
        bodyEn: "At 2,700 kg gross, a category B licence is ruled out and B96 only allows a towing vehicle of 1,550 kg at most, a figure that rules out almost every SUV. B+E, which permits up to 3,500 kg of vehicle, is the realistic option. Also check your car's braked towable mass in section O.1 of its registration document.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Chasis WCF, carrocería de poliéster y separador central, de serie. Si buscas el máximo de carga útil con estas medidas, el Grand Master SKA ofrece 79 kg más. Arcón delantero, ventilación adicional, rueda de repuesto y acabado exterior se concretan en el pedido con el plazo del fabricante: cuéntanos tu uso y te preparamos el presupuesto.",
        bodyEn: "WCF chassis, polyester body and central partition, as standard. If you want maximum payload at these dimensions, the Grand Master SKA offers 79 kg more. Front chest, extra ventilation, spare wheel and exterior finish are settled at order time with the manufacturer's lead time: tell us your use and we will prepare the quote.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2700,
      taraKg: 1238,
      cargaUtilKg: 1462,
      largoInteriorCm: 390,
      anchoInteriorCm: 175,
      altoInteriorCm: 230,
    },
    sourceRef: `${BOECK}/master`,
  },

  // ---------------------------------------------------------------- Portax
  //
  // REGROUPEMENTS. Certaines variantes ont des caractéristiques rigoureusement
  // identiques et ne diffèrent que par la configuration d'accès : Portax E et
  // Portax SKA d'un côté, Portax L K et Portax L SR de l'autre. Deux fiches
  // portant les mêmes chiffres seraient du contenu dupliqué, que Merchant
  // sanctionne et que le lecteur ne sait pas départager. Elles partagent donc
  // une fiche, qui nomme les deux configurations.
  {
    slug: "bk-portax-esprit",
    brand: "Böckmann",
    name: "Portax Esprit",
    nameEn: "Portax Esprit",
    sku: "BK-PXE-2",
    shortDescription:
      "Van de dos caballos con suelo integral de aluminio y 1.557 kg de carga útil. MMA de 2.400 kg.",
    shortDescriptionEn:
      "Two-horse trailer with a full aluminium floor and 1,557 kg payload. 2,400 kg gross weight.",
    bullets: [
      "Dos caballos",
      "MMA 2.400 kg, tara 843 kg, carga útil 1.557 kg",
      "Interior de 3,27 × 1,65 × 2,30 m",
      "Suelo integral de aluminio",
      "Permiso B96 con vehículo de hasta 1.850 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,400 kg gross weight, 843 kg unladen, 1,557 kg payload",
      "Inner space of 3.27 × 1.65 × 2.30 m",
      "Full aluminium floor",
      "B96 licence with a vehicle up to 1,850 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Con 843 kg de tara sobre 2.400 de MMA, este van deja 1.557 kg de carga útil: es el Portax más ligero y el que más peso admite. Los 3,27 m de largo y 1,65 de ancho reparten dos plazas de 82 cm, medida corriente para caballos de talla media. Un buen compromiso para quien se desplaza cada semana sin necesitar el volumen de la serie L.",
        bodyEn: "With 843 kg unladen on 2,400 kg gross, this trailer leaves 1,557 kg of payload: it is the lightest Portax and the one that carries the most weight. The 3.27 m length and 1.65 m width give two 82 cm places, a common measure for medium horses. A sound compromise for weekly travel without needing the L series' volume.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo integral de aluminio y carrocería de la misma familia que el resto de la gama Portax, cuyo chasis se rediseñó por completo en la última generación. El aluminio del suelo no absorbe humedad, de modo que los 843 kg declarados siguen siendo válidos años después: un suelo de madera saturado gana peso y lo resta a la carga útil sin que nadie lo note.",
        bodyEn: "Full aluminium floor and a body from the same family as the rest of the Portax range, whose chassis was completely redesigned in the latest generation. The aluminium floor absorbs no damp, so the 843 kg declared still holds years later: a saturated wooden floor gains weight and takes it from the payload without anyone noticing.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Los 2.400 kg de MMA dejan el permiso B fuera de alcance salvo con un vehículo de 1.100 kg, cifra que casi ningún coche actual respeta. Con B96 el conjunto llega a 4.250 kg y admite un vehículo tractor de hasta 1.850 kg de masa máxima autorizada; con B+E, hasta 3.500 kg. El B96 se obtiene con un curso y una prueba de circulación, sin examen teórico.",
        bodyEn: "The 2,400 kg gross weight puts a category B licence out of reach except with a 1,100 kg vehicle, a figure almost no current car meets. With B96 the combination reaches 4,250 kg and takes a towing vehicle up to 1,850 kg gross; with B+E, up to 3,500 kg. B96 is obtained with a course and a driving test, with no theory exam.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Separador central y suelo integral de aluminio, de serie. Si necesitas más anchura, las variantes Portax E, SKA y K suben a 1,75 m con veintinueve centímetros más de largo. Arcón delantero, ventilación adicional, rueda de repuesto y acabado exterior se concretan en el pedido con el plazo del fabricante.",
        bodyEn: "Central partition and full aluminium floor, as standard. If you need more width, the Portax E, SKA and K variants rise to 1.75 m with twenty-nine centimetres more length. Front chest, extra ventilation, spare wheel and exterior finish are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2400,
      taraKg: 843,
      cargaUtilKg: 1557,
      largoInteriorCm: 327,
      anchoInteriorCm: 165,
      altoInteriorCm: 230,
      suelo: "Aluminio integral",
    },
    sourceRef: `${BOECK}/portax`,
  },

  {
    slug: "bk-portax-e-ska",
    brand: "Böckmann",
    name: "Portax E y SKA",
    nameEn: "Portax E and SKA",
    sku: "BK-PXES-2",
    shortDescription:
      "Van de dos caballos con 1,75 m de ancho, en dos configuraciones de acceso. MMA de 2.400 kg y 1.300 kg de carga útil.",
    shortDescriptionEn:
      "Two-horse trailer 1.75 m wide, in two access configurations. 2,400 kg gross weight and 1,300 kg payload.",
    bullets: [
      "Dos caballos",
      "MMA 2.400 kg, tara 1.100 kg, carga útil 1.300 kg",
      "Interior de 3,56 × 1,75 × 2,35 m",
      "Dos configuraciones de acceso: E y SKA con salida lateral",
      "Permiso B96 con vehículo de hasta 1.850 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,400 kg gross weight, 1,100 kg unladen, 1,300 kg payload",
      "Inner space of 3.56 × 1.75 × 2.35 m",
      "Two access configurations: E, and SKA with side exit",
      "B96 licence with a vehicle up to 1,850 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Los 1,75 m de ancho reparten dos plazas de 87 cm, diez centímetros más por animal que un Portax Esprit. Con 3,56 m de largo y 2,35 de altura, el habitáculo conviene a caballos de alzada alta y grupa ancha. Las configuraciones E y SKA comparten estas medidas y esta carga útil de 1.300 kg; se diferencian en la manera de sacar al animal.",
        bodyEn: "The 1.75 m width gives two 87 cm places, ten centimetres more per animal than a Portax Esprit. At 3.56 m long and 2.35 high, the compartment suits tall, broad-hindquartered horses. The E and SKA configurations share these dimensions and this 1,300 kg payload; they differ in how the animal is brought out.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Chasis Portax de última generación, con suspensión independiente. La suspensión independiente trata cada rueda por separado: en carretera irregular, el bache de un lado no se transmite al otro, y el caballo compensa menos con las patas. Sobre trayectos largos, es la diferencia entre un animal que llega descansado y uno que llega tenso.",
        bodyEn: "Latest-generation Portax chassis, with independent suspension. Independent suspension treats each wheel separately: on uneven roads, a bump on one side is not passed to the other, and the horse braces less with its legs. Over long journeys, that is the difference between an animal arriving rested and one arriving tense.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.400 kg de MMA, el permiso B pediría un vehículo tractor de 1.100 kg. Con B96 el conjunto alcanza 4.250 kg y admite un vehículo de hasta 1.850 kg de masa máxima autorizada; con B+E, hasta 3.500 kg de vehículo. Comprueba también la masa remolcable con freno de tu coche, en el apartado O.1 de su ficha técnica.",
        bodyEn: "At 2,400 kg gross, a category B licence would call for a 1,100 kg towing vehicle. With B96 the combination reaches 4,250 kg and takes a vehicle up to 1,850 kg gross; with B+E, up to 3,500 kg of vehicle. Also check your car's braked towable mass, in section O.1 of its registration document.",
      },
      {
        heading: "Configuraciones y equipamiento",
        headingEn: "Configurations and equipment",
        body: "Dos configuraciones con idénticas medidas y carga útil. La SKA incorpora salida lateral, que permite sacar al caballo sin hacerlo retroceder por la rampa, cosa que agradecen los animales que se ponen nerviosos al no ver dónde pisan. La E prescinde de ella y simplifica la carrocería. Dinos cuál te conviene y te preparamos el presupuesto con el plazo de fábrica.",
        bodyEn: "Two configurations with identical dimensions and payload. The SKA adds a side exit, which lets the horse leave without backing down the ramp, something animals that get nervous when they cannot see their footing appreciate. The E does without it and simplifies the body. Tell us which suits you and we will prepare the quote with the factory lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2400,
      taraKg: 1100,
      cargaUtilKg: 1300,
      largoInteriorCm: 356,
      anchoInteriorCm: 175,
      altoInteriorCm: 235,
    },
    sourceRef: `${BOECK}/portax`,
  },

  {
    slug: "bk-portax-k",
    slugExistente: "bockmann-portax-k",
    brand: "Böckmann",
    name: "Portax K",
    nameEn: "Portax K",
    sku: "BK-PXK-2",
    shortDescription:
      "Van de dos caballos con 1,75 m de ancho y configuración K. MMA de 2.400 kg y 1.265 kg de carga útil.",
    shortDescriptionEn:
      "Two-horse trailer 1.75 m wide in the K configuration. 2,400 kg gross weight and 1,265 kg payload.",
    bullets: [
      "Dos caballos",
      "MMA 2.400 kg, tara 1.135 kg, carga útil 1.265 kg",
      "Interior de 3,56 × 1,75 × 2,35 m",
      "Chasis Portax de suspensión independiente",
      "Permiso B96 con vehículo de hasta 1.850 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,400 kg gross weight, 1,135 kg unladen, 1,265 kg payload",
      "Inner space of 3.56 × 1.75 × 2.35 m",
      "Portax independent-suspension chassis",
      "B96 licence with a vehicle up to 1,850 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Mismas medidas interiores que las configuraciones E y SKA: 3,56 m de largo, 1,75 de ancho y 2,35 de alto, con dos plazas de 87 cm. La configuración K añade 35 kg de tara, que se descuentan de la carga útil y la dejan en 1.265 kg. Sigue siendo suficiente para dos caballos adultos de talla media con su equipo de concurso.",
        bodyEn: "Same inner dimensions as the E and SKA configurations: 3.56 m long, 1.75 wide and 2.35 high, with two 87 cm places. The K configuration adds 35 kg of unladen weight, which comes off the payload and leaves it at 1,265 kg. That remains enough for two adult medium horses with their competition equipment.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Chasis Portax de última generación con suspensión independiente, rediseñado por completo respecto a la serie anterior. La suspensión independiente absorbe los baches rueda a rueda y reduce el balanceo lateral, que es lo que obliga al caballo a corregir constantemente con las patas. En trayectos de más de una hora, la diferencia se ve al descargar.",
        bodyEn: "Latest-generation Portax chassis with independent suspension, completely redesigned from the previous series. Independent suspension absorbs bumps wheel by wheel and reduces the lateral roll that forces a horse to correct constantly with its legs. On journeys over an hour, the difference shows at unloading.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "La MMA de 2.400 kg deja el permiso B fuera de alcance salvo con un vehículo de 1.100 kg. Con B96 el conjunto llega a 4.250 kg y admite un vehículo tractor de hasta 1.850 kg de masa máxima; con B+E, hasta 3.500 kg de vehículo. Antes de decidir, mira el apartado F.1 de la ficha técnica de tu coche: es la cifra que cuenta, no el peso en vacío.",
        bodyEn: "The 2,400 kg gross weight puts a category B licence out of reach except with a 1,100 kg vehicle. With B96 the combination reaches 4,250 kg and takes a towing vehicle up to 1,850 kg gross; with B+E, up to 3,500 kg of vehicle. Before deciding, look at section F.1 of your car's registration document: that is the figure that counts, not the kerb weight.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Separador central y chasis de suspensión independiente, de serie. Si buscas la máxima carga útil con estas mismas medidas, las configuraciones E y SKA ofrecen 35 kg más. Arcón delantero, ventilación adicional, rueda de repuesto y acabado exterior se definen en el pedido con el plazo del fabricante.",
        bodyEn: "Central partition and independent-suspension chassis, as standard. If you want maximum payload at these same dimensions, the E and SKA configurations offer 35 kg more. Front chest, extra ventilation, spare wheel and exterior finish are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2400,
      taraKg: 1135,
      cargaUtilKg: 1265,
      largoInteriorCm: 356,
      anchoInteriorCm: 175,
      altoInteriorCm: 235,
    },
    sourceRef: `${BOECK}/portax`,
  },

  {
    slug: "bk-portax-l-e",
    brand: "Böckmann",
    name: "Portax L E",
    nameEn: "Portax L E",
    sku: "BK-PXLE-2",
    shortDescription:
      "Van de dos caballos con 4,19 m de largo interior y MMA de 2.700 kg. Carga útil de 1.470 kg.",
    shortDescriptionEn:
      "Two-horse trailer with a 4.19 m inner length and 2,700 kg gross weight. 1,470 kg payload.",
    bullets: [
      "Dos caballos",
      "MMA 2.700 kg, tara 1.230 kg, carga útil 1.470 kg",
      "Interior de 4,19 × 1,75 × 2,35 m",
      "Chasis Portax de suspensión independiente",
      "Permiso B96 con vehículo de hasta 1.550 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,700 kg gross weight, 1,230 kg unladen, 1,470 kg payload",
      "Inner space of 4.19 × 1.75 × 2.35 m",
      "Portax independent-suspension chassis",
      "B96 licence with a vehicle up to 1,550 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "La serie L alarga el habitáculo hasta 4,19 m, sesenta y tres centímetros más que un Portax estándar, y sube la MMA a 2.700 kg para acompañar ese volumen. El resultado son 1.470 kg de carga útil con dos plazas de 87 cm y 2,35 m de altura: espacio de sobra para dos caballos grandes que viajan juntos con frecuencia.",
        bodyEn: "The L series stretches the compartment to 4.19 m, sixty-three centimetres more than a standard Portax, and raises the gross weight to 2,700 kg to match that volume. The result is 1,470 kg of payload with two 87 cm places and 2.35 m of height: ample room for two large horses that travel together often.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Chasis Portax con suspensión independiente, dimensionado para los 2.700 kg de MMA. Los 1.230 kg de tara son la consecuencia de un habitáculo de más de cuatro metros: sostener ese volumen con dos caballos en movimiento exige una estructura en consecuencia. La suspensión independiente compensa en parte la inercia que gana un remolque largo.",
        bodyEn: "Portax chassis with independent suspension, sized for the 2,700 kg gross weight. The 1,230 kg unladen weight is the consequence of a compartment over four metres long: holding that volume with two moving horses demands a structure to match. Independent suspension partly offsets the inertia a long trailer gains.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.700 kg de MMA, el permiso B queda descartado y el B96 solo admite un vehículo tractor de 1.550 kg como máximo, cifra que deja fuera a casi todos los SUV. El B+E, que permite hasta 3.500 kg de vehículo, es la opción realista. Con 4,19 m de habitáculo, conviene además un tractor de distancia entre ejes generosa: la estabilidad depende tanto de eso como de la masa.",
        bodyEn: "At 2,700 kg gross, a category B licence is ruled out and B96 only allows a towing vehicle of 1,550 kg at most, a figure that rules out almost every SUV. B+E, permitting up to 3,500 kg of vehicle, is the realistic option. With a 4.19 m compartment, a tow car with a generous wheelbase is also advisable: stability depends on that as much as on mass.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Separador central y chasis de suspensión independiente, de serie. Las variantes L SKA, con salida lateral, y L K y L SR, con otras configuraciones de acceso, comparten estas medidas con cargas útiles ligeramente distintas. Arcón, ventilación adicional y rueda de repuesto se concretan en el pedido con el plazo del fabricante.",
        bodyEn: "Central partition and independent-suspension chassis, as standard. The L SKA variant, with a side exit, and the L K and L SR with other access layouts, share these dimensions with slightly different payloads. Chest, extra ventilation and spare wheel are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2700,
      taraKg: 1230,
      cargaUtilKg: 1470,
      largoInteriorCm: 419,
      anchoInteriorCm: 175,
      altoInteriorCm: 235,
    },
    sourceRef: `${BOECK}/portax`,
  },

  {
    slug: "bk-portax-l-ska",
    brand: "Böckmann",
    name: "Portax L SKA",
    nameEn: "Portax L SKA",
    sku: "BK-PXLS-2",
    shortDescription:
      "Van de dos caballos con salida lateral y 4,19 m de largo interior. MMA de 2.700 kg y 1.480 kg de carga útil.",
    shortDescriptionEn:
      "Two-horse trailer with a side exit and 4.19 m inner length. 2,700 kg gross weight and 1,480 kg payload.",
    bullets: [
      "Dos caballos",
      "MMA 2.700 kg, tara 1.220 kg, carga útil 1.480 kg",
      "Interior de 4,19 × 1,75 × 2,35 m",
      "Salida lateral, chasis de suspensión independiente",
      "Permiso B96 con vehículo de hasta 1.550 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,700 kg gross weight, 1,220 kg unladen, 1,480 kg payload",
      "Inner space of 4.19 × 1.75 × 2.35 m",
      "Side exit, independent-suspension chassis",
      "B96 licence with a vehicle up to 1,550 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Es la variante de la serie L con más carga útil, 1.480 kg, y la que incorpora salida lateral. Los 4,19 m de largo y las plazas de 87 cm convienen a dos caballos grandes. La salida lateral cambia la rutina de descarga: el animal sale caminando hacia el costado en lugar de retroceder por una rampa que no ve.",
        bodyEn: "This is the L series variant with the most payload, 1,480 kg, and the one that adds a side exit. The 4.19 m length and 87 cm places suit two large horses. The side exit changes the unloading routine: the animal walks out sideways instead of backing down a ramp it cannot see.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Chasis Portax de suspensión independiente sobre un habitáculo de más de cuatro metros. Los 1.220 kg de tara son diez kilos menos que la variante L E, diferencia que viene de la configuración de carrocería. La suspensión independiente absorbe cada bache por separado, lo que reduce el balanceo que un remolque largo amplifica.",
        bodyEn: "Portax independent-suspension chassis over a compartment more than four metres long. The 1,220 kg unladen weight is ten kilos less than the L E variant, a difference coming from the body configuration. Independent suspension absorbs each bump separately, reducing the roll a long trailer amplifies.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Los 2.700 kg de MMA descartan el permiso B, y el B96 solo admite un vehículo de 1.550 kg como máximo. En la práctica, este van pide B+E, que permite un vehículo tractor de hasta 3.500 kg de masa máxima autorizada. Verifica además la masa remolcable con freno de tu coche, que figura en el apartado O.1 y a veces es más restrictiva que el propio permiso.",
        bodyEn: "The 2,700 kg gross weight rules out a category B licence, and B96 only allows a vehicle of 1,550 kg at most. In practice this trailer calls for B+E, which permits a towing vehicle up to 3,500 kg gross. Also check your car's braked towable mass, shown in section O.1 and sometimes stricter than the licence itself.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Salida lateral, separador central y chasis de suspensión independiente, de serie. Si la salida lateral no te hace falta, la variante L E ofrece las mismas medidas con diez kilos menos de carga útil y una carrocería más simple. Arcón, ventilación adicional y rueda de repuesto se definen en el pedido con el plazo de fábrica.",
        bodyEn: "Side exit, central partition and independent-suspension chassis, as standard. If you do not need the side exit, the L E variant offers the same dimensions with ten kilos less payload and a simpler body. Chest, extra ventilation and spare wheel are settled at order time with the factory lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2700,
      taraKg: 1220,
      cargaUtilKg: 1480,
      largoInteriorCm: 419,
      anchoInteriorCm: 175,
      altoInteriorCm: 235,
    },
    sourceRef: `${BOECK}/portax`,
  },

  {
    slug: "bk-portax-l-k-sr",
    brand: "Böckmann",
    name: "Portax L K y L SR",
    nameEn: "Portax L K and L SR",
    sku: "BK-PXLK-2",
    shortDescription:
      "Van de dos caballos de 4,19 m, en dos configuraciones. MMA de 2.700 kg y 1.415 kg de carga útil.",
    shortDescriptionEn:
      "Two-horse trailer of 4.19 m, in two configurations. 2,700 kg gross weight and 1,415 kg payload.",
    bullets: [
      "Dos caballos",
      "MMA 2.700 kg, tara 1.285 kg, carga útil 1.415 kg",
      "Interior de 4,19 × 1,75 × 2,35 m",
      "Dos configuraciones: K, y SR con espacio de sillas",
      "Permiso B96 con vehículo de hasta 1.550 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,700 kg gross weight, 1,285 kg unladen, 1,415 kg payload",
      "Inner space of 4.19 × 1.75 × 2.35 m",
      "Two configurations: K, and SR with tack space",
      "B96 licence with a vehicle up to 1,550 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Dos configuraciones de la serie L que comparten medidas, masas y carga útil: 4,19 m de largo, dos plazas de 87 cm y 1.415 kg disponibles. La diferencia está en la disposición interior, no en el espacio para los animales. Ambas convienen a quien transporta dos caballos grandes y necesita el volumen de la serie larga.",
        bodyEn: "Two L series configurations sharing dimensions, weights and payload: 4.19 m long, two 87 cm places and 1,415 kg available. The difference lies in the interior layout, not in the space for the animals. Both suit anyone carrying two large horses who needs the long series' volume.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Chasis Portax de suspensión independiente, dimensionado para 2.700 kg. Los 1.285 kg de tara son los más altos de la serie L, consecuencia de los elementos que ambas configuraciones incorporan de fábrica. La suspensión independiente sigue siendo la clave del comportamiento en ruta: absorbe cada irregularidad rueda a rueda en lugar de transmitirla al conjunto.",
        bodyEn: "Portax independent-suspension chassis, sized for 2,700 kg. The 1,285 kg unladen weight is the highest in the L series, a consequence of the items both configurations carry from the factory. Independent suspension remains the key to road behaviour: it absorbs each irregularity wheel by wheel instead of passing it to the whole.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.700 kg de MMA, el permiso B queda descartado y el B96 solo admite un vehículo de hasta 1.550 kg de masa máxima autorizada. El B+E, con un vehículo de hasta 3.500 kg, es la vía realista. Dado el largo de 4,19 m, comprueba también la distancia entre ejes de tu vehículo: en remolques largos pesa tanto como la masa remolcable.",
        bodyEn: "At 2,700 kg gross, a category B licence is ruled out and B96 only allows a vehicle up to 1,550 kg gross. B+E, with a vehicle up to 3,500 kg, is the realistic route. Given the 4.19 m length, also check your vehicle's wheelbase: on long trailers it counts as much as the towable mass.",
      },
      {
        heading: "Configuraciones y equipamiento",
        headingEn: "Configurations and equipment",
        body: "Dos configuraciones con idénticas medidas y carga útil. La SR incorpora espacio para sillas y equipo, útil en concursos de varios días donde el material viaja con los caballos. La K organiza el interior de otro modo. Cuéntanos cómo te desplazas y te decimos cuál te conviene, con el presupuesto y el plazo del fabricante.",
        bodyEn: "Two configurations with identical dimensions and payload. The SR adds space for saddles and equipment, useful at multi-day competitions where the gear travels with the horses. The K organises the interior differently. Tell us how you travel and we will say which suits you, with the quote and the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2700,
      taraKg: 1285,
      cargaUtilKg: 1415,
      largoInteriorCm: 419,
      anchoInteriorCm: 175,
      altoInteriorCm: 235,
    },
    sourceRef: `${BOECK}/portax`,
  },

  {
    slug: "bk-big-portax",
    brand: "Böckmann",
    name: "Big Portax",
    nameEn: "Big Portax",
    sku: "BK-BPX-2",
    shortDescription:
      "Van de dos caballos con 1,85 m de ancho y 2,40 m de altura interior, el más amplio de la gama Portax.",
    shortDescriptionEn:
      "Two-horse trailer with a 1.85 m width and 2.40 m inner height, the roomiest in the Portax range.",
    bullets: [
      "Dos caballos",
      "MMA 2.700 kg, tara 1.330 kg, carga útil 1.370 kg",
      "Interior de 4,15 × 1,85 × 2,40 m",
      "Chasis WCF de suspensión independiente",
      "Permiso B96 con vehículo de hasta 1.550 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,700 kg gross weight, 1,330 kg unladen, 1,370 kg payload",
      "Inner space of 4.15 × 1.85 × 2.40 m",
      "WCF independent-suspension chassis",
      "B96 licence with a vehicle up to 1,550 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Con 1,85 m de ancho, este van reparte dos plazas de 92 cm, las más holgadas de la gama Portax, y sube la altura interior a 2,40 m. Es el modelo para caballos de gran alzada y grupa ancha, esos que en un van de 1,65 m viajan con las patas juntas. La carga útil de 1.370 kg cubre dos animales pesados, aunque con menos margen que la serie L.",
        bodyEn: "At 1.85 m wide, this trailer gives two 92 cm places, the roomiest in the Portax range, and raises the inner height to 2.40 m. It is the model for tall, broad-hindquartered horses, the ones that travel with their legs together in a 1.65 m trailer. The 1,370 kg payload covers two heavy animals, though with less margin than the L series.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Chasis WCF con suspensión independiente y estructura dimensionada para 2.700 kg sobre un habitáculo de 4,15 por 1,85 m. Los 1.330 kg de tara son el precio de ese volumen: cada centímetro de anchura añade material a las paredes, al techo y al bastidor. La suspensión independiente es aquí más necesaria que en ningún otro modelo, porque un remolque ancho balancea más.",
        bodyEn: "WCF chassis with independent suspension and a structure sized for 2,700 kg over a compartment of 4.15 by 1.85 m. The 1,330 kg unladen weight is the price of that volume: every centimetre of width adds material to the walls, the roof and the frame. Independent suspension is more necessary here than on any other model, because a wide trailer rolls more.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "La MMA de 2.700 kg descarta el permiso B y limita el B96 a un vehículo de 1.550 kg, cifra que ningún SUV respeta. El B+E, con vehículo de hasta 3.500 kg, es la única vía practicable. Con 1,85 m de ancho, comprueba también el ancho de tu vehículo tractor: un remolque más ancho que el coche exige espejos de extensión, obligatorios en circulación.",
        bodyEn: "The 2,700 kg gross weight rules out a category B licence and limits B96 to a 1,550 kg vehicle, a figure no SUV meets. B+E, with a vehicle up to 3,500 kg, is the only workable route. At 1.85 m wide, also check your tow car's width: a trailer wider than the car requires extension mirrors, which are compulsory on the road.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Chasis WCF, separador central y estructura reforzada, de serie. La variante Big Portax Stall reorganiza el interior y deja 1.310 kg de carga útil, sesenta menos. Arcón delantero, ventilación adicional, rueda de repuesto, espejos de extensión y acabado exterior se concretan en el pedido con el plazo del fabricante.",
        bodyEn: "WCF chassis, central partition and reinforced structure, as standard. The Big Portax Stall variant reorganises the interior and leaves 1,310 kg of payload, sixty less. Front chest, extra ventilation, spare wheel, extension mirrors and exterior finish are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2700,
      taraKg: 1330,
      cargaUtilKg: 1370,
      largoInteriorCm: 415,
      anchoInteriorCm: 185,
      altoInteriorCm: 240,
    },
    sourceRef: `${BOECK}/portax`,
  },

  {
    slug: "bk-big-portax-stall",
    brand: "Böckmann",
    name: "Big Portax Stall",
    nameEn: "Big Portax Stall",
    sku: "BK-BPXS-2",
    shortDescription:
      "Big Portax con interior reorganizado en compartimentos. MMA de 2.700 kg y 1.310 kg de carga útil.",
    shortDescriptionEn:
      "Big Portax with a compartmented interior. 2,700 kg gross weight and 1,310 kg payload.",
    bullets: [
      "Dos caballos",
      "MMA 2.700 kg, tara 1.390 kg, carga útil 1.310 kg",
      "Interior de 4,15 × 1,85 × 2,40 m",
      "Interior compartimentado, chasis WCF",
      "Permiso B96 con vehículo de hasta 1.550 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,700 kg gross weight, 1,390 kg unladen, 1,310 kg payload",
      "Inner space of 4.15 × 1.85 × 2.40 m",
      "Compartmented interior, WCF chassis",
      "B96 licence with a vehicle up to 1,550 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Mismas medidas exteriores e interiores que el Big Portax, con el habitáculo organizado en compartimentos separados. Esa disposición conviene a caballos que no se llevan bien, o a yeguas con potro que necesitan su propio espacio. Los 1.310 kg de carga útil son sesenta menos que el Big Portax, diferencia que corresponde a los tabiques adicionales.",
        bodyEn: "Same outer and inner dimensions as the Big Portax, with the compartment organised into separate stalls. That layout suits horses that do not get on, or mares with a foal needing their own space. The 1,310 kg payload is sixty less than the Big Portax, a difference corresponding to the extra partitions.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Chasis WCF con suspensión independiente y tabiques de compartimentación integrados en la estructura. Los 1.390 kg de tara son los más altos de la gama Portax: es el precio de un habitáculo de 4,15 por 1,85 m con separaciones fijas. La altura interior de 2,40 m se mantiene en todos los compartimentos.",
        bodyEn: "WCF chassis with independent suspension and dividing partitions built into the structure. The 1,390 kg unladen weight is the highest in the Portax range: the price of a 4.15 by 1.85 m compartment with fixed divisions. The 2.40 m inner height is maintained across all stalls.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.700 kg de MMA, el permiso B queda descartado y el B96 exige un vehículo de 1.550 kg como máximo. El B+E, con vehículo de hasta 3.500 kg, es la vía realista. Con 1,85 m de ancho y 4,15 de largo, este conjunto pide un todoterreno o una pick-up: comprueba la masa remolcable con freno en el apartado O.1 de tu ficha técnica.",
        bodyEn: "At 2,700 kg gross, a category B licence is ruled out and B96 demands a vehicle of 1,550 kg at most. B+E, with a vehicle up to 3,500 kg, is the realistic route. At 1.85 m wide and 4.15 long, this combination calls for a 4x4 or a pick-up: check the braked towable mass in section O.1 of your registration document.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Compartimentación interior, chasis WCF y estructura reforzada, de serie. Si no necesitas separar a los animales, el Big Portax ofrece las mismas medidas con sesenta kilos más de carga útil. Arcón, ventilación adicional, rueda de repuesto y espejos de extensión se definen en el pedido con el plazo del fabricante.",
        bodyEn: "Interior compartmentation, WCF chassis and reinforced structure, as standard. If you do not need to separate the animals, the Big Portax offers the same dimensions with sixty kilos more payload. Chest, extra ventilation, spare wheel and extension mirrors are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2700,
      taraKg: 1390,
      cargaUtilKg: 1310,
      largoInteriorCm: 415,
      anchoInteriorCm: 185,
      altoInteriorCm: 240,
    },
    sourceRef: `${BOECK}/portax`,
  },

  // ------------------------------------------------------------------- Neo
  {
    slug: "bk-neo-ska",
    brand: "Böckmann",
    name: "Neo SKA",
    nameEn: "Neo SKA",
    sku: "BK-NEO-S",
    shortDescription:
      "Van de dos caballos con carrocería integral de poliéster y salida lateral. MMA de 2.700 kg y 1.490 kg de carga útil.",
    shortDescriptionEn:
      "Two-horse trailer with a full polyester body and side exit. 2,700 kg gross weight and 1,490 kg payload.",
    bullets: [
      "Dos caballos",
      "MMA 2.700 kg, tara 1.210 kg, carga útil 1.490 kg",
      "Interior de 3,78 × 1,76 × 2,35 m",
      "Carrocería integral de poliéster, salida lateral, chasis WCF",
      "Permiso B96 con vehículo de hasta 1.550 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,700 kg gross weight, 1,210 kg unladen, 1,490 kg payload",
      "Inner space of 3.78 × 1.76 × 2.35 m",
      "Full polyester body, side exit, WCF chassis",
      "B96 licence with a vehicle up to 1,550 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Con 1.490 kg de carga útil sobre 2.700 de MMA, el Neo SKA es de los que más peso admiten en su tamaño. Los 3,78 m de largo y 1,76 de ancho reparten dos plazas de 88 cm, holgadas para caballos de talla grande. La salida lateral permite descargar sin hacer retroceder al animal, gesto que muchos caballos ejecutan mal cuando están cansados.",
        bodyEn: "With 1,490 kg of payload on 2,700 kg gross, the Neo SKA is among those carrying the most weight for its size. The 3.78 m length and 1.76 m width give two 88 cm places, roomy for large horses. The side exit allows unloading without backing the animal down, a manoeuvre many horses perform badly when tired.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Carrocería integral de poliéster sobre chasis WCF de suspensión independiente. El poliéster no se abolla en los roces de maniobra ni se corroe, y aísla del calor mejor que un panel metálico: en un aparcamiento al sol de agosto, la diferencia de temperatura interior es real. Los 1.210 kg de tara son contenidos para un van de esta MMA.",
        bodyEn: "Full polyester body on a WCF independent-suspension chassis. Polyester does not dent in manoeuvring knocks nor corrode, and insulates against heat better than a metal panel: in a car park under the August sun, the difference in inner temperature is real. The 1,210 kg unladen weight is contained for a trailer of this gross weight.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Los 2.700 kg de MMA dejan el permiso B fuera de alcance y limitan el B96 a un vehículo tractor de 1.550 kg, cifra que casi ningún SUV respeta. El B+E, que admite hasta 3.500 kg de vehículo, es la opción realista. Comprueba además la masa remolcable con freno que autoriza tu coche, en el apartado O.1 de su ficha técnica.",
        bodyEn: "The 2,700 kg gross weight puts a category B licence out of reach and limits B96 to a 1,550 kg towing vehicle, a figure almost no SUV meets. B+E, taking up to 3,500 kg of vehicle, is the realistic option. Also check the braked towable mass your car allows, in section O.1 of its registration document.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Carrocería integral de poliéster, salida lateral, chasis WCF y separador central, de serie. Las variantes Neo L, de 4,08 m, alargan el habitáculo treinta centímetros con carga útil ligeramente inferior. Arcón, ventilación adicional, rueda de repuesto y acabado exterior se concretan en el pedido con el plazo del fabricante.",
        bodyEn: "Full polyester body, side exit, WCF chassis and central partition, as standard. The Neo L variants, at 4.08 m, stretch the compartment by thirty centimetres with slightly lower payload. Chest, extra ventilation, spare wheel and exterior finish are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2700,
      taraKg: 1210,
      cargaUtilKg: 1490,
      largoInteriorCm: 378,
      anchoInteriorCm: 176,
      altoInteriorCm: 235,
    },
    sourceRef: `${BOECK}/neo`,
  },

  {
    slug: "bk-neo-l-ska",
    brand: "Böckmann",
    name: "Neo L SKA",
    nameEn: "Neo L SKA",
    sku: "BK-NEOL-S",
    shortDescription:
      "Neo alargado a 4,08 m con salida lateral y 2,40 m de altura interior. MMA de 2.700 kg.",
    shortDescriptionEn:
      "Neo stretched to 4.08 m with a side exit and 2.40 m inner height. 2,700 kg gross weight.",
    bullets: [
      "Dos caballos",
      "MMA 2.700 kg, tara 1.250 kg, carga útil 1.450 kg",
      "Interior de 4,08 × 1,76 × 2,40 m",
      "Carrocería integral de poliéster, salida lateral, chasis WCF",
      "Permiso B96 con vehículo de hasta 1.550 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,700 kg gross weight, 1,250 kg unladen, 1,450 kg payload",
      "Inner space of 4.08 × 1.76 × 2.40 m",
      "Full polyester body, side exit, WCF chassis",
      "B96 licence with a vehicle up to 1,550 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Treinta centímetros más largo que el Neo SKA y cinco más alto, con la misma anchura. Esa altura de 2,40 m es de las mayores del mercado en dos plazas, y conviene a caballos que en 2,30 m rozan el techo al levantar la cabeza. La carga útil de 1.450 kg cubre dos animales grandes con su equipo completo de concurso.",
        bodyEn: "Thirty centimetres longer than the Neo SKA and five taller, with the same width. That 2.40 m height is among the greatest on the two-place market, and suits horses that brush the roof at 2.30 m when they lift their head. The 1,450 kg payload covers two large animals with their full competition equipment.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Carrocería integral de poliéster y chasis WCF de suspensión independiente. Los cuarenta kilos que separan su tara de la del Neo SKA corresponden al material del mayor largo y de la mayor altura. El poliéster mantiene su forma con los años y no acumula humedad en los cantos, defecto habitual de las carrocerías de contrachapado mal selladas.",
        bodyEn: "Full polyester body and WCF independent-suspension chassis. The forty kilos separating its unladen weight from the Neo SKA's correspond to the material of the greater length and height. Polyester keeps its shape over the years and does not trap damp at the edges, a common failing of poorly sealed plywood bodies.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.700 kg de MMA, el permiso B queda descartado y el B96 solo admite un vehículo de 1.550 kg. El B+E, con hasta 3.500 kg de vehículo, es la vía practicable. Con 4,08 m de habitáculo, la distancia entre ejes del tractor importa tanto como su masa: un todoterreno largo estabiliza el conjunto mejor que un SUV corto del mismo peso.",
        bodyEn: "At 2,700 kg gross, a category B licence is ruled out and B96 only allows a 1,550 kg vehicle. B+E, with up to 3,500 kg of vehicle, is the workable route. With a 4.08 m compartment, the tow car's wheelbase matters as much as its mass: a long 4x4 steadies the combination better than a short SUV of the same weight.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Carrocería de poliéster, salida lateral, chasis WCF y separador central, de serie. La variante Neo L SR comparte medidas con otra configuración interior y quince kilos menos de carga útil. Arcón delantero, ventilación adicional, rueda de repuesto y acabado exterior se definen en el pedido con el plazo del fabricante.",
        bodyEn: "Polyester body, side exit, WCF chassis and central partition, as standard. The Neo L SR variant shares its dimensions with a different interior layout and fifteen kilos less payload. Front chest, extra ventilation, spare wheel and exterior finish are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2700,
      taraKg: 1250,
      cargaUtilKg: 1450,
      largoInteriorCm: 408,
      anchoInteriorCm: 176,
      altoInteriorCm: 240,
    },
    sourceRef: `${BOECK}/neo`,
  },

  {
    slug: "bk-neo-l-sr",
    brand: "Böckmann",
    name: "Neo L SR",
    nameEn: "Neo L SR",
    sku: "BK-NEOL-R",
    shortDescription:
      "Neo alargado con espacio de sillas y 2,40 m de altura interior. MMA de 2.700 kg y 1.435 kg de carga útil.",
    shortDescriptionEn:
      "Stretched Neo with tack space and 2.40 m inner height. 2,700 kg gross weight and 1,435 kg payload.",
    bullets: [
      "Dos caballos",
      "MMA 2.700 kg, tara 1.265 kg, carga útil 1.435 kg",
      "Interior de 4,08 × 1,76 × 2,40 m",
      "Espacio de sillas, carrocería de poliéster, chasis WCF",
      "Permiso B96 con vehículo de hasta 1.550 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,700 kg gross weight, 1,265 kg unladen, 1,435 kg payload",
      "Inner space of 4.08 × 1.76 × 2.40 m",
      "Tack space, polyester body, WCF chassis",
      "B96 licence with a vehicle up to 1,550 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Mismas medidas que el Neo L SKA, con el interior organizado alrededor de un espacio de sillas. Esa disposición interesa a quien compite varios días seguidos y transporta sillas, mantas, cabezadas y botiquín con los caballos. La carga útil de 1.435 kg incluye ese material: conviene pesarlo una vez, porque el equipo completo de dos caballos supera con facilidad los cien kilos.",
        bodyEn: "Same dimensions as the Neo L SKA, with the interior organised around a tack space. That layout appeals to anyone competing several days in a row and carrying saddles, rugs, headcollars and a first-aid kit with the horses. The 1,435 kg payload includes that material: it is worth weighing once, because the full equipment for two horses easily exceeds a hundred kilos.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Carrocería integral de poliéster sobre chasis WCF de suspensión independiente, con espacio de sillas integrado en la estructura. Los 1.265 kg de tara son quince más que el Neo L SKA, diferencia que corresponde a ese espacio. La altura interior de 2,40 m se mantiene en toda la zona de los animales.",
        bodyEn: "Full polyester body on a WCF independent-suspension chassis, with tack space built into the structure. The 1,265 kg unladen weight is fifteen more than the Neo L SKA, a difference corresponding to that space. The 2.40 m inner height is maintained throughout the animal area.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "La MMA de 2.700 kg descarta el permiso B y limita el B96 a un vehículo tractor de 1.550 kg, cifra que deja fuera a casi todos los SUV. El B+E, que permite hasta 3.500 kg de vehículo, es la opción realista para este modelo. Verifica la masa remolcable con freno de tu coche en el apartado O.1 de su ficha técnica antes de encargar.",
        bodyEn: "The 2,700 kg gross weight rules out a category B licence and limits B96 to a 1,550 kg towing vehicle, a figure that rules out almost every SUV. B+E, permitting up to 3,500 kg of vehicle, is the realistic option for this model. Check your car's braked towable mass in section O.1 of its registration document before ordering.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Espacio de sillas, carrocería de poliéster, chasis WCF y separador central, de serie. Si no necesitas el espacio de sillas, el Neo L SKA ofrece las mismas medidas con salida lateral y quince kilos más de carga útil. Arcón, ventilación adicional y rueda de repuesto se concretan en el pedido con el plazo del fabricante.",
        bodyEn: "Tack space, polyester body, WCF chassis and central partition, as standard. If you do not need the tack space, the Neo L SKA offers the same dimensions with a side exit and fifteen kilos more payload. Chest, extra ventilation and spare wheel are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2700,
      taraKg: 1265,
      cargaUtilKg: 1435,
      largoInteriorCm: 408,
      anchoInteriorCm: 176,
      altoInteriorCm: 240,
    },
    sourceRef: `${BOECK}/neo`,
  },

  // ------------------------------------------------------------- Traveller
  //
  // La gamme Traveller transporte les animaux en oblique, ce qui explique ses
  // deux mètres de largeur et, sur les versions K, une hauteur intérieure de
  // 2,10 m seulement. Cette cote est basse pour un cheval adulte : les fiches
  // le disent, plutôt que de laisser l'acheteur le découvrir à la livraison.
  //
  // Regroupements, même règle que pour Portax : K4 et K3 Big SK partagent leurs
  // chiffres, G2 et W2 Big SK aussi, K5 et K4 Big SK également, W3 Big SK et W4
  // enfin. Chaque fiche nomme les configurations qu'elle couvre.
  {
    slug: "bk-traveller-k3",
    brand: "Böckmann",
    name: "Traveller K3",
    nameEn: "Traveller K3",
    sku: "BK-TRK3-3",
    shortDescription:
      "Van de dos a tres animales en transporte oblicuo, con 2 m de ancho interior. MMA de 2.400 kg y 1.225 kg de carga útil.",
    shortDescriptionEn:
      "Trailer for two to three animals carried at an angle, 2 m wide inside. 2,400 kg gross weight and 1,225 kg payload.",
    bullets: [
      "De dos a tres animales, en transporte oblicuo",
      "MMA 2.400 kg, tara 1.175 kg, carga útil 1.225 kg",
      "Interior de 3,17 × 2,00 × 2,10 m",
      "Altura interior de 2,10 m: apta para ponis y caballos de alzada baja",
      "Permiso B96 con vehículo de hasta 1.850 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two to three animals, carried at an angle",
      "2,400 kg gross weight, 1,175 kg unladen, 1,225 kg payload",
      "Inner space of 3.17 × 2.00 × 2.10 m",
      "2.10 m inner height: suited to ponies and short horses",
      "B96 licence with a vehicle up to 1,850 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "La gama Traveller coloca a los animales en oblicuo en lugar de en paralelo, lo que permite meter tres donde otros vans llevan dos. Los 2 m de ancho interior son la clave de ese reparto. Interesa a clubes y a familias con varios ponis. Antes de encargar, mide la alzada de tus animales: la altura interior de 2,10 m es la cota que decide.",
        bodyEn: "The Traveller range places animals at an angle rather than in parallel, which fits three where other trailers take two. The 2 m inner width is the key to that layout. It appeals to clubs and to families with several ponies. Before ordering, measure your animals' height: the 2.10 m inner height is the deciding dimension.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Carrocería de aluminio y disposición oblicua con espacio de sillas integrado. Los 2,10 m de altura interior son bajos para un caballo adulto de alzada media, que levanta la cabeza en cada frenada: este modelo está pensado para ponis y caballos pequeños. Si transportas animales de más de 1,60 m a la cruz, mira las versiones G y W, de 2,40 m.",
        bodyEn: "Aluminium body and angled layout with built-in tack space. The 2.10 m inner height is low for an adult horse of average size, which lifts its head at every braking: this model is intended for ponies and small horses. If you carry animals over 1.60 m at the withers, look at the G and W versions, at 2.40 m.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.400 kg de MMA, el permiso B exigiría un vehículo tractor de 1.100 kg. Con B96 el conjunto llega a 4.250 kg y admite un vehículo de hasta 1.850 kg de masa máxima autorizada; con B+E, hasta 3.500 kg. Los 2 m de ancho obligan además a espejos de extensión si tu coche es más estrecho, cosa que ocurre con casi todos los turismos.",
        bodyEn: "At 2,400 kg gross, a category B licence would require a 1,100 kg towing vehicle. With B96 the combination reaches 4,250 kg and takes a vehicle up to 1,850 kg gross; with B+E, up to 3,500 kg. The 2 m width also calls for extension mirrors if your car is narrower, which is the case with almost every passenger car.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Separadores para la disposición oblicua y espacio de sillas, de serie. La conversión entre dos y tres animales se hace con los separadores. Si necesitas más largo, el Traveller K4 sube a 3,57 m con MMA de 2.700 kg. Arcón, ventilación adicional, rueda de repuesto y espejos de extensión se concretan en el pedido con el plazo de fábrica.",
        bodyEn: "Partitions for the angled layout and tack space, as standard. Switching between two and three animals is done with the partitions. If you need more length, the Traveller K4 rises to 3.57 m with a 2,700 kg gross weight. Chest, extra ventilation, spare wheel and extension mirrors are settled at order time with the factory lead time.",
      },
    ],
    specs: {
      plazas: 3,
      mmaKg: 2400,
      taraKg: 1175,
      cargaUtilKg: 1225,
      largoInteriorCm: 317,
      anchoInteriorCm: 200,
      altoInteriorCm: 210,
    },
    sourceRef: `${BOECK}/traveller`,
  },

  {
    slug: "bk-traveller-k4",
    brand: "Böckmann",
    name: "Traveller K4 y K3 Big SK",
    nameEn: "Traveller K4 and K3 Big SK",
    sku: "BK-TRK4-3",
    shortDescription:
      "Van de dos a tres animales en oblicuo, con 3,57 m de largo. MMA de 2.700 kg y 1.480 kg de carga útil.",
    shortDescriptionEn:
      "Trailer for two to three animals at an angle, 3.57 m long. 2,700 kg gross weight and 1,480 kg payload.",
    bullets: [
      "De dos a tres animales, en transporte oblicuo",
      "MMA 2.700 kg, tara 1.220 kg, carga útil 1.480 kg",
      "Interior de 3,57 × 2,00 × 2,10 m",
      "Altura interior de 2,10 m: apta para ponis y caballos de alzada baja",
      "Permiso B96 con vehículo de hasta 1.550 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two to three animals, carried at an angle",
      "2,700 kg gross weight, 1,220 kg unladen, 1,480 kg payload",
      "Inner space of 3.57 × 2.00 × 2.10 m",
      "2.10 m inner height: suited to ponies and short horses",
      "B96 licence with a vehicle up to 1,550 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Cuarenta centímetros más largo que el Traveller K3 y con la MMA elevada a 2.700 kg, lo que libera 255 kg de carga útil suplementaria. Con 1.480 kg disponibles, transporta tres ponis o dos caballos pequeños con su equipo sin acercarse al límite. La disposición oblicua sobre 2 m de ancho es lo que hace posible ese reparto.",
        bodyEn: "Forty centimetres longer than the Traveller K3 and with the gross weight raised to 2,700 kg, which frees 255 kg of extra payload. With 1,480 kg available, it carries three ponies or two small horses with their equipment without approaching the limit. The angled layout across 2 m of width is what makes that possible.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Carrocería de aluminio, disposición oblicua y espacio de sillas. La altura interior de 2,10 m es la misma que la del K3 y sigue siendo la cota limitante: por debajo de 1,60 m a la cruz no hay problema, por encima conviene mirar las versiones G y W. Los 1.220 kg de tara son contenidos para un habitáculo de 3,57 por 2 m.",
        bodyEn: "Aluminium body, angled layout and tack space. The 2.10 m inner height is the same as the K3's and remains the limiting dimension: below 1.60 m at the withers there is no problem, above it the G and W versions are worth a look. The 1,220 kg unladen weight is contained for a compartment of 3.57 by 2 m.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.700 kg de MMA, el permiso B queda descartado y el B96 solo admite un vehículo tractor de 1.550 kg, cifra que deja fuera a casi todos los SUV. El B+E, con vehículo de hasta 3.500 kg, es la opción realista. Los 2 m de ancho exigen espejos de extensión, obligatorios cuando el remolque es más ancho que el vehículo.",
        bodyEn: "At 2,700 kg gross, a category B licence is ruled out and B96 only allows a 1,550 kg towing vehicle, a figure that rules out almost every SUV. B+E, with a vehicle up to 3,500 kg, is the realistic option. The 2 m width calls for extension mirrors, compulsory when the trailer is wider than the vehicle.",
      },
      {
        heading: "Configuraciones y equipamiento",
        headingEn: "Configurations and equipment",
        body: "Dos configuraciones con idénticas medidas y carga útil: la K4 y la K3 Big SK, que se diferencian en la disposición de acceso. Separadores para el transporte oblicuo y espacio de sillas, de serie. Dinos cuántos animales mueves y su alzada, y te decimos cuál te conviene, con el presupuesto y el plazo del fabricante.",
        bodyEn: "Two configurations with identical dimensions and payload: the K4 and the K3 Big SK, differing in access layout. Partitions for angled transport and tack space, as standard. Tell us how many animals you move and their height, and we will say which suits you, with the quote and the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 3,
      mmaKg: 2700,
      taraKg: 1220,
      cargaUtilKg: 1480,
      largoInteriorCm: 357,
      anchoInteriorCm: 200,
      altoInteriorCm: 210,
    },
    sourceRef: `${BOECK}/traveller`,
  },

  {
    slug: "bk-traveller-g2",
    brand: "Böckmann",
    name: "Traveller G2 y W2 Big SK",
    nameEn: "Traveller G2 and W2 Big SK",
    sku: "BK-TRG2-2",
    shortDescription:
      "Van de dos caballos en oblicuo, con 2,40 m de altura interior. MMA de 2.700 kg y 1.405 kg de carga útil.",
    shortDescriptionEn:
      "Two-horse trailer with angled transport and 2.40 m inner height. 2,700 kg gross weight and 1,405 kg payload.",
    bullets: [
      "Dos caballos, en transporte oblicuo",
      "MMA 2.700 kg, tara 1.295 kg, carga útil 1.405 kg",
      "Interior de 3,57 × 2,00 × 2,40 m",
      "Altura de 2,40 m: apta para caballos de gran alzada",
      "Permiso B96 con vehículo de hasta 1.550 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses, carried at an angle",
      "2,700 kg gross weight, 1,295 kg unladen, 1,405 kg payload",
      "Inner space of 3.57 × 2.00 × 2.40 m",
      "2.40 m height: suited to tall horses",
      "B96 licence with a vehicle up to 1,550 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Las versiones G y W resuelven la limitación de la serie K: suben la altura interior a 2,40 m, treinta centímetros más, lo que admite caballos de gran alzada. Con 2 m de ancho y transporte oblicuo, dos animales viajan con un espacio que un van paralelo de la misma longitud no ofrece. La carga útil de 1.405 kg cubre dos caballos adultos con su equipo.",
        bodyEn: "The G and W versions solve the K series' limitation: they raise the inner height to 2.40 m, thirty centimetres more, which takes tall horses. At 2 m wide with angled transport, two animals travel with room a parallel trailer of the same length does not offer. The 1,405 kg payload covers two adult horses with their equipment.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Carrocería de aluminio, disposición oblicua y espacio de sillas integrado. Los 2,40 m de altura interior son de los mayores del mercado y evitan que el caballo roce el techo al levantar la cabeza. Los 1.295 kg de tara son setenta y cinco más que la versión K de igual largo: es el precio de esos treinta centímetros de altura.",
        bodyEn: "Aluminium body, angled layout and built-in tack space. The 2.40 m inner height is among the greatest on the market and keeps the horse from brushing the roof when it lifts its head. The 1,295 kg unladen weight is seventy-five more than the K version of equal length: the price of those thirty centimetres of height.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Los 2.700 kg de MMA descartan el permiso B y limitan el B96 a un vehículo de 1.550 kg. El B+E, con vehículo de hasta 3.500 kg, es la vía practicable. Con 2 m de ancho, los espejos de extensión son obligatorios en circulación: un remolque más ancho que el coche deja ángulos muertos que los espejos de serie no cubren.",
        bodyEn: "The 2,700 kg gross weight rules out a category B licence and limits B96 to a 1,550 kg vehicle. B+E, with a vehicle up to 3,500 kg, is the workable route. At 2 m wide, extension mirrors are compulsory on the road: a trailer wider than the car leaves blind spots the standard mirrors do not cover.",
      },
      {
        heading: "Configuraciones y equipamiento",
        headingEn: "Configurations and equipment",
        body: "Dos configuraciones de idénticas medidas y carga útil, la G2 y la W2 Big SK, que se diferencian en la disposición de acceso. Separadores para transporte oblicuo y espacio de sillas, de serie. Si necesitas tres plazas con esta misma altura, el Traveller W3 comparte las medidas con esa configuración. El presupuesto y el plazo se concretan en el pedido.",
        bodyEn: "Two configurations with identical dimensions and payload, the G2 and the W2 Big SK, differing in access layout. Partitions for angled transport and tack space, as standard. If you need three places at this same height, the Traveller W3 shares the dimensions in that configuration. Quote and lead time are settled at order time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2700,
      taraKg: 1295,
      cargaUtilKg: 1405,
      largoInteriorCm: 357,
      anchoInteriorCm: 200,
      altoInteriorCm: 240,
    },
    sourceRef: `${BOECK}/traveller`,
  },

  {
    slug: "bk-traveller-w3",
    brand: "Böckmann",
    name: "Traveller W3",
    nameEn: "Traveller W3",
    sku: "BK-TRW3-3",
    shortDescription:
      "Van de tres caballos en oblicuo, con 2,40 m de altura interior. MMA de 2.700 kg y 1.405 kg de carga útil.",
    shortDescriptionEn:
      "Three-horse trailer with angled transport and 2.40 m inner height. 2,700 kg gross weight and 1,405 kg payload.",
    bullets: [
      "Tres caballos, en transporte oblicuo",
      "MMA 2.700 kg, tara 1.295 kg, carga útil 1.405 kg",
      "Interior de 3,57 × 2,00 × 2,40 m",
      "Altura de 2,40 m: apta para caballos de gran alzada",
      "Permiso B96 con vehículo de hasta 1.550 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Three horses, carried at an angle",
      "2,700 kg gross weight, 1,295 kg unladen, 1,405 kg payload",
      "Inner space of 3.57 × 2.00 × 2.40 m",
      "2.40 m height: suited to tall horses",
      "B96 licence with a vehicle up to 1,550 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Mismas medidas que el Traveller G2, con la disposición interior configurada para tres animales en lugar de dos. Es donde el transporte oblicuo demuestra su interés: tres caballos en 3,57 m de largo, imposible en disposición paralela. La carga útil de 1.405 kg repartida entre tres animales deja unos 470 kg por plaza con el equipo, cifra que conviene contrastar con el peso real de tus caballos.",
        bodyEn: "Same dimensions as the Traveller G2, with the interior configured for three animals instead of two. This is where angled transport shows its worth: three horses in 3.57 m of length, impossible in a parallel layout. The 1,405 kg payload split across three animals leaves about 470 kg per place with equipment, a figure worth checking against your horses' real weight.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Carrocería de aluminio, 2 m de ancho interior y 2,40 m de altura, con espacio de sillas integrado. La altura conviene a caballos de gran alzada, al contrario que las versiones K, limitadas a 2,10 m. La disposición oblicua reparte el peso de forma distinta a un van paralelo: el equilibrio del conjunto depende de cómo se coloquen los animales, no solo de cuántos.",
        bodyEn: "Aluminium body, 2 m inner width and 2.40 m height, with built-in tack space. The height suits tall horses, unlike the K versions capped at 2.10 m. The angled layout spreads weight differently from a parallel trailer: the combination's balance depends on how the animals are placed, not only on how many.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.700 kg de MMA, el permiso B queda descartado y el B96 exige un vehículo de 1.550 kg como máximo. El B+E, con vehículo de hasta 3.500 kg, es la opción realista. Con tres animales a bordo y 2 m de ancho, comprueba también la carga máxima por eje: repartir mal a los caballos puede superarla aunque la MMA total se respete.",
        bodyEn: "At 2,700 kg gross, a category B licence is ruled out and B96 demands a vehicle of 1,550 kg at most. B+E, with a vehicle up to 3,500 kg, is the realistic option. With three animals aboard and 2 m of width, also check the maximum axle load: placing the horses badly can exceed it even when the total gross weight is respected.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Separadores para tres plazas en oblicuo y espacio de sillas, de serie. Retirando un separador se pasa a dos plazas más holgadas. Si necesitas cuatro o cinco animales, las versiones de 4,58 m suben la MMA a 3.500 kg. Arcón, ventilación adicional, rueda de repuesto y espejos de extensión se definen en el pedido con el plazo del fabricante.",
        bodyEn: "Partitions for three angled places and tack space, as standard. Removing one partition gives two roomier places. If you need four or five animals, the 4.58 m versions raise the gross weight to 3,500 kg. Chest, extra ventilation, spare wheel and extension mirrors are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 3,
      mmaKg: 2700,
      taraKg: 1295,
      cargaUtilKg: 1405,
      largoInteriorCm: 357,
      anchoInteriorCm: 200,
      altoInteriorCm: 240,
    },
    sourceRef: `${BOECK}/traveller`,
  },

  {
    slug: "bk-traveller-k5",
    brand: "Böckmann",
    name: "Traveller K5 y K4 Big SK",
    nameEn: "Traveller K5 and K4 Big SK",
    sku: "BK-TRK5-4",
    shortDescription:
      "Van de cuatro a cinco animales en oblicuo, con 4,58 m de largo. MMA de 3.500 kg y 1.880 kg de carga útil.",
    shortDescriptionEn:
      "Trailer for four to five animals at an angle, 4.58 m long. 3,500 kg gross weight and 1,880 kg payload.",
    bullets: [
      "De cuatro a cinco animales, en transporte oblicuo",
      "MMA 3.500 kg, tara 1.620 kg, carga útil 1.880 kg",
      "Interior de 4,58 × 2,00 × 2,10 m",
      "Altura interior de 2,10 m: apta para ponis y caballos de alzada baja",
      "Permiso B+E con vehículo de hasta 3.500 kg de MMA",
    ],
    bulletsEn: [
      "Four to five animals, carried at an angle",
      "3,500 kg gross weight, 1,620 kg unladen, 1,880 kg payload",
      "Inner space of 4.58 × 2.00 × 2.10 m",
      "2.10 m inner height: suited to ponies and short horses",
      "B+E licence with a towing vehicle up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Cuatro a cinco animales en 4,58 m de largo, gracias al transporte oblicuo sobre 2 m de ancho. Es el formato de los clubes y de los centros hípicos que mueven un grupo entero a la vez. La carga útil de 1.880 kg repartida entre cinco deja 376 kg por plaza: es la cifra que decide si este modelo te sirve con ponis o si necesitas un camión con caballos adultos.",
        bodyEn: "Four to five animals in 4.58 m of length, thanks to angled transport across 2 m of width. It is the format for clubs and equestrian centres moving a whole group at once. The 1,880 kg payload split among five leaves 376 kg per place: that is the figure deciding whether this model serves you with ponies or whether adult horses call for a lorry.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Carrocería de aluminio con disposición oblicua y espacio de sillas. La altura interior de 2,10 m limita el modelo a ponis y caballos de alzada baja: con animales de más de 1,60 m a la cruz, las versiones W de 2,40 m son la respuesta. Los 1.620 kg de tara corresponden a la estructura que exige homologar 3.500 kg sobre 4,58 m.",
        bodyEn: "Aluminium body with angled layout and tack space. The 2.10 m inner height limits the model to ponies and short horses: with animals over 1.60 m at the withers, the 2.40 m W versions are the answer. The 1,620 kg unladen weight matches the structure needed to homologate 3,500 kg over 4.58 m.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 3.500 kg de MMA, este van exige permiso B+E: ni el B ni el B96 lo permiten con ningún vehículo real. Con B+E el conjunto llega a 7.000 kg y admite un tractor de hasta 3.500 kg de masa máxima autorizada. En la práctica pide un todoterreno o una pick-up con masa remolcable de 3.500 kg con freno, dato del apartado O.1 de la ficha técnica.",
        bodyEn: "At 3,500 kg gross, this trailer requires a B+E licence: neither B nor B96 allows it with any real vehicle. With B+E the combination reaches 7,000 kg and takes a tow car up to 3,500 kg gross. In practice it calls for a 4x4 or a pick-up with a braked towable mass of 3,500 kg, shown in section O.1 of the registration document.",
      },
      {
        heading: "Configuraciones y equipamiento",
        headingEn: "Configurations and equipment",
        body: "Dos configuraciones de idénticas medidas y carga útil, la K5 y la K4 Big SK, que se diferencian en la disposición de acceso. Separadores para el transporte oblicuo y espacio de sillas, de serie. Cuéntanos el número de animales, su alzada y su peso, y te decimos cuál te conviene, con el presupuesto y el plazo del fabricante.",
        bodyEn: "Two configurations with identical dimensions and payload, the K5 and the K4 Big SK, differing in access layout. Partitions for angled transport and tack space, as standard. Tell us the number of animals, their height and their weight, and we will say which suits you, with the quote and the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 4,
      mmaKg: 3500,
      taraKg: 1620,
      cargaUtilKg: 1880,
      largoInteriorCm: 458,
      anchoInteriorCm: 200,
      altoInteriorCm: 210,
    },
    sourceRef: `${BOECK}/traveller`,
  },

  {
    slug: "bk-traveller-g3",
    brand: "Böckmann",
    name: "Traveller G3",
    nameEn: "Traveller G3",
    sku: "BK-TRG3-3",
    shortDescription:
      "Van de tres caballos en oblicuo con 4,58 m de largo y 2,40 m de altura. MMA de 3.500 kg y 1.830 kg de carga útil.",
    shortDescriptionEn:
      "Three-horse trailer at an angle, 4.58 m long and 2.40 m high. 3,500 kg gross weight and 1,830 kg payload.",
    bullets: [
      "Tres caballos, en transporte oblicuo",
      "MMA 3.500 kg, tara 1.670 kg, carga útil 1.830 kg",
      "Interior de 4,58 × 2,00 × 2,40 m",
      "Altura de 2,40 m: apta para caballos de gran alzada",
      "Permiso B+E con vehículo de hasta 3.500 kg de MMA",
    ],
    bulletsEn: [
      "Three horses, carried at an angle",
      "3,500 kg gross weight, 1,670 kg unladen, 1,830 kg payload",
      "Inner space of 4.58 × 2.00 × 2.40 m",
      "2.40 m height: suited to tall horses",
      "B+E licence with a towing vehicle up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Tres caballos de gran alzada en 4,58 m, con 2,40 m de altura interior y transporte oblicuo. La carga útil de 1.830 kg repartida entre tres animales deja 610 kg por plaza con el equipo: es holgado incluso con caballos pesados. Es el Traveller de quien compite con animales grandes y necesita espacio real, no plazas contadas al centímetro.",
        bodyEn: "Three tall horses in 4.58 m, with 2.40 m of inner height and angled transport. The 1,830 kg payload split among three animals leaves 610 kg per place with equipment: ample even with heavy horses. It is the Traveller for anyone competing with large animals who needs real room, not places measured to the centimetre.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Carrocería de aluminio, 2 m de ancho y 2,40 m de altura interior, con espacio de sillas integrado. Los 1.670 kg de tara son los más altos de la gama Traveller: sostener 4,58 m de habitáculo a 2,40 m de altura exige una estructura en consecuencia. La disposición oblicua reparte el peso de forma más equilibrada que tres plazas en paralelo.",
        bodyEn: "Aluminium body, 2 m wide and 2.40 m of inner height, with built-in tack space. The 1,670 kg unladen weight is the highest in the Traveller range: holding a 4.58 m compartment at 2.40 m of height demands a structure to match. The angled layout spreads weight more evenly than three parallel places.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Los 3.500 kg de MMA exigen permiso B+E, con un conjunto que puede llegar a 7.000 kg y un vehículo tractor de hasta 3.500 kg de masa máxima autorizada. Con 4,58 m de habitáculo y 2 m de ancho, este conjunto pide un vehículo de distancia entre ejes generosa y espejos de extensión. Consúltanos si tienes dudas sobre la compatibilidad con tu coche.",
        bodyEn: "The 3,500 kg gross weight requires a B+E licence, with a combination that can reach 7,000 kg and a towing vehicle up to 3,500 kg gross. With a 4.58 m compartment and 2 m of width, this combination calls for a vehicle with a generous wheelbase and extension mirrors. Ask us if you have any doubt about compatibility with your car.",
      },
      {
        heading: "Equipamiento",
        headingEn: "Equipment",
        body: "Separadores para tres plazas en oblicuo y espacio de sillas, de serie. Si necesitas cuatro o cinco animales con esta misma altura, las versiones W comparten las medidas con esa configuración. Arcón, ventilación adicional, rueda de repuesto y espejos de extensión se concretan en el pedido con el plazo del fabricante.",
        bodyEn: "Partitions for three angled places and tack space, as standard. If you need four or five animals at this same height, the W versions share the dimensions in that configuration. Chest, extra ventilation, spare wheel and extension mirrors are settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 3,
      mmaKg: 3500,
      taraKg: 1670,
      cargaUtilKg: 1830,
      largoInteriorCm: 458,
      anchoInteriorCm: 200,
      altoInteriorCm: 240,
    },
    sourceRef: `${BOECK}/traveller`,
  },

  {
    slug: "bk-traveller-w4",
    brand: "Böckmann",
    name: "Traveller W4 y W3 Big SK",
    nameEn: "Traveller W4 and W3 Big SK",
    sku: "BK-TRW4-4",
    shortDescription:
      "Van de cuatro a cinco caballos en oblicuo, con 2,40 m de altura interior. MMA de 3.500 kg y 1.880 kg de carga útil.",
    shortDescriptionEn:
      "Trailer for four to five horses at an angle, with 2.40 m inner height. 3,500 kg gross weight and 1,880 kg payload.",
    bullets: [
      "De cuatro a cinco caballos, en transporte oblicuo",
      "MMA 3.500 kg, tara 1.620 kg, carga útil 1.880 kg",
      "Interior de 4,58 × 2,00 × 2,40 m",
      "Altura de 2,40 m: apta para caballos de gran alzada",
      "Permiso B+E con vehículo de hasta 3.500 kg de MMA",
    ],
    bulletsEn: [
      "Four to five horses, carried at an angle",
      "3,500 kg gross weight, 1,620 kg unladen, 1,880 kg payload",
      "Inner space of 4.58 × 2.00 × 2.40 m",
      "2.40 m height: suited to tall horses",
      "B+E licence with a towing vehicle up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Es el mayor Traveller: cuatro a cinco caballos de gran alzada en 4,58 m, con 2,40 m de altura interior. Se dirige a centros hípicos y transportistas que mueven un grupo completo. La carga útil de 1.880 kg repartida entre cinco animales deja 376 kg por plaza: con caballos adultos de 550 kg, la cuenta no sale, y hay que limitarse a cuatro.",
        bodyEn: "This is the largest Traveller: four to five tall horses in 4.58 m, with 2.40 m of inner height. It is aimed at equestrian centres and hauliers moving a full group. The 1,880 kg payload split among five animals leaves 376 kg per place: with adult 550 kg horses the sums do not work, and it must be limited to four.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Carrocería de aluminio, 2 m de ancho y 2,40 m de altura interior, con espacio de sillas. Los 1.620 kg de tara son cincuenta menos que el Traveller G3 de idénticas medidas exteriores, diferencia que viene de la configuración interior. La disposición oblicua es lo que permite cinco plazas en una longitud que en paralelo daría tres.",
        bodyEn: "Aluminium body, 2 m wide and 2.40 m of inner height, with tack space. The 1,620 kg unladen weight is fifty less than the Traveller G3 of identical outer dimensions, a difference coming from the interior layout. The angled arrangement is what allows five places in a length that would give three in parallel.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 3.500 kg de MMA, el permiso B+E es obligatorio: el conjunto puede llegar a 7.000 kg con un vehículo tractor de hasta 3.500 kg de masa máxima autorizada. Antes de encargar, verifica la masa remolcable con freno de tu vehículo en el apartado O.1: pocos coches alcanzan los 3.500 kg fuera de los todoterreno y las pick-up.",
        bodyEn: "At 3,500 kg gross, a B+E licence is compulsory: the combination can reach 7,000 kg with a towing vehicle up to 3,500 kg gross. Before ordering, check your vehicle's braked towable mass in section O.1: few cars reach 3,500 kg outside of 4x4s and pick-ups.",
      },
      {
        heading: "Configuraciones y equipamiento",
        headingEn: "Configurations and equipment",
        body: "Dos configuraciones de idénticas medidas y carga útil, la W4 y la W3 Big SK, que se diferencian en la disposición de acceso. Separadores para transporte oblicuo y espacio de sillas, de serie. Haz la cuenta del peso de tus animales antes de decidir el número de plazas: es la única cifra que decide. Presupuesto y plazo se concretan en el pedido.",
        bodyEn: "Two configurations with identical dimensions and payload, the W4 and the W3 Big SK, differing in access layout. Partitions for angled transport and tack space, as standard. Do the sums on your animals' weight before deciding the number of places: it is the only figure that decides. Quote and lead time are settled at order time.",
      },
    ],
    specs: {
      plazas: 4,
      mmaKg: 3500,
      taraKg: 1620,
      cargaUtilKg: 1880,
      largoInteriorCm: 458,
      anchoInteriorCm: 200,
      altoInteriorCm: 240,
    },
    sourceRef: `${BOECK}/traveller`,
  },
];
