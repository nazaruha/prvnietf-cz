import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isAuthorized } from "./basicAuth.ts";

const header = (credentials: string) => `Basic ${Buffer.from(credentials, "utf8").toString("base64")}`;

describe("isAuthorized", () => {
  it("accepts the right username and password", () => {
    assert.equal(isAuthorized(header("admin:s3cret"), "admin", "s3cret"), true);
  });

  it("allows a colon inside the password", () => {
    assert.equal(isAuthorized(header("admin:a:b"), "admin", "a:b"), true);
  });

  it("rejects a wrong username or password", () => {
    assert.equal(isAuthorized(header("admin:wrong"), "admin", "s3cret"), false);
    assert.equal(isAuthorized(header("root:s3cret"), "admin", "s3cret"), false);
  });

  it("rejects a missing or malformed header", () => {
    assert.equal(isAuthorized(null, "admin", "s3cret"), false);
    assert.equal(isAuthorized("Bearer abc", "admin", "s3cret"), false);
    assert.equal(isAuthorized(header("no-colon"), "admin", "s3cret"), false);
  });

  it("denies everyone when the credentials are not configured", () => {
    assert.equal(isAuthorized(header(":"), "", ""), false);
    assert.equal(isAuthorized(header("admin:s3cret"), undefined, "s3cret"), false);
    assert.equal(isAuthorized(header("admin:s3cret"), "admin", undefined), false);
  });
});
