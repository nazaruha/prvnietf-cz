import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { redactUrl, redactUrlProperties } from "./redactUrl.ts";

describe("redactUrl", () => {
  it("removes the unsubscribe token and keeps other params", () => {
    assert.equal(redactUrl("https://prvnietf.cz/odhlasit?t=abc.def"), "https://prvnietf.cz/odhlasit");
    assert.equal(
      redactUrl("https://prvnietf.cz/odhlasit?v=b&t=abc.def&utm_source=fb#x"),
      "https://prvnietf.cz/odhlasit?v=b&utm_source=fb#x",
    );
  });

  it("leaves URLs without the token, relative paths and plain text untouched", () => {
    for (const value of ["https://prvnietf.cz/?v=b&utm_term=t", "/odhlasit?t=abc", "t=abc", "", "https://"]) {
      assert.equal(redactUrl(value), value);
    }
  });
});

describe("redactUrlProperties", () => {
  it("redacts every string URL property and keeps the rest", () => {
    assert.deepEqual(
      redactUrlProperties({
        $current_url: "https://prvnietf.cz/odhlasit?t=abc.def",
        $referrer: "https://prvnietf.cz/odhlasit?t=abc.def&v=a",
        $pathname: "/odhlasit",
        ad_version: "a",
        $screen_width: 390,
        flag: null,
      }),
      {
        $current_url: "https://prvnietf.cz/odhlasit",
        $referrer: "https://prvnietf.cz/odhlasit?v=a",
        $pathname: "/odhlasit",
        ad_version: "a",
        $screen_width: 390,
        flag: null,
      },
    );
  });
});
