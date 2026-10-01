import { getTranslations } from "next-intl/server";

import { exigenciaPermiso, VEHICULO_MINIMO_REALISTA } from "@/lib/permiso";

/**
 * Bloc « quel permis pour tracter ce modèle ».
 *
 * Il ne donne pas une réponse unique — elle dépend de la voiture — mais le
 * seuil que l'acheteur confronte à sa carte grise. C'est la question qu'il se
 * pose vraiment avant d'acheter, et aucun concurrent espagnol n'y répond fiche
 * par fiche.
 */
export async function ProductPermisoBlock({ mmaKg }: { mmaKg: number }) {
  const t = await getTranslations("product");
  const exigencia = exigenciaPermiso(mmaKg);

  return (
    <div className="rounded-[--radius] border border-border bg-muted/40 p-4 text-sm">
      <p className="font-semibold text-foreground">{t("permiso.titulo")}</p>

      {exigencia.exigeCamion ? (
        <p className="mt-2 text-muted-foreground">{t("permiso.exigeCamion")}</p>
      ) : (
        <>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            {exigencia.bImposibleEnLaPractica ? (
              <li>{t("permiso.bInsuficiente")}</li>
            ) : (
              <li>{t("permiso.conB", { kg: exigencia.vehiculoMaxConB })}</li>
            )}
            {/* Une ligne dont le maximum tombe sous le seuil réaliste n'est pas
                une option : sur une remorque de 3 500 kg, le B96 laisserait
                750 kg de véhicule, ce qu'aucune voiture ne respecte. La valeur
                est juste, la présenter comme un choix serait trompeur. */}
            {exigencia.vehiculoMaxConB96 >= VEHICULO_MINIMO_REALISTA && (
              <li>{t("permiso.conB96", { kg: exigencia.vehiculoMaxConB96 })}</li>
            )}
            {exigencia.vehiculoMaxConBE >= VEHICULO_MINIMO_REALISTA && (
              <li>{t("permiso.conBE", { kg: exigencia.vehiculoMaxConBE })}</li>
            )}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">{t("permiso.nota")}</p>
        </>
      )}
    </div>
  );
}
