import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import type { ContactRequest } from "@/server/telegramMessages";

/**
 * Validation du formulaire de contact. Le champ `website` est un piège : caché
 * aux visiteurs, seul un robot le remplit. Il est refusé avec un code distinct
 * pour que la route réponde « envoyé » sans rien transmettre.
 */
export type ContactParse = { ok: true; value: ContactRequest } | { ok: false; code: "invalid" | "spam" };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function texte(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length <= max ? trimmed : null;
}

export function parseContactPayload(payload: unknown): ContactParse {
  if (!payload || typeof payload !== "object") return { ok: false, code: "invalid" };
  const body = payload as Record<string, unknown>;

  if (typeof body.website === "string" && body.website.trim() !== "") return { ok: false, code: "spam" };

  const name = texte(body.name, 120);
  const email = texte(body.email, 200)?.toLowerCase() ?? null;
  const phone = texte(body.phone ?? "", 40);
  const subject = texte(body.subject ?? "", 160);
  const message = texte(body.message, 5000);
  if (!name || !email || !EMAIL.test(email) || phone === null || subject === null || !message || message.length < 5) {
    return { ok: false, code: "invalid" };
  }

  // Chemin interne seulement : une adresse externe n'a rien à faire dans l'alerte.
  const page = typeof body.page === "string" && /^\/[^\s]{0,300}$/.test(body.page) && !body.page.startsWith("//") ? body.page : "";
  const locale = typeof body.locale === "string" && hasLocale(routing.locales, body.locale) ? body.locale : routing.defaultLocale;

  return { ok: true, value: { name, email, phone, subject, message, page, locale } };
}
