# remorqueb-ckmann

Copie indépendante de la boutique Remolque Caballos, destinée à un nouveau
client. Le catalogue et le fonctionnement existants sont conservés. La marque,
le design, les coordonnées et le marché cible seront adaptés dans une étape
suivante.

- Dépôt : https://github.com/d97515139-collab/remorqueb-ckmann
- Next.js 16, React 19, TypeScript, Tailwind CSS v4, Prisma 7 / PostgreSQL.
- Base Neon et compte Cloudinary propres à ce projet.
- Historique Git neuf, sans reprendre les commits du dépôt source.

## Développement

```powershell
npm ci
npm run dev
```

Sur la machine ayant effectué le clonage, `.env.local` est déjà configuré.
Sur une autre machine, copier `.env.example` vers `.env.local` et renseigner les
variables du **nouveau** projet. Les secrets ne sont jamais versionnés.

Le back-office est accessible sur `/admin`. Le compte administrateur contenu
dans la base a été copié ; `ADMIN_EMAIL` et `ADMIN_PASSWORD` ne remplacent pas
un compte déjà présent. En développement sans SMTP, le second code de connexion
apparaît dans la console du serveur.

La base Neon contient déjà les données restaurées. Ne pas lancer `db:seed`,
`db:start`, `prisma migrate reset` ni les scripts d'import sur cette base pour
démarrer le projet. Pour une future évolution du schéma, créer une migration
révisée puis utiliser `npm run db:deploy` sur l'environnement concerné.

## Vérification

```powershell
npm test
npm run lint
npm run build
```

## Identité Git

La copie locale utilise ces réglages propres au dépôt :

```powershell
git config --local user.name "d97515139-collab"
git config --local user.email "336449939+d97515139-collab@users.noreply.github.com"
git config --local user.useConfigOnly true
```

Les répéter après un nouveau clonage : `.git/config` n'est pas versionné.
L'attribution des commits dépend de leur adresse e-mail ; le droit de pousser
dépend du compte authentifié auprès de GitHub.

## Avant la mise en ligne

Renseigner le nouveau domaine, l'identité de l'entreprise, les coordonnées,
la messagerie SMTP, l'administrateur, les moyens de paiement et les éventuels
outils de suivi. Les contenus et réglages métier copiés correspondent encore
au client d'origine. Les 9 commandes existantes ont été conservées dans la
copie intégrale ; leur éventuelle suppression relève de la préparation du
nouveau client.

Voir [le compte rendu du clonage](docs/CLONAGE.md). Les autres documents de
recherche et de déploiement proviennent du projet source et doivent être relus
dans le contexte du nouveau client.
