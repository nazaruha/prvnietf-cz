import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { REQUESTS_PER_REFRESH, REQUEST_SPACING_MS, refreshFunds, type RefreshDeps, type SnapshotRow } from "./refresh.ts";

const API_KEY = "test-key-not-real";
const NOW = new Date("2026-10-30T06:00:00Z");

const quoteBody = (symbol: string, price: string) =>
  JSON.stringify({ "Global Quote": { "01. symbol": symbol, "05. price": price, "07. latest trading day": "2026-10-29" } });
const profileBody = (ter: string) => JSON.stringify({ net_assets: "1", net_expense_ratio: ter, holdings: [] });
const RATE_LIMITED = JSON.stringify({ Note: "Our standard API call frequency is 5 calls per minute." });

type Responder = (params: URLSearchParams) => { status: number; body: string } | Error;

function fakeDeps(respond: Responder, saveFails: (row: SnapshotRow) => boolean = () => false) {
  const urls: string[] = [];
  const sleeps: number[] = [];
  const saved: SnapshotRow[] = [];
  const deps: RefreshDeps = {
    fetchText: async (url) => {
      urls.push(url);
      const reply = respond(new URL(url).searchParams);
      if (reply instanceof Error) throw reply;
      return reply;
    },
    sleep: async (ms) => {
      sleeps.push(ms);
    },
    save: async (row) => {
      if (saveFails(row)) throw new Error("connection refused");
      saved.push(row);
    },
    now: () => NOW,
  };
  return { deps, urls, sleeps, saved };
}

const allValid: Responder = (params) => {
  const symbol = params.get("symbol") ?? "";
  if (params.get("function") === "GLOBAL_QUOTE") return { status: 200, body: quoteBody(symbol, "100.5000") };
  return { status: 200, body: profileBody("0.0003") };
};

describe("refreshFunds", () => {
  it("makes the 9 requests from docs/project.md, spaced ≥ 15 s apart", async () => {
    const { deps, urls, sleeps } = fakeDeps(allValid);
    await refreshFunds(API_KEY, deps);

    assert.equal(urls.length, REQUESTS_PER_REFRESH);
    assert.equal(REQUESTS_PER_REFRESH, 9);
    const calls = urls.map((url) => {
      const params = new URL(url).searchParams;
      return `${params.get("function")} ${params.get("symbol")}`;
    });
    assert.deepEqual(calls, [
      "GLOBAL_QUOTE VWCE.DEX",
      "GLOBAL_QUOTE VUAA.DEX",
      "GLOBAL_QUOTE V60A.DEX",
      "GLOBAL_QUOTE VOO",
      "GLOBAL_QUOTE VT",
      "GLOBAL_QUOTE AOR",
      "ETF_PROFILE VOO",
      "ETF_PROFILE VT",
      "ETF_PROFILE AOR",
    ]);
    assert.deepEqual(sleeps, Array(8).fill(REQUEST_SPACING_MS));
    assert.ok(REQUEST_SPACING_MS >= 15_000);
  });

  it("saves valid values with a constant currency per ticker", async () => {
    const { deps, saved } = fakeDeps(allValid);
    const results = await refreshFunds(API_KEY, deps);

    assert.ok(results.every((result) => result.ok));
    assert.deepEqual(saved[0], { ticker: "VWCE", field: "price", value: 100.5, currency: "EUR", asOf: "2026-10-29" });
    assert.deepEqual(saved[3], { ticker: "VOO", field: "price", value: 100.5, currency: "USD", asOf: "2026-10-29" });
    // ETF_PROFILE has no date: TER is dated by the fetch day.
    assert.deepEqual(saved[6], { ticker: "VOO", field: "ter", value: 0.0003, currency: null, asOf: "2026-10-30" });
  });

  it("keeps going when a ticker fails, and saves nothing for it", async () => {
    const { deps, saved } = fakeDeps((params) => {
      const symbol = params.get("symbol");
      if (symbol === "VWCE.DEX") return { status: 200, body: RATE_LIMITED };
      if (symbol === "VUAA.DEX") return new Error("timeout");
      if (symbol === "V60A.DEX") return { status: 503, body: "" };
      if (symbol === "VOO" && params.get("function") === "GLOBAL_QUOTE") return { status: 200, body: "<html>" };
      if (symbol === "VT" && params.get("function") === "GLOBAL_QUOTE") return { status: 200, body: quoteBody("VT", "0") };
      if (symbol === "AOR" && params.get("function") === "ETF_PROFILE") return { status: 200, body: "{}" };
      return allValid(params);
    });
    const results = await refreshFunds(API_KEY, deps);

    assert.deepEqual(
      results.map((result) => (result.ok ? `${result.ticker} ${result.field} ok` : `${result.ticker} ${result.field} ${result.reason}`)),
      [
        "VWCE price rate-limited",
        "VUAA price fetch-failed",
        "V60A price http-error",
        "VOO price invalid-json",
        "VT price not-positive",
        "AOR price ok",
        "VOO ter ok",
        "VT ter ok",
        "AOR ter missing-data",
      ],
    );
    assert.deepEqual(
      saved.map((row) => `${row.ticker} ${row.field}`),
      ["AOR price", "VOO ter", "VT ter"],
    );
  });

  it("reports a failed save without stopping", async () => {
    const { deps, saved } = fakeDeps(allValid, (row) => row.ticker === "VWCE");
    const results = await refreshFunds(API_KEY, deps);

    assert.deepEqual(results[0], { ticker: "VWCE", field: "price", ok: false, reason: "db-error" });
    assert.equal(saved.length, 8);
  });

  it("never puts the API key into the results", async () => {
    const { deps } = fakeDeps(() => new Error(`request to ...apikey=${API_KEY} failed`));
    const results = await refreshFunds(API_KEY, deps);
    assert.ok(!JSON.stringify(results).includes(API_KEY));
  });
});
