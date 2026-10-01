/**
 * Traduit en espagnol les gabarits d'e-mails transactionnels.
 *
 *   node scripts/traduire-emails.mjs
 *
 * Les gabarits sont bilingues : ils choisissent entre deux littéraux selon la
 * langue de la commande. Ce script remplace le côté français par de l'espagnol
 * et renomme au passage le booléen `fr` en `es`, pour que le code cesse de
 * mentir sur ce qu'il teste.
 *
 * Le script VÉRIFIE chaque remplacement : un couple introuvable arrête le
 * traitement du fichier au lieu de le laisser à moitié traduit. Une traduction
 * partielle d'un e-mail de confirmation serait pire que pas de traduction du
 * tout — c'est le document qui fait foi vis-à-vis de l'acheteur.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EMAILS = path.join(RACINE, "src", "server", "emails");

/** Couples « français attendu » → « espagnol ». L'ordre compte. */
const ORDER = [
  // Formule d'appel
  ['function greeting(address: OrderAddress, fr: boolean): string {', 'function greeting(address: OrderAddress, es: boolean): string {'],
  ['return fr ? `Monsieur ${lastName}` : `Dear Mr ${lastName}`;', 'return es ? `Estimado Sr. ${lastName}` : `Dear Mr ${lastName}`;'],
  ['return fr ? `Madame ${lastName}` : `Dear Ms ${lastName}`;', 'return es ? `Estimada Sra. ${lastName}` : `Dear Ms ${lastName}`;'],
  ['return fr ? `Bonjour ${full}` : `Hello ${full}`;', 'return es ? `Hola, ${full}` : `Hello ${full}`;'],

  // Confirmation acheteur
  ['const fr = order.locale !== "en";', 'const es = order.locale !== "en";'],
  ['const lang: OrderEmailLocale = fr ? "es" : "en";', 'const lang: OrderEmailLocale = es ? "es" : "en";'],
  ['const dateLocale = fr ? "es-ES" : "en-GB";', 'const dateLocale = es ? "es-ES" : "en-GB";'],
  ['${siteUrl()}${fr ? "" : "/en"}', '${siteUrl()}${es ? "" : "/en"}'],
  ['const heading = fr ? "Merci pour votre commande" : "Thank you for your order";', 'const heading = es ? "Gracias por su pedido" : "Thank you for your order";'],

  ['    ? fr\n      ? `Merci de confirmer votre commande en effectuant un virement de <strong>${escapeHtml(formatCents(order.totalCents))}</strong> sur le compte ci-dessous, en indiquant le numéro de commande en référence.`',
   '    ? es\n      ? `Confirme su pedido transfiriendo <strong>${escapeHtml(formatCents(order.totalCents))}</strong> a la cuenta indicada abajo, poniendo el número de pedido como concepto.`'],

  ['  const intro = fr\n    ? [\n        `${escapeHtml(greeting(order.billing, true))},`,\n        `nous avons bien reçu votre commande <strong>${escapeHtml(order.orderNumber)}</strong> du ${escapeHtml(placed)}. Cet e-mail vaut confirmation de commande.`,',
   '  const intro = es\n    ? [\n        `${escapeHtml(greeting(order.billing, true))},`,\n        `hemos recibido su pedido <strong>${escapeHtml(order.orderNumber)}</strong> del ${escapeHtml(placed)}. Este correo es su confirmación de pedido.`,'],

  ['    article: fr ? "Article" : "Item",\n    quantity: fr ? "Qté" : "Qty",\n    total: fr ? "Total" : "Total",\n    subtotal: fr ? "Sous-total" : "Subtotal",\n    shipping: fr ? "Livraison" : "Shipping",\n    shippingMethod,\n    freeShipping: fr ? "offerte" : "free",\n    grandTotal: fr ? "Total" : "Total",',
   '    article: es ? "Artículo" : "Item",\n    quantity: es ? "Cant." : "Qty",\n    total: es ? "Total" : "Total",\n    subtotal: es ? "Subtotal" : "Subtotal",\n    shipping: es ? "Entrega" : "Shipping",\n    shippingMethod,\n    freeShipping: es ? "incluida" : "free",\n    grandTotal: es ? "Total" : "Total",'],

  ['const payment = panel(fr ? "Paiement" : "Payment", [', 'const payment = panel(es ? "Pago" : "Payment", ['],
  ['    ? panel(fr ? "Coordonnées bancaires" : "Bank details", [', '    ? panel(es ? "Datos bancarios" : "Bank details", ['],
  ['          ? `${fr ? "Titulaire du compte" : "Account holder"} : <strong>${escapeHtml(bankOrder.holder)}</strong>`',
   '          ? `${es ? "Titular de la cuenta" : "Account holder"}: <strong>${escapeHtml(bankOrder.holder)}</strong>`'],
  ['          ? `${fr ? "Type de virement" : "Transfer type"} : ${escapeHtml(bankOrder.transferType)}`',
   '          ? `${es ? "Tipo de transferencia" : "Transfer type"}: ${escapeHtml(bankOrder.transferType)}`'],
  ['        `${fr ? "Référence à indiquer" : "Payment reference"} : <strong>${escapeHtml(order.orderNumber)}</strong>`,',
   '        `${es ? "Concepto" : "Payment reference"}: <strong>${escapeHtml(order.orderNumber)}</strong>`,'],

  ['    fr ? "Adresse de livraison" : "Delivery address",', '    es ? "Dirección de entrega" : "Delivery address",'],
  [': panel(fr ? "Adresse de facturation" : "Billing address", addressLines(order.billing));', ': panel(es ? "Dirección de facturación" : "Billing address", addressLines(order.billing));'],
  ['    ? panel(fr ? "Votre remarque" : "Your note", [escapeHtml(order.customerNote)])', '    ? panel(es ? "Sus observaciones" : "Your note", [escapeHtml(order.customerNote)])'],

  ['  const footnote = fr\n    ? "Vous suivez l\'avancement de votre commande à tout moment grâce au lien ci-dessus. Votre droit de rétractation et nos conditions de retour figurent sur le site."',
   '  const footnote = es\n    ? "Puede seguir el estado de su pedido en cualquier momento con el enlace anterior. Su derecho de desistimiento y nuestras condiciones de devolución figuran en el sitio web."'],

  ['    preheader: fr\n      ? `Commande ${order.orderNumber} — ${formatCents(order.totalCents)}`',
   '    preheader: es\n      ? `Pedido ${order.orderNumber} — ${formatCents(order.totalCents)}`'],
  ['    action: { label: fr ? "Voir ma commande" : "View order", url: orderUrl },', '    action: { label: es ? "Ver mi pedido" : "View order", url: orderUrl },'],
  ['    footer: fr\n      ? "Equinomad — message automatique relatif à votre commande."',
   '    footer: es\n      ? "Equinomad — mensaje automático relativo a su pedido."'],

  ['        fr\n          ? `Merci de confirmer votre commande en effectuant un virement de ${formatCents(order.totalCents)} sur le compte ci-dessous, en indiquant le numéro de commande en référence.`',
   '        es\n          ? `Confirme su pedido transfiriendo ${formatCents(order.totalCents)} a la cuenta indicada abajo, poniendo el número de pedido como concepto.`'],
  ['        fr ? "Coordonnées bancaires :" : "Bank details:",', '        es ? "Datos bancarios:" : "Bank details:",'],
  ['          ? [`${fr ? "Titulaire du compte" : "Account holder"} : ${bankOrder.holder}`]', '          ? [`${es ? "Titular de la cuenta" : "Account holder"}: ${bankOrder.holder}`]'],
  ['          ? [`${fr ? "Type de virement" : "Transfer type"} : ${bankOrder.transferType}`]', '          ? [`${es ? "Tipo de transferencia" : "Transfer type"}: ${bankOrder.transferType}`]'],
  ['        `${fr ? "Référence à indiquer" : "Payment reference"} : ${order.orderNumber}`,', '        `${es ? "Concepto" : "Payment reference"}: ${order.orderNumber}`,'],

  ['    `${greeting(order.billing, fr)},`,', '    `${greeting(order.billing, es)},`,'],
  ['    fr\n      ? `nous avons bien reçu votre commande ${order.orderNumber} du ${placed}. Cet e-mail vaut confirmation de commande.`',
   '    es\n      ? `hemos recibido su pedido ${order.orderNumber} del ${placed}. Este correo es su confirmación de pedido.`'],
  ['    `${fr ? "Sous-total" : "Subtotal"} : ${formatCents(order.subtotalCents)}`,', '    `${es ? "Subtotal" : "Subtotal"}: ${formatCents(order.subtotalCents)}`,'],
  ['    `${fr ? "Livraison" : "Shipping"} — ${shippingMethod} : ${order.shippingCents === 0 ? (fr ? "offerte" : "free") : formatCents(order.shippingCents)}`,',
   '    `${es ? "Entrega" : "Shipping"} — ${shippingMethod}: ${order.shippingCents === 0 ? (es ? "incluida" : "free") : formatCents(order.shippingCents)}`,'],
  ['    `${fr ? "Total" : "Total"} : ${formatCents(order.totalCents)}`,', '    `${es ? "Total" : "Total"}: ${formatCents(order.totalCents)}`,'],
  ['    `${fr ? "Paiement" : "Payment"} : ${order.paymentMethodLabel}`,', '    `${es ? "Pago" : "Payment"}: ${order.paymentMethodLabel}`,'],
  ['    `${fr ? "Adresse de livraison" : "Delivery address"} :`,', '    `${es ? "Dirección de entrega" : "Delivery address"}:`,'],
  ['      : ["", `${fr ? "Adresse de facturation" : "Billing address"} :`, addressText(order.billing)]),', '      : ["", `${es ? "Dirección de facturación" : "Billing address"}:`, addressText(order.billing)]),'],
  ['    subject: fr\n      ? `Confirmation de commande ${order.orderNumber}`', '    subject: es\n      ? `Confirmación de pedido ${order.orderNumber}`'],

  // Notification au vendeur — la boutique est espagnole, son back-office aussi
  ['  const heading = "Nouvelle commande";', '  const heading = "Nuevo pedido";'],
  ['    `Commande <strong>${escapeHtml(order.orderNumber)}</strong> reçue le ${escapeHtml(placed)}.`,', '    `Pedido <strong>${escapeHtml(order.orderNumber)}</strong> recibido el ${escapeHtml(placed)}.`,'],
  ['    `Montant : <strong>${escapeHtml(formatCents(order.totalCents))}</strong> — paiement : ${escapeHtml(order.paymentMethodLabel)}${order.paymentMethodFee ? ` (${escapeHtml(order.paymentMethodFee)})` : ""}.`,',
   '    `Importe: <strong>${escapeHtml(formatCents(order.totalCents))}</strong> — pago: ${escapeHtml(order.paymentMethodLabel)}${order.paymentMethodFee ? ` (${escapeHtml(order.paymentMethodFee)})` : ""}.`,'],
  ['      ? `<strong>${escapeHtml(shippingMethod)}</strong> — à préparer en priorité.`\n      : `Livraison : ${escapeHtml(shippingMethod)}.`,',
   '      ? `<strong>${escapeHtml(shippingMethod)}</strong> — preparar con prioridad.`\n      : `Entrega: ${escapeHtml(shippingMethod)}.`,'],
  ['    article: "Article",\n    quantity: "Qté",\n    total: "Total",\n    subtotal: "Sous-total",\n    shipping: "Livraison",\n    shippingMethod,\n    freeShipping: "offerte",\n    grandTotal: "Total",',
   '    article: "Artículo",\n    quantity: "Cant.",\n    total: "Total",\n    subtotal: "Subtotal",\n    shipping: "Entrega",\n    shippingMethod,\n    freeShipping: "incluida",\n    grandTotal: "Total",'],
  ['  const customer = panel("Client", [', '  const customer = panel("Cliente", ['],
  ['    `Langue de la commande : ${order.locale === "en" ? "anglais" : "français"}`,', '    `Idioma del pedido: ${order.locale === "en" ? "inglés" : "español"}`,'],
  ['  const shippingPanel = panel("Adresse de livraison", addressLines(order.shipping));', '  const shippingPanel = panel("Dirección de entrega", addressLines(order.shipping));'],
];

async function traducir(archivo, pares) {
  const ruta = path.join(EMAILS, archivo);
  // Les fins de ligne sont ramenées à « \n » avant comparaison : le fichier
  // peut être en CRLF sous Windows, et un motif multi-ligne écrit en LF ne
  // matcherait alors jamais — en silence, ce qui est le pire des cas.
  let texto = (await readFile(ruta, "utf-8")).replace(/\r\n/g, "\n");
  const faltantes = [];

  let aplicados = 0;
  let yaHechos = 0;

  for (const [antes, despues] of pares) {
    if (texto.includes(antes)) {
      texto = texto.split(antes).join(despues);
      aplicados += 1;
      continue;
    }
    // Absent du fichier mais remplacement déjà présent : le script a déjà
    // tourné. C'est le cas normal d'une seconde exécution, pas une erreur —
    // sans cette distinction, le script ne serait jouable qu'une fois.
    if (texto.includes(despues)) {
      yaHechos += 1;
      continue;
    }
    faltantes.push(antes.split("\n")[0].trim().slice(0, 70));
  }

  if (faltantes.length > 0) {
    console.error(`\n${archivo} : ${faltantes.length} couple(s) introuvable(s), fichier NON modifié :`);
    for (const f of faltantes) console.error(`  · ${f}`);
    process.exitCode = 1;
    return;
  }

  await writeFile(ruta, texto, "utf-8");
  console.log(
    `${archivo} : ${aplicados} remplacement(s) appliqué(s)` +
      (yaHechos > 0 ? `, ${yaHechos} déjà en place` : ""),
  );
}

/** E-mails de compte client : réinitialisation, bienvenue, adresse déjà prise. */
const CUENTA = [
  ['  const fr = input.locale === "es";', '  const es = input.locale === "es";'],
  ['${siteUrl()}${fr ? "" : "/en"}', '${siteUrl()}${es ? "" : "/en"}'],

  // Réinitialisation du mot de passe
  ['const heading = fr ? "Réinitialiser votre mot de passe" : "Reset your password";', 'const heading = es ? "Restablecer su contraseña" : "Reset your password";'],
  ['  const paragraphs = fr\n    ? [\n        `Bonjour ${name},`,\n        "une réinitialisation du mot de passe a été demandée pour votre compte client. Le lien ci-dessous vous permet d\'en choisir un nouveau.",\n      ]',
   '  const paragraphs = es\n    ? [\n        `Hola, ${name}:`,\n        "se ha solicitado restablecer la contraseña de su cuenta de cliente. El enlace de abajo le permite elegir una nueva.",\n      ]'],
  ['  const footnote = fr\n    ? `Le lien est valable ${input.expiresInMinutes} minutes et ne peut servir qu\'une seule fois. Si vous n\'êtes pas à l\'origine de cette demande, ignorez cet e-mail — votre mot de passe reste inchangé.`',
   '  const footnote = es\n    ? `El enlace es válido durante ${input.expiresInMinutes} minutos y solo puede usarse una vez. Si no ha sido usted quien lo ha solicitado, ignore este correo: su contraseña no cambia.`'],
  ['    preheader: fr\n      ? "Nouveau mot de passe pour votre compte client"', '    preheader: es\n      ? "Nueva contraseña para su cuenta de cliente"'],
  ['      label: fr ? "Choisir un nouveau mot de passe" : "Choose a new password",', '      label: es ? "Elegir una nueva contraseña" : "Choose a new password",'],
  ['    ...(fr\n      ? [\n          `Bonjour ${input.firstName},`,\n          "une réinitialisation du mot de passe a été demandée pour votre compte client.",\n        ]',
   '    ...(es\n      ? [\n          `Hola, ${input.firstName}:`,\n          "se ha solicitado restablecer la contraseña de su cuenta de cliente.",\n        ]'],
  ['  return { subject: fr ? "Réinitialiser votre mot de passe" : "Reset your password", html, text };', '  return { subject: es ? "Restablecer su contraseña" : "Reset your password", html, text };'],

  // Bienvenue
  ['const heading = fr ? "Votre compte client est créé" : "Your customer account is ready";', 'const heading = es ? "Su cuenta de cliente está lista" : "Your customer account is ready";'],
  ['  const paragraphs = fr\n    ? [\n        `Bonjour ${name},`,\n        "votre compte client Equinomad a été créé. Vous pouvez dès maintenant vous connecter, consulter vos commandes et gérer vos adresses.",\n      ]',
   '  const paragraphs = es\n    ? [\n        `Hola, ${name}:`,\n        "su cuenta de cliente de Equinomad ya está creada. Puede entrar ahora mismo para consultar sus pedidos y gestionar sus direcciones.",\n      ]'],
  ['  const footnote = fr\n    ? "Le compte est facultatif : vous pouvez à tout moment commander en tant qu\'invité. Vous pouvez également supprimer vous-même votre compte et toutes les données qu\'il contient."',
   '  const footnote = es\n    ? "La cuenta es opcional: puede comprar como invitado cuando quiera. También puede eliminar usted mismo la cuenta y todos los datos que contiene."'],
  ['    action: { label: fr ? "Accéder à mon compte" : "Go to my account", url },', '    action: { label: es ? "Ir a mi cuenta" : "Go to my account", url },'],

  // Adresse déjà utilisée
  ['const heading = fr ? "Un compte existe déjà" : "An account already exists";', 'const heading = es ? "Ya existe una cuenta" : "An account already exists";'],
  ['  const paragraphs = fr\n    ? [\n        `Bonjour ${name},`,\n        "quelqu\'un vient d\'essayer de créer un compte client avec votre adresse e-mail. Un compte existe déjà pour cette adresse : aucun second compte n\'a donc été créé.",\n        "S\'il s\'agissait de vous et que vous ne vous souvenez plus de votre mot de passe, réinitialisez-le simplement.",\n      ]',
   '  const paragraphs = es\n    ? [\n        `Hola, ${name}:`,\n        "alguien acaba de intentar crear una cuenta de cliente con su dirección de correo. Ya existe una cuenta asociada a esa dirección, así que no se ha creado ninguna segunda.",\n        "Si ha sido usted y no recuerda su contraseña, basta con restablecerla.",\n      ]'],
  ['  const footnote = fr\n    ? "Si ce n\'était pas vous, vous n\'avez rien à faire. Votre compte et votre mot de passe n\'ont pas été modifiés."',
   '  const footnote = es\n    ? "Si no ha sido usted, no tiene que hacer nada. Su cuenta y su contraseña no se han modificado."'],
  ['    action: { label: fr ? "Réinitialiser le mot de passe" : "Reset password", url },', '    action: { label: es ? "Restablecer la contraseña" : "Reset password", url },'],
];

await traducir("order.ts", ORDER);
await traducir("customerAccount.ts", CUENTA);
