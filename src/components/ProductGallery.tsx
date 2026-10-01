"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";

// Galerie de la fiche produit : une grande vue, et les miniatures juste en
// dessous quand le produit a plusieurs visuels. Sans vue complémentaire, le
// rendu est exactement celui d'avant — une seule image, sans rangée vide.
//
// L'ordre vient du back-office : l'image principale d'abord, puis la galerie
// telle qu'elle a été rangée dans le formulaire produit.

export function ProductGallery({
  image,
  images = [],
  alt,
}: {
  image: string;
  images?: string[];
  alt: string;
}) {
  const t = useTranslations("product");

  // L'image principale ouvre la galerie ; les doublons éventuels sont écartés
  // pour ne pas afficher deux fois la même miniature.
  const views = [image, ...images.filter((entry) => entry && entry !== image)];
  const [active, setActive] = useState(0);
  const current = views[active] ?? image;

  // Point survolé, en pourcentage du cadre. `null` quand le curseur est sorti :
  // l'image revient alors à sa taille normale.
  const [punto, setPunto] = useState<{ x: number; y: number } | null>(null);

  /**
   * Le grossissement est posé en `transform-origin` plutôt qu'en décalage :
   * l'origine suit le curseur, donc le point regardé reste sous le curseur au
   * lieu de fuir vers un bord. C'est ce qui distingue une loupe d'un simple
   * agrandissement.
   */
  function seguirCursor(evento: React.PointerEvent<HTMLDivElement>) {
    // Un doigt ou un stylet déclenche aussi les événements de pointeur : sans ce
    // filtre, une remorque zoomerait au premier effleurement sur mobile, sans
    // moyen d'en sortir.
    if (evento.pointerType !== "mouse") return;

    const marco = evento.currentTarget.getBoundingClientRect();
    setPunto({
      x: ((evento.clientX - marco.left) / marco.width) * 100,
      y: ((evento.clientY - marco.top) / marco.height) * 100,
    });
  }

  function cambiarVista(indice: number) {
    setActive(indice);
    // Sans cette remise à zéro, la nouvelle vue s'afficherait déjà grossie sur
    // le point survolé de la précédente.
    setPunto(null);
  }

  return (
    <div>
      {/* Loupe au survol : la zone sous le curseur est agrandie 2,4 fois, comme
          sur les boutiques où l'on inspecte une finition avant d'acheter. Le
          cadre garde `overflow-hidden`, l'image ne déborde jamais.
          La transition est sous `motion-safe` : un visiteur qui a demandé moins
          d'animations garde la loupe — elle est utile, pas décorative — mais
          sans le fondu d'entrée et de sortie. */}
      <div
        onPointerMove={seguirCursor}
        onPointerLeave={() => setPunto(null)}
        className="relative aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-sm border border-border bg-white"
      >
        <Image
          key={current}
          src={current}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 40vw, 100vw"
          style={
            punto
              ? { transformOrigin: `${punto.x}% ${punto.y}%`, transform: "scale(2.4)" }
              : undefined
          }
          className="object-contain p-6 ease-out motion-safe:transition-transform motion-safe:duration-300"
        />
      </div>

      {views.length > 1 && (
        <ul className="mt-3 flex flex-wrap gap-2" aria-label={t("galleryLabel")}>
          {views.map((view, index) => {
            const selected = index === active;
            return (
              <li key={view}>
                <button
                  type="button"
                  onClick={() => cambiarVista(index)}
                  aria-label={t("galleryView", { index: index + 1, total: views.length })}
                  aria-current={selected ? "true" : undefined}
                  className={`relative block h-16 w-16 overflow-hidden rounded-sm border bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:h-20 sm:w-20 ${
                    selected ? "border-primary" : "border-border hover:border-primary/50"
                  }`}
                >
                  <Image src={view} alt="" fill sizes="80px" className="object-contain p-1.5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
