/**
 * Retire de la boutique les produits qui ne sont illustrés que par un dessin.
 *
 *   node --env-file=.env.local --import tsx scripts/retirar-sin-foto.ts
 *   node --env-file=.env.local --import tsx scripts/retirar-sin-foto.ts --restaurar
 *
 * Pourquoi. Une grille qui mêle photographies et illustrations ne tient pas
 * visuellement, quelle que soit la qualité des deux. Les fiches concernées
 * cumulent d'ailleurs trois manques : pas de visuel réel, un prix qui ne vient
 * d'aucune source, et des caractéristiques du même tonneau.
 *
 * Les produits sont DÉSACTIVÉS, pas supprimés. Ils sortent des grilles, du
 * moteur de recherche interne et du flux Merchant, mais gardent leurs avis,
 * leur stock et leur rattachement aux commandes déjà passées — une suppression
 * casserait l'historique. `--restaurar` les remet en ligne.
 *
 * Le critère est le préfixe du visuel : `/images/` désigne un fichier du dépôt,
 * donc un dessin ; une photographie vit sur Cloudinary et commence par https.
 */
import { prisma } from "../src/server/prisma";

const RESTAURAR = process.argv.includes("--restaurar");

/** Les dessins du dépôt ; les photographies sont des URL Cloudinary. */
const ES_DIBUJO = { image: { startsWith: "/images/" } };

async function main(): Promise<void> {
  const afectados = await prisma.product.findMany({
    where: ES_DIBUJO,
    include: { category: { include: { group: true } } },
    orderBy: [{ brand: "asc" }, { name: "asc" }],
  });

  if (afectados.length === 0) {
    console.log("Aucun produit illustré par un dessin.");
    return;
  }

  // `active` vaut exactement RESTAURAR : on retire en le mettant à false, on
  // remet en ligne en le mettant à true.
  const { count } = await prisma.product.updateMany({
    where: ES_DIBUJO,
    data: { active: RESTAURAR },
  });

  console.log(
    RESTAURAR
      ? `${count} produits remis en ligne.\n`
      : `${count} produits retirés de la boutique.\n`,
  );

  for (const producto of afectados) {
    console.log(`  ${producto.brand} — ${producto.name}`);
  }

  // État par catégorie. Le comptage se fait sur les lignes elles-mêmes : un
  // `_count` filtré demande la fonctionnalité d'aperçu `filteredRelationCount`,
  // absente ici — sans elle Prisma ignore silencieusement le `where` et renvoie
  // le total, ce qui donne un rapport faux.
  const activos = await prisma.product.findMany({
    where: { active: true },
    select: { category: { select: { slug: true, group: { select: { slug: true } } } } },
  });

  const conteo = new Map<string, number>();
  for (const producto of activos) {
    const clave = `${producto.category.group.slug}/${producto.category.slug}`;
    conteo.set(clave, (conteo.get(clave) ?? 0) + 1);
  }

  const grupos = await prisma.group.findMany({
    include: { categories: { orderBy: { position: "asc" } } },
    orderBy: { position: "asc" },
  });

  console.log("\nBoutique après l'opération :");
  for (const grupo of grupos) {
    const total = grupo.categories.reduce(
      (suma, c) => suma + (conteo.get(`${grupo.slug}/${c.slug}`) ?? 0),
      0,
    );
    console.log(`  [${grupo.slug}] ${grupo.label} — ${total} produit(s)`);
    for (const categoria of grupo.categories) {
      console.log(`     ${categoria.slug} — ${conteo.get(`${grupo.slug}/${categoria.slug}`) ?? 0}`);
    }
  }
}

main()
  .catch((erreur) => {
    console.error(erreur);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
