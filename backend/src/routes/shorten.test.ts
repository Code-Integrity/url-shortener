// backend/src/routes/shorten.test.ts
import test from "node:test";
import assert from "node:assert";
import { isValidUrl } from "./shorten";

test("URL Validation - OWASP Compliance Security Check", async (t) => {
  await t.test("should return true for valid HTTP/HTTPS URLs", () => {
    assert.strictEqual(isValidUrl("https://google.com"), true);
    assert.strictEqual(isValidUrl("http://example.com"), true);
  });

  await t.test(
    "should return false for invalid or malicious URL schemes",
    () => {
      assert.strictEqual(isValidUrl("javascript:alert(1)"), false); // XSS Vector
      assert.strictEqual(isValidUrl("ftp://malicious-server.com"), false); // SSRF / Out of bound
      assert.strictEqual(isValidUrl("not-a-url"), false);
    },
  );
});
