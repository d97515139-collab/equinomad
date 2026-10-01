/**
 * Importe la gamme Cheval Liberté relevée chez Remolques Cuni.
 *
 * Source des données factuelles : l'API Store de remolquescuni.com
 * (`/wp-json/wc/store/products`), distributeur espagnol de la marque. On en
 * reprend uniquement ce qui est vérifiable — dénomination du modèle, masse
 * maximale admissible, essieux, équipement de série, prix de vente public en
 * Espagne. Les textes sont rédigés ici : recopier la prose du distributeur
 * exposerait au grief de contrefaçon et produirait du contenu dupliqué, que les
 * moteurs déclassent.
 *
 * Attention au format des prix chez Cuni : `currency_minor_unit` vaut 0, donc
 * `prices.price` est en euros entiers et non en centimes.
 *
 * Les prix barrés du distributeur ne sont PAS repris. Ce sont ses remises à lui ;
 * les afficher ici ferait état d'une référence de prix que nous n'avons jamais
 * pratiquée, ce que l'article 20 du RDL 1/2007 traite comme une pratique
 * commerciale trompeuse.
 *
 * Les visuels sont les vues de profil dessinées par scripts/generer-visuels.mjs.
 * On ne rapatrie aucune photographie du site source : elles ne nous appartiennent
 * pas.
 *
 * Le script fait deux choses :
 *   1. il crée les neuf modèles absents du catalogue ;
 *   2. il corrige prix ET caractéristiques des trois modèles déjà présents dont
 *      la fiche annonçait des valeurs qui ne correspondent pas au produit réel.
 *
 * Relançable : chaque produit passe par un upsert sur son slug.
 *
 * Lancement : node --env-file=.env.local --import tsx scripts/importer-cheval-liberte.ts
 */
import { prisma } from "../src/server/prisma";

const IMG = "/images/remolques";
const MARCA = "Cheval Liberté";

interface FichaProducto {
  slug: string;
  /** Slug de la catégorie de destination, dans l'univers « nuevos ». */
  categoria: "un-caballo" | "dos-caballos" | "tres-cuatro-caballos";
  name: string;
  nameEn: string;
  /** Référence fabricant, seul identifiant dont dispose un remorque sans GTIN. */
  mpn: string;
  short: string;
  shortEn: string;
  description: string;
  descriptionEn: string;
  bullets: string[];
  bulletsEn: string[];
  /** Prix de vente public en Espagne, en euros, relevé chez le distributeur. */
  precio: number;
  image: string;
  /** Masse à vide en kilogrammes, quand le constructeur la publie. */
  taraKg?: number;
}

/**
 * Neuf modèles absents du catalogue. Le Gold ONE, relevé lui aussi chez Cuni,
 * est écarté volontairement : son prix y est affiché à 103 €, valeur
 * manifestement erronée, et aucune autre source publique ne donne son tarif.
 * Mieux vaut un modèle en moins qu'un prix inventé.
 */
const FICHAS: FichaProducto[] = [
  {
    slug: "cheval-liberte-gold-one-origins",
    categoria: "un-caballo",
    name: "Gold One Origins",
    nameEn: "Gold One Origins",
    mpn: "CL-GOLD-ONE-ORIGINS",
    short:
      "Monoplaza ampliado de 615 kg de tara, con MMA a elegir entre 1.100 y 1.600 kg. Altura interior de 2,34 m.",
    shortEn:
      "Extended single-horse trailer, 615 kg unladen, with gross weight selectable from 1,100 to 1,600 kg. Interior height 2.34 m.",
    description:
      "El Gold One Origins es lo que en el sector se llama un caballo y medio: más ancho que un monoplaza estricto, sin llegar a las dos plazas. Esa medida intermedia resuelve el problema del caballo que viaja solo y necesita apoyarse en las curvas.\n\nSus 615 kg de tara son la cifra que decide la compra. Con una MMA configurable entre 1.100 y 1.600 kg, el conjunto entra en el carnet B con la mayoría de los todocaminos del mercado, sin necesidad de ampliación.\n\nLa altura interior de 2,34 m y la puerta de visita delantera completan un remolque pensado para el caballo que hace trayectos largos: hay sitio para levantar la cabeza y se puede comprobar cómo va sin abrir la parte trasera.",
    descriptionEn:
      "The Gold One Origins is what the trade calls a horse-and-a-half: wider than a strict single-horse trailer, without reaching two places. That intermediate width solves the problem of a horse travelling alone and needing to brace through corners.\n\nIts 615 kg unladen weight is the figure that decides the purchase. With gross weight configurable between 1,100 and 1,600 kg, the combination fits a standard B licence with most crossovers on the market, with no upgrade needed.\n\nThe 2.34 m interior height and front inspection door round out a trailer built for long journeys: there is room to raise the head, and you can check on the horse without opening the back.",
    bullets: [
      "Un caballo y medio · tara desde 615 kg",
      "MMA configurable de 1.100 a 1.600 kg",
      "Altura interior 2,34 m",
      "Puerta de visita delantera",
      "Compatible con carnet B en la mayoría de configuraciones",
    ],
    bulletsEn: [
      "Horse-and-a-half · from 615 kg unladen",
      "Gross weight configurable 1,100–1,600 kg",
      "2.34 m interior height",
      "Front inspection door",
      "B-licence compatible in most configurations",
    ],
    precio: 7864,
    image: `${IMG}/cl-gold-one-origins.svg`,
    taraKg: 615,
  },
  {
    slug: "cheval-liberte-gold-origins",
    categoria: "dos-caballos",
    name: "Gold Origins",
    nameEn: "Gold Origins",
    mpn: "CL-GOLD-ORIGINS",
    short:
      "Dos plazas de 760 kg de tara, con MMA a elegir entre 1.100 y 2.000 kg. Techo y morro de fibra, dos ejes frenados de 1.000 kg.",
    shortEn:
      "Two-horse trailer, 760 kg unladen, gross weight selectable from 1,100 to 2,000 kg. Fibreglass roof and nose, two braked 1,000 kg axles.",
    description:
      "El Gold Origins sustituye a los dos modelos que más se han visto en los patios españoles durante quince años, el Gold First y el Gold II. Conserva la silueta reconocible de la marca y actualiza lo que había envejecido: la ventilación, el espacio de cabeza y el peso.\n\nCon 760 kg de tara y una MMA a elegir entre 1.100 y 2.000 kg, es de los pocos dos plazas que un vehículo compacto puede arrastrar sin cambiar de permiso. El techo y el morro son de fibra; las paredes, de aluminio o de madera según la versión.\n\nLas ventanas correderas son de cristal de seguridad, con deflector de aire y persiana enrollable ventilada. La separación interior va acolchada y los cojines laterales apoyan al caballo en las curvas. Este modelo requiere matrícula roja.",
    descriptionEn:
      "The Gold Origins replaces the two models most often seen in Spanish yards over fifteen years, the Gold First and the Gold II. It keeps the brand's recognisable silhouette and updates what had aged: ventilation, headroom and weight.\n\nAt 760 kg unladen with gross weight selectable between 1,100 and 2,000 kg, it is one of the few two-horse trailers a compact car can tow without changing licence category. The roof and nose are fibreglass; the walls aluminium or timber depending on version.\n\nThe sliding windows are safety glass, with air deflector and ventilated roller blind. The internal partition is padded, and side cushions support the horse through corners. This model requires a red trade plate.",
    bullets: [
      "2 caballos · tara 760 kg",
      "MMA configurable de 1.100 a 2.000 kg",
      "2 ejes de 1.000 kg con freno",
      "Techo y morro de fibra, paredes de aluminio o madera",
      "Ventanas de cristal de seguridad con deflector y persiana",
    ],
    bulletsEn: [
      "2 horses · 760 kg unladen",
      "Gross weight configurable 1,100–2,000 kg",
      "Two braked 1,000 kg axles",
      "Fibreglass roof and nose, aluminium or timber walls",
      "Safety-glass windows with deflector and blind",
    ],
    precio: 7380,
    image: `${IMG}/cl-gold-origins.svg`,
    taraKg: 760,
  },
  {
    slug: "cheval-liberte-gold-3",
    categoria: "dos-caballos",
    name: "Gold 3",
    nameEn: "Gold 3",
    mpn: "CL-GOLD-3",
    short:
      "Dos plazas homologable a 2.000 o 2.600 kg según versión. Puerta de jinete vertical y lona trasera enrollable de plegado automático.",
    shortEn:
      "Two-horse trailer, type-approved at either 2,000 or 2,600 kg. Vertical groom door and roll-up rear tarpaulin with automatic folding.",
    description:
      "El Gold 3 se pide en dos homologaciones, 2.000 o 2.600 kg, y la diferencia de precio entre ambas es real. Elegir la baja cuando se transportan dos caballos adultos deja sin margen de carga útil; elegir la alta sin necesitarlo encarece el remolque y puede sacarlo del carnet B.\n\nLa puerta de jinete es de acceso completamente vertical, que es la diferencia entre entrar de lado y entrar de frente cuando se lleva material en la mano. La luz interior va de serie.\n\nLa lona trasera enrollable con plegado automático es el detalle que se agradece en viaje largo o con lluvia: cierra la parte de atrás sin bajar del coche ni manipular herrajes.",
    descriptionEn:
      "The Gold 3 is ordered in one of two ratings, 2,000 or 2,600 kg, and the price difference between them is real. Choosing the lower one for two adult horses leaves no payload margin; choosing the higher without needing it raises the price and may push you out of B-licence territory.\n\nThe groom door opens fully vertically — the difference between entering sideways and entering head-on when your hands are full. Interior lighting is standard.\n\nThe roll-up rear tarpaulin with automatic folding is the detail you appreciate on a long trip or in rain: it closes the back without getting out of the car or handling fittings.",
    bullets: [
      "2 caballos · homologable a 2.000 o 2.600 kg",
      "Puerta de jinete de acceso vertical",
      "Lona trasera enrollable de plegado automático",
      "Luz interior de serie",
      "Separaciones interiores para dos caballos",
    ],
    bulletsEn: [
      "2 horses · rated at 2,000 or 2,600 kg",
      "Vertical-access groom door",
      "Roll-up rear tarpaulin, automatic folding",
      "Interior lighting as standard",
      "Internal partitions for two horses",
    ],
    precio: 9800,
    image: `${IMG}/cl-gold-3.svg`,
  },
  {
    slug: "cheval-liberte-gold-hippomobile",
    categoria: "dos-caballos",
    name: "Gold Hippomobile",
    nameEn: "Gold Hippomobile",
    mpn: "CL-GOLD-HIPPOMOBILE",
    short:
      "Dos plazas homologado a 2.600 kg con dos ejes PULLMAN 2 de 1.300 kg. Techo de fibra, paredes de aluminio y claraboya regulable.",
    shortEn:
      "Two-horse trailer rated at 2,600 kg on two 1,300 kg PULLMAN 2 axles. Fibreglass roof, aluminium walls and adjustable roof vent.",
    description:
      "El Gold Hippomobile es el dos plazas de la gama Gold que sube a 2.600 kg de MMA sin cambiar de formato. Los dos ejes PULLMAN 2 de 1.300 kg reparten la carga entre ellos en lugar de apoyarla en la bola, que es lo que se nota en frenada larga y en carretera de montaña.\n\nLa combinación de techo de fibra y paredes de aluminio es la que mejor se comporta bajo el sol de meseta: la fibra no transmite el calor como la chapa, y el aluminio no se pudre como la madera cuando el remolque duerme a la intemperie.\n\nArriba lleva una claraboya regulable y dos ventanas delanteras con apertura. Con las tres abiertas se establece una corriente de aire de delante hacia atrás, que es como se ventila un van parado en el aparcamiento de un concurso en julio.",
    descriptionEn:
      "The Gold Hippomobile is the Gold-range two-horse trailer that steps up to 2,600 kg gross without changing format. The two 1,300 kg PULLMAN 2 axles share the load between them rather than resting it on the towball — which is what you feel under sustained braking and on mountain roads.\n\nThe fibreglass roof and aluminium wall combination copes best with high-plateau sun: fibreglass does not transmit heat the way sheet steel does, and aluminium does not rot like timber when the trailer lives outdoors.\n\nAbove it carries an adjustable roof vent and two opening front windows. With all three open, air flows front to back — which is how you ventilate a van parked at a July competition.",
    bullets: [
      "2 caballos · MMA 2.600 kg",
      "2 ejes PULLMAN 2 de 1.300 kg con freno",
      "Techo de fibra y paredes de aluminio",
      "Claraboya regulable en el techo",
      "Dos ventanas delanteras con apertura",
    ],
    bulletsEn: [
      "2 horses · 2,600 kg gross weight",
      "Two braked 1,300 kg PULLMAN 2 axles",
      "Fibreglass roof, aluminium walls",
      "Adjustable roof vent",
      "Two opening front windows",
    ],
    precio: 10768,
    image: `${IMG}/cl-gold-hippomobile.svg`,
  },
  {
    slug: "cheval-liberte-touring-xl",
    categoria: "dos-caballos",
    name: "Touring XL",
    nameEn: "Touring XL",
    mpn: "CL-TOURING-XL",
    short:
      "Dos plazas de gran volumen homologado a 2.600 kg. Ejes PULLMAN V2 con freno de inercia, suelo de aluminio y goma, barras antipánico.",
    shortEn:
      "High-volume two-horse trailer rated at 2,600 kg. PULLMAN V2 axles with overrun braking, aluminium floor with rubber matting, anti-panic bars.",
    description:
      "El Touring XL es el dos plazas de la gama Touring para caballos grandes. Los 2.600 kg de MMA salen de dos ejes KNOTT de 1.300 kg reforzados, que son los mismos que monta el Hippomobile pero sobre una caja más larga.\n\nEl sistema de ejes PULLMAN V2 lleva freno de inercia y suspensión con amortiguación. La diferencia respecto a una suspensión sin amortiguar no está en la comodidad del conductor sino en la del caballo: sin amortiguación, cada junta de dilatación de la autovía llega entera al animal.\n\nEl interior va completamente acolchado en los laterales, con dos barras de pecho ajustables con sistema antipánico y dos barras de cola. La separación interior es de aluminio, el suelo también, con goma encima. La puerta rampa mide 110 cm de largo.",
    descriptionEn:
      "The Touring XL is the Touring range's two-horse trailer for big horses. Its 2,600 kg gross weight comes from two reinforced 1,300 kg KNOTT axles — the same as the Hippomobile, but on a longer body.\n\nThe PULLMAN V2 axle system has overrun braking and damped suspension. The difference from undamped suspension is not in the driver's comfort but the horse's: without damping, every motorway expansion joint reaches the animal intact.\n\nThe interior is fully padded along the sides, with two adjustable breast bars with anti-panic release and two rear bars. The partition is aluminium, as is the floor, with rubber matting over it. The loading ramp is 110 cm long.",
    bullets: [
      "2 caballos · MMA 2.600 kg",
      "2 ejes KNOTT de 1.300 kg reforzados",
      "Ejes PULLMAN V2 con freno de inercia y amortiguación",
      "Suelo de aluminio con goma · puerta rampa de 110 cm",
      "2 barras de pecho antipánico y 2 barras de cola ajustables",
    ],
    bulletsEn: [
      "2 horses · 2,600 kg gross weight",
      "Two reinforced 1,300 kg KNOTT axles",
      "PULLMAN V2 axles, overrun braking and damping",
      "Aluminium floor with rubber matting · 110 cm ramp",
      "Two anti-panic breast bars and two adjustable rear bars",
    ],
    precio: 11736,
    image: `${IMG}/cl-touring-xl.svg`,
  },
  {
    slug: "cheval-liberte-multimax",
    categoria: "dos-caballos",
    name: "Multimax",
    nameEn: "Multimax",
    mpn: "CL-MULTIMAX",
    short:
      "Dos plazas homologado a 3.000 kg con dos ejes KNOTT de 1.500 kg. Puerta rampa de 110 cm y cinco colores de carrocería.",
    shortEn:
      "Two-horse trailer rated at 3,000 kg on two 1,500 kg KNOTT axles. 110 cm loading ramp and five body colours.",
    description:
      "El Multimax lleva la homologación a 3.000 kg sobre dos plazas, lo que deja una carga útil que ningún dos caballos de gama media alcanza. A cambio exige carnet B+E: por encima de 3.500 kg de conjunto no hay ampliación que valga.\n\nLos dos ejes KNOTT de 1.500 kg reforzados reparten el peso entre ellos en lugar de cargarlo sobre la bola del vehículo tractor. Es la razón por la que un remolque de este porte se conduce mejor cargado que vacío.\n\nSe ofrece en cinco colores. Merece la pena saber que el blanco puede reducir la temperatura interior más de un 40 % respecto a un color oscuro: en un viaje de agosto por el interior peninsular, eso es la diferencia entre un caballo que llega descansado y uno que llega sudado.",
    descriptionEn:
      "The Multimax carries a 3,000 kg rating on two places, leaving a payload no mid-range two-horse trailer matches. In exchange it requires a B+E licence: above 3,500 kg combined, no licence upgrade covers it.\n\nThe two reinforced 1,500 kg KNOTT axles share the weight between them rather than loading it onto the tow vehicle's ball. That is why a trailer this size drives better loaded than empty.\n\nIt comes in five colours. Worth knowing: white can cut interior temperature by more than 40 % compared with a dark colour. On an August trip across inland Spain, that is the difference between a horse arriving rested and one arriving soaked.",
    bullets: [
      "2 caballos · MMA 3.000 kg",
      "2 ejes KNOTT de 1.500 kg reforzados",
      "Puerta rampa de 110 cm de largo",
      "Cinco colores de carrocería",
      "Requiere carnet B+E",
    ],
    bulletsEn: [
      "2 horses · 3,000 kg gross weight",
      "Two reinforced 1,500 kg KNOTT axles",
      "110 cm loading ramp",
      "Five body colours",
      "B+E licence required",
    ],
    precio: 12825,
    image: `${IMG}/cl-multimax.svg`,
  },
  {
    slug: "cheval-liberte-maxi-2-duomax",
    categoria: "dos-caballos",
    name: "Maxi 2 Duomax",
    nameEn: "Maxi 2 Duomax",
    mpn: "CL-MAXI-2-DUOMAX",
    short:
      "Dos plazas equipado homologado a 3.000 kg. Dos soportes de silla sobre riel, barra de recámara de ancho completo y tabiques regulables.",
    shortEn:
      "Fully-equipped two-horse trailer rated at 3,000 kg. Two saddle racks on sliding rail, full-width rear bar and adjustable partitions.",
    description:
      "El Duomax es el Maxi 2 en versión equipada, y la diferencia está toda dentro. Dos soportes de silla de montar sobre riel deslizante, dos soportes de brida, red para documentos, espejo y luz: es un remolque que sale de fábrica con el guadarnés resuelto.\n\nLos tabiques son regulables sobre riel deslizante, no fijos. Un remolque con separaciones fijas obliga a que los dos caballos midan lo mismo; uno con tabiques sobre riel se adapta a la pareja que se lleve ese día.\n\nHomologado a 3.000 kg sobre dos ejes KNOTT de 1.500 kg reforzados. La ventilación se resuelve con una ventana corredera con barras de acero inoxidable y una segunda ventana deslizante en el lado izquierdo.",
    descriptionEn:
      "The Duomax is the equipped version of the Maxi 2, and the difference is all inside. Two saddle racks on a sliding rail, two bridle hooks, document net, mirror and light: this is a trailer that leaves the factory with tack storage already solved.\n\nThe partitions are adjustable on a sliding rail, not fixed. A trailer with fixed partitions requires both horses to be the same size; one with rail-mounted partitions adapts to whichever pair travels that day.\n\nRated at 3,000 kg on two reinforced 1,500 kg KNOTT axles. Ventilation comes from a sliding window with stainless steel bars and a second sliding window on the left-hand side.",
    bullets: [
      "2 caballos · MMA 3.000 kg",
      "2 ejes KNOTT de 1.500 kg reforzados",
      "2 soportes de silla sobre riel deslizante y 2 de brida",
      "Tabiques regulables sobre riel · barra de recámara de ancho completo",
      "Ventana corredera con barras de acero inoxidable",
    ],
    bulletsEn: [
      "2 horses · 3,000 kg gross weight",
      "Two reinforced 1,500 kg KNOTT axles",
      "Two rail-mounted saddle racks and two bridle hooks",
      "Rail-adjustable partitions · full-width rear bar",
      "Sliding window with stainless steel bars",
    ],
    precio: 13430,
    image: `${IMG}/cl-maxi-2-duomax.svg`,
  },
  {
    // À ne pas confondre avec le Touring Country 1, déjà au catalogue : celui-ci
    // est la version deux places, un modèle distinct et deux fois plus cher.
    slug: "cheval-liberte-touring-country-2",
    categoria: "dos-caballos",
    name: "Touring Country 2",
    nameEn: "Touring Country 2",
    mpn: "CL-TOURING-COUNTRY-2",
    short:
      "Dos plazas homologado a 2.000 kg con dos ejes KNOTT de 1.000 kg. Suelo de aluminio con goma de 8 mm y puerta rampa de 110 cm.",
    shortEn:
      "Two-horse trailer rated at 2,000 kg on two 1,000 kg KNOTT axles. Aluminium floor with 8 mm rubber matting and 110 cm loading ramp.",
    description:
      "El Touring Country 2 es el dos plazas más ligero de la gama Touring, y ahí está todo su interés. Con 2.000 kg de MMA sobre dos ejes KNOTT de 1.000 kg, es de los pocos remolques de dos caballos que un conjunto con carnet B puede arrastrar sin ampliación.\n\nEse límite tiene una contrapartida que conviene calcular antes de comprar: con dos caballos adultos de 550 kg cada uno, la carga útil se agota. Es un remolque para dos animales de talla media, o para uno grande y material.\n\nEl sistema de ejes PULLMAN V2 lleva freno de inercia y suspensión amortiguada. El suelo es de aluminio con goma de 8 mm, la puerta rampa mide 110 cm, y el interior incorpora luz y cojines laterales de apoyo.",
    descriptionEn:
      "The Touring Country 2 is the lightest two-horse trailer in the Touring range, and that is its whole appeal. At 2,000 kg gross on two 1,000 kg KNOTT axles, it is one of the few two-horse trailers a B-licence combination can tow without an upgrade.\n\nThat limit has a trade-off worth calculating before buying: with two adult horses of 550 kg each, the payload is spent. This is a trailer for two medium-sized animals, or one large horse plus gear.\n\nThe PULLMAN V2 axle system has overrun braking and damped suspension. The floor is aluminium with 8 mm rubber matting, the loading ramp is 110 cm, and the interior includes lighting and side support cushions.",
    bullets: [
      "2 caballos · MMA 2.000 kg",
      "2 ejes KNOTT de 1.000 kg reforzados",
      "Ejes PULLMAN V2 con freno de inercia y amortiguación",
      "Suelo de aluminio con goma de 8 mm",
      "Puerta rampa de 110 cm · luz interior y cojines laterales",
    ],
    bulletsEn: [
      "2 horses · 2,000 kg gross weight",
      "Two reinforced 1,000 kg KNOTT axles",
      "PULLMAN V2 axles, overrun braking and damping",
      "Aluminium floor with 8 mm rubber matting",
      "110 cm ramp · interior light and side cushions",
    ],
    precio: 10405,
    image: `${IMG}/cl-touring-country-2.svg`,
  },
  {
    slug: "cheval-liberte-minimax",
    categoria: "tres-cuatro-caballos",
    name: "Minimax",
    nameEn: "Minimax",
    mpn: "CL-MINIMAX",
    short:
      "Tres plazas homologado a 3.000 kg con dos ejes KNOTT de 1.500 kg. Guadarnés de serie, ventanas laterales y trampilla de ventilación en el techo.",
    shortEn:
      "Three-horse trailer rated at 3,000 kg on two 1,500 kg KNOTT axles. Standard tack compartment, side windows and roof ventilation hatch.",
    description:
      "El Minimax es la entrada a las tres plazas, y su interés está en que llega a 3.000 kg de MMA sin la longitud de un cuatro caballos. Para un club pequeño o un criador que mueve tres animales, es el formato que cabe en un patio normal.\n\nLos dos ejes KNOTT de 1.500 kg reforzados son los que permiten esa homologación. Reparten el peso entre ellos en vez de cargarlo sobre la bola, que es lo que hace estable un remolque largo.\n\nLleva de serie un compartimento para guadarnés de buen tamaño y ventanas laterales para que los animales saquen la cabeza con el remolque parado. La trampilla del techo ventila mientras se conduce. La puerta rampa mide 110 cm.",
    descriptionEn:
      "The Minimax is the entry point to three places, and its appeal is reaching 3,000 kg gross without the length of a four-horse trailer. For a small club or a breeder moving three animals, it is the format that fits an ordinary yard.\n\nThe two reinforced 1,500 kg KNOTT axles are what allow that rating. They share the weight between them rather than loading the towball, which is what makes a long trailer stable.\n\nIt comes with a generously sized tack compartment as standard and side windows so the animals can put their heads out when parked. The roof hatch ventilates on the move. The loading ramp is 110 cm.",
    bullets: [
      "3 caballos · MMA 3.000 kg",
      "2 ejes KNOTT de 1.500 kg reforzados",
      "Compartimento para guadarnés de serie",
      "Ventanas laterales y trampilla de ventilación en el techo",
      "Puerta rampa de 110 cm · requiere carnet B+E",
    ],
    bulletsEn: [
      "3 horses · 3,000 kg gross weight",
      "Two reinforced 1,500 kg KNOTT axles",
      "Tack compartment as standard",
      "Side windows and roof ventilation hatch",
      "110 cm loading ramp · B+E licence required",
    ],
    precio: 17544,
    image: `${IMG}/cl-minimax.svg`,
  },
  {
    slug: "cheval-liberte-optimax",
    categoria: "tres-cuatro-caballos",
    name: "Optimax",
    nameEn: "Optimax",
    mpn: "CL-OPTIMAX",
    short:
      "Cuatro plazas homologado a 3.500 kg con dos ejes KNOTT de 1.800 kg. Guadarnés de grandes dimensiones y ventilación en techo y laterales.",
    shortEn:
      "Four-horse trailer rated at 3,500 kg on two 1,800 kg KNOTT axles. Large tack compartment, roof and side ventilation.",
    description:
      "El Optimax es el tope de la gama Van de Cheval Liberté: cuatro plazas homologadas a 3.500 kg, que es el máximo que admite un remolque de un solo enganche antes de entrar en categoría de vehículo pesado.\n\nLos dos ejes KNOTT de 1.800 kg reforzados son los que sostienen esa cifra. Con cuatro caballos a bordo, el reparto de peso entre ejes deja de ser una cuestión de confort y pasa a ser de seguridad: es lo que impide que el conjunto haga tijera en una frenada de emergencia.\n\nEl compartimento de guadarnés es de grandes dimensiones, dimensionado para el material de cuatro monturas. Ventanas laterales para que los caballos saquen la cabeza en parado, y trampilla de ventilación en el techo para la marcha.",
    descriptionEn:
      "The Optimax tops Cheval Liberté's Van range: four places rated at 3,500 kg, the maximum a single-hitch trailer takes before entering heavy-vehicle territory.\n\nThe two reinforced 1,800 kg KNOTT axles carry that figure. With four horses aboard, weight distribution between axles stops being a comfort question and becomes a safety one: it is what stops the combination jack-knifing under emergency braking.\n\nThe tack compartment is generously sized, scaled for four sets of gear. Side windows let the horses put their heads out when parked, and a roof hatch ventilates on the move.",
    bullets: [
      "4 caballos · MMA 3.500 kg",
      "2 ejes KNOTT de 1.800 kg reforzados",
      "Compartimento para guadarnés de grandes dimensiones",
      "Ventanas laterales y trampilla de ventilación en el techo",
      "Requiere carnet B+E",
    ],
    bulletsEn: [
      "4 horses · 3,500 kg gross weight",
      "Two reinforced 1,800 kg KNOTT axles",
      "Large tack compartment",
      "Side windows and roof ventilation hatch",
      "B+E licence required",
    ],
    precio: 18149,
    image: `${IMG}/cl-optimax.svg`,
  },
];

/**
 * Modèles déjà au catalogue dont la fiche annonçait des valeurs qui ne
 * correspondent pas au produit réel. Le prix comme les caractéristiques sont
 * corrigés : une MMA fausse sur une fiche de remorque n'est pas une coquille,
 * elle décide du permis avec lequel le client va circuler.
 */
interface Correccion {
  slug: string;
  /** Prix public relevé chez le distributeur, en euros. */
  precio: number;
  short: string;
  shortEn: string;
  bullets: string[];
  bulletsEn: string[];
  mpn: string;
}

const CORRECCIONES: Correccion[] = [
  {
    slug: "cheval-liberte-touring-jumping",
    precio: 10042,
    mpn: "CL-TOURING-JUMPING",
    short:
      "Dos plazas homologado a 2.600 kg con dos ejes KNOTT de 1.300 kg. Suelo de aluminio con goma y ruedas de 185/65 R14.",
    shortEn:
      "Two-horse trailer rated at 2,600 kg on two 1,300 kg KNOTT axles. Aluminium floor with rubber matting and 185/65 R14 wheels.",
    bullets: [
      "2 caballos · MMA 2.600 kg",
      "2 ejes KNOTT de 1.300 kg reforzados",
      "Ejes PULLMAN V2 con freno de inercia y amortiguación",
      "Suelo de aluminio con goma · luz interior",
      "Ruedas 185/65 R14 sin cámara",
    ],
    bulletsEn: [
      "2 horses · 2,600 kg gross weight",
      "Two reinforced 1,300 kg KNOTT axles",
      "PULLMAN V2 axles, overrun braking and damping",
      "Aluminium floor with rubber matting · interior light",
      "185/65 R14 tubeless wheels",
    ],
  },
  {
    slug: "cheval-liberte-touring-one",
    precio: 9195,
    mpn: "CL-TOURING-ONE",
    short:
      "Un caballo y medio homologado a 1.600 kg con dos ejes KNOTT de 900 kg. Suelo de goma, luz interior y cojines laterales.",
    shortEn:
      "Horse-and-a-half rated at 1,600 kg on two 900 kg KNOTT axles. Rubber floor, interior light and side cushions.",
    bullets: [
      "Un caballo y medio · MMA 1.600 kg",
      "2 ejes KNOTT de 900 kg reforzados",
      "Suelo de goma · luz interior de serie",
      "Cojines laterales de apoyo",
      "Compatible con carnet B",
    ],
    bulletsEn: [
      "Horse-and-a-half · 1,600 kg gross weight",
      "Two reinforced 900 kg KNOTT axles",
      "Rubber floor · interior light as standard",
      "Side support cushions",
      "B-licence compatible",
    ],
  },
];

async function main(): Promise<void> {
  const categorias = new Map<string, string>();
  const grupo = await prisma.group.findUniqueOrThrow({ where: { slug: "nuevos" } });
  for (const categoria of await prisma.category.findMany({ where: { groupId: grupo.id } })) {
    categorias.set(categoria.slug, categoria.id);
  }

  console.log("Import de la gamme Cheval Liberté");
  for (const ficha of FICHAS) {
    const categoryId = categorias.get(ficha.categoria);
    if (!categoryId) {
      console.log(`  ! catégorie absente : ${ficha.categoria}`);
      continue;
    }

    const datos = {
      categoryId,
      brand: MARCA,
      name: ficha.name,
      nameEn: ficha.nameEn,
      sku: ficha.mpn,
      mpn: ficha.mpn,
      shortDescription: ficha.short,
      shortDescriptionEn: ficha.shortEn,
      description: ficha.description,
      descriptionEn: ficha.descriptionEn,
      bullets: JSON.stringify(ficha.bullets),
      bulletsEn: JSON.stringify(ficha.bulletsEn),
      condition: "new",
      image: ficha.image,
      priceCents: ficha.precio * 100,
      // Le prix barré du distributeur n'est pas repris : ce serait annoncer une
      // référence de prix que nous n'avons jamais pratiquée.
      oldPriceCents: null,
      shippingWeightGrams: ficha.taraKg ? ficha.taraKg * 1000 : null,
      stock: 2,
      active: true,
    };

    await prisma.product.upsert({
      where: { slug: ficha.slug },
      update: datos,
      create: { ...datos, slug: ficha.slug },
    });

    console.log(`  ${ficha.slug} — ${ficha.precio.toLocaleString("es-ES")} € [${ficha.categoria}]`);
  }

  console.log("\nCorrection des fiches déjà au catalogue");
  for (const correccion of CORRECCIONES) {
    const existente = await prisma.product.findUnique({ where: { slug: correccion.slug } });
    if (!existente) {
      console.log(`  ! introuvable : ${correccion.slug}`);
      continue;
    }

    await prisma.product.update({
      where: { slug: correccion.slug },
      data: {
        priceCents: correccion.precio * 100,
        mpn: correccion.mpn,
        shortDescription: correccion.short,
        shortDescriptionEn: correccion.shortEn,
        bullets: JSON.stringify(correccion.bullets),
        bulletsEn: JSON.stringify(correccion.bulletsEn),
      },
    });

    const antes = existente.priceCents / 100;
    console.log(
      `  ${correccion.slug} — ${antes.toLocaleString("es-ES")} € → ${correccion.precio.toLocaleString("es-ES")} €`,
    );
  }

  const total = await prisma.product.groupBy({
    by: ["categoryId"],
    _count: true,
  });
  const nombres = new Map(
    (await prisma.category.findMany({ include: { group: true } })).map((c) => [
      c.id,
      `${c.group.slug}/${c.slug}`,
    ]),
  );
  console.log("\nCatalogue après import :");
  for (const linea of total) {
    console.log(`  ${nombres.get(linea.categoryId)} — ${linea._count} produit(s)`);
  }
}

main()
  .catch((erreur) => {
    console.error(erreur);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
