/**
 * Produit les versions bitmap du logo, pour les usages qui ne savent pas lire
 * un composant React : les e-mails transactionnels et le balisage Organization
 * destiné à Google.
 *
 *   node scripts/generer-logos.mjs
 *
 * La référence reste `src/components/brand/Logo.tsx`. Ce script en recopie le
 * tracé — il ne peut pas l'importer, parce que le composant s'appuie sur les
 * variables de police de la page, absentes ici. D'où la police nommée en dur
 * ci-dessous : Georgia est un serif présent partout et proche de Fraunces à
 * cette taille. Toute retouche de la marque doit donc passer par les deux
 * fichiers.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SORTIE = path.join(RACINE, "public", "images");

const CABEZA =
  "M10 44 L14 31 Q19 19 31 15 L33 4 L42 14 L50 3 L55 17 " +
  "Q67 28 71 47 L84 96 L60 96 L49 60 Q40 51 25 49 Q13 48 10 44 Z";

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Arial, Helvetica, sans-serif";

function logo({ claro }) {
  const escudo = claro ? "#ffffff" : "#e3000e";
  const silueta = claro ? "#e3000e" : "#ffffff";
  const letras = claro ? "#ffffff" : "#001424";
  // Sur fond sombre le rouge ne donne que 3,80:1, insuffisant pour un
  // descripteur de huit pixels ; le jaune y monte à 12,20:1.
  const descriptor = claro ? "#ffca2b" : "#e3000e";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 64" width="900" height="192">
  <rect x="0" y="4" width="56" height="56" rx="12" fill="${escudo}"/>
  <g transform="translate(15 13) scale(0.38)" fill="${silueta}"><path d="${CABEZA}"/></g>
  <rect x="0" y="60" width="56" height="4" rx="2" fill="${claro ? "#ffca2b" : "#001424"}"/>
  <text x="70" y="36" font-family="${SERIF}" font-size="30" font-weight="700" letter-spacing="-0.5" fill="${letras}">Remolque Caballos</text>
  <text x="72" y="52" font-family="${SANS}" font-size="8.4" font-weight="700" letter-spacing="2.4" fill="${descriptor}">REMOLQUES PARA CABALLOS</text>
</svg>`;
}

function sigle() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="512" height="512">
  <rect x="0" y="0" width="64" height="64" rx="14" fill="#e3000e"/>
  <g transform="translate(18 12) scale(0.42)" fill="#ffffff"><path d="${CABEZA}"/></g>
  <rect x="14" y="54" width="36" height="3" rx="1.5" fill="#001424"/>
</svg>`;
}

mkdirSync(SORTIE, { recursive: true });

// Fond aplati pour les e-mails : beaucoup de clients de messagerie affichent
// les images sur un fond qu'ils choisissent eux-mêmes, et une transparence y
// devient une tache. Le sigle, lui, garde son fond rouge plein, donc la
// transparence ne s'y voit pas.
const sorties = [
  ["logo-full.png", logo({ claro: false }), { r: 255, g: 255, b: 255, alpha: 1 }],
  ["logo-full-light.png", logo({ claro: true }), { r: 0, g: 20, b: 36, alpha: 1 }],
  ["logo-icon.png", sigle(), { r: 0, g: 0, b: 0, alpha: 0 }],
];

for (const [nombre, svg, fondo] of sorties) {
  const png = await sharp(Buffer.from(svg), { density: 300 })
    .flatten({ background: fondo })
    .png()
    .toBuffer();
  writeFileSync(path.join(SORTIE, nombre), png);
  console.log(`${nombre} — ${Math.round(png.length / 1024)} Ko`);
}
