/**
 * Bascule le catalogue sur deux univers de vente : neuf et occasion.
 *
 * Pourquoi : l'acheteur d'une remorque à chevaux arbitre d'abord entre neuf et
 * occasion — c'est l'écart de prix qui structure sa recherche, pas le nombre de
 * places. Le nombre de places vient ensuite, une fois le budget arrêté. La
 * navigation suit donc cet ordre : univers d'abord, places ensuite.
 *
 * Structure cible :
 *
 *   nuevos      un-caballo, dos-caballos, tres-cuatro-caballos
 *   ocasion     un-caballo, dos-caballos, tres-cuatro-caballos
 *   accesorios  accesorios
 *
 * Les routes étant en /[locale]/[group]/[category]/[product], le même slug de
 * catégorie peut vivre dans les deux univers sans collision : la contrainte
 * d'unicité porte sur le couple (groupId, slug). On obtient
 * /nuevos/dos-caballos/… et /ocasion/dos-caballos/…, ce qui donne deux pages
 * distinctes à indexer au lieu d'une.
 *
 * Ce que fait le script :
 *   1. renomme l'univers « remolques » en « nuevos » ;
 *   2. crée l'univers « ocasion » et ses trois catégories par nombre de places ;
 *   3. déplace les produits d'occasion vers leur catégorie de places et passe
 *      leur `condition` à « used » ;
 *   4. force `condition` à « new » sur tout ce qui reste dans « nuevos » ;
 *   5. supprime l'ancienne catégorie « ocasion » de l'univers neuf, une fois vidée.
 *
 * Aucun produit n'est supprimé : ils changent de rattachement et conservent leur
 * slug, leurs visuels, leur stock et leurs avis. Les commandes déjà passées ne
 * bougent pas — chaque ligne de commande recopie le libellé du produit au moment
 * de l'achat.
 *
 * Relançable : tout passe par des upserts sur le slug.
 *
 * Lancement : node --env-file=.env.local --import tsx scripts/restructurer-universos.ts
 */
import { prisma } from "../src/server/prisma";

const IMG = "/images/remolques";

interface SectionGuide {
  heading: string;
  headingEn: string;
  body: string;
  bodyEn: string;
}

interface CategorieCible {
  slug: string;
  label: string;
  labelEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  guideIntro: string;
  guideIntroEn: string;
  guideClosing: string;
  guideClosingEn: string;
  sections: SectionGuide[];
}

/**
 * Catégories de l'univers occasion. Elles reprennent le découpage par nombre de
 * places de l'univers neuf, mais leur contenu éditorial est différent : sur le
 * marché de l'occasion, ce qui décide de l'achat, c'est l'état du châssis, du
 * plancher et des freins, pas la finition.
 */
const CATEGORIES_OCASION: CategorieCible[] = [
  {
    slug: "un-caballo",
    label: "Remolques de un caballo de ocasión",
    labelEn: "Used single-horse trailers",
    description:
      "Monoplazas de segunda mano revisados en taller, con ITV en vigor y documentación al día. La entrada más asequible al transporte propio.",
    descriptionEn:
      "Second-hand single-horse trailers, workshop-checked, with valid roadworthiness test and paperwork in order. The most affordable way into owning your own transport.",
    image: `${IMG}/cat-un-caballo.svg`,
    guideIntro:
      "Un monoplaza de ocasión es donde el ahorro es mayor en proporción: son remolques que se usan poco, a menudo para un solo caballo y trayectos cortos, y que llegan al mercado de segunda mano con pocos kilómetros encima.\n\nEso mismo esconde una trampa. Un remolque parado durante años se degrada más que uno que rueda: los neumáticos se cuartean por el sol, los frenos se agarrotan y la humedad trabaja el suelo sin que nadie lo vea.",
    guideIntroEn:
      "A used single-horse trailer offers the largest proportional saving: these trailers see little use, often for one horse over short journeys, and reach the second-hand market with few kilometres on them.\n\nThat same fact hides a trap. A trailer left standing for years degrades more than one in regular use: tyres crack in the sun, brakes seize, and damp works away at the floor unseen.",
    sections: [
      {
        heading: "El suelo antes que la chapa",
        headingEn: "The floor before the bodywork",
        body: "La carrocería se repinta; el suelo no se disimula. Es la pieza que sostiene 600 kg en movimiento y la primera que se pudre, porque recibe orina y humedad en cada viaje.\n\nSúbase al remolque y camine por todo el suelo, sobre todo en las esquinas y bajo las gomas. Cualquier zona que ceda, suene hueca o esté oscurecida obliga a cambiar el tablero completo.",
        bodyEn: "Bodywork can be repainted; a floor cannot be disguised. It is the part carrying 600 kg in motion, and the first to rot, because it takes urine and damp on every trip.\n\nStep inside and walk the entire floor, especially the corners and under the matting. Any area that gives, sounds hollow, or looks darkened means replacing the whole board.",
      },
      {
        heading: "Frenos y ejes: la revisión que no se ve",
        headingEn: "Brakes and axles: the check you cannot see",
        body: "Los ejes de ballesta de goma no se engrasan y duran, pero se cansan: si el remolque se sienta visiblemente hacia un lado o los neumáticos se comen por dentro, el eje está vencido y su sustitución cuesta lo que un tercio del remolque.\n\nEl freno de inercia debe ceder con firmeza y volver solo. Si la lanza entra sin resistencia, el amortiguador está muerto.",
        bodyEn: "Rubber torsion axles need no greasing and last well, but they tire: if the trailer sits visibly to one side or the tyres wear on the inside, the axle has sagged, and replacing it costs about a third of the trailer's value.\n\nThe overrun brake should give firm resistance and return on its own. If the drawbar slides in without resistance, the damper is dead.",
      },
      {
        heading: "Los papeles valen tanto como el remolque",
        headingEn: "The paperwork counts as much as the trailer",
        body: "Un remolque sin ficha técnica ni matrícula no se puede circular ni transferir, y regularizarlo es lento y caro. Exija la ficha técnica, el permiso de circulación y la ITV en vigor antes de ver siquiera el vehículo.\n\nCompruebe que la MMA de la ficha coincide con la placa del fabricante remachada en el chasis. Si no coinciden, el remolque ha sido modificado.",
        bodyEn: "A trailer with no technical sheet or registration cannot be driven or transferred, and regularising it is slow and costly. Ask for the technical sheet, registration document and valid roadworthiness certificate before you even view it.\n\nCheck the maximum weight on the sheet matches the manufacturer's plate riveted to the chassis. If they differ, the trailer has been modified.",
      },
    ],
    guideClosing:
      "Cada remolque de ocasión que vendemos pasa por nuestro taller antes de publicarse: suelo, ejes, frenos, instalación eléctrica y neumáticos. Se entrega con la ITV pasada y la transferencia incluida.",
    guideClosingEn:
      "Every used trailer we sell goes through our workshop before being listed: floor, axles, brakes, wiring and tyres. It is delivered with a valid roadworthiness certificate and the transfer of ownership included.",
  },
  {
    slug: "dos-caballos",
    label: "Remolques de dos caballos de ocasión",
    labelEn: "Used two-horse trailers",
    description:
      "Vans de dos plazas de segunda mano, el formato más buscado y el que más se encuentra. Revisados, con ITV en vigor y transferencia incluida.",
    descriptionEn:
      "Second-hand two-horse vans, the most sought-after format and the most widely available. Checked, with valid roadworthiness test and transfer included.",
    image: `${IMG}/cat-dos-caballos.svg`,
    guideIntro:
      "El dos plazas es el remolque más vendido, y por tanto el más abundante de ocasión. Esa abundancia es su ventaja: hay dónde elegir, y no hay ninguna razón para aceptar uno con reparaciones pendientes.\n\nEl rango de precio es amplio. Un dos plazas de quince años ronda una cuarta parte de lo que cuesta nuevo; uno de tres o cuatro años, algo más de la mitad. La diferencia se explica casi siempre por el estado del suelo y de los ejes.",
    guideIntroEn:
      "The two-horse trailer is the best-selling format, and therefore the most plentiful second-hand. That abundance works in your favour: there is choice, and no reason to accept one with outstanding repairs.\n\nThe price range is wide. A fifteen-year-old two-horse trailer sells for about a quarter of its new price; one three or four years old, a little over half. The difference almost always comes down to the state of the floor and axles.",
    sections: [
      {
        heading: "Mire la separación central y las barras de pecho",
        headingEn: "Check the centre partition and breast bars",
        body: "En un dos plazas, la separación central recibe todos los golpes: el caballo se apoya en ella en cada frenada. Compruebe que no está doblada, que sus anclajes al suelo no tienen holgura y que se abate sin forzar.\n\nLas barras de pecho y de grupa deben soltarse con una mano. Si hay que golpearlas, el caballo queda atrapado en caso de incidente.",
        bodyEn: "In a two-horse trailer the centre partition takes every impact: the horse leans on it under braking. Check it is not bent, that its floor anchorages have no play, and that it folds without forcing.\n\nBreast and rear bars must release one-handed. If they need hitting, the horse is trapped in an incident.",
      },
      {
        heading: "El peso en vacío decide el permiso",
        headingEn: "The unladen weight decides your licence",
        body: "Un dos plazas de ocasión con carrocería de madera puede pesar 200 kg más que un modelo actual equivalente en aluminio y fibra. Con dos caballos dentro, esa diferencia decide si el conjunto sigue entrando en el carnet B.\n\nSume la tara del remolque, el peso de los dos caballos y la MMA de su coche antes de cerrar la compra. La casilla F.1 de su ficha técnica manda sobre cualquier otra consideración.",
        bodyEn: "A used two-horse trailer with a wooden body can weigh 200 kg more than an equivalent current model in aluminium and fibreglass. With two horses aboard, that difference decides whether the combination still fits a standard B licence.\n\nAdd the trailer's unladen weight, the weight of both horses and your car's maximum weight before committing. Box F.1 on your vehicle's technical sheet overrides every other consideration.",
      },
      {
        heading: "Un remolque de concurso no es un remolque de campo",
        headingEn: "A competition trailer is not a yard trailer",
        body: "Un dos plazas que ha hecho temporada de concursos acumula kilómetros pero suele estar bien mantenido y guardado bajo techo. Uno que ha vivido en una finca tiene pocos kilómetros y mucha corrosión.\n\nPregunte dónde ha dormido el remolque. Es más revelante que el año de matriculación.",
        bodyEn: "A two-horse trailer that has done a competition season racks up mileage but is usually well maintained and stored under cover. One that has lived on a farm has few kilometres and plenty of corrosion.\n\nAsk where the trailer has been kept. It tells you more than the registration year.",
      },
    ],
    guideClosing:
      "Cada remolque de ocasión que vendemos pasa por nuestro taller antes de publicarse: suelo, ejes, frenos, instalación eléctrica y neumáticos. Se entrega con la ITV pasada y la transferencia incluida.",
    guideClosingEn:
      "Every used trailer we sell goes through our workshop before being listed: floor, axles, brakes, wiring and tyres. It is delivered with a valid roadworthiness certificate and the transfer of ownership included.",
  },
  {
    slug: "tres-cuatro-caballos",
    label: "Remolques de tres y cuatro caballos de ocasión",
    labelEn: "Used three- and four-horse trailers",
    description:
      "Remolques de gran capacidad de segunda mano para clubes, criadores y transportistas. Requieren permiso B+E y una revisión mecánica seria.",
    descriptionEn:
      "High-capacity second-hand trailers for clubs, breeders and hauliers. They require a B+E licence and a thorough mechanical inspection.",
    image: `${IMG}/cat-tres-cuatro-caballos.svg`,
    guideIntro:
      "A partir de tres plazas se entra en otra categoría de vehículo: doble eje, más de 2.700 kg de MMA y permiso B+E obligatorio. De ocasión son los remolques que más se ahorran en euros, y también los que más caro salen si se compra mal.\n\nSon vehículos profesionales. Los que llegan al mercado han trabajado, y hay que comprarlos como se compra una furgoneta de ocasión: por su mantenimiento documentado, no por su aspecto.",
    guideIntroEn:
      "From three places upward you enter a different class of vehicle: twin axle, over 2,700 kg gross weight, and a mandatory B+E licence. Second-hand, these save the most in absolute terms — and cost the most if you buy badly.\n\nThese are professional vehicles. The ones reaching the market have worked, and should be bought as you would a used van: on documented maintenance, not on looks.",
    sections: [
      {
        heading: "Doble eje quiere decir doble desgaste",
        headingEn: "Twin axle means double the wear",
        body: "Con dos ejes, los cuatro frenos deben regularse juntos. Un remolque de cuatro plazas que tira de lado en la frenada tiene un freno agarrotado, y eso desgasta un neumático en un solo viaje largo.\n\nPida la última hoja de ITV y mire el apartado de frenado: los desequilibrios quedan registrados ahí, aunque el vendedor no los mencione.",
        bodyEn: "With two axles, all four brakes must be balanced together. A four-horse trailer that pulls to one side under braking has a seized brake, and that ruins a tyre in a single long trip.\n\nAsk for the last roadworthiness sheet and look at the braking section: imbalances are recorded there, even when the seller does not mention them.",
      },
      {
        heading: "La rampa y su mecanismo",
        headingEn: "The ramp and its mechanism",
        body: "Una rampa de cuatro plazas pesa lo suficiente para necesitar muelles o pistones de asistencia. Cuando fallan, la rampa se vuelve peligrosa de manejar en solitario y su reparación no es barata.\n\nÁbrala y ciérrela varias veces usted mismo. Debe subir con una mano y quedarse arriba sin sujeción.",
        bodyEn: "A four-horse ramp is heavy enough to need assist springs or gas struts. When these fail, the ramp becomes dangerous to handle alone and repairs are not cheap.\n\nOpen and close it several times yourself. It should lift one-handed and stay up unsupported.",
      },
      {
        heading: "Compruebe para qué se ha usado",
        headingEn: "Find out what it was used for",
        body: "Un remolque de cuatro plazas de un criador hace pocos viajes largos al año. El de un transportista hace miles de kilómetros al mes. El segundo puede estar mejor mantenido, pero su chasis ha trabajado diez veces más.\n\nLos números de bastidor y las placas del fabricante dicen el año real de fabricación, que no siempre coincide con el de matriculación.",
        bodyEn: "A breeder's four-horse trailer makes a handful of long trips a year. A haulier's covers thousands of kilometres a month. The second may be better maintained, but its chassis has worked ten times harder.\n\nChassis numbers and manufacturer's plates give the true year of manufacture, which does not always match the registration year.",
      },
    ],
    guideClosing:
      "Cada remolque de ocasión que vendemos pasa por nuestro taller antes de publicarse: suelo, ejes, frenos, instalación eléctrica y neumáticos. Se entrega con la ITV pasada y la transferencia incluida.",
    guideClosingEn:
      "Every used trailer we sell goes through our workshop before being listed: floor, axles, brakes, wiring and tyres. It is delivered with a valid roadworthiness certificate and the transfer of ownership included.",
  },
];

/**
 * Rattachement des produits d'occasion déjà en base. La clé est le slug du
 * produit, la valeur le slug de la catégorie de destination dans « ocasion ».
 * Les deux sont des vans de dos plazas.
 */
const RECLASSEMENT_OCASION: Record<string, string> = {
  "fautras-oblic-x2-seminuevo": "dos-caballos",
  "sirius-s700-seminuevo": "dos-caballos",
};

async function main(): Promise<void> {
  // 1. L'univers « remolques » devient « nuevos ». Ses catégories par nombre de
  //    places restent en place, avec leurs guides et leurs produits.
  const nuevos = await prisma.group.update({
    where: { slug: "remolques" },
    data: {
      slug: "nuevos",
      label: "Remolques nuevos",
      labelEn: "New trailers",
      position: 0,
    },
  });
  console.log(`Univers neuf : ${nuevos.slug} (${nuevos.label})`);

  // 2. L'univers occasion, créé s'il n'existe pas encore.
  const ocasion = await prisma.group.upsert({
    where: { slug: "ocasion" },
    update: { label: "Ocasión", labelEn: "Used", position: 1 },
    create: {
      slug: "ocasion",
      label: "Ocasión",
      labelEn: "Used",
      position: 1,
    },
  });
  console.log(`Univers occasion : ${ocasion.slug} (${ocasion.label})`);

  // Les accessoires passent en dernière position, derrière les deux univers
  // de remorques.
  await prisma.group.update({
    where: { slug: "accesorios" },
    data: { position: 2 },
  });

  // 3. Les trois catégories de l'univers occasion.
  for (const [index, cible] of CATEGORIES_OCASION.entries()) {
    const donnees = {
      label: cible.label,
      labelEn: cible.labelEn,
      description: cible.description,
      descriptionEn: cible.descriptionEn,
      image: cible.image,
      guideIntro: cible.guideIntro,
      guideIntroEn: cible.guideIntroEn,
      guideClosing: cible.guideClosing,
      guideClosingEn: cible.guideClosingEn,
      position: index,
    };

    const categorie = await prisma.category.upsert({
      where: { groupId_slug: { groupId: ocasion.id, slug: cible.slug } },
      update: donnees,
      create: { ...donnees, slug: cible.slug, groupId: ocasion.id },
    });

    // Les sections du guide sont réécrites à chaque passage : c'est plus simple
    // que de les apparier une à une, et rien d'autre ne pointe vers elles.
    await prisma.guideSection.deleteMany({ where: { categoryId: categorie.id } });
    await prisma.guideSection.createMany({
      data: cible.sections.map((section, position) => ({
        categoryId: categorie.id,
        heading: section.heading,
        headingEn: section.headingEn,
        body: section.body,
        bodyEn: section.bodyEn,
        position,
      })),
    });

    console.log(`  ${cible.slug} — ${cible.sections.length} sections`);
  }

  // 4. Les produits d'occasion rejoignent leur catégorie de places et passent
  //    en « used », la valeur attendue par Google Merchant pour un véhicule
  //    déjà immatriculé.
  for (const [slugProduit, slugCategorie] of Object.entries(RECLASSEMENT_OCASION)) {
    const destination = await prisma.category.findUnique({
      where: { groupId_slug: { groupId: ocasion.id, slug: slugCategorie } },
    });
    if (!destination) continue;

    const produit = await prisma.product.findUnique({ where: { slug: slugProduit } });
    if (!produit) {
      console.log(`  ! produit introuvable : ${slugProduit}`);
      continue;
    }

    await prisma.product.update({
      where: { slug: slugProduit },
      data: { categoryId: destination.id, condition: "used" },
    });
    console.log(`  ${slugProduit} → ocasion/${slugCategorie}`);
  }

  // 5. Tout ce qui reste sous l'univers neuf est déclaré neuf. Le champ était
  //    resté à « new » y compris sur les deux semi-neufs, ce qui aurait fait
  //    passer des véhicules d'occasion pour du neuf dans le flux Merchant.
  const remisAuNeuf = await prisma.product.updateMany({
    where: { category: { groupId: nuevos.id } },
    data: { condition: "new" },
  });
  console.log(`Produits confirmés neufs : ${remisAuNeuf.count}`);

  // 6. L'ancienne catégorie « ocasion » de l'univers neuf n'a plus lieu d'être.
  //    On ne la supprime que si elle est effectivement vide, pour ne jamais
  //    emporter un produit avec elle (la relation est en cascade).
  const ancienne = await prisma.category.findUnique({
    where: { groupId_slug: { groupId: nuevos.id, slug: "ocasion" } },
    include: { _count: { select: { products: true } } },
  });

  if (!ancienne) {
    console.log("Ancienne catégorie « ocasion » : déjà supprimée");
  } else if (ancienne._count.products > 0) {
    console.log(
      `Ancienne catégorie « ocasion » conservée : ${ancienne._count.products} produit(s) encore rattaché(s). ` +
        "Les reclasser dans RECLASSEMENT_OCASION puis relancer.",
    );
  } else {
    await prisma.category.delete({ where: { id: ancienne.id } });
    console.log("Ancienne catégorie « ocasion » supprimée");
  }

  // État final, pour vérification à l'œil.
  const groupes = await prisma.group.findMany({
    include: {
      categories: {
        include: { _count: { select: { products: true } } },
        orderBy: { position: "asc" },
      },
    },
    orderBy: { position: "asc" },
  });

  console.log("\nStructure finale :");
  for (const groupe of groupes) {
    console.log(`  [${groupe.slug}] ${groupe.label}`);
    for (const categorie of groupe.categories) {
      console.log(`     ${categorie.slug} — ${categorie._count.products} produit(s)`);
    }
  }
}

main()
  .catch((erreur) => {
    console.error(erreur);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
