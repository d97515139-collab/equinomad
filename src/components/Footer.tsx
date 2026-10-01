import { getLocale, getTranslations } from "next-intl/server";
import { CreditCard, Mail, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/Logo";
import { COMPANY, isLegalLocale } from "@/content/legal";
import { companyWhatsappDigits } from "@/config/company";

/**
 * Le numéro publié est une ligne WhatsApp, pas un standard : le lien ouvre
 * donc wa.me et non `tel:`. Un `tel:` sur une ligne qui ne décroche pas
 * dépense le seul geste que le visiteur était prêt à faire.
 */
const WHATSAPP_DIGITS = companyWhatsappDigits();
import { getLegalFooterGroups } from "@/server/legalPages";

export async function Footer() {
  const t = await getTranslations("footer");
  const locale = await getLocale();
  // Les libellés sont les titres des pages : renommer une page depuis
  // l'administration renomme aussi son lien ici.
  const footerGroups = await getLegalFooterGroups(isLegalLocale(locale) ? locale : "es");

  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="mx-auto max-w-screen-xl px-3 py-8">
        <div className="mb-8 grid grid-cols-1 gap-6 border-b border-white/10 pb-8 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <Truck className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm font-bold">{t("deliveryTitle")}</p>
              <p className="text-xs text-white/60">{t("deliveryDetail")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm font-bold">{t("warrantyTitle")}</p>
              <p className="text-xs text-white/60">{t("warrantyDetail")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm font-bold">{t("paymentTitle")}</p>
              <p className="text-xs text-white/60">{t("paymentDetail")}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              aria-label={t("homeAriaLabel")}
              className="mb-4 inline-flex rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <Logo tone="light" />
            </Link>
            <h3 className="mb-3 font-bold">{t("contact")}</h3>
            <p className="mb-2 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <Link href="/contact" className="hover:underline">
                {COMPANY.email}
              </Link>
            </p>
            {WHATSAPP_DIGITS ? (
              <>
                <p className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  {/* Adresse externe : hors routage multilingue. Nouvel onglet et
                      `noopener`, wa.me passant la main au navigateur ou à
                      l’application. */}
                  <a
                    href={`https://wa.me/${WHATSAPP_DIGITS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="messwert hover:underline"
                  >
                    {COMPANY.phone}
                  </a>
                </p>
                {/* La ligne ne prend pas d’appel : le dire ici évite l’appel sans
                    déception qui va avec, et le message qui n’est jamais écrit. */}
                <p className="mt-1 text-xs text-white/55">{t("whatsappOnly")}</p>
              </>
            ) : null}
            <p className="mt-4 text-xs leading-relaxed text-white/55">{t("oeffnung")}</p>
          </div>

          {/* Colonnes issues du contenu légal : libellés et pages restent
              toujours synchronisés, dans les deux langues. */}
          {footerGroups.map((group) => (
            <div key={group.id}>
              <h3 className="mb-3 font-bold">{group.title}</h3>
              <ul className="space-y-1">
                {group.links.map((link) => (
                  <li key={link.slug}>
                    {/* href sans préfixe : Link ajoute lui-même la langue */}
                    <Link href={`/${link.slug}`} className="hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Le pied de page s’arrête aux colonnes. Le bandeau des moyens de
            paiement a été retiré : les logos revenaient une deuxième fois après
            le repère « Formas de pago seguras » qui ouvre déjà ce pied de page,
            et la caisse les affiche là où ils pèsent sur la décision.

            La mention de droits d’auteur qui fermait la colonne a été retirée
            elle aussi : une année seule datait le site comme une ouverture
            récente, et la faire remonter plus haut aurait été une allégation
            fausse sur l’ancienneté de la maison. La mention n’a par ailleurs
            plus d’effet juridique depuis la Convention de Berne — la protection
            naît de la création, pas de son affichage. */}
      </div>
    </footer>
  );
}
