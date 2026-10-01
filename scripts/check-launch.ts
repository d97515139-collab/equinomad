import { legalPagesWithPendingMark, missingCompanyFields } from "../src/config/company";

/**
 * Contrôle avant mise en ligne : liste ce qui manque encore et se termine en
 * erreur tant qu'il reste quelque chose.
 *
 *   npm run check:launch
 */
try {
  process.loadEnvFile(".env.local");
} catch {
  // Pas de .env.local : en production, les variables viennent de l'hébergeur.
}

async function main(): Promise<void> {
  const manques: string[] = missingCompanyFields().map(
    (champ) => `COMPANY.${champ} est encore une valeur d'exemple (src/config/company.ts)`,
  );

  for (const variable of ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD", "MAIL_FROM"]) {
    if (!process.env[variable]?.trim()) manques.push(`${variable} n'est pas définie`);
  }

  const { prisma } = await import("../src/server/prisma");
  const ligne = await prisma.setting.findUnique({ where: { key: "bank_transfer" } });
  const virement = ligne ? (JSON.parse(ligne.value) as { iban?: string }) : {};
  if (!virement.iban?.trim()) manques.push("IBAN du virement non renseigné (back-office, Paiements)");
  const pages = await prisma.legalContent.findMany({ select: { locale: true, slug: true, data: true } });
  for (const page of legalPagesWithPendingMark(pages)) {
    manques.push(`page légale ${page} : coordonnées encore à compléter dans la version en base (back-office)`);
  }
  await prisma.$disconnect();

  if (manques.length === 0) {
    console.log("Prêt pour la mise en ligne.");
    return;
  }
  console.error(`${manques.length} point(s) à régler avant la mise en ligne :`);
  for (const m of manques) console.error(`  - ${m}`);
  process.exitCode = 1;
}

main().catch((erreur: unknown) => {
  console.error(erreur instanceof Error ? erreur.message : erreur);
  process.exitCode = 1;
});
