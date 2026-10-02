/**
 * Mise en service des alertes Telegram.
 *
 *   npm run telegram -- ids     # conversations qui ont écrit au bot, avec leur identifiant
 *   npm run telegram -- test    # envoie un message d'essai à TELEGRAM_CHAT_ID
 *
 * Procédure : créer le bot avec @BotFather, mettre son jeton dans
 * TELEGRAM_BOT_TOKEN, lui écrire « /start » depuis Telegram (ou l'ajouter à un
 * groupe et y écrire), lancer `ids`, puis reporter l'identifiant dans
 * TELEGRAM_CHAT_ID (plusieurs séparés par des virgules) et lancer `test`.
 */
try {
  process.loadEnvFile(".env.local");
} catch {
  // Variables déjà présentes dans l'environnement.
}

interface Update {
  message?: { chat: { id: number; type: string; title?: string; first_name?: string; last_name?: string; username?: string } };
  my_chat_member?: { chat: { id: number; type: string; title?: string } };
}

async function listerConversations(token: string): Promise<void> {
  const reponse = await fetch(`https://api.telegram.org/bot${token}/getUpdates`, { signal: AbortSignal.timeout(10_000) });
  const corps = (await reponse.json()) as { ok: boolean; result?: Update[]; description?: string };
  if (!corps.ok) throw new Error(`Telegram refuse le jeton : ${corps.description ?? reponse.status}`);
  const vues = new Map<number, string>();
  for (const u of corps.result ?? []) {
    const chat = u.message?.chat ?? u.my_chat_member?.chat;
    if (!chat) continue;
    const nom =
      "title" in chat && chat.title
        ? `groupe « ${chat.title} »`
        : [u.message?.chat.first_name, u.message?.chat.last_name].filter(Boolean).join(" ") || chat.type;
    vues.set(chat.id, nom);
  }
  if (vues.size === 0) {
    console.log("Aucune conversation : écrivez « /start » au bot depuis Telegram, puis relancez.");
    return;
  }
  for (const [id, nom] of vues) console.log(`${id}\t${nom}`);
}

async function main(): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN manque dans .env.local.");
  const action = process.argv[2];

  if (action === "ids") return listerConversations(token);
  if (action === "test") {
    const { sendTelegram } = await import("../src/server/telegram");
    const { BRAND } = await import("../src/config/brand");
    const r = await sendTelegram(`✅ <b>${BRAND.name}</b> — les alertes Telegram sont branchées.`);
    console.log(`Envoyés : ${r.sent}, échecs : ${r.failed}`);
    if (r.sent === 0) process.exitCode = 1;
    return;
  }
  console.log("Usage : npm run telegram -- ids | test");
}

main().catch((erreur: unknown) => {
  console.error(erreur instanceof Error ? erreur.message : erreur);
  process.exitCode = 1;
});
