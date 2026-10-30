import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { signUnsubscribeToken, verifyUnsubscribeToken } from "./unsubscribeToken.ts";

const SECRET = "test-secret";
const ID = "cmhd2x0ab0000xyz123";

describe("unsubscribe token", () => {
  it("round-trips the lead id and is URL-safe", () => {
    const token = signUnsubscribeToken(ID, SECRET);
    assert.match(token, /^[\w.-]+$/);
    assert.equal(verifyUnsubscribeToken(token, SECRET), ID);
  });

  it("does not contain anything but the id and the signature", () => {
    assert.equal(signUnsubscribeToken(ID, SECRET).split(".")[0], ID);
  });

  it("rejects a tampered id, a tampered signature and another secret", () => {
    const token = signUnsubscribeToken(ID, SECRET);
    const [, sig] = token.split(".");
    assert.equal(verifyUnsubscribeToken(`cmhd2x0ab0000xyz124.${sig}`, SECRET), null);
    assert.equal(verifyUnsubscribeToken(`${token.slice(0, -1)}A`, SECRET), null);
    assert.equal(verifyUnsubscribeToken(token, "other-secret"), null);
  });

  it("rejects malformed tokens and an empty secret", () => {
    for (const token of ["", ".", "abc", `.${signUnsubscribeToken(ID, SECRET)}`, `${ID}.`]) {
      assert.equal(verifyUnsubscribeToken(token, SECRET), null, token);
    }
    assert.equal(verifyUnsubscribeToken(signUnsubscribeToken(ID, SECRET), ""), null);
    assert.throws(() => signUnsubscribeToken(ID, ""));
  });
});
