import { getLocale } from "next-intl/server";
import { COMPANY } from "@/content/legal";
import { ContactBubbleLauncher, type ContactBubbleLabels } from "@/components/ContactBubbleLauncher";

/**
 * Bulle de contact flottante : WhatsApp et courrier électronique regroupés
 * derrière un seul bouton, en bas à droite de toutes les pages boutique.
 *
 * Le numéro WhatsApp par défaut est celui de la société (COMPANY.phone) ; il
 * peut être remplacé par une ligne dédiée via NEXT_PUBLIC_WHATSAPP_NUMBER
 * (chiffres uniquement, au format international, ex. « 34955000000 »). Sans
 * numéro exploitable, seule la bulle courriel est rendue.
 *
 * Les libellés sont résolus ici puis passés en propriété, comme pour
 * `SmartsuppChat` : quelques chaînes ne justifient pas d'élargir le
 * dictionnaire de traductions.
 */
const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || COMPANY.phone.replace(/\D/g, "");

const LIBELLES: Record<"es" | "en", ContactBubbleLabels & { prefill: string; sujet: string }> = {
  es: {
    ouvrir: "Contactar",
    fermer: "Cerrar",
    // « Escríbanos » et non « Escríbenos » : tout le reste de la boutique
    // s'adresse au visiteur de usted — « Elija », « Su cesta », « Llámenos ».
    // Le tutoiement d'origine détonnait sur un achat à cinq chiffres.
    whatsapp: "Escríbanos por WhatsApp",
    email: "Envíenos un correo",
    invitacion: "¿Tiene alguna pregunta? Escríbanos",
    cerrarInvitacion: "Cerrar el mensaje",
    prefill: "Hola, tengo una pregunta sobre un remolque.",
    sujet: "Consulta sobre un remolque",
  },
  en: {
    ouvrir: "Contact us",
    fermer: "Close",
    whatsapp: "Message us on WhatsApp",
    email: "Send us an email",
    invitacion: "Any questions? Write to us",
    cerrarInvitacion: "Dismiss this message",
    prefill: "Hello, I have a question about a trailer.",
    sujet: "Question about a trailer",
  },
};

export async function ContactBubble() {
  const locale = await getLocale();
  const { prefill, sujet, ...labels } = LIBELLES[locale === "en" ? "en" : "es"];

  const whatsappHref = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(prefill)}`
    : null;
  const emailHref = `mailto:${COMPANY.email}?subject=${encodeURIComponent(sujet)}`;

  return (
    <ContactBubbleLauncher
      whatsappHref={whatsappHref}
      emailHref={emailHref}
      labels={labels}
    />
  );
}
