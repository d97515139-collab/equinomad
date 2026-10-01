import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CarruselProductos } from "@/components/home/CarruselProductos";
import type { Product } from "@/types/home";

export interface TarjetaCatalogo {
  slug: string;
  href: string;
  label: string;
  /** Univers de vente — « Nuevo » ou « Ocasión » — porté par la vignette. */
  universo: string;
  image: string;
  desdePrecio: string;
  unidades: number;
}

/**
 * Grille des catégories.
 *
 * Chaque carte porte trois informations et pas une de plus : ce que c'est,
 * à partir de combien, et combien de modèles. C'est ce qu'un acheteur compare
 * entre deux catégories ; le reste appartient à la page de catégorie.
 *
 * La section s'ouvre sur un ruban défilant qui sort du classement par plaza : il
 * mélange les catégories pour montrer, d'un seul mouvement, à quoi ressemble le
 * rayon et à partir de quel prix on y entre. Le tri par plaza vient ensuite,
 * pour qui sait déjà ce qu'il cherche.
 *
 * L'ancre `#catalogo` est la cible du bouton du bandeau d'ouverture.
 */
export async function CatalogoGrid({
  tarjetas,
  ruban,
}: {
  tarjetas: TarjetaCatalogo[];
  ruban: Product[];
}) {
  const t = await getTranslations("inicio.catalogo");

  if (tarjetas.length === 0) return null;

  return (
    <section id="catalogo" className="scroll-mt-24 bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        {ruban.length > 0 && (
          <div className="mb-14 border-b border-border pb-14">
            <div className="max-w-2xl">
              <p className="eyebrow text-rojo">{t("eyebrow")}</p>
              <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-[2.4rem]">
                {t("rubanTitulo")}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {t("rubanTexto")}
              </p>
            </div>

            <div className="mt-8">
              <CarruselProductos
                products={ruban}
                prevLabel={t("rubanAnterior")}
                nextLabel={t("rubanSiguiente")}
              />
            </div>
          </div>
        )}

        <div className="max-w-2xl">
          {/* Le surtitre ouvre la section : il n'apparaît ici que si le ruban,
              qui le porte d'ordinaire, n'a rien à montrer. La marge haute du
              titre le suit — sans surtitre au-dessus, elle ne sépare rien. */}
          {ruban.length === 0 && <p className="eyebrow text-rojo">{t("eyebrow")}</p>}
          <h2
            className={`text-3xl font-bold text-foreground sm:text-[2.4rem] ${
              ruban.length === 0 ? "mt-3" : ""
            }`}
          >
            {t("titulo")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{t("texto")}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tarjetas.map((tarjeta) => (
            <Link
              key={`${tarjeta.href}`}
              href={tarjeta.href}
              // `flex flex-col` : les cartes d'une même rangée sont étirées à la
              // hauteur de la plus haute. Sans colonne, un titre sur deux lignes
              // décalait la ligne de prix d'une carte à l'autre.
              className="group relative flex flex-col overflow-hidden rounded-lg border border-border transition-all hover:-translate-y-1 hover:border-rojo/40 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rojo"
            >
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-tinta">
                <Image
                  src={tarjeta.image}
                  alt={tarjeta.label}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* L'univers vit sur la vignette, plus dans le titre.
                    Les six catégories forment trois paires — un, deux, trois et
                    quatre places — que seul le « de ocasión » final distinguait.
                    C'était justement la partie que la troncature emportait : la
                    grille se lisait comme trois cartes affichées deux fois. */}
                <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[0.66rem] font-bold tracking-wide text-tinta uppercase shadow-sm backdrop-blur-sm">
                  {tarjeta.universo}
                </span>
              </div>

              {/* `flex-1` avec `items-end` : le bloc de texte occupe la hauteur
                  restante et se pose en bas, si bien que les prix s'alignent
                  d'une carte à l'autre quelle que soit la longueur du titre. */}
              <div className="flex flex-1 items-end justify-between gap-4 bg-white p-4">
                <div className="min-w-0">
                  {/* `line-clamp-2` et non `truncate` : « Remolques de tres y
                      cuatro caballos de ocasión » fait 45 caractères et ne tient
                      pas sur une ligne dans une colonne sur trois. */}
                  <h3 className="line-clamp-2 text-lg font-bold text-foreground transition-colors group-hover:text-rojo">
                    {tarjeta.label}
                  </h3>
                  <p className="dato mt-1 text-sm text-muted-foreground">
                    {t("unidades", { count: tarjeta.unidades })}
                    {tarjeta.desdePrecio && (
                      <>
                        {" · "}
                        {t("desde")}{" "}
                        <span className="font-bold text-rojo">{tarjeta.desdePrecio}</span>
                      </>
                    )}
                  </p>
                </div>
                <ArrowRight className="mb-0.5 h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-rojo" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
