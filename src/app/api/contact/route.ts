import { NextResponse, after } from "next/server";
import { publicSiteUrl } from "@/config/brand";
import { sendMail } from "@/lib/mailer";
import { parseContactPayload } from "@/server/contactInput";
import { contactMessageRate } from "@/server/customerRate";
import { isMailDevFallback, sellerRecipients } from "@/server/orderNotifications";
import { sendTelegram } from "@/server/telegram";
import { contactMessage, type ContactRequest } from "@/server/telegramMessages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Formulaire de contact de la boutique. Le message part sur Telegram (alerte
 * immédiate) et par e-mail à la boutique, avec l'adresse du visiteur en
 * réponse : « Répondre » dans la messagerie lui écrit directement.
 */
export async function POST(request: Request) {
  const parsed = parseContactPayload(await request.json().catch(() => null));
  if (!parsed.ok) {
    // Un robot pris au piège reçoit la même réponse qu'un envoi réussi.
    return parsed.code === "spam"
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnue";
  const rate = contactMessageRate.check(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }
  contactMessageRate.register(ip);

  const demande = parsed.value;
  after(() => sendTelegram(contactMessage(demande, publicSiteUrl())));
  after(() => envoyerParEmail(demande));
  return NextResponse.json({ ok: true });
}

function echapper(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Copie du message dans la boîte de la boutique. Ne lève jamais. */
async function envoyerParEmail(demande: ContactRequest): Promise<void> {
  if (isMailDevFallback()) return;
  const lignes = [
    `Nombre: ${demande.name}`,
    `Correo: ${demande.email}`,
    demande.phone ? `Teléfono: ${demande.phone}` : "",
    `Idioma: ${demande.locale}`,
    demande.page ? `Página: ${publicSiteUrl()}${demande.page}` : "",
    "",
    demande.message,
  ].filter((ligne, i, tout) => ligne !== "" || tout[i - 1] !== "");
  const texte = lignes.join("\n");
  try {
    for (const to of await sellerRecipients()) {
      await sendMail({
        to,
        replyTo: demande.email,
        subject: `Mensaje de ${demande.name}${demande.subject ? ` — ${demande.subject}` : ""}`,
        text: texte,
        html: `<pre style="font-family:Arial,Helvetica,sans-serif;font-size:14px;white-space:pre-wrap">${echapper(texte)}</pre>`,
      });
    }
  } catch (error) {
    console.error("[contact] copie e-mail impossible :", error instanceof Error ? error.message : error);
  }
}
