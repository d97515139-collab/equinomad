/**
 * Remplace les dessins des remorques Cheval Liberté par des photographies.
 *
 *   node --env-file=.env.local --import tsx scripts/importar-fotos.ts
 *
 * Source : l'API Store de remolquescuni.com, distributeur espagnol de la
 * marque. Les visuels sont ceux du constructeur, diffusés par son réseau.
 *
 * ATTENTION — ces images ne nous appartiennent pas. Leur usage relève de
 * l'autorisation que Cheval Liberté accorde à ses revendeurs, à obtenir par
 * écrit avant la mise en ligne. Le script est fait pour être rejoué le jour où
 * la marque livrera ses propres fichiers : seul FUENTE change.
 *
 * Ce qu'il fait, modèle par modèle :
 *   1. lit les quatre rayons « caballos » de l'API ;
 *   2. rapproche chaque modèle du produit en base par un fragment de son nom ;
 *   3. télécharge au plus six photos, les borne à 1600 px et les recompresse ;
 *   4. les envoie sur Cloudinary, avec repli sur public/images/productos/ si le
 *      compte est indisponible ;
 *   5. écrit `image` (la vignette) et `images` (la galerie).
 *
 * Le CDN de WordPress refuse les requêtes sans en-tête de navigateur, d'où
 * l'user-agent et le referer. Tout fichier de moins de 3 ko est une page
 * d'erreur déguisée, et il est rejeté.
 *
 * Relançable : un produit déjà illustré par une photo est ignoré, à moins de
 * passer --forzar.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

import { prisma } from "../src/server/prisma";
import { isCloudinaryConfigured, uploadImage } from "../src/server/cloudinary";

const SALIDA_LOCAL = path.join(process.cwd(), "public", "images", "productos");
const FUENTE = "https://remolquescuni.com/wp-json/wc/store/products";
const RAYONS = [
  "remolques-caballos-van",
  "remolques-para-dos-caballos",
  "remolque-tres-cuatro-caballos",
  "caballos",
];

const NAVEGADOR = {
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/131.0 Safari/537.36",
  referer: "https://remolquescuni.com/",
};

/** Six vues suffisent : au-delà, la galerie répète les mêmes angles. */
const MAX_FOTOS = 6;

/** Le composant produit n'affiche jamais plus large ; le reste serait du poids. */
const ANCHO = 1600;

const FORZAR = process.argv.includes("--forzar");

/**
 * Rapprochement entre nos produits et les modèles du distributeur : slug en
 * base, puis fragment du titre chez la source, en minuscules. Une table
 * explicite plutôt qu'un appariement automatique — « Touring One » est contenu
 * dans « Gold One Origins », et l'approximation mélangerait les deux.
 */
const CORRESPONDENCIAS: ReadonlyArray<readonly [string, string]> = [
  ["cheval-liberte-gold-one-origins", "gold one origins"],
  ["cheval-liberte-gold-origins", "van para 2 caballos gold origins"],
  ["cheval-liberte-gold-3", "gold 3"],
  ["cheval-liberte-gold-hippomobile", "gold hippomobile"],
  ["cheval-liberte-touring-xl", "touring xl"],
  ["cheval-liberte-multimax", "multimax"],
  ["cheval-liberte-maxi-2-duomax", "maxi 2"],
  ["cheval-liberte-minimax", "minimax"],
  ["cheval-liberte-optimax", "optimax"],
  ["cheval-liberte-touring-country-2", "2 caballos touring country"],
  ["cheval-liberte-touring-jumping", "touring jumping"],
  ["cheval-liberte-touring-one", "1 caballo y medio touring one"],
];

interface ModeloFuente {
  id: number;
  name: string;
  images?: Array<{ src: string; alt?: string }>;
}

const normalizar = (valor: string): string =>
  valor
    .replace(/&#8211;/g, "-")
    .replace(/&[a-z]+;/g, " ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function leerCatalogo(): Promise<ModeloFuente[]> {
  const vistos = new Map<number, ModeloFuente>();

  for (const rayon of RAYONS) {
    const respuesta = await fetch(`${FUENTE}?category=${rayon}&per_page=100`, {
      headers: NAVEGADOR,
    });
    if (!respuesta.ok) {
      console.log(`  ! rayon ${rayon} : HTTP ${respuesta.status}`);
      continue;
    }
    for (const modelo of (await respuesta.json()) as ModeloFuente[]) {
      if (!vistos.has(modelo.id)) vistos.set(modelo.id, modelo);
    }
    // Hébergement mutualisé côté distributeur : on espace les requêtes.
    await esperar(700);
  }

  return [...vistos.values()];
}

/** Télécharge et recompresse une photo. Renvoie null si la source ne répond pas. */
async function traerFoto(url: string): Promise<Buffer | null> {
  const respuesta = await fetch(url, { headers: NAVEGADOR });
  if (!respuesta.ok) return null;

  const bruto = Buffer.from(await respuesta.arrayBuffer());
  // Une page d'erreur pèse quelques centaines d'octets ; une photo, jamais.
  if (bruto.length < 3000) return null;

  return sharp(bruto)
    .resize({ width: ANCHO, withoutEnlargement: true })
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .toBuffer();
}

async function main(): Promise<void> {
  const conCloudinary = isCloudinaryConfigured();
  console.log(
    conCloudinary
      ? "Cloudinary configuré : les photos y seront hébergées."
      : "Cloudinary absent : repli sur public/images/productos/.",
  );
  if (!conCloudinary) mkdirSync(SALIDA_LOCAL, { recursive: true });

  console.log("\nLecture du catalogue distributeur…");
  const modelos = await leerCatalogo();
  console.log(`${modelos.length} modèles lus\n`);

  let productosTratados = 0;
  let totalFotos = 0;

  for (const [slug, fragmento] of CORRESPONDENCIAS) {
    const producto = await prisma.product.findUnique({ where: { slug } });
    if (!producto) {
      console.log(`! ${slug} — absent de la base`);
      continue;
    }

    if (!FORZAR && producto.image && !producto.image.startsWith("/images/remolques/")) {
      console.log(`· ${slug} — déjà illustré, ignoré`);
      continue;
    }

    const modelo = modelos.find((m) => normalizar(m.name).includes(fragmento));
    if (!modelo) {
      console.log(`! ${slug} — aucun modèle nommé « ${fragmento} » chez la source`);
      continue;
    }

    const fuentes = (modelo.images ?? []).slice(0, MAX_FOTOS);
    const guardadas: string[] = [];

    for (const [indice, imagen] of fuentes.entries()) {
      const foto = await traerFoto(imagen.src);
      if (!foto) {
        console.log(`  ${slug}-${indice + 1} — source injoignable`);
        continue;
      }

      if (conCloudinary) {
        try {
          const subida = await uploadImage(foto, { filename: `${slug}-${indice + 1}.jpg` });
          guardadas.push(subida.url);
          console.log(`  ${slug}-${indice + 1} — Cloudinary, ${Math.round(subida.bytes / 1024)} ko`);
        } catch (erreur) {
          console.log(`  ${slug}-${indice + 1} — refus Cloudinary : ${(erreur as Error).message}`);
        }
      } else {
        const nombre = `${slug}-${indice + 1}.jpg`;
        writeFileSync(path.join(SALIDA_LOCAL, nombre), foto);
        guardadas.push(`/images/productos/${nombre}`);
        console.log(`  ${nombre} — local, ${Math.round(foto.length / 1024)} ko`);
      }

      await esperar(250);
    }

    if (guardadas.length === 0) {
      console.log(`! ${slug} — aucune photo, le dessin est conservé\n`);
      continue;
    }

    await prisma.product.update({
      where: { slug },
      data: {
        image: guardadas[0],
        // La vignette ne se répète pas dans la galerie : elle est déjà affichée
        // au-dessus de la fiche.
        images: JSON.stringify(guardadas.slice(1)),
      },
    });

    productosTratados += 1;
    totalFotos += guardadas.length;
    console.log(`✓ ${slug} — ${guardadas.length} photo(s)\n`);
  }

  console.log(`${productosTratados} produits illustrés, ${totalFotos} photos au total`);

  const enDibujo = await prisma.product.count({
    where: { image: { startsWith: "/images/remolques/" } },
  });
  console.log(`${enDibujo} produits restent en dessin`);
}

main()
  .catch((erreur) => {
    console.error(erreur);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
