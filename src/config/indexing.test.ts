import { test } from "node:test";
import assert from "node:assert/strict";
import { noindexHeaders, robotsRules } from "./indexing";

test("sans SITE_NOINDEX, le site reste indexable", () => {
  assert.deepEqual(noindexHeaders({}), []);
  const regles = robotsRules({});
  assert.equal(regles.allow, "/");
  assert.ok(Array.isArray(regles.disallow) && regles.disallow.includes("/admin"));
});

test("avec SITE_NOINDEX=1, chaque réponse porte noindex et robots.txt ferme tout", () => {
  const env = { SITE_NOINDEX: "1" };
  assert.deepEqual(noindexHeaders(env), [
    { source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
  ]);
  const regles = robotsRules(env);
  assert.equal(regles.allow, undefined);
  assert.equal(regles.disallow, "/");
});
