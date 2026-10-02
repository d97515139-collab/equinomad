import { test } from "node:test";
import assert from "node:assert/strict";
import table from "../../scripts/data/noms-produits-traduits.json";
import { besoinDeTraduction, traduireNom, traduirePuce } from "./productNameTranslations";

test("les caractéristiques techniques sont traduites selon le style du catalogue", () => {
  assert.equal(traduirePuce("Dos caballos", "Fr"), "Deux chevaux");
  assert.equal(traduirePuce("Un caballo", "De"), "Ein Pferd");
  assert.equal(traduirePuce("MMA 2700 kg, tara 1000 kg, carga útil 1700 kg", "Fr"), "PTAC : 2700 kg, tare : 1000 kg, charge utile : 1700 kg");
  assert.equal(traduirePuce("MMA 2700 kg, tara 1000 kg, carga útil 1700 kg", "En"), "GVW 2700 kg, unladen weight 1000 kg, payload 1700 kg");
  assert.equal(traduirePuce("Interior de 3.52 × 1.79 × 2.26 m", "It"), "Interno 3.52 × 1.79 × 2.26 m");
});

test("une caractéristique inconnue n'est pas devinée", () => {
  assert.equal(traduirePuce("Suelo de madera", "Fr"), null);
});

test("un champ à refaire : message d'erreur du traducteur ou texte resté en espagnol", () => {
  assert.equal(besoinDeTraduction("MYMEMORY WARNING: YOU USED ALL AVAILABLE FREE TRANSLATIONS"), true);
  assert.equal(besoinDeTraduction("Remolque para caballos dos plazas"), true);
  assert.equal(besoinDeTraduction("Remorque pour chevaux deux places"), false);
  assert.equal(besoinDeTraduction("Gold One Origins"), false);
});

test("chaque nom de la table est traduit dans les quatre langues, sans espagnol", () => {
  for (const [espagnol, traductions] of Object.entries(table)) {
    for (const langue of ["En", "Fr", "De", "It"] as const) {
      const t = traduireNom(espagnol, langue);
      assert.ok(t && t === traductions[langue], `${espagnol} / ${langue}`);
      assert.equal(besoinDeTraduction(t), false, `${langue} : ${t}`);
    }
  }
  assert.equal(traduireNom("Nom absent de la table", "Fr"), null);
});
