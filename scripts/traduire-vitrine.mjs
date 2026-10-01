/**
 * Applique aux fichiers de messages la langue et le métier d'Equinomad.
 *
 *   node scripts/traduire-vitrine.mjs
 *
 * Trois opérations, dans cet ordre :
 *   1. suppression des espaces de noms hérités de la boutique de bois, devenus
 *      sans emploi depuis la réécriture des sections d'accueil ;
 *   2. remplacement des chaînes propres à la marque et au métier ;
 *   3. ajout de l'espace de noms « inicio », qui porte tout le texte de la page
 *      d'accueil.
 *
 * Pourquoi un script plutôt qu'une réécriture des fichiers à la main : les
 * messages qui ne changent pas — le tunnel d'achat, l'espace client — sont
 * conservés octet pour octet, et l'opération est rejouable. Un fichier JSON
 * réécrit en entier fait perdre la trace de ce qui a réellement changé.
 *
 * Le script est idempotent : le relancer ne produit aucune différence.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MENSAJES = path.join(RACINE, "src", "messages");

/** Espaces de noms de la boutique de bois, plus référencés nulle part. */
const OBSOLETOS = [
  "hero",
  "trust",
  "interventions",
  "sortiment",
  "feuchte",
  "holzarten",
  "lieferung",
  "stimmen",
  "faq",
];

// ---------------------------------------------------------------------------
// Espagnol
// ---------------------------------------------------------------------------

const ES = {
  common: {
    searchPlaceholder: "Remolque 2 caballos, Cheval Liberté, bola de enganche…",
    shopName: "Equinomad",
    groupNames: {
      remolques: "Remolques para caballos",
      accesorios: "Accesorios y recambios",
    },
    categoryNames: {
      "un-caballo": "Un caballo",
      "dos-caballos": "Dos caballos",
      "tres-cuatro-caballos": "Tres y cuatro caballos",
      ocasion: "Ocasión",
      accesorios: "Accesorios y recambios",
    },
    account: "Cuenta",
    wishlist: "Favoritos",
    cart: "Cesta",
    categories: "Categorías",
    showAll: "Ver todo",
    viewShop: "Ver la tienda",
    language: "Idioma",
    home: "Inicio",
    breadcrumb: "Ruta de navegación",
    from: "desde",
  },

  header: {
    homeAriaLabel: "Equinomad — página de inicio",
    logoAlt: "Equinomad",
    search: "Buscar",
    lieferzusage: "Entrega concertada en su domicilio",
    beratung: "Asesoramiento y pedidos",
    oeffnung: "Lun–Vie 9–18 h · Sáb 9–13 h",
    lieferbanner: "Matriculación e ITV incluidas",
    anrufenAria: "Llamar al {nummer}",
  },

  home: {
    metaTitle: "Equinomad | Remolques para caballos, matriculados y entregados en su domicilio",
    metaDescription:
      "Remolques y vans para 1, 2, 3 y 4 caballos de Cheval Liberté, Böckmann, Ifor Williams, Humbaur y Fautras. Homologados, matriculados, con ITV pasada y garantía de dos años.",
    bestsellerEyebrow: "Los más pedidos",
    bestseller: "Lo que sale esta semana",
    bestsellerCta: "Ver todo el catálogo",
  },

  group: {
    metaTitle: "{label} | Equinomad",
    metaDescription:
      "Todas las categorías de {label} en Equinomad: remolques homologados, precios claros y entrega concertada en su domicilio.",
    intro: "Todas las categorías de {label} de un vistazo.",
    productCount:
      "{count, plural, =0 {Ningún modelo por ahora} one {# modelo} other {# modelos}}",
  },

  category: {
    metaTitle: "{label} | Equinomad",
    productsCount: "<b>{filtered}</b> modelos de {total}",
    sortBy: "Ordenar por",
    sortRelevance: "Relevancia",
    sortPriceAsc: "Precio: de menor a mayor",
    sortPriceDesc: "Precio: de mayor a menor",
    sortNewest: "Novedades",
    emptyTitle: "Ningún modelo encontrado",
    emptyHint: "Ajuste los filtros para ver más resultados.",
    emptyReset: "Quitar los filtros",
    filtersTitle: "Filtros",
    filtersReset: "Quitar",
    filtersClose: "Cerrar los filtros",
    filtersApply:
      "{count, plural, =0 {Ver los modelos} one {Ver # modelo} other {Ver # modelos}}",
    filterBrand: "Marca",
    filterPrice: "Precio",
    filterRating: "Valoración",
    filterMinStars: "a partir de {rating} estrellas",
    filterInStockOnly: "Solo disponibles ahora",
    priceRanges: {
      under100: "Hasta 100 €",
      from100: "100 € – 5.000 €",
      from300: "5.000 € – 10.000 €",
      from600: "10.000 € – 20.000 €",
      over1000: "Más de 20.000 €",
    },
    guideTitle: "{label} en Equinomad",
    guideDiscover: "Ver {label}",
    guideAdvice: "Pedir asesoramiento",
  },

  product: {
    details: "Ficha técnica e información de servicio",
    description: "Descripción",
    features: "Características",
    related: "Modelos parecidos",
    sku: "Ref.",
    ratingOf: "{rating} sobre 5",
    reviewCount: "{count, plural, one {# opinión} other {# opiniones}}",
    paymentTitle: "Formas de pago seguras",
    metaTitle: "{name} | Equinomad",
    onRequest: "Bajo pedido",
    originalPrice: "Precio anterior",
    vatNote: "IVA incluido. Gastos de entrega aparte.",
    inStock: "En stock — entrega concertada en 5 a 10 días laborables",
    outOfStock: "Bajo pedido — disponible en 4 a 8 semanas",
    decreaseQuantity: "Restar una unidad",
    increaseQuantity: "Sumar una unidad",
    addToCart: "Añadir a la cesta",
    fastDelivery: "Entrega estándar: gratuita (5 a 10 días laborables)",
    expressDelivery: "Entrega prioritaria: 180 € (48 a 72 horas)",
    warranty: "14 días de desistimiento, sin tener que dar explicaciones",
    vatNoteFreeShipping: "Entrega estándar incluida en el precio",
    galleryLabel: "Otras vistas",
    galleryView: "Ver la imagen {index} de {total}",
    chooseVolume: "Elija la configuración",
    fromPrice: "desde",
    perStere: "la unidad",
  },

  payment: {
    title: "Formas de pago seguras",
    free: "sin recargo",
    acceptedTitle: "Formas de pago aceptadas",
    vitrine: {
      virement: "Transferencia bancaria",
      carte: "Tarjeta bancaria",
      paypal: "PayPal",
    },
  },

  footer: {
    logoAlt: "Equinomad",
    homeAriaLabel: "Equinomad — página de inicio",
    deliveryTitle: "Entrega estándar gratuita (5 a 10 días laborables)",
    deliveryDetail: "Entrega prioritaria: 180 € (48 a 72 horas)",
    warrantyTitle: "Matriculación e ITV incluidas",
    warrantyDetail: "El remolque llega con placa puesta y listo para enganchar",
    paymentTitle: "Pago seguro",
    paymentDetail: "Transmisión cifrada SSL",
    contact: "Contacto",
    service: "Servicio",
    about: "Empresa",
    legal: "Información legal",
    linkOrderStatus: "Seguimiento del pedido",
    linkReturns: "Devoluciones y reclamaciones",
    linkWithdrawal: "Derecho de desistimiento",
    linkContact: "Contacto",
    linkAboutUs: "Quiénes somos",
    linkJobs: "Trabaja con nosotros",
    linkPress: "Prensa",
    linkPartner: "Programa de colaboradores",
    linkImprint: "Aviso legal",
    linkPrivacy: "Privacidad",
    linkTerms: "Condiciones de venta",
    linkCookies: "Preferencias de cookies",
    copyright: "© {year} Equinomad.",
    oeffnung: "De lunes a viernes 9–18 h · Sábados 9–13 h",
  },

  wishlist: {
    title: "Favoritos",
    intro:
      "Los artículos marcados se guardan en este navegador — sin cuenta y sin iniciar sesión.",
    add: "Añadir a favoritos",
    remove: "Quitar de favoritos",
    loading: "Cargando los favoritos…",
    count: "{count, plural, one {# artículo} other {# artículos}}",
    clear: "Vaciar favoritos",
    emptyTitle: "Su lista de favoritos está vacía.",
    emptyText: "Pulse el corazón de un artículo para volver a encontrarlo aquí más adelante.",
    emptyCta: "Ver el catálogo",
  },

  reviews: {
    title: "Opiniones de clientes",
    count: "{count, plural, one {# opinión} other {# opiniones}}",
    starsLabel: "{star} estrellas",
    starsAria: "{rating} estrellas sobre 5",
    listAria:
      "Opiniones de clientes, {count, plural, one {# opinión} other {# opiniones}} — desplácese para leerlas",
    scrollHint:
      "{count, plural, one {# opinión} other {Las # opiniones}} — desplácese dentro del marco",
    emptyTitle: "Este modelo todavía no tiene opiniones.",
    emptyHint:
      "Cuente su experiencia y escriba la primera — ayudará a los demás a decidirse.",
    editorial: "Valoración de la redacción: {rating} sobre 5",
    writeTitle: "Escribir una opinión",
    formRatingLabel: "Su valoración",
    formRatingAria: "{value} estrellas sobre 5",
    formRatingRequired: "Elija una valoración de 1 a 5 estrellas.",
    formName: "Nombre",
    formCity: "Ciudad (opcional)",
    formEmail: "Correo electrónico (opcional)",
    formEmailHint: "No se publica. Solo lo usamos si tenemos alguna duda sobre su opinión.",
    formTitle: "Título (opcional)",
    formTitlePlaceholder: "p. ej. Se engancha solo y va muy estable",
    formBody: "Su experiencia",
    formBodyPlaceholder: "Qué le ha convencido y qué le ha decepcionado? Mínimo 10 caracteres.",
    formBodyCounter: "{count} / 2000 caracteres",
    formSubmit: "Enviar la opinión",
    formSubmitting: "Enviando…",
    formModerationNote: "Cada opinión se comprueba antes de publicarse.",
    formError: "No hemos podido enviar su opinión. Inténtelo de nuevo, por favor.",
    formSuccessTitle: "Gracias. Su opinión se publicará tras la comprobación.",
    formSuccessHint:
      "Leemos cada opinión personalmente. La validación suele tardar uno o dos días laborables.",
  },

  cart: {
    title: "Cesta",
    metaTitle: "Cesta | Equinomad",
    addToCart: "Añadir a la cesta",
    buyNow: "Comprar ahora",
    added: "Añadido",
    soldOut: "Agotado",
    increase: "Sumar una unidad",
    decrease: "Restar una unidad",
    quantityLabel: "Cantidad",
    indicatorWithItems:
      "Cesta: {count, plural, one {# artículo} other {# artículos}}, {total}",
    itemCount: "{count, plural, one {# artículo} other {# artículos}}",
    emptyTitle: "Su cesta está vacía",
    emptyText:
      "Recorra los remolques y los accesorios, y deje aquí lo que le interese.",
    emptyCta: "Ver el catálogo",
    columnProduct: "Artículo",
    columnUnitPrice: "Precio unitario",
    columnQuantity: "Cantidad",
    columnLineTotal: "Total",
    remove: "Quitar el artículo",
    removeLabel: "Quitar {name} de la cesta",
    clear: "Vaciar la cesta",
    continueShopping: "Seguir comprando",
    summaryTitle: "Resumen",
    subtotal: "Subtotal",
    shipping: "Gastos de entrega",
    shippingFree: "incluida",
    total: "Total",
    vatIncluded: "IVA {rate} % incluido ({amount})",
    vatNote: "Todos los precios incluyen el IVA.",
    shippingStandardHint: "La entrega estándar está incluida, sin importe mínimo de pedido.",
    shippingRule:
      "Entrega estándar incluida (5 a 10 días laborables), entrega prioritaria 180,00 € (48 a 72 horas). El modo de entrega se elige al tramitar el pedido.",
    deliveryTime: "La preparación comienza al confirmarse el pago.",
    withdrawalHint:
      "Como consumidor dispone de 14 días naturales para desistir de la compra (art. 71 del Real Decreto Legislativo 1/2007). El detalle figura en la página Derecho de desistimiento.",
    toCheckout: "Tramitar el pedido",
    onlyLeft: "Solo quedan {count}",
    stockAdjusted: "La cantidad se ha ajustado a las existencias disponibles.",
    revalidated:
      "Los precios y la disponibilidad se acaban de actualizar. Revise su cesta, por favor.",
    removedUnavailable: "Se han quitado de la cesta los artículos que ya no están disponibles.",
    loading: "Cargando la cesta…",
    drawerTitle: "Su cesta",
    drawerClose: "Cerrar la cesta",
    drawerViewCart: "Ver la cesta",
    campaignFreeShipping: "Entrega incluida gracias a su oferta",
  },

  inicio: {
    hero: {
      eyebrow: "Venta online y entrega a domicilio",
      titulo: "Su remolque para caballos,",
      tituloAcento: "entregado listo para enganchar.",
      descripcion:
        "Remolques y vans homologados de Cheval Liberté, Böckmann, Ifor Williams, Humbaur y Fautras. Se los entregamos matriculados, con la ITV pasada y la placa puesta: usted engancha y sale.",
      ctaCatalogo: "Ver el catálogo",
      imagenAlt: "Remolque para tres caballos de doble eje, visto de perfil",
      cifra1Valor: "24",
      cifra1Unidad: "modelos",
      cifra1Etiqueta: "De uno a cuatro caballos, en stock",
      cifra2Valor: "2",
      cifra2Unidad: "años",
      cifra2Etiqueta: "Garantía escrita, también en ocasión",
      cifra3Valor: "0",
      cifra3Unidad: "€",
      cifra3Etiqueta: "Matriculación e ITV, incluidas en el precio",
    },

    ciudades: {
      titulo: "Entregamos en",
    },

    garantias: {
      matriculacion: {
        titulo: "Matriculado y con ITV",
        texto: "Nos ocupamos de la homologación, la matrícula y la primera ITV. Usted no pisa la DGT.",
      },
      garantia: {
        titulo: "Dos años de garantía",
        texto: "Sin recortes sobre chasis, eje ni freno. También en las unidades de ocasión.",
      },
      entrega: {
        titulo: "Entrega concertada",
        texto:
          "Hasta su domicilio o su cuadra, con fecha acordada por teléfono. Destinos insulares y fuera de zona, a consultar.",
      },
      taller: {
        titulo: "Taller propio y recambios",
        texto: "Reparamos lo que vendemos y mantenemos en almacén las piezas que se rompen de verdad.",
      },
    },

    catalogo: {
      eyebrow: "Catálogo",
      titulo: "Elija por número de plazas",
      texto:
        "Las plazas mandan sobre todo lo demás: fijan la longitud, la MMA y, en consecuencia, el permiso que necesita. Empiece por ahí y el resto se decide solo.",
      desde: "desde",
      unidades: "{count, plural, =0 {Sin modelos} one {# modelo} other {# modelos}}",
    },

    permiso: {
      eyebrow: "Antes de elegir",
      titulo: "Puede arrastrarlo con su carnet?",
      intro:
        "Lo que cuenta no es el peso del remolque, sino la suma de la MMA del coche y la del remolque. Esa suma decide qué permiso necesita, y es la comprobación que más pedidos evita devolver.",
      avisoTitulo: "Y una segunda comprobación:",
      avisoTexto:
        "su vehículo tractor tiene declarada en la ficha técnica una masa máxima remolcable. Ese número manda sobre el permiso: aunque el carnet le habilite, no puede superar lo que el fabricante autoriza para su coche. Llámenos con la ficha técnica delante y lo miramos juntos en dos minutos.",
      b: {
        etiqueta: "Carnet B",
        titulo: "Carnet B",
        texto:
          "Conjunto de hasta 3.500 kg sumando coche y remolque. Da para casi todos los monoplazas y para algún dos plazas ligero con un todocamino grande.",
      },
      b96: {
        etiqueta: "Carnet B96",
        titulo: "Carnet B96",
        texto:
          "Hasta 4.250 kg. Se obtiene con una formación de siete horas y sin examen teórico: es el salto más barato para pasar a un dos plazas normal.",
      },
      be: {
        etiqueta: "Carnet B+E",
        titulo: "Carnet B+E",
        texto:
          "Hasta 7.000 kg, con el remolque limitado a 3.500 kg de MMA. Obligatorio para tres y cuatro plazas. Exige examen práctico.",
      },
    },

    materiales: {
      eyebrow: "El segundo arbitraje",
      titulo: "Poliéster, aluminio o mixto",
      intro:
        "Ningún material es mejor que otro en abstracto. Lo que cambia es dónde paga usted la diferencia: en la carga útil, en la temperatura interior o en la factura del taller.",
      criterio: "Criterio",
      criterios: {
        peso: "Peso en vacío",
        aislamiento: "Aislamiento térmico",
        golpes: "Resistencia a golpes",
        mantenimiento: "Mantenimiento",
        precio: "Precio",
      },
      poliester: {
        nombre: "Poliéster",
        resumen: "El más extendido",
        peso: "Referencia. Es el material contra el que se comparan los otros dos.",
        aislamiento:
          "Bueno. En parado bajo el sol el interior se mantiene claramente por debajo del de una caja metálica.",
        golpes:
          "Encaja el golpe sin abollarse, pero una rotura fuerte obliga a reparar con resina, no a enderezar.",
        mantenimiento: "Lavado y poco más. El color se apaga con los años si no se encera.",
        precio: "El más contenido de los tres.",
      },
      aluminio: {
        nombre: "Aluminio",
        resumen: "El más ligero",
        peso: "Entre 80 y 150 kg menos, que pasan íntegros a la carga útil.",
        aislamiento:
          "El punto débil, salvo en panel sándwich con núcleo aislante. Exija extractores de techo.",
        golpes: "Se abolla, pero se endereza. Un panel dañado se sustituye por separado.",
        mantenimiento: "Prácticamente nulo. No se oxida y no pierde color.",
        precio: "De un 20 a un 40 % por encima del poliéster equivalente.",
      },
      mixto: {
        nombre: "Mixto",
        resumen: "Acero y poliéster",
        peso: "El más pesado. Chasis y estructura en acero galvanizado.",
        aislamiento: "El del poliéster, con la inercia térmica añadida del bastidor.",
        golpes: "El más resistente del conjunto. Es lo que se compra para uso duro.",
        mantenimiento:
          "Revisar la galvanización en zonas de costa. Si está hecha en caliente, aguanta décadas.",
        precio: "Intermedio, y el que mejor resiste la reventa.",
      },
      nota:
        "Un apunte que casi nunca se dice: la diferencia de peso entre materiales solo importa si su vehículo tractor va justo de masa remolcable. Si le sobran 400 kg de margen, el aluminio le está cobrando una ventaja que usted no va a usar.",
    },

    proceso: {
      eyebrow: "Cómo funciona",
      titulo: "De la compra a la primera salida",
      intro:
        "Cuatro pasos, y solo el primero depende de usted. Los plazos son los reales de este año, no los del folleto.",
      pedido: {
        titulo: "Pedido y comprobación",
        texto:
          "Confirmamos por teléfono la MMA de su vehículo y el permiso antes de cobrar nada. Si el conjunto no cuadra, se lo decimos y buscamos otro modelo.",
        plazo: "Mismo día laborable",
      },
      matriculacion: {
        titulo: "Homologación y matrícula",
        texto:
          "Presentamos la documentación en Tráfico, pasamos la primera ITV y montamos la placa. El impuesto de matriculación va incluido en el precio que ve.",
        plazo: "10 a 15 días",
      },
      entrega: {
        titulo: "Entrega concertada",
        texto:
          "Transporte especializado hasta su dirección, con fecha y franja horaria acordadas. Nada viaja en camión abierto.",
        plazo: "5 a 10 días laborables",
      },
      puesta: {
        titulo: "Puesta en marcha",
        texto:
          "En la entrega revisamos el enganche con su coche, ajustamos la altura del cabezal y le explicamos el freno de inercia. Media hora bien empleada.",
        plazo: "En el momento de la entrega",
      },
    },

    faq: {
      eyebrow: "Preguntas frecuentes",
      titulo: "Lo que nos preguntan antes de comprar",
      intro:
        "Si su pregunta no está aquí, llámenos. De lunes a viernes de 9 a 18 h, quien coge el teléfono ha entregado remolques.",
      carnet: {
        q: "Necesito el carnet B+E?",
        a: "Depende de la suma de la MMA de su coche y la del remolque. Hasta 3.500 kg le vale el carnet B; hasta 4.250 kg, el B96, que se saca con siete horas de formación y sin examen teórico. Por encima, o con cualquier remolque de tres o cuatro plazas, hace falta el B+E con examen práctico.",
      },
      matriculacion: {
        q: "Tengo que ocuparme yo de la matriculación?",
        a: "No. Presentamos la documentación en Tráfico, pasamos la primera ITV y montamos la placa antes de entregarle el remolque. El impuesto de matriculación está incluido en el precio que aparece en la ficha. Usted solo firma el contrato de compraventa.",
      },
      entrega: {
        q: "Cuánto tarda la entrega y a dónde llegan?",
        a: "Entre 5 y 10 días laborables desde que el remolque está matriculado, en toda la Península, con fecha y franja acordadas por teléfono. A Baleares y Canarias entregamos previo presupuesto de transporte marítimo; escríbanos antes de pedir y le damos el importe cerrado.",
      },
      itv: {
        q: "Cada cuánto hay que pasar la ITV de un remolque?",
        a: "Los remolques de más de 750 kg de MMA pasan la primera ITV a los dos años de la matriculación y después cada dos años hasta los diez, momento a partir del cual la inspección es anual. La primera se la damos pasada; las siguientes las programamos nosotros si nos deja el aviso activado en su cuenta.",
      },
      garantia: {
        q: "Qué cubre exactamente la garantía?",
        a: "Dos años sobre el conjunto del vehículo, incluidos chasis, eje y freno, sin la letra pequeña que excluye esas tres piezas como «desgaste normal». Es la garantía legal española, y no la recortamos al mínimo que permite la norma. En las unidades de ocasión rige exactamente igual.",
      },
      financiacion: {
        q: "Puedo financiar la compra?",
        a: "Sí, en 12, 24 o 36 meses, con estudio previo y sin compromiso. La aprobación depende de la entidad financiera, no de nosotros. Para importes por encima de 3.000 € muchos bancos limitan el pago con tarjeta: en ese caso, la transferencia suele ser el camino más rápido.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Anglais — mêmes clés, marché transfrontalier
// ---------------------------------------------------------------------------

const EN = {
  common: {
    searchPlaceholder: "Two-horse trailer, Cheval Liberté, tow ball…",
    shopName: "Equinomad",
    groupNames: {
      remolques: "Horse trailers",
      accesorios: "Accessories & spares",
    },
    categoryNames: {
      "un-caballo": "One horse",
      "dos-caballos": "Two horses",
      "tres-cuatro-caballos": "Three and four horses",
      ocasion: "Nearly new",
      accesorios: "Accessories & spares",
    },
    account: "Account",
    wishlist: "Saved",
    cart: "Basket",
    categories: "Categories",
    showAll: "Show all",
    viewShop: "Visit the shop",
    language: "Language",
    home: "Home",
    breadcrumb: "Breadcrumb",
    from: "from",
  },

  header: {
    homeAriaLabel: "Equinomad — home page",
    logoAlt: "Equinomad",
    search: "Search",
    lieferzusage: "Scheduled delivery to your door",
    beratung: "Advice & orders",
    oeffnung: "Mon–Fri 9am–6pm · Sat 9am–1pm",
    lieferbanner: "Registration and roadworthiness test included",
    anrufenAria: "Call {nummer}",
  },

  home: {
    metaTitle: "Equinomad | Horse trailers, registered and delivered to your door",
    metaDescription:
      "Trailers and vans for 1, 2, 3 and 4 horses from Cheval Liberté, Böckmann, Ifor Williams, Humbaur and Fautras. Type-approved, registered, tested and covered by a two-year warranty.",
    bestsellerEyebrow: "Most ordered",
    bestseller: "Moving this week",
    bestsellerCta: "See the full catalogue",
  },

  group: {
    metaTitle: "{label} | Equinomad",
    metaDescription:
      "Every {label} category at Equinomad: type-approved trailers, clear pricing and scheduled delivery to your door.",
    intro: "Every {label} category at a glance.",
    productCount: "{count, plural, =0 {No models yet} one {# model} other {# models}}",
  },

  category: {
    metaTitle: "{label} | Equinomad",
    productsCount: "<b>{filtered}</b> of {total} models",
    sortBy: "Sort by",
    sortRelevance: "Relevance",
    sortPriceAsc: "Price: low to high",
    sortPriceDesc: "Price: high to low",
    sortNewest: "New in",
    emptyTitle: "No models found",
    emptyHint: "Adjust your filters to see more results.",
    emptyReset: "Clear filters",
    filtersTitle: "Filters",
    filtersReset: "Clear",
    filtersClose: "Close filters",
    filtersApply: "{count, plural, =0 {Show models} one {Show # model} other {Show # models}}",
    filterBrand: "Make",
    filterPrice: "Price",
    filterRating: "Rating",
    filterMinStars: "{rating} stars and up",
    filterInStockOnly: "In stock only",
    priceRanges: {
      under100: "Up to €100",
      from100: "€100 – €5,000",
      from300: "€5,000 – €10,000",
      from600: "€10,000 – €20,000",
      over1000: "Over €20,000",
    },
    guideTitle: "{label} at Equinomad",
    guideDiscover: "Browse {label}",
    guideAdvice: "Ask for advice",
  },

  product: {
    details: "Specification and service information",
    description: "Description",
    features: "Key features",
    related: "Similar models",
    sku: "Ref.",
    ratingOf: "{rating} out of 5",
    reviewCount: "{count, plural, one {# review} other {# reviews}}",
    paymentTitle: "Secure payment methods",
    metaTitle: "{name} | Equinomad",
    onRequest: "To order",
    originalPrice: "Was",
    vatNote: "VAT included. Delivery charged separately.",
    inStock: "In stock — scheduled delivery within 5 to 10 working days",
    outOfStock: "To order — available in 4 to 8 weeks",
    decreaseQuantity: "Remove one",
    increaseQuantity: "Add one",
    addToCart: "Add to basket",
    fastDelivery: "Standard delivery: free (5 to 10 working days)",
    expressDelivery: "Priority delivery: €180 (48 to 72 hours)",
    warranty: "14 days to change your mind, no reason needed",
    vatNoteFreeShipping: "Standard delivery included",
    galleryLabel: "Other views",
    galleryView: "Show image {index} of {total}",
    chooseVolume: "Choose the configuration",
    fromPrice: "from",
    perStere: "each",
  },

  payment: {
    title: "Secure payment methods",
    free: "no surcharge",
    acceptedTitle: "Accepted payment methods",
    vitrine: {
      virement: "Bank transfer",
      carte: "Card",
      paypal: "PayPal",
    },
  },

  footer: {
    logoAlt: "Equinomad",
    homeAriaLabel: "Equinomad — home page",
    deliveryTitle: "Free standard delivery (5 to 10 working days)",
    deliveryDetail: "Priority delivery: €180 (48 to 72 hours)",
    warrantyTitle: "Registration and roadworthiness test included",
    warrantyDetail: "The trailer arrives plated and ready to hitch",
    paymentTitle: "Secure payment",
    paymentDetail: "SSL encrypted transmission",
    contact: "Contact",
    service: "Service",
    about: "Company",
    legal: "Legal",
    linkOrderStatus: "Order tracking",
    linkReturns: "Returns & complaints",
    linkWithdrawal: "Right of withdrawal",
    linkContact: "Contact",
    linkAboutUs: "About us",
    linkJobs: "Jobs",
    linkPress: "Press",
    linkPartner: "Partner programme",
    linkImprint: "Legal notice",
    linkPrivacy: "Privacy",
    linkTerms: "Terms of sale",
    linkCookies: "Cookie preferences",
    copyright: "© {year} Equinomad.",
    oeffnung: "Monday to Friday 9am–6pm · Saturday 9am–1pm",
  },

  reviews: {
    emptyTitle: "This model has no reviews yet.",
    emptyHint: "Tell us how it went and write the first one — it will help others decide.",
    formTitlePlaceholder: "e.g. Hitches easily and tows very steadily",
    formBodyPlaceholder: "What convinced you, and what disappointed you? 10 characters minimum.",
  },

  cart: {
    metaTitle: "Basket | Equinomad",
    emptyText: "Browse the trailers and accessories, and drop what interests you here.",
    shippingRule:
      "Standard delivery included (5 to 10 working days), priority delivery €180.00 (48 to 72 hours). You choose the delivery method at checkout.",
    withdrawalHint:
      "As a consumer you have 14 calendar days to withdraw from the purchase (art. 71 of Royal Legislative Decree 1/2007). The details are on the Right of withdrawal page.",
    deliveryTime: "Preparation starts once payment is confirmed.",
    shippingStandardHint: "Standard delivery is included, with no minimum order value.",
  },

  inicio: {
    hero: {
      eyebrow: "Buy online, delivered to your door",
      titulo: "Your horse trailer,",
      tituloAcento: "delivered ready to hitch up.",
      descripcion:
        "Type-approved trailers and vans from Cheval Liberté, Böckmann, Ifor Williams, Humbaur and Fautras. Delivered registered, tested and plated: hitch up and go.",
      ctaCatalogo: "Browse the catalogue",
      imagenAlt: "Twin-axle three-horse trailer seen from the side",
      cifra1Valor: "24",
      cifra1Unidad: "models",
      cifra1Etiqueta: "One to four horses, in stock",
      cifra2Valor: "2",
      cifra2Unidad: "years",
      cifra2Etiqueta: "Written warranty, nearly new included",
      cifra3Valor: "0",
      cifra3Unidad: "€",
      cifra3Etiqueta: "Registration and testing, included in the price",
    },

    ciudades: {
      titulo: "We deliver to",
    },

    garantias: {
      matriculacion: {
        titulo: "Registered and tested",
        texto: "We handle type approval, plates and the first roadworthiness test. You never set foot in a traffic office.",
      },
      garantia: {
        titulo: "Two-year warranty",
        texto: "No carve-outs on chassis, axle or brake. Nearly-new units included.",
      },
      entrega: {
        titulo: "Scheduled delivery",
        texto:
          "To your home or your yard, on a date agreed by phone. Island and long-haul destinations on request.",
      },
      taller: {
        titulo: "Our own workshop",
        texto: "We repair what we sell and stock the parts that actually break.",
      },
    },

    catalogo: {
      eyebrow: "Catalogue",
      titulo: "Start with the number of stalls",
      texto:
        "Stalls decide everything else: length, gross weight and therefore the licence you need. Start there and the rest follows.",
      desde: "from",
      unidades: "{count, plural, =0 {No models} one {# model} other {# models}}",
    },

    permiso: {
      eyebrow: "Before you choose",
      titulo: "Can you tow it on your licence?",
      intro:
        "What counts is not the weight of the trailer but the combined gross weight of car and trailer. That sum decides which licence you need, and checking it prevents more returns than anything else we do.",
      avisoTitulo: "And a second check:",
      avisoTexto:
        "your towing vehicle has a maximum towable mass on its registration document. That figure overrides the licence: even if your entitlement allows more, you cannot exceed what the manufacturer authorises. Call us with the document in front of you and we will go through it in two minutes.",
      b: {
        etiqueta: "Licence B",
        titulo: "Licence B",
        texto:
          "Up to 3,500 kg for car and trailer combined. Enough for most single-horse trailers and for a light two-stall behind a large 4x4.",
      },
      b96: {
        etiqueta: "Licence B96",
        titulo: "Licence B96",
        texto:
          "Up to 4,250 kg. Seven hours of training, no theory exam: the cheapest step up to a normal two-stall trailer.",
      },
      be: {
        etiqueta: "Licence B+E",
        titulo: "Licence B+E",
        texto:
          "Up to 7,000 kg, with the trailer capped at 3,500 kg. Required for every three- and four-stall trailer. Practical test needed.",
      },
    },

    materiales: {
      eyebrow: "The second decision",
      titulo: "Polyester, aluminium or mixed",
      intro:
        "No material is better in the abstract. What changes is where you pay for it: in payload, in cabin temperature, or in the workshop bill.",
      criterio: "Criterion",
      criterios: {
        peso: "Unladen weight",
        aislamiento: "Thermal insulation",
        golpes: "Impact resistance",
        mantenimiento: "Maintenance",
        precio: "Price",
      },
      poliester: {
        nombre: "Polyester",
        resumen: "The most common",
        peso: "The benchmark. It is what the other two are measured against.",
        aislamiento:
          "Good. Parked in the sun, the inside stays clearly cooler than a metal box.",
        golpes: "Absorbs impacts without denting, but a real break needs resin repair, not panel beating.",
        mantenimiento: "Washing, little else. The colour dulls over the years without waxing.",
        precio: "The most affordable of the three.",
      },
      aluminio: {
        nombre: "Aluminium",
        resumen: "The lightest",
        peso: "80 to 150 kg less, all of it going straight into payload.",
        aislamiento:
          "The weak point, unless it is sandwich panel with an insulating core. Insist on roof extractors.",
        golpes: "It dents, but it can be straightened. A damaged panel is replaced on its own.",
        mantenimiento: "Close to none. It does not rust and does not fade.",
        precio: "20 to 40 % above the equivalent polyester model.",
      },
      mixto: {
        nombre: "Mixed",
        resumen: "Steel and polyester",
        peso: "The heaviest. Galvanised steel chassis and frame.",
        aislamiento: "That of polyester, plus the thermal mass of the frame.",
        golpes: "The toughest of the three. This is what you buy for hard use.",
        mantenimiento:
          "Check the galvanising near the coast. Hot-dip galvanising lasts decades.",
        precio: "In between, and the best at holding resale value.",
      },
      nota:
        "One thing rarely said out loud: the weight difference between materials only matters if your towing vehicle is close to its limit. With 400 kg of headroom to spare, aluminium is charging you for an advantage you will never use.",
    },

    proceso: {
      eyebrow: "How it works",
      titulo: "From order to first outing",
      intro:
        "Four steps, and only the first depends on you. These are this year's real timings, not brochure figures.",
      pedido: {
        titulo: "Order and checks",
        texto:
          "We confirm your vehicle's towing capacity and your licence by phone before taking any money. If the combination does not work, we say so and find another model.",
        plazo: "Same working day",
      },
      matriculacion: {
        titulo: "Approval and plates",
        texto:
          "We file the paperwork, pass the first roadworthiness test and fit the plate. Registration tax is included in the price you see.",
        plazo: "10 to 15 days",
      },
      entrega: {
        titulo: "Scheduled delivery",
        texto:
          "Specialist transport to your address, on an agreed date and time slot. Nothing travels on an open truck.",
        plazo: "5 to 10 working days",
      },
      puesta: {
        titulo: "Handover",
        texto:
          "On delivery we check the hitch against your car, set the coupling height and walk you through the overrun brake. Half an hour well spent.",
        plazo: "At handover",
      },
    },

    faq: {
      eyebrow: "Frequently asked",
      titulo: "What buyers ask before ordering",
      intro:
        "If your question is not here, call us. Monday to Friday, 9am to 6pm, whoever answers has delivered trailers.",
      carnet: {
        q: "Do I need a B+E licence?",
        a: "It depends on the combined gross weight of your car and the trailer. Up to 3,500 kg a standard B licence is enough; up to 4,250 kg you need B96, which takes seven hours of training and no theory exam. Above that, or with any three- or four-stall trailer, you need B+E with a practical test.",
      },
      matriculacion: {
        q: "Do I have to deal with registration myself?",
        a: "No. We file the paperwork, pass the first roadworthiness test and fit the plate before the trailer reaches you. Registration tax is included in the listed price. You only sign the sale contract.",
      },
      entrega: {
        q: "How long is delivery and where do you go?",
        a: "Five to ten working days once the trailer is registered, anywhere on the Spanish mainland, on a date and time slot agreed by phone. For the Balearics and Canaries we quote sea freight in advance; write to us before ordering and we will give you a fixed figure.",
      },
      itv: {
        q: "How often does a trailer need testing?",
        a: "Trailers over 750 kg gross are tested two years after registration, then every two years up to ten years old, and annually after that. We hand yours over with the first test passed; we schedule the rest for you if you leave the reminder switched on in your account.",
      },
      garantia: {
        q: "What exactly does the warranty cover?",
        a: "Two years on the whole vehicle, chassis, axle and brake included, without the small print that excludes those three as fair wear and tear. It is the Spanish statutory warranty, and we do not trim it to the legal minimum. Nearly-new units are covered on identical terms.",
      },
      financiacion: {
        q: "Can I finance the purchase?",
        a: "Yes, over 12, 24 or 36 months, assessed in advance and without obligation. Approval rests with the finance house, not with us. Above €3,000 many Spanish banks cap card payments; a bank transfer is usually the quicker route in that case.",
      },
    },
  },
};

/** Fusion en profondeur : les clés absentes du patch sont conservées. */
function fusionar(base, patch) {
  const salida = { ...base };
  for (const [clave, valor] of Object.entries(patch)) {
    salida[clave] =
      valor && typeof valor === "object" && !Array.isArray(valor)
        ? fusionar(base?.[clave] ?? {}, valor)
        : valor;
  }
  return salida;
}

async function aplicar(archivo, patch) {
  const ruta = path.join(MENSAJES, archivo);
  const mensajes = JSON.parse(await readFile(ruta, "utf-8"));

  for (const obsoleto of OBSOLETOS) delete mensajes[obsoleto];

  const resultado = fusionar(mensajes, patch);
  await writeFile(ruta, `${JSON.stringify(resultado, null, 2)}\n`, "utf-8");

  const total = Object.keys(resultado).length;
  console.log(`${archivo} : ${total} espacios de nombres`);
}

await aplicar("es.json", ES);
await aplicar("en.json", EN);
