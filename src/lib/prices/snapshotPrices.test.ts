import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mapPriceRows, type PriceRow } from "./snapshotPrices.ts";

const NOW = new Date("2026-10-30T12:00:00Z");
const row = (fields: Partial<PriceRow>): PriceRow => ({
  ticker: "VWCE",
  value: "141.24",
  currency: "EUR",
  asOf: new Date("2026-10-29T00:00:00Z"),
  ...fields,
});

describe("mapPriceRows", () => {
  it("maps UCITS rows to FundPrice with the trading day as YYYY-MM-DD", () => {
    const { prices, stale, rejected } = mapPriceRows([row({}), row({ ticker: "VUAA", value: "112.5" })], NOW);
    assert.deepEqual(prices, {
      VWCE: { ticker: "VWCE", price: 141.24, currency: "EUR", asOf: "2026-10-29", source: "Alpha Vantage" },
      VUAA: { ticker: "VUAA", price: 112.5, currency: "EUR", asOf: "2026-10-29", source: "Alpha Vantage" },
    });
    assert.deepEqual(stale, []);
    assert.deepEqual(rejected, []);
  });

  it("ignores US tickers", () => {
    assert.deepEqual(mapPriceRows([row({ ticker: "VOO", currency: "USD" })], NOW).prices, {});
  });

  it("rejects rows with a wrong currency, a non-positive or unparseable value, or a bad date", () => {
    const { prices, rejected } = mapPriceRows(
      [
        row({ ticker: "VWCE", currency: "USD" }),
        row({ ticker: "VUAA", value: "0" }),
        row({ ticker: "V60A", value: "abc" }),
        row({ ticker: "V60A", asOf: new Date("invalid") }),
      ],
      NOW,
    );
    assert.deepEqual(prices, {});
    assert.deepEqual(rejected, ["VWCE", "VUAA", "V60A", "V60A"]);
  });

  it("keeps a price older than 7 days and flags it as stale", () => {
    const old = row({ asOf: new Date("2026-10-20T00:00:00Z") });
    const { prices, stale } = mapPriceRows([old], NOW);
    assert.equal(prices.VWCE?.asOf, "2026-10-20");
    assert.deepEqual(stale, ["VWCE"]);
  });

  it("does not flag a price exactly 7 days old", () => {
    const { stale } = mapPriceRows([row({ asOf: new Date("2026-10-23T12:00:00Z") })], NOW);
    assert.deepEqual(stale, []);
  });
});
