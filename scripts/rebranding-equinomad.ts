import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Retire de la base l'identité de l'ancien client et installe celle
 * d'Equinomad. À blanc par défaut ; `--apply` sauvegarde puis écrit tout en une
 * seule transaction. Relancé, il ne trouve plus rien à faire.
 *
 *   npx tsx scripts/rebranding-equinomad.ts            # à blanc
 *   npx tsx scripts/rebranding-equinomad.ts --apply    # écriture
 */
try {
  process.loadEnvFile(".env.local");
} catch {
  // Variables déjà présentes dans l'environnement.
}

const APPLY = process.argv.includes("--apply");
const NEW_ADMIN_EMAIL = "d97515139@gmail.com";
const OLD_BRAND = "Remolque Caballos";
const PRODUCT_TEXT_FIELDS = [
  "name", "shortDescription", "description", "bullets",
  "nameEn", "shortDescriptionEn", "descriptionEn", "bulletsEn",
  "nameFr", "shortDescriptionFr", "descriptionFr", "bulletsFr",
  "nameDe", "shortDescriptionDe", "descriptionDe", "bulletsDe",
  "nameIt", "shortDescriptionIt", "descriptionIt", "bulletsIt",
] as const;
type ProductTextField = (typeof PRODUCT_TEXT_FIELDS)[number];

async function main(): Promise<void> {
  const { prisma } = await import("../src/server/prisma");
  const { hashPassword, verifyPassword } = await import("../src/lib/password");
  const { hasLegacyIdentity, planStockRestoration, rebrandLegalText, rebrandProductText } =
    await import("../src/server/rebranding");

  // ---- Lecture ----
  const orders = await prisma.order.findMany({ select: { id: true, orderNumber: true } });
  const orderIds = orders.map((o) => o.id);
  const [itemCount, eventCount] = await Promise.all([
    prisma.orderItem.count({ where: { orderId: { in: orderIds } } }),
    prisma.orderEvent.count({ where: { orderId: { in: orderIds } } }),
  ]);
  const movements = await prisma.stockMovement.findMany({
    select: { id: true, productId: true, delta: true, reason: true, note: true },
  });
  const stock = planStockRestoration(movements, orders.map((o) => o.orderNumber));
  if (stock.unmatched.length > 0) {
    throw new Error(`Ventes impossibles à rattacher à une commande : ${stock.unmatched.join(", ")}`);
  }

  const products = await prisma.product.findMany();
  const productChanges = products
    .map((p) => {
      const data: Partial<Record<ProductTextField | "brand", string>> = {};
      if (p.brand === OLD_BRAND) data.brand = "";
      for (const field of PRODUCT_TEXT_FIELDS) {
        const after = rebrandProductText(p[field]);
        if (after !== p[field]) data[field] = after;
      }
      return { id: p.id, slug: p.slug, before: p, data };
    })
    .filter((c) => Object.keys(c.data).length > 0);
  const productLeftovers = productChanges.flatMap((c) =>
    PRODUCT_TEXT_FIELDS.filter((f) => hasLegacyIdentity(c.data[f] ?? c.before[f])).map((f) => `${c.slug}.${f}`),
  );

  const legalRows = await prisma.legalContent.findMany();
  const legalChanges = legalRows
    .map((row) => ({ row, data: rebrandLegalText(row.data) }))
    .filter((c) => c.data !== c.row.data || hasLegacyIdentity(c.row.updatedBy ?? ""));
  const legalLeftovers = legalChanges
    .filter((c) => hasLegacyIdentity(c.data))
    .map((c) => `${c.row.locale}/${c.row.slug}`);

  const bankRow = await prisma.setting.findUnique({ where: { key: "bank_transfer" } });
  const bank = bankRow ? (JSON.parse(bankRow.value) as Record<string, string>) : null;
  const bankNeedsReset = Boolean(bank && (bank.holder || bank.iban || bank.bic));
  const transfer = await prisma.paymentMethod.findUnique({ where: { key: "transferencia" } });
  const transferNeedsDisable = Boolean(transfer?.enabled);

  const admins = await prisma.adminUser.findMany();
  const password = process.env.ADMIN_PASSWORD ?? "";
  const adminTarget = admins.find((a) => a.email === NEW_ADMIN_EMAIL) ?? admins.find((a) => hasLegacyIdentity(a.email));
  const adminNeedsUpdate = Boolean(
    adminTarget &&
      (adminTarget.email !== NEW_ADMIN_EMAIL || !password || !verifyPassword(password, adminTarget.passwordHash)),
  );

  // ---- Rapport ----
  console.log(APPLY ? "Mode écriture" : "Mode à blanc (ajouter --apply pour écrire)");
  console.log(`Commandes à supprimer : ${orders.length} (${itemCount} lignes, ${eventCount} événements)`);
  console.log(`Mouvements de stock à supprimer : ${stock.movementIds.length} ; stock rendu : ${JSON.stringify(stock.increments)}`);
  console.log(`Produits à modifier : ${productChanges.length} (dont marque vidée : ${productChanges.filter((c) => c.data.brand === "").length})`);
  for (const c of productChanges.slice(0, 5)) {
    const champ = (Object.keys(c.data).find((k) => k !== "brand") ?? "brand") as ProductTextField | "brand";
    console.log(`  ${c.slug} · ${champ} → ${String(c.data[champ]).slice(0, 140)}`);
  }
  console.log(`Pages légales à modifier : ${legalChanges.length}`);
  console.log(`Virement : ${bankNeedsReset ? "coordonnées bancaires à vider" : "rien"} ; méthode : ${transferNeedsDisable ? "à désactiver" : "rien"}`);
  console.log(`Administrateur : ${adminNeedsUpdate ? `à basculer vers ${NEW_ADMIN_EMAIL}` : "rien"}`);
  if (productLeftovers.length || legalLeftovers.length) {
    console.error("Textes encore marqués par l'ancienne identité après remplacement :");
    for (const l of [...productLeftovers, ...legalLeftovers]) console.error(`  - ${l}`);
    throw new Error("Remplacements incomplets : compléter les règles de src/server/rebranding.ts.");
  }

  const nothing =
    orders.length === 0 && stock.movementIds.length === 0 && productChanges.length === 0 &&
    legalChanges.length === 0 && !bankNeedsReset && !transferNeedsDisable && !adminNeedsUpdate;
  if (nothing) {
    console.log("Rien à faire.");
    return;
  }
  if (!APPLY) return;
  if (adminNeedsUpdate && !password) throw new Error("ADMIN_PASSWORD manque dans .env.local.");

  // ---- Sauvegarde ----
  const dossier = path.join(process.cwd(), ".migration");
  await mkdir(dossier, { recursive: true });
  const fichier = path.join(dossier, `rebranding-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  const backup = {
    orders: await prisma.order.findMany({ where: { id: { in: orderIds } }, include: { items: true, events: true } }),
    movements: movements.filter((m) => stock.movementIds.includes(m.id)),
    products: productChanges.map((c) => c.before),
    legal: legalChanges.map((c) => c.row),
    bank: bankRow,
    transfer,
    admins,
  };
  await writeFile(fichier, JSON.stringify(backup, null, 2), "utf8");
  console.log(`Sauvegarde : ${fichier}`);

  // ---- Écriture ----
  await prisma.$transaction(
    async (tx) => {
      await tx.orderEvent.deleteMany({ where: { orderId: { in: orderIds } } });
      await tx.orderItem.deleteMany({ where: { orderId: { in: orderIds } } });
      await tx.order.deleteMany({ where: { id: { in: orderIds } } });
      await tx.stockMovement.deleteMany({ where: { id: { in: stock.movementIds } } });
      for (const [productId, quantite] of Object.entries(stock.increments)) {
        await tx.product.update({ where: { id: productId }, data: { stock: { increment: quantite } } });
      }
      for (const c of productChanges) {
        await tx.product.update({ where: { id: c.id }, data: c.data });
      }
      for (const c of legalChanges) {
        await tx.legalContent.update({
          where: { slug_locale: { slug: c.row.slug, locale: c.row.locale } },
          data: { data: c.data, updatedBy: "rebranding-equinomad" },
        });
      }
      if (bankRow && bank && bankNeedsReset) {
        await tx.setting.update({
          where: { key: "bank_transfer" },
          data: { value: JSON.stringify({ ...bank, holder: "", iban: "", bic: "" }) },
        });
      }
      if (transferNeedsDisable) {
        await tx.paymentMethod.update({ where: { key: "transferencia" }, data: { enabled: false } });
      }
      if (adminTarget && adminNeedsUpdate) {
        await tx.adminUser.update({
          where: { id: adminTarget.id },
          data: { email: NEW_ADMIN_EMAIL, name: "Administración Equinomad", passwordHash: hashPassword(password) },
        });
      }
    },
    { timeout: 600_000, maxWait: 60_000 },
  );
  console.log("Écriture terminée.");
  await prisma.$disconnect();
}

main().catch((erreur: unknown) => {
  console.error(erreur instanceof Error ? erreur.message : erreur);
  process.exitCode = 1;
});
