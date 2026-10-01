/**
 * Illustre les fiches d'occasion avec les photographies du modèle de série.
 *
 *   node --env-file=.env.local --import tsx scripts/fotos-ocasion.ts [--ejecutar]
 *
 * POURQUOI CE N'EST PAS UN PIS-ALLER. Ces fiches empruntent déjà leurs
 * caractéristiques au modèle de série : un Böckmann Champion R d'occasion a les
 * cotes d'un Champion R. Leur emprunter aussi ses visuels est cohérent, et ce
 * sont les photographies des constructeurs, celles pour lesquelles
 * l'autorisation existe — pas celles du particulier qui a publié l'annonce.
 *
 * CE QUE ÇA N'EXCUSE PAS. Une photo de série n'est pas une photo du véhicule
 * vendu. Chaque fiche d'occasion l'annonce dans sa première section et promet
 * les vues réelles avant la vente ; cette promesse doit être tenue au moment de
 * traiter la demande, sans quoi l'acheteur découvre l'écart à la livraison.
 *
 * L'appariement passe par le champ `modelo` du lot d'occasion, qui désigne
 * déjà le modèle de série dont les caractéristiques ont été reprises. Aucune
 * correspondance n'est devinée ici.
 */
import { prisma } from "../src/server/prisma";
import { OCASION } from "./data/remolques/ocasion";

const EJECUTAR = process.argv.includes("--ejecutar");

/**
 * Modèle de série dont chaque occasion tire ses caractéristiques, et dont elle
 * tirera ses photos. La clé est le slug de l'occasion, la valeur le slug du
 * produit de série tel qu'il existe en base.
 */
const ORIGEN: Readonly<Record<string, string>> = {
  "oc-bk-champion-esprit-ch": "bockmann-champion-esprit",
  "oc-bk-champion-esprit-de": "bockmann-champion-esprit",
  "oc-bk-champion-r-de-1": "bk-champion-r",
  "oc-bk-champion-r-de-2": "bk-champion-r",
  "oc-bk-comfort-de-1": "bk-comfort",
  "oc-bk-comfort-de-2": "bk-comfort",
  "oc-bk-comfort-de-3": "bk-comfort",
  "oc-bk-master-de": "bk-master",
  "oc-bk-big-master-fr": "bk-big-master",
  "oc-bk-portax-e-de": "bk-portax-e-ska",
  "oc-bk-portax-l-ska-de": "bk-portax-l-ska",
  "oc-bk-duo-de-1": "bk-duo-esprit",
  "oc-bk-duo-de-2": "bk-duo-esprit",
  "oc-bk-duo-r-de": "bk-duo-r",
  "oc-cl-touring-one-de": "cheval-liberte-touring-one",
  "oc-cl-touring-country-de": "cheval-liberte-touring-country-2",
  "oc-cl-minimax-fr-1": "cheval-liberte-minimax",
  "oc-cl-minimax-fr-2": "cheval-liberte-minimax",
  "oc-iw-hb506-fr": "ifor-williams-hb-506",
  "oc-iw-hb506-de-1": "ifor-williams-hb-506",
  "oc-iw-hb506-de-2": "ifor-williams-hb-506",
  "oc-iw-hb403-fr-1": "ifor-williams-hb-403",
  "oc-iw-hb403-fr-2": "ifor-williams-hb-403",
  "oc-iw-hb403-fr-3": "ifor-williams-hb-403",
  "oc-hb-xanthos-aero-de": "humbaur-xanthos-aero",
};

async function main() {
  const slugsOcasion = OCASION.map((f) => f.slug);
  const slugsOrigen = [...new Set(Object.values(ORIGEN))];

  const [ocasiones, origenes] = await Promise.all([
    prisma.product.findMany({
      where: { slug: { in: slugsOcasion } },
      select: { id: true, slug: true, image: true },
    }),
    prisma.product.findMany({
      where: { slug: { in: slugsOrigen } },
      select: { slug: true, image: true, images: true },
    }),
  ]);

  const porSlug = new Map(origenes.map((o) => [o.slug, o]));

  console.log(
    EJECUTAR
      ? `Illustration de ${ocasiones.length} fiches d'occasion`
      : `Essai à blanc — ${ocasiones.length} fiches d'occasion`,
  );

  let hechos = 0;
  for (const ocasion of ocasiones) {
    const slugOrigen = ORIGEN[ocasion.slug];
    const origen = slugOrigen ? porSlug.get(slugOrigen) : undefined;

    if (!origen?.image) {
      console.log(`  ✗ ${ocasion.slug} : le modèle de série ${slugOrigen ?? "?"} n'a pas de photo`);
      continue;
    }
    // Une photographie de série ne remplace pas une photo réelle : on n'écrase
    // pas une fiche déjà illustrée, qui l'est peut-être avec les vraies vues.
    if (ocasion.image && !ocasion.image.endsWith(".svg")) {
      console.log(`  · ${ocasion.slug} : déjà illustrée, laissée en l'état`);
      continue;
    }

    console.log(`  ✓ ${ocasion.slug} ← ${slugOrigen}`);
    if (EJECUTAR) {
      await prisma.product.update({
        where: { id: ocasion.id },
        data: { image: origen.image, images: origen.images },
      });
    }
    hechos += 1;
  }

  console.log(
    EJECUTAR
      ? `\n${hechos} fiches illustrées depuis leur modèle de série.`
      : "\nRien n'a été écrit. Relancer avec --ejecutar pour appliquer.",
  );
}

main()
  .catch((error) => {
    console.error("ÉCHEC :", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
