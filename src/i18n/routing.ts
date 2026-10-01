import { defineRouting } from "next-intl/routing";

// L'espagnol reste à la racine (/), les autres langues vivent sous leur
// préfixe dédié :
// la boutique s'adresse au marché espagnol, c'est donc l'espagnol qui porte
// les URL courtes et le référencement. L'anglais sert les acheteurs
// transfrontaliers — le marché de la remorque à chevaux est européen, les
// annonces circulent entre l'Espagne, la France, l'Allemagne et le Benelux.
export const routing = defineRouting({
  locales: ["es", "en", "fr", "de", "it"],
  defaultLocale: "es",
  localePrefix: "as-needed",
  // Le visiteur arrive dans sa langue : cookie de son dernier choix, puis
  // langue du navigateur, puis pays (src/i18n/localeDetection.ts). Les robots
  // d'indexation en sont exclus dans src/proxy.ts : « / » leur sert toujours
  // l'espagnol, la version qui porte le référencement.
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  es: "Español",
  en: "English",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
};
