import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { remoteImagePatterns } from "./src/lib/remoteImagePatterns";
import { noindexHeaders } from "./src/config/indexing";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Nombre de processus de build.
 *
 * Next dimensionne son pool sur `os.cpus()`. Sur un hébergement mutualisé, cet
 * appel renvoie les cœurs de la machine HÔTE et non ceux alloués au conteneur :
 * sur Hostinger, le build a démarré soixante-trois workers. Chacun ouvre son
 * propre client Prisma — jusqu'à dix connexions PostgreSQL — pour aller lire le
 * catalogue, et Neon a rendu « timeout exceeded when trying to connect » bien
 * avant la fin de la collecte.
 *
 * Quatre workers suffisent : la collecte de pages attend la base, elle n'est pas
 * limitée par le processeur. `NEXT_BUILD_CPUS` permet d'en demander plus sur une
 * machine dont on connaît réellement les ressources.
 */
const buildCpus = Number(process.env.NEXT_BUILD_CPUS) || 4;

const nextConfig: NextConfig = {
  experimental: {
    cpus: buildCpus,
    // Un réveil de Neon (mise en veille après inactivité) peut dépasser le délai
    // de connexion. Une seule reprise transforme cet échec passager en simple
    // ralentissement, au lieu d'un build perdu.
    staticGenerationRetryCount: 1,
    // Moins de workers, chacun traitant davantage de pages : autant de clients
    // Prisma en moins ouverts en parallèle.
    staticGenerationMinPagesPerWorker: 40,
  },

  images: {
    // Le catalogue maison vit sur Cloudinary ; l'occasion reprend aussi les
    // photos réelles des places de marché partenaires.
    remotePatterns: [...remoteImagePatterns],
  },

  async headers() {
    // Site de démonstration : SITE_NOINDEX=1 le ferme aux moteurs de recherche.
    return noindexHeaders();
  },

  async redirects() {
    // Anciennes adresses citées dans le pied de page et le tunnel d'achat :
    // on les conserve en redirection permanente vers les pages réelles.
    const pairs = [
      ["/widerrufsrecht", "/retractation"],
      ["/ruecksendung", "/retours"],
      ["/jobs", "/a-propos"],
      ["/presse", "/a-propos"],
      ["/partnerprogramm", "/a-propos"],
    ];

    return pairs.flatMap(([source, destination]) => [
      { source, destination, permanent: true },
      { source: `/en${source}`, destination: `/en${destination}`, permanent: true },
    ]);
  },
};

export default withNextIntl(nextConfig);
