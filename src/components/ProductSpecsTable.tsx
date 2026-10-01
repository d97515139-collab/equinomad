import { getTranslations } from "next-intl/server";

import type { EspecificacionesRemolque } from "@/server/productSpecs";

/**
 * Tableau technique d'une remorque.
 *
 * Sa forme est identique sur toutes les fiches : c'est ce qui fait tenir la
 * cohérence d'un catalogue de plusieurs centaines de références, bien mieux
 * qu'une consigne de rédaction. La prose varie d'un modèle à l'autre, le
 * tableau non.
 */
export async function ProductSpecsTable({ specs }: { specs: EspecificacionesRemolque }) {
  const t = await getTranslations("product");

  // Les essieux et le freinage ne figurent pas sur toutes les fiches
  // constructeur : leur ligne disparaît plutôt que d'afficher un vide.
  const filas: readonly (readonly [string, string])[] = [
    [t("specs.plazas"), String(specs.plazas)],
    [t("specs.mma"), `${specs.mmaKg} kg`],
    [t("specs.tara"), `${specs.taraKg} kg`],
    [t("specs.cargaUtil"), `${specs.cargaUtilKg} kg`],
    [
      t("specs.medidas"),
      `${specs.largoInteriorCm} × ${specs.anchoInteriorCm} × ${specs.altoInteriorCm} cm`,
    ],
    ...(specs.suelo === undefined ? [] : [[t("specs.suelo"), specs.suelo] as const]),
    ...(specs.ejes === undefined ? [] : [[t("specs.ejes"), String(specs.ejes)] as const]),
    ...(specs.frenos === undefined ? [] : [[t("specs.frenos"), specs.frenos] as const]),
  ];

  return (
    <table className="w-full text-sm">
      <caption className="sr-only">{t("specsTitle")}</caption>
      <tbody>
        {filas.map(([etiqueta, valor]) => (
          <tr key={etiqueta} className="border-b border-border last:border-0">
            <th scope="row" className="py-2 pr-4 text-left font-medium text-muted-foreground">
              {etiqueta}
            </th>
            <td className="py-2 text-right font-semibold text-foreground">{valor}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
