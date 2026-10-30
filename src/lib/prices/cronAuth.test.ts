import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isAuthorizedCron } from "./cronAuth.ts";

const SECRET = "test-cron-secret";

describe("isAuthorizedCron", () => {
  it("accepts the exact Bearer header", () => {
    assert.equal(isAuthorizedCron(`Bearer ${SECRET}`, SECRET), true);
  });

  it("rejects a missing, wrong or malformed header", () => {
    for (const header of [null, "", SECRET, `bearer ${SECRET}`, `Bearer ${SECRET} `, `Bearer ${SECRET}x`, "Bearer other", "Bearer "]) {
      assert.equal(isAuthorizedCron(header, SECRET), false, String(header));
    }
  });

  it("never matches when the secret is empty", () => {
    assert.equal(isAuthorizedCron("Bearer ", ""), false);
    assert.equal(isAuthorizedCron("Bearer undefined", ""), false);
  });
});
