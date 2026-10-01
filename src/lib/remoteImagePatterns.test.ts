import assert from "node:assert/strict";
import test from "node:test";
import { remoteImagePatterns } from "./remoteImagePatterns";

test("autorise les domaines d'images utilises par le catalogue d'occasion", () => {
  const hosts = new Set(remoteImagePatterns.map((pattern) => pattern.hostname));

  assert.ok(hosts.has("res.cloudinary.com"));
  assert.ok(hosts.has("dux0knkimndc1.cloudfront.net"));
  assert.ok(hosts.has("cdn.truckscout24.com"));
});
