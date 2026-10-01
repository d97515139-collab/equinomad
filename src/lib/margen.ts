/**
 * Marge appliquée aux prix fournis par le client.
 *
 * Elle vit ici et nulle part ailleurs : recopiée fiche par fiche, elle
 * deviendrait impossible à réviser sans rejouer tout le catalogue.
 *
 * ATTENTION à l'assiette. Si la grille transmise contient des PVP conseillés,
 * majorer de 10 % place le site au-dessus des distributeurs que l'acheteur
 * compare en un clic ; s'il s'agit de prix d'achat revendeur, 10 % est au
 * contraire très mince une fois le transport, l'immatriculation et la garantie
 * de deux ans payés. La constante s'ajuste à la lecture de la grille.
 */

export const MARGEN = 1.1;

/** Pas d'arrondi, en euros. Un véhicule ne s'affiche pas à 10 994,50 €. */
const REDONDEO_EUROS = 10;

/**
 * Prix de vente en centimes, marge comprise, arrondi aux dix euros supérieurs.
 * Lève sur une entrée non strictement positive : mieux vaut un import qui
 * s'arrête qu'une fiche publiée à zéro euro.
 */
export function precioConMargen(euros: number): number {
  if (!Number.isFinite(euros) || euros <= 0) {
    throw new Error(`Prix source invalide : ${euros}`);
  }
  const conMargen = euros * MARGEN;
  const redondeado = Math.ceil(conMargen / REDONDEO_EUROS) * REDONDEO_EUROS;
  return Math.round(redondeado * 100);
}
