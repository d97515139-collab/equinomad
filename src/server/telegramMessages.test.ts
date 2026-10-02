import { test } from "node:test";
import assert from "node:assert/strict";
import type { OrderRecord } from "./orders";
import {
  amountMismatchMessage,
  contactMessage,
  newCustomerMessage,
  newOrderMessage,
  newReviewMessage,
  paymentMessage,
} from "./telegramMessages";

const SITE = "https://equinomad.com";
const adresse = { salutation: "", firstName: "Ana", lastName: "Ruiz <Admin>", company: "", street: "Calle 1", postalCode: "28001", city: "Madrid", country: "ES" };
const commande = {
  id: "ord_1", orderNumber: "EQ-2026-014679", email: "ana@example.es", phone: "+34 600 000 000", locale: "fr",
  billing: adresse, shipping: adresse, shippingSameAsBilling: true,
  paymentMethodKey: "transferencia", paymentMethodLabel: "Virement", shippingMethodLabel: "Livraison standard",
  paymentStatus: "offen", status: "eingegangen", totalCents: 945000, currency: "EUR", customerNote: "Livrer le matin",
  items: [{ brand: "Böckmann", name: "Portax", variantLabel: "", quantity: 1, lineTotalCents: 945000 }],
} as unknown as OrderRecord;

test("une nouvelle commande donne l'essentiel et le lien du back-office", () => {
  const m = newOrderMessage(commande, SITE);
  for (const attendu of ["EQ-2026-014679", "9.450,00 €", "Ana Ruiz &lt;Admin&gt;", "ana@example.es", "+34 600 000 000", "28001 Madrid (ES)", "Böckmann Portax", "Virement", "Livrer le matin", `${SITE}/admin/orders/ord_1`]) {
    assert.ok(m.includes(attendu), attendu);
  }
  assert.ok(!m.includes("<Admin>"), "le texte du client est échappé");
});

test("un changement de paiement dit le nouvel état en clair", () => {
  assert.match(paymentMessage(commande, "bezahlt", "stripe", SITE), /payée/);
  assert.match(paymentMessage(commande, "fehlgeschlagen", "paypal", SITE), /échoué/);
  assert.match(paymentMessage(commande, "erstattet", "stripe", SITE), /remboursée/);
});

test("un montant discordant est signalé comme alerte", () => {
  const m = amountMismatchMessage(commande, "945000 EUR", "500 EUR", "stripe", SITE);
  assert.match(m, /montant/i);
  assert.ok(m.includes("945000 EUR") && m.includes("500 EUR"));
});

test("compte, avis et message de contact", () => {
  assert.ok(newCustomerMessage({ firstName: "Ana", lastName: "Ruiz", email: "ana@example.es", phone: "", locale: "es" }).includes("ana@example.es"));
  const avis = newReviewMessage({ productName: "Portax", rating: 4, authorName: "Luc", city: "Lyon", title: "Top", body: "Très bien" }, SITE);
  assert.ok(avis.includes("★★★★☆") && avis.includes(`${SITE}/admin/reviews`));
  const contact = contactMessage({ name: "Luc", email: "luc@example.fr", phone: "", subject: "Question", message: "Livrez-vous en Suisse ? <script>", page: "/fr/nuevos/dos-caballos/x", locale: "fr" }, SITE);
  assert.ok(contact.includes("luc@example.fr") && contact.includes("&lt;script&gt;") && contact.includes(`${SITE}/fr/nuevos/dos-caballos/x`));
});
