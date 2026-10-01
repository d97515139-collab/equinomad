"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, MessageCircle, X } from "lucide-react";

export type ContactBubbleLabels = {
  /** Libellé du bouton parent, fermé. */
  ouvrir: string;
  /** Libellé du bouton parent, ouvert. */
  fermer: string;
  whatsapp: string;
  email: string;
  /** Phrase d'accroche posée à gauche du bouton, au repos. */
  invitacion: string;
  /** Libellé accessible de la croix qui écarte l'accroche. */
  cerrarInvitacion: string;
};

/**
 * Marqueur de l'accroche écartée. `sessionStorage` et non `localStorage` :
 * l'invitation revient à la visite suivante — elle a encore une chance d'être
 * utile — mais ne réapparaît pas à chaque page de la visite en cours, ce qui
 * la ferait passer d'accueil à harcèlement.
 */
const CLAVE_INVITACION = "contacto-invitacion-descartada";

/** Délai avant l'apparition de l'accroche, en millisecondes. */
const RETARDO_INVITACION = 1200;

/**
 * Bulle de contact flottante, en bas à droite de la boutique.
 *
 * Un seul bouton visible au repos ; le clic déroule les deux canaux — WhatsApp
 * et courrier électronique — empilés au-dessus de lui. Le coin reste ainsi
 * occupé par un seul rond, quel que soit le nombre de canaux ajoutés ensuite.
 *
 * Le panneau replié est marqué `inert` : ses liens sortent du parcours de
 * tabulation et de l'arbre d'accessibilité, sans quoi la navigation au clavier
 * traverserait deux liens invisibles à chaque page.
 */
export function ContactBubbleLauncher({
  whatsappHref,
  emailHref,
  labels,
}: {
  whatsappHref: string | null;
  emailHref: string;
  labels: ContactBubbleLabels;
}) {
  const [ouvert, setOuvert] = useState(false);
  const [invitacionVisible, setInvitacionVisible] = useState(false);
  const [invitacionDescartada, setInvitacionDescartada] = useState(false);
  const racine = useRef<HTMLDivElement>(null);

  // L'accroche naît invisible et n'apparaît qu'après le montage, jamais au
  // rendu serveur : `sessionStorage` n'existe pas côté serveur, et le lire
  // pendant le rendu produirait un balisage différent de celui du client —
  // l'erreur d'hydratation classique. Le retard laisse en outre la page finir
  // de s'afficher avant qu'un élément ne bouge dans le coin de l'écran.
  //
  // Rien n'est posé dans l'état de façon synchrone ici : si l'accroche a déjà
  // été écartée, l'effet se contente de ne pas armer la minuterie. L'état de
  // départ est déjà le bon — invisible — et un `setState` immédiat ne ferait
  // que déclencher un second rendu pour arriver au même endroit.
  useEffect(() => {
    let descartada = false;
    try {
      descartada = sessionStorage.getItem(CLAVE_INVITACION) === "1";
    } catch {
      // Navigation privée ou stockage refusé : l'accroche s'affiche, sans
      // mémoire d'une page à l'autre. Mieux que pas d'accroche du tout.
    }

    if (descartada) return;

    const minuterie = setTimeout(() => setInvitacionVisible(true), RETARDO_INVITACION);
    return () => clearTimeout(minuterie);
  }, []);

  const descartarInvitacion = () => {
    setInvitacionVisible(false);
    setInvitacionDescartada(true);
    try {
      sessionStorage.setItem(CLAVE_INVITACION, "1");
    } catch {
      // Sans stockage, l'accroche reviendra à la page suivante : l'écarter
      // reste vrai pour la page en cours, ce qui est le geste demandé.
    }
  };

  // L'accroche s'efface dès que le panneau s'ouvre : elle invite à faire ce
  // que le visiteur est déjà en train de faire.
  const invitacionEnPantalla = invitacionVisible && !ouvert && !invitacionDescartada;

  // Fermeture au clic hors du widget et à la touche Échap : un panneau flottant
  // qui reste ouvert par-dessus le contenu gêne plus qu'il ne sert.
  useEffect(() => {
    if (!ouvert) return;

    const surClicExterieur = (evenement: PointerEvent) => {
      if (!racine.current?.contains(evenement.target as Node)) setOuvert(false);
    };
    const surTouche = (evenement: KeyboardEvent) => {
      if (evenement.key === "Escape") setOuvert(false);
    };

    document.addEventListener("pointerdown", surClicExterieur);
    document.addEventListener("keydown", surTouche);
    return () => {
      document.removeEventListener("pointerdown", surClicExterieur);
      document.removeEventListener("keydown", surTouche);
    };
  }, [ouvert]);

  const bulle =
    "flex items-center gap-3 rounded-full py-2 pr-2 pl-4 text-sm font-medium shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  return (
    <div ref={racine} className="fixed right-5 bottom-5 z-40 flex flex-col items-end gap-3">
      <div
        id="bulles-contact"
        inert={!ouvert}
        className={`flex flex-col items-end gap-3 transition-all duration-200 ${
          ouvert ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`${bulle} bg-white text-tinta`}
          >
            <span className="whitespace-nowrap">{labels.whatsapp}</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white">
              <svg viewBox="0 0 32 32" className="h-6 w-6" fill="currentColor" aria-hidden="true">
                <path d="M16.004 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.257.59 4.463 1.712 6.41L3.2 28.8l6.57-1.72a12.74 12.74 0 0 0 6.234 1.588h.005c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.332-6.635-3.75-9.053A12.72 12.72 0 0 0 16.004 3.2zm0 2.133c2.848 0 5.523 1.11 7.537 3.124a10.58 10.58 0 0 1 3.126 7.543c0 5.885-4.788 10.667-10.668 10.667h-.004a10.6 10.6 0 0 1-5.4-1.48l-.387-.23-4.003 1.05 1.068-3.903-.252-.4a10.57 10.57 0 0 1-1.62-5.637c0-5.885 4.787-10.667 10.667-10.667zm-5.83 5.74c-.276 0-.724.104-1.104.518-.38.414-1.45 1.417-1.45 3.457 0 2.04 1.485 4.01 1.692 4.287.207.276 2.92 4.46 7.078 6.253.99.427 1.762.682 2.365.873.993.316 1.897.271 2.612.164.797-.119 2.454-1.003 2.8-1.972.345-.97.345-1.8.242-1.972-.104-.173-.38-.276-.795-.483-.414-.207-2.454-1.212-2.834-1.35-.38-.14-.656-.207-.932.207-.276.414-1.07 1.35-1.312 1.627-.242.276-.483.31-.897.104-.414-.207-1.75-.645-3.332-2.057-1.232-1.099-2.064-2.456-2.306-2.87-.242-.414-.026-.638.181-.844.187-.186.414-.483.622-.725.207-.242.276-.414.414-.69.138-.276.07-.518-.035-.725-.104-.207-.913-2.257-1.283-3.086-.318-.712-.646-.73-.932-.742a13.9 13.9 0 0 0-.275-.005z" />
              </svg>
            </span>
          </a>
        )}

        <a href={emailHref} className={`${bulle} bg-white text-tinta`}>
          <span className="whitespace-nowrap">{labels.email}</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-tinta text-white">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </span>
        </a>
      </div>

      {/* Accroche et bouton sur la même ligne, l'accroche à gauche : c'est le
          sens de lecture, et le rond garde sa place au coin de l'écran quoi
          qu'il arrive à la phrase.

          Masquée sous 640 px : sur un téléphone, la phrase et le rond
          occuperaient toute la largeur au-dessus du contenu. Le bouton seul y
          suffit — il est déjà explicite. */}
      <div className="flex items-center gap-2">
        {!invitacionDescartada && (
          <div
            inert={!invitacionEnPantalla}
            className={`hidden items-center gap-1 rounded-full bg-white py-1.5 pr-1.5 pl-4 shadow-lg transition-all duration-300 sm:flex ${
              invitacionEnPantalla
                ? "translate-x-0 opacity-100"
                : "pointer-events-none translate-x-3 opacity-0"
            }`}
          >
            {/* La phrase est un bouton, pas un simple texte : cliquer une
                invitation à écrire doit ouvrir de quoi écrire. */}
            <button
              type="button"
              onClick={() => setOuvert(true)}
              className="cursor-pointer text-sm font-medium whitespace-nowrap text-tinta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {labels.invitacion}
            </button>

            <button
              type="button"
              onClick={descartarInvitacion}
              aria-label={labels.cerrarInvitacion}
              title={labels.cerrarInvitacion}
              className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-black/5 hover:text-tinta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setOuvert((etat) => !etat)}
          aria-expanded={ouvert}
          aria-controls="bulles-contact"
          aria-label={ouvert ? labels.fermer : labels.ouvrir}
          title={ouvert ? labels.fermer : labels.ouvrir}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {ouvert ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <MessageCircle className="h-7 w-7" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
