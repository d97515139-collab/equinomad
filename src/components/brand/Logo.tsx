import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Marque de la boutique.
 *
 * Le logo est un fichier fourni par le client, pas un tracé reconstruit ici :
 * son lettrage a sa propre graisse et son propre chasse, qu'aucune police du
 * projet ne reproduit. Les déclinaisons sortent de scripts/preparer-logo.mjs,
 * qui part de public/marca/logo-origen.png et normalise les couleurs sur la
 * charte.
 *
 * Deux fichiers seulement, parce que deux suffisent : le lettrage est encre sur
 * fond clair, blanc sur fond sombre. La tête de cheval, elle, est un creux
 * transparent dans le chevron — elle prend donc la couleur du fond sur lequel
 * le logo est posé, sans qu'on ait à la traiter.
 */

interface LogoProps {
  /** "light" sur fond sombre (pied de page, back-office), "dark" sur fond clair. */
  tone?: "light" | "dark";
  className?: string;
  /** Charge l'image sans attendre : à passer dans l'en-tête, jamais ailleurs. */
  priority?: boolean;
}

/** Dimensions natives du fichier livré, pour que Next réserve la bonne place. */
const ANCHO = 1280;
const ALTO = 427;

export function Logo({ tone = "light", className, priority = false }: LogoProps) {
  const claro = tone === "light";

  return (
    <Image
      src={claro ? "/images/logo-full-light.png" : "/images/logo-full.png"}
      alt="Remolque Caballos"
      width={ANCHO}
      height={ALTO}
      priority={priority}
      className={cn("h-8 w-auto sm:h-11", className)}
    />
  );
}

/**
 * Sigle seul, sans le lettrage. Pour les espaces trop étroits pour le logo
 * complet — une pastille, une vignette, un en-tête réduit.
 *
 * Le symbole est identique dans les deux tons : son chevron est encre et sa
 * tête un creux transparent, ce qui le rend lisible aussi bien sur blanc que
 * sur une teinte claire. Sur fond franchement sombre, préférer le logo complet.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <Image
      src="/images/logo-icon.png"
      alt=""
      aria-hidden="true"
      width={416}
      height={416}
      className={cn("h-9 w-9", className)}
    />
  );
}
