"use client";

import { useLocale, useTranslations } from "next-intl";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

// L'identifiant "id" est stable et sert d'état ; seul le libellé est traduit,
// via "category.priceRanges.<id>".
export interface PriceRange {
  id: string;
  min: number;
  max: number;
}

// Bornes calées sur le catalogue réel : de la sangle d'amarrage à 34 € au van
// quatre places à 33 900 €. Elles ont longtemps porté celles de la boutique de
// bois dont ce socle est issu — 0 à 100 €, puis 100 à 300 — pendant que les
// libellés traduits annonçaient des milliers d'euros. Choisir « 5 000 – 10 000 »
// filtrait donc entre 300 et 600 € et ne renvoyait jamais rien : un filtre
// muet, qu'aucune relecture des traductions n'aurait démasqué puisque le
// défaut vivait dans le code.
//
// Les tranches se touchent sans laisser de trou : tout produit tombe dans une
// et une seule, quel que soit son prix.
export const PRICE_RANGES: PriceRange[] = [
  { id: "hasta500", min: 0, max: 500 },
  { id: "de500a8000", min: 500, max: 8000 },
  { id: "de8000a12000", min: 8000, max: 12000 },
  { id: "de12000a20000", min: 12000, max: 20000 },
  { id: "mas20000", min: 20000, max: Infinity },
];

export const RATING_THRESHOLDS = [4.5, 4, 3];

interface BrandOption {
  brand: string;
  count: number;
}

export function CategoryFilters({
  brandOptions,
  selectedBrands,
  onToggleBrand,
  priceRange,
  onSelectPriceRange,
  minRatings,
  onToggleMinRating,
  inStockOnly,
  onToggleInStockOnly,
  onReset,
  hasActiveFilters,
  namePrefix = "desktop",
  showHeader = true,
}: {
  brandOptions: BrandOption[];
  selectedBrands: string[];
  onToggleBrand: (brand: string) => void;
  priceRange: string | null;
  onSelectPriceRange: (id: string | null) => void;
  minRatings: number[];
  onToggleMinRating: (rating: number) => void;
  inStockOnly: boolean;
  onToggleInStockOnly: () => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  /**
   * Le composant est rendu deux fois en parallèle — barre latérale sur grand
   * écran, panneau mobile en dessous de « lg » — avec le même état levé dans
   * le parent. Un groupe de boutons radio HTML se distingue par son `name`,
   * pas par sa visibilité : sans préfixe distinct, cocher un prix dans l'une
   * des deux copies décocherait l'autre au niveau du navigateur.
   */
  namePrefix?: string;
  /**
   * Le panneau mobile porte déjà son propre titre « Filtres » dans son en-tête
   * de tiroir : le répéter juste en dessous ferait doublon. Le bouton de
   * réinitialisation reste affiché dans les deux cas, lui seul est utile.
   */
  showHeader?: boolean;
}) {
  const t = useTranslations("category");
  const locale = useLocale();

  return (
    <aside className="w-full shrink-0 lg:w-56 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto">
      <div className={cn("mb-3 flex items-center", showHeader ? "justify-between" : "justify-end")}>
        {showHeader && (
          <div className="flex items-center gap-2 text-sm font-black text-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            {t("filtersTitle")}
          </div>
        )}
        {hasActiveFilters && (
          <button type="button" onClick={onReset} className="text-xs font-semibold text-primary hover:underline">
            {t("filtersReset")}
          </button>
        )}
      </div>

      <div className="space-y-6">
        <fieldset>
          <legend className="mb-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">
            {t("filterBrand")}
          </legend>
          <ul className="space-y-1.5">
            {brandOptions.map(({ brand, count }) => (
              <li key={brand}>
                <label className="flex items-center justify-between gap-2 text-sm text-foreground">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => onToggleBrand(brand)}
                      className="h-4 w-4 rounded-sm border-border accent-primary"
                    />
                    {brand}
                  </span>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">
            {t("filterPrice")}
          </legend>
          <ul className="space-y-1.5">
            {PRICE_RANGES.map((range) => (
              <li key={range.id}>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="radio"
                    name={`price-${namePrefix}`}
                    checked={priceRange === range.id}
                    onChange={() => onSelectPriceRange(range.id)}
                    onClick={() => {
                      if (priceRange === range.id) onSelectPriceRange(null);
                    }}
                    className="h-4 w-4 border-border accent-primary"
                  />
                  {t(`priceRanges.${range.id}`)}
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">
            {t("filterRating")}
          </legend>
          <ul className="space-y-1.5">
            {RATING_THRESHOLDS.map((rating) => (
              <li key={rating}>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={minRatings.includes(rating)}
                    onChange={() => onToggleMinRating(rating)}
                    className="h-4 w-4 rounded-sm border-border accent-primary"
                  />
                  {/* « 4,5 » en français, « 4.5 » en anglais, « 4 » reste « 4 » */}
                  {t("filterMinStars", { rating: rating.toLocaleString(locale) })}
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={onToggleInStockOnly}
            className="h-4 w-4 rounded-sm border-border accent-primary"
          />
          {t("filterInStockOnly")}
        </label>
      </div>
    </aside>
  );
}
