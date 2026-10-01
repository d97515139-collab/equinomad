# Equinomad

Boutique en ligne Equinomad : remorques et vans pour chevaux, vendus et livrés
depuis l'Espagne vers huit pays européens. Le découpage du chantier (identité,
socle multi-pays, langues, design, pages légales) est décrit dans `TARGET.md`.

- Dépôt : https://github.com/d97515139-collab/equinomad
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

`npm run check:launch` liste ce qui manque encore : coordonnées de la société
(`src/config/company.ts`), messagerie SMTP et IBAN du virement. Il se termine
en erreur tant qu'il reste un point à régler.

Voir [le compte rendu du clonage](docs/CLONAGE.md). Les autres documents de
recherche et de déploiement proviennent du projet source et doivent être relus
dans le contexte du nouveau client.
