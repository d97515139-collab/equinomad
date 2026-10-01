/**
 * Génère les visuels du catalogue Remolque Caballos : des vues de profil dessinées, pas
 * des photographies.
 *
 *   node scripts/generer-visuels.mjs
 *
 * Pourquoi dessiner plutôt que photographier. Un catalogue de remorques monté
 * avec des photos glanées ailleurs mélange les fonds, les angles, les lumières
 * et les logos d'autres vendeurs ; l'œil le lit comme une brocante. Une vue de
 * profil au même cadrage pour tous les modèles fait l'inverse : elle rend les
 * modèles comparables d'un coup d'œil — c'est exactement ce qu'on demande à un
 * catalogue technique — et elle appartient à la maison.
 *
 * Le dessin est paramétré : nombre de chevaux, essieu simple ou tandem, teinte
 * de caisse, rampe ouverte ou fermée, toit surélevé. Deux modèles qui diffèrent
 * par la charge diffèrent donc visiblement, sans qu'aucune image ne soit
 * dessinée à la main.
 *
 * Sortie : public/images/remolques/*.svg — vectoriel, quelques kilo-octets,
 * net à toutes les tailles et sur tous les écrans.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SORTIE = path.join(RACINE, "public", "images", "remolques");

// Palette reprise de src/app/globals.css. Elle est recopiée ici plutôt
// qu'importée : ce script tourne hors du bundle, sans PostCSS pour résoudre les
// variables CSS. Toute retouche de la charte doit donc passer par les deux
// fichiers — le commentaire est là pour qu'on ne l'oublie pas.
const C = {
  noche: "#001424", // encre : fonds sombres, ombres, roues
  brasa: "#242424", // gris profond : halos, collines
  cuero: "#e3000e", // rouge de marque : bandeau de caisse, accents
  arena: "#ffffff", // blanc : fond des vues produit
  laton: "#ffca2b", // jaune : filets et repères
  borde: "#e5e7eb",
  humo: "#6b7280",
};

/**
 * Teintes de caisse proposées au catalogue.
 *
 * Deux clairs, trois soutenus. Les clairs dominent parce que c'est la réalité
 * du marché — un van se peint clair pour ne pas cuire au soleil espagnol — et
 * parce qu'une grille où toutes les caisses seraient rouges effacerait les
 * bandeaux de marque, qui le sont déjà.
 */
const CARROCERIAS = {
  aluminio: { alto: "#eceae5", bajo: "#cbc7bf", canto: "#a6a199", oscuro: "#8d887f" },
  poliester: { alto: "#f5f5f3", bajo: "#dedcd7", canto: "#b3b0a9", oscuro: "#96938c" },
  teja: { alto: "#f4353f", bajo: "#e3000e", canto: "#9d000a", oscuro: "#6f0007" },
  azul: { alto: "#123a5c", bajo: "#0a2740", canto: "#001424", oscuro: "#000c16" },
  grafito: { alto: "#4b5563", bajo: "#374151", canto: "#1f2937", oscuro: "#111827" },
};

/**
 * Tête et encolure de cheval, de profil, tournées vers l'avant de l'attelage.
 *
 * La bête entière devient une tache illisible à la taille d'une vignette :
 * réduite à la tête et à l'encolure, la silhouette reste reconnaissable à
 * quarante pixels de haut, ce qui est la seule mesure qui compte ici. Tracée
 * dans un carré de 100 sur 100.
 */
const CABEZA_CABALLO =
  "M10 44 L14 31 Q19 19 31 15 L33 4 L42 14 L50 3 L55 17 " +
  "Q67 28 71 47 L84 96 L60 96 L49 60 Q40 51 25 49 Q13 48 10 44 Z";

/** Enveloppe d'échappement minimale pour le texte inséré dans le SVG. */
function txt(valeur) {
  return String(valeur).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Corps du dessin d'une remorque, sans fond ni cadre.
 *
 * Repère : la remorque avance vers la GAUCHE, timon en avant. C'est le sens de
 * lecture d'un attelage sur une fiche technique, et il place la rampe — donc le
 * détail que l'acheteur regarde en premier — du côté droit, là où l'œil finit
 * sa course.
 *
 * Rend un objet `{ cuerpo, ancho, defs }` : le tracé, la largeur totale occupée
 * (timon et rampe compris) et les dégradés à déclarer. C'est l'appelant qui
 * décide du cadre, parce qu'une vignette de produit et un bandeau d'accueil ne
 * cadrent pas la même chose.
 */
function dibujarRemolque({
  caballos = 2,
  tandem = false,
  carroceria = "poliester",
  rampa = false,
  techoElevado = false,
  idDegradado = "caisse",
}) {
  const piel = CARROCERIAS[carroceria] ?? CARROCERIAS.poliester;

  // --- Cotes -----------------------------------------------------------------
  // Tout part de la longueur de caisse, tirée du nombre de chevaux : c'est la
  // seule cote qui change vraiment d'un modèle à l'autre. Les proportions
  // suivent celles d'un van réel — une caisse haute, pas une boîte à outils.
  const largo = 330 + caballos * 74;
  const altoCaja = (techoElevado ? 0.62 : 0.56) * largo;

  const suelo = 0; // repère local : le sol est à y = 0, le reste est négatif
  const hRueda = 58;
  const yBajo = suelo - hRueda - 26; // plancher de caisse
  const yTecho = yBajo - altoCaja; // ligne de toit

  const largoTimon = 150;
  const largoRampa = rampa ? 175 : 0;

  const x0 = 0; // bord avant de la caisse
  const x1 = largo; // bord arrière

  // Nez incliné : le haut de la paroi avant est reculé. C'est la silhouette
  // caractéristique d'un van, et c'est elle qui donne au dessin sa direction.
  const retroceso = techoElevado ? 84 : 66;

  // --- Silhouette de la caisse ----------------------------------------------
  const cuerpo = [
    `M ${x0} ${yBajo}`,
    `L ${x0 + 14} ${yTecho + 96}`,
    `Q ${x0 + 22} ${yTecho + 26} ${x0 + retroceso} ${yTecho + 12}`,
    `Q ${x0 + retroceso + 22} ${yTecho} ${x0 + retroceso + 46} ${yTecho}`,
    `L ${x1 - 18} ${yTecho}`,
    `Q ${x1} ${yTecho} ${x1} ${yTecho + 20}`,
    `L ${x1} ${yBajo}`,
    "Z",
  ].join(" ");

  // --- Essieux ---------------------------------------------------------------
  // En tandem, les deux roues se resserrent autour du centre de charge ; en
  // simple, la roue unique se place un peu en arrière du milieu, là où elle
  // équilibre réellement un van chargé à l'avant.
  const centro = largo * 0.54;
  const ruedas = tandem ? [centro - 68, centro + 68] : [centro];

  // --- Ouvertures ------------------------------------------------------------
  // Une fenêtre d'aération par cheval, alignées sous la ligne de toit.
  const zonaIni = x0 + retroceso + 58;
  const zonaFin = x1 - 42;
  const paso = (zonaFin - zonaIni) / caballos;
  const anchoVentana = paso - 26;
  const yVentana = yTecho + 40;
  const hVentana = Math.min(78, altoCaja * 0.3);

  const ventanas = Array.from({ length: caballos }, (_, i) => ({
    x: zonaIni + i * paso,
    w: anchoVentana,
  }));

  const partes = [];

  // Ombre portée : une ellipse basse, jamais un flou. Elle ancre l'objet au sol
  // sans prétendre à un éclairage que le reste du dessin n'a pas.
  partes.push(
    `<ellipse cx="${(largo / 2).toFixed(0)}" cy="${suelo + 8}" rx="${(largo / 2 + 90).toFixed(0)}" ry="14" fill="${C.noche}" opacity="0.13"/>`,
  );

  // Timon en V et tête d'attelage
  partes.push(`<g fill="${C.humo}">
    <path d="M ${x0 + 6} ${yBajo - 30} L ${x0 - largoTimon} ${suelo - 74} L ${x0 - largoTimon} ${suelo - 58} L ${x0 + 6} ${yBajo - 8} Z"/>
    <path d="M ${x0 + 6} ${yBajo - 4} L ${x0 - largoTimon + 34} ${suelo - 60} L ${x0 - largoTimon + 34} ${suelo - 48} L ${x0 + 6} ${yBajo + 8} Z" opacity="0.75"/>
  </g>`);
  partes.push(
    `<rect x="${x0 - largoTimon - 30}" y="${suelo - 88}" width="38" height="32" rx="9" fill="${C.noche}"/>`,
  );
  // Roue jockey
  partes.push(
    `<rect x="${x0 - 66}" y="${suelo - 78}" width="13" height="56" rx="5" fill="${C.humo}"/>` +
      `<circle cx="${x0 - 59}" cy="${suelo - 16}" r="17" fill="${C.noche}"/>`,
  );

  // Châssis sous la caisse
  partes.push(
    `<rect x="${x0 - 6}" y="${yBajo}" width="${largo + 12}" height="16" rx="4" fill="${C.noche}" opacity="0.85"/>`,
  );

  // Caisse
  partes.push(
    `<path d="${cuerpo}" fill="url(#${idDegradado})" stroke="${piel.canto}" stroke-width="3"/>`,
  );

  // Bandeau bas aux couleurs de la marque, à hauteur d'œil sur une vue de profil
  const hBanda = Math.max(54, altoCaja * 0.19);
  partes.push(
    `<path d="M ${x0 + 3} ${yBajo - hBanda} L ${x1 - 2} ${yBajo - hBanda} L ${x1 - 2} ${yBajo} L ${x0 + 3} ${yBajo} Z" fill="${C.cuero}"/>` +
      `<line x1="${x0 + 3}" y1="${yBajo - hBanda}" x2="${x1 - 2}" y2="${yBajo - hBanda}" stroke="${C.noche}" stroke-width="2" opacity="0.3"/>`,
  );

  // Casquette de toit, débordante comme sur les vans réels : c'est elle qui
  // protège les aérations de la pluie.
  partes.push(
    `<path d="M ${x0 + retroceso + 10} ${yTecho - 14} L ${x1 + 12} ${yTecho - 14} L ${x1 + 12} ${yTecho + 6} L ${x0 + retroceso - 4} ${yTecho + 8} Z" fill="${piel.oscuro}"/>`,
  );

  // Porte de service à l'avant : le petit accès par lequel on attache le cheval.
  // C'est le détail qui distingue un van d'un fourgon bâché.
  const xPuerta = x0 + retroceso - 6;
  partes.push(
    `<rect x="${xPuerta}" y="${yTecho + 26}" width="46" height="${(altoCaja - hBanda - 44).toFixed(0)}" rx="8" fill="${piel.canto}" opacity="0.45" stroke="${piel.oscuro}" stroke-width="2"/>` +
      `<rect x="${xPuerta + 9}" y="${yTecho + 40}" width="28" height="34" rx="5" fill="${C.noche}" opacity="0.6"/>`,
  );

  // Aérations
  partes.push(
    ventanas
      .map(
        (v) =>
          `<rect x="${v.x.toFixed(1)}" y="${yVentana.toFixed(1)}" width="${v.w.toFixed(1)}" height="${hVentana.toFixed(1)}" rx="11" fill="${C.noche}" opacity="0.74"/>`,
      )
      .join(""),
  );

  // Silhouette dans la dernière aération : elle donne l'échelle en une image, ce
  // qu'aucune cote écrite ne fait aussi vite.
  const derniere = ventanas[ventanas.length - 1];
  const echelle = (hVentana * 0.94) / 100;
  partes.push(
    `<g transform="translate(${(derniere.x + derniere.w / 2 - 42 * echelle).toFixed(1)} ${(yVentana + hVentana * 0.05).toFixed(1)}) scale(${echelle.toFixed(3)})" fill="${C.arena}" opacity="0.5"><path d="${CABEZA_CABALLO}"/></g>`,
  );

  // Portes ou rampe arrière
  if (rampa) {
    partes.push(
      `<path d="M ${x1 - 2} ${yBajo - 8} L ${x1 + largoRampa} ${suelo - 8} L ${x1 + largoRampa} ${suelo + 12} L ${x1 - 2} ${yBajo + 14} Z" fill="${piel.bajo}" stroke="${piel.canto}" stroke-width="3"/>` +
        `<line x1="${x1 + 16}" y1="${yBajo + 4}" x2="${x1 + largoRampa - 18}" y2="${suelo - 2}" stroke="${piel.oscuro}" stroke-width="3" opacity="0.6"/>` +
        `<rect x="${x1 + largoRampa - 22}" y="${suelo - 14}" width="24" height="24" rx="6" fill="${C.cuero}" opacity="0.85"/>`,
    );
  } else {
    partes.push(
      `<line x1="${x1 - 5}" y1="${yTecho + 14}" x2="${x1 - 5}" y2="${yBajo - hBanda}" stroke="${piel.oscuro}" stroke-width="4"/>` +
        `<rect x="${x1 - 24}" y="${yBajo - hBanda - 74}" width="14" height="30" rx="4" fill="${piel.oscuro}"/>`,
    );
  }

  // Roues, garde-boue compris
  partes.push(
    ruedas
      .map(
        (cx) => `<g>
    <path d="M ${cx - hRueda - 20} ${yBajo + 12} Q ${cx} ${yBajo - 54} ${cx + hRueda + 20} ${yBajo + 12} Z" fill="${piel.oscuro}"/>
    <circle cx="${cx.toFixed(0)}" cy="${suelo - hRueda}" r="${hRueda}" fill="${C.noche}"/>
    <circle cx="${cx.toFixed(0)}" cy="${suelo - hRueda}" r="${hRueda - 19}" fill="${C.humo}" opacity="0.7"/>
    <circle cx="${cx.toFixed(0)}" cy="${suelo - hRueda}" r="11" fill="${C.arena}" opacity="0.85"/>
  </g>`,
      )
      .join(""),
  );

  const izquierda = x0 - largoTimon - 30;
  const derecha = x1 + largoRampa + 16;

  return {
    cuerpo: partes.join("\n  "),
    izquierda,
    derecha,
    ancho: derecha - izquierda,
    altura: -(yTecho - 20),
    defs: `<linearGradient id="${idDegradado}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${piel.alto}"/>
      <stop offset="1" stop-color="${piel.bajo}"/>
    </linearGradient>`,
  };
}

/**
 * Vignette de produit : fond sable, objet cadré large mais sans flottement.
 * Le dessin est mis à l'échelle pour occuper une part fixe de la largeur —
 * une remorque quatre chevaux et une remorque un cheval occupent donc la même
 * place dans la grille, et c'est la longueur relative qui se lit, pas la
 * distance à laquelle on aurait « photographié » chacune.
 */
function vistaProducto(opciones) {
  const d = dibujarRemolque(opciones);
  // Format 4:3, celui des photographies du catalogue. Une remorque est un objet
  // large : dans un carré, la grille devait soit la rétrécir, soit la rogner sur
  // les côtés — et c'est le timon ou le hayon qui sautait.
  const ANCHO = 1000;
  const ALTO = 750;
  const MARGEN = 0.9;

  // L'échelle se cale sur la contrainte la plus serrée des deux. Sans la borne
  // en hauteur, un quatre places à toit surélevé sortait du cadre par le haut,
  // puisque seule la largeur était mesurée.
  const escala = Math.min((ANCHO * MARGEN) / d.ancho, (ALTO * 0.72) / d.altura);
  const tx = ANCHO / 2 - (d.izquierda + d.ancho / 2) * escala;
  // Ligne de sol placée pour que l'objet soit centré verticalement : il monte
  // de `altura` au-dessus du sol, on pose donc le sol à mi-hauteur plus la
  // moitié de cette élévation, sinon le dessin flotte dans le haut du cadre.
  const ty = Math.min(ALTO * 0.84, ALTO / 2 + (d.altura * escala) / 2);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ANCHO} ${ALTO}" role="img">
  <defs>
    ${d.defs}
    <linearGradient id="fondo" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="${C.arena}"/>
    </linearGradient>
  </defs>
  <rect width="${ANCHO}" height="${ALTO}" fill="url(#fondo)"/>
  <line x1="0" y1="${ty}" x2="${ANCHO}" y2="${ty}" stroke="${C.borde}" stroke-width="3"/>
  <g transform="translate(${tx.toFixed(1)} ${ty}) scale(${escala.toFixed(4)})">
  ${d.cuerpo}
  </g>
</svg>
`;
}

/**
 * Vignette de catégorie : fond vert profond, intitulé posé en bas.
 * Les cartes de catégorie se regardent de loin et en grille ; il leur faut un
 * contraste que la vue produit sur fond clair n'a pas.
 */
function vistaCategoria({ titulo, ...opciones }) {
  const d = dibujarRemolque({ ...opciones, idDegradado: "caja" });
  const ANCHO = 1200;
  const ALTO = 800;

  const escala = (ANCHO * 0.82) / d.ancho;
  const tx = ANCHO / 2 - (d.izquierda + d.ancho / 2) * escala;
  const ty = ALTO * 0.62;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ANCHO} ${ALTO}" role="img">
  <defs>
    ${d.defs}
    <radialGradient id="halo" cx="0.5" cy="0.45" r="0.62">
      <stop offset="0" stop-color="#123a5c"/>
      <stop offset="1" stop-color="${C.noche}"/>
    </radialGradient>
  </defs>
  <rect width="${ANCHO}" height="${ALTO}" fill="url(#halo)"/>
  <line x1="0" y1="${ty}" x2="${ANCHO}" y2="${ty}" stroke="${C.arena}" stroke-width="2" opacity="0.16"/>
  <g transform="translate(${tx.toFixed(1)} ${ty}) scale(${escala.toFixed(4)})">
  ${d.cuerpo}
  </g>
  <rect x="0" y="${ALTO - 190}" width="${ANCHO}" height="190" fill="${C.noche}" opacity="0.55"/>
  <text x="64" y="${ALTO - 92}" font-family="Georgia, 'Times New Roman', serif" font-size="58" font-weight="700" fill="${C.arena}">${txt(titulo)}</text>
  <rect x="64" y="${ALTO - 62}" width="126" height="5" rx="2.5" fill="${C.laton}"/>
</svg>
`;
}

/**
 * Bandeau d'ouverture. Format très large, dessin poussé vers la droite : la
 * moitié gauche reste libre pour le titre et les boutons, qui se posent
 * par-dessus.
 */
function vistaHero() {
  // Caisse claire, et non verte : le ciel du bandeau est déjà vert nuit, une
  // remorque verte s'y fondrait. C'est le contraste qui fait exister l'objet
  // sur une image d'ouverture, pas la cohérence de teinte.
  const d = dibujarRemolque({
    caballos: 3,
    tandem: true,
    carroceria: "aluminio",
    rampa: false,
    techoElevado: true,
    idDegradado: "caja",
  });

  const ANCHO = 1920;
  const ALTO = 1080;
  const escala = (ANCHO * 0.52) / d.ancho;
  const tx = ANCHO * 0.62 - (d.izquierda + d.ancho / 2) * escala;
  const ty = ALTO * 0.8;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ANCHO} ${ALTO}" role="img">
  <defs>
    ${d.defs}
    <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0d2c46"/>
      <stop offset="0.55" stop-color="#001c30"/>
      <stop offset="1" stop-color="${C.noche}"/>
    </linearGradient>
  </defs>
  <rect width="${ANCHO}" height="${ALTO}" fill="url(#cielo)"/>

  <!-- Deux collines très basses : assez pour suggérer la campagne, assez peu
       pour concurrencer le texte posé par-dessus. -->
  <path d="M0 ${ALTO * 0.72} Q 480 ${ALTO * 0.63} 980 ${ALTO * 0.71} T ${ANCHO} ${ALTO * 0.68} L${ANCHO} ${ALTO} L0 ${ALTO} Z" fill="${C.brasa}" opacity="0.45"/>
  <path d="M0 ${ALTO * 0.81} Q 620 ${ALTO * 0.74} 1240 ${ALTO * 0.8} T ${ANCHO} ${ALTO * 0.78} L${ANCHO} ${ALTO} L0 ${ALTO} Z" fill="${C.brasa}" opacity="0.8"/>

  <g transform="translate(${tx.toFixed(1)} ${ty}) scale(${escala.toFixed(4)})">
  ${d.cuerpo}
  </g>
</svg>
`;
}

/**
 * Vignette d'accessoire. Les pièces détachées n'ont pas de silhouette commune :
 * plutôt qu'un dessin paramétré, chacune a son tracé, posé au centre du même
 * fond sable que les remorques. C'est le fond et le cadrage qui font tenir la
 * grille ensemble, pas la forme des objets.
 */
const ACCESORIOS = {
  "bola-enganche": `
    <circle cx="500" cy="380" r="96" fill="#3f4a57"/>
    <rect x="452" y="440" width="96" height="120" fill="#4e5a68"/>
    <path d="M380 560 h240 l34 96 h-308 Z" fill="#333d49"/>
    <rect x="356" y="656" width="288" height="46" rx="10" fill="#28313b"/>
    <circle cx="420" cy="679" r="13" fill="${C.arena}" opacity="0.5"/>
    <circle cx="580" cy="679" r="13" fill="${C.arena}" opacity="0.5"/>`,
  "rueda-repuesto": `
    <circle cx="500" cy="500" r="240" fill="${C.noche}"/>
    <circle cx="500" cy="500" r="176" fill="#3f4a57"/>
    <circle cx="500" cy="500" r="132" fill="#d7dee6"/>
    <circle cx="500" cy="500" r="40" fill="#98a3b0"/>
    ${Array.from({ length: 5 }, (_, i) => {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      return `<circle cx="${(500 + Math.cos(a) * 80).toFixed(0)}" cy="${(500 + Math.sin(a) * 80).toFixed(0)}" r="17" fill="#6d7a88"/>`;
    }).join("")}`,
  "rueda-jockey": `
    <rect x="470" y="200" width="60" height="360" rx="14" fill="#8a95a3"/>
    <rect x="430" y="180" width="140" height="46" rx="14" fill="${C.cuero}"/>
    <rect x="446" y="330" width="108" height="52" rx="12" fill="#4e5a68"/>
    <circle cx="500" cy="660" r="130" fill="${C.noche}"/>
    <circle cx="500" cy="660" r="82" fill="#5d6a78"/>
    <circle cx="500" cy="660" r="26" fill="${C.arena}" opacity="0.6"/>`,
  "piloto-trasero": `
    <rect x="300" y="330" width="400" height="330" rx="40" fill="#333d49"/>
    <rect x="330" y="362" width="340" height="88" rx="18" fill="#c9403a"/>
    <rect x="330" y="466" width="340" height="88" rx="18" fill="${C.laton}"/>
    <rect x="330" y="570" width="160" height="58" rx="14" fill="#d7dee6"/>
    <rect x="510" y="570" width="160" height="58" rx="14" fill="#7b8794"/>`,
  "cincha-seguridad": `
    <path d="M250 330 q250 -120 500 0 l0 70 q-250 -120 -500 0 Z" fill="${C.cuero}"/>
    <path d="M250 560 q250 -120 500 0 l0 70 q-250 -120 -500 0 Z" fill="${C.cuero}" opacity="0.75"/>
    <rect x="430" y="300" width="140" height="400" rx="22" fill="#3f4a57"/>
    <rect x="462" y="352" width="76" height="130" rx="14" fill="${C.arena}" opacity="0.85"/>
    <rect x="462" y="520" width="76" height="130" rx="14" fill="${C.arena}" opacity="0.55"/>`,
  "antirrobo": `
    <path d="M360 440 v-70 a140 140 0 0 1 280 0 v70" fill="none" stroke="#7b8794" stroke-width="56" stroke-linecap="round"/>
    <rect x="290" y="430" width="420" height="330" rx="46" fill="${C.cuero}"/>
    <circle cx="500" cy="580" r="54" fill="${C.noche}"/>
    <rect x="482" y="580" width="36" height="96" rx="12" fill="${C.noche}"/>`,
};

function vistaAccesorio(nombre) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" role="img">
  <defs>
    <linearGradient id="fondo" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="${C.arena}"/>
    </linearGradient>
  </defs>
  <rect width="1000" height="1000" fill="url(#fondo)"/>
  <ellipse cx="500" cy="820" rx="300" ry="26" fill="${C.noche}" opacity="0.09"/>
  ${ACCESORIOS[nombre]}
</svg>
`;
}

// --- Catalogue des visuels à produire ---------------------------------------

const PRODUCTOS = [
  { nom: "cl-touring-country-1", caballos: 1, carroceria: "poliester", rampa: true },
  { nom: "cl-touring-one", caballos: 1, carroceria: "aluminio" },
  { nom: "cl-gold-marathon", caballos: 2, carroceria: "teja", rampa: true },
  { nom: "cl-touring-jumping", caballos: 2, carroceria: "poliester" },
  // Gamme Cheval Liberté relevée chez Remolques Cuni. La rampe est dessinée sur
  // les modèles qui la portent de série (porte-rampe de 110 cm), et le tandem
  // sur ceux qui dépassent trois places, comme le reste du catalogue.
  { nom: "cl-gold-origins", caballos: 2, carroceria: "aluminio" },
  { nom: "cl-gold-one-origins", caballos: 1, carroceria: "poliester" },
  { nom: "cl-gold-3", caballos: 2, carroceria: "teja" },
  { nom: "cl-gold-hippomobile", caballos: 2, carroceria: "aluminio" },
  { nom: "cl-touring-xl", caballos: 2, carroceria: "grafito", rampa: true },
  { nom: "cl-multimax", caballos: 2, carroceria: "azul", rampa: true },
  { nom: "cl-maxi-2-duomax", caballos: 2, carroceria: "aluminio" },
  { nom: "cl-touring-country-2", caballos: 2, carroceria: "poliester", rampa: true },
  { nom: "cl-minimax", caballos: 3, carroceria: "poliester", tandem: true, rampa: true },
  { nom: "cl-optimax", caballos: 4, carroceria: "teja", tandem: true, rampa: true },
  { nom: "bockmann-champion-esprit", caballos: 2, carroceria: "aluminio", techoElevado: true },
  { nom: "bockmann-portax-k", caballos: 2, carroceria: "grafito", rampa: true },
  { nom: "ifor-williams-hb-403", caballos: 1, carroceria: "grafito" },
  { nom: "ifor-williams-hb-506", caballos: 2, carroceria: "aluminio", rampa: true, techoElevado: true },
  { nom: "ifor-williams-hb-511", caballos: 3, carroceria: "grafito", tandem: true, techoElevado: true },
  { nom: "humbaur-balios-spirit", caballos: 2, carroceria: "aluminio" },
  { nom: "humbaur-xanthos-aero", caballos: 2, carroceria: "azul", rampa: true, techoElevado: true },
  { nom: "humbaur-notos", caballos: 3, carroceria: "poliester", tandem: true },
  { nom: "fautras-oblic-x2", caballos: 2, carroceria: "azul", techoElevado: true },
  { nom: "fautras-oblic-x3", caballos: 3, carroceria: "teja", tandem: true, rampa: true, techoElevado: true },
  { nom: "fautras-provan-4", caballos: 4, carroceria: "aluminio", tandem: true, techoElevado: true },
  { nom: "barbieri-b2-plus", caballos: 2, carroceria: "poliester", rampa: true },
  { nom: "sirius-s700", caballos: 2, carroceria: "teja" },
  { nom: "sirius-s900", caballos: 3, carroceria: "poliester", tandem: true, rampa: true },
];

const CATEGORIAS = [
  { nom: "un-caballo", titulo: "Un caballo", caballos: 1, carroceria: "poliester", rampa: true },
  { nom: "dos-caballos", titulo: "Dos caballos", caballos: 2, carroceria: "teja", rampa: true },
  {
    nom: "tres-cuatro-caballos",
    titulo: "Tres y cuatro caballos",
    caballos: 4,
    tandem: true,
    carroceria: "aluminio",
    techoElevado: true,
  },
  { nom: "ocasion", titulo: "Ocasión", caballos: 2, carroceria: "grafito", rampa: true },
  { nom: "accesorios", titulo: "Accesorios y recambios", caballos: 1, carroceria: "azul" },
];

mkdirSync(SORTIE, { recursive: true });

let compte = 0;
for (const p of PRODUCTOS) {
  writeFileSync(path.join(SORTIE, `${p.nom}.svg`), vistaProducto(p), "utf-8");
  compte += 1;
}
for (const c of CATEGORIAS) {
  writeFileSync(path.join(SORTIE, `cat-${c.nom}.svg`), vistaCategoria(c), "utf-8");
  compte += 1;
}
for (const nombre of Object.keys(ACCESORIOS)) {
  writeFileSync(path.join(SORTIE, `acc-${nombre}.svg`), vistaAccesorio(nombre), "utf-8");
  compte += 1;
}
writeFileSync(path.join(SORTIE, "hero.svg"), vistaHero(), "utf-8");
compte += 1;

console.log(`${compte} visuels écrits dans public/images/remolques/`);
