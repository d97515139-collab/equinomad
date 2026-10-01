import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

/**
 * Garde-fou du changement d'identité : l'ancien client ne doit réapparaître
 * nulle part dans ce que le dépôt livre. docs/ est exclu (historique du
 * clonage et anciennes conceptions), comme ce fichier lui-même.
 */
const RACINE = process.cwd();
const DOSSIERS = ["src", "data", "scripts", "prisma"];
const FICHIERS = ["README.md", "TARGET.md", ".env.example", "package.json"];
const MOTIF = /remolque\s+caballos|remolquecaballos|equivan/i;
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".mjs", ".cjs", ".json", ".md", ".css", ".prisma", ".sql", ".txt"]);
const IGNORES = new Set(["node_modules", "generated", ".next"]);
const CE_FICHIER = path.join("src", "config", "legacyBrand.test.ts");

function parcourir(dossier: string, sortie: string[]): void {
  for (const nom of readdirSync(dossier)) {
    if (IGNORES.has(nom)) continue;
    const chemin = path.join(dossier, nom);
    if (statSync(chemin).isDirectory()) parcourir(chemin, sortie);
    else if (EXTENSIONS.has(path.extname(nom))) sortie.push(chemin);
  }
}

test("aucune trace de l'ancienne identité dans les fichiers livrés", () => {
  const fichiers: string[] = [];
  for (const d of DOSSIERS) parcourir(path.join(RACINE, d), fichiers);
  for (const f of FICHIERS) fichiers.push(path.join(RACINE, f));

  const fautes = fichiers
    .filter((f) => path.relative(RACINE, f) !== CE_FICHIER)
    .flatMap((f) =>
      readFileSync(f, "utf8")
        .split("\n")
        .map((ligne, i) => ({ ligne, i }))
        .filter(({ ligne }) => MOTIF.test(ligne))
        .map(({ i }) => `${path.relative(RACINE, f)}:${i + 1}`),
    );

  assert.deepEqual(fautes, [], `Ancienne identité trouvée :\n${fautes.join("\n")}`);
});
