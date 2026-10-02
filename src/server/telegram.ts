/**
 * Alertes Telegram de l'exploitant : chaque commande, paiement, message de
 * contact, nouveau compte ou avis arrive en temps réel sur son téléphone, sans
 * ouvrir le back-office.
 *
 * Configuration (variables d'environnement) :
 *   TELEGRAM_BOT_TOKEN  jeton du bot, fourni par @BotFather
 *   TELEGRAM_CHAT_ID    un ou plusieurs destinataires séparés par des virgules
 *                       (personne ou groupe ; `npm run telegram -- ids` les liste)
 *
 * Sans ces variables, rien n'est envoyé. Un envoi ne lève jamais : une alerte
 * perdue ne doit pas faire échouer une commande.
 */

type Env = Readonly<Record<string, string | undefined>>;

export interface TelegramConfig {
  token: string;
  chatIds: string[];
}

export function telegramConfig(env: Env = process.env): TelegramConfig | null {
  const token = env.TELEGRAM_BOT_TOKEN?.trim();
  const chatIds = (env.TELEGRAM_CHAT_ID ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  return token && chatIds.length > 0 ? { token, chatIds } : null;
}

/** Échappe un texte libre pour le mode HTML de Telegram. */
export function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Limite imposée par Telegram à un message. */
const LONGUEUR_MAX = 4096;

interface SendOptions {
  env?: Env;
  fetch?: (url: string | URL | Request, init?: RequestInit) => Promise<Response>;
}

/** Envoie un message HTML à chaque destinataire configuré. */
export async function sendTelegram(
  html: string,
  { env = process.env, fetch: envoyer = fetch }: SendOptions = {},
): Promise<{ sent: number; failed: number }> {
  const config = telegramConfig(env);
  if (!config) return { sent: 0, failed: 0 };

  const text = html.length > LONGUEUR_MAX ? `${html.slice(0, LONGUEUR_MAX - 1)}…` : html;
  const resultats = await Promise.all(
    config.chatIds.map(async (chatId) => {
      try {
        const reponse = await envoyer(`https://api.telegram.org/bot${config.token}/sendMessage`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
          signal: AbortSignal.timeout(8_000),
        });
        if (!reponse.ok) {
          console.error(`[telegram] envoi refusé vers ${chatId} : HTTP ${reponse.status}`);
          return false;
        }
        return true;
      } catch (error) {
        console.error(`[telegram] envoi impossible vers ${chatId} :`, error instanceof Error ? error.message : error);
        return false;
      }
    }),
  );
  const sent = resultats.filter(Boolean).length;
  return { sent, failed: resultats.length - sent };
}
