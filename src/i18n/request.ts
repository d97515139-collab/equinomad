import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "@/i18n/routing";

/**
 * Fichier de messages d'une langue. Chaque langue du site a le sien
 * (src/messages/<langue>.json, mêmes clés que l'espagnol, vérifié par
 * messages.test.ts) ; une valeur inconnue retombe sur l'espagnol.
 */
export function messagesLocaleFor(locale: string): string {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`@/messages/${messagesLocaleFor(locale)}.json`)).default,
  };
});
