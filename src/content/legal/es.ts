/**
 * Contenu légal et informatif en ESPAGNOL — Equinomad.
 *
 * ATTENTION : les données d'entreprise sont des PLACEHOLDERS (CIF, Registro
 * Mercantil, capital, adresse, téléphone, assureur). Voir docs/LEGAL.md pour la
 * liste exhaustive des éléments à remplacer avant mise en ligne.
 *
 * Droit retenu : droit espagnol applicable à la vente à distance à un
 * consommateur.
 *   - Ley 34/2002 (LSSI-CE), art. 10 : mentions obligatoires du site
 *   - Real Decreto Legislativo 1/2007 (TRLGDCU) : information précontractuelle
 *     (art. 60 et 97), desistimiento de 14 jours (art. 71 à 79), garantie
 *     légale de conformité (art. 114 à 127, dans leur rédaction issue de la
 *     Ley 4/2022 : trois ans)
 *   - Reglamento (UE) 2016/679 (RGPD) et Ley Orgánica 3/2018 (LOPDGDD)
 *   - Ley 37/1992 (IVA), art. 90 : taux général de 21 %
 *
 * Ce corpus est un MODÈLE. Il doit être relu par un juriste espagnol avant
 * publication.
 */

import type { LegalPageMap } from "./types";
import { BRAND } from "@/config/brand";
import { COMPANY } from "@/config/company";

/** Date de dernière révision rédactionnelle du corpus espagnol. */
const UPDATED_AT = "2026-08-09";

/** Adresse de retour (identique au siège dans ce modèle). */
const RETURN_ADDRESS = `${COMPANY.name}, departamento de devoluciones, ${COMPANY.street}, ${COMPANY.city}, ${COMPANY.country}`;

/** Avertissement placé en tête de chaque page juridique. */
const DISCLAIMER =
  `Aviso: este texto es un modelo redactado para la tienda en línea ${BRAND.name}. Antes de publicarlo deben completarse el CIF, los datos del Registro Mercantil, el capital social, el nombre del administrador, el teléfono y la aseguradora, y el conjunto debe ser revisado por un abogado. Solo con esa revisión es utilizable tal cual.`;

/** Assemble le chapeau : avertissement puis texte d'introduction. */
function intro(lead: string): string {
  return `${DISCLAIMER}\n\n${lead}`;
}

export const esLegalPages: LegalPageMap = {
  "mentions-legales": {
    slug: "mentions-legales",
    title: "Aviso legal",
    intro: intro(
      "Información exigida por el artículo 10 de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE).",
    ),
    sections: [
      {
        heading: "Titular del sitio web",
        body: "El presente sitio web es titularidad de:",
        list: [
          `${COMPANY.name} — ${COMPANY.legalForm}`,
          `Capital social: ${COMPANY.capital}`,
          `Domicilio social: ${COMPANY.street}, ${COMPANY.city}, ${COMPANY.country}`,
          `CIF: ${COMPANY.siren}`,
          `NIF-IVA intracomunitario: ${COMPANY.vatId}`,
          COMPANY.register,
        ],
      },
      {
        heading: "Representación",
        body: `Administrador único y responsable de los contenidos: ${COMPANY.managingDirector}.`,
      },
      {
        heading: "Contacto",
        body: "Puede dirigirse a nosotros por cualquiera de estas vías, y le responderemos en un plazo máximo de dos días laborables:",
        list: [
          `WhatsApp: ${COMPANY.phone} (de lunes a viernes de 9 a 18 h, sábados de 9 a 13 h). Esta línea no atiende llamadas de voz.`,
          `Correo electrónico: ${COMPANY.email}`,
          `Sitio web: ${COMPANY.domain}`,
        ],
      },
      {
        heading: "Actividad y autorizaciones",
        body: "La actividad de la sociedad es la venta, la matriculación y la entrega de remolques para el transporte de animales vivos, así como sus accesorios y recambios.\n\nTodos los vehículos comercializados cuentan con homologación europea de tipo. La tramitación de la matriculación ante la Dirección General de Tráfico se realiza por cuenta del comprador y está incluida en el precio anunciado.",
      },
      {
        heading: "Alojamiento",
        body: `El sitio está alojado por ${COMPANY.host}.`,
      },
      {
        heading: "Propiedad intelectual",
        body: "Los textos, las ilustraciones técnicas, la identidad gráfica y la estructura de este sitio son obra de la sociedad y están protegidos por el Real Decreto Legislativo 1/1996, de Propiedad Intelectual.\n\nLas marcas de los fabricantes citados (Cheval Liberté, Böckmann, Ifor Williams, Humbaur, Fautras, Barbieri, Sirius) pertenecen a sus respectivos titulares y se emplean únicamente para identificar los productos que comercializamos.",
      },
      {
        heading: "Responsabilidad",
        body: "Ponemos el mayor cuidado en la exactitud de las fichas técnicas, que proceden de la documentación de los fabricantes. Las cotas, las masas y los volúmenes pueden variar ligeramente según la versión y el equipamiento.\n\nAntes de comprar, la masa máxima autorizada del remolque y la masa remolcable de su vehículo tractor deben comprobarse sobre la ficha técnica de este último. Realizamos esa comprobación con usted por teléfono, sin coste.",
      },
      {
        heading: "Resolución de litigios",
        body: "Con carácter previo a cualquier reclamación, le rogamos que se ponga en contacto con nosotros: la mayoría de los desacuerdos se resuelven en una llamada.\n\nDe no llegarse a un acuerdo, puede acudir a la Junta Arbitral de Consumo de su comunidad autónoma, o a la plataforma europea de resolución de litigios en línea prevista en el Reglamento (UE) 524/2013, accesible en https://ec.europa.eu/consumers/odr.",
      },
    ],
    updatedAt: UPDATED_AT,
  },

  cgv: {
    slug: "cgv",
    title: "Condiciones generales de venta",
    intro: intro(
      `Estas condiciones rigen las ventas realizadas a distancia a consumidores a través de ${COMPANY.domain}, conforme al Real Decreto Legislativo 1/2007 (TRLGDCU).`,
    ),
    sections: [
      {
        heading: "1. Objeto y ámbito",
        body: `Las presentes condiciones regulan la venta de remolques para caballos, vans y accesorios entre ${COMPANY.name} y el comprador consumidor.\n\nAl marcar la casilla correspondiente antes de confirmar el pedido, el comprador declara haberlas leído y aceptado. Son las condiciones vigentes en la fecha del pedido las que se aplican a ese pedido.`,
      },
      {
        heading: "2. Productos",
        body: "Las fichas de producto describen las características esenciales de cada modelo: número de plazas, masa máxima autorizada, carga útil, material de la caja, tipo de suspensión y de freno.\n\nLas ilustraciones son vistas de perfil dibujadas a escala, destinadas a permitir la comparación entre modelos. No son fotografías del vehículo concreto que se entregará y no sustituyen a la ficha técnica del fabricante, que se entrega con el vehículo.",
      },
      {
        heading: "3. Precios",
        body: "Los precios se indican en euros e incluyen el IVA al tipo general del 21 % (artículo 90 de la Ley 37/1992).\n\nEl precio anunciado comprende el vehículo, la tramitación de la matriculación, el impuesto de matriculación cuando proceda y la primera inspección técnica. No comprende los gastos de entrega, que se calculan y se muestran antes de la confirmación del pedido.\n\nNos reservamos el derecho de modificar los precios en cualquier momento; el precio aplicable es el que figura en el momento de la confirmación del pedido.",
      },
      {
        heading: "4. Formación del contrato",
        body: "El pedido se realiza en tres pasos: datos de contacto y direcciones, elección de la forma de pago, y revisión final. En el último paso, antes de confirmar, se muestran el detalle de los artículos, el importe total y las condiciones aplicables.\n\nEl contrato queda perfeccionado cuando le enviamos la confirmación del pedido por correo electrónico. Esa confirmación constituye el soporte duradero exigido por el artículo 98.7 del TRLGDCU.\n\nAntes de aceptar el pedido comprobamos con usted, por teléfono, que su permiso de conducir y la masa remolcable de su vehículo permiten arrastrar el modelo elegido. Si no fuera el caso, el pedido se anula y se reembolsa íntegramente.",
      },
      {
        heading: "5. Pago",
        body: "Se aceptan las siguientes formas de pago: tarjeta bancaria con verificación 3-D Secure, Bizum, transferencia bancaria, PayPal y financiación a 12, 24 o 36 meses sujeta a la aprobación de la entidad financiera.\n\nPara importes superiores a 3.000 € recomendamos la transferencia: muchas entidades españolas limitan el importe de las operaciones con tarjeta.\n\nEn caso de transferencia, el vehículo se reserva a su nombre y la preparación comienza al recibirse el importe. Ninguna forma de pago lleva recargo.",
      },
      {
        heading: "6. Entrega",
        body: "Entregamos en toda la Península mediante transporte especializado, en fecha y franja horaria acordadas por teléfono. Baleares y Canarias se presupuestan aparte, antes del pedido.\n\nEl plazo de entrega estándar es de 5 a 10 días laborables desde que el vehículo está matriculado, que a su vez requiere de 10 a 15 días. La entrega prioritaria, en 48 a 72 horas desde la matriculación, se factura a 180 €.\n\nConforme al artículo 66 bis del TRLGDCU, si no entregamos en el plazo acordado y, tras un requerimiento por su parte con un plazo adicional razonable, seguimos sin hacerlo, usted puede resolver el contrato y obtener el reembolso íntegro.",
      },
      {
        heading: "7. Transmisión del riesgo y comprobación",
        body: "El riesgo de pérdida o deterioro se transmite al comprador en el momento de la entrega material del vehículo (artículo 66 ter del TRLGDCU).\n\nEn la entrega revisamos con usted el enganche con su vehículo, la altura del cabezal y el funcionamiento del freno de inercia. Le rogamos que examine el vehículo en ese momento y haga constar cualquier daño de transporte en el albarán antes de firmarlo.",
      },
      {
        heading: "8. Derecho de desistimiento",
        body: "Dispone de catorce días naturales para desistir del contrato sin necesidad de justificación. Las condiciones, los plazos y el formulario figuran en la página «Derecho de desistimiento», que forma parte de estas condiciones.",
      },
      {
        heading: "9. Garantía legal",
        body: "Todos los vehículos y accesorios están cubiertos por la garantía legal de conformidad prevista en los artículos 114 y siguientes del TRLGDCU: tres años desde la entrega para los bienes, en su redacción dada por la Ley 4/2022.\n\nDurante los dos primeros años se presume que la falta de conformidad ya existía en el momento de la entrega, sin que usted tenga que probarlo. La acción para reclamar prescribe a los cinco años desde que se manifiesta la falta de conformidad.\n\nNo aplicamos exclusiones sobre el chasis, el eje ni el sistema de freno bajo el concepto de «desgaste normal». Las unidades de ocasión se venden con garantía de dos años en idénticas condiciones.",
      },
      {
        heading: "10. Reserva de dominio",
        body: "Los bienes entregados siguen siendo propiedad de la sociedad hasta el cobro íntegro de su precio. Esta reserva no afecta a la transmisión del riesgo, que se produce en la entrega.",
      },
      {
        heading: "11. Ley aplicable y jurisdicción",
        body: "Estas condiciones se rigen por el Derecho español. Las disposiciones imperativas de protección de los consumidores del país de residencia habitual del comprador siguen siendo aplicables cuando le resulten más favorables.\n\nEn caso de litigio, y salvo norma imperativa en contrario, serán competentes los juzgados y tribunales del domicilio del consumidor.",
      },
    ],
    updatedAt: UPDATED_AT,
  },

  confidentialite: {
    slug: "confidentialite",
    title: "Política de privacidad",
    intro: intro(
      "Información sobre el tratamiento de sus datos personales, conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD).",
    ),
    sections: [
      {
        heading: "Responsable del tratamiento",
        body: `${COMPANY.name}, ${COMPANY.street}, ${COMPANY.city}, ${COMPANY.country}. CIF ${COMPANY.siren}. Correo de contacto en materia de datos: ${COMPANY.email}.\n\nDado el tamaño y la naturaleza de la actividad, no resulta obligatorio designar un delegado de protección de datos. Esa dirección de correo es el punto de contacto único.`,
      },
      {
        heading: "Datos que tratamos y para qué",
        body: "Solo tratamos los datos necesarios para la finalidad perseguida:",
        list: [
          "Compra: nombre, apellidos, direcciones de facturación y entrega, correo electrónico, teléfono. Base jurídica: ejecución del contrato (art. 6.1.b del RGPD).",
          "Facturación y contabilidad: los mismos datos, más el detalle del pedido. Base jurídica: obligación legal (art. 6.1.c).",
          "Cuenta de cliente: correo electrónico, contraseña cifrada, direcciones guardadas. Base jurídica: ejecución del contrato.",
          "Comunicaciones comerciales: correo electrónico. Base jurídica: consentimiento (art. 6.1.a), revocable en cualquier momento.",
          "Opiniones sobre productos: nombre mostrado, localidad, texto. Base jurídica: consentimiento.",
        ],
      },
      {
        heading: "Plazos de conservación",
        body: "Los datos de la cuenta se conservan mientras la cuenta exista, y se eliminan cuando usted la suprime.\n\nLas facturas y los justificantes contables se conservan seis años (artículo 30 del Código de Comercio) y cuatro años a efectos fiscales (artículo 66 de la Ley 58/2003, General Tributaria). El artículo 17.3.b del RGPD contempla expresamente esta conservación obligatoria.\n\nLas direcciones de correo utilizadas para envíos comerciales se eliminan al darse de baja.",
      },
      {
        heading: "Destinatarios",
        body: "Sus datos se comunican únicamente a quienes intervienen en la ejecución del contrato: la empresa de transporte especializado que realiza la entrega, la gestoría que tramita la matriculación ante la Dirección General de Tráfico, el proveedor de pago que corresponda y nuestro asesor contable.\n\nNo vendemos ni cedemos datos con fines publicitarios.",
      },
      {
        heading: "Transferencias internacionales",
        body: "Los servidores que alojan el sitio se encuentran en la Unión Europea. Cuando un proveedor de pago o un servicio de mensajería trate datos fuera del Espacio Económico Europeo, la transferencia se ampara en las cláusulas contractuales tipo aprobadas por la Comisión Europea.",
      },
      {
        heading: "Cookies",
        body: "El sitio deposita únicamente cookies estrictamente necesarias para su funcionamiento: la sesión de la cesta, la sesión de la cuenta de cliente y la preferencia de idioma.\n\nEl artículo 22.2 de la LSSI-CE exime a estas cookies del consentimiento previo, motivo por el cual no encontrará un banner. Si en el futuro se añadieran cookies de medición o publicitarias, se solicitará su consentimiento antes de depositarlas.",
      },
      {
        heading: "Sus derechos",
        body: `Puede ejercer los derechos de acceso, rectificación, supresión, limitación, portabilidad y oposición previstos en los artículos 15 a 22 del RGPD.\n\nDesde su cuenta de cliente puede descargar directamente todos sus datos en formato JSON y suprimir la cuenta. También puede escribir a ${COMPANY.email} o dirigirse por correo postal al domicilio social indicando «Protección de datos». Responderemos en el plazo de un mes.`,
      },
      {
        heading: "Reclamación ante la autoridad de control",
        body: "Si considera que el tratamiento de sus datos infringe la normativa, puede presentar una reclamación ante la Agencia Española de Protección de Datos — C/ Jorge Juan, 6, 28001 Madrid, www.aepd.es.",
      },
      {
        heading: "Seguridad",
        body: "El sitio se sirve íntegramente sobre HTTPS. Las contraseñas se almacenan como huellas no reversibles, nunca en claro. Los datos bancarios no transitan por nuestros servidores: los recoge directamente el proveedor de pago.",
      },
    ],
    updatedAt: UPDATED_AT,
  },

  retractation: {
    slug: "retractation",
    title: "Derecho de desistimiento",
    intro: intro(
      "Información previa exigida por los artículos 97 y 71 y siguientes del Real Decreto Legislativo 1/2007 (TRLGDCU).",
    ),
    sections: [
      {
        heading: "Derecho de desistimiento",
        body: "Tiene derecho a desistir del presente contrato en un plazo de catorce días naturales sin necesidad de justificación.\n\nEl plazo expira a los catorce días naturales del día en que usted, o un tercero indicado por usted distinto del transportista, adquirió la posesión material de los bienes. Cuando el pedido comprenda varios bienes entregados por separado, el plazo se cuenta desde la recepción del último.",
      },
      {
        heading: "Cómo ejercerlo",
        body: `Para ejercer el derecho de desistimiento basta con que nos comunique su decisión antes de que venza el plazo, mediante una declaración inequívoca: correo electrónico a ${COMPANY.email}, carta al domicilio social o mensaje de WhatsApp al ${COMPANY.phone}.\n\nPuede utilizar el formulario que figura más abajo, aunque no es obligatorio.`,
      },
      {
        heading: "Consecuencias del desistimiento",
        body: "Le reembolsaremos todos los pagos recibidos, incluidos los gastos de entrega estándar, sin demora indebida y, en todo caso, en un plazo máximo de catorce días naturales desde que nos comunique su decisión.\n\nSi hubiera elegido una modalidad de entrega distinta de la estándar, no procede el reembolso del sobrecoste correspondiente.\n\nEl reembolso se efectúa por el mismo medio de pago empleado en la transacción inicial, salvo que usted disponga otra cosa. No le supondrá gasto alguno.\n\nPodemos retener el reembolso hasta haber recibido los bienes, o hasta que usted acredite su devolución.",
      },
      {
        heading: "Devolución de los bienes",
        body: `Deberá devolver los bienes sin demora indebida y, en todo caso, en el plazo máximo de catorce días naturales desde que nos comunique su decisión.\n\nDirección de devolución: ${RETURN_ADDRESS}.\n\nUn remolque no puede devolverse por mensajería: organizamos nosotros el transporte de retorno y le comunicamos su coste antes de encargarlo. Conforme al artículo 108.1 del TRLGDCU, los costes directos de devolución corren por su cuenta.`,
      },
      {
        heading: "Disminución de valor",
        body: "Usted solo responde de la disminución de valor de los bienes resultante de una manipulación distinta de la necesaria para establecer su naturaleza, sus características y su funcionamiento.\n\nEn términos concretos: enganchar el remolque, examinarlo y probarlo en vacío no genera responsabilidad alguna. Haber transportado animales, haber rayado el suelo o haber retirado las etiquetas de homologación sí puede dar lugar a una minoración proporcional.",
      },
      {
        heading: "Excepciones",
        body: "El derecho de desistimiento no se aplica a los bienes confeccionados conforme a especificaciones del consumidor o claramente personalizados (artículo 103.c del TRLGDCU): rotulación a medida, separadores fabricados a la medida de un animal concreto o pintura en un color no incluido en el catálogo.\n\nCuando un pedido incluya una prestación de este tipo, se le advierte expresamente antes de la confirmación.",
      },
      {
        heading: "Formulario de desistimiento",
        body: `Cumplimente y envíe este formulario únicamente si desea desistir del contrato.\n\nA la atención de ${COMPANY.name}, ${COMPANY.street}, ${COMPANY.city}, ${COMPANY.country} — ${COMPANY.email}:\n\nPor la presente le comunico que desisto de mi contrato de venta del siguiente bien: ______________________\n\nPedido el: ______________  Recibido el: ______________\n\nNombre del consumidor: ______________________\n\nDomicilio del consumidor: ______________________\n\nFirma del consumidor (solo si el formulario se presenta en papel): ______________________\n\nFecha: ______________`,
      },
    ],
    updatedAt: UPDATED_AT,
  },

  livraison: {
    slug: "livraison",
    title: "Envíos y entregas",
    sections: [
      {
        heading: "Zona de entrega",
        body: "Entregamos en toda la Península. Baleares y Canarias se atienden previo presupuesto de transporte marítimo, que le facilitamos cerrado antes de que confirme el pedido.\n\nPara entregas fuera de España, escríbanos: trabajamos habitualmente con Portugal y con el sur de Francia.",
      },
      {
        heading: "Plazos",
        body: "Un remolque nuevo pasa por dos fases antes de llegar a su casa. Primero la matriculación, que ocupa de 10 a 15 días: presentación de la documentación, primera inspección técnica y colocación de la placa. Después el transporte.",
        list: [
          "Entrega estándar — incluida en el precio, de 5 a 10 días laborables tras la matriculación",
          "Entrega prioritaria — 180 €, de 48 a 72 horas tras la matriculación",
          "Accesorios y recambios en stock — 48 horas, sin pasar por matriculación",
        ],
      },
      {
        heading: "Cómo viaja",
        body: "Los remolques viajan sobre camión portavehículos, nunca remolcados por carretera hasta su domicilio. Es más caro y es la única forma de que el vehículo llegue con cero kilómetros reales.\n\nLos accesorios se envían por mensajería estándar.",
      },
      {
        heading: "Cita previa",
        body: "Le llamamos para acordar el día y la franja horaria. Es imprescindible: un camión portavehículos necesita espacio para maniobrar y no puede dejarse la mercancía sin firma.\n\nIndíquenos en las observaciones del pedido si el acceso es estrecho, si hay un portón bajo o si se trata de una finca sin salida. Adaptamos el vehículo de transporte.",
      },
      {
        heading: "En el momento de la entrega",
        body: "Revisamos con usted el enganche sobre su vehículo, ajustamos la altura del cabezal y le explicamos el funcionamiento del freno de inercia. Media hora bien empleada.\n\nExamine el vehículo antes de firmar el albarán y haga constar en él cualquier daño de transporte. Es lo que permite reclamar después al transportista.",
      },
      {
        heading: "Retirada en nuestras instalaciones",
        body: `También puede recoger el vehículo usted mismo en ${COMPANY.city}, previa cita. En ese caso no se aplican gastos de entrega. Traiga el permiso de circulación de su vehículo tractor: comprobamos el conjunto antes de que salga.`,
      },
    ],
    updatedAt: UPDATED_AT,
  },

  "moyens-de-paiement": {
    slug: "moyens-de-paiement",
    title: "Formas de pago",
    sections: [
      {
        heading: "Formas aceptadas",
        body: "Ninguna forma de pago lleva recargo. El precio que ve es el que paga.",
        list: [
          "Tarjeta bancaria — Visa, Mastercard y American Express, con verificación 3-D Secure",
          "Bizum — pago inmediato desde el móvil, hasta el límite que fije su banco",
          "Transferencia bancaria — recomendada a partir de 3.000 €",
          "PayPal — con cuenta o como invitado",
          "Financiación — 12, 24 o 36 meses, sujeta a aprobación de la entidad financiera",
        ],
      },
      {
        heading: "Por qué recomendamos la transferencia en importes altos",
        body: "La mayoría de las entidades españolas limita el importe de las operaciones con tarjeta, a menudo entre 1.000 y 3.000 € diarios, y el límite no siempre es visible hasta que la operación se rechaza.\n\nPor encima de esa cifra la transferencia es más rápida en la práctica, aunque parezca lo contrario. Puede pedir a su banco una elevación puntual del límite si prefiere pagar con tarjeta.",
      },
      {
        heading: "Seguridad",
        body: "Los datos de su tarjeta no transitan por nuestros servidores ni se almacenan en ellos: los recoge directamente el proveedor de pago, sobre su propia infraestructura certificada PCI-DSS.\n\nTodo el sitio se sirve sobre HTTPS con cifrado TLS.",
      },
      {
        heading: "Pago por transferencia",
        body: "Al elegir esta forma de pago, la página de confirmación y el correo de confirmación muestran nuestros datos bancarios y el concepto que debe indicar: su número de pedido.\n\nEl vehículo queda reservado a su nombre desde la confirmación del pedido. La preparación comienza al recibirse el importe, normalmente en un día laborable.",
      },
      {
        heading: "Financiación",
        body: "Estudiamos su solicitud sin compromiso y le damos una respuesta orientativa el mismo día. La aprobación definitiva corresponde a la entidad financiera, no a nosotros.\n\nLa TAE depende del plazo elegido y del importe. Se le comunica por escrito antes de que firme nada.",
      },
      {
        heading: "Factura",
        body: "La factura se emite a nombre del titular indicado en la dirección de facturación y se envía en PDF junto con la confirmación del pedido.\n\nSi compra como empresa, indique la razón social y el CIF en el campo «Empresa» del formulario: la factura se emite entonces con esos datos, lo que le permite deducir el IVA.",
      },
    ],
    updatedAt: UPDATED_AT,
  },

  retours: {
    slug: "retours",
    title: "Devoluciones y reclamaciones",
    sections: [
      {
        heading: "Dos vías distintas",
        body: "Conviene no confundirlas. El desistimiento es un derecho incondicional durante catorce días: no hace falta motivo. La garantía cubre los defectos del producto durante tres años, y no tiene plazo de reflexión.\n\nSi lo que quiere es devolver un vehículo que simplemente no le convence, consulte la página «Derecho de desistimiento».",
      },
      {
        heading: "Garantía legal de conformidad",
        body: "Los bienes están cubiertos durante tres años desde la entrega por la garantía legal de conformidad de los artículos 114 y siguientes del TRLGDCU, en su redacción dada por la Ley 4/2022.\n\nDurante los dos primeros años se presume que la falta de conformidad ya existía en el momento de la entrega, sin que usted deba probarlo. Después, la prueba le corresponde, aunque en la práctica un defecto de fabricación en un chasis o un eje es reconocible por sí mismo.\n\nLa acción prescribe a los cinco años desde que la falta de conformidad se manifiesta.",
      },
      {
        heading: "Lo que cubrimos sin discusión",
        body: "El chasis, el eje, la suspensión y el sistema de freno están cubiertos por la garantía sin la letra pequeña que suele excluirlos como «desgaste normal».\n\nQuedan fuera, lógicamente, los consumibles: neumáticos, bombillas, pastillas de freno y gomas de suspensión sometidas a un uso intensivo, así como los daños derivados de un accidente, de una sobrecarga o de una falta de mantenimiento.",
      },
      {
        heading: "Unidades de ocasión",
        body: "Los seminuevos se venden con dos años de garantía en idénticas condiciones. Es más de lo que exige la norma para bienes de segunda mano, donde el plazo puede reducirse hasta un año por acuerdo entre las partes. No lo reducimos.",
      },
      {
        heading: "Cómo reclamar",
        body: `Escríbanos por WhatsApp al ${COMPANY.phone} o por correo a ${COMPANY.email} indicando el número de pedido, el número de bastidor y una descripción del problema. Unas fotografías ayudan mucho.\n\nLe respondemos en dos días laborables como máximo con una solución: reparación en nuestro taller, sustitución de la pieza o recogida del vehículo, según el caso. La elección entre reparación y sustitución le corresponde a usted, salvo que la opción elegida resulte objetivamente desproporcionada.`,
      },
      {
        heading: "Reparación",
        body: `Disponemos de taller propio en ${COMPANY.city}. Cuando la reparación en garantía requiere inmovilizar el vehículo, organizamos y asumimos el transporte de ida y vuelta.\n\nDurante la reparación, el plazo de garantía queda suspendido y se reanuda a la entrega del vehículo reparado.`,
      },
      {
        heading: "Si no llegamos a un acuerdo",
        body: "Puede acudir a la Junta Arbitral de Consumo de su comunidad autónoma o a la plataforma europea de resolución de litigios en línea: https://ec.europa.eu/consumers/odr.\n\nPreferimos, con diferencia, resolverlo por teléfono.",
      },
    ],
    updatedAt: UPDATED_AT,
  },

  faq: {
    slug: "faq",
    title: "Preguntas frecuentes",
    sections: [
      {
        heading: "Qué permiso necesito?",
        body: "Depende de la suma de la masa máxima autorizada de su coche y la del remolque. Hasta 3.500 kg le vale el permiso B. Hasta 4.250 kg necesita el B96, que se obtiene con siete horas de formación y sin examen teórico. Por encima, o con cualquier remolque de tres o cuatro plazas, hace falta el B+E, con examen práctico.\n\nAdemás del permiso, su vehículo tractor tiene declarada una masa máxima remolcable en la ficha técnica. Ese número manda: aunque el permiso le habilite, no puede superar lo que autoriza el fabricante.",
      },
      {
        heading: "Tengo que ocuparme yo de la matriculación?",
        body: "No. Presentamos la documentación ante Tráfico, pasamos la primera inspección técnica y colocamos la placa antes de entregarle el vehículo. El impuesto de matriculación, cuando procede, está incluido en el precio anunciado. Usted solo firma el contrato de compraventa.",
      },
      {
        heading: "Cada cuánto hay que pasar la ITV?",
        body: "Los remolques de más de 750 kg de masa máxima autorizada pasan la primera inspección a los dos años de la matriculación, después cada dos años hasta los diez, y anualmente a partir de ahí.\n\nLa primera se la entregamos pasada. Si activa el aviso en su cuenta de cliente, le recordamos las siguientes.",
      },
      {
        heading: "Qué carga útil necesito realmente?",
        body: "Dos caballos de silla de 550 kg suman 1.100 kg, a lo que hay que añadir sillas, mantas, cubos y agua. Como suelo razonable, busque 1.300 kg de carga útil para dos plazas.\n\nPor debajo, el remolque se homologa igual, pero usted viaja al límite en cada salida. Y el límite se paga en la báscula.",
      },
      {
        heading: "Poliéster o aluminio?",
        body: "El poliéster aísla mejor del calor y encaja los golpes sin abollarse, pero pesa más. El aluminio resta entre 80 y 150 kg, que pasan íntegros a la carga útil, y a cambio transmite más temperatura salvo que sea panel sándwich con núcleo aislante.\n\nLa diferencia de peso solo importa si su vehículo tractor va justo de masa remolcable. Con 400 kg de margen, el aluminio le está cobrando una ventaja que no va a usar.",
      },
      {
        heading: "Puedo verlo antes de comprar?",
        body: `Sí. Recibimos con cita previa en ${COMPANY.city}. Escríbanos por WhatsApp al ${COMPANY.phone} y le decimos qué modelos hay físicamente en el almacén ese día: no siempre está toda la gama.`,
      },
      {
        heading: "Aceptan mi remolque como parte del pago?",
        body: "Sí, en la mayoría de los casos. Envíenos fotografías, el permiso de circulación y el número de bastidor, y le damos una tasación orientativa en 48 horas. La tasación definitiva se hace al ver el vehículo.",
      },
      {
        heading: "Venden a profesionales y a clubes?",
        body: "Sí. Indique la razón social y el CIF en el campo «Empresa» del formulario de pedido: la factura se emite con esos datos y el IVA le resulta deducible.\n\nPara flotas a partir de tres unidades trabajamos con condiciones específicas. Escríbanos.",
      },
    ],
    updatedAt: UPDATED_AT,
  },

  "a-propos": {
    slug: "a-propos",
    title: "Quiénes somos",
    sections: [
      {
        heading: "Lo que hacemos",
        body: `${COMPANY.name} vende remolques y vans para caballos en toda España, y se ocupa de todo lo que hay entre la compra y la primera salida: homologación, matriculación, primera inspección técnica y entrega concertada.\n\nTrabajamos con las marcas que resisten de verdad en el mercado español: Cheval Liberté, Böckmann, Ifor Williams, Humbaur, Fautras, Barbieri y Sirius.`,
      },
      {
        heading: "Por qué el papeleo va incluido",
        body: "Porque es la parte que hace desistir a la gente. Comprar un remolque no es difícil; llevarlo a Tráfico, pasar la primera inspección y conseguir la placa sí lo es cuando se hace una vez en la vida.\n\nNosotros lo hacemos cada semana. Sale más barato que su tiempo, y por eso está en el precio en lugar de estar en una línea aparte.",
      },
      {
        heading: "Por qué comprobamos su permiso antes de cobrar",
        body: "Vender un remolque que el cliente no puede arrastrar legalmente no le sirve a nadie. Antes de aceptar un pedido comprobamos por teléfono la masa remolcable de su vehículo y su permiso de conducir.\n\nSi el conjunto no cuadra, se lo decimos y buscamos otro modelo. Nos cuesta algunos pedidos y nos ahorra todas las devoluciones.",
      },
      {
        heading: "Taller propio",
        body: `Reparamos lo que vendemos, en ${COMPANY.city}. Mantenemos en almacén las piezas que se rompen de verdad —pilotos, ruedas, gomas de suspensión, cinchas— y no el catálogo completo del fabricante, que tarda semanas en llegar.\n\nUn remolque parado por una pieza de treinta euros cuesta una competición.`,
      },
      {
        heading: "Las ilustraciones del catálogo",
        body: "Verá dibujos y no fotografías. Es deliberado.\n\nUn catálogo montado con fotos de procedencias distintas mezcla fondos, ángulos y luces, y se lee como un mercadillo. Una vista de perfil con el mismo encuadre para todos los modelos permite compararlos de un vistazo, que es exactamente lo que se le pide a un catálogo técnico. Las fotografías del vehículo concreto se las enviamos por WhatsApp cuando lo pida.",
      },
    ],
    updatedAt: UPDATED_AT,
  },

  contact: {
    slug: "contact",
    title: "Contacto",
    sections: [
      {
        heading: "Por WhatsApp",
        body: `${COMPANY.phone} — solo WhatsApp, esta línea no atiende llamadas de voz.

De lunes a viernes de 9 a 18 h y los sábados de 9 a 13 h. Quien contesta ha entregado remolques y puede responderle sobre masas, permisos y plazos sin pasar la consulta a nadie. Por escrito queda además constancia de lo acordado, cosa que una llamada no deja.`,
      },
      {
        heading: "Por correo electrónico",
        body: `${COMPANY.email}\n\nRespondemos en un plazo máximo de dos días laborables, normalmente el mismo día. Si escribe por una avería, incluya el número de pedido, el número de bastidor y unas fotografías: acorta el intercambio a la mitad.`,
      },
      {
        heading: "En nuestras instalaciones",
        body: `${COMPANY.name}\n${COMPANY.street}\n${COMPANY.city}\n${COMPANY.country}\n\nRecibimos con cita previa. Llame antes: no siempre está toda la gama físicamente en el almacén, y preferimos que el viaje le sirva de algo.`,
      },
      {
        heading: "Antes de llamar, si es por una compra",
        body: "Tenga a mano la ficha técnica de su vehículo tractor. Los dos números que necesitamos son la masa máxima autorizada (casilla F.1) y la masa remolcable (casillas O.1 y O.2).\n\nCon eso resolvemos en dos minutos la pregunta que más tiempo hace perder.",
      },
      {
        heading: "Datos de la sociedad",
        body: "Los datos completos de identificación figuran en el aviso legal.",
        list: [
          `${COMPANY.name} — ${COMPANY.legalForm}`,
          `CIF ${COMPANY.siren} — NIF-IVA ${COMPANY.vatId}`,
          COMPANY.register,
        ],
      },
    ],
    updatedAt: UPDATED_AT,
  },
};
