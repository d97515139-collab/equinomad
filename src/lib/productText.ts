import type { Product, ProductSectionView } from "@/types/home";

// Les descriptions saisies dans le back-office ont toujours la priorité.
// Tant qu'un produit n'en a pas, on compose un texte à partir des données
// réelles de la fiche : jamais de texte de remplissage sur la boutique.
//
// Le produit et le libellé de catégorie reçus ici sont déjà localisés ; seule
// la phrase d'assemblage dépend encore de la langue.

export function productShortText(
  product: Product,
  categoryLabel: string,
  locale: string = "es",
): string {
  if (product.shortDescription?.trim()) return product.shortDescription.trim();

  const highlights = product.bullets.slice(0, 2).join(" · ");

  const pattern =
    locale === "fr"
      ? (value: string) => `${categoryLabel} de ${product.brand}${value}`
      : locale === "de"
        ? (value: string) => `${categoryLabel} von ${product.brand}${value}`
        : locale === "it"
          ? (value: string) => `${categoryLabel} di ${product.brand}${value}`
          : locale === "en"
            ? (value: string) => `${categoryLabel} by ${product.brand}${value}`
            : (value: string) => `${categoryLabel} de ${product.brand}${value}`;

  return pattern(highlights ? ` — ${highlights}.` : ".");
}

export function productLongText(
  product: Product,
  categoryLabel: string,
  locale: string = "es",
): string {
  if (product.description?.trim()) return product.description.trim();

  const features = product.bullets.join(", ").toLowerCase();

  if (locale === "fr") {
    return features
      ? `Le ${product.brand} ${product.name} se distingue dans la catégorie ${categoryLabel} par ${features}. Un choix fiable pour qui attend de la qualité et un bon rapport qualité-prix.`
      : `Le ${product.brand} ${product.name}, dans la catégorie ${categoryLabel}, garantit une qualité constante et un bon rapport qualité-prix.`;
  }
  if (locale === "de") {
    return features
      ? `Der ${product.brand} ${product.name} hebt sich in der Kategorie ${categoryLabel} durch ${features} ab. Eine verlässliche Wahl für alle, die Qualität und ein stimmiges Preis-Leistungs-Verhältnis suchen.`
      : `Der ${product.brand} ${product.name} aus der Kategorie ${categoryLabel} steht für verlässliche Qualität und ein stimmiges Preis-Leistungs-Verhältnis.`;
  }
  if (locale === "it") {
    return features
      ? `Il ${product.brand} ${product.name} si distingue nella categoria ${categoryLabel} per ${features}. Una scelta affidabile per chi cerca qualità e un buon rapporto qualità-prezzo.`
      : `Il ${product.brand} ${product.name} della categoria ${categoryLabel} offre qualità costante e un buon rapporto qualità-prezzo.`;
  }
  if (locale === "en") {
    return features
      ? `The ${product.brand} ${product.name} stands out in the ${categoryLabel} category with ${features}. A dependable choice for anyone who values quality and good value for money.`
      : `The ${product.brand} ${product.name} from our ${categoryLabel} range stands for dependable quality and good value for money.`;
  }

  return features
    ? `El ${product.brand} ${product.name} destaca en la categoría ${categoryLabel} por ${features}. Una opción fiable para quien busca calidad y una relación calidad-precio equilibrada.`
    : `El ${product.brand} ${product.name}, dentro de la categoría ${categoryLabel}, ofrece una calidad constante y una relación calidad-precio equilibrada.`;
}

/**
 * Les sections détaillées n'existent aujourd'hui qu'en espagnol et en anglais.
 * Pour éviter une fiche FR/DE/IT qui mélange les langues, on masque ces
 * sections tant qu'une vraie traduction dédiée n'existe pas, puis la page
 * retombe sur `product.description`, déjà localisée.
 */
export function productSectionsForLocale(
  sections: ProductSectionView[] | undefined,
  locale: string = "es",
): Array<{ heading: string; body: string }> {
  if (!sections?.length) return [];

  if (locale === "es") {
    return sections.map((section) => ({
      heading: section.heading,
      body: section.body,
    }));
  }

  if (locale === "en") {
    return sections.map((section) => ({
      heading: section.headingEn.trim() || section.heading,
      body: section.bodyEn.trim() || section.body,
    }));
  }

  return [];
}
