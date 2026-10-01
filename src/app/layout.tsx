import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";
import { BRAND } from "@/config/brand";

// Montserrat porte tout le site, titres et interface : une seule famille, en
// police variable (toutes les graisses dans un fichier). Ses chiffres
// tabulaires (voir « .dato » dans globals.css) alignent les MMA et les charges
// utiles en colonne. latin-ext couvre les langues des huit marchés (å, ø, ç…).
const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${BRAND.name} | Remolques para caballos — venta, matriculación y entrega a domicilio`,
  description:
    "Remolques y vans para 1, 2, 3 y 4 caballos: Cheval Liberté, Böckmann, Ifor Williams, Humbaur y Fautras. Homologados, matriculados y entregados en su domicilio.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // La langue vient du routage pour la boutique ; le back-office, hors
  // middleware, retombe sur la langue par défaut (espagnol).
  const locale = await getLocale();

  // suppressHydrationWarning ne porte que sur <html> : les extensions de
  // navigateur y posent leurs propres attributs (data-qb-installed, thèmes
  // sombres, gestionnaires de mots de passe…) avant que React ne s'hydrate.
  // L'écart est alors inévitable et sans conséquence ; la vérification reste
  // entière pour tout le contenu de la page.
  return (
    <html
      lang={locale}
      className={`${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
