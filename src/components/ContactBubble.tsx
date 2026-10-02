import { getLocale } from "next-intl/server";
import { companyWhatsappDigits } from "@/config/company";
import { ContactBubbleLauncher, type ContactBubbleLabels } from "@/components/ContactBubbleLauncher";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";

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
const WHATSAPP_NUMBER = companyWhatsappDigits();

const LIBELLES: Record<Locale, ContactBubbleLabels & { prefill: string }> = {
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
  },
  en: {
    ouvrir: "Contact us",
    fermer: "Close",
    whatsapp: "Message us on WhatsApp",
    email: "Send us an email",
    invitacion: "Any questions? Write to us",
    cerrarInvitacion: "Dismiss this message",
    prefill: "Hello, I have a question about a trailer.",
  },
  fr: {
    ouvrir: "Nous contacter",
    fermer: "Fermer",
    whatsapp: "Écrivez-nous sur WhatsApp",
    email: "Envoyez-nous un e-mail",
    invitacion: "Une question ? Écrivez-nous",
    cerrarInvitacion: "Fermer le message",
    prefill: "Bonjour, j'ai une question sur une remorque.",
  },
  de: {
    ouvrir: "Kontakt",
    fermer: "Schließen",
    whatsapp: "Schreiben Sie uns auf WhatsApp",
    email: "Senden Sie uns eine E-Mail",
    invitacion: "Haben Sie Fragen? Schreiben Sie uns",
    cerrarInvitacion: "Nachricht schließen",
    prefill: "Hallo, ich habe eine Frage zu einem Anhänger.",
  },
  it: {
    ouvrir: "Contattaci",
    fermer: "Chiudi",
    whatsapp: "Scriveteci su WhatsApp",
    email: "Inviateci un'e-mail",
    invitacion: "Ha qualche domanda? Ci scriva",
    cerrarInvitacion: "Chiudi il messaggio",
    prefill: "Buongiorno, ho una domanda su un rimorchio.",
  },
};

export async function ContactBubble() {
  const locale = await getLocale();
  const { prefill, ...labels } = LIBELLES[hasLocale(routing.locales, locale) ? locale : routing.defaultLocale];

  const whatsappHref = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(prefill)}`
    : null;
  // Le formulaire de la page Contact plutôt qu'un mailto: : le message arrive
  // aussitôt sur le Telegram de l'exploitant, et le visiteur sans messagerie
  // installée peut quand même écrire.
  const langue = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const emailHref = `${getPathname({ href: "/contact", locale: langue })}#formulario`;

  return (
    <ContactBubbleLauncher
      whatsappHref={whatsappHref}
      emailHref={emailHref}
      labels={labels}
    />
  );
}
