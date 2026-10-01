/**
 * Garde en ligne uniquement les douze fiches validées par le client.
 *
 *   node --env-file=.env.local --import tsx scripts/retirer-tout-sauf-12.ts
 *   node --env-file=.env.local --import tsx scripts/retirer-tout-sauf-12.ts --ejecutar
 *
 * Le retrait passe par `active = false`, pas par une suppression. On peut donc
 * repartir proprement à l'import sans perdre les fiches existantes, ni leur
 * historique éventuel.
 */
import { buildWhitelistRetirementPlan } from "../src/lib/whitelistRetirement";
import { prisma } from "../src/server/prisma";

const EJECUTAR = process.argv.includes("--ejecutar");

const SLUGS_A_CONSERVER = [
  "cheval-liberte-gold-one-origins",
  "ifor-williams-hb-403",
  "cheval-liberte-touring-one",
  "bockmann-champion-esprit",
  "cheval-liberte-gold-3",
  "cheval-liberte-gold-hippomobile",
  "cheval-liberte-gold-marathon",
  "cheval-liberte-gold-origins",
  "ifor-williams-hb-506",
  "cheval-liberte-maxi-2-duomax",
  "cheval-liberte-multimax",
  "bockmann-portax-k",
] as const;

async function main(): Promise<void> {
  const produits = await prisma.product.findMany({
    select: { id: true, slug: true, active: true, brand: true, name: true },
    orderBy: [{ active: "desc" }, { brand: "asc" }, { name: "asc" }],
  });

  const plan = buildWhitelistRetirementPlan(
    produits.map((product) => ({ slug: product.slug, active: product.active })),
    SLUGS_A_CONSERVER,
  );

  if (plan.missingKeepSlugs.length > 0) {
    throw new Error(
      `Liste blanche incomplète en base : ${plan.missingKeepSlugs.join(", ")}`,
    );
  }

  console.log(
    EJECUTAR
      ? `Retrait réel — ${SLUGS_A_CONSERVER.length} fiches gardées`
      : `Essai à blanc — ${SLUGS_A_CONSERVER.length} fiches gardées`,
  );
  console.log(`  à laisser actives : ${plan.keepActive.length}`);
  console.log(`  à réactiver : ${plan.activate.length}`);
  console.log(`  à retirer de la boutique : ${plan.deactivate.length}`);
  console.log(`  déjà inactives hors liste : ${plan.alreadyInactive.length}`);

  if (!EJECUTAR) {
    for (const slug of plan.deactivate.map((item) => item.slug)) {
      const product = produits.find((item) => item.slug === slug);
      if (!product) continue;
      console.log(`  - retrait ${product.brand} — ${product.name} (${product.slug})`);
    }
    for (const slug of plan.activate.map((item) => item.slug)) {
      const product = produits.find((item) => item.slug === slug);
      if (!product) continue;
      console.log(`  - réactivation ${product.brand} — ${product.name} (${product.slug})`);
    }
    console.log("\nRien n'a été écrit. Relancer avec --ejecutar pour appliquer.");
    return;
  }

  await prisma.$transaction([
    prisma.product.updateMany({
      where: { slug: { in: plan.deactivate.map((item) => item.slug) } },
      data: { active: false },
    }),
    prisma.product.updateMany({
      where: { slug: { in: [...SLUGS_A_CONSERVER] } },
      data: { active: true },
    }),
  ]);

  console.log("\nRetrait appliqué.");
}

main()
  .catch((error) => {
    console.error("ÉCHEC :", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
