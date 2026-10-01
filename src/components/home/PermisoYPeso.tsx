import { getTranslations } from "next-intl/server";
import { IdCard } from "lucide-react";

/**
 * « Puede arrastrarlo con su carnet? »
 *
 * C'est la question qui fait abandonner un panier sur ce marché, et aucune
 * fiche produit ne peut y répondre seule : la réponse dépend du permis ET du
 * véhicule tracteur. La section pose donc la règle une fois pour toutes, à
 * l'échelle, avant que le visiteur n'entre dans le catalogue.
 *
 * Les trois seuils sont ceux du droit espagnol (Reglamento General de
 * Conductores, RD 818/2009) : 3 500 kg pour le B, 4 250 kg pour le B96,
 * 7 000 kg pour le B+E. L'échelle est linéaire de 0 à 7 000 : les largeurs
 * relatives des bandes sont donc justes, ce qui est le seul intérêt d'une
 * échelle. Un graphique qui ment sur les proportions ne vaut pas mieux
 * qu'un paragraphe.
 */

const MAXIMO = 7000;

const NIVELES = [
  // Encre, gris profond, rouge : la barre s'éclaircit et se colore à mesure que
  // le seuil monte. Deux neutres puis le rouge de marque, et non trois nuances
  // d'une même teinte — c'est ce qui garde les bandes distinctes pour un œil qui
  // distingue mal les valeurs voisines, et c'est aussi ce qui fait ressortir le
  // B+E, le seul palier qui demande un examen.
  { clave: "b", limite: 3500, color: "bg-tinta" },
  { clave: "b96", limite: 4250, color: "bg-secondary" },
  { clave: "be", limite: 7000, color: "bg-rojo" },
] as const;

export async function PermisoYPeso() {
  const t = await getTranslations("inicio.permiso");

  return (
    <section className="bg-nieve py-14 sm:py-20">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="eyebrow text-rojo">{t("eyebrow")}</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-[2.4rem]">
            {t("titulo")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{t("intro")}</p>
        </div>

        {/* L'échelle. Les bandes sont empilées de la plus courte à la plus
            longue et posées en absolu : chacune part de zéro, donc leur bord
            droit marque exactement son plafond. */}
        <div className="mt-10 rounded-lg border border-border bg-white p-5 sm:p-7">
          <div className="relative h-14 w-full overflow-hidden rounded-md bg-muted">
            {[...NIVELES]
              .sort((a, b) => b.limite - a.limite)
              .map((nivel) => (
                <div
                  key={nivel.clave}
                  className={`absolute inset-y-0 left-0 ${nivel.color}`}
                  style={{ width: `${(nivel.limite / MAXIMO) * 100}%` }}
                />
              ))}

            {/* Graduations : tous les 1 000 kg, en surimpression claire. */}
            {[1000, 2000, 3000, 4000, 5000, 6000].map((kg) => (
              <div
                key={kg}
                className="absolute inset-y-0 w-px bg-white/25"
                style={{ left: `${(kg / MAXIMO) * 100}%` }}
              />
            ))}
          </div>

          {/* Les bornes chiffrées sous la barre, alignées sur les mêmes
              pourcentages que les bandes. */}
          <div className="relative mt-2 h-10">
            {NIVELES.map((nivel) => {
              // La dernière borne tombe sur le bord droit de la barre : centrée
              // dessus, la moitié de l'étiquette sortirait du cadre. Elle est
              // donc alignée à droite, la seule position qui la garde entière.
              const auBord = nivel.limite === MAXIMO;
              return (
                <div
                  key={nivel.clave}
                  className={
                    auBord
                      ? "absolute top-0 right-0 text-right"
                      : "absolute top-0 -translate-x-1/2 text-center"
                  }
                  style={auBord ? undefined : { left: `${(nivel.limite / MAXIMO) * 100}%` }}
                >
                  <span className="dato block text-sm font-bold whitespace-nowrap text-foreground">
                    {nivel.limite.toLocaleString("es-ES")}
                    <span className="unidad ml-0.5">kg</span>
                  </span>
                  <span className="block text-[0.62rem] tracking-wide whitespace-nowrap text-muted-foreground uppercase">
                    {t(`${nivel.clave}.etiqueta`)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {NIVELES.map((nivel) => (
              <div key={nivel.clave} className="border-t-2 border-border pt-4">
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 shrink-0 rounded-sm ${nivel.color}`} />
                  <h3 className="text-base font-bold text-foreground">
                    {t(`${nivel.clave}.titulo`)}
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`${nivel.clave}.texto`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* L'avertissement qui évite le retour de marchandise : la masse
            remorcable du véhicule tracteur prime sur tout le reste. */}
        <div className="mt-6 flex gap-4 rounded-lg border border-rojo/25 bg-rojo/5 p-5">
          <IdCard className="mt-0.5 h-5 w-5 shrink-0 text-rojo" aria-hidden />
          <p className="text-sm leading-relaxed text-foreground">
            <strong className="font-bold">{t("avisoTitulo")}</strong> {t("avisoTexto")}
          </p>
        </div>
      </div>
    </section>
  );
}
