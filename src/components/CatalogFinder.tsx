"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { PRICE_RANGES, selectionHref } from "@/lib/catalogSelection";
import { cn } from "@/lib/utils";

export interface FinderCategory {
  slug: string;
  href: string;
}

/**
 * Sélecteur de l'en-tête, à la place du champ de recherche.
 *
 * Un champ libre suppose que l'acheteur sache quoi taper. Ici il ne le sait
 * pas : il vient avec un cheval, un budget et une voiture, pas avec un nom de
 * modèle. « Cheval Liberté Touring Jumping » ne se devine pas, et une recherche
 * sur « remolque » ramène tout le catalogue. Deux questions fermées valent
 * mieux qu'un champ vide.
 *
 * Les deux questions mènent à la même page de sélection (/recherche), qui
 * réunit le neuf et l'occasion du moins cher au plus cher : un acheteur qui
 * vient avec un budget ne fait pas la différence entre les deux rayons, et
 * l'occasion porte l'essentiel des modèles abordables.
 *
 * Le choix des places navigue aussitôt, budget compris s'il est coché. Le
 * budget seul se valide par son propre bouton, qui n'apparaît qu'une fois une
 * tranche choisie : sans lui, cocher un budget ne produisait rien de visible.
 */
export function CatalogFinder({ categories }: { categories: FinderCategory[] }) {
  const t = useTranslations("header");
  const common = useTranslations("common");
  const rangeLabels = useTranslations("category.priceRanges");
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [presupuesto, setPresupuesto] = useState<string | null>(null);
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  // Même fermeture que le menu des rayons : clic à l'extérieur ou Échap. On ne
  // reprend pas `useDismissable`, qui bloque le défilement de la page : cette
  // mesure vise les panneaux couvrant tout l'écran, et ici elle figerait
  // l'accueil derrière une liste haute de deux rangées de boutons.
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (categories.length === 0) return null;

  // Le budget voyage en paramètre d'adresse : la page de sélection filtre sur
  // lui et coche la tranche correspondante dans ses propres filtres.
  const irA = (plazas?: string) => {
    setOpen(false);
    router.push(selectionHref({ plazas, precio: presupuesto ?? undefined }));
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((estaba) => !estaba)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex h-10 w-full items-center gap-2 rounded-md border border-border bg-white px-3.5 text-sm text-muted-foreground transition-colors hover:border-primary/50"
      >
        <SlidersHorizontal className="h-4 w-4 shrink-0 text-primary" aria-hidden />
        <span className="flex-1 text-left">{t("finderLabel")}</span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open && (
        <div
          id={panelId}
          className="absolute left-0 right-0 top-full z-50 mt-2 rounded-md border border-border bg-white p-4 shadow-lg"
        >
          {/* Le budget d'abord dans le balisage, parce qu'il ne navigue pas :
              on le coche, puis on choisit les places, et le choix part avec. */}
          <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-wide text-muted-foreground">
            {t("finderPresupuesto")}
          </p>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {PRICE_RANGES.map((range) => {
              const activo = presupuesto === range.id;
              return (
                <button
                  key={range.id}
                  type="button"
                  aria-pressed={activo}
                  onClick={() => setPresupuesto(activo ? null : range.id)}
                  className={cn(
                    "rounded-sm border px-2.5 py-1.5 text-xs font-semibold transition-colors",
                    activo
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground hover:border-primary/50 hover:bg-muted",
                  )}
                >
                  {rangeLabels(range.id)}
                </button>
              );
            })}
          </div>
          {presupuesto && (
            <button
              type="button"
              onClick={() => irA()}
              className="mb-4 w-full rounded-sm bg-primary px-3 py-2 text-sm font-bold text-primary-foreground transition-[filter] hover:brightness-110"
            >
              {t("finderVerPresupuesto")}
            </button>
          )}

          <p className="mb-2 text-[0.7rem] font-bold uppercase tracking-wide text-muted-foreground">
            {t("finderPlazas")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((categoria) => (
              <button
                key={categoria.slug}
                type="button"
                onClick={() => irA(categoria.slug)}
                className="rounded-sm border border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                {common(`categoryNames.${categoria.slug}`)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
