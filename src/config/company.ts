import { BRAND } from "./brand";

/**
 * Coordonnées de la société éditrice, source unique pour les pages légales, la
 * facture, le pied de page, la bulle de contact, le flux Merchant et les
 * e-mails. Elles ne dépendent pas de la base : ces mentions engagent la société
 * et ne se modifient pas depuis le back-office.
 *
 * Tant que le client n'a pas transmis ses coordonnées, les champs inconnus
 * portent le marqueur PENDING_MARK. `npm run check:launch` refuse la mise en
 * ligne tant qu'il en reste un.
 */
export const PENDING_MARK = "[A COMPLETAR";

function pending(what: string): string {
  return `${PENDING_MARK}: ${what}]`;
}

export const COMPANY = {
  name: pending("razón social"),
  /** Forme sociale. */
  legalForm: pending("forma jurídica"),
  /** Adresse du siège, reprise dans les pages légales, la facture et l'adresse de retour. */
  street: pending("dirección del domicilio social"),
  /** Le code postal ouvre la ligne, comme le veut l'usage espagnol. */
  city: pending("código postal y municipio"),
  country: "España",
  email: BRAND.email,
  /** Ligne WhatsApp publiée (messages uniquement). */
  phone: pending("teléfono o WhatsApp"),
  /** Administrateur — responsable éditorial au sens de la LSSI-CE. */
  managingDirector: pending("administrador"),
  /** Inscription au Registro Mercantil (art. 10 LSSI-CE). */
  register: pending("datos del Registro Mercantil"),
  /** Noms hérités du gabarit : siren = CIF, siret = code d'établissement du siège. */
  siren: pending("CIF"),
  siret: pending("código del establecimiento"),
  capital: pending("capital social"),
  /** Numéro de TVA intracommunautaire espagnol. */
  vatId: pending("NIF-IVA"),
  domain: BRAND.domain,
  /** Hébergeur, à nommer au titre de l'article 10 de la LSSI-CE. */
  host: pending("proveedor de alojamiento"),
} as const;

/** Champs qui portent encore le marqueur, dans l'ordre de déclaration. */
export function missingCompanyFields(
  company: Readonly<Record<string, string>> = COMPANY,
): string[] {
  return Object.entries(company)
    .filter(([, value]) => value.includes(PENDING_MARK))
    .map(([key]) => key);
}

/**
 * Pages légales stockées en base (LegalContent) qui portent encore le marqueur.
 * Elles priment sur le corpus du code : compléter COMPANY ne les corrige pas,
 * d'où leur contrôle séparé avant la mise en ligne.
 */
export function legalPagesWithPendingMark(
  pages: readonly { locale: string; slug: string; data: string }[],
): string[] {
  return pages.filter((page) => page.data.includes(PENDING_MARK)).map((page) => `${page.locale}/${page.slug}`);
}

/**
 * Chiffres du numéro WhatsApp, prêts pour wa.me. La variable
 * NEXT_PUBLIC_WHATSAPP_NUMBER prime ; un numéro encore à compléter donne une
 * chaîne vide, et l'interface masque alors le lien au lieu d'ouvrir « wa.me/ ».
 */
export function companyWhatsappDigits(): string {
  const override = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  if (override) return override;
  return COMPANY.phone.includes(PENDING_MARK) ? "" : COMPANY.phone.replace(/\D/g, "");
}
