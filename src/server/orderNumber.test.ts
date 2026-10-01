import { test } from "node:test";
import assert from "node:assert/strict";
import { orderNumberPrefix } from "../lib/orderNumber";

test("le préfixe de commande est EQ-AAAA-", () => {
  assert.equal(orderNumberPrefix(2026), "EQ-2026-");
});
