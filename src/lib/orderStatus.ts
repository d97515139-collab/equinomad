// Statuts de commande et de paiement.
//
// Ce module ne dépend ni de Prisma ni du serveur : les composants du
// back-office peuvent l'importer sans embarquer la couche base de données
// dans le bundle du navigateur. src/server/orders.ts le réexporte.
//
// Les valeurs sont stockées en texte (pas d'enum Prisma) pour que le schéma
// reste identique sous SQLite et sous PostgreSQL.

export const ORDER_STATUSES = [
  "eingegangen",
  "in_bearbeitung",
  "versandt",
  "zugestellt",
  "storniert",
] as const;

export const PAYMENT_STATUSES = ["offen", "bezahlt", "erstattet", "fehlgeschlagen"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

// `es` et `en` alimentent la boutique publique comme le back-office. La colonne
// `de` est celle des clés stockées en base : les valeurs elles-mêmes sont des
// mots allemands hérités du gabarit d'origine, jamais montrés au client, et on
// ne les renomme pas — ce sont des identifiants, pas du texte.
export const ORDER_STATUS_LABELS: Record<OrderStatus, { de: string; en: string; es: string }> = {
  eingegangen: { de: "Eingegangen", en: "Received", es: "Recibido" },
  in_bearbeitung: { de: "In Bearbeitung", en: "In progress", es: "En preparación" },
  versandt: { de: "Versandt", en: "Shipped", es: "Enviado" },
  zugestellt: { de: "Zugestellt", en: "Delivered", es: "Entregado" },
  storniert: { de: "Storniert", en: "Cancelled", es: "Anulado" },
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, { de: string; en: string; es: string }> = {
  offen: { de: "Offen", en: "Open", es: "Pendiente" },
  bezahlt: { de: "Bezahlt", en: "Paid", es: "Pagado" },
  erstattet: { de: "Erstattet", en: "Refunded", es: "Reembolsado" },
  fehlgeschlagen: { de: "Fehlgeschlagen", en: "Failed", es: "Fallido" },
};

/** Pastilles du back-office, dans le même esprit que celles des avis clients. */
export const ORDER_STATUS_BADGES: Record<OrderStatus, string> = {
  eingegangen: "bg-accent text-accent-foreground",
  in_bearbeitung: "bg-secondary text-secondary-foreground",
  versandt: "bg-[#16a34a] text-white",
  zugestellt: "bg-muted text-muted-foreground",
  storniert: "bg-destructive text-white",
};

export const PAYMENT_STATUS_BADGES: Record<PaymentStatus, string> = {
  offen: "bg-accent text-accent-foreground",
  bezahlt: "bg-[#16a34a] text-white",
  erstattet: "bg-muted text-muted-foreground",
  fehlgeschlagen: "bg-destructive text-white",
};

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && (ORDER_STATUSES as readonly string[]).includes(value);
}

export function isPaymentStatus(value: unknown): value is PaymentStatus {
  return typeof value === "string" && (PAYMENT_STATUSES as readonly string[]).includes(value);
}
