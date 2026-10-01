/**
 * Produit les versions bitmap du logo Equinomad, pour les usages qui ne savent
 * pas lire un composant React : les e-mails transactionnels, le balisage
 * Organization destiné à Google et l'icône d'application.
 *
 *   node scripts/generer-logos.mjs
 *
 * Les tracés et les couleurs viennent de src/components/brand/logo.json, comme
 * pour le composant Logo : une retouche de la marque se fait dans ce fichier
 * seul. Les tailles de sortie suivent src/components/brand/logoDimensions.ts.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const logo = JSON.parse(readFileSync(path.join(RACINE, "src/components/brand/logo.json"), "utf8"));
const { terracota, tinta } = logo.colors;

function complet({ claro }) {
  const nom = claro ? "#ffffff" : tinta;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${logo.width} ${logo.height}" width="${logo.width}" height="${logo.height}">
  <path d="${logo.symbol}" fill="${terracota}" fill-rule="evenodd"/>
  <path d="${logo.wordmark}" fill="${nom}" fill-rule="evenodd"/>
</svg>`;
}

function icone() {
  const { size, radius, transform } = logo.icon;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${terracota}"/>
  <path d="${logo.symbol}" transform="${transform}" fill="#ffffff" fill-rule="evenodd"/>
</svg>`;
}

mkdirSync(path.join(RACINE, "public", "images"), { recursive: true });

// Fond aplati pour les e-mails : beaucoup de clients de messagerie affichent
// les images sur un fond qu'ils choisissent eux-mêmes, et une transparence y
// devient une tache. L'icône garde ses coins transparents.
const sorties = [
  ["public/images/logo-full.png", complet({ claro: false }), { r: 255, g: 255, b: 255, alpha: 1 }, 1200],
  ["public/images/logo-full-light.png", complet({ claro: true }), { r: 0, g: 20, b: 36, alpha: 1 }, 1200],
  ["public/images/logo-icon.png", icone(), null, 512],
  ["src/app/icon.png", icone(), null, 512],
];

for (const [chemin, svg, fondo, ancho] of sorties) {
  let image = sharp(Buffer.from(svg), { density: 300 }).resize({ width: ancho });
  if (fondo) image = image.flatten({ background: fondo });
  const png = await image.png().toBuffer();
  writeFileSync(path.join(RACINE, chemin), png);
  const { width, height } = await sharp(png).metadata();
  console.log(`${chemin} — ${width}×${height}, ${Math.round(png.length / 1024)} Ko`);
}
