/**
 * Produit les versions bitmap du logo provisoire Equinomad, pour les usages qui
 * ne savent pas lire un composant React : les e-mails transactionnels, le
 * balisage Organization destiné à Google et l'icône d'application.
 *
 *   node scripts/generer-logos.mjs
 *
 * La référence reste `src/components/brand/Logo.tsx`. Ce script en recopie le
 * tracé — il ne peut pas l'importer, parce que le composant s'appuie sur les
 * variables de police de la page, absentes ici. D'où la police nommée en dur
 * ci-dessous : Georgia est un serif présent partout et proche de Fraunces à
 * cette taille. Toute retouche de la marque doit donc passer par les deux
 * fichiers. Les tailles de sortie suivent src/components/brand/logoDimensions.ts.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SERIF = "Georgia, 'Times New Roman', serif";
const NOMBRE = "Equinomad";

function logo({ claro }) {
  const letras = claro ? "#ffffff" : "#001424";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 64" width="300" height="64">
  <rect x="0" y="4" width="56" height="56" rx="12" fill="#e3000e"/>
  <text x="28" y="46" text-anchor="middle" font-family="${SERIF}" font-size="38" font-weight="700" fill="#ffffff">E</text>
  <text x="70" y="45" font-family="${SERIF}" font-size="34" font-weight="700" letter-spacing="-0.5" fill="${letras}">${NOMBRE}</text>
</svg>`;
}

function sigle() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect x="0" y="0" width="64" height="64" rx="14" fill="#e3000e"/>
  <text x="32" y="45" text-anchor="middle" font-family="${SERIF}" font-size="40" font-weight="700" fill="#ffffff">E</text>
</svg>`;
}

mkdirSync(path.join(RACINE, "public", "images"), { recursive: true });

// Fond aplati pour les e-mails : beaucoup de clients de messagerie affichent
// les images sur un fond qu'ils choisissent eux-mêmes, et une transparence y
// devient une tache. Le sigle, lui, garde son fond rouge plein, donc la
// transparence ne s'y voit pas.
const sorties = [
  ["public/images/logo-full.png", logo({ claro: false }), { r: 255, g: 255, b: 255, alpha: 1 }, 1200],
  ["public/images/logo-full-light.png", logo({ claro: true }), { r: 0, g: 20, b: 36, alpha: 1 }, 1200],
  ["public/images/logo-icon.png", sigle(), { r: 0, g: 0, b: 0, alpha: 0 }, 512],
  ["src/app/icon.png", sigle(), { r: 0, g: 0, b: 0, alpha: 0 }, 512],
];

for (const [chemin, svg, fondo, ancho] of sorties) {
  const png = await sharp(Buffer.from(svg), { density: 600 })
    .resize({ width: ancho })
    .flatten({ background: fondo })
    .png()
    .toBuffer();
  writeFileSync(path.join(RACINE, chemin), png);
  console.log(`${chemin} — ${Math.round(png.length / 1024)} Ko`);
}
