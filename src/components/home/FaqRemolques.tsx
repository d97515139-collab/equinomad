import { getTranslations } from "next-intl/server";

/**
 * Foire aux questions.
 *
 * Six questions, celles qui arrivent réellement au téléphone. Balisage
 * `<details>` natif : l'ouverture fonctionne sans JavaScript, au clavier, et
 * le contenu reste dans le HTML servi — donc indexable, ce qu'un accordéon
 * monté côté client ne garantit pas.
 */
const PREGUNTAS = ["carnet", "matriculacion", "entrega", "itv", "garantia", "financiacion"] as const;

export async function FaqRemolques() {
  const t = await getTranslations("inicio.faq");

  return (
    <section className="bg-nieve py-14 sm:py-20">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
          <div>
            <p className="eyebrow text-rojo">{t("eyebrow")}</p>
            <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-[2.4rem]">
              {t("titulo")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{t("intro")}</p>
          </div>

          <div className="divide-y divide-border border-y border-border">
            {PREGUNTAS.map((pregunta) => (
              <details key={pregunta} className="group py-4">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-bold text-foreground marker:content-none hover:text-rojo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rojo">
                  {t(`${pregunta}.q`)}
                  {/* Signe plus qui devient moins : deux traits, dont l'un
                      pivote. Plus lisible qu'un chevron à cette taille. */}
                  <span className="relative mt-2 h-3 w-3 shrink-0" aria-hidden>
                    <span className="absolute top-1/2 left-0 h-0.5 w-3 -translate-y-1/2 bg-rojo" />
                    <span className="absolute top-1/2 left-0 h-0.5 w-3 -translate-y-1/2 rotate-90 bg-rojo transition-transform duration-200 group-open:rotate-0" />
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {t(`${pregunta}.a`)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
