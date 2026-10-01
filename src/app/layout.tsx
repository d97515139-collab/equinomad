import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";

// Inter porte toute l'interface : navigation, fiches, chiffres techniques.
// Sa chasse tabulaire (voir « .dato » dans globals.css) aligne les MMA et les
// charges utiles en colonne, ce qui est la seule façon honnête de laisser
// comparer deux remorques.
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

// Fraunces ne sert qu'aux titres et au nom de marque. C'est un serif à axes
// variables : « opsz » adapte le dessin au corps, « SOFT » arrondit les angles,
// « WONK » libère les lettres à empattement penché. Trois axes chargés, pas un
// de plus — chacun pèse dans le fichier téléchargé.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Remolque Caballos | Remolques para caballos — venta, matriculación y entrega a domicilio",
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
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
