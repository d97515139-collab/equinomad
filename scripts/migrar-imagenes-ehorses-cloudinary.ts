/**
 * Copie sur Cloudinary les photos XXL des produits importés depuis ehorses.
 *
 * node --env-file=.env.local --import tsx scripts/migrar-imagenes-ehorses-cloudinary.ts
 * Ajouter --forzar pour remplacer aussi une galerie déjà hébergée sur Cloudinary.
 */
import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../src/server/prisma";
import { isCloudinaryConfigured, uploadImage } from "../src/server/cloudinary";
import { BRAND } from "../src/config/brand";

const FORZAR = process.argv.includes("--forzar");
const MAX_IMAGES = 6;
const HEADERS = {
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36",
  "accept-language": "es-ES,es;q=0.9,en;q=0.7",
};

function imageUrls(html: string): string[] {
  return [...new Set(
    [...html.matchAll(/https:\/\/cdn\.ehorses\.media\/image\/xxl\/anuncios\/[^"' )\\]+?\.(?:jpg|jpeg|png|webp)/gi)]
      .map((match) => match[0].replace(/&amp;/g, "&")),
  )].slice(0, MAX_IMAGES);
}

async function downloadImage(url: string): Promise<Buffer | null> {
  const response = await fetch(url, { headers: { ...HEADERS, referer: "https://www.ehorses.es/" } });
  if (!response.ok) return null;
  const source = Buffer.from(await response.arrayBuffer());
  if (source.byteLength < 3_072) return null;
  try {
    return await sharp(source)
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 84, progressive: true })
      .toBuffer();
  } catch {
    return null;
  }
}

async function main(): Promise<void> {
  const cloudinaryEnabled = isCloudinaryConfigured();
  const localRoot = path.join(process.cwd(), "public", "images", "ehorses");
  if (!cloudinaryEnabled) await mkdir(localRoot, { recursive: true });
  console.log(cloudinaryEnabled ? "Destination : Cloudinary" : "Destination : public/images/ehorses");

  const products = await prisma.product.findMany({
    where: { slug: { startsWith: "eh-" }, sourceRef: { startsWith: "https://www.ehorses.es/" } },
    select: { id: true, slug: true, image: true, images: true, sourceRef: true },
    orderBy: { slug: "asc" },
  });
  let updated = 0;
  let failed = 0;

  for (const [productIndex, product] of products.entries()) {
    if (!FORZAR && product.image?.startsWith("https://res.cloudinary.com/")) continue;
    if (!product.sourceRef) continue;

    if (cloudinaryEnabled && product.image?.startsWith("/images/ehorses/")) {
      let gallery: string[] = [];
      try {
        const parsed = JSON.parse(product.images) as unknown;
        gallery = Array.isArray(parsed) ? parsed.map(String) : [];
      } catch {
        gallery = [];
      }
      const localImages = [product.image, ...gallery]
        .filter((image) => image.startsWith("/images/ehorses/"))
        .slice(0, MAX_IMAGES);
      const uploaded: string[] = [];
      for (const [imageIndex, localImage] of localImages.entries()) {
        try {
          const buffer = await readFile(path.join(process.cwd(), "public", localImage));
          const result = await uploadImage(buffer, {
            filename: `${product.slug}-${imageIndex + 1}.jpg`,
            folder: `${BRAND.cloudinaryFolder}/ehorses/${product.slug}`,
          });
          uploaded.push(result.url);
        } catch (error) {
          console.log(`  ✗ photo locale ${imageIndex + 1}: ${error instanceof Error ? error.message : "échec"}`);
        }
      }
      if (uploaded.length > 0) {
        await prisma.product.update({
          where: { id: product.id },
          data: { image: uploaded[0], images: JSON.stringify(uploaded.slice(1)), active: true },
        });
        updated += 1;
        console.log(`✓ ${productIndex + 1}/${products.length} ${product.slug}: ${uploaded.length} photo(s) Cloudinary`);
        continue;
      }
    }

    const page = await fetch(product.sourceRef, { headers: HEADERS });
    if (!page.ok) {
      failed += 1;
      console.log(`✗ ${product.slug}: fiche HTTP ${page.status}`);
      continue;
    }

    const detailSources = imageUrls(await page.text());
    // Certaines annonces anciennes ne publient plus leur variante XXL. Leur
    // vignette reste une vraie photo : on la copie localement en dernier recours.
    const fallbackSource = product.image?.startsWith("https://cdn.ehorses.media/") ? [product.image] : [];
    const sources = [...new Set([...detailSources, ...fallbackSource])].slice(0, MAX_IMAGES);
    const uploaded: string[] = [];
    for (const [imageIndex, source] of sources.entries()) {
      const buffer = await downloadImage(source);
      if (!buffer) continue;
      try {
        if (cloudinaryEnabled) {
          const result = await uploadImage(buffer, {
            filename: `${product.slug}-${imageIndex + 1}.jpg`,
            folder: `${BRAND.cloudinaryFolder}/ehorses/${product.slug}`,
          });
          uploaded.push(result.url);
        } else {
          const productFolder = path.join(localRoot, product.slug);
          await mkdir(productFolder, { recursive: true });
          const filename = `${imageIndex + 1}.jpg`;
          await writeFile(path.join(productFolder, filename), buffer);
          uploaded.push(`/images/ehorses/${product.slug}/${filename}`);
        }
      } catch (error) {
        console.log(`  ✗ photo ${imageIndex + 1}: ${error instanceof Error ? error.message : "échec"}`);
      }
    }

    if (uploaded.length === 0) {
      failed += 1;
      await prisma.product.update({ where: { id: product.id }, data: { active: false } });
      console.log(`✗ ${product.slug}: aucune photo exploitable`);
      continue;
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { image: uploaded[0], images: JSON.stringify(uploaded.slice(1)), active: true },
    });
    updated += 1;
    console.log(`✓ ${productIndex + 1}/${products.length} ${product.slug}: ${uploaded.length} photo(s)`);
  }

  console.log(`Terminé : ${updated} produit(s) mis à jour, ${failed} échec(s).`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
