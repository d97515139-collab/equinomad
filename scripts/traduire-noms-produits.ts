import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Remplace les noms et caractéristiques mal traduits des produits (restés en
 * espagnol, ou remplacés par le message d'erreur du traducteur automatique).
 * À blanc par défaut : le rapport avant → après est écrit dans
 * .migration/rapport-traductions-produits.md. `--apply` sauvegarde les lignes
 * puis écrit tout en une seule transaction. Relancé, il ne trouve plus rien.
 *
 *   npx tsx scripts/traduire-noms-produits.ts            # à blanc
 *   npx tsx scripts/traduire-noms-produits.ts --apply    # écriture
 *
 * Les noms traduits viennent de scripts/data/noms-produits-traduits.json, relu
 * à la main ; un nom absent de cette table arrête le script.
 */
try {
  process.loadEnvFile(".env.local");
} catch {
  // Variables déjà présentes dans l'environnement.
}

const APPLY = process.argv.includes("--apply");
const LANGUES = ["En", "Fr", "De", "It"] as const;
type Champ = `name${(typeof LANGUES)[number]}` | `bullets${(typeof LANGUES)[number]}`;

async function main(): Promise<void> {
  const { prisma } = await import("../src/server/prisma");
  try {
    await corriger(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

async function corriger(prisma: (typeof import("../src/server/prisma"))["prisma"]): Promise<void> {
  const { besoinDeTraduction, traduireNom, traduirePuce } = await import("../src/server/productNameTranslations");

  const produits = await prisma.product.findMany({ orderBy: { slug: "asc" } });
  const changements: { id: string; slug: string; avant: (typeof produits)[number]; data: Partial<Record<Champ, string>> }[] = [];
  const bloquants: string[] = [];
  const lignes: string[] = [];

  for (const p of produits) {
    const data: Partial<Record<Champ, string>> = {};
    for (const langue of LANGUES) {
      const champNom = `name${langue}` as const;
      if (besoinDeTraduction(p[champNom])) {
        const nouveau = traduireNom(p.name, langue);
        if (!nouveau) bloquants.push(`${p.slug}.${champNom} : « ${p.name} » absent de la table`);
        else if (nouveau !== p[champNom]) {
          data[champNom] = nouveau;
          lignes.push(`| ${p.slug} | ${champNom} | ${p[champNom].slice(0, 60)} | ${nouveau} |`);
        }
      }
      const champPuces = `bullets${langue}` as const;
      if (besoinDeTraduction(p[champPuces])) {
        const source = JSON.parse(p.bullets) as string[];
        const traduites = source.map((puce) => traduirePuce(puce, langue));
        const inconnue = source.find((_, i) => traduites[i] === null);
        if (inconnue !== undefined) bloquants.push(`${p.slug}.${champPuces} : « ${inconnue} » sans traduction connue`);
        else {
          data[champPuces] = JSON.stringify(traduites);
          lignes.push(`| ${p.slug} | ${champPuces} | (erreur du traducteur) | ${traduites.join(" · ")} |`);
        }
      }
    }
    if (Object.keys(data).length > 0) changements.push({ id: p.id, slug: p.slug, avant: p, data });
  }

  const nbChamps = changements.reduce((n, c) => n + Object.keys(c.data).length, 0);
  console.log(APPLY ? "Mode écriture" : "Mode à blanc (ajouter --apply pour écrire)");
  console.log(`Produits à modifier : ${changements.length} ; champs : ${nbChamps}`);

  const dossier = path.join(process.cwd(), ".migration");
  await mkdir(dossier, { recursive: true });
  const rapport = path.join(dossier, "rapport-traductions-produits.md");
  await writeFile(
    rapport,
    `# Traductions de produits — rapport ${APPLY ? "d'écriture" : "à blanc"}\n\n` +
      `${changements.length} produits, ${nbChamps} champs.\n\n| Produit | Champ | Avant | Après |\n|---|---|---|---|\n${lignes.join("\n")}\n`,
    "utf8",
  );
  console.log(`Rapport : ${rapport}`);

  if (bloquants.length > 0) {
    console.error("Champs sans traduction disponible :");
    for (const b of bloquants) console.error(`  - ${b}`);
    throw new Error("Traductions manquantes : compléter scripts/data/noms-produits-traduits.json.");
  }
  if (changements.length === 0) {
    console.log("Rien à faire.");
    return;
  }
  if (!APPLY) return;

  const sauvegarde = path.join(dossier, `traductions-produits-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  await writeFile(sauvegarde, JSON.stringify(changements.map((c) => c.avant), null, 2), "utf8");
  console.log(`Sauvegarde : ${sauvegarde}`);

  await prisma.$transaction(
    async (tx) => {
      for (const c of changements) await tx.product.update({ where: { id: c.id }, data: c.data });
    },
    { timeout: 300_000, maxWait: 60_000 },
  );
  console.log("Écriture terminée.");
}

main().catch((erreur: unknown) => {
  console.error(erreur instanceof Error ? erreur.message : erreur);
  process.exitCode = 1;
});
