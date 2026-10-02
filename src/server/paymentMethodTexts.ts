import { getTranslations } from "next-intl/server";
import { localizePaymentMethod, type PaymentMethodTexts } from "@/lib/paymentMethodText";

/**
 * Traductions des moyens de paiement connus (messages « paymentMethods »),
 * pour une langue donnée. Rend une fonction qui localise un moyen ou un simple
 * libellé ; l'espagnol et les moyens inconnus gardent le texte du back-office.
 */
export async function paymentMethodLocalizer(locale: string) {
  const t = await getTranslations({ locale, namespace: "paymentMethods" });
  const textes = (key: string): PaymentMethodTexts | undefined =>
    t.has(`${key}.label`)
      ? { label: t(`${key}.label`), description: t(`${key}.description`), fee: t(`${key}.fee`) }
      : undefined;

  return {
    method<T extends { key: string; label: string; description: string; feeLabel: string }>(method: T): T {
      return localizePaymentMethod(method, locale, textes(method.key));
    },
    /** Libellé d'un moyen enregistré sur une commande (clé + libellé d'origine). */
    label(key: string, label: string): string {
      return localizePaymentMethod({ key, label, description: "", feeLabel: "" }, locale, textes(key)).label;
    },
  };
}
