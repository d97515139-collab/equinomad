import { test } from "node:test";
import assert from "node:assert/strict";
import { poolMax } from "./dbPool";

test("taille du pool : 10 par défaut, DATABASE_POOL_MAX la réduit", () => {
  assert.equal(poolMax({}), 10);
  assert.equal(poolMax({ DATABASE_POOL_MAX: "5" }), 5);
  assert.equal(poolMax({ DATABASE_POOL_MAX: "0" }), 10);
  assert.equal(poolMax({ DATABASE_POOL_MAX: "abc" }), 10);
});
