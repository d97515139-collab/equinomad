# Catalogue de 250 fiches — conception

Date : 14 août 2026
État : validé section par section avec le client, prêt pour le plan d'implémentation

## Objectif

Porter le catalogue de 12 fiches en ligne à environ 223, avec des photographies
hébergées sur Cloudinary et des descriptions rédigées, détaillées et cohérentes d'une
fiche à l'autre. La demande initiale portait sur 200 à 300 références ; le décompte
marque par marque établi plus bas donne 223, sans gonfler le total en éclatant les
options en fiches distinctes.

## État de départ, mesuré en base le 14 août 2026

```
[nuevos]      un-caballo            4 produits (2 actifs)
              dos-caballos         15 produits (8 actifs)
              tres-cuatro-caballos  7 produits (2 actifs)
[ocasion]     un-caballo            0 produits (0 actif)
              dos-caballos          2 produits (0 actif)
              tres-cuatro-caballos  0 produits (0 actif)
[accesorios]  accesorios            6 produits (0 actif)
```

- 34 produits en base, 12 en ligne. Les 22 autres sont désactivés.
- Marques présentes : Cheval Liberté 14, Ifor Williams 3, Fautras 3, Humbaur 3,
  Böckmann 2, Sirius 2, Barbieri 1, Remolque Caballos 6 (accessoires).
- `condition` vaut « new » sur les 34 produits, y compris les 2 rangés dans
  l'univers `ocasion` — incohérence à corriger.
- Descriptions espagnoles : 82 mots de médiane (50 au minimum, 143 au maximum).
- Descriptions anglaises : les 34 sont vides. La version `/en` retombe donc sur le
  repli générique de `src/lib/productText.ts`.
- Cloudinary : plan Free, 0,34 crédit consommé sur 25, 136 ressources, 188 Mo.
  Les identifiants sont bien renseignés dans `.env.local`, contrairement à ce
  qu'affirme le commentaire du fichier, qui est périmé.

## Décisions arrêtées

1. **Le volume public vient du neuf.** Environ 193 remorques plus une trentaine
   d'accessoires. L'occasion n'est pas fabriquée depuis des annonces tierces.
2. **Photographies officielles des constructeurs**, pour les cinq marques, avec une
   demande d'accord écrit adressée à chacune en parallèle du chantier.
3. **Les prix viennent de la grille revendeur fournie par le client**, majorée d'une
   marge de 10 % appliquée par une constante du pipeline.
4. **Six catégories de vente plus les accessoires**, structure actuelle conservée :
   `nuevos` et `ocasion`, chacun en `un-caballo`, `dos-caballos`,
   `tres-cuatro-caballos`.
5. **Fiche produit enrichie** : caractéristiques techniques structurées, description
   de 350 à 450 mots en sections titrées.

## Ce que ce chantier ne fait pas

- Il ne reprend aucune photographie publiée sur Equirodi, TruckScout24, Wallapop,
  Europa-Camiones ou Milanuncios. Ces images appartiennent aux vendeurs qui les ont
  publiées.
- Il ne recopie aucun texte d'annonce ni aucune prose de constructeur.
- Il ne crée pas de fiche d'occasion. Le rayon `ocasion` existe et se remplit depuis
  le back-office quand le client détient réellement le véhicule et ses propres
  photographies. Les portails d'annonces servent au client à repérer les véhicules à
  acheter, pas à alimenter le site.
- Il n'invente aucun prix. Un modèle sans prix validé entre en catalogue non
  achetable plutôt qu'avec un montant approximatif.

## Structure des données

```
scripts/data/remolques/
  cheval-liberte.ts     identité, caractéristiques, options, nombre de places
  bockmann.ts
  ifor-williams.ts
  fautras.ts
  humbaur.ts
  precios.ts            slug → prix source, appliqué avec MARGEN = 1.10
scripts/importer-remolques.ts   upsert par slug, rattachement aux catégories
```

Les fiches de marque ne portent aucun prix : elles décrivent le véhicule. Les prix
vivent dans leur propre fichier et se rejouent seuls quand la grille change, sans
toucher aux descriptions ni aux photographies.

Les slugs sont préfixés par marque — `cl-`, `bk-`, `iw-`, `ft-`, `hb-` — ce qui rend
chaque lot repérable et retirable d'un seul coup, comme le préfixe `mkt-` du précédent
import de marché.

Le rattachement aux catégories se déduit du nombre de places : 1 vers `un-caballo`,
2 vers `dos-caballos`, 3 et plus vers `tres-cuatro-caballos`.

**Une option n'est pas un produit.** Un plancher renforcé ou une sellerie cuir sont
des options de la fiche, pas des fiches supplémentaires. Éclater les variantes
donnerait 400 références qui sont trois fois le même véhicule, ce que Google Merchant
traite comme du duplicata.

## Évolutions du schéma Prisma

Trois champs à ajouter sur `Product`, par migration :

| Champ | Type | Rôle |
|---|---|---|
| `saleMode` | String, défaut `"cart"` | `"cart"` ou `"quote"`. Une fiche sans prix validé n'est pas achetable : bouton « Consultar precio » au lieu du panier, refus côté serveur, exclusion du flux Merchant qui rejette les fiches sans prix. |
| `specs` | String, défaut `"{}"` | Caractéristiques techniques en JSON, comme `bullets`. Alimente le tableau technique et le balisage schema.org. |
| `sourceRef` | String optionnel | Origine de la donnée, jamais affichée. Permet de retrouver la source d'une fiche deux ans plus tard. |

Le refus côté serveur pour `saleMode = "quote"` est indispensable : masquer le bouton
dans l'interface ne suffit pas, l'ajout au panier doit être rejeté par l'API.

## Collecte des modèles

**Sources** : sites officiels des constructeurs — chevalliberte.com, boeckmann.com,
iforwilliams.es, fautras.com, humbaur.com — complétés par les distributeurs espagnols
quand le constructeur ne publie pas la fiche technique complète. Ce sont des données
factuelles, qui ne se protègent pas.

**Relevé par modèle** : nom exact et gamme, nombre de places, MMA, tara, charge utile,
dimensions intérieures utiles, hauteur sous plafond, type de plancher, essieux et
freinage, équipements de série, options d'usine.

**Méthode** : Playwright par lots de dix modèles, chaque lot produisant directement son
fichier TypeScript typé. Un contrôle de complétude rejette toute fiche à laquelle il
manque le PTAC, le nombre de places ou les dimensions. Les constructeurs qui bloquent
l'automatisation passent en relevé manuel depuis leur catalogue PDF.

**Volumes estimés**

| Marque | Modèles |
|---|---|
| Cheval Liberté | ~45 |
| Böckmann | ~45 |
| Humbaur | ~35 |
| Fautras | ~28 |
| Ifor Williams | ~20 |
| Sirius et Barbieri, déjà en base | ~20 |
| Remorques, total | ~193 |
| Accessoires | ~30 |
| **Total catalogue** | **~223** |

Les accessoires — attelages, roues de secours, sellerie, tapis, barres de séparation,
bâches, rampes — remplissent au passage le rayon `accesorios`, qui compte aujourd'hui
6 produits dont aucun n'est en ligne.

## Photographies et Cloudinary

**Dimensionnement.** Le lot représente environ 1 000 photographies recompressées à
250 Ko, soit 250 Mo et moins d'un tiers de crédit sur les 25 mensuels du plan Free.
La bande passante, 25 Go par mois, vaut à peu près 200 000 vues d'images servies en
`f_auto` et `q_auto`. Le plan gratuit suffit à ce projet.

**Rangement par produit.** Le module `src/server/cloudinary.ts` accepte déjà un dossier
par appel :

```
remolquecaballos/productos/cheval-liberte/cl-gold-touring-2/
remolquecaballos/productos/bockmann/bk-comfort-duo/
```

Retirer une remorque du catalogue revient alors à retrouver et supprimer ses images
d'un geste, au lieu de les chercher dans un dossier plat de mille fichiers.

**Pipeline**, repris de `scripts/importar-fotos.ts` qui fonctionne déjà : téléchargement
avec en-tête de navigateur, les CDN des constructeurs refusant les requêtes nues ;
bornage à 1600 px et recompression par sharp ; envoi sur Cloudinary ; écriture de
`image` pour la vignette et `images` pour la galerie. Quatre à six vues par modèle :
trois-quarts avant, arrière ouvert, intérieur, détail de plancher.

**Garde-fous** : tout fichier de moins de 3 Ko est une page d'erreur déguisée et se
rejette ; un produit déjà illustré est ignoré sauf `--forzar`, donc le script se rejoue
sans dégât ; si Cloudinary est indisponible, repli sur `public/images/productos/`.

**Mise en ligne conditionnée.** La collecte et la préparation n'attendent pas les
accords. La publication des photographies d'une marque attend l'accord de cette marque.

## Rédaction

223 fiches en espagnol, doublées en anglais pour `/en`. Quatre champs par fiche et par
langue : `name`, `shortDescription`, `description`, `bullets`, plus `specs` qui est
commun aux deux langues pour les valeurs numériques.

**Règle de fabrication.** Chaque phrase doit être dérivable des caractéristiques
relevées. Un plancher en aluminium se mentionne parce que la fiche technique le dit ;
« confort exceptionnel » ne se mentionne pas, parce que rien ne le mesure. La prose des
constructeurs ne se recopie jamais : contrefaçon d'un côté, contenu dupliqué de l'autre.

**Angle éditorial : le permis.** Le PTAC étant relevé pour chaque modèle, le permis
espagnol en découle mécaniquement — B jusqu'à 3 500 kg, B96 jusqu'à 4 250 kg, B+E
jusqu'à 7 000 kg, selon le RD 818/2009 déjà exposé sur la page d'accueil. Chaque fiche
répond donc à la question que l'acheteur se pose vraiment : est-ce que je peux tracter
ce modèle avec mon permis et avec ma voiture. Aucun concurrent espagnol ne le fait fiche
par fiche, et ce contenu sort directement de la donnée technique.

**Structure d'une fiche**, de 350 à 450 mots :

1. accroche de deux phrases sous le titre, dans `shortDescription` ;
2. tableau technique issu de `specs` ;
3. quatre sections titrées — usage visé, construction, permis et attelage, équipement
   de série ;
4. cinq à huit puces strictement factuelles dans `bullets`.

Pas d'emoji.

**Contre l'effet catalogue.** 223 vans à chevaux se ressemblent, et un gabarit rempli
mécaniquement s'entend dès la troisième fiche. Le travail se fait par lots de marque,
chaque lot étant relu dans son ensemble pour vérifier que les textes ne se décalquent
pas. La cohérence de forme est portée par `specs`, dont le tableau est identique
partout ; la variété est portée par la prose, qui ne l'est jamais.

## Fiche produit

Le rendu actuel affiche la description dans un unique paragraphe en `text-sm
text-muted-foreground` avec `whitespace-pre-line`. Un texte de 400 mots y donnerait un
pavé gris que l'acheteur saute. Le composant
`src/app/[locale]/[group]/[category]/[product]/page.tsx` évolue donc pour afficher :

- le tableau des caractéristiques techniques issu de `specs` ;
- la description en sections titrées ;
- le bloc permis, mis en évidence, calculé depuis le PTAC ;
- le bouton « Consultar precio » à la place du panier quand `saleMode` vaut `"quote"`.

Le repli générique de `src/lib/productText.ts` reste en place comme filet, mais aucune
fiche du lot ne doit s'y appuyer : elles portent toutes leur propre texte, dans les deux
langues.

## Prix et marge

La grille revendeur fournie par le client alimente `scripts/data/remolques/precios.ts`.
La marge de 10 % s'applique par une constante `MARGEN = 1.10` du pipeline, jamais
recopiée fiche par fiche.

**Point à trancher à réception de la grille** : si les montants transmis sont des PVP
conseillés, une majoration de 10 % place le site au-dessus de Cuni, que l'acheteur
compare en un clic. S'il s'agit de prix d'achat revendeur, 10 % est au contraire très
mince une fois le transport, l'immatriculation et la garantie de deux ans payés.
L'assiette se constate à la lecture de la grille et la constante s'ajuste alors.

Les prix sont saisis en euros et convertis en centimes à l'import, `priceCents` étant un
entier. L'IVA à 21 % suit le paramétrage existant du site.

## Corrections annexes intégrées au chantier

- Les 2 produits rangés dans `ocasion/dos-caballos` portent `condition = "new"` : à
  passer en `"used"` ou à déplacer vers `nuevos`, selon ce qu'ils sont réellement.
- Les 6 accessoires sont hors ligne : à activer une fois illustrés et décrits.
- Le commentaire de `.env.local` affirme que Cloudinary est vide alors que les
  identifiants sont renseignés : à corriger pour ne pas égarer le prochain lecteur.
- Le flux Google Merchant s'appuie sur la taxonomie `fr-FR`. Pour un site espagnol, la
  feuille `es-ES` et la catégorie remorque correspondante sont nécessaires, sans quoi
  Merchant Center refusera les fiches.

## À la charge du client

1. La grille tarifaire des cinq marques, sous n'importe quelle forme.
2. La réponse aux cinq demandes d'accord sur les visuels, dont les courriers seront
   rédigés en espagnol et fournis prêts à envoyer.
3. L'arbitrage sur les 22 produits actuellement désactivés : à compléter et publier, ou
   à retirer.

## Risques

- **Les accords sur les visuels peuvent tarder ou être refusés.** Le catalogue se
  publie alors marque par marque, à mesure des réponses. Une marque sans accord reste
  préparée mais non publiée.
- **La grille tarifaire peut ne pas couvrir les 193 modèles.** Les modèles non couverts
  entrent en `saleMode = "quote"` plutôt que d'attendre.
- **La rédaction est le poste le plus long**, plus que le code. Elle s'étale sur
  plusieurs sessions, marque par marque, chacune mise en ligne dès qu'elle est complète.
- **La base de développement pointe sur la production.** `DATABASE_URL` dans
  `.env.local` vise le VPS : tout import s'exécute donc sur le site en ligne. Les
  scripts doivent être joués d'abord sur la base locale du port 5434, et le premier
  passage en production précédé d'une sauvegarde.

## Ordre d'exécution

1. Migration Prisma : `saleMode`, `specs`, `sourceRef`.
2. Évolution de la fiche produit pour afficher les caractéristiques et le bloc permis.
3. Importeur générique et format de données, validés sur Cheval Liberté seul.
4. Collecte, photographies et rédaction, marque par marque, en commençant par Cheval
   Liberté qui est la mieux couverte aujourd'hui.
5. Accessoires.
6. Corrections annexes et vérification du flux Merchant.
