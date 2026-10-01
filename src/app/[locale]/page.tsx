import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroRemolques } from "@/components/home/HeroRemolques";
import { GarantiasStrip } from "@/components/home/GarantiasStrip";
import { MarcasSocias } from "@/components/home/MarcasSocias";
import { CatalogoGrid, type TarjetaCatalogo } from "@/components/home/CatalogoGrid";
import { PermisoYPeso } from "@/components/home/PermisoYPeso";
import { ComparadorMateriales } from "@/components/home/ComparadorMateriales";
import { ProcesoEntrega } from "@/components/home/ProcesoEntrega";
import { FaqRemolques } from "@/components/home/FaqRemolques";
import { ProductGrid } from "@/components/ProductGrid";
import { alternatesFor } from "@/lib/hreflang";
import { formatPrice, getCategoryPages, type CategoryPageView } from "@/server/store";
import { loadCatalogTranslations, localizeCategoryPages } from "@/server/localizedContent";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import type { Locale } from "@/i18n/routing";
import type { Product } from "@/types/home";

type HomeParams = Promise<{ locale: Locale }>;

// Seuls ces trois univers composent la boutique. Le filtre est explicite pour
// qu'une catégorie restée en base après une reprise de catalogue n'apparaisse
// pas d'elle-même sur la page d'accueil.
const GRUPOS = ["nuevos", "ocasion", "accesorios"];

/**
 * Nombre maximal de cartes sur la grille d'accueil.
 *
 * Six, parce que la grille est en trois colonnes : le compte remplit deux
 * rangées exactement, sans laisser de trou en bout de ligne. Les sept
 * catégories du catalogue — trois par univers de vente, plus les accessoires —
 * pourraient toutes être peuplées un jour ; l'accueil n'a pas à toutes les
 * porter. Le rayon complet reste accessible par la navigation.
 */
const MAX_TARJETAS = 6;

/**
 * Visuel d'une carte du catalogue : la photographie du premier modèle qui en a
 * une, plutôt que l'illustration générique de la catégorie. Un acheteur qui
 * arrive sur la grille veut voir une remorque, pas un pictogramme — et la même
 * page montre déjà de vraies photos juste en dessous, dans « Los más pedidos ».
 *
 * Repli sur le visuel de catégorie tant qu'aucun modèle n'est photographié :
 * une carte sans image serait pire qu'un dessin.
 */
function portadaDe(category: CategoryPageView): string {
  const fotografiado = category.products.find((product) =>
    product.image?.startsWith("http"),
  );
  return fotografiado?.image ?? category.image;
}

/** Prix d'entrée d'une catégorie, mis en forme à l'espagnole. */
function precioDesde(category: CategoryPageView): string {
  const cents = category.products
    .map((product) => product.priceCents ?? 0)
    .filter((value) => value > 0);
  return cents.length > 0 ? formatPrice(Math.min(...cents)) : "";
}

/**
 * Sélection mise en avant : on sert les catégories à tour de rôle — un modèle
 * de chacune, puis un deuxième de chacune, et ainsi de suite jusqu'à remplir la
 * grille. Prendre les huit premiers du catalogue donnerait huit remorques deux
 * places, qui est la catégorie la plus fournie ; ce tour par tour garantit
 * qu'un monoplace et un quatre places apparaissent avant le deuxième van de
 * 2 700 kg.
 *
 * Les modèles marqués d'un badge passent devant à l'intérieur de leur
 * catégorie : c'est le seul signal éditorial dont dispose la page d'accueil.
 */
function destacados(categories: CategoryPageView[], limite: number): Product[] {
  const listas = categories
    .filter((category) => category.products.length > 0)
    .map((category) =>
      [...category.products].sort(
        (a, b) => Number(Boolean(b.badge)) - Number(Boolean(a.badge)),
      ),
    );

  const seleccion: Product[] = [];

  for (let vuelta = 0; seleccion.length < limite; vuelta++) {
    const quedan = listas.some((lista) => lista.length > vuelta);
    if (!quedan) break;

    for (const lista of listas) {
      if (seleccion.length >= limite) break;
      const producto = lista[vuelta];
      if (producto) seleccion.push(producto);
    }
  }

  return seleccion;
}

/** Nombre de vignettes du ruban défilant de la section catalogue. */
const LARGO_RUBAN = 14;

/**
 * Sélection du ruban défilant : tout le catalogue est candidat, toutes
 * catégories et tous prix confondus, mais deux signaux tirent vers l'avant.
 *
 * Le premier est le prix : un ruban qui ouvre sur un van de 4 places à
 * 30 000 € fait fuir ; celui qui ouvre à 3 900 € donne envie de regarder la
 * suite. Le second est la demande — faute de compteur de ventes en base, elle se
 * lit sur ce qui en tient lieu : le badge éditorial, le nombre d'avis déposés et
 * la note. Les deux comptent à parts égales, sinon le ruban se réduirait aux
 * accessoires à 40 €.
 *
 * Le classement obtenu est ensuite servi à tour de rôle par catégorie, pour que
 * deux voisines ne viennent pas du même rayon : c'est ce qui fait le mélange
 * demandé plutôt qu'une liste triée par prix croissant.
 */
function ruban(categories: CategoryPageView[], limite: number): Product[] {
  const todos = categories.flatMap((category) => category.products);
  if (todos.length === 0) return [];

  const precios = todos.map((product) => product.priceCents ?? 0).filter((value) => value > 0);
  const barato = Math.min(...precios, Number.POSITIVE_INFINITY);
  const caro = Math.max(...precios, 0);
  const maxAvis = Math.max(1, ...todos.map((product) => product.reviewCount ?? 0));

  /** Note de 0 à 2 : moitié accessibilité du prix, moitié demande constatée. */
  const nota = (product: Product) => {
    const cents = product.priceCents ?? 0;
    const asequible =
      caro > barato && cents > 0 ? 1 - (cents - barato) / (caro - barato) : 0.5;

    const avis = (product.reviewCount ?? 0) / maxAvis;
    const estrellas = (product.rating ?? 0) / 5;
    const demanda =
      0.4 * (product.badge ? 1 : 0) + 0.4 * avis + 0.2 * estrellas;

    return asequible + demanda;
  };

  // Une file par catégorie, chacune triée par note décroissante.
  const filas = categories
    .map((category) => [...category.products].sort((a, b) => nota(b) - nota(a)))
    .filter((fila) => fila.length > 0)
    // Les catégories dont la tête de file marque le plus passent en premier :
    // le ruban commence donc par ce qu'il a de plus attirant.
    .sort((a, b) => nota(b[0]) - nota(a[0]));

  const seleccion: Product[] = [];
  for (let vuelta = 0; seleccion.length < limite; vuelta++) {
    if (!filas.some((fila) => fila.length > vuelta)) break;
    for (const fila of filas) {
      if (seleccion.length >= limite) break;
      const producto = fila[vuelta];
      if (producto) seleccion.push(producto);
    }
  }

  return seleccion;
}

export async function generateMetadata({ params }: { params: HomeParams }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor("/", locale),
  };
}

export default async function Home({ params }: { params: HomeParams }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tCatalogo = await getTranslations("inicio.catalogo");

  const [rawCategories, translations] = await Promise.all([
    getCategoryPages(),
    loadCatalogTranslations(locale),
  ]);
  const categories = localizeCategoryPages(rawCategories, translations).filter(
    (category) => GRUPOS.includes(category.group) && category.products.length > 0,
  );

  const tarjetas: TarjetaCatalogo[] = categories.slice(0, MAX_TARJETAS).map((category) => ({
    slug: category.slug,
    href: `/${category.group}/${category.slug}`,
    label: category.label,
    // Les mêmes plazas existent en neuf et en occasion : sans cette mention,
    // les deux cartes ne se distinguent que par la fin de leur titre.
    universo: tCatalogo(`universos.${category.group}`),
    image: portadaDe(category),
    desdePrecio: precioDesde(category),
    unidades: category.products.length,
  }));

  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroRemolques />
        <GarantiasStrip />
        <CatalogoGrid tarjetas={tarjetas} ruban={ruban(categories, LARGO_RUBAN)} />
        <PermisoYPeso />

        {/* La section précédente est déjà sable : on ne rajoute que la
            respiration nécessaire, pas un second bloc de padding. */}
        <div className="bg-white py-14 sm:py-20">
          <ProductGrid
            eyebrow={t("bestsellerEyebrow")}
            heading={t("bestseller")}
            ctaLabel={t("bestsellerCta")}
            ctaHref="/nuevos"
            products={destacados(categories, 8)}
          />
        </div>

        <ComparadorMateriales />
        <ProcesoEntrega />
        <FaqRemolques />

        {/* Les constructeurs ferment la page plutôt que de l’ouvrir : posés
            avant le catalogue, leurs logotypes se lisaient comme une barre de
            confiance avant même qu’on ait montré un véhicule. En dernière
            position ils répondent à la question qui reste après la FAQ — de qui
            vient ce que j’achète — et passent la main au pied de page. */}
        <MarcasSocias />
      </main>
      <Footer />

      {/* Identité du marchand, lue par Google pour rattacher le site à la boutique */}
      <OrganizationJsonLd />
    </>
  );
}
