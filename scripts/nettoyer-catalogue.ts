import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Nettoyage du catalogue hérité : désactive les annonces hors sujet ou sans
 * prix, et range chaque remorque dans le rayon de son état (neuf / occasion).
 * À blanc par défaut, rapport dans .migration/rapport-nettoyage-catalogue.md ;
 * `--apply` sauvegarde les lignes puis écrit tout en une seule transaction.
 * Relancé, il ne trouve plus rien à faire.
 *
 *   npx tsx scripts/nettoyer-catalogue.ts            # à blanc
 *   npx tsx scripts/nettoyer-catalogue.ts --apply    # écriture
 */
try {
  process.loadEnvFile(".env.local");
} catch {
  // Variables déjà présentes dans l'environnement.
}

const APPLY = process.argv.includes("--apply");

/** Annonces retirées de la vente, avec leur raison (reprise dans le rapport). */
const A_DESACTIVER: Readonly<Record<string, string>> = {
  "im-wallapop-1198201506": "véhicule motorisé (Fiat Ducato), pas une remorque",
  "im-wallapop-1296213252": "remorque utilitaire, pas pour chevaux",
  "im-wallapop-1114487781": "remorque pour voiture, pas pour chevaux",
  "im-wallapop-1294553957": "annonce de location, pas une vente",
  "im-wallapop-1250426727": "prix non renseigné (0 €)",
  "im-wallapop-1292382507": "prix non renseigné (0 €)",
  "im-wallapop-892484384": "prix non renseigné (0 €)",
};

async function main(): Promise<void> {
  const { prisma } = await import("../src/server/prisma");
  try {
    await nettoyer(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

async function nettoyer(prisma: (typeof import("../src/server/prisma"))["prisma"]): Promise<void> {
  const { planCatalogCleanup } = await import("../src/server/catalogCleanup");

  const produits = await prisma.product.findMany({
    select: { id: true, slug: true, name: true, priceCents: true, condition: true, active: true, categoryId: true },
    orderBy: { slug: "asc" },
  });
  const categories = (
    await prisma.category.findMany({ select: { id: true, slug: true, group: { select: { slug: true } } } })
  ).map((c) => ({ id: c.id, slug: c.slug, group: c.group.slug }));
  const plan = planCatalogCleanup(produits, categories, Object.keys(A_DESACTIVER));
  const parSlug = new Map(produits.map((p) => [p.slug, p]));
  const prix = (slug: string) => `${((parSlug.get(slug)?.priceCents ?? 0) / 100).toLocaleString("es-ES", { minimumFractionDigits: 2 })} €`;

  console.log(APPLY ? "Mode écriture" : "Mode à blanc (ajouter --apply pour écrire)");
  console.log(`Annonces à désactiver : ${plan.deactivate.length}`);
  console.log(`Remorques à changer de rayon : ${plan.moves.length}`);

  const rapport = [
    `# Nettoyage du catalogue — rapport ${APPLY ? "d'écriture" : "à blanc"}`,
    "",
    `## Annonces désactivées (${plan.deactivate.length})`,
    "",
    "Elles restent en base et se réactivent depuis le back-office.",
    "",
    "| Annonce | Prix | Raison |",
    "|---|---|---|",
    ...plan.deactivate.map((s) => `| ${parSlug.get(s)?.name} (${s}) | ${prix(s)} | ${A_DESACTIVER[s]} |`),
    "",
    `## Changements de rayon (${plan.moves.length})`,
    "",
    "| Annonce | Prix | Avant | Après |",
    "|---|---|---|---|",
    ...plan.moves.map((m) => `| ${parSlug.get(m.slug)?.name} (${m.slug}) | ${prix(m.slug)} | ${m.from} | ${m.to} |`),
    "",
  ].join("\n");
  const dossier = path.join(process.cwd(), ".migration");
  await mkdir(dossier, { recursive: true });
  const fichier = path.join(dossier, "rapport-nettoyage-catalogue.md");
  await writeFile(fichier, rapport, "utf8");
  console.log(`Rapport : ${fichier}`);

  if (plan.missing.length || plan.unmovable.length) {
    for (const s of plan.missing) console.error(`  - annonce introuvable : ${s}`);
    for (const s of plan.unmovable) console.error(`  - sans rayon équivalent : ${s}`);
    throw new Error("Plan incomplet : rien n'est écrit.");
  }
  if (plan.deactivate.length === 0 && plan.moves.length === 0) {
    console.log("Rien à faire.");
    return;
  }
  if (!APPLY) return;

  const touches = new Set([...plan.deactivate, ...plan.moves.map((m) => m.slug)]);
  const sauvegarde = path.join(dossier, `nettoyage-catalogue-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  await writeFile(sauvegarde, JSON.stringify(produits.filter((p) => touches.has(p.slug)), null, 2), "utf8");
  console.log(`Sauvegarde : ${sauvegarde}`);

  await prisma.$transaction(
    async (tx) => {
      await tx.product.updateMany({ where: { slug: { in: plan.deactivate } }, data: { active: false } });
      for (const m of plan.moves) await tx.product.update({ where: { slug: m.slug }, data: { categoryId: m.toId } });
    },
    { timeout: 300_000, maxWait: 60_000 },
  );
  console.log("Écriture terminée.");
}

main().catch((erreur: unknown) => {
  console.error(erreur instanceof Error ? erreur.message : erreur);
  process.exitCode = 1;
});
