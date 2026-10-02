import { test } from "node:test";
import assert from "node:assert/strict";
import { escapeHtml, sendTelegram, telegramConfig } from "./telegram";

test("sans jeton ou sans destinataire, Telegram est désactivé", () => {
  assert.equal(telegramConfig({}), null);
  assert.equal(telegramConfig({ TELEGRAM_BOT_TOKEN: "123:abc" }), null);
  assert.deepEqual(telegramConfig({ TELEGRAM_BOT_TOKEN: "123:abc", TELEGRAM_CHAT_ID: "111, -100222 ,," }), {
    token: "123:abc",
    chatIds: ["111", "-100222"],
  });
});

test("le texte libre est échappé pour le mode HTML de Telegram", () => {
  assert.equal(escapeHtml(`<b>"Tom" & Jerry</b>`), "&lt;b&gt;\"Tom\" &amp; Jerry&lt;/b&gt;");
});

test("un message part vers chaque destinataire, et un échec n'empêche pas les autres", async () => {
  const appels: { url: string; corps: Record<string, unknown> }[] = [];
  const fauxFetch = async (url: string | URL | Request, init?: RequestInit) => {
    const corps = JSON.parse(String(init?.body)) as Record<string, unknown>;
    appels.push({ url: String(url), corps });
    return new Response(JSON.stringify({ ok: corps.chat_id !== "222" }), { status: corps.chat_id === "222" ? 400 : 200 });
  };
  const resultat = await sendTelegram("Bonjour", {
    env: { TELEGRAM_BOT_TOKEN: "123:abc", TELEGRAM_CHAT_ID: "111,222" },
    fetch: fauxFetch,
  });
  assert.deepEqual(resultat, { sent: 1, failed: 1 });
  assert.equal(appels[0].url, "https://api.telegram.org/bot123:abc/sendMessage");
  assert.deepEqual(appels[0].corps, { chat_id: "111", text: "Bonjour", parse_mode: "HTML", disable_web_page_preview: true });
});

test("une erreur réseau ne lève jamais et un message trop long est tronqué", async () => {
  let longueur = 0;
  const resultat = await sendTelegram("x".repeat(5000), {
    env: { TELEGRAM_BOT_TOKEN: "t", TELEGRAM_CHAT_ID: "1,2" },
    fetch: async (_url: string | URL | Request, init?: RequestInit) => {
      longueur = String((JSON.parse(String(init?.body)) as { text: string }).text).length;
      throw new Error("réseau coupé");
    },
  });
  assert.deepEqual(resultat, { sent: 0, failed: 2 });
  assert.ok(longueur <= 4096);
});

test("sans configuration, rien n'est envoyé", async () => {
  assert.deepEqual(await sendTelegram("x", { env: {}, fetch: async () => { throw new Error("ne doit pas être appelé"); } }), { sent: 0, failed: 0 });
});
