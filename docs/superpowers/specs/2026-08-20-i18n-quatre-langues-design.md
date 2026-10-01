# i18n quatre langues et administration multilingue — conception

Date : 20 août 2026
État : validé avec le client, prêt pour le plan d'implémentation

## Problème

La boutique sert aujourd'hui deux langues seulement : `es` et `en`.

Ce socle est incomplet sur trois axes :

- plusieurs messages du site ne sont pas correctement traduits, et certains
  textes visibles restent mêlés entre espagnol, français, anglais et allemand ;
- les pages légales ne gèrent que `es` et `en`, alors que le client veut un
  corpus complet en `es`, `en`, `de` et `it`, avec l'espagnol comme version de
  référence ;
- le catalogue n'a pas de vrai back-office multilingue : les produits, les
  sections détaillées, les variantes, les catégories et les guides ne disposent
  que d'une couche anglaise partielle, sans onglets par langue côté
  administration.

Le résultat est double : côté visiteur, l'expérience multilingue manque de
cohérence ; côté administrateur, corriger ou compléter les traductions produit
par produit demande trop d'effort et n'est pas cadré par une interface claire.

## Objectif

Servir toute la boutique en quatre langues (`es`, `en`, `de`, `it`), avec
`es` comme source de vérité éditoriale, et donner à l'administration des onglets
par langue pour modifier facilement les contenus traduisibles, en particulier
les pages légales et les produits.

## État de départ, constaté dans le dépôt le 20 août 2026

- `src/i18n/routing.ts` ne déclare que `es` et `en`.
- `src/messages/` ne contient que `es.json` et `en.json`.
- `src/content/legal/` ne contient que `es.ts` et `en.ts`.
- `src/server/legalPages.ts` et `src/components/admin/LegalPageForm.tsx`
  supposent deux langues seulement.
- `prisma/schema.prisma` stocke le catalogue en version principale plus champs
  `*En` :
  - `Group.labelEn`
  - `Category.labelEn`, `descriptionEn`, `guideIntroEn`, `guideClosingEn`
  - `GuideSection.headingEn`, `bodyEn`
  - `Product.nameEn`, `shortDescriptionEn`, `descriptionEn`, `bulletsEn`
  - `ProductSection.headingEn`, `bodyEn`
  - `ProductVariant.labelEn`
- `src/server/localizedContent.ts` ne charge que les traductions anglaises et
  les applique avec repli sur l'espagnol.
- `src/components/admin/ProductForm.tsx` n'offre aucun onglet de langue : seul
  l'espagnol est éditable directement.
- `src/components/LanguageSwitcher.tsx` affiche des boutons courts (`ES`, `EN`)
  au lieu d'un sélecteur avec drapeau et nom complet.
- `src/components/admin/ProductPreview.tsx` contient encore des libellés figés
  en français et en allemand, donc ne peut pas refléter correctement une
  édition multilingue.

## Décisions arrêtées

### 1. Les langues gérées sont `es`, `en`, `de`, `it`

La boutique publique, les messages applicatifs, les pages légales et les
contenus catalogue partagent exactement les quatre mêmes locales :

- `es` : espagnol, langue par défaut et source éditoriale ;
- `en` : anglais ;
- `de` : allemand ;
- `it` : italien.

Il n'y aura pas de langue partielle ou expérimentale. Une locale déclarée dans
le routing doit être servie sur tout le site.

### 2. Les URLs restent simples : `es` à la racine, les autres préfixées

Règle d'adressage retenue :

- espagnol : `/`
- anglais : `/en/...`
- allemand : `/de/...`
- italien : `/it/...`

Cette règle reprend le comportement actuel : le marché principal est espagnol,
donc les URL courtes et l'indexation primaire restent portées par `es`.

Les slugs de catégories, produits et pages légales restent identiques dans les
quatre langues. Ce chantier n'introduit pas de slugs traduits. Cela évite une
refonte lourde du routage, des imports, des liens internes et du SEO technique,
sans empêcher la traduction complète des contenus.

### 3. L'espagnol devient explicitement la source de vérité partout

Les mentions légales sont déjà pensées ainsi dans la demande du client ; le
catalogue doit suivre exactement la même logique.

Règle unique :

- les champs espagnols portent la version de référence ;
- `en`, `de` et `it` stockent des traductions facultatives ;
- si une traduction est absente ou vide, l'affichage retombe sur l'espagnol ;
- l'administration montre toujours `ES` en premier et identifie les autres
  langues comme traductions de travail.

Le chantier ne cherche donc pas à rendre les quatre langues symétriques au
niveau du stockage : il formalise une source et trois relectures traduites.

### 4. Le modèle produit réutilise l'approche des pages légales : onglets par langue

Le principe à reprendre depuis les pages légales est l'expérience d'édition,
pas le stockage exact.

Les formulaires d'administration exposeront quatre onglets :

- `Español`
- `English`
- `Deutsch`
- `Italiano`

Chaque onglet garde son brouillon tant que l'utilisateur ne publie pas. Changer
d'onglet ne doit jamais faire perdre de saisie.

L'interface signalera par langue :

- contenu modifié non publié ;
- contenu d'origine / contenu personnalisé quand ce concept existe ;
- langue active servant d'aperçu.

### 5. Les champs catalogue sont séparés entre données globales et textes traduits

#### Restent globaux, communs aux quatre langues

- catégorie de rattachement ;
- marque ;
- slug ;
- SKU ;
- image principale et galerie ;
- prix, ancien prix, badge promotionnel ;
- note, stock, seuil d'alerte ;
- GTIN, MPN, `condition`, `saleMode` ;
- `specs`, poids d'expédition, classe énergie.

Ces données décrivent le même produit indépendamment de la langue ; les dupliquer
introduirait du risque sans gain.

#### Deviennent traduits par langue

- nom du groupe ;
- nom de catégorie ;
- description de catégorie ;
- introduction et conclusion du guide de catégorie ;
- titres et corps des sections du guide ;
- nom produit ;
- description courte ;
- description longue ;
- liste des bullets ;
- titres et corps des sections produit ;
- libellés des variantes.

La marque n'est pas traduite : `Cheval Liberté`, `Böckmann`, `Fautras`, etc.
restent les dénominations commerciales du constructeur.

### 6. Le schéma Prisma s'étend par colonnes, pas par table générique

Le dépôt suit déjà ce modèle avec les suffixes `En`. Le plus simple est donc
de l'étendre à `De` et `It` plutôt que d'introduire maintenant une table de
traductions générique.

Champs à ajouter :

- `Group.labelDe`, `labelIt`
- `Category.labelDe`, `descriptionDe`, `guideIntroDe`, `guideClosingDe`
- `Category.labelIt`, `descriptionIt`, `guideIntroIt`, `guideClosingIt`
- `GuideSection.headingDe`, `bodyDe`, `headingIt`, `bodyIt`
- `Product.nameDe`, `shortDescriptionDe`, `descriptionDe`, `bulletsDe`
- `Product.nameIt`, `shortDescriptionIt`, `descriptionIt`, `bulletsIt`
- `ProductSection.headingDe`, `bodyDe`, `headingIt`, `bodyIt`
- `ProductVariant.labelDe`, `labelIt`

Toutes ces colonnes sont des chaînes avec valeur par défaut vide, comme les
colonnes anglaises existantes. Une chaîne vide signifie « pas encore traduit »,
donc repli sur `es`.

### 7. Les pages légales passent de 2 à 4 langues sans changer de logique

Le système existant reste valable :

- le contenu d'origine versionné avec le code vit dans `src/content/legal/`;
- la base `LegalContent` continue de porter les réécritures de l'administration ;
- la base l'emporte si une ligne existe, sinon le fichier d'origine sert de
  repli ;
- la lecture publique continue à être tolérante : en cas de contenu illisible ou
  d'absence d'override, le site affiche au moins le contenu d'origine.

Les adaptations portent sur :

- `LegalLocale` passe de `es | en` à `es | en | de | it` ;
- ajout des corpus `de.ts` et `it.ts` ;
- extension de `LEGAL_LOCALES`, `ORIGIN_PAGES`, `FOOTER_GROUP_TITLES`,
  `publicHref()` et de la liste admin ;
- `LegalPageForm` passe à quatre onglets avec les mêmes garanties de brouillon
  que pour deux langues.

L'espagnol reste le texte de référence ; les versions `en`, `de` et `it` sont
des traductions de ce corpus.

### 8. Le chargeur de contenu localisé devient multilingue par table

`src/server/localizedContent.ts` ne doit plus être codé pour l'anglais. Il doit
charger, pour la locale demandée :

- les libellés traduits de groupes ;
- les catégories traduites ;
- les produits traduits ;
- les sections traduites ;
- les libellés de variantes traduits.

Le module garde une règle simple :

- si la locale est `es`, aucune requête de traduction n'est nécessaire ;
- sinon, les champs de la locale demandée sont lus ;
- le repli sur `es` se fait champ par champ, jamais en laissant un trou vide.

Le mapping par position déjà utilisé pour `GuideSection` et `ProductSection`
reste valable ; il évite de changer les interfaces de rendu.

### 9. L'admin produit devient un vrai formulaire multilingue

Le formulaire produit est réorganisé en deux blocs :

#### Bloc global

Tout ce qui ne dépend pas de la langue :

- catégorie ;
- marque ;
- image principale ;
- galerie ;
- prix ;
- stock ;
- attributs Merchant ;
- variantes de prix ;
- disponibilité ;
- paramètres techniques.

#### Bloc par langue

Sous onglets `ES / EN / DE / IT` :

- nom ;
- description courte ;
- description longue ;
- bullets ;
- sections titrées ;
- libellés de variantes.

L'aperçu latéral suit la langue active : un administrateur qui corrige l'italien
doit voir l'aperçu italien, pas l'espagnol.

Le même principe devra être appliqué ensuite aux formulaires groupe et catégorie
pour que « tout le site » soit réellement administrable dans les quatre langues.

### 10. Le switcher public devient un sélecteur avec drapeau et nom complet

Le bouton actuel par code de langue est remplacé dans le top header par un
sélecteur unique affichant :

- drapeau ;
- nom complet de la langue ;
- locale active clairement visible.

Libellés retenus :

- `Español`
- `English`
- `Deutsch`
- `Italiano`

Le sélecteur reste sur la même page lors du changement de langue et respecte les
préfixes `next-intl` déjà en place. Il ne redirige jamais selon la langue du
navigateur : le changement reste un choix explicite du visiteur.

### 11. Les messages d'interface doivent être complets et cohérents dans 4 fichiers

`src/messages/es.json` reste la base. Trois fichiers doivent l'aligner :

- `src/messages/en.json`
- `src/messages/de.json`
- `src/messages/it.json`

Le chantier inclut la correction des libellés manifestement faux ou hors sujet
dans les messages existants. Une boutique de remorques à chevaux ne doit plus
porter de reliquats issus d'un ancien catalogue bois / poêles.

### 12. L'aperçu admin et les composants statiques doivent cesser de mentir sur la langue

`ProductPreview` ne peut plus contenir de libellés fixes en français ou en
allemand. Il doit recevoir ou calculer ses textes depuis la langue active de
l'onglet édité, sinon l'aperçu induit l'administrateur en erreur.

Cette règle vaut aussi pour les libellés auxiliaires du back-office quand ils
apparaissent dans un aperçu rendu comme la boutique.

## Contenu à produire dans ce chantier

Le chantier ne se limite pas au socle technique. Il inclut aussi la production
de contenu nécessaire pour que le site soit réellement servable en quatre
langues :

- traduction et correction des 10 pages légales et informatives en `en`, `de`
  et `it`, à partir de `es` ;
- traduction des messages d'interface ;
- traduction des contenus catalogue existants depuis `es` vers `en`, `de` et
  `it`.

Le texte espagnol existant est la version de référence. Si une formulation en
anglais actuellement en ligne diverge de l'espagnol, elle doit être alignée sur
le texte espagnol, pas l'inverse.

## Ce que ce chantier ne fait pas

- Il ne traduit pas les slugs d'URL.
- Il ne crée pas d'auto-traduction à la volée via API externe.
- Il ne met pas en place de workflow brouillon / publié distinct pour les
  produits.
- Il ne traduit pas les données purement numériques ou techniques communes aux
  quatre langues.
- Il ne tente pas de rendre la marque ou les noms propres variables selon la
  locale.

## Impact sur l'existant

### Routing et SEO

- `src/i18n/routing.ts`, `src/i18n/navigation.ts`, `src/i18n/request.ts` et
  `src/lib/hreflang.ts` doivent être élargis à quatre locales.
- `generateStaticParams()` des layouts et pages localisées doit couvrir `es`,
  `en`, `de`, `it`.
- les balises `alternates.languages` doivent annoncer les quatre versions plus
  `x-default` vers `es`.

### Storefront

- toutes les pages publiques localisées doivent pouvoir charger les nouveaux
  fichiers de messages ;
- les vues catégorie et produit doivent lire la traduction de la locale active
  pour les sections, bullets et variantes ;
- les composants qui affichent le sélecteur de langue doivent adopter la
  nouvelle UX select + drapeau.

### Administration

- la liste et l'édition des pages légales passent à 4 colonnes / 4 onglets ;
- les formulaires produit, catégorie et groupe doivent exposer des champs par
  langue selon le même pattern ;
- les routes API d'administration produit et catégorie doivent accepter les
  nouvelles clés de traduction ;
- les validations serveur doivent rester centralisées et continuer de refuser
  les données invalides indépendamment du navigateur.

### Base de données

- migration Prisma ajoutant les colonnes `De` et `It` manquantes ;
- adaptation des mappers `toProductRecord`, `toViewProduct`, `writeVariants` et
  des types partagés pour porter `en`, `de`, `it`.

## Tests attendus

`npm test` et, si possible, `npm run lint` doivent couvrir au minimum :

- le repli vers l'espagnol quand une traduction `en`, `de` ou `it` est vide ;
- le chargement des traductions catalogue pour les quatre locales ;
- la validation et l'écriture des contenus produit multilingues ;
- l'adressage `hreflang` sur quatre langues ;
- la normalisation des pages légales sur quatre langues.

Des vérifications manuelles sont aussi requises :

- changement de langue sur la même page via le nouveau sélecteur ;
- affichage correct d'une page produit dans les quatre langues ;
- édition d'une page légale dans les quatre onglets ;
- édition d'un produit avec aperçu cohérent dans la langue active.
