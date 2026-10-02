import { formatCents } from "@/lib/cart";
import type { PaymentStatus } from "@/lib/orderStatus";
import type { OrderRecord } from "@/server/orders";
import { escapeHtml as e } from "@/server/telegram";

/**
 * Textes des alertes Telegram, en français pour l'exploitant. Tout ce qui vient
 * d'un visiteur (nom, message, note) est échappé : Telegram lit le HTML.
 * Chaque alerte se termine par le lien qui permet d'agir.
 */

const DRAPEAUX: Readonly<Record<string, string>> = {
  es: "🇪🇸", en: "🇬🇧", fr: "🇫🇷", de: "🇩🇪", it: "🇮🇹", pt: "🇵🇹", nl: "🇳🇱", nb: "🇳🇴", sv: "🇸🇪",
};

function langue(locale: string): string {
  return `${DRAPEAUX[locale] ?? "🌐"} ${locale.toUpperCase()}`;
}

function client(order: OrderRecord): string {
  const b = order.billing;
  return [`${b.firstName} ${b.lastName}`.trim(), b.company].filter(Boolean).map(e).join(" — ");
}

function lienCommande(order: OrderRecord, site: string): string {
  return `${site}/admin/orders/${order.id}`;
}

export function newOrderMessage(order: OrderRecord, site: string): string {
  const s = order.shipping;
  const lignes = order.items.map(
    (i) => `• ${i.quantity} × ${e([i.brand, i.name].filter(Boolean).join(" "))}${i.variantLabel ? ` (${e(i.variantLabel)})` : ""} — ${formatCents(i.lineTotalCents)}`,
  );
  return [
    `🛒 <b>Nouvelle commande ${e(order.orderNumber)}</b>`,
    `<b>${formatCents(order.totalCents)}</b> · ${e(order.paymentMethodLabel)} · ${e(order.shippingMethodLabel)}`,
    "",
    `👤 ${client(order)} · ${langue(order.locale)}`,
    `✉️ ${e(order.email)}`,
    order.phone ? `📞 ${e(order.phone)}` : null,
    `📍 ${e(`${s.postalCode} ${s.city}`.trim())} (${e(s.country.toUpperCase())})`,
    "",
    ...lignes,
    order.customerNote ? `\n📝 ${e(order.customerNote)}` : null,
    "",
    lienCommande(order, site),
  ]
    .filter((ligne) => ligne !== null)
    .join("\n");
}

const ETATS_PAIEMENT: Readonly<Record<PaymentStatus, string>> = {
  offen: "⏳ Paiement en attente",
  bezahlt: "✅ Commande payée",
  erstattet: "↩️ Commande remboursée",
  fehlgeschlagen: "❌ Paiement échoué",
};

export function paymentMessage(order: OrderRecord, status: PaymentStatus, provider: string, site: string): string {
  return [
    `<b>${ETATS_PAIEMENT[status]} — ${e(order.orderNumber)}</b>`,
    `${formatCents(order.totalCents)} · ${client(order)} · via ${e(provider)}`,
    "",
    lienCommande(order, site),
  ].join("\n");
}

export function amountMismatchMessage(
  order: OrderRecord,
  attendu: string,
  recu: string,
  provider: string,
  site: string,
): string {
  return [
    `⚠️ <b>Paiement à vérifier — ${e(order.orderNumber)}</b>`,
    `Montant reçu différent du total : attendu ${e(attendu)}, reçu ${e(recu)} (via ${e(provider)}).`,
    "La commande reste en attente.",
    "",
    lienCommande(order, site),
  ].join("\n");
}

export function newCustomerMessage(customer: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  locale: string;
}): string {
  return [
    "👤 <b>Nouveau compte client</b>",
    `${e(`${customer.firstName} ${customer.lastName}`.trim())} · ${langue(customer.locale)}`,
    `✉️ ${e(customer.email)}`,
    customer.phone ? `📞 ${e(customer.phone)}` : null,
  ]
    .filter((ligne) => ligne !== null)
    .join("\n");
}

export function newReviewMessage(
  review: { productName: string; rating: number; authorName: string; city?: string; title?: string; body: string },
  site: string,
): string {
  const etoiles = "★".repeat(review.rating) + "☆".repeat(Math.max(0, 5 - review.rating));
  return [
    `⭐ <b>Avis à modérer</b> — ${e(review.productName)}`,
    `${etoiles} · ${e(review.authorName)}${review.city ? `, ${e(review.city)}` : ""}`,
    review.title ? `<b>${e(review.title)}</b>` : null,
    e(review.body),
    "",
    `${site}/admin/reviews`,
  ]
    .filter((ligne) => ligne !== null)
    .join("\n");
}

export interface ContactRequest {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  /** Page depuis laquelle le message a été envoyé. */
  page: string;
  locale: string;
}

export function contactMessage(request: ContactRequest, site: string): string {
  return [
    `💬 <b>Nouveau message</b>${request.subject ? ` — ${e(request.subject)}` : ""}`,
    `👤 ${e(request.name)} · ${langue(request.locale)}`,
    `✉️ ${e(request.email)}`,
    request.phone ? `📞 ${e(request.phone)}` : null,
    "",
    e(request.message),
    "",
    request.page ? `Envoyé depuis ${site}${e(request.page)}` : null,
  ]
    .filter((ligne) => ligne !== null)
    .join("\n");
}
