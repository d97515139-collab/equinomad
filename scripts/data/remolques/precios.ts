/**
 * Prix source par slug, en euros, tels que le client les transmet.
 *
 * La marge ne s'applique pas ici : elle vit dans `src/lib/margen.ts`, à un seul
 * endroit, pour rester révisable sans rejouer tout le catalogue. Un slug absent
 * de cette table entre au catalogue en « consultar precio » plutôt qu'avec un
 * montant que personne n'a validé.
 *
 * Les montants attendus ici sont ceux de la grille du client, hors marge. À
 * réception, vérifier s'il s'agit de PVP conseillés ou de prix d'achat
 * revendeur : la constante MARGEN s'ajuste en conséquence.
 */
export { precioConMargen } from "../../../src/lib/margen";

export const PRECIOS: Readonly<Record<string, number>> = {
  // Cheval Liberté — source Equus Life, prix HT affichés sur la fiche produit.
  "cl-maxi-3-living": 14_118,
  // SARL Geavida — prix affiché sur la fiche produit du HB610.
  "iw-hb610": 8_000,
};
