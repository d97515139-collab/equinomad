/**
 * Importe au catalogue les remorques relevées sur les sites des constructeurs.
 *
 *   node --env-file=.env.local --import tsx scripts/importer-remolques.ts [--dry-run]
 *
 * Sources : les pages officielles de Cheval Liberté, Böckmann, Ifor Williams,
 * Fautras et Humbaur. Seules les données factuelles en sont reprises — masses,
 * dimensions, plancher, freinage, nombre de places. Les textes sont rédigés
 * ici : recopier la prose d'un constructeur exposerait au grief de contrefaçon
 * et ferait surtout du contenu dupliqué, que les moteurs déclassent.
 *
 * Les photographies ne sont PAS rapatriées par ce script. C'est un étage
 * distinct, qui attend l'accord écrit de chaque marque.
 *
 * Le prix vient de `data/remolques/precios.ts`, majoré de la marge unique
 * définie dans `src/lib/margen.ts`. Un slug absent de cette table entre en
 * « consultar precio » plutôt qu'avec un montant que personne n'a validé : la
 * fiche s'affiche, mais le panier et la commande la refusent.
 *
 * ADDITIF : le script ne supprime ni ne désactive aucun produit existant. Les
 * références importées portent un préfixe de slug par marque (cl-, bk-, iw-,
 * ft-, hb-) pour rester repérables et se retirer d'un seul coup si besoin.
 *
 * Relançable : chaque produit passe par un upsert sur son slug. Les sections de
 * description sont remplacées en bloc à chaque passage.
 */
import { prisma } from "../src/server/prisma";
import { escribirEspecificaciones, leerEspecificaciones } from "../src/server/productSpecs";
import { BOCKMANN } from "./data/remolques/bockmann";
import { CHEVAL_LIBERTE } from "./data/remolques/cheval-liberte";
import { FAUTRAS_LOTE } from "./data/remolques/fautras";
import { HUMBAUR_LOTE } from "./data/remolques/humbaur";
import { IFOR_WILLIAMS } from "./data/remolques/ifor-williams";
import { OCASION } from "./data/remolques/ocasion";
import { PRECIOS, precioConMargen } from "./data/remolques/precios";
import type { FichaRemolque } from "./data/remolques/tipos";

const LOTES: readonly (readonly FichaRemolque[])[] = [
  CHEVAL_LIBERTE,
  BOCKMANN,
  IFOR_WILLIAMS,
  FAUTRAS_LOTE,
  HUMBAUR_LOTE,
  OCASION,
];
const SECO = process.argv.includes("--dry-run");

/**
 * Les fiches entrent DÉSACTIVÉES, sauf `--publicar`.
 *
 * Ce n'est pas de la prudence de principe. Une fiche sans prix vaut zéro euro
 * dans la colonne `priceCents`, et c'est `saleMode` qui la protège du panier.
 * Or ce champ n'existe que depuis la migration : tant que le code déployé ne le
 * lit pas, il afficherait un bouton d'achat sur une remorque à 0 €. Publier
 * d'abord et corriger ensuite reviendrait à ouvrir cette fenêtre en production.
 *
 * L'ordre sûr est donc : importer désactivé, déployer le code, puis activer.
 */
const PUBLICAR = process.argv.includes("--publicar");

/** Univers par défaut, quand la fiche n'en déclare pas. */
const UNIVERSO_POR_DEFECTO = "nuevos";

/**
 * Le nombre de places décide de la catégorie. Trois places et plus tombent
 * dans la même, conformément à la structure du catalogue.
 */
function slugCategoria(plazas: number): string {
  if (plazas <= 1) return "un-caballo";
  if (plazas === 2) return "dos-caballos";
  return "tres-cuatro-caballos";
}

/**
 * Taxonomie Google des remorques. Une remorque n'est pas un accessoire : la
 * déclarer ailleurs ferait refuser la fiche par Merchant Center.
 */
const GOOGLE_REMOLQUE = "Vehículos y piezas > Vehículos > Vehículos de motor > Remolques";

/**
 * Description longue reconstituée depuis les sections.
 *
 * Le texte n'est donc rédigé qu'une fois. La page produit affiche les sections
 * et masque ce champ ; Google Merchant, lui, ne lit que `description` et exige
 * entre 1 100 et 3 800 caractères — d'où cette concaténation plutôt qu'une
 * seconde saisie qui divergerait au premier correctif.
 */
function descripcionDesdeSecciones(
  secciones: readonly { heading: string; body: string }[],
): string {
  return secciones.map((seccion) => `${seccion.heading}\n${seccion.body}`).join("\n\n");
}

async function importar(
  ficha: FichaRemolque,
  categorias: ReadonlyMap<string, string>,
): Promise<"creado" | "actualizado" | "omitido"> {
  const universo = ficha.universo ?? UNIVERSO_POR_DEFECTO;
  const slugCat = slugCategoria(ficha.specs.plazas);
  // La clé porte l'univers : « ocasion/dos-caballos » et « nuevos/dos-caballos »
  // sont deux catégories distinctes qui partagent leur slug.
  const categoryId = categorias.get(`${universo}/${slugCat}`);
  if (!categoryId) {
    console.error(`  ✗ ${ficha.slug} : catégorie « ${universo}/${slugCat} » absente de la base.`);
    return "omitido";
  }

  // La fiche visée : celle qui existe déjà au catalogue quand ce modèle y
  // figure sous un autre nom, sinon une fiche neuve au slug préfixé.
  const slugDestino = ficha.slugExistente ?? ficha.slug;

  const existente = await prisma.product.findUnique({
    where: { slug: slugDestino },
    select: { id: true, priceCents: true, saleMode: true, active: true },
  });

  // Trois cas, dans cet ordre de priorité :
  //   1. la fiche existe déjà avec un prix — on n'y touche pas. Ce prix a été
  //      arrêté par l'exploitant, et un import de caractéristiques n'a aucune
  //      raison de le remettre en cause ;
  //   2. la table des prix en donne un — on l'applique avec la marge ;
  //   3. aucun des deux — la fiche entre en « consultar precio ».
  // Un véhicule d'occasion porte son prix sur sa propre fiche : il se négocie à
  // l'unité et n'a pas sa place dans la table des tarifs, qui suit les modèles
  // de série. La marge s'y applique de la même façon.
  const euros = ficha.precioEuros ?? PRECIOS[ficha.slug];
  let datosPrecio: { priceCents: number; saleMode: string };
  if (existente && existente.priceCents > 0) {
    datosPrecio = { priceCents: existente.priceCents, saleMode: existente.saleMode };
  } else if (euros !== undefined) {
    datosPrecio = { priceCents: precioConMargen(euros), saleMode: "cart" };
  } else {
    datosPrecio = { priceCents: 0, saleMode: "quote" };
  }

  const datos = {
    categoryId,
    brand: ficha.brand,
    name: ficha.name,
    nameEn: ficha.nameEn,
    sku: ficha.sku,
    shortDescription: ficha.shortDescription,
    shortDescriptionEn: ficha.shortDescriptionEn,
    description: descripcionDesdeSecciones(ficha.sections),
    descriptionEn: descripcionDesdeSecciones(
      ficha.sections.map((s) => ({ heading: s.headingEn, body: s.bodyEn })),
    ),
    bullets: JSON.stringify(ficha.bullets),
    bulletsEn: JSON.stringify(ficha.bulletsEn),
    specs: escribirEspecificaciones(ficha.specs),
    sourceRef: ficha.sourceRef,
    // Google Merchant lit ce champ : une occasion déclarée neuve fait rejeter
    // l'offre, et l'acheteur qui découvre l'écart a de quoi se retourner.
    condition: universo === "ocasion" ? "used" : "new",
    // Un véhicule d'occasion est un exemplaire unique : il se vend une fois.
    ...(universo === "ocasion" ? { stock: 1 } : {}),
    googleProductCategory: GOOGLE_REMOLQUE,
    ...datosPrecio,
  };

  if (SECO) {
    const destino = ficha.slugExistente ? `${slugDestino} (enrichie)` : `${slugDestino} (neuve)`;
    const precio = datos.priceCents > 0 ? `${(datos.priceCents / 100).toFixed(0)} €` : "consultar";
    console.log(`  · ${destino.padEnd(46)} ${slugCat.padEnd(21)} ${precio}`);
    return "omitido";
  }

  // `active` n'est posé qu'à la création, ou quand on demande explicitement la
  // publication : un rejeu de l'import ne doit pas remettre en ligne une fiche
  // que l'exploitant a retirée à la main depuis le back-office.
  const producto = await prisma.product.upsert({
    where: { slug: slugDestino },
    create: { slug: slugDestino, ...datos, active: PUBLICAR },
    update: PUBLICAR ? { ...datos, active: true } : datos,
  });

  // Les sections se remplacent en bloc : plus simple et plus sûr qu'un
  // rapprochement titre par titre, et rien d'autre ne les référence.
  await prisma.productSection.deleteMany({ where: { productId: producto.id } });
  if (ficha.sections.length > 0) {
    await prisma.productSection.createMany({
      data: ficha.sections.map((seccion, position) => ({
        productId: producto.id,
        heading: seccion.heading,
        body: seccion.body,
        headingEn: seccion.headingEn,
        bodyEn: seccion.bodyEn,
        position,
      })),
    });
  }

  return existente ? "actualizado" : "creado";
}

/**
 * Contrôle des lots avant toute écriture.
 *
 * Vérifie que chaque fiche se relit par `leerEspecificaciones` — donc que ses
 * masses se répondent et que ses dimensions tiennent — et qu'aucun slug n'est
 * employé deux fois. Un doublon de slug ferait qu'une fiche en écrase une autre
 * en silence, et la faute ne se verrait qu'au comptage final.
 *
 * Le contrôle passe avant la connexion à la base : une donnée fausse n'a pas à
 * atteindre la production pour être découverte.
 */
function verificarLotes(): string[] {
  const errores: string[] = [];
  const vistos = new Map<string, string>();

  for (const lote of LOTES) {
    for (const ficha of lote) {
      if (leerEspecificaciones(escribirEspecificaciones(ficha.specs)) === null) {
        errores.push(`${ficha.slug} : caractéristiques refusées (masses ou dimensions incohérentes)`);
      }
      const destino = ficha.slugExistente ?? ficha.slug;
      const anterior = vistos.get(destino);
      if (anterior) {
        errores.push(`${destino} : visé par ${anterior} et par ${ficha.slug}`);
      }
      vistos.set(destino, ficha.slug);

      if (ficha.sections.length === 0) {
        errores.push(`${ficha.slug} : aucune section, la description serait vide`);
      }
    }
  }
  return errores;
}

async function main() {
  const errores = verificarLotes();
  if (errores.length > 0) {
    console.error(`Contrôle des lots : ${errores.length} problème(s), rien n'a été écrit.`);
    for (const error of errores) console.error(`  ✗ ${error}`);
    process.exitCode = 1;
    return;
  }

  // Toutes les catégories des deux univers de vente, indexées « univers/slug ».
  const filas = await prisma.category.findMany({
    where: { group: { slug: { in: ["nuevos", "ocasion"] } } },
    select: { id: true, slug: true, group: { select: { slug: true } } },
  });
  if (filas.length === 0) throw new Error("Aucune catégorie de vente en base.");
  const categorias = new Map(filas.map((fila) => [`${fila.group.slug}/${fila.slug}`, fila.id]));

  const total = LOTES.reduce((suma, lote) => suma + lote.length, 0);
  if (total === 0) {
    console.log("Aucune fiche à importer : les lots de données sont vides.");
    return;
  }

  const modo = PUBLICAR ? "publiées" : "désactivées, à activer après déploiement du code";
  console.log(
    SECO ? `Essai à blanc — ${total} fiches (${modo})` : `Import — ${total} fiches (${modo})`,
  );

  const cuenta = { creado: 0, actualizado: 0, omitido: 0 };
  for (const lote of LOTES) {
    for (const ficha of lote) {
      cuenta[await importar(ficha, categorias)] += 1;
    }
  }

  console.log(
    SECO
      ? "Essai à blanc terminé, rien n'a été écrit."
      : `Terminé : ${cuenta.creado} créées, ${cuenta.actualizado} mises à jour, ${cuenta.omitido} ignorées.`,
  );
}

main()
  .catch((error) => {
    console.error("ÉCHEC :", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
