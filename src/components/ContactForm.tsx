"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";

const INPUT_CLASSES =
  "w-full rounded-sm border border-border px-3 py-2 outline-none focus:border-primary";

/**
 * Formulaire de contact. Le message part sur le Telegram de l'exploitant et
 * dans la boîte de la boutique (src/app/api/contact/route.ts) : il est lu tout
 * de suite, là où un courriel attendait qu'on relève la boîte.
 *
 * Le champ `website` est un piège à robots : invisible et hors tabulation, un
 * visiteur ne le remplit jamais.
 */
export function ContactForm() {
  const t = useTranslations("contactForm");
  const locale = useLocale();
  const [etat, setEtat] = useState<"idle" | "pending" | "sent" | "error" | "rate">("idle");

  async function envoyer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const champs = new FormData(event.currentTarget);
    setEtat("pending");
    try {
      const reponse = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: champs.get("name"),
          email: champs.get("email"),
          phone: champs.get("phone"),
          message: champs.get("message"),
          website: champs.get("website"),
          page: window.location.pathname,
          locale,
        }),
      });
      setEtat(reponse.ok ? "sent" : reponse.status === 429 ? "rate" : "error");
    } catch {
      setEtat("error");
    }
  }

  if (etat === "sent") {
    return (
      <div id="formulario" role="status" className="rounded-sm border border-border bg-muted p-5">
        <p className="font-black text-foreground">{t("merciTitre")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("merciTexte")}</p>
      </div>
    );
  }

  return (
    <form id="formulario" onSubmit={envoyer} className="scroll-mt-32 rounded-sm border border-border bg-white p-5">
      <h2 className="mb-1 text-xl font-black text-foreground">{t("titre")}</h2>
      <p className="mb-4 text-sm text-muted-foreground">{t("intro")}</p>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-semibold text-foreground">{t("nom")}</span>
          <input name="name" required maxLength={120} autoComplete="name" className={INPUT_CLASSES} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-semibold text-foreground">{t("email")}</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" className={INPUT_CLASSES} />
        </label>
      </div>
      <label className="mb-4 block text-sm">
        <span className="mb-1 block font-semibold text-foreground">{t("telephone")}</span>
        <input name="phone" type="tel" maxLength={40} autoComplete="tel" className={INPUT_CLASSES} />
      </label>
      <label className="mb-4 block text-sm">
        <span className="mb-1 block font-semibold text-foreground">{t("message")}</span>
        <textarea name="message" required minLength={5} maxLength={5000} rows={5} className={INPUT_CLASSES} />
      </label>

      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {(etat === "error" || etat === "rate") && (
        <p role="alert" className="mb-3 text-sm font-semibold text-primary">
          {etat === "rate" ? t("tropDeMessages") : t("erreur")}
        </p>
      )}

      <button
        type="submit"
        disabled={etat === "pending"}
        className="rounded-sm bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:brightness-110 disabled:opacity-60"
      >
        {etat === "pending" ? t("envoi") : t("envoyer")}
      </button>
    </form>
  );
}
