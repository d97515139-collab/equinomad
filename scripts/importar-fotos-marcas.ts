/**
 * Illustre les fiches produits avec les photographies des constructeurs.
 *
 *   node --env-file=.env.local --import tsx scripts/importar-fotos-marcas.ts [--forzar] [--seco]
 *
 * Généralise ce que `importar-fotos.ts` fait pour la seule gamme Cheval Liberté
 * servie par l'API de Cuni : ici, les adresses viennent de
 * `data/remolques/fotos.ts`, une par marque et par modèle.
 *
 * ATTENTION — ces images ne nous appartiennent pas. Leur reprise repose sur
 * l'autorisation que chaque fournisseur accorde, à obtenir par écrit avant
 * d'ajouter une marque au fichier de photos.
 *
 * Ce que fait le script, produit par produit :
 *   1. télécharge au plus six photos, avec en-tête de navigateur — les CDN
 *      refusent les requêtes nues ;
 *   2. rejette tout fichier de moins de 3 ko : c'est une page d'erreur
 *      déguisée, pas une image ;
 *   3. borne à 1600 px et recompresse en JPEG ;
 *   4. envoie sur Cloudinary, dans un dossier par marque et par produit ;
 *   5. écrit `image` (la vignette) et `images` (la galerie).
 *
 * Relançable : un produit déjà illustré par une photo est ignoré, sauf
 * `--forzar`. Une vignette SVG ne compte pas comme une photo : elle est
 * remplacée. Avec `--seco`, rien n'est téléchargé ni écrit.
 */
import sharp from "sharp";

import { prisma } from "../src/server/prisma";
import { isCloudinaryConfigured, uploadImage } from "../src/server/cloudinary";
import { BRAND } from "../src/config/brand";
import { FOTOS } from "./data/remolques/fotos";

const FORZAR = process.argv.includes("--forzar");
const SECO = process.argv.includes("--seco");

/** Au-delà, la fiche devient un diaporama que personne ne fait défiler. */
const MAX_FOTOS = 6;

/** Sous ce poids, le CDN a renvoyé une page d'erreur, pas une photographie. */
const MINIMO_BYTES = 3072;

/** Largeur maximale conservée : au-delà, on ne stocke que du poids inutile. */
const MAX_PX = 1600;

/** Dossier Cloudinary, une branche par marque puis par produit. */
function carpetaDe(marca: string, slug: string): string {
  const marcaSlug = marca
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${BRAND.cloudinaryFolder}/${marcaSlug}/${slug}`;
}

async function traerFoto(url: string): Promise<Buffer | null> {
  try {
    const respuesta = await fetch(url, {
      headers: {
        // Sans ces deux en-têtes, les CDN des constructeurs répondent 403.
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
        Referer: new URL(url).origin,
      },
    });
    if (!respuesta.ok) return null;
    const bruto = Buffer.from(await respuesta.arrayBuffer());
    if (bruto.byteLength < MINIMO_BYTES) return null;
    return sharp(bruto)
      .resize({ width: MAX_PX, height: MAX_PX, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82 })
      .toBuffer();
  } catch {
    return null;
  }
}

/** Une vignette SVG est un dessin, pas une photographie : elle se remplace. */
function yaTieneFoto(image: string | null): boolean {
  return Boolean(image) && !image!.endsWith(".svg");
}

async function main() {
  const slugs = Object.keys(FOTOS);
  if (slugs.length === 0) {
    console.log("Aucune photo déclarée dans data/remolques/fotos.ts.");
    return;
  }

  if (!SECO && !isCloudinaryConfigured()) {
    throw new Error("Cloudinary n'est pas configuré : les trois clés sont nécessaires.");
  }

  const productos = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    select: { id: true, slug: true, brand: true, image: true },
  });
  const porSlug = new Map(productos.map((p) => [p.slug, p]));

  console.log(SECO ? `Essai à blanc — ${slugs.length} produits` : `Illustration — ${slugs.length} produits`);

  let ilustrados = 0;
  let ignorados = 0;

  for (const slug of slugs) {
    const producto = porSlug.get(slug);
    if (!producto) {
      console.log(`  ✗ ${slug} : absent de la base`);
      continue;
    }
    if (yaTieneFoto(producto.image) && !FORZAR) {
      console.log(`  · ${slug} : déjà illustré, ignoré`);
      ignorados += 1;
      continue;
    }

    const urls = FOTOS[slug].slice(0, MAX_FOTOS);
    if (SECO) {
      console.log(`  · ${slug} : ${urls.length} photo(s) à récupérer`);
      continue;
    }

    const subidas: string[] = [];
    for (const [indice, url] of urls.entries()) {
      const foto = await traerFoto(url);
      if (!foto) {
        console.log(`      ✗ image ${indice + 1} refusée (erreur, ou fichier trop léger)`);
        continue;
      }
      const subida = await uploadImage(foto, {
        filename: `${slug}-${indice + 1}.jpg`,
        folder: carpetaDe(producto.brand, slug),
      });
      subidas.push(subida.url);
    }

    if (subidas.length === 0) {
      console.log(`  ✗ ${slug} : aucune photo exploitable, fiche inchangée`);
      continue;
    }

    await prisma.product.update({
      where: { id: producto.id },
      // La première photo devient la vignette, les suivantes la galerie.
      data: { image: subidas[0], images: JSON.stringify(subidas.slice(1)) },
    });
    console.log(`  ✓ ${slug} : ${subidas.length} photo(s)`);
    ilustrados += 1;
  }

  console.log(
    SECO
      ? "\nEssai à blanc terminé, rien n'a été téléchargé."
      : `\nTerminé : ${ilustrados} illustrés, ${ignorados} déjà pourvus.`,
  );
}

main()
  .catch((error) => {
    console.error("ÉCHEC :", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
