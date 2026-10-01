import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/server/prisma";

/**
 * Les constructeurs dont la boutique distribue les remorques.
 *
 * La liste n'est pas écrite ici : elle vient du catalogue publié, groupée sur
 * la colonne `brand` des produits actifs. Une marque qui disparaît du stock
 * disparaît donc de la section, et une marque qui entre s'y ajoute sans qu'on
 * touche au code. C'est la même règle que le compteur de modèles du hero : le
 * chiffre qui vend le plus est celui qui se périme le plus vite.
 *
 * « Multimarca » est écarté — c'est la valeur fourre-tout des annonces
 * d'occasion reprises, pas un constructeur. L'afficher parmi les autres
 * reviendrait à annoncer une marque qui n'existe pas.
 */

/**
 * Fichiers de logotype, par marque.
 *
 * Chaque fichier a été pris chez le constructeur lui-même — site officiel ou
 * Wikimedia Commons pour ceux qui n’en publient pas —, jamais redessiné : un
 * lettrage de marque reconstruit au jugé donne une lettre fausse sous un nom
 * vrai. Les sources sont notées en regard, pour qu’un remplacement par un
 * fichier de kit presse sache d’où partait celui-ci.
 *
 * Ce sont des marques déposées. Elles sont affichées ici au titre de l’usage
 * nominatif — désigner les remorques réellement distribuées —, ce que la
 * mention sous la grille rappelle. Un kit presse officiel, obtenu auprès de
 * chaque constructeur, reste préférable à terme : il apporte le fichier ET
 * l’autorisation écrite.
 *
 * Une marque absente de cette table n’est pas une erreur : sa tuile porte
 * alors son nom composé en Fraunces. C’est le cas de Westfalia, dont les
 * quatre remorques du catalogue sont d’anciens modèles des Westfalia-Werke ;
 * le seul logotype disponible aujourd’hui est celui de Westfalia-Automotive,
 * société distincte qui fabrique des attelages et non des vans. Poser sa
 * marque sur ces fiches attribuerait le véhicule au mauvais constructeur.
 *
 * Pour ajouter un logotype : déposer le fichier dans `public/images/marcas/`
 * et ajouter sa ligne ici. Rien d’autre à modifier. Le chemin est déclaré à
 * la main, sans lecture de répertoire : sur Vercel le dossier `public/` est
 * servi par le CDN et n’est pas garanti présent dans le système de fichiers
 * de la fonction, où un `readdir` renverrait vide.
 */
const LOGOS: Record<string, string> = {
  Böckmann: "/images/marcas/bockmann.svg", // boeckmann.com
  "Ifor Williams": "/images/marcas/ifor-williams.svg", // Wikimedia Commons, domaine public
  "Cheval Liberté": "/images/marcas/cheval-liberte.png", // chevalliberte.fr
  Fautras: "/images/marcas/fautras.png", // fautras.com
  Humbaur: "/images/marcas/humbaur.svg", // Wikimedia Commons, domaine public
  Sirius: "/images/marcas/sirius.png", // sirius-trailers.com
  Wörmann: "/images/marcas/woermann.png", // woermann.eu
};

/** Marque fourre-tout des annonces reprises : jamais affichée comme un constructeur. */
const EXCLUIDAS = new Set(["Multimarca"]);

export async function MarcasSocias() {
  const t = await getTranslations("inicio.socios");

  const filas = await prisma.product.groupBy({
    by: ["brand"],
    where: { active: true },
    _count: { _all: true },
    orderBy: { _count: { brand: "desc" } },
  });

  const marcas = filas
    .filter((fila) => fila.brand && !EXCLUIDAS.has(fila.brand))
    .map((fila) => ({ nombre: fila.brand as string, unidades: fila._count._all }));

  // Aucune marque publiée : la section entière s'efface plutôt que d'annoncer
  // un partenariat vide.
  if (marcas.length === 0) return null;

  return (
    <section className="bg-nieve py-14 sm:py-20">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="eyebrow text-rojo">{t("eyebrow")}</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-[2.4rem]">
            {t("titulo")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{t("intro")}</p>
        </div>

        {/* Grille d'un seul filet : les tuiles sont séparées par le fond qui
            traverse les gouttières d'un pixel, pas par une bordure sur chacune
            — c'est ce qui évite les doubles traits aux jonctions. */}
        <ul className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3 lg:grid-cols-4">
          {marcas.map((marca) => {
            const logo = LOGOS[marca.nombre];

            return (
              <li
                key={marca.nombre}
                className="flex min-h-[7.5rem] flex-col items-center justify-center gap-2 bg-white px-4 py-6 text-center"
              >
                {logo ? (
                  /* Hauteur imposée, largeur libre : les logotypes de
                     constructeurs n'ont pas le même rapport, seule une hauteur
                     commune les aligne. */
                  <Image
                    src={logo}
                    alt={marca.nombre}
                    width={160}
                    height={48}
                    /* L’optimiseur de Next refuse les SVG tant que
                       `dangerouslyAllowSVG` n’est pas posé — un réglage qui
                       vaudrait pour toutes les images distantes du site, y
                       compris celles des places de marché. Ces sept fichiers
                       sont locaux et relus : on les sert tels quels plutôt que
                       d’ouvrir la porte à l’échelle du site. */
                    unoptimized={logo.endsWith(".svg")}
                    className="h-9 w-auto object-contain sm:h-10"
                  />
                ) : (
                  <span className="font-serif text-lg leading-tight font-bold text-foreground sm:text-xl">
                    {marca.nombre}
                  </span>
                )}

                {/* Le nombre de modèles fait la différence entre un logotype
                    posé là pour décorer et une marque réellement en stock. */}
                <span className="dato text-[0.7rem] font-bold tracking-wide text-muted-foreground uppercase">
                  {t("unidades", { count: marca.unidades })}
                </span>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">{t("aviso")}</p>
      </div>
    </section>
  );
}
