import { BRAND } from "@/config/brand";
import { cn } from "@/lib/utils";
import logo from "./logo.json";

/**
 * Marque de la boutique.
 *
 * Le symbole est un « E » dont la boucle haute devient une tête de cheval et la
 * boucle basse un chemin. Les tracés de logo.json sont vectorisés depuis le
 * fichier validé par le client (assets/marque/image.png) : symbole et nom sont
 * des formes, pas du texte, et ne dépendent donc d'aucune police chargée.
 * scripts/generer-logos.mjs en tire les versions bitmap des e-mails et de
 * l'icône d'application, à partir des mêmes données.
 */

interface LogoProps {
  /** "light" sur fond sombre (pied de page, back-office), "dark" sur fond clair. */
  tone?: "light" | "dark";
  className?: string;
  /** Conservé pour la compatibilité des appels : un SVG en ligne n'a rien à précharger. */
  priority?: boolean;
}

export function Logo({ tone = "light", className }: LogoProps) {
  // Le symbole garde sa couleur dans les deux tons ; seul le nom passe en blanc
  // sur fond sombre.
  const couleurNom = tone === "light" ? "#ffffff" : logo.colors.tinta;

  return (
    <svg
      viewBox={`0 0 ${logo.width} ${logo.height}`}
      role="img"
      aria-label={BRAND.name}
      className={cn("h-8 w-auto sm:h-11", className)}
    >
      <path d={logo.symbol} fill={logo.colors.terracota} fillRule="evenodd" />
      <path d={logo.wordmark} fill={couleurNom} fillRule="evenodd" />
    </svg>
  );
}

/** Sigle seul (icône d'application), pour les espaces trop étroits pour le logo complet. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${logo.icon.size} ${logo.icon.size}`}
      aria-hidden="true"
      className={cn("h-9 w-9", className)}
    >
      <rect width={logo.icon.size} height={logo.icon.size} rx={logo.icon.radius} fill={logo.colors.terracota} />
      <path d={logo.symbol} transform={logo.icon.transform} fill="#ffffff" fillRule="evenodd" />
    </svg>
  );
}
