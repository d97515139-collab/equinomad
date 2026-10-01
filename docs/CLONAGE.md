# Clonage indépendant — 1er octobre 2026

Le projet a été copié depuis Remolque Caballos vers le dépôt
`d97515139-collab/remorqueb-ckmann`. Les fichiers de travail, la configuration
Git et la base du projet source n'ont pas été modifiés par cette opération.

## Base de données

- Sauvegarde cohérente PostgreSQL 17, obtenue dans une transaction en lecture seule.
- Restauration vers une base Neon PostgreSQL 18 initialement vide, en une transaction.
- 26 tables et 456 enregistrements copiés.
- Empreintes SHA-256 identiques pour toutes les tables avant l'adaptation des images.
- 366 colonnes, 72 index et 47 contraintes structurelles identiques.
- Les contraintes NOT NULL sont comparées via la nullabilité des colonnes,
  car PostgreSQL 18 les enregistre aussi dans son catalogue de contraintes.
- Prisma : schéma à jour, aucune migration en attente.

### Région

Une première restauration avait été faite dans une base Neon en région
`us-east-2`. Pour un site destiné au marché espagnol, la base a été recréée en
**`eu-central-1` (Francfort)** : même sauvegarde, même substitution des liens
d'images, puis comparaison stricte avec la base `us-east-2`. Les 26 tables ont
des empreintes identiques, et le schéma aussi (colonnes, 362 contraintes,
72 index). C'est la base `eu-central-1` qu'utilise le projet ; la base
`us-east-2` n'est plus référencée et peut être supprimée.

Le transfert inclut notamment 323 produits, 6 catégories, 3 groupes,
18 sections de guide, 8 sections produit, 19 contenus légaux, 9 commandes,
10 lignes de commande, 18 événements de commande, 6 mouvements de stock,
5 moyens de paiement, 16 intégrations et le compte administrateur existant.
Les tables vides ont également été restaurées. Aucune commande n'a été supprimée.

## Images

- 1 412 URL d'images présentes dans la base ont été copiées dans le nouveau compte Cloudinary.
- 4 images supplémentaires du fichier de données initiales ont aussi été copiées.
- Total : 1 416 images, environ 80,1 Mio.
- Les liens des catégories, produits, galeries et lignes de commande pointent
  maintenant vers le nouveau compte.
- Le fichier `data/store/products.json` utilise également les nouveaux liens.
- Chaque table a été comparée après substitution : toutes les autres données
  sont conservées à l'identique. Aucun lien vers l'ancien compte Cloudinary
  ne subsiste dans la base copiée ni dans les fichiers du dépôt.
- Les futurs envois d'images utilisent le dossier `remorqueb-ckmann/productos`.

## Environnement et Git

- `.env.local` contient uniquement la connexion Neon cible et les identifiants
  Cloudinary du nouveau projet, avec de nouveaux secrets de session, de
  chiffrement et de cron. Aucune intégration source ne contenait de secret chiffré.
- Les paramètres SMTP, expéditeur, notifications, chat et WhatsApp attendent
  les informations du nouveau client.
- L'adresse publique locale est `http://localhost:3000`.
- `.env.local`, la sauvegarde et les fichiers de migration sont exclus de Git.
- Aucun secret connu des deux environnements n'a été trouvé dans les fichiers publiables.
- L'historique commence par un nouveau commit ; il ne reprend pas les auteurs
  du dépôt d'origine. Auteur et committer : `d97515139-collab`, avec l'adresse
  `336449939+d97515139-collab@users.noreply.github.com`.

## Validation

- Installation reproductible : `npm ci` et génération Prisma réussies.
- Tests : 240 réussis, aucun échec.
- ESLint : réussi.
- Prisma : schéma à jour.
- Compilation de production et vérification TypeScript : réussies.
- Serveur branché sur la base `eu-central-1` : accueil, `/en`, `/ocasion`,
  fiche produit et connexion au back-office répondent normalement ; les pages
  ne contiennent que des images du nouveau compte Cloudinary.
- Génération statique (1 804 pages) : non menée à terme sur le poste de
  clonage. Chaque page interroge la base ; avec environ 190 ms par requête
  depuis ce poste, et une mémoire saturée par quatre processus de build, la
  génération dépasse l'heure. Sur un hébergement européen, la latence vers
  `eu-central-1` est de quelques millisecondes : c'est là que le build complet
  doit être validé.

Les rapports détaillés, journaux et la sauvegarde intégrale restent localement
sous `.migration/`, hors dépôt. Ce dossier contient des informations privées.

## Prochaine étape

La présentation et les contenus visibles conservent l'identité d'origine pour
cette première copie. Avant mise en ligne : définir la nouvelle marque, le
domaine, le marché, les langues, les coordonnées, les mentions légales, les
informations de paiement et livraison, la messagerie et le compte administrateur.
Décider aussi du devenir des commandes copiées pour le nouveau client.
