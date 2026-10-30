import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isIsoDate, parseDecimalString, parseEtfProfileTer, parseGlobalQuote } from "./alphaVantage.ts";

// Fixtures follow the shape of real Alpha Vantage responses (all values are strings).
const quote = (fields: Record<string, string>) => ({
  "Global Quote": {
    "01. symbol": "VWCE.DEX",
    "02. open": "140.1000",
    "05. price": "141.2400",
    "07. latest trading day": "2026-10-29",
    "10. change percent": "0.4135%",
    ...fields,
  },
});

const RATE_LIMIT_NOTE = {
  Note: "Thank you for using Alpha Vantage! Our standard API call frequency is 5 calls per minute and 25 calls per day.",
};
const RATE_LIMIT_INFO = { Information: "We have detected your API key as ... standard API rate limit is 25 requests per day." };
const ERROR = { "Error Message": "Invalid API call. Please retry or visit the documentation." };

describe("parseDecimalString", () => {
  it("parses plain decimal strings", () => {
    assert.equal(parseDecimalString("141.2400"), 141.24);
    assert.equal(parseDecimalString("0.0003"), 0.0003);
    assert.equal(parseDecimalString("12"), 12);
  });

  it("rejects non-strings, signs, percentages, exponents and empty values", () => {
    for (const value of [141.24, null, undefined, "", " ", "None", "-1.5", "+2", "0.4135%", "1e3", "1,5", "NaN", "Infinity"]) {
      assert.equal(parseDecimalString(value), null, String(value));
    }
  });
});

describe("isIsoDate", () => {
  it("accepts real YYYY-MM-DD dates only", () => {
    assert.equal(isIsoDate("2026-10-29"), true);
    assert.equal(isIsoDate("2024-02-29"), true);
    for (const value of ["2026-02-30", "2026-13-01", "29. 10. 2026", "2026-10-29T00:00:00Z", "", 20261029]) {
      assert.equal(isIsoDate(value), false, String(value));
    }
  });
});

describe("parseGlobalQuote", () => {
  it("returns price and trading day from a valid response", () => {
    assert.deepEqual(parseGlobalQuote(quote({}), "VWCE.DEX"), { ok: true, value: { price: 141.24, asOf: "2026-10-29" } });
  });

  it("matches the symbol case-insensitively and accepts a missing symbol", () => {
    assert.equal(parseGlobalQuote(quote({ "01. symbol": "vwce.dex" }), "VWCE.DEX").ok, true);
    const withoutSymbol = { "Global Quote": { "05. price": "141.2400", "07. latest trading day": "2026-10-29" } };
    assert.equal(parseGlobalQuote(withoutSymbol, "VWCE.DEX").ok, true);
  });

  it("rejects rate-limit and error messages sent with HTTP 200", () => {
    assert.deepEqual(parseGlobalQuote(RATE_LIMIT_NOTE, "VOO"), { ok: false, reason: "rate-limited" });
    assert.deepEqual(parseGlobalQuote(RATE_LIMIT_INFO, "VOO"), { ok: false, reason: "rate-limited" });
    assert.deepEqual(parseGlobalQuote(ERROR, "VOO"), { ok: false, reason: "api-error" });
    // A message next to data still means the data can't be trusted.
    assert.deepEqual(parseGlobalQuote({ ...quote({}), ...RATE_LIMIT_NOTE }, "VWCE.DEX"), { ok: false, reason: "rate-limited" });
  });

  it("rejects empty and malformed responses", () => {
    assert.deepEqual(parseGlobalQuote({}, "VOO"), { ok: false, reason: "missing-data" });
    assert.deepEqual(parseGlobalQuote({ "Global Quote": {} }, "VOO"), { ok: false, reason: "missing-data" });
    assert.deepEqual(parseGlobalQuote({ "Global Quote": [] }, "VOO"), { ok: false, reason: "missing-data" });
    for (const json of [null, "text", 42, []]) {
      assert.deepEqual(parseGlobalQuote(json, "VOO"), { ok: false, reason: "not-an-object" });
    }
  });

  it("rejects another symbol's quote", () => {
    assert.deepEqual(parseGlobalQuote(quote({ "01. symbol": "VUAA.DEX" }), "VWCE.DEX"), { ok: false, reason: "symbol-mismatch" });
  });

  it("rejects bad, zero and negative prices", () => {
    assert.deepEqual(parseGlobalQuote(quote({ "05. price": "abc" }), "VWCE.DEX"), { ok: false, reason: "bad-number" });
    assert.deepEqual(parseGlobalQuote(quote({ "05. price": "" }), "VWCE.DEX"), { ok: false, reason: "bad-number" });
    assert.deepEqual(parseGlobalQuote(quote({ "05. price": "-141.24" }), "VWCE.DEX"), { ok: false, reason: "bad-number" });
    assert.deepEqual(parseGlobalQuote(quote({ "05. price": "0.0000" }), "VWCE.DEX"), { ok: false, reason: "not-positive" });
  });

  it("rejects a missing or malformed trading day", () => {
    assert.deepEqual(parseGlobalQuote(quote({ "07. latest trading day": "" }), "VWCE.DEX"), { ok: false, reason: "bad-date" });
    assert.deepEqual(parseGlobalQuote(quote({ "07. latest trading day": "10/29/2026" }), "VWCE.DEX"), { ok: false, reason: "bad-date" });
  });
});

describe("parseEtfProfileTer", () => {
  const profile = {
    net_assets: "1400000000000",
    net_expense_ratio: "0.0003",
    portfolio_turnover: "0.02",
    dividend_yield: "0.0121",
    holdings: [],
  };

  it("returns the TER as a fraction and ignores net assets and holdings", () => {
    assert.deepEqual(parseEtfProfileTer(profile), { ok: true, value: 0.0003 });
  });

  it("rejects rate-limit and error messages", () => {
    assert.deepEqual(parseEtfProfileTer(RATE_LIMIT_NOTE), { ok: false, reason: "rate-limited" });
    assert.deepEqual(parseEtfProfileTer(RATE_LIMIT_INFO), { ok: false, reason: "rate-limited" });
    assert.deepEqual(parseEtfProfileTer(ERROR), { ok: false, reason: "api-error" });
  });

  it("rejects the empty object returned for UCITS tickers", () => {
    assert.deepEqual(parseEtfProfileTer({}), { ok: false, reason: "missing-data" });
    assert.deepEqual(parseEtfProfileTer(null), { ok: false, reason: "not-an-object" });
  });

  it("rejects bad, zero, negative and out-of-range TERs", () => {
    assert.deepEqual(parseEtfProfileTer({ ...profile, net_expense_ratio: "None" }), { ok: false, reason: "bad-number" });
    assert.deepEqual(parseEtfProfileTer({ ...profile, net_expense_ratio: "0.03%" }), { ok: false, reason: "bad-number" });
    assert.deepEqual(parseEtfProfileTer({ ...profile, net_expense_ratio: "-0.0003" }), { ok: false, reason: "bad-number" });
    assert.deepEqual(parseEtfProfileTer({ ...profile, net_expense_ratio: "0" }), { ok: false, reason: "not-positive" });
    assert.deepEqual(parseEtfProfileTer({ ...profile, net_expense_ratio: "3" }), { ok: false, reason: "out-of-range" });
  });
});
