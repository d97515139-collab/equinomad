import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Drapeau d'une langue du site, en SVG.
 *
 * Pas d'emoji : Windows n'affiche pas les drapeaux emoji (il écrit « ES », « FR »
 * à leur place). Les SVG sont tracés ici plutôt que chargés d'un paquet : cinq
 * drapeaux simples, aucun fichier à télécharger, rendu net à toutes les tailles.
 *
 * Proportions communes 3:2 pour que la rangée s'aligne ; le drapeau britannique
 * (2:1) est recadré au centre, comme le font les sélecteurs de langue courants.
 * L'espagnol est le drapeau civil, sans les armoiries, illisibles à cette taille.
 */

const BANDES_VERTICALES = (couleurs: readonly [string, string, string]) => (
  <>
    <rect width="1" height="2" x="0" fill={couleurs[0]} />
    <rect width="1" height="2" x="1" fill={couleurs[1]} />
    <rect width="1" height="2" x="2" fill={couleurs[2]} />
  </>
);

function UnionJack() {
  // Identifiants uniques : plusieurs drapeaux sur une page ne doivent pas
  // partager leurs découpes.
  const id = useId().replace(/:/g, "");
  return (
    <>
      <clipPath id={`${id}-s`}>
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id={`${id}-t`}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath={`url(#${id}-s)`}>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#${id}-t)`} stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </>
  );
}

const DRAPEAUX: Readonly<Record<string, { viewBox: string; contenu: () => React.ReactNode }>> = {
  es: {
    viewBox: "0 0 3 2",
    contenu: () => (
      <>
        <rect width="3" height="2" fill="#AA151B" />
        <rect width="3" height="1" y="0.5" fill="#F1BF00" />
      </>
    ),
  },
  en: { viewBox: "0 0 60 30", contenu: () => <UnionJack /> },
  fr: { viewBox: "0 0 3 2", contenu: () => BANDES_VERTICALES(["#002654", "#FFFFFF", "#CE1126"]) },
  de: {
    viewBox: "0 0 3 2",
    contenu: () => (
      <>
        <rect width="3" height="2" fill="#000000" />
        <rect width="3" height="0.6667" y="0.6667" fill="#DD0000" />
        <rect width="3" height="0.6667" y="1.3333" fill="#FFCE00" />
      </>
    ),
  },
  it: { viewBox: "0 0 3 2", contenu: () => BANDES_VERTICALES(["#009246", "#FFFFFF", "#CE2B37"]) },
};

export function Flag({ locale, className }: { locale: string; className?: string }) {
  const drapeau = DRAPEAUX[locale];
  if (!drapeau) return null;
  return (
    <svg
      aria-hidden="true"
      viewBox={drapeau.viewBox}
      preserveAspectRatio="xMidYMid slice"
      className={cn("h-3 w-[18px] shrink-0 rounded-[2px] ring-1 ring-black/10", className)}
    >
      {drapeau.contenu()}
    </svg>
  );
}
