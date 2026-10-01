import { routing, type Locale } from "@/i18n/routing";

/**
 * Choix automatique de la langue à l'arrivée d'un visiteur.
 *
 * next-intl décide dans cet ordre : préfixe de l'URL, cookie NEXT_LOCALE (le
 * dernier choix fait dans le sélecteur), langue du navigateur, espagnol par
 * défaut. Ce module ajoute le pays du visiteur (en-tête de géolocalisation de
 * Vercel) quand le navigateur ne parle aucune langue du site : un navigateur
 * portugais ou norvégien tombe ainsi sur la langue la plus proche, et non
 * d'office sur l'espagnol.
 *
 * La langue du navigateur passe avant le pays : c'est celle que le visiteur
 * lit. Un Espagnol installé en France garde l'espagnol.
 */

/** Robots d'indexation et d'aperçu : jamais redirigés, ils voient l'URL demandée. */
const CRAWLER = /bot\b|bot\/|crawler|spider|slurp|facebookexternalhit|embedly|preview|lighthouse/i;

export function isCrawler(userAgent: string | null): boolean {
  return Boolean(userAgent && CRAWLER.test(userAgent));
}

/**
 * Pays → langue du site la plus proche. Les pays absents reçoivent l'anglais.
 * Le Portugal reçoit l'espagnol tant que le portugais n'existe pas ; la
 * Belgique le français et la Suisse l'allemand, langues majoritaires parmi
 * celles du site — le navigateur, consulté avant, corrige le cas contraire.
 */
const LANGUE_PAR_PAYS: Readonly<Record<string, Locale>> = {
  ES: "es",
  AD: "es",
  PT: "es",
  FR: "fr",
  BE: "fr",
  LU: "fr",
  MC: "fr",
  DE: "de",
  AT: "de",
  CH: "de",
  LI: "de",
  IT: "it",
  SM: "it",
  VA: "it",
};

export function localeForCountry(country: string | null): Locale | undefined {
  if (!country) return undefined;
  return LANGUE_PAR_PAYS[country.toUpperCase()] ?? "en";
}

/** Vrai si l'une des langues annoncées par le navigateur existe sur le site. */
export function browserLanguageSupported(acceptLanguage: string | null): boolean {
  if (!acceptLanguage) return false;
  const locales: readonly string[] = routing.locales;
  return acceptLanguage
    .split(",")
    .map((entree) => entree.split(";")[0].trim().split("-")[0].toLowerCase())
    .some((langue) => locales.includes(langue));
}

/**
 * Valeur à donner à l'en-tête Accept-Language avant la négociation de
 * next-intl, ou undefined pour laisser la requête intacte.
 */
export function acceptLanguageOverride(input: {
  acceptLanguage: string | null;
  country: string | null;
  hasLocaleCookie: boolean;
}): Locale | undefined {
  if (input.hasLocaleCookie || browserLanguageSupported(input.acceptLanguage)) return undefined;
  return localeForCountry(input.country);
}
