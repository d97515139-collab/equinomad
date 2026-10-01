/**
 * Tests des e-mails de commande.
 *
 * L'enjeu : ces deux messages sont la seule preuve que le client et le vendeur
 * reçoivent de la commande. On vérifie donc qu'ils contiennent réellement les
 * montants, les adresses et les liens attendus — un gabarit qui « compile »
 * mais oublie le total serait une confirmation sans valeur —, que la langue
 * suit celle de la commande, et qu'aucun texte saisi par le client ne peut
 * injecter de HTML.
 *
 * Lancer avec : npm test
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { OrderRecord } from "@/server/orders";
import { buildOrderConfirmationEmail, buildOrderNotificationEmail } from "./order";

const SITE = "https://remolquecaballos.com";
process.env.NEXT_PUBLIC_SITE_URL = SITE;

function order(overrides: Partial<OrderRecord> = {}): OrderRecord {
  return {
    id: "ord_42",
    orderNumber: "EQ-2026-000042",
    accessToken: "9f2c1ab34de5",
    locale: "es",
    email: "anne.exemple@example.fr",
    phone: "+33 1 23 45 67 89",
    billing: {
      salutation: "frau",
      firstName: "Anne",
      lastName: "Exemple",
      company: "",
      street: "12 rue des Tilleuls",
      postalCode: "94300",
      city: "Vincennes",
      country: "es",
    },
    shippingSameAsBilling: true,
    shipping: {
      salutation: "frau",
      firstName: "Anne",
      lastName: "Exemple",
      company: "",
      street: "12 rue des Tilleuls",
      postalCode: "94300",
      city: "Vincennes",
      country: "es",
    },
    paymentMethodKey: "vorkasse",
    paymentMethodLabel: "Virement bancaire préalable",
    paymentMethodFee: "",
    shippingMethodKey: "standard",
    shippingMethodLabel: "Entrega estándar",
    status: "eingegangen",
    paymentStatus: "offen",
    subtotalCents: 89900,
    shippingCents: 495,
    taxCents: 8218,
    totalCents: 90395,
    taxRatePercent: 10,
    currency: "EUR",
    customerNote: "",
    adminNote: "",
    createdAt: "2026-07-30T09:24:00.000Z",
    updatedAt: "2026-07-30T09:24:00.000Z",
    items: [
      {
        id: "item_1",
        brand: "Remolque Caballos",
        name: "Hêtre 33 cm — palette 2 MAP",
        variantLabel: "",
        sku: "HET-33-P2",
        slug: "hetre-33-palette-2map",
        image: "",
        path: "buches/hetre/hetre-33-palette-2map",
        unitPriceCents: 89900,
        quantity: 1,
        lineTotalCents: 89900,
      },
    ],
    events: [],
    ...overrides,
  };
}

describe("Confirmation à l'acheteur", () => {
  it("récapitule le numéro, les articles et les montants", () => {
    const mail = buildOrderConfirmationEmail(order());

    assert.match(mail.subject, /EQ-2026-000042/);
    for (const part of [mail.html, mail.text]) {
      assert.match(part, /EQ-2026-000042/);
      assert.match(part, /Hêtre 33 cm/);
      // Total, sous-total et port : le décompte exigé par l'article L221-13 du
      // Code de la consommation, au format français. La TVA a été retirée du
      // système, elle n'apparaît donc plus.
      assert.match(part, /903,95 €/);
      assert.match(part, /899,00 €/);
      assert.match(part, /4,95 €/);
      assert.match(part, /12 rue des Tilleuls/);
      assert.match(part, /Virement bancaire préalable/);
    }
  });

  it("porte le lien de suivi avec son jeton", () => {
    const mail = buildOrderConfirmationEmail(order());
    const expected = `${SITE}/confirmation/EQ-2026-000042?token=9f2c1ab34de5`;
    assert.ok(mail.html.includes(expected), "lien de suivi absent du HTML");
    assert.ok(mail.text.includes(expected), "lien de suivi absent du texte");
  });

  it("écrit en espagnol par défaut et en anglais sous /en", () => {
    const es = buildOrderConfirmationEmail(order());
    assert.match(es.subject, /Confirmación de pedido/);
    assert.match(es.html, /lang="es"/);
    assert.match(es.html, /Estimada Sra. Exemple/);

    const en = buildOrderConfirmationEmail(order({ locale: "en" }));
    assert.match(en.subject, /Order confirmation/);
    assert.match(en.html, /lang="en"/);
    assert.match(en.html, /Dear Ms Exemple/);
    assert.ok(en.html.includes(`${SITE}/en/confirmation/EQ-2026-000042`));
  });

  it("ne présume rien du prénom sans civilité renseignée", () => {
    const anonymous = order();
    anonymous.billing.salutation = "";
    const mail = buildOrderConfirmationEmail(anonymous);
    assert.match(mail.html, /Hola, Anne Exemple/);
    assert.doesNotMatch(mail.html, /Estimada|Estimado/);
  });

  it("annonce le port offert plutôt qu'un montant nul", () => {
    const mail = buildOrderConfirmationEmail(order({ shippingCents: 0 }));
    assert.match(mail.html, /incluida/);
    assert.doesNotMatch(mail.text, /Entrega — .*: 0,00 €/);
  });

  it("n'affiche l'adresse de facturation que si elle diffère", () => {
    assert.doesNotMatch(buildOrderConfirmationEmail(order()).html, /Dirección de facturación/);

    const distinct = order({ shippingSameAsBilling: false });
    distinct.shipping.street = "3 chemin du Dépôt";
    const mail = buildOrderConfirmationEmail(distinct);
    assert.match(mail.html, /Dirección de facturación/);
    assert.match(mail.html, /3 chemin du Dépôt/);
    assert.match(mail.html, /12 rue des Tilleuls/);
  });

  it("nomme le mode de livraison retenu, dans la langue du message", () => {
    const es = buildOrderConfirmationEmail(order());
    assert.match(es.html, /Entrega estándar \(5 a 10 días laborables\)/);
    assert.match(es.text, /Entrega estándar \(5 a 10 días laborables\)/);

    const express = order({
      shippingMethodKey: "express",
      shippingMethodLabel: "Entrega prioritaria",
      shippingCents: 18_000,
      totalCents: 107_900,
      locale: "en",
    });
    const en = buildOrderConfirmationEmail(express);
    assert.match(en.html, /Priority delivery \(48–72 hours\)/);
    // Le supplément doit apparaître comme un montant, jamais comme « free ».
    assert.match(en.html, /180,00 €/);
    assert.doesNotMatch(en.text, /Shipping — Priority delivery \(48–72 hours\) : free/);
  });

  it("échappe la remarque saisie par le client", () => {
    const mail = buildOrderConfirmationEmail(
      order({ customerNote: '<img src=x onerror="alert(1)">' }),
    );
    assert.doesNotMatch(mail.html, /<img src=x/);
    assert.match(mail.html, /&lt;img src=x/);
  });
});

describe("Notification au vendeur", () => {
  it("annonce le numéro et le montant dès l'objet", () => {
    const mail = buildOrderNotificationEmail(order());
    assert.match(mail.subject, /Nuevo pedido EQ-2026-000042/);
    assert.match(mail.subject, /903,95 €/);
  });

  it("donne les coordonnées du client et le lien back-office", () => {
    const mail = buildOrderNotificationEmail(order());
    for (const part of [mail.html, mail.text]) {
      assert.match(part, /anne\.exemple@example\.fr/);
      assert.match(part, /\+33 1 23 45 67 89/);
      assert.match(part, /Hêtre 33 cm/);
      assert.match(part, /903,95 €/);
    }
    // Le lien pointe la fiche interne par identifiant, pas la page publique :
    // le vendeur doit atterrir là où il peut agir sur la commande.
    assert.ok(mail.html.includes(`${SITE}/admin/orders/ord_42`));
    assert.ok(mail.text.includes(`${SITE}/admin/orders/ord_42`));
    // Le jeton d'accès du client n'a rien à faire dans un message interne.
    assert.doesNotMatch(mail.html, /9f2c1ab34de5/);
  });

  // La notification part vers le back-office : elle reste en espagnol même
  // quand l'acheteur a commandé en anglais, et signale cette langue au vendeur
  // pour qu'il sache dans laquelle répondre.
  it("reste en espagnol, quelle que soit la langue de la commande", () => {
    const mail = buildOrderNotificationEmail(order({ locale: "en" }));
    assert.match(mail.html, /lang="es"/);
    assert.match(mail.html, /Nuevo pedido/);
    assert.match(mail.html, /Idioma del pedido: inglés/);
  });

  it("signale l'express en priorité de préparation", () => {
    const standard = buildOrderNotificationEmail(order());
    assert.match(standard.html, /Entrega estándar \(5 a 10 días laborables\)/);
    assert.doesNotMatch(standard.html, /prioridad/);

    const express = buildOrderNotificationEmail(
      order({
        shippingMethodKey: "express",
        shippingMethodLabel: "Entrega prioritaria",
        shippingCents: 18_000,
      }),
    );
    assert.match(express.html, /Entrega prioritaria \(48 a 72 horas\)/);
    assert.match(express.html, /preparar con prioridad/);
    assert.match(express.text, /Entrega: Entrega prioritaria/);
  });

  it("remonte la remarque du client quand il en a laissé une", () => {
    const mail = buildOrderNotificationEmail(
      order({ customerNote: "Merci de livrer le matin." }),
    );
    assert.match(mail.html, /Observaciones del cliente/);
    assert.match(mail.text, /Merci de livrer le matin\./);
  });
});
