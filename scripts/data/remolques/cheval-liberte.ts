import type { FichaRemolque } from "./tipos";

/**
 * Gamme Cheval Liberté distribuée en Espagne.
 *
 * Masses et dimensions relevées sur les fiches techniques d'Equus Life,
 * distributeur officiel de la marque en Espagne, en août 2026. Chaque entrée
 * porte l'adresse de sa source dans `sourceRef`.
 *
 * DEUX CONVENTIONS, à connaître avant de corriger un chiffre ici :
 *
 * 1. Quand la source publie la tara en fourchette — le montage d'usine la fait
 *    varier — on retient la valeur HAUTE. La charge utile annoncée est donc la
 *    plus basse des deux, jamais surestimée. Annoncer 1 750 kg quand le client
 *    n'en a que 1 700 serait une information trompeuse au sens du TRLGDCU.
 *
 * 2. Le nombre d'essieux et le type de freinage ne sont pas publiés fiche par
 *    fiche : ils sont donc absents plutôt qu'approximés, et leur ligne
 *    disparaît du tableau technique.
 *
 * Les textes sont rédigés ici. Aucune phrase n'est reprise du constructeur ni
 * du distributeur : la contrefaçon d'un côté, le contenu dupliqué de l'autre.
 * Chaque affirmation se déduit des caractéristiques relevées.
 */

/** Source commune des relevés, reprise dans chaque fiche. */
const EQUUS = "https://equus-life.com/producto";

export const CHEVAL_LIBERTE: readonly FichaRemolque[] = [
  // ---------------------------------------------------------------- 1 caballo
  {
    slug: "cl-gold-one-origins",
    slugExistente: "cheval-liberte-gold-one-origins",
    brand: "Cheval Liberté",
    name: "Gold One Origins",
    nameEn: "Gold One Origins",
    sku: "CL-GOO-1",
    shortDescription:
      "Van de un caballo con 1.600 kg de MMA y 950 kg de carga útil. Su masa contenida lo deja al alcance del permiso B con la mayoría de los turismos medianos.",
    shortDescriptionEn:
      "Single-horse trailer with a 1,600 kg gross weight and 950 kg payload. Its contained mass keeps it within reach of a category B licence with most mid-size cars.",
    bullets: [
      "Un caballo, o un caballo y un potro",
      "MMA 1.600 kg, tara 650 kg, carga útil 950 kg",
      "Interior de 3,17 × 1,33 × 2,34 m",
      "Suelo y paredes de aluminio con goma antideslizante de 8 mm",
      "Permiso B con vehículo de hasta 1.900 kg de MMA",
    ],
    bulletsEn: [
      "One horse, or one horse and a foal",
      "1,600 kg gross weight, 650 kg unladen, 950 kg payload",
      "Inner space of 3.17 × 1.33 × 2.34 m",
      "Aluminium floor and walls with 8 mm anti-slip rubber",
      "Category B licence with a towing vehicle up to 1,900 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Este van responde a quien mueve un solo caballo con regularidad: clases, concursos de fin de semana, visitas al veterinario. Con 3,17 m de largo interior admite un caballo adulto, o un caballo acompañado de un potro cuando se retira el separador. Los 950 kg de carga útil dejan margen para el animal, la silla, el equipo y una reserva de agua sin acercarse al límite legal, cosa que conviene comprobar en báscula la primera vez que se carga.",
        bodyEn: "This trailer suits anyone moving a single horse regularly: lessons, weekend competitions, veterinary visits. Its 3.17 m inner length takes an adult horse, or a horse together with a foal once the partition is removed. The 950 kg payload leaves room for the animal, the saddle, the equipment and a water reserve without approaching the legal limit, which is worth checking on a weighbridge the first time you load.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo y paredes de aluminio, revestidos con una goma antideslizante de 8 mm. El aluminio no se pudre y no gana peso con la humedad, a diferencia de un tablero de madera que absorbe orina y agua de lavado a lo largo de los años. Esa diferencia se nota en la tara, que se mantiene en 650 kg, y también en el mantenimiento: el suelo se revisa, no se sustituye. La altura interior de 2,34 m evita que un caballo de alzada media roce el techo al levantar la cabeza.",
        bodyEn: "Aluminium floor and walls, covered with 8 mm anti-slip rubber. Aluminium does not rot and does not gain weight with damp, unlike a wooden deck that absorbs urine and wash water over the years. That difference shows in the unladen weight, held at 650 kg, and in maintenance too: the floor gets inspected, not replaced. The 2.34 m inner height keeps a medium-height horse from brushing the roof when it lifts its head.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 1.600 kg de MMA, este van se queda dentro del permiso B siempre que el vehículo tractor no supere 1.900 kg de masa máxima autorizada, porque el conjunto no puede pasar de 3.500 kg. Esa cifra deja fuera a pocos turismos medianos y a la mayoría de los SUV compactos. Con permiso B96 el margen sube hasta 2.650 kg de vehículo, y con B+E hasta 3.500 kg. La MMA de tu coche figura en el apartado F.1 de su ficha técnica, no en el peso que marca la báscula.",
        bodyEn: "At 1,600 kg gross, this trailer stays within a category B licence provided the towing vehicle does not exceed 1,900 kg gross, since the combination may not pass 3,500 kg. That figure rules out few mid-size cars and most compact SUVs. A B96 licence raises the margin to 2,650 kg of vehicle, and B+E to 3,500 kg. Your car's gross weight is in section F.1 of its registration document, not the figure on the weighbridge.",
      },
      {
        heading: "Equipamiento de serie",
        headingEn: "Standard equipment",
        body: "El van sale de fábrica con la goma antideslizante de 8 mm ya colocada sobre el suelo de aluminio y con las paredes interiores protegidas en toda la altura de contacto del animal. La configuración de un caballo deja el ancho interior de 1,33 m libre de separador central, lo que facilita subir y bajar sin maniobras. El resto del equipamiento, desde el arcón delantero hasta la rueda de repuesto, se define en el pedido: dinos el uso que le vas a dar y te preparamos la configuración.",
        bodyEn: "The trailer leaves the factory with the 8 mm anti-slip rubber already fitted over the aluminium floor and the inner walls protected across the full height the horse can reach. The single-horse layout leaves the 1.33 m inner width free of a central partition, which makes loading and unloading straightforward. The rest of the equipment, from the front chest to the spare wheel, is set at order time: tell us how you will use it and we will prepare the configuration.",
      },
    ],
    specs: {
      plazas: 1,
      mmaKg: 1600,
      taraKg: 650,
      cargaUtilKg: 950,
      largoInteriorCm: 317,
      anchoInteriorCm: 133,
      altoInteriorCm: 234,
      suelo: "Aluminio con goma antideslizante de 8 mm",
    },
    sourceRef: `${EQUUS}/gold-one/`,
  },

  {
    slug: "cl-gold-touring-one",
    slugExistente: "cheval-liberte-touring-one",
    brand: "Cheval Liberté",
    name: "Gold Touring One",
    nameEn: "Gold Touring One",
    sku: "CL-GTO-1",
    shortDescription:
      "Van de un caballo con 3,34 m de largo interior, el más espacioso de la gama de una plaza. MMA de 1.600 kg y 835 kg de carga útil.",
    shortDescriptionEn:
      "Single-horse trailer with a 3.34 m inner length, the roomiest of the one-horse range. 1,600 kg gross weight and 835 kg payload.",
    bullets: [
      "Un caballo, o un caballo y un potro",
      "MMA 1.600 kg, tara 765 kg, carga útil 835 kg",
      "Interior de 3,34 × 1,37 × 2,34 m",
      "Suelo de aluminio con goma antideslizante de 8 mm",
      "Permiso B con vehículo de hasta 1.900 kg de MMA",
    ],
    bulletsEn: [
      "One horse, or one horse and a foal",
      "1,600 kg gross weight, 765 kg unladen, 835 kg payload",
      "Inner space of 3.34 × 1.37 × 2.34 m",
      "Aluminium floor with 8 mm anti-slip rubber",
      "Category B licence with a towing vehicle up to 1,900 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Diecisiete centímetros más largo y cuatro más ancho que el Gold One Origins, este van gana holgura donde importa: un caballo de alzada alta viaja con más sitio delante y detrás. La contrapartida está en la tara, 115 kg superior, que se descuenta de la carga útil. Con 835 kg disponibles sigue habiendo margen suficiente para un caballo adulto y su equipo, pero conviene pesar el conjunto cargado si viajas con dos animales pequeños.",
        bodyEn: "Seventeen centimetres longer and four wider than the Gold One Origins, this trailer gains room where it counts: a tall horse travels with more space fore and aft. The trade-off is the unladen weight, 115 kg higher, which comes off the payload. With 835 kg available there is still enough margin for an adult horse and its equipment, but it is worth weighing the loaded combination if you travel with two small animals.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo de aluminio cubierto con goma antideslizante de 8 mm, la misma solución que el resto de la gama Gold. La altura interior de 2,34 m se mantiene pese al mayor largo, de modo que el caballo conserva su espacio vertical. El aluminio evita el ciclo de degradación propio de los suelos de madera, que absorben líquidos y obligan a una sustitución periódica cuyo coste supera con creces la diferencia de precio inicial.",
        bodyEn: "Aluminium floor covered with 8 mm anti-slip rubber, the same solution as the rest of the Gold range. The 2.34 m inner height is kept despite the greater length, so the horse retains its vertical space. Aluminium avoids the decay cycle typical of wooden floors, which absorb liquids and call for periodic replacement whose cost far exceeds the initial price difference.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "La MMA de 1.600 kg sitúa este van en el mismo escalón que el Gold One Origins: permiso B con un vehículo de hasta 1.900 kg de masa máxima autorizada, B96 hasta 2.650 kg, B+E hasta 3.500 kg. El límite lo marca siempre la suma de las dos masas máximas, no lo que pesa el conjunto el día del viaje. Un coche cargado por debajo de su máximo no amplía el margen legal: la Guardia Civil compara fichas técnicas, no básculas.",
        bodyEn: "The 1,600 kg gross weight puts this trailer on the same step as the Gold One Origins: category B with a vehicle up to 1,900 kg gross, B96 up to 2,650 kg, B+E up to 3,500 kg. The limit is always the sum of the two maximum masses, not what the combination weighs on the day. A car loaded below its maximum does not widen the legal margin: the authorities compare registration documents, not weighbridges.",
      },
      {
        heading: "Equipamiento de serie",
        headingEn: "Standard equipment",
        body: "Goma antideslizante de 8 mm sobre suelo de aluminio y protecciones interiores en las paredes, montadas de fábrica. El ancho interior de 1,37 m permite instalar un separador para dos animales pequeños, aunque la homologación del van es de una plaza y la carga útil manda. Las opciones de arcón, ventilación adicional, rueda de repuesto y acabado exterior se concretan en el pedido; escríbenos y te preparamos la configuración con el plazo del fabricante.",
        bodyEn: "Eight-millimetre anti-slip rubber over an aluminium floor and inner wall protection, factory fitted. The 1.37 m inner width allows a partition for two small animals, though the trailer is homologated for one place and the payload has the last word. Chest, extra ventilation, spare wheel and exterior finish are settled at order time; write to us and we will prepare the configuration with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 1,
      mmaKg: 1600,
      taraKg: 765,
      cargaUtilKg: 835,
      largoInteriorCm: 334,
      anchoInteriorCm: 137,
      altoInteriorCm: 234,
      suelo: "Aluminio con goma antideslizante de 8 mm",
    },
    sourceRef: `${EQUUS}/gold-touring-one/`,
  },

  // --------------------------------------------------------------- 2 caballos
  {
    slug: "cl-gold-origins",
    slugExistente: "cheval-liberte-gold-origins",
    brand: "Cheval Liberté",
    name: "Gold Origins",
    nameEn: "Gold Origins",
    sku: "CL-GO-2",
    shortDescription:
      "Van de dos caballos con 2.000 kg de MMA, la entrada de gama de dos plazas. Es el único modelo de dos caballos que un turismo de 1.500 kg puede remolcar con permiso B.",
    shortDescriptionEn:
      "Two-horse trailer with a 2,000 kg gross weight, the entry point of the two-place range. It is the only two-horse model a 1,500 kg car can tow on a category B licence.",
    bullets: [
      "Dos caballos",
      "MMA 2.000 kg, tara 790 kg, carga útil 1.210 kg",
      "Interior de 3,17 × 1,66 × 2,35 m",
      "Suelo de tablero finlandés de 21 mm o de aluminio, según acabado",
      "Permiso B con vehículo de hasta 1.500 kg de MMA",
    ],
    bulletsEn: [
      "Two horses",
      "2,000 kg gross weight, 790 kg unladen, 1,210 kg payload",
      "Inner space of 3.17 × 1.66 × 2.35 m",
      "Finnish plywood floor of 21 mm or aluminium, depending on finish",
      "Category B licence with a towing vehicle up to 1,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Este es el van de dos plazas que resuelve un problema concreto: remolcar dos caballos sin cambiar de permiso ni de coche. Su MMA de 2.000 kg, seiscientos kilos por debajo del resto de la gama de dos plazas, es lo que lo hace posible. La carga útil de 1.210 kg admite dos caballos ligeros o de talla media con su equipo. Dos caballos de tiro o de gran alzada superan esa cifra, y entonces el modelo adecuado es uno de 2.600 kg.",
        bodyEn: "This is the two-place trailer that solves a specific problem: towing two horses without changing licence or car. Its 2,000 kg gross weight, six hundred kilos below the rest of the two-place range, is what makes that possible. The 1,210 kg payload takes two light or medium horses with their equipment. Two draught or very tall horses exceed that figure, and then the right model is a 2,600 kg one.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "El suelo varía con el acabado: tablero finlandés de 21 mm con goma antideslizante de 8 mm en las versiones básica y premium, aluminio con la misma goma en la versión Aluline. El tablero finlandés es una madera contrachapada de alta densidad, resistente pero sensible a la humedad prolongada; el aluminio no lo es. La diferencia se paga al comprar y se recupera en la vida útil del suelo, sobre todo si el van duerme a la intemperie.",
        bodyEn: "The floor varies with the finish: 21 mm Finnish plywood with 8 mm anti-slip rubber on the basic and premium versions, aluminium with the same rubber on the Aluline version. Finnish plywood is a high-density laminate, sturdy but sensitive to prolonged damp; aluminium is not. The difference is paid at purchase and recovered over the floor's service life, especially if the trailer is kept outdoors.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.000 kg de MMA, el conjunto se mantiene bajo 3.500 kg mientras el vehículo tractor no pase de 1.500 kg de masa máxima autorizada. Ese umbral deja fuera a la mayoría de los SUV, que rondan los 2.000 kg, pero admite turismos compactos y familiares. Con B96 el margen sube a 2.250 kg de vehículo, y con B+E a 3.500 kg. Antes de decidir, mira el apartado F.1 de tu ficha técnica: es la cifra que cuenta, no la del peso en vacío.",
        bodyEn: "At 2,000 kg gross, the combination stays under 3,500 kg as long as the towing vehicle does not exceed 1,500 kg gross. That threshold rules out most SUVs, which sit around 2,000 kg, but takes compact cars and estates. With B96 the margin rises to 2,250 kg of vehicle, and with B+E to 3,500 kg. Before deciding, look at section F.1 of your registration document: that is the figure that counts, not the kerb weight.",
      },
      {
        heading: "Equipamiento de serie",
        headingEn: "Standard equipment",
        body: "Separador central para dos plazas, goma antideslizante de 8 mm y protecciones interiores en las paredes. El ancho interior de 1,66 m reparte 83 cm por animal, medida estándar para caballos de talla media. La altura de 2,35 m es la mayor de la gama de entrada. El acabado, básico, premium o Aluline, decide el material del suelo y los detalles de terminación: dinos cuál te interesa y te pasamos el presupuesto con el plazo de fábrica.",
        bodyEn: "Central partition for two places, 8 mm anti-slip rubber and inner wall protection. The 1.66 m inner width gives 83 cm per animal, a standard measure for medium horses. The 2.35 m height is the tallest in the entry range. The finish, basic, premium or Aluline, decides the floor material and the trim details: tell us which one interests you and we will send the quote with the factory lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2000,
      taraKg: 790,
      cargaUtilKg: 1210,
      largoInteriorCm: 317,
      anchoInteriorCm: 166,
      altoInteriorCm: 235,
      suelo: "Tablero finlandés de 21 mm o aluminio, con goma antideslizante de 8 mm",
    },
    sourceRef: `${EQUUS}/remolque-gold-origins/`,
  },

  {
    slug: "cl-gold-3",
    slugExistente: "cheval-liberte-gold-3",
    brand: "Cheval Liberté",
    name: "Gold 3",
    nameEn: "Gold 3",
    sku: "CL-G3-2",
    shortDescription:
      "Van de dos caballos con 2.600 kg de MMA y 1.780 kg de carga útil, la mayor de la gama de dos plazas. Exige permiso B96 o B+E.",
    shortDescriptionEn:
      "Two-horse trailer with a 2,600 kg gross weight and 1,780 kg payload, the highest in the two-place range. Requires a B96 or B+E licence.",
    bullets: [
      "Dos caballos",
      "MMA 2.600 kg, tara 820 kg, carga útil 1.780 kg",
      "Interior de 3,17 × 1,60 × 2,34 m",
      "Suelo de aluminio con goma antideslizante de 8 mm",
      "Permiso B96 con vehículo de hasta 1.650 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,600 kg gross weight, 820 kg unladen, 1,780 kg payload",
      "Inner space of 3.17 × 1.60 × 2.34 m",
      "Aluminium floor with 8 mm anti-slip rubber",
      "B96 licence with a vehicle up to 1,650 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Con 1.780 kg de carga útil, este van es el que más peso admite de toda la gama de dos plazas, y lo consigue con una tara de solo 820 kg. Es la combinación que buscan quienes transportan dos caballos de gran alzada, o dos caballos con equipo pesado para varios días de concurso. El margen que deja evita el cálculo angustioso antes de cada salida: con dos animales de 600 kg todavía quedan casi 600 kg para todo lo demás.",
        bodyEn: "With 1,780 kg of payload, this trailer carries more weight than any other in the two-place range, and does it with an unladen weight of only 820 kg. It is the combination sought by those transporting two tall horses, or two horses with heavy equipment for a multi-day competition. The margin it leaves avoids the anxious calculation before every trip: with two 600 kg animals there are still nearly 600 kg left for everything else.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo de aluminio con goma antideslizante de 8 mm. Los 820 kg de tara son notables para un van homologado a 2.600 kg: es el aluminio quien lo permite, tanto en el suelo como en las paredes. Un van de dimensiones parecidas con suelo de madera pesa entre cien y ciento cincuenta kilos más, y esos kilos salen directamente de la carga útil. La altura interior de 2,34 m y el ancho de 1,60 m corresponden a dos plazas de 80 cm.",
        bodyEn: "Aluminium floor with 8 mm anti-slip rubber. The 820 kg unladen weight is remarkable for a trailer rated at 2,600 kg: aluminium is what makes it possible, in the floor and in the walls. A trailer of similar size with a wooden floor weighs a hundred to a hundred and fifty kilos more, and those kilos come straight out of the payload. The 2.34 m inner height and 1.60 m width correspond to two 80 cm places.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Los 2.600 kg de MMA dejan este van fuera del permiso B en la práctica: el conjunto solo se mantendría bajo 3.500 kg con un vehículo de 900 kg, masa que ningún turismo actual respeta. Con B96 el conjunto llega a 4.250 kg, lo que admite un vehículo de hasta 1.650 kg; con B+E, hasta 3.500 kg de vehículo. Si tu permiso es solo B, el modelo que corresponde es el Gold Origins, de 2.000 kg de MMA.",
        bodyEn: "The 2,600 kg gross weight puts this trailer outside a category B licence in practice: the combination would only stay under 3,500 kg with a 900 kg vehicle, a mass no current car meets. With B96 the combination reaches 4,250 kg, allowing a vehicle up to 1,650 kg; with B+E, up to 3,500 kg of vehicle. If your licence is category B only, the matching model is the Gold Origins, rated at 2,000 kg.",
      },
      {
        heading: "Equipamiento de serie",
        headingEn: "Standard equipment",
        body: "Separador central, goma antideslizante de 8 mm sobre suelo de aluminio y protecciones interiores en las paredes en toda la altura de contacto. La configuración de dos plazas viene montada de fábrica y el separador se retira para transportar un solo animal con holgura. Arcón delantero, rueda de repuesto, ventilación adicional y acabado exterior se definen en el pedido: cuéntanos tu uso y te preparamos el presupuesto en firme.",
        bodyEn: "Central partition, 8 mm anti-slip rubber over an aluminium floor and inner wall protection across the full contact height. The two-place layout comes factory fitted and the partition lifts out to carry a single animal with room to spare. Front chest, spare wheel, extra ventilation and exterior finish are settled at order time: tell us your use and we will prepare a firm quote.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2600,
      taraKg: 820,
      cargaUtilKg: 1780,
      largoInteriorCm: 317,
      anchoInteriorCm: 160,
      altoInteriorCm: 234,
      suelo: "Aluminio con goma antideslizante de 8 mm",
    },
    sourceRef: `${EQUUS}/gold-3/`,
  },

  {
    slug: "cl-gold-marathon",
    slugExistente: "cheval-liberte-gold-marathon",
    brand: "Cheval Liberté",
    name: "Gold Marathon",
    nameEn: "Gold Marathon",
    sku: "CL-GM-2",
    shortDescription:
      "Van de dos caballos con 2.600 kg de MMA y 1.650 kg de carga útil. Mismas medidas interiores que el Gold 3, con una tara superior.",
    shortDescriptionEn:
      "Two-horse trailer with a 2,600 kg gross weight and 1,650 kg payload. Same inner dimensions as the Gold 3, with a higher unladen weight.",
    bullets: [
      "Dos caballos",
      "MMA 2.600 kg, tara 950 kg, carga útil 1.650 kg",
      "Interior de 3,17 × 1,60 × 2,34 m",
      "Suelo de aluminio con goma antideslizante de 8 mm",
      "Permiso B96 con vehículo de hasta 1.650 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,600 kg gross weight, 950 kg unladen, 1,650 kg payload",
      "Inner space of 3.17 × 1.60 × 2.34 m",
      "Aluminium floor with 8 mm anti-slip rubber",
      "B96 licence with a vehicle up to 1,650 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "El Marathon comparte medidas interiores con el Gold 3 y se separa de él por la tara: 950 kg frente a 820. Esos 130 kg de diferencia corresponden a refuerzos y equipamiento montados de fábrica, y se descuentan de la carga útil, que queda en 1.650 kg. Sigue siendo holgada para dos caballos de talla media con su equipo. Si transportas dos animales pesados de forma habitual, compara antes las dos fichas: la elección se juega en esos kilos.",
        bodyEn: "The Marathon shares its inner dimensions with the Gold 3 and differs in unladen weight: 950 kg against 820. Those 130 kg correspond to factory-fitted reinforcement and equipment, and come off the payload, which stands at 1,650 kg. That remains ample for two medium horses with their gear. If you regularly carry two heavy animals, compare the two specifications first: the choice turns on those kilos.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo de aluminio recubierto de goma antideslizante de 8 mm, como el resto de la gama Gold. El interior mide 3,17 m de largo por 1,60 de ancho y 2,34 de alto, lo que reparte dos plazas de 80 cm con altura suficiente para caballos de alzada media. El aluminio del suelo no absorbe humedad ni orina, de modo que la tara se mantiene estable con los años en lugar de aumentar, como ocurre con un tablero de madera saturado.",
        bodyEn: "Aluminium floor covered with 8 mm anti-slip rubber, like the rest of the Gold range. The interior measures 3.17 m long by 1.60 wide and 2.34 high, giving two 80 cm places with enough height for medium horses. The aluminium floor absorbs neither damp nor urine, so the unladen weight stays stable over the years instead of creeping up, as happens with a saturated wooden deck.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Como todos los vanes de 2.600 kg de MMA, este queda fuera del permiso B en la práctica: haría falta un vehículo tractor de 900 kg para no pasar de 3.500 kg de conjunto. Con permiso B96 el conjunto llega a 4.250 kg y admite un vehículo de hasta 1.650 kg de masa máxima; con B+E, hasta 3.500 kg. Conviene comprobar además la masa remolcable que autoriza tu vehículo, que figura en los apartados O.1 y O.2 de su ficha técnica.",
        bodyEn: "Like every 2,600 kg trailer, this one falls outside a category B licence in practice: it would take a 900 kg towing vehicle to stay under 3,500 kg for the combination. With a B96 licence the combination reaches 4,250 kg and takes a vehicle up to 1,650 kg gross; with B+E, up to 3,500 kg. It is also worth checking the towable mass your vehicle allows, shown in sections O.1 and O.2 of its registration document.",
      },
      {
        heading: "Equipamiento de serie",
        headingEn: "Standard equipment",
        body: "Separador central para las dos plazas, goma antideslizante de 8 mm y protecciones interiores en las paredes. Los 130 kg que separan la tara del Marathon de la del Gold 3 corresponden a elementos ya montados: es equipamiento que no habrá que añadir después. El detalle de lo que incluye cada acabado, junto con las opciones de arcón, ventilación y rueda de repuesto, se concreta en el pedido con el plazo del fabricante.",
        bodyEn: "Central partition for both places, 8 mm anti-slip rubber and inner wall protection. The 130 kg separating the Marathon's unladen weight from the Gold 3's correspond to items already fitted: equipment you will not need to add later. What each finish includes, together with the chest, ventilation and spare wheel options, is settled at order time with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2600,
      taraKg: 950,
      cargaUtilKg: 1650,
      largoInteriorCm: 317,
      anchoInteriorCm: 160,
      altoInteriorCm: 234,
      suelo: "Aluminio con goma antideslizante de 8 mm",
    },
    sourceRef: `${EQUUS}/remolque-de-2-caballos-gold-marathon/`,
  },

  {
    slug: "cl-gold-touring-country",
    slugExistente: "cheval-liberte-touring-country-2",
    brand: "Cheval Liberté",
    name: "Gold Touring Country",
    nameEn: "Gold Touring Country",
    sku: "CL-GTC-2",
    shortDescription:
      "Van de dos caballos con rampa frontal y 1,68 m de ancho interior. MMA de 2.600 kg y 1.700 kg de carga útil.",
    shortDescriptionEn:
      "Two-horse trailer with a front ramp and 1.68 m inner width. 2,600 kg gross weight and 1,700 kg payload.",
    bullets: [
      "Dos caballos",
      "MMA 2.600 kg, tara 900 kg, carga útil 1.700 kg",
      "Interior de 3,31 × 1,68 × 2,31 m",
      "Suelo de aluminio con goma antideslizante de 8 mm",
      "Permiso B96 con vehículo de hasta 1.650 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,600 kg gross weight, 900 kg unladen, 1,700 kg payload",
      "Inner space of 3.31 × 1.68 × 2.31 m",
      "Aluminium floor with 8 mm anti-slip rubber",
      "B96 licence with a vehicle up to 1,650 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Los 1,68 m de ancho interior son la cifra que distingue a este van: ocho centímetros más que el Gold 3, repartidos entre las dos plazas. Para caballos anchos de grupa esa diferencia se nota en cada viaje. El largo interior de 3,31 m acompaña la medida. Con 1.700 kg de carga útil admite dos animales de talla grande y su equipo, y sigue siendo el modelo que eligen quienes hacen desplazamientos largos con regularidad.",
        bodyEn: "The 1.68 m inner width is the figure that sets this trailer apart: eight centimetres more than the Gold 3, shared between the two places. For broad-hindquartered horses that difference tells on every trip. The 3.31 m inner length matches it. With 1,700 kg of payload it takes two large animals and their equipment, and it remains the model chosen by those making long journeys regularly.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo de aluminio con goma antideslizante de 8 mm. La altura interior de 2,31 m es ligeramente inferior a la de otros modelos de la gama, contrapartida del mayor ancho: conviene comprobarla si tus caballos superan la alzada media. La tara de 900 kg se sitúa entre la del Gold 3 y la del Marathon, y deja 1.700 kg de carga útil, cifra que cubre con margen dos caballos adultos, sillas, mantas y agua para una jornada completa.",
        bodyEn: "Aluminium floor with 8 mm anti-slip rubber. The 2.31 m inner height is slightly lower than other models in the range, the counterpart of the greater width: worth checking if your horses are taller than average. The 900 kg unladen weight sits between the Gold 3 and the Marathon, leaving 1,700 kg of payload, a figure that covers two adult horses, saddles, rugs and water for a full day with margin.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.600 kg de MMA, el permiso B queda descartado en la práctica: exigiría un vehículo tractor de 900 kg. Con B96 el conjunto llega a 4.250 kg, lo que admite un vehículo de hasta 1.650 kg de masa máxima autorizada; con B+E, hasta 3.500 kg de vehículo. El B96 se obtiene con un curso y una prueba de circulación, sin examen teórico: para muchos compradores es el paso más corto hacia este van.",
        bodyEn: "At 2,600 kg gross, a category B licence is ruled out in practice: it would call for a 900 kg towing vehicle. With B96 the combination reaches 4,250 kg, allowing a vehicle up to 1,650 kg gross; with B+E, up to 3,500 kg of vehicle. B96 is obtained through a course and a driving test, with no theory exam: for many buyers it is the shortest path to this trailer.",
      },
      {
        heading: "Equipamiento de serie",
        headingEn: "Standard equipment",
        body: "Separador central, goma antideslizante de 8 mm sobre suelo de aluminio y protecciones interiores en las paredes. El ancho de 1,68 m reparte 84 cm por plaza, medida cómoda para caballos de grupa ancha. La rampa frontal, característica de la línea Touring, facilita la salida del animal sin necesidad de hacerlo retroceder. Las opciones de acabado, arcón y ventilación se concretan en el pedido junto con el plazo de fábrica.",
        bodyEn: "Central partition, 8 mm anti-slip rubber over an aluminium floor and inner wall protection. The 1.68 m width gives 84 cm per place, a comfortable measure for broad-hindquartered horses. The front ramp, characteristic of the Touring line, lets the animal walk out without being backed down. Finish, chest and ventilation options are settled at order time along with the factory lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2600,
      taraKg: 900,
      cargaUtilKg: 1700,
      largoInteriorCm: 331,
      anchoInteriorCm: 168,
      altoInteriorCm: 231,
      suelo: "Aluminio con goma antideslizante de 8 mm",
    },
    sourceRef: `${EQUUS}/gold-touring-country/`,
  },

  {
    slug: "cl-gold-touring-jumping",
    slugExistente: "cheval-liberte-touring-jumping",
    brand: "Cheval Liberté",
    name: "Gold Touring Jumping",
    nameEn: "Gold Touring Jumping",
    sku: "CL-GTJ-2",
    shortDescription:
      "Van de dos caballos con 2,38 m de altura interior y 1.750 kg de carga útil. Pensado para caballos de salto y alzada alta.",
    shortDescriptionEn:
      "Two-horse trailer with a 2.38 m inner height and 1,750 kg payload. Designed for jumpers and tall horses.",
    bullets: [
      "Dos caballos",
      "MMA 2.600 kg, tara 850 kg, carga útil 1.750 kg",
      "Interior de 3,31 × 1,68 × 2,38 m",
      "Suelo de aluminio con goma antideslizante de 8 mm",
      "Permiso B96 con vehículo de hasta 1.650 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,600 kg gross weight, 850 kg unladen, 1,750 kg payload",
      "Inner space of 3.31 × 1.68 × 2.38 m",
      "Aluminium floor with 8 mm anti-slip rubber",
      "B96 licence with a vehicle up to 1,650 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Siete centímetros más alto que el Touring Country, con el mismo largo y el mismo ancho. Esos 2,38 m de altura interior son la razón de ser del modelo: un caballo de salto de alzada alta viaja sin rozar el techo cuando levanta la cabeza, cosa que ocurre en cada frenada. Con 1.750 kg de carga útil y una tara de solo 850 kg, es el van de la línea Touring que más margen deja para el equipo de concurso.",
        bodyEn: "Seven centimetres taller than the Touring Country, with the same length and width. Those 2.38 m of inner height are the model's reason for being: a tall jumper travels without brushing the roof when it lifts its head, which happens at every braking. With 1,750 kg of payload and an unladen weight of only 850 kg, it is the Touring line trailer that leaves the most room for competition equipment.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo de aluminio recubierto con goma antideslizante de 8 mm. La tara de 850 kg es notable dada la altura del habitáculo: mantener 2,38 m de alto sin engordar la estructura es lo que separa a este modelo de sus equivalentes con paredes de madera, que pagan la misma altura con cien kilos más. El ancho interior de 1,68 m reparte 84 cm por plaza, suficiente para caballos de grupa ancha.",
        bodyEn: "Aluminium floor covered with 8 mm anti-slip rubber. The 850 kg unladen weight is remarkable given the height of the compartment: keeping 2.38 m of headroom without fattening the structure is what separates this model from wooden-walled equivalents, which pay for the same height with a hundred extra kilos. The 1.68 m inner width gives 84 cm per place, enough for broad-hindquartered horses.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "La MMA de 2.600 kg deja el permiso B fuera de alcance en la práctica, ya que obligaría a un vehículo tractor de 900 kg. Con B96 el conjunto puede llegar a 4.250 kg, lo que admite un vehículo de hasta 1.650 kg; con B+E, hasta 3.500 kg de vehículo. Comprueba también la masa remolcable máxima con freno que autoriza tu coche: figura en el apartado O.1 de su ficha técnica y a veces es más restrictiva que el propio permiso.",
        bodyEn: "The 2,600 kg gross weight puts a category B licence out of practical reach, since it would require a 900 kg towing vehicle. With B96 the combination can reach 4,250 kg, allowing a vehicle up to 1,650 kg; with B+E, up to 3,500 kg of vehicle. Also check the maximum braked towable mass your car allows: it is in section O.1 of its registration document and is sometimes stricter than the licence itself.",
      },
      {
        heading: "Equipamiento de serie",
        headingEn: "Standard equipment",
        body: "Separador central, goma antideslizante de 8 mm sobre suelo de aluminio y protecciones interiores en las paredes en toda la altura de contacto del animal. La rampa frontal de la línea Touring permite que el caballo salga caminando hacia delante, sin retroceder por una rampa que no ve. Arcón, ventilación adicional, rueda de repuesto y acabado exterior se definen en el pedido, con el plazo del fabricante.",
        bodyEn: "Central partition, 8 mm anti-slip rubber over an aluminium floor and inner wall protection across the full height the horse can reach. The Touring line's front ramp lets the horse walk out forwards, rather than backing down a ramp it cannot see. Chest, extra ventilation, spare wheel and exterior finish are settled at order time, with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2600,
      taraKg: 850,
      cargaUtilKg: 1750,
      largoInteriorCm: 331,
      anchoInteriorCm: 168,
      altoInteriorCm: 238,
      suelo: "Aluminio con goma antideslizante de 8 mm",
    },
    sourceRef: `${EQUUS}/gold-touring-jumping/`,
  },

  {
    slug: "cl-touring-xl",
    slugExistente: "cheval-liberte-touring-xl",
    brand: "Cheval Liberté",
    name: "Touring XL",
    nameEn: "Touring XL",
    sku: "CL-TXL-2",
    shortDescription:
      "Van de dos caballos con 3,80 m de largo y 1,81 m de ancho interior, el más espacioso de dos plazas. Suelo de aluminio de 25 mm.",
    shortDescriptionEn:
      "Two-horse trailer with a 3.80 m length and 1.81 m inner width, the roomiest of the two-place range. 25 mm aluminium floor.",
    bullets: [
      "Dos caballos",
      "MMA 2.600 kg, tara 971 kg, carga útil 1.629 kg",
      "Interior de 3,80 × 1,81 × 2,38 m",
      "Suelo de aluminio de 25 mm con goma antideslizante de 8 mm",
      "Permiso B96 con vehículo de hasta 1.650 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,600 kg gross weight, 971 kg unladen, 1,629 kg payload",
      "Inner space of 3.80 × 1.81 × 2.38 m",
      "25 mm aluminium floor with 8 mm anti-slip rubber",
      "B96 licence with a vehicle up to 1,650 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Es el van de dos plazas más grande de la gama: 3,80 m de largo y 1,81 de ancho interior, casi medio metro más largo y trece centímetros más ancho que un Touring Country. Ese volumen se traduce en dos plazas de 90 cm, medida que admite caballos de gran alzada y grupa ancha sin que se toquen. La contrapartida es la tara, 971 kg, que reduce la carga útil a 1.629 kg: sigue siendo suficiente para dos caballos y su equipo.",
        bodyEn: "This is the largest two-place trailer in the range: 3.80 m long and 1.81 wide inside, nearly half a metre longer and thirteen centimetres wider than a Touring Country. That volume translates into two 90 cm places, a measure that takes tall, broad-hindquartered horses without them touching. The counterpart is the unladen weight, 971 kg, which brings the payload down to 1,629 kg: still enough for two horses and their equipment.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "El suelo es de aluminio de 25 mm, más grueso que el del resto de la gama, cubierto con la misma goma antideslizante de 8 mm. Ese espesor responde al mayor vano que hay que salvar entre travesaños en un habitáculo de 3,80 m: un suelo más fino flexaría bajo el peso de dos caballos en movimiento. La altura interior de 2,38 m es la máxima de la gama de dos plazas, junto con la del Touring Jumping.",
        bodyEn: "The floor is 25 mm aluminium, thicker than the rest of the range, covered with the same 8 mm anti-slip rubber. That thickness answers the greater span between crossmembers in a 3.80 m compartment: a thinner floor would flex under the weight of two moving horses. The 2.38 m inner height is the highest in the two-place range, alongside the Touring Jumping.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Los 2.600 kg de MMA descartan el permiso B en la práctica. Con B96 el conjunto llega a 4.250 kg y admite un vehículo de hasta 1.650 kg de masa máxima; con B+E, hasta 3.500 kg de vehículo. Dadas las dimensiones de este van, conviene además verificar la masa remolcable de tu coche y su distancia entre ejes: un remolque largo exige un tractor estable, y las cifras del permiso no dicen nada sobre eso.",
        bodyEn: "The 2,600 kg gross weight rules out a category B licence in practice. With B96 the combination reaches 4,250 kg and takes a vehicle up to 1,650 kg gross; with B+E, up to 3,500 kg of vehicle. Given this trailer's dimensions, it is also worth checking your car's towable mass and wheelbase: a long trailer calls for a stable tow vehicle, and the licence figures say nothing about that.",
      },
      {
        heading: "Equipamiento de serie",
        headingEn: "Standard equipment",
        body: "Separador central, suelo de aluminio de 25 mm con goma antideslizante de 8 mm y protecciones interiores en las paredes. Los 90 cm por plaza que permite el ancho de 1,81 m son los más generosos de la gama de dos caballos. La rampa frontal de la línea Touring deja salir al animal hacia delante. El resto del equipamiento se define en el pedido: escríbenos con tu uso previsto y te pasamos el presupuesto en firme.",
        bodyEn: "Central partition, 25 mm aluminium floor with 8 mm anti-slip rubber and inner wall protection. The 90 cm per place allowed by the 1.81 m width are the most generous in the two-horse range. The Touring line's front ramp lets the animal walk out forwards. The rest of the equipment is settled at order time: write to us with your intended use and we will send a firm quote.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2600,
      taraKg: 971,
      cargaUtilKg: 1629,
      largoInteriorCm: 380,
      anchoInteriorCm: 181,
      altoInteriorCm: 238,
      suelo: "Aluminio de 25 mm con goma antideslizante de 8 mm",
    },
    sourceRef: `${EQUUS}/remolque-de-2-caballos-touring-xl/`,
  },

  {
    slug: "cl-maxi-2",
    slugExistente: "cheval-liberte-maxi-2-duomax",
    brand: "Cheval Liberté",
    name: "Maxi 2",
    nameEn: "Maxi 2",
    sku: "CL-MX2-2",
    shortDescription:
      "Van de dos caballos, o tres ponis, con 3,78 m de largo interior. MMA de 2.600 kg y 1.640 kg de carga útil.",
    shortDescriptionEn:
      "Trailer for two horses, or three ponies, with a 3.78 m inner length. 2,600 kg gross weight and 1,640 kg payload.",
    bullets: [
      "Dos caballos, o tres ponis",
      "MMA 2.600 kg, tara 960 kg, carga útil 1.640 kg",
      "Interior de 3,78 × 1,81 × 2,38 m",
      "Suelo de aluminio con goma antideslizante de 8 mm",
      "Permiso B96 con vehículo de hasta 1.650 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses, or three ponies",
      "2,600 kg gross weight, 960 kg unladen, 1,640 kg payload",
      "Inner space of 3.78 × 1.81 × 2.38 m",
      "Aluminium floor with 8 mm anti-slip rubber",
      "B96 licence with a vehicle up to 1,650 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "El Maxi 2 comparte el volumen del Touring XL y lo aprovecha de otro modo: los 1,81 m de ancho admiten tres ponis en lugar de dos caballos, configuración que interesa a clubes y a familias con varios animales pequeños. Con dos caballos adultos, las plazas de 90 cm dejan sitio de sobra. La carga útil de 1.640 kg cubre ambos escenarios sin obligar a elegir entre el equipo y la seguridad del margen.",
        bodyEn: "The Maxi 2 shares the Touring XL's volume and uses it differently: the 1.81 m width takes three ponies instead of two horses, a layout that suits clubs and families with several small animals. With two adult horses, the 90 cm places leave room to spare. The 1,640 kg payload covers both scenarios without forcing a choice between the equipment and a safe margin.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo de aluminio recubierto de goma antideslizante de 8 mm, con 3,78 m de largo interior y 2,38 m de altura. La tara de 960 kg refleja el tamaño del habitáculo y los refuerzos que exige. El aluminio mantiene esa cifra estable en el tiempo: no absorbe los líquidos que acompañan a cualquier transporte de animales, y por tanto no engorda con los años como lo hace un tablero de madera saturado de humedad.",
        bodyEn: "Aluminium floor covered with 8 mm anti-slip rubber, with 3.78 m of inner length and 2.38 m of height. The 960 kg unladen weight reflects the size of the compartment and the reinforcement it demands. Aluminium keeps that figure stable over time: it does not absorb the liquids that come with any animal transport, and so does not put on weight over the years as a damp-saturated wooden deck does.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.600 kg de MMA, el permiso B queda descartado en la práctica: pediría un vehículo tractor de 900 kg. El B96 lleva el conjunto a 4.250 kg y admite un vehículo de hasta 1.650 kg de masa máxima autorizada; el B+E, hasta 3.500 kg de vehículo. Si vas a cargar tres ponis, recuerda que la homologación manda: el reparto de los animales debe respetar la carga máxima por eje, no solo la MMA total.",
        bodyEn: "At 2,600 kg gross, a category B licence is ruled out in practice: it would call for a 900 kg towing vehicle. B96 takes the combination to 4,250 kg and allows a vehicle up to 1,650 kg gross; B+E, up to 3,500 kg of vehicle. If you plan to carry three ponies, remember the homologation has the last word: how the animals are spread must respect the maximum axle load, not only the total gross weight.",
      },
      {
        heading: "Equipamiento de serie",
        headingEn: "Standard equipment",
        body: "Separadores para la configuración elegida, goma antideslizante de 8 mm sobre suelo de aluminio y protecciones interiores en las paredes. La conversión entre dos caballos y tres ponis se hace con los separadores, sin obra ni herramienta especial. Arcón delantero, ventilación adicional, rueda de repuesto y acabado exterior se concretan en el pedido: dinos cuántos animales vas a mover y te preparamos la configuración.",
        bodyEn: "Partitions for the chosen layout, 8 mm anti-slip rubber over an aluminium floor and inner wall protection. Switching between two horses and three ponies is done with the partitions, with no modification or special tool. Front chest, extra ventilation, spare wheel and exterior finish are settled at order time: tell us how many animals you will be moving and we will prepare the configuration.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2600,
      taraKg: 960,
      cargaUtilKg: 1640,
      largoInteriorCm: 378,
      anchoInteriorCm: 181,
      altoInteriorCm: 238,
      suelo: "Aluminio con goma antideslizante de 8 mm",
    },
    sourceRef: `${EQUUS}/duomax/`,
  },

  {
    slug: "cl-multimax",
    slugExistente: "cheval-liberte-multimax",
    brand: "Cheval Liberté",
    name: "Multimax",
    nameEn: "Multimax",
    sku: "CL-MMX-2",
    shortDescription:
      "Van polivalente de dos caballos con 3,78 m de largo interior. MMA de 2.600 kg y 1.630 kg de carga útil.",
    shortDescriptionEn:
      "Versatile two-horse trailer with a 3.78 m inner length. 2,600 kg gross weight and 1,630 kg payload.",
    bullets: [
      "Dos caballos",
      "MMA 2.600 kg, tara 970 kg, carga útil 1.630 kg",
      "Interior de 3,78 × 1,81 × 2,38 m",
      "Suelo de aluminio con goma antideslizante de 8 mm",
      "Permiso B96 con vehículo de hasta 1.650 kg, B+E hasta 3.500 kg",
    ],
    bulletsEn: [
      "Two horses",
      "2,600 kg gross weight, 970 kg unladen, 1,630 kg payload",
      "Inner space of 3.78 × 1.81 × 2.38 m",
      "Aluminium floor with 8 mm anti-slip rubber",
      "B96 licence with a vehicle up to 1,650 kg, B+E up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "El Multimax ocupa el mismo volumen que el Maxi 2 y se orienta al uso mixto: transportar dos caballos un fin de semana y material voluminoso el resto de la semana. Los 3,78 m de largo y los 1,81 de ancho dan un espacio de carga aprovechable cuando se retiran los separadores. La carga útil de 1.630 kg es la referencia a respetar en ambos usos, y conviene tenerla presente al cargar material, que engaña más que un animal.",
        bodyEn: "The Multimax occupies the same volume as the Maxi 2 and is aimed at mixed use: carrying two horses at the weekend and bulky material the rest of the week. The 3.78 m length and 1.81 m width give a usable load space once the partitions are removed. The 1,630 kg payload is the reference to respect in both uses, and worth keeping in mind when loading material, which is more deceptive than an animal.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo de aluminio con goma antideslizante de 8 mm y altura interior de 2,38 m. La tara de 970 kg es la más alta de la gama de dos plazas, consecuencia directa del tamaño del habitáculo. El aluminio del suelo resiste tanto el paso de los cascos como el arrastre de material, y no se degrada con la humedad: es lo que permite alternar los dos usos sin que el suelo pague la factura al cabo de unos años.",
        bodyEn: "Aluminium floor with 8 mm anti-slip rubber and a 2.38 m inner height. The 970 kg unladen weight is the highest in the two-place range, a direct consequence of the compartment's size. The aluminium floor withstands both hooves and dragged material, and does not degrade with damp: that is what allows alternating the two uses without the floor paying the price after a few years.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 2.600 kg de MMA, el permiso B no es viable en la práctica, ya que exigiría un vehículo tractor de 900 kg. Con B96 el conjunto alcanza 4.250 kg y admite un vehículo de hasta 1.650 kg; con B+E, hasta 3.500 kg de vehículo. Si vas a usarlo también para material, ten presente que la matriculación y el seguro se corresponden con un remolque de transporte de animales: consúltanos antes de darle otro uso habitual.",
        bodyEn: "At 2,600 kg gross, a category B licence is not workable in practice, since it would require a 900 kg towing vehicle. With B96 the combination reaches 4,250 kg and takes a vehicle up to 1,650 kg; with B+E, up to 3,500 kg of vehicle. If you also plan to use it for material, bear in mind that registration and insurance correspond to an animal transport trailer: ask us before making another use of it a habit.",
      },
      {
        heading: "Equipamiento de serie",
        headingEn: "Standard equipment",
        body: "Separadores desmontables, goma antideslizante de 8 mm sobre suelo de aluminio y protecciones interiores en las paredes. Retirar los separadores deja un espacio diáfano de 3,78 por 1,81 m, que es lo que da su nombre al modelo. Las opciones de arcón, anclajes adicionales, ventilación y rueda de repuesto se definen en el pedido, con el plazo del fabricante: cuéntanos los dos usos que le vas a dar.",
        bodyEn: "Removable partitions, 8 mm anti-slip rubber over an aluminium floor and inner wall protection. Taking the partitions out leaves a clear space of 3.78 by 1.81 m, which is what gives the model its name. Chest, extra tie-down points, ventilation and spare wheel options are settled at order time, with the manufacturer's lead time: tell us about both uses you have in mind.",
      },
    ],
    specs: {
      plazas: 2,
      mmaKg: 2600,
      taraKg: 970,
      cargaUtilKg: 1630,
      largoInteriorCm: 378,
      anchoInteriorCm: 181,
      altoInteriorCm: 238,
      suelo: "Aluminio con goma antideslizante de 8 mm",
    },
    sourceRef: `${EQUUS}/multimax/`,
  },

  // ----------------------------------------------------------- 3 y 4 caballos
  {
    slug: "cl-maxi-3",
    slugExistente: "cheval-liberte-minimax",
    brand: "Cheval Liberté",
    name: "Maxi 3",
    nameEn: "Maxi 3",
    sku: "CL-MX3-3",
    shortDescription:
      "Van de tres caballos con 3.500 kg de MMA y 2.105 kg de carga útil. Exige permiso B+E.",
    shortDescriptionEn:
      "Three-horse trailer with a 3,500 kg gross weight and 2,105 kg payload. Requires a B+E licence.",
    bullets: [
      "Tres caballos",
      "MMA 3.500 kg, tara 1.395 kg, carga útil 2.105 kg",
      "Interior de 4,20 × 2,02 × 2,35 m",
      "Suelo de aluminio con goma antideslizante de 8 mm",
      "Permiso B+E con vehículo de hasta 3.500 kg de MMA",
    ],
    bulletsEn: [
      "Three horses",
      "3,500 kg gross weight, 1,395 kg unladen, 2,105 kg payload",
      "Inner space of 4.20 × 2.02 × 2.35 m",
      "Aluminium floor with 8 mm anti-slip rubber",
      "B+E licence with a towing vehicle up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Tres plazas reales en 4,20 m de largo y 2,02 de ancho, con 2.105 kg de carga útil. Es el escalón que separa el uso familiar del profesional: clubes, centros de doma y propietarios de varios caballos que se desplazan juntos a concurso. La carga útil admite tres animales adultos con su equipo completo sin acercarse al límite, cosa que importa cuando el margen legal desaparece en cuanto se suman sillas, mantas, forraje y agua.",
        bodyEn: "Three genuine places across 4.20 m of length and 2.02 of width, with 2,105 kg of payload. This is the step separating family use from professional: clubs, training centres and owners of several horses travelling together to competition. The payload takes three adult animals with their full equipment without approaching the limit, which matters when the legal margin vanishes as soon as saddles, rugs, forage and water are added.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo de aluminio recubierto de goma antideslizante de 8 mm, con 2,35 m de altura interior. La tara de 1.395 kg corresponde a la estructura que exige homologar 3.500 kg y sostener tres animales en movimiento. El ancho interior de 2,02 m reparte 67 cm por plaza en configuración de tres, medida ajustada que conviene contrastar con la corpulencia de tus caballos antes de decidir entre este modelo y un Maxi 4.",
        bodyEn: "Aluminium floor covered with 8 mm anti-slip rubber, with 2.35 m of inner height. The 1,395 kg unladen weight matches the structure needed to homologate 3,500 kg and carry three moving animals. The 2.02 m inner width gives 67 cm per place in the three-horse layout, a tight measure worth checking against the build of your horses before choosing between this model and a Maxi 4.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Con 3.500 kg de MMA, este van exige permiso B+E: ni el B ni el B96 lo permiten, porque el conjunto superaría sus límites de 3.500 y 4.250 kg con cualquier vehículo real. Con B+E el conjunto llega a 7.000 kg, lo que admite un vehículo tractor de hasta 3.500 kg de masa máxima autorizada. Verifica además la masa remolcable con freno de tu vehículo, que rara vez alcanza los 3.500 kg fuera de los todoterreno y pick-up.",
        bodyEn: "At 3,500 kg gross, this trailer requires a B+E licence: neither B nor B96 allows it, because the combination would exceed their 3,500 and 4,250 kg limits with any real vehicle. With B+E the combination reaches 7,000 kg, allowing a towing vehicle up to 3,500 kg gross. Also check your vehicle's braked towable mass, which rarely reaches 3,500 kg outside of 4x4s and pick-ups.",
      },
      {
        heading: "Equipamiento de serie",
        headingEn: "Standard equipment",
        body: "Separadores para tres plazas, goma antideslizante de 8 mm sobre suelo de aluminio y protecciones interiores en las paredes. Los separadores se retiran para transportar dos caballos con mucha holgura o material voluminoso. Arcón delantero, ventilación adicional, rueda de repuesto y acabado exterior se concretan en el pedido. Dinos cuántos animales mueves habitualmente y su alzada, y te preparamos la configuración con el plazo de fábrica.",
        bodyEn: "Partitions for three places, 8 mm anti-slip rubber over an aluminium floor and inner wall protection. The partitions lift out to carry two horses with plenty of room, or bulky material. Front chest, extra ventilation, spare wheel and exterior finish are settled at order time. Tell us how many animals you usually move and their height, and we will prepare the configuration with the factory lead time.",
      },
    ],
    specs: {
      plazas: 3,
      mmaKg: 3500,
      taraKg: 1395,
      cargaUtilKg: 2105,
      largoInteriorCm: 420,
      anchoInteriorCm: 202,
      altoInteriorCm: 235,
      suelo: "Aluminio con goma antideslizante de 8 mm",
    },
    sourceRef: `${EQUUS}/maxi-3-minimax/`,
  },

  {
    slug: "cl-maxi-3-living",
    brand: "Cheval Liberté",
    name: "Maxi 3 Living",
    nameEn: "Maxi 3 Living",
    sku: "CL-MX3L-3",
    shortDescription:
      "Van de tres caballos con zona habitable y 4,90 m de largo interior. MMA de 3.500 kg y 2.045 kg de carga útil.",
    shortDescriptionEn:
      "Three-horse trailer with a living area and 4.90 m inner length. 3,500 kg gross weight and 2,045 kg payload.",
    bullets: [
      "Tres caballos, con zona habitable",
      "MMA 3.500 kg, tara 1.455 kg, carga útil 2.045 kg",
      "Interior de 4,90 × 2,02 × 2,35 m",
      "Suelo de aluminio con goma antideslizante de 8 mm",
      "Permiso B+E con vehículo de hasta 3.500 kg de MMA",
    ],
    bulletsEn: [
      "Three horses, with a living area",
      "3,500 kg gross weight, 1,455 kg unladen, 2,045 kg payload",
      "Inner space of 4.90 × 2.02 × 2.35 m",
      "Aluminium floor with 8 mm anti-slip rubber",
      "B+E licence with a towing vehicle up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Setenta centímetros más largo que el Maxi 3, y esos setenta centímetros son la zona habitable. Está pensado para concursos de varios días, donde la alternativa es dormir en el coche o pagar alojamiento cada noche. Mantiene las tres plazas para caballos y una carga útil de 2.045 kg, sesenta kilos menos que el Maxi 3 por el peso del habitáculo añadido. Para quien compite dos fines de semana al mes, la cuenta sale sola.",
        bodyEn: "Seventy centimetres longer than the Maxi 3, and those seventy centimetres are the living area. It is designed for multi-day competitions, where the alternative is sleeping in the car or paying for accommodation every night. It keeps the three horse places and a payload of 2,045 kg, sixty kilos less than the Maxi 3 because of the added compartment. For anyone competing two weekends a month, the sums add up on their own.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo de aluminio con goma antideslizante de 8 mm en la zona de los animales, y 2,35 m de altura interior en todo el largo. La tara de 1.455 kg incluye ya la estructura de la zona habitable. El ancho interior de 2,02 m es el mismo que el del Maxi 3, de modo que las tres plazas conservan sus 67 cm: la diferencia entre los dos modelos está en el largo, no en el reparto por animal.",
        bodyEn: "Aluminium floor with 8 mm anti-slip rubber in the animal area, and 2.35 m of inner height along the full length. The 1,455 kg unladen weight already includes the living area's structure. The 2.02 m inner width is the same as the Maxi 3's, so the three places keep their 67 cm: the difference between the two models is in the length, not in the space per animal.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Como el Maxi 3, este van tiene 3.500 kg de MMA y exige permiso B+E: el B y el B96 quedan descartados con cualquier vehículo real. Con B+E el conjunto puede llegar a 7.000 kg, lo que admite un tractor de hasta 3.500 kg de masa máxima. Con 4,90 m de largo, la estabilidad del conjunto depende también de la distancia entre ejes del vehículo: un todoterreno largo se comporta mejor que un SUV corto de la misma masa.",
        bodyEn: "Like the Maxi 3, this trailer is rated at 3,500 kg and requires a B+E licence: B and B96 are ruled out with any real vehicle. With B+E the combination can reach 7,000 kg, allowing a tow vehicle up to 3,500 kg gross. At 4.90 m long, the stability of the combination also depends on the vehicle's wheelbase: a long 4x4 behaves better than a short SUV of the same mass.",
      },
      {
        heading: "Equipamiento de serie",
        headingEn: "Standard equipment",
        body: "Separadores para las tres plazas, goma antideslizante de 8 mm sobre suelo de aluminio y protecciones interiores en las paredes. La zona habitable se equipa según el pedido, y es ahí donde las diferencias de configuración pesan más, tanto en euros como en kilos: cada elemento añadido sale de los 2.045 kg de carga útil. Escríbenos con el uso previsto y te preparamos el presupuesto detallado con el plazo del fabricante.",
        bodyEn: "Partitions for the three places, 8 mm anti-slip rubber over an aluminium floor and inner wall protection. The living area is fitted out to order, and that is where configuration differences weigh most, in euros as in kilos: every item added comes out of the 2,045 kg payload. Write to us with your intended use and we will prepare a detailed quote with the manufacturer's lead time.",
      },
    ],
    specs: {
      plazas: 3,
      mmaKg: 3500,
      taraKg: 1455,
      cargaUtilKg: 2045,
      largoInteriorCm: 490,
      anchoInteriorCm: 202,
      altoInteriorCm: 235,
      suelo: "Aluminio con goma antideslizante de 8 mm",
    },
    sourceRef: `${EQUUS}/remolque-maxi-3-living-de-3-caballos/`,
  },

  {
    slug: "cl-maxi-4",
    slugExistente: "cheval-liberte-optimax",
    brand: "Cheval Liberté",
    name: "Maxi 4",
    nameEn: "Maxi 4",
    sku: "CL-MX4-4",
    shortDescription:
      "Van de cuatro caballos con 4,90 m de largo y 2,20 m de ancho interior. MMA de 3.500 kg y 1.950 kg de carga útil.",
    shortDescriptionEn:
      "Four-horse trailer with a 4.90 m length and 2.20 m inner width. 3,500 kg gross weight and 1,950 kg payload.",
    bullets: [
      "Cuatro caballos",
      "MMA 3.500 kg, tara 1.550 kg, carga útil 1.950 kg",
      "Interior de 4,90 × 2,20 × 2,35 m",
      "Suelo de aluminio con goma antideslizante de 8 mm",
      "Permiso B+E con vehículo de hasta 3.500 kg de MMA",
    ],
    bulletsEn: [
      "Four horses",
      "3,500 kg gross weight, 1,550 kg unladen, 1,950 kg payload",
      "Inner space of 4.90 × 2.20 × 2.35 m",
      "Aluminium floor with 8 mm anti-slip rubber",
      "B+E licence with a towing vehicle up to 3,500 kg",
    ],
    sections: [
      {
        heading: "Uso previsto",
        headingEn: "Intended use",
        body: "Cuatro plazas en 4,90 m de largo y 2,20 de ancho: es el mayor van de la gama Cheval Liberté distribuida en España, y el techo de lo que se puede remolcar con un permiso de la categoría B ampliada. Se dirige a clubes, centros hípicos y transportistas. La carga útil de 1.950 kg repartida entre cuatro animales deja unos 480 kg por plaza con el equipo incluido: es la cifra que decide si este modelo te sirve o si necesitas un camión.",
        bodyEn: "Four places across 4.90 m of length and 2.20 of width: this is the largest trailer in the Cheval Liberté range distributed in Spain, and the ceiling of what can be towed on an extended category B licence. It is aimed at clubs, equestrian centres and hauliers. The 1,950 kg payload spread across four animals leaves about 480 kg per place with equipment included: that is the figure deciding whether this model suits you or whether you need a lorry.",
      },
      {
        heading: "Construcción",
        headingEn: "Build",
        body: "Suelo de aluminio recubierto de goma antideslizante de 8 mm, 2,35 m de altura interior y 2,20 m de ancho, que reparte 55 cm por plaza en configuración de cuatro. Esa medida corresponde a caballos de talla media colocados en oblicuo, no a animales corpulentos en batería: conviene hablarlo antes de encargar. La tara de 1.550 kg es la mayor de la gama y refleja la estructura necesaria para sostener cuatro animales en movimiento.",
        bodyEn: "Aluminium floor covered with 8 mm anti-slip rubber, 2.35 m of inner height and 2.20 m of width, giving 55 cm per place in the four-horse layout. That measure suits medium horses placed at an angle, not heavy-set animals side by side: worth discussing before ordering. The 1,550 kg unladen weight is the highest in the range and reflects the structure needed to carry four moving animals.",
      },
      {
        heading: "Permiso y vehículo tractor",
        headingEn: "Licence and towing vehicle",
        body: "Los 3.500 kg de MMA exigen permiso B+E, con un conjunto que puede llegar a 7.000 kg y un vehículo tractor de hasta 3.500 kg de masa máxima autorizada. En la práctica, un van de esta longitud pide un todoterreno o una pick-up con masa remolcable de 3.500 kg con freno, dato que figura en el apartado O.1 de la ficha técnica del vehículo. Consúltanos si tienes dudas sobre la compatibilidad con tu coche antes de encargar.",
        bodyEn: "The 3,500 kg gross weight requires a B+E licence, with a combination that can reach 7,000 kg and a towing vehicle up to 3,500 kg gross. In practice, a trailer of this length calls for a 4x4 or a pick-up with a braked towable mass of 3,500 kg, a figure shown in section O.1 of the vehicle's registration document. Ask us if you have any doubt about compatibility with your car before ordering.",
      },
      {
        heading: "Equipamiento de serie",
        headingEn: "Standard equipment",
        body: "Separadores para cuatro plazas, goma antideslizante de 8 mm sobre suelo de aluminio y protecciones interiores en las paredes en toda la altura de contacto. Retirando separadores se pasa a tres plazas holgadas o a dos con espacio de carga. Arcón, ventilación adicional, anclajes, rueda de repuesto y acabado exterior se definen en el pedido: cuéntanos el número de animales y su alzada y te pasamos el presupuesto en firme.",
        bodyEn: "Partitions for four places, 8 mm anti-slip rubber over an aluminium floor and inner wall protection across the full contact height. Removing partitions gives three roomy places, or two with load space. Chest, extra ventilation, tie-down points, spare wheel and exterior finish are settled at order time: tell us the number of animals and their height and we will send a firm quote.",
      },
    ],
    specs: {
      plazas: 4,
      mmaKg: 3500,
      taraKg: 1550,
      cargaUtilKg: 1950,
      largoInteriorCm: 490,
      anchoInteriorCm: 220,
      altoInteriorCm: 235,
      suelo: "Aluminio con goma antideslizante de 8 mm",
    },
    sourceRef: `${EQUUS}/maxi-4-optimax/`,
  },
];
