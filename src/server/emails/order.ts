/**
 * Gabarits des e-mails déclenchés par une commande validée.
 *
 * Deux destinataires, deux messages distincts :
 *  - l'acheteur reçoit sa confirmation de commande, dans la langue où il a
 *    commandé (fr | en). C'est la confirmation sur support durable exigée par
 *    l'article L221-13 du Code de la consommation : elle doit récapituler la
 *    commande sans délai, donc contenir les articles, les montants et les
 *    adresses ;
 *  - le vendeur reçoit une notification de travail, en français comme le reste
 *    du back-office, avec les coordonnées du client et le lien direct vers la
 *    fiche de commande.
 *
 * Mêmes contraintes de mise en page que src/server/emails/adminOtp.ts :
 * tableaux et styles en ligne, `color-scheme: light` pour empêcher l'inversion
 * automatique des couleurs, fond déclaré sur chaque cellule.
 */

import { formatCents } from "@/lib/cart";
import type { MailMessage } from "@/lib/mailer";
import type { ShippingMethodKey } from "@/lib/cart";
import type { OrderAddress, OrderRecord } from "@/server/orders";
// Import de type seul : ce module reste pur (aucune ouverture de base), pour
// que les tests le chargent sans DATABASE_URL. Les coordonnées lui sont passées
// en argument, jamais lues ici.
import type { BankTransferSettings } from "@/server/bankTransfer";

/** Clé du moyen de paiement « virement bancaire » (dupliquée volontairement
 *  pour ne pas importer de valeur runtime depuis le module bankTransfer). */
const BANK_TRANSFER_KEY = "banque";

export type OrderEmailLocale = "es" | "en";

const LOGO_WIDTH = 220;
// Rapport d'origine du fichier : 747 × 162
const LOGO_HEIGHT = Math.round((LOGO_WIDTH * 162) / 747);

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Horodatage lisible, toujours ramené à l'heure française de la boutique. */
function formatDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }).format(new Date(iso));
}

// ---- Ossature commune ----

interface LayoutInput {
  lang: string;
  preheader: string;
  heading: string;
  /** Paragraphes d'introduction, déjà échappés par l'appelant. */
  intro: string[];
  /** Blocs HTML construits par les fabriques ci-dessous. */
  blocks: string[];
  action?: { label: string; url: string };
  footnote?: string;
  footer: string;
}

function layout(input: LayoutInput): string {
  const logo = `${siteUrl()}/images/logo-full.png`;

  const intro = input.intro
    .map(
      (paragraph) =>
        `<p style="margin:0 0 16px 0; font-family:Arial,Helvetica,sans-serif; font-size:15px; line-height:24px; color:#3f4854;">${paragraph}</p>`,
    )
    .join("\n");

  const action = input.action
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 20px 0;">
                  <tr>
                    <td align="center" bgcolor="#c24400" style="background-color:#c24400; border-radius:4px;">
                      <a href="${escapeHtml(input.action.url)}" style="display:inline-block; padding:14px 28px; font-family:Arial,Helvetica,sans-serif; font-size:15px; font-weight:bold; color:#ffffff; text-decoration:none;">${escapeHtml(input.action.label)}</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 16px 0; font-family:Arial,Helvetica,sans-serif; font-size:12px; line-height:20px; color:#4b5563; word-break:break-all;">${escapeHtml(input.action.url)}</p>`
    : "";

  const footnote = input.footnote
    ? `<p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:13px; line-height:21px; color:#4b5563;">${input.footnote}</p>`
    : "";

  return `<!doctype html>
<html lang="${input.lang}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>${escapeHtml(input.heading)}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f1f2f4; color-scheme:light;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${escapeHtml(input.preheader)}</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f1f2f4;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:100%; background-color:#ffffff; border:1px solid #e0e2e6; border-radius:6px;">
            <tr>
              <td align="center" style="background-color:#ffffff; padding:32px 24px 24px 24px; border-radius:6px 6px 0 0;">
                <img src="${logo}" alt="Remolque Caballos" width="${LOGO_WIDTH}" height="${LOGO_HEIGHT}" style="display:block; width:${LOGO_WIDTH}px; height:auto; border:0; outline:none; text-decoration:none;" />
              </td>
            </tr>
            <tr>
              <td style="background-color:#ff5c00; font-size:0; line-height:0; height:4px;">&nbsp;</td>
            </tr>
            <tr>
              <td style="background-color:#ffffff; padding:32px 32px 8px 32px;">
                <h1 style="margin:0 0 16px 0; font-family:Arial,Helvetica,sans-serif; font-size:20px; line-height:28px; font-weight:bold; color:#001424;">${escapeHtml(input.heading)}</h1>
                ${intro}
              </td>
            </tr>
            <tr>
              <td style="background-color:#ffffff; padding:0 32px;">
                ${input.blocks.join("\n")}
              </td>
            </tr>
            <tr>
              <td style="background-color:#ffffff; padding:24px 32px 32px 32px; border-radius:0 0 6px 6px;">
                ${action}
                ${footnote}
              </td>
            </tr>
          </table>

          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:100%;">
            <tr>
              <td align="center" style="padding:20px 16px 0 16px; font-family:Arial,Helvetica,sans-serif; font-size:12px; line-height:20px; color:#4b5563;">
                ${escapeHtml(input.footer)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Encadré gris à titre, utilisé pour les adresses et les coordonnées. */
function panel(title: string, rows: string[]): string {
  const body = rows
    .filter((row) => row.length > 0)
    .map(
      (row) =>
        `<div style="font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:22px; color:#3f4854;">${row}</div>`,
    )
    .join("\n");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px 0; background-color:#f7f8f9; border:1px solid #d6d9de; border-radius:6px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="margin:0 0 6px 0; font-family:Arial,Helvetica,sans-serif; font-size:12px; line-height:18px; font-weight:bold; text-transform:uppercase; letter-spacing:0.6px; color:#001424;">${escapeHtml(title)}</div>
                      ${body}
                    </td>
                  </tr>
                </table>`;
}

/** Tableau des articles suivi du décompte des montants. */
function itemsTable(
  order: OrderRecord,
  labels: {
    article: string;
    quantity: string;
    total: string;
    subtotal: string;
    shipping: string;
    /** Mode retenu, déjà traduit : « Livraison express (24 à 48 heures) ». */
    shippingMethod: string;
    freeShipping: string;
    grandTotal: string;
  },
): string {
  const rows = order.items
    .map((item) => {
      const title = escapeHtml(`${item.brand} ${item.name}`.trim());
      const variant = item.variantLabel ? `<br /><span style="font-size:12px; color:#4b5563;">${escapeHtml(item.variantLabel)}</span>` : "";
      const sku = item.sku ? `<br /><span style="font-size:12px; color:#4b5563;">Réf. ${escapeHtml(item.sku)}</span>` : "";
      const unit = item.quantity > 1 ? `<br /><span style="font-size:12px; color:#4b5563;">${escapeHtml(formatCents(item.unitPriceCents))} / u.</span>` : "";
      return `<tr>
                    <td style="padding:12px 8px 12px 0; border-bottom:1px solid #e0e2e6; font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:21px; color:#001424;">${title}${variant}${sku}${unit}</td>
                    <td align="center" style="padding:12px 8px; border-bottom:1px solid #e0e2e6; font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:21px; color:#3f4854; white-space:nowrap;">${item.quantity}&nbsp;×</td>
                    <td align="right" style="padding:12px 0 12px 8px; border-bottom:1px solid #e0e2e6; font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:21px; color:#001424; white-space:nowrap;">${escapeHtml(formatCents(item.lineTotalCents))}</td>
                  </tr>`;
    })
    .join("\n");

  const shippingValue =
    order.shippingCents === 0 ? labels.freeShipping : formatCents(order.shippingCents);
  // Le mode de livraison est nommé sur la ligne des frais : « 60,00 € » seul
  // laisserait le client chercher d'où vient la somme.
  const shippingLabel = `${labels.shipping} — ${labels.shippingMethod}`;

  const summaryRow = (label: string, value: string, strong = false) =>
    `<tr>
                    <td style="padding:${strong ? "12px" : "4px"} 0 4px 0; font-family:Arial,Helvetica,sans-serif; font-size:${strong ? "16px" : "14px"}; line-height:24px; color:#001424; ${strong ? "font-weight:bold;" : ""}">${escapeHtml(label)}</td>
                    <td align="right" style="padding:${strong ? "12px" : "4px"} 0 4px 0; font-family:Arial,Helvetica,sans-serif; font-size:${strong ? "16px" : "14px"}; line-height:24px; color:#001424; white-space:nowrap; ${strong ? "font-weight:bold;" : ""}">${escapeHtml(value)}</td>
                  </tr>`;

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px 0;">
                  <tr>
                    <th align="left" style="padding:0 8px 8px 0; border-bottom:2px solid #001424; font-family:Arial,Helvetica,sans-serif; font-size:12px; line-height:18px; text-transform:uppercase; letter-spacing:0.6px; color:#001424;">${escapeHtml(labels.article)}</th>
                    <th align="center" style="padding:0 8px 8px 8px; border-bottom:2px solid #001424; font-family:Arial,Helvetica,sans-serif; font-size:12px; line-height:18px; text-transform:uppercase; letter-spacing:0.6px; color:#001424;">${escapeHtml(labels.quantity)}</th>
                    <th align="right" style="padding:0 0 8px 8px; border-bottom:2px solid #001424; font-family:Arial,Helvetica,sans-serif; font-size:12px; line-height:18px; text-transform:uppercase; letter-spacing:0.6px; color:#001424;">${escapeHtml(labels.total)}</th>
                  </tr>
                  ${rows}
                </table>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px 0;">
                  ${summaryRow(labels.subtotal, formatCents(order.subtotalCents))}
                  ${summaryRow(shippingLabel, shippingValue)}
                  ${summaryRow(labels.grandTotal, formatCents(order.totalCents), true)}
                </table>`;
}

/**
 * Mode de livraison rendu dans la langue du message.
 *
 * Les délais sont écrits en clair plutôt que dérivés de `minDays`/`maxDays` :
 * l'express se dit « 24–48 heures », pas « 1–2 jours », et c'est bien cette
 * promesse-là qui a été faite au client dans le tunnel.
 */
const SHIPPING_METHOD_TEXTS = {
  en: {
    standard: "Standard delivery (5–10 working days)",
    express: "Priority delivery (48–72 hours)",
  },
  es: {
    standard: "Entrega estándar (5 a 10 días laborables)",
    express: "Entrega prioritaria (48 a 72 horas)",
  },
} as const satisfies Record<string, Record<ShippingMethodKey, string>>;

function shippingMethodText(order: OrderRecord, lang: OrderEmailLocale): string {
  return SHIPPING_METHOD_TEXTS[lang][order.shippingMethodKey];
}

/** Adresse postale sur plusieurs lignes, déjà échappée. */
function addressLines(address: OrderAddress): string[] {
  const name = [address.firstName, address.lastName].filter(Boolean).join(" ");
  return [
    address.company ? escapeHtml(address.company) : "",
    escapeHtml(name),
    escapeHtml(address.street),
    escapeHtml(`${address.postalCode} ${address.city}`.trim()),
    escapeHtml(address.country),
  ];
}

/** Version texte brut d'une adresse — les clients sans HTML la voient. */
function addressText(address: OrderAddress): string {
  return [
    address.company,
    [address.firstName, address.lastName].filter(Boolean).join(" "),
    address.street,
    `${address.postalCode} ${address.city}`.trim(),
    address.country,
  ]
    .filter(Boolean)
    .join("\n");
}

function itemsText(order: OrderRecord): string {
  return order.items
    .map((item) => {
      const label = item.variantLabel ? ` (${item.variantLabel})` : "";
      return `- ${item.quantity} × ${`${item.brand} ${item.name}`.trim()}${label} — ${formatCents(item.lineTotalCents)}`;
    })
    .join("\n");
}

// ---- Confirmation à l'acheteur ----

/**
 * Formule d'appel construite à partir de la civilité que le client a lui-même
 * choisie dans le tunnel. Sans civilité, ou avec « divers », on s'en tient au
 * nom complet : rien n'est déduit du prénom.
 */
function greeting(address: OrderAddress, es: boolean): string {
  const lastName = address.lastName;
  if (address.salutation === "herr") return es ? `Estimado Sr. ${lastName}` : `Dear Mr ${lastName}`;
  if (address.salutation === "frau") return es ? `Estimada Sra. ${lastName}` : `Dear Ms ${lastName}`;
  const full = [address.firstName, lastName].filter(Boolean).join(" ");
  return es ? `Hola, ${full}` : `Hello ${full}`;
}

export function buildOrderConfirmationEmail(
  order: OrderRecord,
  bankTransfer?: BankTransferSettings,
): Omit<MailMessage, "to"> {
  const es = order.locale !== "en";
  const lang: OrderEmailLocale = es ? "es" : "en";
  const dateLocale = es ? "es-ES" : "en-GB";
  const orderUrl = `${siteUrl()}${es ? "" : "/en"}/confirmation/${order.orderNumber}?token=${order.accessToken}`;

  // Virement : le bloc de coordonnées n'apparaît que pour une commande réglée
  // par virement dont l'IBAN est renseigné en administration.
  const bankOrder =
    order.paymentMethodKey === BANK_TRANSFER_KEY &&
    !!bankTransfer &&
    bankTransfer.iban.trim().length > 0
      ? bankTransfer
      : null;

  const heading = es ? "Gracias por su pedido" : "Thank you for your order";
  const placed = formatDate(order.createdAt, dateLocale);

  // Texte d'instructions fixe : seules les coordonnées changent.
  const bankInstruction = bankOrder
    ? es
      ? `Confirme su pedido transfiriendo <strong>${escapeHtml(formatCents(order.totalCents))}</strong> a la cuenta indicada abajo, poniendo el número de pedido como concepto.`
      : `Please confirm your order by transferring <strong>${escapeHtml(formatCents(order.totalCents))}</strong> to the account below, quoting the order number as the reference.`
    : null;

  const intro = es
    ? [
        `${escapeHtml(greeting(order.billing, true))},`,
        `hemos recibido su pedido <strong>${escapeHtml(order.orderNumber)}</strong> del ${escapeHtml(placed)}. Este correo es su confirmación de pedido.`,
        ...(bankInstruction ? [bankInstruction] : []),
      ]
    : [
        `${escapeHtml(greeting(order.billing, false))},`,
        `we have received your order <strong>${escapeHtml(order.orderNumber)}</strong> placed on ${escapeHtml(placed)}. This email is your order confirmation.`,
        ...(bankInstruction ? [bankInstruction] : []),
      ];

  const shippingMethod = shippingMethodText(order, lang);

  const table = itemsTable(order, {
    article: es ? "Artículo" : "Item",
    quantity: es ? "Cant." : "Qty",
    total: es ? "Total" : "Total",
    subtotal: es ? "Subtotal" : "Subtotal",
    shipping: es ? "Entrega" : "Shipping",
    shippingMethod,
    freeShipping: es ? "incluida" : "free",
    grandTotal: es ? "Total" : "Total",
  });

  const payment = panel(es ? "Pago" : "Payment", [
    escapeHtml(order.paymentMethodLabel),
    order.paymentMethodFee ? escapeHtml(order.paymentMethodFee) : "",
  ]);

  // Coordonnées du virement : mêmes champs que la page de confirmation, dans le
  // même ordre. Chaque ligne n'apparaît que si elle est renseignée, sauf la
  // référence — toujours le numéro de commande.
  const bankPanel = bankOrder
    ? panel(es ? "Datos bancarios" : "Bank details", [
        bankOrder.holder
          ? `${es ? "Titular de la cuenta" : "Account holder"}: <strong>${escapeHtml(bankOrder.holder)}</strong>`
          : "",
        `IBAN : <strong>${escapeHtml(bankOrder.iban)}</strong>`,
        bankOrder.bic ? `BIC : <strong>${escapeHtml(bankOrder.bic)}</strong>` : "",
        bankOrder.transferType
          ? `${es ? "Tipo de transferencia" : "Transfer type"}: ${escapeHtml(bankOrder.transferType)}`
          : "",
        `${es ? "Concepto" : "Payment reference"}: <strong>${escapeHtml(order.orderNumber)}</strong>`,
      ])
    : "";

  const shippingPanel = panel(
    es ? "Dirección de entrega" : "Delivery address",
    addressLines(order.shipping),
  );
  const billingPanel = order.shippingSameAsBilling
    ? ""
    : panel(es ? "Dirección de facturación" : "Billing address", addressLines(order.billing));

  const notePanel = order.customerNote
    ? panel(es ? "Sus observaciones" : "Your note", [escapeHtml(order.customerNote)])
    : "";

  const footnote = es
    ? "Puede seguir el estado de su pedido en cualquier momento con el enlace anterior. Su derecho de desistimiento y nuestras condiciones de devolución figuran en el sitio web."
    : "You can check the current status of your order at any time using the link above. Your right of withdrawal and our return conditions are available on our website.";

  const html = layout({
    lang,
    preheader: es
      ? `Pedido ${order.orderNumber} — ${formatCents(order.totalCents)}`
      : `Order ${order.orderNumber} — ${formatCents(order.totalCents)}`,
    heading,
    intro,
    blocks: [bankPanel, table, payment, shippingPanel, billingPanel, notePanel].filter(Boolean),
    action: { label: es ? "Ver mi pedido" : "View order", url: orderUrl },
    footnote: escapeHtml(footnote),
    footer: es
      ? "Remolque Caballos — mensaje automático relativo a su pedido."
      : "Remolque Caballos — automated message about your order.",
  });

  const bankText = bankOrder
    ? [
        "",
        es
          ? `Confirme su pedido transfiriendo ${formatCents(order.totalCents)} a la cuenta indicada abajo, poniendo el número de pedido como concepto.`
          : `Please confirm your order by transferring ${formatCents(order.totalCents)} to the account below, quoting the order number as the reference.`,
        "",
        es ? "Datos bancarios:" : "Bank details:",
        ...(bankOrder.holder
          ? [`${es ? "Titular de la cuenta" : "Account holder"}: ${bankOrder.holder}`]
          : []),
        `IBAN : ${bankOrder.iban}`,
        ...(bankOrder.bic ? [`BIC : ${bankOrder.bic}`] : []),
        ...(bankOrder.transferType
          ? [`${es ? "Tipo de transferencia" : "Transfer type"}: ${bankOrder.transferType}`]
          : []),
        `${es ? "Concepto" : "Payment reference"}: ${order.orderNumber}`,
      ]
    : [];

  const text = [
    heading,
    "",
    `${greeting(order.billing, es)},`,
    es
      ? `hemos recibido su pedido ${order.orderNumber} del ${placed}. Este correo es su confirmación de pedido.`
      : `we have received your order ${order.orderNumber} placed on ${placed}. This email is your order confirmation.`,
    ...bankText,
    "",
    itemsText(order),
    "",
    `${es ? "Subtotal" : "Subtotal"}: ${formatCents(order.subtotalCents)}`,
    `${es ? "Entrega" : "Shipping"} — ${shippingMethod}: ${order.shippingCents === 0 ? (es ? "incluida" : "free") : formatCents(order.shippingCents)}`,
    `${es ? "Total" : "Total"}: ${formatCents(order.totalCents)}`,
    "",
    `${es ? "Pago" : "Payment"}: ${order.paymentMethodLabel}`,
    "",
    `${es ? "Dirección de entrega" : "Delivery address"}:`,
    addressText(order.shipping),
    ...(order.shippingSameAsBilling
      ? []
      : ["", `${es ? "Dirección de facturación" : "Billing address"}:`, addressText(order.billing)]),
    "",
    orderUrl,
    "",
    footnote,
  ].join("\n");

  return {
    subject: es
      ? `Confirmación de pedido ${order.orderNumber}`
      : `Order confirmation ${order.orderNumber}`,
    html,
    text,
  };
}

// ---- Notification au vendeur ----

export function buildOrderNotificationEmail(order: OrderRecord): Omit<MailMessage, "to"> {
  const adminUrl = `${siteUrl()}/admin/orders/${order.id}`;
  const placed = formatDate(order.createdAt, "es-ES");
  const heading = "Nuevo pedido";

  const shippingMethod = shippingMethodText(order, "es");
  // L'express est signalé dès l'introduction : c'est une contrainte de
  // préparation, pas un simple détail de facturation.
  const express = order.shippingMethodKey === "express";

  const intro = [
    `Pedido <strong>${escapeHtml(order.orderNumber)}</strong> recibido el ${escapeHtml(placed)}.`,
    `Importe: <strong>${escapeHtml(formatCents(order.totalCents))}</strong> — pago: ${escapeHtml(order.paymentMethodLabel)}${order.paymentMethodFee ? ` (${escapeHtml(order.paymentMethodFee)})` : ""}.`,
    express
      ? `<strong>${escapeHtml(shippingMethod)}</strong> — preparar con prioridad.`
      : `Entrega: ${escapeHtml(shippingMethod)}.`,
  ];

  const table = itemsTable(order, {
    article: "Artículo",
    quantity: "Cant.",
    total: "Total",
    subtotal: "Subtotal",
    shipping: "Entrega",
    shippingMethod,
    freeShipping: "incluida",
    grandTotal: "Total",
  });

  const customer = panel("Cliente", [
    escapeHtml([order.billing.firstName, order.billing.lastName].filter(Boolean).join(" ")),
    order.billing.company ? escapeHtml(order.billing.company) : "",
    `<a href="mailto:${escapeHtml(order.email)}" style="color:#001424;">${escapeHtml(order.email)}</a>`,
    order.phone ? `<a href="tel:${escapeHtml(order.phone.replace(/\s/g, ""))}" style="color:#001424;">${escapeHtml(order.phone)}</a>` : "",
    `Idioma del pedido: ${order.locale === "en" ? "inglés" : "español"}`,
  ]);

  const shippingPanel = panel("Dirección de entrega", addressLines(order.shipping));
  const billingPanel = order.shippingSameAsBilling
    ? ""
    : panel("Dirección de facturación", addressLines(order.billing));

  const notePanel = order.customerNote
    ? panel("Observaciones del cliente", [escapeHtml(order.customerNote)])
    : "";

  const html = layout({
    lang: "es",
    preheader: `${order.orderNumber} — ${formatCents(order.totalCents)} — ${order.paymentMethodLabel}`,
    heading,
    intro,
    blocks: [table, customer, shippingPanel, billingPanel, notePanel].filter(Boolean),
    action: { label: "Abrir en el back-office", url: adminUrl },
    footnote:
      "Las existencias ya se reservaron al registrarse el pedido. El pago sigue pendiente: confírmelo en el back-office en cuanto lo reciba.",
    footer: "Remolque Caballos — notificación automática del back-office.",
  });

  const text = [
    `${heading}: ${order.orderNumber}`,
    "",
    `Recibido el ${placed}`,
    `Importe: ${formatCents(order.totalCents)}`,
    `Pago: ${order.paymentMethodLabel}`,
    `Entrega: ${shippingMethod}`,
    "",
    itemsText(order),
    "",
    `Subtotal: ${formatCents(order.subtotalCents)}`,
    `Entrega: ${order.shippingCents === 0 ? "incluida" : formatCents(order.shippingCents)}`,
    `Total: ${formatCents(order.totalCents)}`,
    "",
    "Cliente:",
    [order.billing.firstName, order.billing.lastName].filter(Boolean).join(" "),
    order.email,
    order.phone,
    "",
    "Dirección de entrega:",
    addressText(order.shipping),
    ...(order.shippingSameAsBilling
      ? []
      : ["", "Dirección de facturación:", addressText(order.billing)]),
    ...(order.customerNote ? ["", `Observaciones del cliente: ${order.customerNote}`] : []),
    "",
    adminUrl,
  ]
    .filter((line) => line !== undefined)
    .join("\n");

  return {
    subject: `Nuevo pedido ${order.orderNumber} — ${formatCents(order.totalCents)}`,
    html,
    text,
  };
}
