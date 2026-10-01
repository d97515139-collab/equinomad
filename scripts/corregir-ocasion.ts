/**
 * Remet d'aplomb les fiches de l'univers « ocasion ».
 *
 *   node --env-file=.env.local --import tsx scripts/corregir-ocasion.ts [--ejecutar]
 *
 * Trois défauts à corriger, tous constatés en base :
 *
 *   1. `condition` vaut « new » alors que les fiches sont rangées en occasion.
 *      Google Merchant lit ce champ : une occasion déclarée neuve fait rejeter
 *      l'offre, et un acheteur qui découvre l'écart a de quoi se retourner.
 *   2. `stock` vaut 6 sur des véhicules décrits comme des exemplaires uniques.
 *      Une occasion se vend une fois : le stock passe à 1.
 *   3. Les caractéristiques techniques sont absentes, alors que les
 *      descriptions citent déjà les masses. Elles sont reprises ici, complétées
 *      des dimensions du modèle neuf correspondant quand il en existe un.
 *
 * Le script ne publie rien : `active` n'est pas touché. La mise en ligne d'un
 * véhicule d'occasion suppose de savoir qu'il existe, et cela ne se déduit
 * d'aucune base de données.
 */
import { prisma } from "../src/server/prisma";
import { escribirEspecificaciones } from "../src/server/productSpecs";

const EJECUTAR = process.argv.includes("--ejecutar");

/**
 * Masses reprises des descriptions déjà en base ; dimensions reprises de la
 * fiche constructeur du modèle neuf. Un slug absent d'ici garde ses
 * caractéristiques vides plutôt que d'en recevoir d'approximatives.
 */
const CORRECCIONES: Record<
  string,
  { specs?: Parameters<typeof escribirEspecificaciones>[0]; nota: string }
> = {
  "fautras-oblic-x2-seminuevo": {
    // MMA et charge utile telles qu'annoncées dans la description de la fiche ;
    // dimensions intérieures du Fautras Oblic X2 de série.
    specs: {
      plazas: 2,
      mmaKg: 2700,
      taraKg: 920,
      cargaUtilKg: 1780,
      largoInteriorCm: 364,
      anchoInteriorCm: 190,
      altoInteriorCm: 225,
      suelo: "Polietileno imputrescible y antirruido",
    },
    nota: "masses de la fiche, dimensions du modèle de série",
  },
  "sirius-s700-seminuevo": {
    // La description donne MMA et charge utile, mais aucune dimension
    // intérieure n'est publiée pour ce modèle : la fiche reste sans tableau
    // technique plutôt que d'en recevoir un inventé.
    nota: "masses connues, dimensions introuvables : pas de tableau technique",
  },
};

async function main() {
  const grupo = await prisma.group.findUnique({ where: { slug: "ocasion" } });
  if (!grupo) throw new Error("L'univers « ocasion » est absent de la base.");

  const fichas = await prisma.product.findMany({
    where: { category: { groupId: grupo.id } },
    select: { id: true, slug: true, condition: true, stock: true, specs: true, active: true },
    orderBy: { slug: "asc" },
  });

  console.log(
    EJECUTAR
      ? `Correction de ${fichas.length} fiches d'occasion`
      : `Essai à blanc — ${fichas.length} fiches d'occasion`,
  );

  for (const ficha of fichas) {
    const correccion = CORRECCIONES[ficha.slug];
    const cambios: string[] = [];

    const datos: { condition?: string; stock?: number; specs?: string } = {};
    if (ficha.condition !== "used") {
      datos.condition = "used";
      cambios.push(`condition ${ficha.condition} → used`);
    }
    if (ficha.stock !== 1) {
      datos.stock = 1;
      cambios.push(`stock ${ficha.stock} → 1`);
    }
    if (correccion?.specs && ficha.specs === "{}") {
      datos.specs = escribirEspecificaciones(correccion.specs);
      cambios.push("caractéristiques ajoutées");
    }

    if (cambios.length === 0) {
      console.log(`  · ${ficha.slug} : rien à corriger`);
      continue;
    }

    console.log(`  ✓ ${ficha.slug} : ${cambios.join(", ")}`);
    if (correccion) console.log(`      (${correccion.nota})`);
    if (EJECUTAR) {
      await prisma.product.update({ where: { id: ficha.id }, data: datos });
    }
  }

  const enLinea = fichas.filter((f) => f.active).length;
  console.log(
    EJECUTAR
      ? `\nCorrigé. ${enLinea} de ces fiches sont en ligne ; « active » n'a pas été touché.`
      : "\nRien n'a été écrit. Relancer avec --ejecutar pour appliquer.",
  );
}

main()
  .catch((error) => {
    console.error("ÉCHEC :", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
