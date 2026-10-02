/**
 * Contenu légal et informatif d'ORIGINE — celui qui est versionné avec le code.
 *
 * Ce module ne doit pas être lu directement par une page : depuis que
 * l'administration peut réécrire ces textes, la source de vérité est
 * `src/server/legalPages.ts`, qui interroge la base et retombe ici quand aucune
 * réécriture n'existe.
 *
 * Ce qui reste exporté ici est ce qui ne dépend pas de la base : la liste des
 * slugs, les gardes de type, la construction des adresses et la répartition des
 * liens en colonnes de pied de page.
 */

import { esLegalPages } from "./es";
import { enLegalPages } from "./en";
import type { LegalFooterGroup, LegalLocale, LegalPageMap, LegalSlug } from "./types";

/**
 * Identité de l'entreprise, source unique pour les mentions légales comme pour
 * la facture PDF. Elle ne dépend pas de la base : ces mentions engagent la
 * société et ne sont pas modifiables depuis le back-office.
 */
export { COMPANY } from "@/config/company";

export type {
  LegalFooterGroup,
  LegalFooterLink,
  LegalLocale,
  LegalPage,
  LegalPageMap,
  LegalSection,
  LegalSlug,
} from "./types";

/** Langue par défaut de la boutique (marché espagnol). */
export const DEFAULT_LEGAL_LOCALE: LegalLocale = "es";

/** Toutes les langues disponibles, utile pour `generateStaticParams`. */
export const LEGAL_LOCALES: readonly LegalLocale[] = ["es", "en"];

/** Tous les slugs, dans l'ordre d'affichage souhaité. */
export const LEGAL_SLUGS: readonly LegalSlug[] = [
  "mentions-legales",
  "cgv",
  "confidentialite",
  "retractation",
  "livraison",
  "moyens-de-paiement",
  "retours",
  "faq",
  "a-propos",
  "contact",
];

/** Titre affiché dans le back-office pour chaque page. */
export const LEGAL_SLUG_LABELS: Readonly<Record<LegalSlug, string>> = {
  "mentions-legales": "Aviso legal",
  cgv: "Condiciones generales de venta",
  confidentialite: "Política de privacidad",
  retractation: "Derecho de desistimiento",
  livraison: "Envíos y entregas",
  "moyens-de-paiement": "Formas de pago",
  retours: "Devoluciones y reclamaciones",
  faq: "Preguntas frecuentes",
  "a-propos": "Quiénes somos",
  contact: "Contacto",
};

/** Corpus d'origine, indexé par langue. */
export const ORIGIN_PAGES: Readonly<Record<LegalLocale, LegalPageMap>> = {
  es: esLegalPages,
  en: enLegalPages,
};

/** Vérifie qu'une chaîne quelconque correspond bien à un slug connu. */
export function isLegalSlug(value: string): value is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(value);
}

/** Vérifie qu'une chaîne quelconque correspond bien à une langue gérée. */
export function isLegalLocale(value: string): value is LegalLocale {
  return (LEGAL_LOCALES as readonly string[]).includes(value);
}

/**
 * Corpus juridique servi pour une langue de la boutique. Les langues sans
 * corpus propre (fr, de, it) reçoivent la version anglaise, comme le reste de
 * l'interface, en attendant les pages légales par pays.
 */
export function legalLocaleFor(locale: string): LegalLocale {
  return isLegalLocale(locale) ? locale : "en";
}

/**
 * Construit le chemin d'une page : `/aviso-legal` en espagnol,
 * `/en/aviso-legal` en anglais.
 */
export function getLegalHref(slug: LegalSlug, locale: LegalLocale = DEFAULT_LEGAL_LOCALE): string {
  return locale === DEFAULT_LEGAL_LOCALE ? `/${slug}` : `/${locale}/${slug}`;
}

/** Intitulés des colonnes du pied de page, par langue. */
export const FOOTER_GROUP_TITLES: Readonly<
  Record<LegalLocale, Readonly<Record<LegalFooterGroup["id"], string>>>
> = {
  es: { service: "Servicio", legal: "Información legal", company: "Empresa" },
  en: { service: "Service", legal: "Legal", company: "Company" },
};

/**
 * Libellés du pied de page pour les langues sans corpus juridique propre.
 * Les pages elles-mêmes s'affichent en anglais (legalLocaleFor) ; seule la
 * navigation est traduite, pour que le pied de page reste dans la langue du
 * reste de la boutique.
 */
const FOOTER_LABELS: Readonly<
  Record<string, { groups: Record<LegalFooterGroup["id"], string>; pages: Record<LegalSlug, string> }>
> = {
  fr: {
    groups: { service: "Service", legal: "Informations légales", company: "Entreprise" },
    pages: {
      "mentions-legales": "Mentions légales",
      cgv: "Conditions générales de vente",
      confidentialite: "Politique de confidentialité",
      retractation: "Droit de rétractation",
      livraison: "Livraison",
      "moyens-de-paiement": "Moyens de paiement",
      retours: "Retours et réclamations",
      faq: "Questions fréquentes",
      "a-propos": "Qui sommes-nous",
      contact: "Contact",
    },
  },
  de: {
    groups: { service: "Service", legal: "Rechtliches", company: "Unternehmen" },
    pages: {
      "mentions-legales": "Impressum",
      cgv: "Allgemeine Geschäftsbedingungen",
      confidentialite: "Datenschutzerklärung",
      retractation: "Widerrufsrecht",
      livraison: "Versand und Lieferung",
      "moyens-de-paiement": "Zahlungsarten",
      retours: "Rücksendungen und Reklamationen",
      faq: "Häufige Fragen",
      "a-propos": "Über uns",
      contact: "Kontakt",
    },
  },
  it: {
    groups: { service: "Servizio", legal: "Informazioni legali", company: "Azienda" },
    pages: {
      "mentions-legales": "Note legali",
      cgv: "Condizioni generali di vendita",
      confidentialite: "Informativa sulla privacy",
      retractation: "Diritto di recesso",
      livraison: "Spedizioni e consegne",
      "moyens-de-paiement": "Metodi di pagamento",
      retours: "Resi e reclami",
      faq: "Domande frequenti",
      "a-propos": "Chi siamo",
      contact: "Contatti",
    },
  },
};

/**
 * Traduit titres et libellés du pied de page pour fr, de et it. L'espagnol et
 * l'anglais gardent les titres de leurs pages, renommables depuis le back-office.
 */
export function localizeFooterGroups(
  groups: readonly LegalFooterGroup[],
  locale: string,
): readonly LegalFooterGroup[] {
  const labels = FOOTER_LABELS[locale];
  if (!labels) return groups;
  return groups.map((group) => ({
    ...group,
    title: labels.groups[group.id],
    links: group.links.map((link) => ({ ...link, label: labels.pages[link.slug] })),
  }));
}

/** Ordre des colonnes du pied de page. */
export const FOOTER_GROUP_IDS = ["service", "legal", "company"] as const;

/**
 * Répartition des slugs par colonne du pied de page.
 *
 * « retractation » n'y figure pas : la page existe toujours et reste servie à
 * son adresse, elle n'est simplement plus listée ici. Les liens qui y mènent
 * depuis le tunnel de commande et depuis le suivi de commande restent la voie
 * d'accès.
 */
export const FOOTER_GROUP_SLUGS: Readonly<Record<LegalFooterGroup["id"], readonly LegalSlug[]>> = {
  service: ["livraison", "moyens-de-paiement", "retours", "faq"],
  legal: ["mentions-legales", "cgv", "confidentialite"],
  company: ["a-propos", "contact"],
};

export { esLegalPages, enLegalPages };
