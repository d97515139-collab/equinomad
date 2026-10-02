import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { attachDatabasePool } from "@vercel/functions";
import pg from "pg";
import { poolMax } from "@/server/dbPool";

// La connexion dépend uniquement de DATABASE_URL :
//   postgresql://user:pw@hote:port/base  -> PostgreSQL auto-hébergé (compte equinomad)
// Le schéma Prisma est figé sur le provider « postgresql » : changer de moteur
// demanderait de le régénérer, pas seulement de changer cette variable.
function createClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL est absente : la base ne peut pas être ouverte.");
  }

  const pool = new pg.Pool({
    connectionString: url,
    // Neon met le calcul en veille après une période d'inactivité : le
    // premier appel qui le réveille peut demander plusieurs secondes.
    //
    // Quarante-cinq secondes, et non quinze : en développement, la
    // compilation Turbopack d'une route encore froide monopolise la boucle
    // d'événements plusieurs dizaines de secondes. Les acquisitions de
    // connexion déjà en attente expiraient pendant ce blocage — d'où des
    // « timeout exceeded when trying to connect » au premier chargement de
    // chaque page, alors que la base répondait en 115 ms et n'ouvrait que
    // sept connexions sur cent. Le délai ne protège pas d'une base en
    // panne : celle-ci refuse la connexion tout de suite, sans attendre.
    connectionTimeoutMillis: 45_000,
    // Une connexion inactive est rendue au bout de trente secondes plutôt
    // que gardée ouverte : le compte de la boutique est limité en
    // connexions sur un serveur partagé.
    idleTimeoutMillis: 30_000,
    max: poolMax(),
  });

  // Sur Vercel, une instance mise en veille gèle aussi le minuteur qui devait
  // fermer ses connexions inactives : elles restaient ouvertes des heures et
  // épuisaient la limite du compte, jusqu'à faire échouer le build suivant
  // (« too many connections for role »). attachDatabasePool garde l'instance
  // éveillée le temps de les rendre. Sans effet hors de Vercel.
  attachDatabasePool(pool);

  return new PrismaClient({ adapter: new PrismaPg(pool) });
}

// En développement, le client survit au rechargement à chaud : sinon chaque
// enregistrement de fichier ouvrirait de nouvelles connexions.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Mémorisation dans une variable de module : elle doit être inconditionnelle,
// quel que soit NODE_ENV. `globalThis` ne sert qu'au rechargement à chaud du
// développement, qui réévalue les modules — pas à la mémorisation elle-même.
// (Une mémorisation conditionnée à `NODE_ENV !== "production"` a longtemps
// été sans conséquence, tant que le client était construit une seule fois à
// l'évaluation du module. Une fois cette construction déplacée derrière un
// Proxy déclenché à chaque accès de propriété, la même garde rappelait
// `createClient()` — donc un nouveau pool `pg` de dix connexions jamais
// fermé — à chaque `prisma.product`, chaque `prisma.$transaction`, en
// production. Voir `getClient` et `src/server/prisma.test.ts`.)
let client: PrismaClient | undefined;

/**
 * Rend le client, en l'ouvrant au premier appel. La variable de module suffit
 * à garantir l'unicité dans un processus ; `globalThis` ne sert qu'au
 * rechargement à chaud du développement, qui réévalue les modules.
 */
export function getClient(): PrismaClient {
  client ??= globalForPrisma.prisma ?? createClient();
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}

/**
 * Client instancié à la première utilisation plutôt qu'à l'import : un module
 * qui importe merchant.ts pour sa logique pure — les tests, par exemple — n'a
 * pas à disposer d'une base.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_cible, propriete) {
    const cible = getClient();
    const valeur: unknown = Reflect.get(cible, propriete);
    // Les méthodes Prisma (ex. product.findMany) accèdent à `this` en interne :
    // les renvoyer telles quelles depuis le Proxy les détacherait du client
    // réel. On les relie explicitement pour préserver leur contexte.
    return typeof valeur === "function" ? valeur.bind(cible) : valeur;
  },
});
