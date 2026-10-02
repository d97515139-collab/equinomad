/**
 * Textes des moyens de paiement dans la langue du visiteur.
 *
 * Les moyens viennent du back-office, où ils sont saisis en espagnol : c'est la
 * version que l'exploitant modifie, et elle reste affichée telle quelle en
 * espagnol. Dans les autres langues, un moyen connu (clé « tarjeta »,
 * « paypal »…) prend la traduction des fichiers de messages ; un moyen créé
 * plus tard, inconnu de ces fichiers, garde son texte d'origine.
 */

export interface PaymentMethodTexts {
  label: string;
  description: string;
  fee: string;
}

interface PaymentMethodLike {
  key: string;
  label: string;
  description: string;
  feeLabel: string;
}

export function localizePaymentMethod<T extends PaymentMethodLike>(
  method: T,
  locale: string,
  texts: PaymentMethodTexts | undefined,
): T {
  if (locale === "es" || !texts) return method;
  return { ...method, label: texts.label, description: texts.description, feeLabel: texts.fee };
}

export interface PaymentFaqPhrases {
  /** Phrase d'ouverture, avec le paramètre {moyens}. */
  intro: string;
  /** Conjonction entre les deux derniers moyens. */
  et: string;
  /** Conseil sur le virement, ajouté seulement s'il est actif. */
  virement: string;
  /** Mention du financement, ajoutée seulement s'il est actif. */
  financement: string;
}

/**
 * Réponse de la FAQ « Comment payer ? », composée à partir des seuls moyens
 * actifs : elle ne peut pas annoncer un moyen que le client ne trouvera pas au
 * moment de payer. Rend null si aucun moyen n'est actif.
 */
export function paymentFaqAnswer(
  labels: readonly string[],
  actifs: { transferencia: boolean; financiacion: boolean },
  phrases: PaymentFaqPhrases,
): string | null {
  if (labels.length === 0) return null;
  const liste =
    labels.length === 1 ? labels[0] : `${labels.slice(0, -1).join(", ")} ${phrases.et} ${labels[labels.length - 1]}`;
  return [
    phrases.intro.replace("{moyens}", liste),
    actifs.transferencia ? phrases.virement : null,
    actifs.financiacion ? phrases.financement : null,
  ]
    .filter(Boolean)
    .join(" ");
}
