"use client";

import { useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types/home";

/**
 * Vitesse du défilement libre, en pixels par seconde.
 *
 * Volontairement lente : le ruban doit se lire, pas défiler. À cette allure une
 * vignette met une dizaine de secondes à traverser l'écran, ce qui laisse le
 * temps de repérer un prix sans avoir à courir après.
 */
const VELOCIDAD = 30;

/** Durée d'un pas de flèche. */
const PASO_MS = 620;

/** Déplacement au-delà duquel un pointeur devient un glissé, pas un clic. */
const UMBRAL_ARRASTRE = 6;

/** Décélération d'un pas de flèche : rapide au départ, posée à l'arrivée. */
const suave = (x: number) => 1 - (1 - x) ** 3;

type Tween = { desde: number; hasta: number; inicio: number };
type Arrastre = { x: number; offset: number; movido: boolean };

/**
 * Ruban de produits défilant en boucle.
 *
 * Le contenu est rendu deux fois et la position vit dans un seul nombre — le
 * décalage en pixels depuis le début de la première copie, ramené modulo la
 * longueur d'une copie à chaque image. Quand le décalage repasse par zéro les
 * deux copies sont interchangeables : la boucle est continue, sans rembobinage
 * ni saut visible, dans les deux sens.
 *
 * Le mouvement est appliqué en `translate3d` plutôt qu'en `scrollLeft` : le
 * compositeur s'en charge, la position reste sous-pixel et rien ne se dispute
 * l'animation quand une flèche est actionnée au milieu du défilement.
 *
 * Il s'arrête au survol, au focus clavier, pendant un glissé, et sous
 * `prefers-reduced-motion`. Les flèches restent utilisables dans tous les cas :
 * elles sont le vrai moyen de navigation, l'animation n'est qu'une invitation.
 */
export function CarruselProductos({
  products,
  prevLabel,
  nextLabel,
}: {
  products: Product[];
  prevLabel: string;
  nextLabel: string;
}) {
  const marcoRef = useRef<HTMLDivElement>(null);
  const pistaRef = useRef<HTMLDivElement>(null);
  const grupoRef = useRef<HTMLUListElement>(null);

  /** Décalage courant, en pixels, toujours ramené dans [0, longueur d'une copie[. */
  const offsetRef = useRef(0);
  /** Pas de flèche en cours, s'il y en a un. */
  const tweenRef = useRef<Tween | null>(null);
  /** Glissé au doigt ou à la souris en cours, s'il y en a un. */
  const arrastreRef = useRef<Arrastre | null>(null);
  /** Le défilement est-il suspendu (survol, focus clavier) ? */
  const pausaRef = useRef(false);

  /** Longueur d'une copie du ruban, gouttière de raccord comprise. */
  const longitudBucle = useCallback(() => {
    const pista = pistaRef.current;
    const grupo = grupoRef.current;
    if (!pista || !grupo) return 0;
    const gap = Number.parseFloat(getComputedStyle(pista).columnGap) || 0;
    return grupo.offsetWidth + gap;
  }, []);

  const sinMovimiento = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const pista = pistaRef.current;
    if (!pista) return;

    let raf = 0;
    let anterior = 0;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");

    const marco = (t: number) => {
      raf = requestAnimationFrame(marco);
      const delta = anterior ? t - anterior : 0;
      anterior = t;

      const tween = tweenRef.current;
      if (tween) {
        const avance = Math.min(1, (t - tween.inicio) / PASO_MS);
        offsetRef.current = tween.desde + (tween.hasta - tween.desde) * suave(avance);
        if (avance >= 1) tweenRef.current = null;
      } else if (
        !pausaRef.current &&
        !arrastreRef.current &&
        !quieto.matches &&
        // Un onglet revenu au premier plan renvoie un delta énorme : on saute le
        // pas plutôt que de téléporter le ruban.
        delta > 0 &&
        delta < 200
      ) {
        offsetRef.current += (VELOCIDAD * delta) / 1000;
      }

      // Repli dans la première copie. Le pas de flèche en cours est décalé
      // d'autant, sinon franchir la couture le ferait sauter en plein vol.
      const bucle = longitudBucle();
      if (bucle > 0) {
        const antes = offsetRef.current;
        const dentro = ((antes % bucle) + bucle) % bucle;
        if (dentro !== antes) {
          const ajuste = dentro - antes;
          offsetRef.current = dentro;
          if (tweenRef.current) {
            tweenRef.current.desde += ajuste;
            tweenRef.current.hasta += ajuste;
          }
        }
      }

      pista.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    };

    raf = requestAnimationFrame(marco);
    return () => cancelAnimationFrame(raf);
  }, [longitudBucle]);

  /**
   * Pas d'une flèche : autant de vignettes entières que la fenêtre en montre,
   * au moins une. Avancer d'une largeur d'écran exacte couperait une carte en
   * deux à l'arrivée.
   */
  const pasoVisible = useCallback(() => {
    const marco = marcoRef.current;
    const primera = grupoRef.current?.firstElementChild as HTMLElement | null;
    const pista = pistaRef.current;
    if (!marco || !pista) return 0;
    if (!primera) return marco.clientWidth;

    const gap = Number.parseFloat(getComputedStyle(pista).columnGap) || 0;
    const tarjeta = primera.offsetWidth + gap;
    if (tarjeta <= 0) return marco.clientWidth;

    return Math.max(1, Math.floor(marco.clientWidth / tarjeta)) * tarjeta;
  }, []);

  const desplazar = useCallback(
    (sentido: 1 | -1) => {
      const paso = pasoVisible();
      if (paso <= 0) return;

      const desde = offsetRef.current;
      const hasta = desde + sentido * paso;

      if (sinMovimiento()) {
        tweenRef.current = null;
        offsetRef.current = hasta;
        return;
      }

      tweenRef.current = { desde, hasta, inicio: performance.now() };
    },
    [pasoVisible],
  );

  const alPulsar = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    // Le bouton droit et les clics secondaires ne saisissent pas le ruban.
    if (event.button !== 0) return;
    tweenRef.current = null;
    arrastreRef.current = { x: event.clientX, offset: offsetRef.current, movido: false };
  }, []);

  const alMover = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const arrastre = arrastreRef.current;
    if (!arrastre) return;

    const recorrido = event.clientX - arrastre.x;
    if (!arrastre.movido && Math.abs(recorrido) > UMBRAL_ARRASTRE) {
      arrastre.movido = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (arrastre.movido) offsetRef.current = arrastre.offset - recorrido;
  }, []);

  const alSoltar = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const arrastre = arrastreRef.current;
    if (!arrastre) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    // Le drapeau survit jusqu'au clic qui suit, pour l'intercepter.
    arrastreRef.current = arrastre.movido ? { ...arrastre, offset: offsetRef.current } : null;
  }, []);

  /** Un glissé ne doit pas ouvrir la fiche produit qu'on a sous le doigt. */
  const alHacerClic = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!arrastreRef.current?.movido) return;
    event.preventDefault();
    event.stopPropagation();
    arrastreRef.current = null;
  }, []);

  if (products.length === 0) return null;

  // Posées de part et d'autre du ruban, à mi-hauteur : la flèche est là où va
  // le regard quand on veut pousser dans ce sens-là. Elles chevauchent les
  // vignettes de bord, d'où le fond opaque et l'ombre portée — c'est ce qui les
  // détache d'une photo de remorque.
  const flecha =
    "absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-md transition-colors hover:border-rojo hover:bg-rojo hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rojo";

  const tarjetas = (copia: boolean) =>
    products.map((product) => (
      <li
        key={`${copia ? "bis" : "a"}-${product.slug ?? product.name}`}
        className="w-[15rem] shrink-0 sm:w-[16.5rem]"
      >
        <ProductCard product={product} />
      </li>
    ));

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        pausaRef.current = true;
      }}
      onMouseLeave={() => {
        pausaRef.current = false;
      }}
      onFocusCapture={() => {
        pausaRef.current = true;
      }}
      onBlurCapture={() => {
        pausaRef.current = false;
      }}
    >
      <button
        type="button"
        aria-label={prevLabel}
        onClick={() => desplazar(-1)}
        className={`${flecha} left-0 sm:-left-3`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label={nextLabel}
        onClick={() => desplazar(1)}
        className={`${flecha} right-0 sm:-right-3`}
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Le fondu des bords dit que le ruban continue de part et d'autre — sans
          lui, la coupure nette se lit comme une fin de liste. */}
      <div
        ref={marcoRef}
        onPointerDown={alPulsar}
        onPointerMove={alMover}
        onPointerUp={alSoltar}
        onPointerCancel={alSoltar}
        onClickCapture={alHacerClic}
        className="overflow-hidden [touch-action:pan-y] sm:[mask-image:linear-gradient(to_right,transparent,#000_3rem,#000_calc(100%-3rem),transparent)]"
      >
        <div ref={pistaRef} className="flex gap-4 will-change-transform">
          <ul className="flex shrink-0 gap-4" ref={grupoRef}>
            {tarjetas(false)}
          </ul>

          {/* Copie de bouclage : hors de l'arbre d'accessibilité et hors
              tabulation, sinon le lecteur d'écran annoncerait deux fois le même
              catalogue. */}
          <ul className="flex shrink-0 gap-4" aria-hidden inert>
            {tarjetas(true)}
          </ul>
        </div>
      </div>
    </div>
  );
}
