import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../src/server/prisma";
import { buildNewProductCopy, validateProductContent } from "../src/lib/productContent";

const EJECUTAR = process.argv.includes("--ejecutar");
const GROUP_SLUG = readFlag("--group") ?? "nuevos";
const CATEGORY_SLUG = readFlag("--category") ?? "un-caballo";

function readFlag(name: string): string | undefined {
  const prefix = `${name}=`;
  const flag = process.argv.find((arg) => arg.startsWith(prefix));
  return flag ? flag.slice(prefix.length).trim() : undefined;
}

function parseBullets(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

async function main() {
  const rows = await prisma.product.findMany({
    where: {
      category: { slug: CATEGORY_SLUG, group: { slug: GROUP_SLUG } },
    },
    select: {
      id: true,
      slug: true,
      name: true,
      brand: true,
      shortDescription: true,
      description: true,
      bullets: true,
      category: {
        select: {
          slug: true,
          label: true,
          labelEn: true,
        },
      },
    },
    orderBy: { slug: "asc" },
  });

  if (rows.length === 0) {
    throw new Error(`Aucun produit trouvé dans ${GROUP_SLUG}/${CATEGORY_SLUG}.`);
  }

  const generated = rows.map((row) =>
    buildNewProductCopy({
      slug: row.slug,
      name: row.name,
      brand: row.brand,
      categorySlug: row.category.slug,
      categoryLabel: row.category.label,
      categoryLabelEn: row.category.labelEn,
      shortDescription: row.shortDescription,
      description: row.description,
      bullets: parseBullets(row.bullets),
    }),
  );

  const anomalies = validateProductContent(generated);
  if (anomalies.length > 0) {
    console.error(`${anomalies.length} anomalie(s), rien n'a été écrit :`);
    for (const anomaly of anomalies) console.error(`  - ${anomaly}`);
    process.exitCode = 1;
    return;
  }

  console.log(
    EJECUTAR
      ? `Réécriture de ${generated.length} fiche(s) pour ${GROUP_SLUG}/${CATEGORY_SLUG}`
      : `Essai à blanc — ${generated.length} fiche(s) pour ${GROUP_SLUG}/${CATEGORY_SLUG}`,
  );

  for (const preview of generated.slice(0, 3)) {
    console.log(`\n[${preview.slug}]`);
    console.log(`  court : ${preview.shortDescription}`);
    console.log(`  bullets : ${(preview.bullets ?? []).join(" | ")}`);
  }

  if (!EJECUTAR) {
    console.log("\nRien n'a été écrit. Relancer avec --ejecutar pour appliquer.");
    return;
  }

  const backupDir = path.join(process.cwd(), ".tmp-backup");
  await mkdir(backupDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(
    backupDir,
    `nuevos-copy-${GROUP_SLUG}-${CATEGORY_SLUG}-${timestamp}.json`,
  );
  await writeFile(backupPath, JSON.stringify(rows, null, 2), "utf8");
  console.log(`\nSauvegarde : ${backupPath}`);

  await prisma.$transaction(
    async (tx) => {
      for (const entry of generated) {
        await tx.product.update({
          where: { slug: entry.slug },
          data: {
            shortDescription: entry.shortDescription,
            description: entry.description,
            shortDescriptionEn: entry.shortDescriptionEn,
            descriptionEn: entry.descriptionEn,
            shortDescriptionFr: entry.shortDescriptionFr ?? "",
            descriptionFr: entry.descriptionFr ?? "",
            shortDescriptionDe: entry.shortDescriptionDe ?? "",
            descriptionDe: entry.descriptionDe ?? "",
            shortDescriptionIt: entry.shortDescriptionIt ?? "",
            descriptionIt: entry.descriptionIt ?? "",
            bullets: JSON.stringify(entry.bullets ?? []),
            bulletsEn: JSON.stringify(entry.bulletsEn ?? []),
            bulletsFr: JSON.stringify(entry.bulletsFr ?? []),
            bulletsDe: JSON.stringify(entry.bulletsDe ?? []),
            bulletsIt: JSON.stringify(entry.bulletsIt ?? []),
          },
        });
      }
    },
    { timeout: 120_000, maxWait: 30_000 },
  );

  console.log(`\n${generated.length} fiche(s) mises à jour.`);
}

main()
  .catch((error) => {
    console.error("ÉCHEC :", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
