import { BRAND } from "@/config/brand";
import { cn } from "@/lib/utils";

/**
 * Marque de la boutique — version provisoire.
 *
 * En attendant le logo définitif (sous-projet design), la marque est le nom
 * « Equinomad » composé en Fraunces, précédé d'un sigle : l'initiale E en blanc
 * sur un carré rouge. Le tracé est en SVG : net à toutes les tailles, sans
 * fichier à charger. Les versions bitmap des e-mails sortent de
 * scripts/generer-logos.mjs, qui reproduit ce dessin.
 */

interface LogoProps {
  /** "light" sur fond sombre (pied de page, back-office), "dark" sur fond clair. */
  tone?: "light" | "dark";
  className?: string;
  /** Conservé pour la compatibilité des appels : un SVG en ligne n'a rien à précharger. */
  priority?: boolean;
}

export function Logo({ tone = "light", className }: LogoProps) {
  const claro = tone === "light";

  return (
    <svg
      viewBox="0 0 300 64"
      role="img"
      aria-label={BRAND.name}
      className={cn("h-8 w-auto sm:h-11", className)}
    >
      <rect x="0" y="4" width="56" height="56" rx="12" className="fill-[var(--rojo)]" />
      <text
        x="28"
        y="46"
        textAnchor="middle"
        className="fill-white font-[family-name:var(--font-fraunces)] text-[38px] font-bold"
      >
        E
      </text>
      <text
        x="70"
        y="45"
        className={cn(
          "font-[family-name:var(--font-fraunces)] text-[34px] font-bold tracking-tight",
          claro ? "fill-white" : "fill-[var(--tinta)]",
        )}
      >
        {BRAND.name}
      </text>
    </svg>
  );
}

/** Sigle seul, pour les espaces trop étroits pour le logo complet. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={cn("h-9 w-9", className)}>
      <rect x="0" y="0" width="64" height="64" rx="14" className="fill-[var(--rojo)]" />
      <text
        x="32"
        y="45"
        textAnchor="middle"
        className="fill-white font-[family-name:var(--font-fraunces)] text-[40px] font-bold"
      >
        E
      </text>
    </svg>
  );
}
