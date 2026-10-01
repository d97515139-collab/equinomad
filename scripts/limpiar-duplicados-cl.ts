/**
 * Supprime les fiches Cheval Liberté importées en double le 14 août 2026.
 *
 *   node --env-file=.env.local --import tsx scripts/limpiar-duplicados-cl.ts [--ejecutar]
 *
 * Contexte : le premier passage de `importer-remolques.ts` a créé une fiche
 * neuve par modèle, sans voir que le catalogue contenait déjà ces mêmes
 * remorques sous d'autres slugs, avec leurs prix et leurs URL indexées. Le
 * correctif a été de viser les fiches existantes — voir `slugExistente` dans
 * `data/remolques/tipos.ts`. Restent à retirer les doublons du premier passage.
 *
 * Ne supprime qu'une fiche qui remplit les trois conditions :
 *   1. son slug figure dans le lot avec un `slugExistente` renseigné ;
 *   2. la fiche qu'elle doublait existe bien ;
 *   3. elle ne porte ni commande, ni avis, ni mouvement de stock.
 *
 * Sans `--ejecutar`, le script se contente d'énumérer ce qu'il ferait.
 */
import { prisma } from "../src/server/prisma";
import { CHEVAL_LIBERTE } from "./data/remolques/cheval-liberte";

const EJECUTAR = process.argv.includes("--ejecutar");

async function main() {
  const candidatos = CHEVAL_LIBERTE.filter((f) => f.slugExistente).map((f) => ({
    duplicado: f.slug,
    original: f.slugExistente as string,
  }));

  console.log(
    EJECUTAR
      ? `Suppression de ${candidatos.length} doublons`
      : `Essai à blanc — ${candidatos.length} doublons candidats`,
  );

  let borrados = 0;
  for (const { duplicado, original } of candidatos) {
    const fila = await prisma.product.findUnique({
      where: { slug: duplicado },
      select: {
        id: true,
        _count: { select: { orderItems: true, reviews: true, stockMovements: true } },
      },
    });

    if (!fila) {
      console.log(`  · ${duplicado} : absent, rien à faire`);
      continue;
    }

    const originalExiste = await prisma.product.findUnique({
      where: { slug: original },
      select: { id: true },
    });
    if (!originalExiste) {
      console.log(`  ✗ ${duplicado} : la fiche d'origine ${original} est absente, on garde`);
      continue;
    }

    const { orderItems, reviews, stockMovements } = fila._count;
    if (orderItems + reviews + stockMovements > 0) {
      console.log(
        `  ✗ ${duplicado} : ${orderItems} commandes, ${reviews} avis, ` +
          `${stockMovements} mouvements de stock — on garde`,
      );
      continue;
    }

    if (EJECUTAR) {
      // Les sections partent en cascade avec le produit.
      await prisma.product.delete({ where: { id: fila.id } });
      borrados += 1;
    }
    console.log(`  ✓ ${duplicado} → doublait ${original}`);
  }

  console.log(EJECUTAR ? `\n${borrados} fiches supprimées.` : "\nRien n'a été supprimé.");
}

main()
  .catch((error) => {
    console.error("ÉCHEC :", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
