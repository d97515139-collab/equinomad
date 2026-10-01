import { test } from "node:test";
import assert from "node:assert/strict";
import { LOGO_FULL } from "./logoDimensions";
import logo from "./logo.json";

test("le logo vectorisé contient le symbole et le nom", () => {
  assert.match(logo.symbol, /^M[\d.\s,MCLZ-]+$/);
  assert.match(logo.wordmark, /^M[\d.\s,MCLZ-]+$/);
  assert.ok(logo.wordmark.length > logo.symbol.length, "le nom compte plus de tracés que le symbole");
});

test("les images bitmap gardent les proportions du tracé", () => {
  const ratioTrace = logo.width / logo.height;
  const ratioBitmap = LOGO_FULL.width / LOGO_FULL.height;
  assert.ok(Math.abs(ratioTrace - ratioBitmap) < 0.01, `${ratioTrace} ≠ ${ratioBitmap}`);
});
