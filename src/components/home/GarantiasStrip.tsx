import { getTranslations } from "next-intl/server";
import { FileCheck2, ShieldCheck, Truck, Wrench } from "lucide-react";

/**
 * Bande de réassurance, juste sous le bandeau d'ouverture.
 *
 * Les quatre promesses répondent aux quatre objections qui reviennent dans ce
 * métier : « il va falloir que je m'occupe des papiers », « et si ça casse »,
 * « comment il arrive » et « qui le répare après ». Aucune ne parle de prix :
 * le prix se discute sur la fiche, pas ici.
 */
const GARANTIAS = [
  { clave: "matriculacion", Icono: FileCheck2 },
  { clave: "garantia", Icono: ShieldCheck },
  { clave: "entrega", Icono: Truck },
  { clave: "taller", Icono: Wrench },
] as const;

export async function GarantiasStrip() {
  const t = await getTranslations("inicio.garantias");

  return (
    <section className="border-y border-border bg-white">
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        {GARANTIAS.map(({ clave, Icono }) => (
          <div key={clave} className="flex items-start gap-3.5 bg-white px-4 py-6 sm:px-6">
            <Icono className="mt-0.5 h-6 w-6 shrink-0 text-rojo" aria-hidden />
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground">{t(`${clave}.titulo`)}</p>
              <p className="mt-1 text-[0.8rem] leading-relaxed text-muted-foreground">
                {t(`${clave}.texto`)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
