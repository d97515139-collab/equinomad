"use client";

import { useEffect, useRef } from "react";

/** Nombre de relances tentées avant d'abandonner et de laisser l'image en place. */
const REINTENTOS = 3;

/**
 * Vidéo de fond, jouée en boucle et sans commande.
 *
 * `loop` seul ne suffit pas : la lecture s'interrompt pour des raisons qui
 * n'ont rien à voir avec le fichier, et aucun navigateur ne la reprend de
 * lui-même. Trois cas se produisent en vrai, et ce composant les traite tous les
 * trois.
 *
 * 1. **L'onglet passe en arrière-plan.** Chrome suspend la vidéo et la laisse en
 *    pause au retour. On écoute `visibilitychange` pour relancer.
 * 2. **La section sort de l'écran.** On met alors en pause volontairement — une
 *    vidéo qui tourne sous le pied de page ne fait que vider la batterie — et on
 *    relance à la remontée. Sans cet arbitrage explicite, c'est le navigateur qui
 *    décide, et il ne relance pas.
 * 3. **L'autoplay est refusé.** Le mode économie d'énergie d'iOS le bloque sans
 *    condition ; `play()` renvoie alors une promesse rejetée. On réessaie au
 *    premier geste de l'utilisateur, et à défaut on s'efface : l'image posée sous
 *    la vidéo joue déjà le rôle d'affiche.
 *
 * `preload="metadata"` et non `none` : iOS refuse de démarrer seul une vidéo
 * dont il n'a pas lu l'en-tête, et c'était la raison pour laquelle rien ne
 * partait sur iPhone. Le coût est nul — l'atome `moov` de ces deux fichiers pèse
 * moins de 4 Ko et se trouve en tête, avant les données — et le tri par `media`
 * reste intact : le téléphone ne lit l'en-tête que du fichier qui le concerne.
 */
export function FondoVideo({
  mobileSrc,
  desktopSrc,
  className,
}: {
  /** Source servie sous 768 px. Déclarée en premier : voir le commentaire des `source`. */
  mobileSrc: string;
  desktopSrc: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  /** La section est-elle à l'écran ? Une pause hors champ ne doit pas être relancée. */
  const visibleRef = useRef(true);
  /** Relances déjà tentées, pour ne pas marteler un navigateur qui dit non. */
  const intentosRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");

    // React ne reflète pas toujours `muted` en attribut : sans cette ligne, un
    // navigateur peut considérer la vidéo comme sonore et refuser l'autoplay.
    video.muted = true;

    /** Peut-on jouer, et devrait-on ? */
    const procede = () =>
      !quieto.matches &&
      visibleRef.current &&
      document.visibilityState === "visible" &&
      intentosRef.current < REINTENTOS;

    const arrancar = () => {
      if (!procede()) return;
      const promesa = video.play();
      // Safari ancien ne renvoie rien ; les autres rejettent quand l'autoplay
      // est refusé, et une promesse rejetée non traitée remonterait en console.
      promesa?.catch(() => {
        intentosRef.current += 1;
      });
    };

    // Une lecture qui repart remet le compteur à zéro. Sans cela, les refus
    // d'autoplay essuyés avant le premier geste de l'utilisateur — la norme sur
    // mobile — mangeraient les relances dont on a besoin plus tard.
    const alReproducir = () => {
      intentosRef.current = 0;
    };

    const alTerminar = () => {
      // Filet sous `loop` : si le navigateur laisse la lecture s'achever malgré
      // l'attribut, on rembobine à la main plutôt que de rester sur l'arrêt.
      video.currentTime = 0;
      arrancar();
    };

    const alPausar = () => {
      if (video.ended) return;
      arrancar();
    };

    const alCambiarVisibilidad = () => {
      if (document.visibilityState === "visible") arrancar();
    };

    /** Le geste qui débloque une lecture refusée, une seule fois. */
    const alInteractuar = () => {
      intentosRef.current = 0;
      arrancar();
    };

    const observador = new IntersectionObserver(
      ([entrada]) => {
        visibleRef.current = entrada.isIntersecting;
        if (entrada.isIntersecting) arrancar();
        else if (!video.paused) video.pause();
      },
      { threshold: 0 },
    );

    video.addEventListener("playing", alReproducir);
    video.addEventListener("ended", alTerminar);
    video.addEventListener("pause", alPausar);
    document.addEventListener("visibilitychange", alCambiarVisibilidad);
    document.addEventListener("pointerdown", alInteractuar, { once: true });
    observador.observe(video);

    arrancar();

    return () => {
      video.removeEventListener("playing", alReproducir);
      video.removeEventListener("ended", alTerminar);
      video.removeEventListener("pause", alPausar);
      document.removeEventListener("visibilitychange", alCambiarVisibilidad);
      document.removeEventListener("pointerdown", alInteractuar);
      observador.disconnect();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
      tabIndex={-1}
      className={className}
    >
      {/* Deux fichiers plutôt qu'un : 1,9 Mo de décor sur un forfait mobile,
          c'est non — la version téléphone tient en 609 Ko, à une définition que
          l'écran ne distingue pas de l'autre.

          Le tri passe par l'attribut `media` des `<source>` et non par deux
          balises `<video>` que le CSS masquerait tour à tour : masquer ne suffit
          pas, un appareil mobile téléchargerait alors les deux fichiers.

          L'ordre compte : la version mobile vient en premier. Un navigateur qui
          ignorerait `media` prendrait la première venue, et il vaut mieux qu'un
          écran de bureau hérite d'une image un peu moins fine que l'inverse. */}
      <source src={mobileSrc} media="(max-width: 767px)" type="video/mp4" />
      <source src={desktopSrc} type="video/mp4" />
    </video>
  );
}
