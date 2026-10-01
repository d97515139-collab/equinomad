/**
 * Sources d'images autorisées par `next/image`.
 *
 * Le catalogue propre passe par Cloudinary, mais les annonces d'occasion
 * réutilisent aussi les visuels hébergés directement chez leurs places de
 * marché. Sans ces domaines, Next renvoie 400 sur `/_next/image`.
 */
export const remoteImagePatterns = [
  {
    protocol: "https",
    hostname: "res.cloudinary.com",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "dux0knkimndc1.cloudfront.net",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "cdn.truckscout24.com",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "cdn.ehorses.media",
    pathname: "/**",
  },
] as const;
