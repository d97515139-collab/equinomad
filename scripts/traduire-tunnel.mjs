/**
 * Traduit en espagnol le tunnel d'achat, l'espace client et les petits espaces
 * de noms restés en français après la reprise de la vitrine.
 *
 *   node scripts/traduire-tunnel.mjs
 *
 * Même principe que `traduire-vitrine.mjs` : une fusion en profondeur, donc les
 * clés absentes du patch sont conservées telles quelles et le script est
 * rejouable sans produire de différence.
 *
 * Les renvois juridiques changent de pays en même temps que la langue. Ce n'est
 * pas de la traduction mais de la substitution : citer le Code de la
 * consommation français sur une boutique espagnole serait faux, pas seulement
 * mal traduit. Correspondances retenues :
 *
 *   rétractation 14 jours   -> desistimiento, art. 71 del RDL 1/2007 (TRLGDCU)
 *   conservation comptable  -> art. 30 del Código de Comercio (seis años)
 *                              et art. 66 de la Ley 58/2003 (cuatro años)
 *   protection des données  -> RGPD + LOPDGDD 3/2018
 *
 * Ces textes restent un modèle : ils doivent être relus par un juriste espagnol
 * avant mise en ligne, comme le rappelle docs/LEGAL.md.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MENSAJES = path.join(RACINE, "src", "messages");

// ---------------------------------------------------------------------------
// Espagnol
// ---------------------------------------------------------------------------

const ES = {
  recherche: {
    metaTitle: "Resultados de «{query}» | Remolque Caballos",
    breadcrumb: "Resultados de búsqueda",
    titre: "Resultados de «{query}»",
    resultats:
      "{count, plural, =0 {Ningún resultado} one {# resultado} other {# resultados}}",
    vide: "Escriba algo para buscar: una marca, un número de plazas o una referencia.",
  },

  recentlyViewed: {
    title: "Vistos recientemente",
    intro:
      "Los modelos que ha mirado durante esta visita. La lista no sobrevive al cierre de la pestaña.",
    loading: "Cargando su historial…",
    count: "{count, plural, one {# modelo visto} other {# modelos vistos}}",
    emptyTitle: "Todavía no hay nada que mostrar",
    emptyText: "Abra la ficha de un modelo y aparecerá aquí.",
    emptyCta: "Ver el catálogo",
  },

  exitIntent: {
    title: "Antes de irse…",
    subtitle:
      "{count, plural, one {Ha mirado este modelo durante su visita. Sigue esperándole.} other {Ha mirado # modelos durante su visita. Siguen esperándole.}}",
    cta: "Volver a verlos",
    dismiss: "Seguir mirando",
    close: "Cerrar",
  },

  campaign: {
    eyebrow: "Oferta",
    endsIn: "Termina en",
    dayShort: "d",
    validUntil: "Válida hasta el {date}",
    legalNote:
      "Los precios promocionales indicados son válidos hasta el {date} y se aplican automáticamente en la cesta. Después vuelve a aplicarse el precio habitual. Precios sin gastos de entrega.",
  },

  checkout: {
    metaTitle: "Tramitar pedido | Remolque Caballos",
    title: "Tramitar pedido",
    backToCart: "Volver a la cesta",
    emptyTitle: "Su cesta está vacía",
    emptyText: "Añada algún artículo a la cesta antes de tramitar el pedido.",
    emptyCta: "Ver el catálogo",
    stepOf: "Paso {current} de {total}",
    steps: {
      contact: "Contacto y dirección",
      payment: "Pago",
      review: "Revisar y confirmar",
    },
    next: "Continuar",
    back: "Atrás",
    edit: "Modificar",
    contactTitle: "Datos de contacto",
    contactHint:
      "A esta dirección le escribiremos si tenemos alguna duda sobre su pedido.",
    email: "Correo electrónico",
    phone: "Teléfono",
    phoneHint: "Necesario para acordar la fecha y la franja de entrega.",
    billingTitle: "Dirección de facturación",
    shippingTitle: "Dirección de entrega",
    sameAsBilling: "La dirección de entrega coincide con la de facturación",
    salutation: "Tratamiento",
    salutationNone: "Sin especificar",
    salutationMr: "Sr.",
    salutationMrs: "Sra.",
    salutationDiverse: "Otro",
    firstName: "Nombre",
    lastName: "Apellidos",
    company: "Empresa (opcional)",
    street: "Calle y número",
    postalCode: "Código postal",
    city: "Localidad",
    country: "País",
    countryFR: "España",
    countryHint: "Elija su país de entrega.",
    countryPlaceholder: "Buscar un país",
    countryToggle: "Abrir la lista de países",
    countryEmpty: "Ningún país encontrado.",
    noteTitle: "Observaciones sobre el pedido (opcional)",
    notePlaceholder:
      "p. ej. fecha de entrega preferida, o cómo es el acceso a la finca para un camión.",
    paymentTitle: "Elegir la forma de pago",
    paymentNone:
      "Por ahora no hay ninguna forma de pago activa. Póngase en contacto con nosotros por teléfono.",
    paymentFree: "sin recargo",
    reviewTitle: "Revisar el pedido",
    reviewIntro:
      "Compruebe sus datos. Al pulsar el botón realiza un pedido en firme con obligación de pago.",
    reviewContact: "Contacto",
    reviewBilling: "Dirección de facturación",
    reviewShipping: "Dirección de entrega",
    reviewShippingMethod: "Modo de entrega",
    reviewPayment: "Forma de pago",
    reviewItems: "Sus artículos",
    reviewNote: "Sus observaciones",
    quantityShort: "{count} ×",
    essentialProperties: "Características esenciales",
    shippingMethodTitle: "Modo de entrega",
    shippingMethods: {
      standard: {
        label: "Entrega estándar",
        delay: "Entrega en 5 a 10 días laborables",
      },
      express: {
        label: "Entrega prioritaria",
        delay: "Entrega en 48 a 72 horas",
      },
    },
    deliveryTitle: "Entrega",
    deliveryTime: "La preparación comienza al confirmarse el pago.",
    deliveryCountry: "Entrega en la Península. Baleares y Canarias, presupuesto aparte.",
    summaryTitle: "Importe total",
    subtotal: "Subtotal",
    shipping: "Gastos de entrega",
    shippingFree: "incluida",
    total: "Total",
    vatIncluded: "IVA {rate} % incluido ({amount})",
    priceNote: "Todos los precios son precios finales.",
    termsLabel:
      "He leído y acepto las <terms>condiciones generales de venta</terms>. He leído la <privacy>política de privacidad</privacy>.",
    withdrawalLabel:
      "He leído la <withdrawal>información sobre el derecho de desistimiento</withdrawal> y sé que dispongo de 14 días naturales para desistir de este contrato sin tener que dar explicaciones.",
    consentRequired: "Confirme las dos casillas para finalizar el pedido.",
    submit: "Pedir con obligación de pago",
    submitting: "Enviando el pedido…",
    submitNote:
      "Al confirmar celebra un contrato de compra de los artículos anteriores, por un importe total de {total}.",
    errors: {
      invalid_payload: "No hemos podido leer el pedido. Inténtelo de nuevo, por favor.",
      cart_empty: "Su cesta está vacía.",
      cart_too_large: "Su cesta contiene demasiados artículos distintos.",
      invalid_email: "Indique una dirección de correo válida.",
      invalid_name: "Indique su nombre y sus apellidos.",
      invalid_street: "Indique la calle y el número.",
      invalid_postal_code: "Indique un código postal válido (cinco cifras).",
      invalid_city: "Indique una localidad.",
      unsupported_country: "Indique un país válido.",
      invalid_phone: "Indique un número de teléfono válido.",
      invalid_payment_method: "Elija una forma de pago disponible.",
      terms_required: "Acepte las condiciones generales de venta.",
      withdrawal_required: "Confirme la información sobre el derecho de desistimiento.",
      product_unavailable: "Un artículo de su cesta ya no está disponible.",
      insufficient_stock:
        "{available, plural, =0 {No queda ninguna unidad} one {Solo queda # unidad} other {Solo quedan # unidades}} de «{name}».",
      order_failed: "No hemos podido finalizar el pedido. Inténtelo de nuevo, por favor.",
      network: "Se ha perdido la conexión con la tienda. Inténtelo de nuevo, por favor.",
      invalid_quantity: "Elija una cantidad entre 1 y 20 por artículo.",
    },
    confirmation: {
      metaTitle: "Confirmación del pedido {orderNumber} | Remolque Caballos",
      title: "Gracias por su pedido",
      subtitle: "Hemos recibido su pedido correctamente.",
      orderNumber: "Número de pedido",
      orderDate: "Fecha del pedido",
      emailNotice:
        "Consulte su correo electrónico: allí encontrará los datos de pago necesarios para validar el pedido.",
      notFoundTitle: "Pedido no encontrado",
      notFoundText:
        "El enlace está incompleto o ha caducado. Utilice el enlace que figura en su confirmación de pedido.",
      itemsTitle: "Artículos pedidos",
      addressTitle: "Direcciones",
      contactTitle: "Contacto",
      paymentTitle: "Pago",
      statusTitle: "Estado",
      statusOrder: "Estado del pedido",
      statusPayment: "Estado del pago",
      instructionsTitle: "Qué ocurre ahora",
      instructions: {
        vorkasse:
          "Transfiera el importe total de {total} indicando el número de pedido {orderNumber}. Preparamos el envío en cuanto recibimos el importe.",
        rechnung:
          "Recibirá la factura junto con la mercancía. El importe de {total} se abona en los 14 días siguientes a la recepción, sin descuento por pronto pago.",
        nachnahme:
          "El importe de {total} se cobra en el momento de la entrega. Tenga preparado el importe exacto.",
        provider:
          "El pago mediante {label} todavía no se procesa automáticamente. Le escribiremos en cuanto el proveedor de pago esté activo en la tienda.",
        generic:
          "Estamos revisando su pedido y le escribiremos en cuanto la mercancía esté lista para salir.",
      },
      bankTitle: "Datos bancarios",
      bankHolder: "Titular de la cuenta",
      bankIban: "IBAN",
      bankBic: "BIC",
      bankBank: "Entidad",
      bankTransferType: "Tipo de transferencia",
      bankReference: "Concepto que debe indicar",
      bankDemoNotice:
        "Aviso: estos datos bancarios son un marcador de posición del entorno de pruebas y no corresponden a ninguna cuenta real. Deben sustituirse por los datos verdaderos antes de la puesta en producción.",
      providerNotice:
        "El proveedor de pago de {label} se configura en el back-office, apartado «Integraciones». Hasta entonces, confirmamos manualmente la recepción del pago.",
      withdrawalTitle: "Derecho de desistimiento",
      withdrawalText:
        "Dispone de catorce días naturales, a contar desde que usted o un tercero indicado por usted reciba materialmente el bien, para desistir de este contrato sin necesidad de justificación (artículo 71 del Real Decreto Legislativo 1/2007). El texto completo y el formulario de desistimiento figuran en la página correspondiente.",
      withdrawalLink: "Ver el derecho de desistimiento",
      continueShopping: "Seguir comprando",
      print: "Imprimir el pedido",
      paidText: "Hemos recibido correctamente su pedido y su pago.",
      pendingTitle: "Pedido registrado, pago pendiente de confirmar",
      pendingText:
        "Su pedido está registrado, pero todavía no hemos recibido la confirmación del pago. Lo prepararemos en cuanto se confirme.",
      interruptedTitle: "Pago interrumpido",
      interruptedText:
        "Su pedido está registrado, pero el pago no llegó a completarse: no se le ha cobrado nada. Escríbanos a contacto@remolquecaballos.com indicando su número de pedido para abonarlo.",
      failedTitle: "El pago no se ha completado",
      failedText:
        "Su pedido está registrado, pero el pago fue rechazado y no se le ha cobrado nada. Escríbanos a contacto@remolquecaballos.com indicando su número de pedido para elegir otra forma de pago.",
    },
  },

  account: {
    metaTitle: "Mi cuenta",
    title: "Mi cuenta",
    guestNotice:
      "La cuenta de cliente es opcional. Puede comprar en cualquier momento como invitado, sin crear cuenta.",
    nav: {
      aria: "Área de cliente",
      dashboard: "Resumen",
      orders: "Pedidos",
      addresses: "Direcciones",
      data: "Mis datos",
      logout: "Cerrar sesión",
      loggingOut: "Cerrando sesión…",
    },
    common: {
      save: "Guardar",
      saving: "Guardando…",
      loading: "Cargando…",
      back: "Atrás",
      optional: "opcional",
      shopCta: "Ver la tienda",
    },
    fields: {
      salutation: "Tratamiento",
      salutationNone: "Sin especificar",
      salutationMr: "Sr.",
      salutationMrs: "Sra.",
      salutationDiverse: "Otro",
      firstName: "Nombre",
      lastName: "Apellidos",
      company: "Empresa",
      street: "Calle y número",
      postalCode: "Código postal",
      city: "Localidad",
      country: "País",
      countryFR: "España",
      countryHint: "Elija su país de entrega.",
      email: "Correo electrónico",
      phone: "Teléfono",
      phoneHint: "Solo para cuestiones relacionadas con la entrega.",
      password: "Contraseña",
    },
    errors: {
      invalid_payload: "No hemos podido leer la solicitud.",
      invalid_email: "Indique una dirección de correo válida.",
      invalid_name: "Indique su nombre y sus apellidos.",
      invalid_salutation: "Elija un tratamiento válido.",
      invalid_phone: "Indique un número de teléfono válido.",
      weak_password: "La contraseña debe tener al menos 12 caracteres.",
      password_mismatch: "Las dos contraseñas no coinciden.",
      invalid_credentials: "El correo electrónico o la contraseña no son correctos.",
      account_disabled: "El correo electrónico o la contraseña no son correctos.",
      invalid_street: "Indique la calle y el número.",
      invalid_postal_code: "Indique un código postal válido.",
      invalid_city: "Indique una localidad.",
      unsupported_country: "Indique un país válido.",
      invalid_token: "Este enlace ha caducado o ya se ha usado. Solicite uno nuevo.",
      rate_limited: "Demasiados intentos. Espere un momento antes de volver a intentarlo.",
      not_found: "No encontrado.",
      confirmation_required: "Confirme la eliminación de forma explícita.",
      mail_failed: "No hemos podido enviar el correo. Inténtelo más tarde, por favor.",
      server_error: "Se ha producido un error. Inténtelo más tarde, por favor.",
      network: "Sin conexión con el servidor. Compruebe su conexión a internet.",
    },
    login: {
      metaTitle: "Iniciar sesión",
      title: "Iniciar sesión",
      intro: "Inicie sesión para consultar sus pedidos y gestionar sus direcciones.",
      submit: "Entrar",
      submitting: "Entrando…",
      forgot: "Ha olvidado la contraseña?",
      noAccount: "Todavía no tiene cuenta?",
      registerLink: "Crear una cuenta",
      registered:
        "Si la dirección seguía disponible, su cuenta ya está creada. Entre con su contraseña.",
      passwordChanged: "Su contraseña se ha modificado. Entre con la nueva contraseña.",
    },
    register: {
      metaTitle: "Crear una cuenta",
      title: "Crear una cuenta",
      intro:
        "Con una cuenta consulta sus pedidos cuando quiera y no tiene que volver a escribir su dirección.",
      passwordHint:
        "Doce caracteres como mínimo. Una frase larga y fácil de recordar es más segura que una contraseña corta y complicada.",
      privacyNote:
        "Cómo tratamos sus datos se explica en la <privacy>política de privacidad</privacy>.",
      submit: "Crear la cuenta",
      submitting: "Creando la cuenta…",
      haveAccount: "Ya tiene cuenta?",
      loginLink: "Ir a iniciar sesión",
      doneTitle: "Revise su correo",
      doneText:
        "Si la dirección seguía disponible, su cuenta está creada y le hemos enviado un correo. Después, entre con su contraseña.",
      doneCta: "Ir a iniciar sesión",
    },
    forgot: {
      metaTitle: "Contraseña olvidada",
      title: "Contraseña olvidada",
      intro:
        "Indique su correo electrónico. Si hay una cuenta asociada, le enviaremos un enlace para restablecer la contraseña.",
      submit: "Solicitar el enlace",
      submitting: "Enviando…",
      doneTitle: "Revise su correo",
      doneText:
        "Si hay una cuenta asociada a esa dirección, le hemos enviado un enlace para restablecer la contraseña. El enlace es válido durante 30 minutos y solo puede usarse una vez.",
      devLink: "Modo de desarrollo sin servicio de correo. Enlace para restablecer:",
      backToLogin: "Volver a iniciar sesión",
    },
    reset: {
      metaTitle: "Nueva contraseña",
      title: "Elegir una nueva contraseña",
      intro: "Elija una nueva contraseña para su cuenta de cliente.",
      newPassword: "Nueva contraseña",
      newPasswordConfirm: "Repetir la nueva contraseña",
      submit: "Guardar la contraseña",
      submitting: "Guardando…",
      invalidTitle: "Este enlace ya no es válido",
      invalidText: "Ha caducado o ya se ha usado. Solicite uno nuevo, por favor.",
      requestNew: "Solicitar un enlace nuevo",
      doneTitle: "Contraseña modificada",
      doneText: "Su contraseña se ha modificado. Ya puede entrar con la nueva.",
      toLogin: "Ir a iniciar sesión",
    },
    dashboard: {
      metaTitle: "Resumen",
      greeting: "Hola, {name}",
      intro:
        "Aquí encontrará sus pedidos, sus direcciones y todos los ajustes relativos a sus datos.",
      memberSince: "Cliente desde {date}",
      orderCount:
        "{count, plural, =0 {Todavía ningún pedido} one {# pedido} other {# pedidos}}",
      recentTitle: "Últimos pedidos",
      allOrders: "Ver todos los pedidos",
      emptyOrders: "Todavía no se ha hecho ningún pedido con esta cuenta.",
      tiles: {
        ordersTitle: "Pedidos",
        ordersText: "Consultar el estado, las líneas y los importes de sus pedidos.",
        addressesTitle: "Direcciones",
        addressesText:
          "Guardar la dirección de facturación y de entrega para el próximo pedido.",
        dataTitle: "Mis datos",
        dataText: "Cambiar la contraseña, exportar sus datos o eliminar la cuenta.",
      },
    },
    orders: {
      metaTitle: "Mis pedidos",
      title: "Mis pedidos",
      intro: "Todos los pedidos realizados con esta cuenta.",
      empty: "Todavía no se ha hecho ningún pedido con esta cuenta.",
      number: "Número de pedido",
      date: "Fecha",
      status: "Estado",
      payment: "Pago",
      total: "Total",
      items: "Artículos",
      view: "Ver el detalle",
      guestHint:
        "Los pedidos hechos como invitado, sin cuenta, no aparecen aquí. Para esos, utilice el enlace que figura en su confirmación de pedido.",
      detailMetaTitle: "Pedido {orderNumber}",
      backToList: "Volver a mis pedidos",
      orderedOn: "Pedido el {date}",
    },
    addresses: {
      metaTitle: "Mis direcciones",
      title: "Mis direcciones",
      intro:
        "Estas direcciones rellenan automáticamente el proceso de compra. Los pedidos ya realizados no se modifican.",
      billingTitle: "Dirección de facturación",
      shippingTitle: "Dirección de entrega",
      sameAsBilling: "La dirección de entrega coincide con la de facturación",
      nameHint:
        "El nombre y los apellidos proceden de sus datos personales y se cambian en «Mis datos».",
      emptyHint:
        "No está obligado a rellenar nada aquí. Un campo vacío significa simplemente que no guardamos ese dato.",
      saved: "Sus direcciones se han guardado.",
    },
    data: {
      metaTitle: "Mis datos",
      title: "Mis datos",
      intro:
        "Aquí gestiona sus datos personales, su contraseña y sus derechos en materia de protección de datos.",
      profileTitle: "Datos personales",
      profileIntro: "Los cambios se aplican a sus próximos pedidos.",
      emailFixed:
        "El correo electrónico es también su identificador de acceso. Para cambiarlo, escríbanos desde el formulario de contacto.",
      profileSaved: "Sus datos se han guardado.",
      passwordTitle: "Cambiar la contraseña",
      passwordIntro: "Por seguridad, necesitamos antes su contraseña actual.",
      currentPassword: "Contraseña actual",
      newPassword: "Nueva contraseña",
      newPasswordConfirm: "Repetir la nueva contraseña",
      passwordSubmit: "Cambiar la contraseña",
      passwordSaved: "Su contraseña se ha modificado.",
      exportTitle: "Exportar mis datos",
      exportIntro:
        "Recibirá un archivo JSON con todos los datos guardados de su cuenta, pedidos incluidos. Su contraseña no figura en él: se almacena únicamente como huella no reversible.",
      exportLegal:
        "Derecho de acceso del artículo 15 del RGPD y portabilidad del artículo 20 del RGPD.",
      exportButton: "Descargar mis datos en formato JSON",
      deleteTitle: "Eliminar mi cuenta",
      deleteIntro:
        "Su cuenta, su contraseña y sus direcciones guardadas se eliminarán definitivamente. La acción es irreversible.",
      deleteRetention:
        "Los pedidos ya realizados se conservan: las facturas y los justificantes contables están sujetos a plazos legales de conservación (artículo 30 del Código de Comercio, seis años, y artículo 66 de la Ley 58/2003 General Tributaria, cuatro años). El artículo 17.3.b del RGPD contempla expresamente este caso. Sus pedidos quedan entonces desvinculados de su cuenta y se retiran de ellos sus datos de contacto.",
      deletePasswordLabel: "Para confirmar: su contraseña",
      deleteConfirmLabel: "Escriba {word} para confirmar la eliminación",
      deleteButton: "Eliminar la cuenta definitivamente",
      deleteSubmitting: "Eliminando la cuenta…",
      deleteDoneTitle: "Su cuenta se ha eliminado",
      deleteDoneText: "Hemos eliminado su cuenta de cliente. Gracias por su confianza.",
      deleteDoneCta: "Volver al inicio",
    },
  },
};

// ---------------------------------------------------------------------------
// Anglais — déjà en anglais ; seuls changent les renvois propres à l'Espagne
// ---------------------------------------------------------------------------

const EN = {
  recherche: {
    metaTitle: "Results for “{query}” | Remolque Caballos",
    vide: "Type something to search: a make, a number of stalls or a reference.",
  },

  recentlyViewed: {
    intro:
      "The models you looked at during this visit. The list does not survive closing the tab.",
    count: "{count, plural, one {# model viewed} other {# models viewed}}",
    emptyText: "Open a model's page and it will appear here.",
  },

  exitIntent: {
    subtitle:
      "{count, plural, one {You looked at this model during your visit. It is still waiting for you.} other {You looked at # models during your visit. They are still waiting for you.}}",
    cta: "See them again",
  },

  checkout: {
    countryFR: "Spain",
    deliveryCountry: "Delivery across mainland Spain. Balearics and Canaries quoted separately.",
    deliveryTime: "Preparation starts once payment is confirmed.",
    notePlaceholder:
      "e.g. preferred delivery date, or how a lorry can reach the property.",
    phoneHint: "Needed to agree the delivery date and time slot.",
    shippingMethods: {
      standard: { label: "Standard delivery", delay: "Delivered in 5 to 10 working days" },
      express: { label: "Priority delivery", delay: "Delivered in 48 to 72 hours" },
    },
    withdrawalLabel:
      "I have read the <withdrawal>information on the right of withdrawal</withdrawal> and understand that I have 14 calendar days to withdraw from this contract without giving a reason.",
    errors: {
      invalid_postal_code: "Enter a valid postal code (five digits).",
    },
    confirmation: {
      withdrawalText:
        "You have fourteen calendar days from the day you, or a third party you name, take physical possession of the goods to withdraw from this contract without giving a reason (article 71 of Royal Legislative Decree 1/2007). The full text and the model withdrawal form are on the dedicated page.",
      interruptedText:
        "Your order has been placed, but the payment was not completed and nothing has been charged. Contact us at contacto@remolquecaballos.com with your order number to settle it.",
      failedText:
        "Your order has been placed, but the payment was declined and nothing has been charged. Contact us at contacto@remolquecaballos.com with your order number to choose another payment method.",
    },
  },

  account: {
    fields: {
      countryFR: "Spain",
    },
    data: {
      deleteRetention:
        "Orders already placed are kept: invoices and accounting records are subject to statutory retention periods (article 30 of the Spanish Commercial Code, six years, and article 66 of Act 58/2003, the General Tax Act, four years). Article 17(3)(b) of the GDPR expressly covers this case. Your orders are then detached from your account and your contact details removed from them.",
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
  const resultado = fusionar(mensajes, patch);
  await writeFile(ruta, `${JSON.stringify(resultado, null, 2)}\n`, "utf-8");
  console.log(`${archivo} : ${Object.keys(patch).length} espacios de nombres retocados`);
}

await aplicar("es.json", ES);
await aplicar("en.json", EN);
