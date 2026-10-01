/**
 * Indexation par les moteurs de recherche.
 *
 * SITE_NOINDEX=1 ferme le site aux moteurs : en-tête X-Robots-Tag sur chaque
 * réponse et robots.txt qui interdit tout. Sert au site de démonstration montré
 * au client, encore rempli de valeurs [A COMPLETAR]. Au lancement, il suffit de
 * retirer la variable — aucun code à toucher.
 */
type Env = Readonly<Record<string, string | undefined>>;

interface RobotsRule {
  userAgent: string;
  allow?: string;
  disallow: string | string[];
}

interface HeaderRule {
  source: string;
  headers: { key: string; value: string }[];
}

function indexingBlocked(env: Env): boolean {
  return env.SITE_NOINDEX === "1";
}

export function noindexHeaders(env: Env = process.env): HeaderRule[] {
  if (!indexingBlocked(env)) return [];
  return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
}

export function robotsRules(env: Env = process.env): RobotsRule {
  if (indexingBlocked(env)) return { userAgent: "*", disallow: "/" };
  return {
    userAgent: "*",
    allow: "/",
    // Back-office, API et tunnel d'achat n'ont rien à faire dans l'index
    disallow: ["/admin", "/api", "/panier", "/commande", "/confirmation", "/en/panier", "/en/commande", "/en/confirmation"],
  };
}
