/**
 * Photographies des modèles, par slug de produit.
 *
 * Les adresses pointent vers les visuels officiels des constructeurs. Le client
 * déclare disposer de l'autorisation de chaque fournisseur pour les reprendre
 * sur son site : c'est cette autorisation, et elle seule, qui rend l'opération
 * licite. Obtenez-la par écrit avant d'ajouter une marque ici.
 *
 * CONVENTION DE TAILLE. Le CDN de Böckmann sert par défaut des vignettes de
 * 180 × 168 px, inutilisables sur une fiche produit. Le suffixe `-FPNG` rend
 * l'original — 2,6 Mo pour l'exemple mesuré. C'est celui-là qu'on demande, et
 * `importar-fotos-marcas.ts` le ramène ensuite à 1600 px.
 *
 * COMMENT L'APPARIEMENT A ÉTÉ FAIT, ET CE QU'IL VAUT. Böckmann publie une page
 * par gamme, où chaque variante a sa photo. Le nombre de photos correspond
 * exactement au nombre de variantes, et l'ordre des photos suit celui du
 * tableau de caractéristiques. C'est sur cette correspondance de rang que
 * repose l'appariement ci-dessous.
 *
 * Elle est solide mais pas certifiée : une inversion sur la page du
 * constructeur donnerait une photo de Champion C sur la fiche du Champion R,
 * deux modèles que rien ne distingue à l'œil sur une vignette. Un contrôle
 * visuel, fiche par fiche, reste à faire avant de considérer le catalogue
 * comme définitif. Les modèles regroupés — deux configurations sous une fiche —
 * reçoivent les deux photos correspondantes.
 *
 * La première adresse de chaque liste devient la vignette du produit ; les
 * suivantes composent la galerie.
 */

/** Base du CDN de Böckmann, pour ne pas la répéter à chaque ligne. */
const BK_CDN = "https://d1tqvb5h42deiw.cloudfront.net/image/774305612601";

/** Rend l'original plutôt que la vignette de 180 px servie par défaut. */
function bk(id: string): string {
  return `${BK_CDN}/image_${id}/-FPNG`;
}

/**
 * Image du site de Humbaur. Le constructeur sert des chemins relatifs, et son
 * arborescence contient un tréma : l'encodage est fait ici une fois pour
 * toutes plutôt que recopié à chaque ligne.
 */
function hb(ruta: string): string {
  return `https://www.humbaur.com/Bilder/Pferdeanh%C3%A4nger/${ruta}`;
}

/** Image d'Equus Life, distributeur officiel de Cheval Liberté en Espagne. */
function eq(ruta: string): string {
  return `https://equus-life.com/wp-content/uploads/${ruta}`;
}

/** Image de West Wood Trailers, distributeur d'Ifor Williams. */
function iw(archivo: string): string {
  return `https://www.westwoodtrailers.com/wp-content/uploads/2020/08/${archivo}`;
}

/** Image de SARL Geavida, distributeur qui publie le HB610 avec galerie. */
function gv(archivo: string): string {
  return `https://sarlgeavida.com/wp-content/uploads/2024/12/${archivo}`;
}

export const FOTOS: Readonly<Record<string, readonly string[]>> = {
  // --- Uno : deux variantes, deux photos, dans l'ordre Esprit puis C.
  "bk-uno-esprit": [bk("7799dbo4eh6753optsg5gep53b")],
  "bk-uno-c": [bk("ttmotlbgfd0jt9ienfjir4v32b")],

  // --- Duo : Duo Esprit puis Duo R.
  "bk-duo-esprit": [bk("bdg43ukpv95dh7i1dp70hsou0b")],
  "bk-duo-r": [bk("sibab64g4t1epbfq490d18qn3k")],

  // --- Comfort : une seule fiche, les deux photos de la page lui reviennent.
  "bk-comfort": [bk("s7aa0sg3tl0aj88mcca9l7id77"), bk("4pgovbtfi97thfjclivf6cm23m")],

  // --- Champion : six variantes dans l'ordre Esprit, C, R, Kutsche C,
  //     Big Champion SKA, Big Champion E.
  // Le Champion Esprit a rejoint la fiche déjà au catalogue : c'est son slug
  // d'origine qu'il faut viser, pas celui du lot.
  "bockmann-champion-esprit": [bk("nspgair8gp4m117ogk52aba77c")],
  "bk-champion-c": [bk("mhelbmb0jl5bl8o9dqchv7ul52")],
  "bk-champion-r": [bk("gd2j8gsusd6edf35ot4tg3v91o")],
  "bk-champion-kutsche-c": [bk("5po2jj8bap37tdlbo3dhlg9c62")],
  "bk-big-champion-ska": [bk("v78i48ff195177jc9l6cnkeg0v")],
  "bk-big-champion-e": [bk("65ompr54753bh76cfr2qlv2d6c")],

  // --- Master : Master, Big Master, Grand Master SKA, Grand Master SR.
  "bk-master": [bk("j7vud203q94svdapi1219j753k")],
  "bk-big-master": [bk("v2n956e31t7lt90l4i9jpdl16t")],
  "bk-grand-master-ska": [bk("adt80m40p538bd430t8qaib03g")],
  "bk-grand-master-sr": [bk("lihmcsc0v55hjb33tal11pml3v")],

  // --- Portax : dix variantes sur la page, huit fiches chez nous. Les deux
  //     fiches qui regroupent deux configurations reçoivent leurs deux photos.
  "bk-portax-esprit": [bk("04ocbnbk0l0if5qqprlv4k5q6j")],
  "bk-portax-e-ska": [bk("q8f632cp217il21aj6srr5g56q"), bk("3f1pdri8tl6mh22datomg5eg1s")],
  "bockmann-portax-k": [bk("2gu1dqv8ul3k945gl9l6cvqi1t")],
  "bk-portax-l-e": [bk("7p8bvseb8d00jffktmblnj7l74")],
  "bk-portax-l-ska": [bk("49a19pskld6c7f9tb9559okj02")],
  "bk-portax-l-k-sr": [bk("jugd1k73vl46h6r5g126v8tt39"), bk("u10leudfvp567df6ie3t7ifu7t")],
  "bk-big-portax": [bk("6f2je3673p4sdfm5tugjo8og0v")],
  "bk-big-portax-stall": [bk("fcufbv4mph4g7f9page0q8g21a")],

  // --- Traveller : onze variantes, sept fiches. Ordre de la page : K4, K3, G2,
  //     W2 Big SK, K3 Big SK, W3, K5, K4 Big SK, G3, W3 Big SK, W4.
  "bk-traveller-k4": [bk("cjhjak6d5501b75ddv002a0a1q"), bk("lnhp5o50ed4q59lna2rs5um650")],
  "bk-traveller-k3": [bk("gtmqcv0ag55mp8m0a1oipe132h")],
  "bk-traveller-g2": [bk("m9a3jqq89p487ee24rpivg3739"), bk("0et0aole417h36dlvfv481k96m")],
  "bk-traveller-w3": [bk("9a0t78c1ih0vf2tcpieiisvn60")],
  "bk-traveller-k5": [bk("s1c0vk80q11453644qpi8ihr00"), bk("1i7n4l70id30lalgukf9fv0m50")],
  "bk-traveller-g3": [bk("ha9vutfjgh5rb5oee8jf34dq6d")],
  "bk-traveller-w4": [bk("15qfa6d3h54k72bb56qgf2rr1l"), bk("v0aa2e6r2h66bck88fmhlm9p2v")],

  // --- Neo : Neo SKA, Neo L SKA, Neo L SR.
  "bk-neo-ska": [bk("ihdrql9lhd3rfer997pbj98p5k")],
  "bk-neo-l-ska": [bk("69p0pjjjp55apdjkb95304ms6t")],
  "bk-neo-l-sr": [bk("ns18ut75gh0i982lu8md47a364")],

  // ------------------------------------------------------------------ Humbaur
  //
  // Ici l'appariement est certain, et non déduit d'un rang : le constructeur
  // nomme ses fichiers d'après le modèle — Xanthos_Aero_2400_Import,
  // Notos_Xtra_Pro_Bild_01. Aucune ambiguïté possible.
  //
  // Les vues « Highlight » et « Bild » passent devant les « ModelsTile », qui
  // sont les plus petites : 20 ko contre 43. La vignette du produit sera donc
  // la plus définie des trois.
  "humbaur-xanthos-aero": [
    hb("Xanthos/Xanthos_Aero/1133/image-thumb__1133__masonry-image_portrait_1/Xanthos_Aero_Highlight_02.55096a9c.jpg"),
    hb("Xanthos/Xanthos_Aero/625/image-thumb__625__InlineTextImage6Cols/Xanthos_Aero_Bild_01.22d61257.png"),
    hb("Xanthos/Xanthos_Aero/795/image-thumb__795__ModelsTile/Xanthos_Aero_2400_Import.ec2ba838.png"),
  ],
  "hb-xanthos-aero-2700": [
    hb("Xanthos/Xanthos_Aero/1134/image-thumb__1134__masonry-image_landscape_1/Xanthos_Aero_Highlight_03.d50fe87f.jpg"),
    hb("Xanthos/Xanthos_Aero/627/image-thumb__627__InlineTextImage6Cols/Xanthos_Aero_Bild_02.d2a04650.png"),
    hb("Xanthos/Xanthos_Aero/796/image-thumb__796__ModelsTile/Xanthos_Aero_2700_Import.ec2ba838.png"),
  ],
  "humbaur-notos": [
    hb("Notos/Notos_Xtra/2356/image-thumb__2356__Default/Notos_Xtra_Pro_Highlight_01.0efa708b.jpg"),
    hb("Notos/Notos_Xtra/636/image-thumb__636__Default/Notos_Xtra_Pro_Bild_01.8c83d234.png"),
    hb("Notos/Notos_Xtra/4556/image-thumb__4556__Default/Notos_Xtra_Pro_Highlight_02.d4624734.jpg"),
    hb("Notos/Notos_Xtra/635/image-thumb__635__Default/Notos_Xtra_Pro_Bild_04.340cd234.png"),
  ],
  "hb-notos-xtra-up": [
    hb("Notos/Notos_Xtra/638/image-thumb__638__Default/Notos_Xtra_Up_Bild_02.d3a5334f.png"),
    hb("Notos/Notos_Xtra/637/image-thumb__637__Default/Notos_Xtra_Up_Bild_03.1f10e40a.png"),
    hb("Notos/Notos_Xtra/806/image-thumb__806__ModelsTile/Notos_Xtra_Up_Import.6f543e13.png"),
  ],

  // ----------------------------------------------------------- Cheval Liberté
  //
  // Photographies du distributeur officiel espagnol, dont les noms de fichiers
  // désignent le modèle : l'appariement est certain lui aussi.
  "cheval-liberte-gold-marathon": [
    eq("2024/02/vista-lateral-van-gold-marathon.webp"),
    eq("2024/02/remolque-gold-marathon.webp"),
    eq("2024/02/gold-marathon-cheval-liberte.webp"),
    eq("2024/02/remolque-dos-caballos-gold-marathon.webp"),
  ],
  "cl-maxi-3-living": [
    eq("2026/03/remolque-3-caballos-maxi-living.webp"),
    eq("2026/03/remolque-cheval-liberte-maxi-3-living.webp"),
    eq("2026/03/vista-trasera-remolque-maxi-3-living.webp"),
    eq("2026/03/espacio-living-maxi-3.webp"),
    eq("2026/03/cama-desplegable-maxi-3-living.webp"),
  ],

  // ------------------------------------------------------------ Ifor Williams
  //
  // Le constructeur gallois refuse les requêtes automatisées : les photos
  // viennent de West Wood Trailers, son distributeur irlandais, dont les noms
  // de fichiers désignent le modèle sans ambiguïté. Pour le HB610, absent de
  // cette galerie, on reprend celles de SARL Geavida, le fournisseur déjà
  // cité dans `sourceRef` pour cette fiche.
  "ifor-williams-hb-403": [
    iw("Hb403-Blue11-960x642-1.jpg"),
    iw("HB403-graphite1.jpg"),
    iw("HB403-No-171.jpg"),
    iw("HB403-silver-test1-960x642-2.jpg"),
    iw("HB4031-960x642-1.jpg"),
  ],
  "ifor-williams-hb-506": [
    iw("1HB-506Graphite-960x498-1.jpg"),
    iw("HB506-960x642-1.jpg"),
    iw("HB506aa-960x642-1.jpg"),
    iw("HB506Green1-960x642-1.jpg"),
    iw("HB506-WHITE-960x498-1.jpg"),
  ],
  "ifor-williams-hb-511": [
    iw("HB511-1.jpg"),
    iw("HB511-Black1-960x642-2.jpg"),
    iw("HB511-no-01-960x498-2.jpg"),
  ],
  "iw-hb610": [
    gv("545558_1606135801.jpg"),
    gv("545558_1574776859_1457.png"),
    gv("545558_1606135806.jpg"),
    gv("545558_1606135810.jpg"),
    gv("545558_1606135818.jpg"),
    gv("545558_1606135827.jpg"),
  ],

  // FAUTRAS RESTE SANS PHOTO, ET C'EST VOULU. Le constructeur charge ses
  // visuels par un configurateur dynamique, sans adresse directe. Son
  // distributeur français en publie, mais de la gamme Oblic+ — transport droit
  // — alors que nos fiches décrivent la gamme OblicX, à transport diagonal.
  // Deux gammes distinctes : mettre la photo de l'une sur la fiche de l'autre
  // tromperait l'acheteur sur ce qu'il commande.
};
