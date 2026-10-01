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
  // Pas de redirection d'après la langue du navigateur : « / » sert toujours
  // l'espagnol. Sinon un robot d'indexation anglophone serait renvoyé vers /en
  // et la version espagnole, celle qui porte le référencement, ne serait plus
  // explorée. Le changement de langue reste un choix explicite du visiteur.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  es: "Español",
  en: "English",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
};
