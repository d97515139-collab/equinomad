import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { acceptLanguageOverride, isCrawler } from "@/i18n/localeDetection";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/adminAuth";
import {
  attendUneReponseJson,
  cheminToujoursAutorise,
  maintenanceActive,
} from "@/lib/maintenance";
import { PAGE_MAINTENANCE } from "@/lib/maintenancePage";

// Anciennement `middleware.ts` : Next 16 a renommé la convention en `proxy`.
// Le proxy tourne en runtime Node.js, ce qui permet d'y vérifier la signature
// de la session avec `node:crypto`, comme partout ailleurs dans le projet.

const routageMultilingue = createMiddleware(routing);
// Les robots d'indexation voient l'URL demandée, sans redirection de langue :
// chaque version est explorée à son adresse, reliée aux autres par hreflang.
const routageSansDetection = createMiddleware({ ...routing, localeDetection: false });

/**
 * Langue d'arrivée : quand le navigateur ne parle aucune langue du site, le
 * pays fourni par Vercel prend le relais (voir src/i18n/localeDetection.ts).
 */
function routageDuVisiteur(request: NextRequest): NextResponse {
  if (isCrawler(request.headers.get("user-agent"))) return routageSansDetection(request);

  const langue = acceptLanguageOverride({
    acceptLanguage: request.headers.get("accept-language"),
    country: request.headers.get("x-vercel-ip-country"),
    hasLocaleCookie: request.cookies.has("NEXT_LOCALE"),
  });
  if (!langue) return routageMultilingue(request);

  const entetes = new Headers(request.headers);
  entetes.set("accept-language", langue);
  return routageMultilingue(new NextRequest(request, { headers: entetes }));
}

/**
 * Le back-office, les API, le flux Merchant et les trois routes de campagne
 * restent hors du routage multilingue.
 *
 * Les routes de campagne sont volontairement courtes — un lien de message doit
 * rester lisible et tenir sur une ligne — et n'ont pas de version par langue :
 * /c et /p ne renvoient qu'une redirection ou une image, et /desinscription choisit
 * sa langue d'après le destinataire enregistré, pas d'après l'URL. Les faire
 * passer par le routage multilingue les réécrirait en /fr/c/... et casserait
 * tous les liens déjà partis dans les boîtes des clients.
 */
function horsRoutageMultilingue(pathname: string): boolean {
  return (
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/feed") ||
    pathname.startsWith("/c/") ||
    pathname.startsWith("/p/") ||
    pathname.startsWith("/desinscription/") ||
    // Servis à la racine, sans version par langue : les faire passer par le
    // routage multilingue les réécrirait en /fr/sitemap.xml, qui n'existe pas.
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  );
}

/**
 * Une session valide suffit à traverser la maintenance. On ne vérifie que la
 * signature du jeton, pas l'existence du compte en base : ce serait une requête
 * de plus sur chaque page, et la maintenance est justement le moment où la base
 * peut être indisponible. Le jeton est signé et daté — il ne s'obtient pas sans
 * être passé par le mot de passe et le code à six chiffres.
 */
function administrateurConnecte(request: NextRequest): boolean {
  const jeton = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  try {
    return verifySessionToken(jeton) !== null;
  } catch {
    // ADMIN_SESSION_SECRET absente : personne ne peut être authentifié, et la
    // maintenance ne doit pas se lever pour autant.
    return false;
  }
}

function reponseMaintenance(pathname: string): NextResponse {
  // 503 plutôt que 200 : c'est la réponse qui dit aux moteurs de recherche
  // « revenez plus tard » au lieu de leur faire indexer la page d'attente à la
  // place de la boutique. `Retry-After` leur donne le délai en secondes.
  const entetes = {
    "Retry-After": "3600",
    "Cache-Control": "no-store",
  };

  if (attendUneReponseJson(pathname)) {
    return NextResponse.json(
      { error: "La boutique est en maintenance. Merci de réessayer dans quelques instants." },
      { status: 503, headers: entetes },
    );
  }

  return new NextResponse(PAGE_MAINTENANCE, {
    status: 503,
    headers: { ...entetes, "Content-Type": "text/html; charset=utf-8" },
  });
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    maintenanceActive() &&
    !cheminToujoursAutorise(pathname) &&
    !administrateurConnecte(request)
  ) {
    return reponseMaintenance(pathname);
  }

  if (horsRoutageMultilingue(pathname)) {
    return NextResponse.next();
  }

  return routageDuVisiteur(request);
}

export const config = {
  // Plus large que le seul routage multilingue : la maintenance doit aussi
  // couvrir les API et le flux Merchant, sinon on pourrait encore passer
  // commande pendant que la vitrine affiche qu'elle est fermée. Le tri entre
  // les deux traitements se fait dans `proxy`, pas ici.
  //
  // Restent en dehors : les ressources internes de Next et tout chemin portant
  // une extension de fichier — images, polices, favicon. La page d'attente en a
  // besoin, et les exclure évite de faire tourner ce code sur chaque octet
  // statique.
  //
  // Le sitemap et le robots.txt portent une extension et tomberaient donc dans
  // cette exclusion : il faut les nommer un à un. Sans ça, une boutique fermée
  // continuerait de publier la liste complète de ses 166 pages.
  matcher: ["/((?!_next|_vercel|.*\\..*).*)", "/sitemap.xml", "/robots.txt"],
};
