/**
 * Applique la marge de `src/lib/margen.ts` aux prix déjà en base.
 *
 *   node --env-file=.env.local --import tsx scripts/aplicar-margen.ts [--ejecutar]
 *
 * Sans `--ejecutar`, le script se contente d'afficher chaque prix avant et
 * après. Rien n'est écrit tant que l'option n'est pas passée.
 *
 * ATTENTION, à lire avant de lancer avec --ejecutar. La marge s'applique au
 * prix inscrit en base, quel qu'il soit. Si ce prix est un prix de vente au
 * public — c'est le cas des références reprises d'un distributeur — le résultat
 * place le site AU-DESSUS de ce distributeur, que l'acheteur compare en une
 * recherche. La marge n'a de sens que sur un prix d'achat.
 *
 * Le prix barré (`oldPriceCents`) n'est pas touché : reprendre l'ancien prix
 * en prix barré afficherait une remise sur une hausse, ce qui est une pratique
 * commerciale trompeuse au sens du TRLGDCU.
 *
 * Relançable, mais PAS idempotent : chaque passage multiplie de nouveau. Le
 * script exige donc une confirmation explicite et journalise l'état d'avant
 * dans un fichier, pour pouvoir revenir en arrière.
 */
import { writeFileSync } from "node:fs";

import { prisma } from "../src/server/prisma";
import { MARGEN } from "../src/lib/margen";

const EJECUTAR = process.argv.includes("--ejecutar");

/** Pas d'arrondi, en euros, comme dans margen.ts. */
const REDONDEO_EUROS = 10;

function conMargen(centimos: number): number {
  const euros = centimos / 100;
  const redondeado = Math.ceil((euros * MARGEN) / REDONDEO_EUROS) * REDONDEO_EUROS;
  return Math.round(redondeado * 100);
}

async function main() {
  const productos = await prisma.product.findMany({
    where: { priceCents: { gt: 0 } },
    select: { id: true, slug: true, brand: true, name: true, priceCents: true, active: true },
    orderBy: [{ brand: "asc" }, { slug: "asc" }],
  });

  console.log(
    EJECUTAR
      ? `Application de la marge (×${MARGEN}) sur ${productos.length} fiches`
      : `Essai à blanc — marge ×${MARGEN} sur ${productos.length} fiches`,
  );
  console.log("");

  const respaldo: { slug: string; priceCents: number }[] = [];
  let totalAntes = 0;
  let totalDespues = 0;

  for (const p of productos) {
    const nuevo = conMargen(p.priceCents);
    totalAntes += p.priceCents;
    totalDespues += nuevo;
    respaldo.push({ slug: p.slug, priceCents: p.priceCents });

    console.log(
      `  ${p.active ? "●" : "○"} ${p.slug.padEnd(34)} ` +
        `${(p.priceCents / 100).toFixed(0).padStart(6)} € → ${(nuevo / 100).toFixed(0).padStart(6)} € ` +
        `(+${((nuevo - p.priceCents) / 100).toFixed(0)} €)`,
    );

    if (EJECUTAR) {
      await prisma.product.update({ where: { id: p.id }, data: { priceCents: nuevo } });
    }
  }

  const ruta = "prix-avant-marge.json";
  if (EJECUTAR) {
    // Sauvegarde des prix d'avant, pour pouvoir revenir en arrière : ce script
    // n'est pas idempotent et un second passage majorerait une seconde fois.
    writeFileSync(ruta, JSON.stringify(respaldo, null, 2), "utf8");
    console.log(`\nPrix d'avant sauvegardés dans ${ruta}`);
  }

  console.log(
    `\nTotal catalogue : ${(totalAntes / 100).toFixed(0)} € → ${(totalDespues / 100).toFixed(0)} €`,
  );
  if (!EJECUTAR) console.log("Rien n'a été écrit. Relancer avec --ejecutar pour appliquer.");
}

main()
  .catch((error) => {
    console.error("ÉCHEC :", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
