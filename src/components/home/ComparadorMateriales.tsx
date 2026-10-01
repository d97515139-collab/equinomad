import { getTranslations } from "next-intl/server";

/**
 * Comparatif des trois matériaux de caisse.
 *
 * C'est le deuxième arbitrage de l'acheteur, après le nombre de places, et
 * celui sur lequel les vendeurs sont le plus vagues. Le tableau tranche : trois
 * colonnes, cinq critères, aucune mention « excellent » — que des faits
 * mesurables ou des conséquences concrètes.
 *
 * Le poids est donné en écart, pas en valeur absolue : la valeur absolue dépend
 * du modèle, l'écart est constant et c'est lui qui décide.
 */
const MATERIALES = ["poliester", "aluminio", "mixto"] as const;
const CRITERIOS = ["peso", "aislamiento", "golpes", "mantenimiento", "precio"] as const;

export async function ComparadorMateriales() {
  const t = await getTranslations("inicio.materiales");

  return (
    <section className="bg-tinta py-14 text-white sm:py-20">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="eyebrow text-rojo">{t("eyebrow")}</p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-[2.4rem]">{t("titulo")}</h2>
          <p className="mt-4 text-base leading-relaxed text-white/65">{t("intro")}</p>
        </div>

        {/* Le tableau déborde plutôt que de se comprimer : trois colonnes de
            texte serrées sur un téléphone deviennent illisibles. Il défile
            dans son propre cadre, la page ne bouge pas. */}
        <div className="mt-10 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <thead>
              <tr>
                <th className="w-40 border-b border-white/15 pb-3 text-[0.68rem] font-bold tracking-[0.16em] text-white/45 uppercase">
                  {t("criterio")}
                </th>
                {MATERIALES.map((material) => (
                  <th
                    key={material}
                    className="border-b border-white/15 px-4 pb-3 text-base font-bold text-white"
                  >
                    {t(`${material}.nombre`)}
                    <span className="mt-0.5 block text-[0.7rem] font-normal text-rojo">
                      {t(`${material}.resumen`)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CRITERIOS.map((criterio) => (
                <tr key={criterio} className="align-top">
                  <th className="border-b border-white/8 py-4 pr-4 text-sm font-bold text-white/80">
                    {t(`criterios.${criterio}`)}
                  </th>
                  {MATERIALES.map((material) => (
                    <td
                      key={material}
                      className="border-b border-white/8 px-4 py-4 text-sm leading-relaxed text-white/65"
                    >
                      {t(`${material}.${criterio}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/50">{t("nota")}</p>
      </div>
    </section>
  );
}
