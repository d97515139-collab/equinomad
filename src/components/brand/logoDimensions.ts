/**
 * Dimensions des images bitmap du logo, produites par scripts/generer-logos.mjs.
 * Les e-mails et le composant Logo les lisent ici : un seul endroit à changer
 * si le logo change de proportions. LOGO_FULL suit le rapport du tracé de
 * logo.json (1147 × 288), vérifié par logoData.test.ts.
 */
export const LOGO_FULL = { width: 1200, height: 301 } as const;
export const LOGO_ICON = { width: 512, height: 512 } as const;
