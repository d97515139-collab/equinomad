import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowDown } from "lucide-react";
import { FondoVideo } from "@/components/home/FondoVideo";
import { Logo } from "@/components/brand/Logo";
import { prisma } from "@/server/prisma";

/**
 * Ouverture de la page d'accueil.
 *
 * Pas de carrousel. Un acheteur de remorque arrive avec trois questions et une
 * seule séance de navigation pour y répondre : est-ce que je peux la tirer,
 * combien de chevaux, et est-ce qu'elle arrive immatriculée. Le titre répond à
 * la troisième, les trois chiffres sous le texte aux deux autres.
 *
 * Le fond est posé à droite, en `object-right` : le texte occupe la moitié
 * gauche restée volontairement vide.
 *
 * Les deux couches sont agrandies de 16 % depuis leur bord gauche. Le rush porte
 * un filigrane « Cheval Liberté » dans son coin supérieur droit, entre 91 et
 * 97 % de la largeur du plan : l'agrandissement décale le cadre vers la droite
 * jusqu'à faire sortir cette bande hors de la section, sans découvrir de vide à
 * gauche puisque l'origine y est ancrée. Un `object-position` n'y suffisait pas —
 * sur un écran plus large que 16/9 la vidéo remplit déjà toute la largeur, il n'y
 * a rien à recadrer horizontalement et le réglage restait sans effet.
 *
 * Il se joue sur deux couches empilées —
 * l'image d'abord, la vidéo par-dessus. L'image reste donc visible tant que la
 * vidéo n'a pas démarré, et prend sa place quand celle-ci est écartée, sous
 * `prefers-reduced-motion`. D'où l'absence d'attribut `poster` sur la vidéo :
 * la première couche joue déjà ce rôle, en mieux — `next/image` la sert en AVIF
 * ou WebP et à la taille de l'écran, ce que `poster` ne sait pas faire.
 */
export async function HeroRemolques() {
  const t = await getTranslations("inicio.hero");

  // Le nombre de modèles est compté, jamais écrit à la main. La chaîne de
  // traduction annonçait 24 références alors que le catalogue n'en publiait
  // plus que douze : un écart qu'aucune relecture ne rattrape, puisqu'il naît
  // d'une désactivation en base et non d'une modification de texte. Le chiffre
  // le plus vendeur de la page est aussi celui qui se périme le plus vite.
  const modelosPublicados = await prisma.product.count({ where: { active: true } });

  const cifras = [
    { valor: String(modelosPublicados), unidad: t("cifra1Unidad"), etiqueta: t("cifra1Etiqueta") },
    { valor: t("cifra2Valor"), unidad: t("cifra2Unidad"), etiqueta: t("cifra2Etiqueta") },
    { valor: t("cifra3Valor"), unidad: t("cifra3Unidad"), etiqueta: t("cifra3Etiqueta") },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-tinta">
      <Image
        src="/videos/hero-poster.jpg"
        alt={t("imagenAlt")}
        fill
        priority
        sizes="100vw"
        className="origin-left scale-[1.16] object-cover object-right"
      />

      {/* Fond décoratif : muet par construction (Chrome et Safari refusent de
          lancer seule une vidéo qui porte du son), et sans piste audio dans le
          fichier lui-même, pas seulement `muted` à l'affichage.

          Le choix de la source et l'entretien de la boucle sont dans
          `FondoVideo` : ils demandent du code client, que la lecture s'arrête
          pour des raisons de politique navigateur qu'aucun attribut ne couvre.

          `motion-reduce:hidden` retire la vidéo : l'image du dessous reprend
          alors la main. */}
      <FondoVideo
        mobileSrc="/videos/hero-mobile.mp4"
        desktopSrc="/videos/hero.mp4"
        className="absolute inset-0 h-full w-full origin-left scale-[1.16] object-cover object-right motion-reduce:hidden"
      />

      {/* Un seul voile, horizontal : il éteint la moitié gauche pour porter le
          texte et laisse la remorque intacte à droite. Un voile global aurait
          terni les deux. La butée droite passe de 10 à 25 % depuis que le fond
          est filmé : l'image est plus claire et plus contrastée que le dessin
          qu'elle remplace, et le mouvement à droite tirait l'œil hors du titre. */}
      <div className="absolute inset-0 bg-gradient-to-r from-tinta via-tinta/90 to-tinta/25" />

      {/* Retrait haut réduit : la signature de marque ajoutée au-dessus du
          titre occupe déjà la place que ce blanc réservait, et l’en-tête est
          translucide — le hero commence sous elle, pas après elle. Le retrait
          bas est inchangé, il tient les chiffres à distance de la section
          suivante. */}
      <div className="relative mx-auto max-w-screen-xl px-4 pt-6 pb-14 sm:px-6 lg:pt-10 lg:pb-24">
        <div className="max-w-2xl">
          {/* Signature de marque, avant le titre : le logo puis, sur la même
              ligne, ce que fait la maison. Le logo est repris ici alors qu’il
              figure déjà dans l’en-tête — la barre est translucide au-dessus du
              fond filmé, et un visiteur qui arrive par un lien profond lit la
              phrase avant le titre plutôt que la marque seule.

              Ton clair : le voile de gauche éteint le fond jusqu’à l’encre, le
              lettrage blanc s’y détache. `flex-wrap` fait passer la phrase sous
              le logo sur téléphone au lieu de la comprimer. */}
          <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2">
            <Logo tone="light" className="h-7 w-auto sm:h-9" />
            <p className="text-sm font-bold text-white/85 sm:text-base">{t("claim")}</p>
          </div>

          {/* Capitale à chaque mot, à la demande du client. Posé en CSS et non
              dans la traduction : le texte reste en casse normale à la source,
              donc lisible pour un traducteur et correct partout où il est repris
              — balise `title`, données structurées, fil d'Ariane. */}
          <h1 className="text-[2.4rem] leading-[1.02] font-bold text-white capitalize sm:text-[3.2rem] lg:text-[4rem]">
            {t("titulo")}
            {/* Le rouge de marque sur l'encre : 3,80:1. Sous le seuil du texte
                courant, au-dessus de celui du gros et gras — ce qu'est un titre
                de hero à 64 pixels. Le même rouge sur du blanc, lui, atteint
                4,92:1 et sert partout ailleurs. */}
            <span className="block text-rojo">{t("tituloAcento")}</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-[1.08rem]">
            {t("descripcion")}
          </p>

          {/* Une seule issue : le catalogue. Le numéro occupait le second
              bouton ; il reste dans le pied de page et sur chaque fiche, où
              l'appel a un objet — on appelle pour un modèle, pas pour une page
              d'accueil. */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Blanc sur le rouge : 4,92:1, au-delà du seuil AA. C'est ce qui
                permet ici un seul rouge là où l'ancienne charte orange en
                demandait deux. */}
            <a
              href="#catalogo"
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-rojo px-6 py-3.5 text-base font-bold text-white transition-all hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t("ctaCatalogo")}
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </a>
          </div>

          {/* Les trois chiffres qui décident de l'achat, posés sous les boutons
              plutôt que dans une bande séparée : ils font partie de l'argument,
              pas de la décoration. */}
          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-md border border-white/12 bg-white/12">
            {cifras.map((cifra) => (
              <div key={cifra.etiqueta} className="bg-tinta/70 px-3 py-4 sm:px-4">
                <dd className="dato text-xl font-bold text-white sm:text-2xl">
                  {cifra.valor}
                  <span className="unidad ml-1 text-rojo">{cifra.unidad}</span>
                </dd>
                <dt className="mt-1 text-[0.68rem] leading-tight text-white/55">
                  {cifra.etiqueta}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
