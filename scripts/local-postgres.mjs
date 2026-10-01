/**
 * PostgreSQL local pour le développement, sans installation système.
 *
 * Les binaires viennent du paquet `embedded-postgres` : ce sont les vrais
 * exécutables PostgreSQL, pas une émulation. Le développement tourne donc sur
 * le même moteur que la production, ce qui est la seule façon d'attraper avant
 * la mise en ligne les écarts de SQL, de collation et de types.
 *
 *   npm run db:start   démarre le serveur et le laisse tourner (Ctrl+C arrête)
 *
 * Les données vivent dans `.postgres/`, ignoré par git. Le port est 5433 pour
 * ne pas entrer en conflit avec un PostgreSQL système déjà installé sur 5432.
 * La chaîne de connexion correspondante est dans `.env.local`.
 */
import { copyFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import EmbeddedPostgres from "embedded-postgres";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOSSIER_DONNEES = path.join(RACINE, ".postgres");

/**
 * PostgreSQL 18 pour Windows est compilé avec Visual Studio 2019 ou plus récent :
 * ses exécutables réclament `vcruntime140_1.dll`, apparue avec cette version du
 * compilateur. Windows 10 livre bien `vcruntime140.dll`, mais pas celle-ci —
 * elle vient du « Visual C++ Redistributable 2015-2022 », qui n'est pas
 * installé partout. Sans elle, `initdb.exe` s'arrête sur 0xC0000135
 * (STATUS_DLL_NOT_FOUND), un code que rien dans le message d'erreur n'explique.
 *
 * La bibliothèque est redistribuable et présente sur presque toutes les
 * machines, déposée par un logiciel qui l'embarque. On la recopie à côté des
 * binaires PostgreSQL : Windows cherche d'abord dans le dossier de
 * l'exécutable, la copie l'emporte donc sans rien toucher au système.
 *
 * Le jeu est copié en entier depuis UN SEUL dossier donneur, jamais panaché.
 * Compléter le `msvcp140.dll` du système par une `vcruntime140_1.dll` d'une
 * autre version fait bien démarrer initdb, puis le fait tomber en violation
 * d'accès (0xC0000005) : ces bibliothèques partagent des structures internes
 * et ne se mélangent pas entre versions.
 *
 * Le vrai correctif reste l'installation du redistribuable :
 *   winget install --id Microsoft.VCRedist.2015+.x64
 * Cette fonction n'est qu'un filet, refait à chaque démarrage parce qu'un
 * `npm install` réécrit node_modules et emporte les copies avec lui.
 */
function garantirRuntimeWindows(dossierBinaires) {
  if (process.platform !== "win32") return;

  // `vcruntime140_1.dll` sert de témoin : c'est la seule du lot qui manque sur
  // un Windows sans redistribuable.
  const TEMOIN = "vcruntime140_1.dll";
  const JEU = [
    "vcruntime140.dll",
    "vcruntime140_1.dll",
    "msvcp140.dll",
    "msvcp140_codecvt_ids.dll",
    "concrt140.dll",
    "vccorlib140.dll",
  ];

  const systeme = path.join(process.env.SystemRoot ?? "C:\\Windows", "System32", TEMOIN);
  if (existsSync(systeme) || existsSync(path.join(dossierBinaires, TEMOIN))) return;

  // Emplacements où des logiciels très répandus déposent leur propre copie.
  // Chaque entrée est un dossier dont on explore aussi les sous-dossiers de
  // version — Edge et OneDrive rangent leurs binaires sous « 151.0.4129.72 »,
  // « 26.129.0706.0004 »… Un seul niveau : au-delà, on parcourrait toute une
  // arborescence pour rien.
  const pistes = [
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application",
    "C:\\Program Files (x86)\\Microsoft\\EdgeCore",
    "C:\\Program Files\\Microsoft\\Edge\\Application",
    path.join(process.env.LOCALAPPDATA ?? "", "Microsoft", "OneDrive"),
    "C:\\Program Files\\PCHealthCheck",
  ].filter(Boolean);

  const donneurs = [];
  for (const piste of pistes) {
    if (!existsSync(piste)) continue;
    donneurs.push(piste);
    try {
      for (const entree of readdirSync(piste, { withFileTypes: true })) {
        if (entree.isDirectory()) donneurs.push(path.join(piste, entree.name));
      }
    } catch {
      // Dossier illisible : on passe au suivant plutôt que d'échouer ici.
    }
  }

  // Seul un donneur qui porte TOUT le jeu est retenu : une copie partielle
  // laisserait justement le panachage qu'on cherche à éviter.
  const donneur = donneurs.find((dossier) =>
    JEU.every((fichier) => existsSync(path.join(dossier, fichier))),
  );

  if (donneur) {
    try {
      for (const fichier of JEU) {
        copyFileSync(path.join(donneur, fichier), path.join(dossierBinaires, fichier));
      }
      return;
    } catch {
      // Copie refusée : on retombe sur l'avertissement ci-dessous.
    }
  }

  console.error(
    `Attention : ${TEMOIN} est introuvable et n'a pas pu être recopiée. ` +
      "Si PostgreSQL refuse de démarrer, installer le redistribuable Visual C++ :\n" +
      "  winget install --id Microsoft.VCRedist.2015+.x64",
  );
}

garantirRuntimeWindows(
  path.join(RACINE, "node_modules", "@embedded-postgres", "windows-x64", "native", "bin"),
);

// 5434, et non 5432 ni 5433 : cette machine porte déjà un PostgreSQL 17 sur
// 5433. Deux serveurs sur le même port ne cohabitent pas — le second démarre,
// échoue à réserver la socket et s'arrête aussitôt, ce que la bibliothèque
// rapporte comme un rejet vide, sans aucun message.
const PORT = 5434;
const UTILISATEUR = "equinomad";
const MOT_DE_PASSE = "equinomad";
const BASE = "equinomad";

// `embedded-postgres` laisse parfois échapper un rejet sans valeur : Node
// affiche alors « undefined » et rien d'autre. On rattrape pour au moins dire
// où l'on en était.
process.on("unhandledRejection", (raison) => {
  console.error("Rejet non traité pendant le démarrage de PostgreSQL :", raison);
  process.exit(1);
});

const postgres = new EmbeddedPostgres({
  databaseDir: DOSSIER_DONNEES,
  user: UTILISATEUR,
  password: MOT_DE_PASSE,
  port: PORT,
  // Les données survivent à l'arrêt : sans ça, `stop()` effacerait le cluster
  // et il faudrait rejouer migrations et peuplement à chaque redémarrage.
  persistent: true,
  // Encodage forcé : sans ces drapeaux, initdb suit les paramètres régionaux de
  // Windows et crée un cluster en WIN1252. Un catalogue espagnol (ñ, á, º) et
  // des adresses de livraison y perdraient des caractères, sans erreur visible
  // avant la mise en ligne.
  initdbFlags: ["--encoding=UTF8", "--locale=C"],
  // Le bruit d'initdb et des points de reprise n'apprend rien pendant le
  // développement ; seules les erreurs remontent.
  onLog: () => {},
});

/**
 * `PG_VERSION` n'existe qu'une fois le cluster initialisé : c'est le témoin le
 * plus sûr, plus que la simple présence du dossier — un dossier créé puis vidé
 * par une initialisation interrompue ferait échouer `start()` sans explication.
 */
const dejaInitialise = existsSync(path.join(DOSSIER_DONNEES, "PG_VERSION"));

if (!dejaInitialise) {
  console.log("Initialisation du cluster PostgreSQL local…");
  await postgres.initialise();
}

await postgres.start();
console.log(`PostgreSQL écoute sur 127.0.0.1:${PORT}`);

// `createDatabase` échoue si la base existe déjà : au deuxième démarrage, c'est
// le cas normal et non une erreur. On ne rattrape que ce cas-là (code 42P04),
// tout le reste doit remonter.
try {
  await postgres.createDatabase(BASE);
  console.log(`Base « ${BASE} » créée.`);
} catch (erreur) {
  if (erreur?.code !== "42P04") throw erreur;
  console.log(`Base « ${BASE} » déjà présente.`);
}

console.log("");
console.log(`  DATABASE_URL=postgresql://${UTILISATEUR}:${MOT_DE_PASSE}@127.0.0.1:${PORT}/${BASE}`);
console.log("");
console.log("Serveur en marche. Ctrl+C pour l'arrêter.");

// Le serveur est un processus enfant : il s'éteint avec ce script. Il faut donc
// que ce script reste en vie, d'où l'intervalle — un `await` sur une promesse
// jamais résolue laisserait Node sortir faute de tâche planifiée.
const maintienEnVie = setInterval(() => {}, 1 << 30);

async function arreter() {
  clearInterval(maintienEnVie);
  console.log("\nArrêt de PostgreSQL…");
  await postgres.stop();
  process.exit(0);
}

process.on("SIGINT", arreter);
process.on("SIGTERM", arreter);
