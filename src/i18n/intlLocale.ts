import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";

/** Variante régionale utilisée pour formater dates et nombres de chaque langue. */
const REGIONS: Record<Locale, string> = {
  es: "es-ES",
  en: "en-GB",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
};

export function intlLocale(locale: string): string {
  return REGIONS[hasLocale(routing.locales, locale) ? locale : routing.defaultLocale];
}
