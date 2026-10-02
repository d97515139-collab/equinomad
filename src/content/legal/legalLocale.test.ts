import { test } from "node:test";
import assert from "node:assert/strict";
import { legalLocaleFor } from "./index";

test("une langue sans corpus juridique reçoit la version anglaise", () => {
  assert.equal(legalLocaleFor("es"), "es");
  assert.equal(legalLocaleFor("en"), "en");
  assert.equal(legalLocaleFor("fr"), "en");
  assert.equal(legalLocaleFor("de"), "en");
  assert.equal(legalLocaleFor("it"), "en");
});
