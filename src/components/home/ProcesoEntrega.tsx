import { getTranslations } from "next-intl/server";

/**
 * Les quatre étapes entre la commande et la première sortie.
 *
 * Sur ce marché, l'acheteur ne se demande pas seulement quand il recevra le
 * véhicule, mais qui s'occupe de l'immatriculation et de l'ITV. Tant que ce
 * n'est pas écrit noir sur blanc, il suppose que ça retombera sur lui — et il
 * appelle un concessionnaire physique. Les quatre étapes existent pour couper
 * court à cette supposition.
 */
const PASOS = ["pedido", "matriculacion", "entrega", "puesta"] as const;

export async function ProcesoEntrega() {
  const t = await getTranslations("inicio.proceso");

  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="eyebrow text-rojo">{t("eyebrow")}</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-[2.4rem]">
            {t("titulo")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{t("intro")}</p>
        </div>

        <ol className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {PASOS.map((paso, indice) => (
            <li key={paso} className="bg-white p-6">
              {/* Le numéro est un repère de lecture, pas une décoration : il est
                  gros, en chiffre tabulaire, et il porte le filet rouge. */}
              <div className="flex items-baseline gap-3">
                <span className="dato text-3xl font-bold text-rojo">
                  {String(indice + 1).padStart(2, "0")}
                </span>
                <span className="h-px flex-1 bg-rojo/45" />
              </div>
              <h3 className="mt-4 text-base font-bold text-foreground">{t(`${paso}.titulo`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(`${paso}.texto`)}
              </p>
              <p className="dato mt-3 text-[0.72rem] font-bold tracking-wide text-secondary uppercase">
                {t(`${paso}.plazo`)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
