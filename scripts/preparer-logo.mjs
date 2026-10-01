/**
 * Prépare les déclinaisons du logo à partir du fichier fourni par le client.
 *
 *   node scripts/preparer-logo.mjs
 *
 * Entrée : public/marca/logo-origen.png — le logo tel qu'il a été livré, sur
 * fond blanc opaque, avec ses couleurs propres.
 *
 * Sorties, dans public/images/ :
 *   logo-full.png        fond transparent, lettrage encre — fonds clairs
 *   logo-full-light.png  fond transparent, lettrage blanc — fonds sombres
 *   logo-icon.png        le seul symbole, carré — favicon, balisage Organization
 *
 * Pourquoi reconstruire plutôt que détourer bêtement. Le fichier livré est
 * opaque, et sa tête de cheval est BLANCHE, creusée dans le chevron encre. Un
 * détourage qui rendrait tout le blanc transparent ferait donc disparaître le
 * fond ET la tête — ce qui est justement ce qu'on veut : sur fond clair la tête
 * laisse voir le blanc de la page, sur fond sombre elle laisse voir le sombre et
 * se lit comme un creux. Le même calcul d'alpha sert donc aux deux versions ;
 * seule la couleur du lettrage change.
 *
 * Les couleurs sont ramenées à celles de la charte au passage : le fichier livré
 * porte #001e3a et #da0212, à côté des #001424 et #e3000e du site. L'écart est
 * invisible isolément, mais un logo posé au-dessus d'un bouton rouge le
 * trahirait.
 */
import { mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORIGINE = path.join(RACINE, "public", "marca", "logo-origen.png");
const SORTIE = path.join(RACINE, "public", "images");

/** Couleurs de la charte, vers lesquelles le fichier livré est normalisé. */
const TINTA = [0x00, 0x14, 0x24];
const ROJO = [0xe3, 0x00, 0x0e];
const NIEVE = [0xff, 0xff, 0xff];

/**
 * Un pixel est rouge quand son canal rouge domine nettement les deux autres.
 * Le seuil de 40 laisse passer les bords adoucis du lettrage sans attraper les
 * gris de l'anti-crénelage de l'encre.
 */
function estRojo(r, g, b) {
  return r - Math.max(g, b) > 40;
}

/**
 * Reconstruit l'image avec un fond transparent.
 *
 * L'opacité vient de la distance au blanc : un pixel blanc devient transparent,
 * un pixel encre devient opaque, et tous les gris intermédiaires de
 * l'anti-crénelage gardent leur nuance. C'est ce qui évite l'escalier qu'un
 * seuil binaire laisserait sur les diagonales du chevron.
 */
async function reconstruire(couleurLettrage) {
  const { data, info } = await sharp(ORIGINE)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const sortie = Buffer.alloc(info.width * info.height * 4);

  for (let i = 0, j = 0; i < data.length; i += info.channels, j += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];

    if (estRojo(r, g, b)) {
      // Le rouge garde sa pleine opacité et prend la teinte de la charte.
      sortie[j] = ROJO[0];
      sortie[j + 1] = ROJO[1];
      sortie[j + 2] = ROJO[2];
      sortie[j + 3] = 255;
      continue;
    }

    // Luminance perçue : le vert pèse plus que le rouge, qui pèse plus que le
    // bleu. Sur un logo bicolore l'écart avec une moyenne simple est mince,
    // mais il se voit sur les bords adoucis des lettres.
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    sortie[j] = couleurLettrage[0];
    sortie[j + 1] = couleurLettrage[1];
    sortie[j + 2] = couleurLettrage[2];
    sortie[j + 3] = Math.round(255 - Math.min(255, Math.max(0, lum)));
  }

  return sharp(sortie, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png({ compressionLevel: 9 });
}

/**
 * Repère où finit le symbole et où commence le lettrage, en cherchant la plus
 * large colonne vide de la moitié gauche. Mesurer plutôt que coder une valeur
 * en dur : si le client relivre son logo à une autre taille, le découpage suit.
 */
async function limiteDuSimbolo() {
  const { data, info } = await sharp(ORIGINE).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const colonneVide = [];

  for (let x = 0; x < info.width; x++) {
    let encre = false;
    for (let y = 0; y < info.height && !encre; y++) {
      const i = (y * info.width + x) * info.channels;
      const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      if (lum < 230) encre = true;
    }
    colonneVide.push(!encre);
  }

  // La plus longue plage vide dans la moitié gauche sépare le signe du texte.
  let debut = -1;
  let meilleurDebut = 0;
  let meilleureLongueur = 0;

  for (let x = 0; x < Math.floor(info.width * 0.6); x++) {
    if (colonneVide[x]) {
      if (debut === -1) debut = x;
    } else if (debut !== -1) {
      if (x - debut > meilleureLongueur) {
        meilleureLongueur = x - debut;
        meilleurDebut = debut;
      }
      debut = -1;
    }
  }

  // Bornes verticales du symbole, pour le recadrer au plus juste.
  let haut = info.height;
  let bas = 0;
  let gauche = info.width;

  for (let x = 0; x < meilleurDebut; x++) {
    for (let y = 0; y < info.height; y++) {
      const i = (y * info.width + x) * info.channels;
      const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      if (lum < 230) {
        if (y < haut) haut = y;
        if (y > bas) bas = y;
        if (x < gauche) gauche = x;
      }
    }
  }

  return { gauche, derecha: meilleurDebut, haut, bas };
}

async function main() {
  if (!existsSync(ORIGINE)) {
    console.error(`Fichier source absent : ${ORIGINE}`);
    process.exitCode = 1;
    return;
  }

  mkdirSync(SORTIE, { recursive: true });

  await (await reconstruire(TINTA)).toFile(path.join(SORTIE, "logo-full.png"));
  console.log("logo-full.png — lettrage encre, fond transparent");

  await (await reconstruire(NIEVE)).toFile(path.join(SORTIE, "logo-full-light.png"));
  console.log("logo-full-light.png — lettrage blanc, fond transparent");

  // Le symbole seul, recadré puis posé au centre d'un carré avec une marge de
  // 8 % : sans elle, un favicon touche les bords de sa vignette.
  const { gauche, derecha, haut, bas } = await limiteDuSimbolo();
  const largeur = derecha - gauche;
  const hauteur = bas - haut;
  const cote = Math.max(largeur, hauteur);
  const marge = Math.round(cote * 0.08);

  const simbolo = await (await reconstruire(TINTA))
    .extract({ left: gauche, top: haut, width: largeur, height: hauteur })
    .toBuffer();

  await sharp({
    create: {
      width: cote + marge * 2,
      height: cote + marge * 2,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: simbolo, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(SORTIE, "logo-icon.png"));

  console.log(`logo-icon.png — symbole seul, ${cote + marge * 2} px de côté`);

  // Favicon. Next sert src/app/icon.png tel quel : on le pose en 512 px, la
  // taille que réclament les écrans d'accueil mobiles, et le navigateur réduit.
  //
  // Fond blanc plutôt que transparent, contrairement aux deux logos ci-dessus :
  // un onglet sombre avalerait un chevron encre détouré. Le blanc, lui, se voit
  // sur les deux thèmes de navigateur.
  const FAVICON = 512;
  const margeFavicon = Math.round(FAVICON * 0.12);

  await sharp({
    create: {
      width: FAVICON,
      height: FAVICON,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([
      {
        input: await sharp(simbolo)
          .resize({
            width: FAVICON - margeFavicon * 2,
            height: FAVICON - margeFavicon * 2,
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          })
          .toBuffer(),
        gravity: "center",
      },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(RACINE, "src", "app", "icon.png"));

  console.log(`icon.png — favicon ${FAVICON} px, fond blanc`);
}

main().catch((erreur) => {
  console.error(erreur);
  process.exitCode = 1;
});
