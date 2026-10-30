// Pure parsers for the Alpha Vantage responses used by the daily refresh
// (docs/project.md "Market data cache", .claude/rules/data.md).
// Alpha Vantage sends every number as a string, answers rate limits with HTTP 200 and a
// `Note`/`Information` message, and never says which currency a price is in.

import type { UcitsTicker, UsTicker } from "../../data/etfs.ts";

export type FundTicker = UcitsTicker | UsTicker;
export type PriceCurrency = "EUR" | "USD";

/** One Alpha Vantage symbol per stored ticker. The currency is a constant, never read from the API. */
export const QUOTE_SYMBOLS: ReadonlyArray<{ ticker: FundTicker; symbol: string; currency: PriceCurrency }> = [
  { ticker: "VWCE", symbol: "VWCE.DEX", currency: "EUR" },
  { ticker: "VUAA", symbol: "VUAA.DEX", currency: "EUR" },
  { ticker: "V60A", symbol: "V60A.DEX", currency: "EUR" },
  { ticker: "VOO", symbol: "VOO", currency: "USD" },
  { ticker: "VT", symbol: "VT", currency: "USD" },
  { ticker: "AOR", symbol: "AOR", currency: "USD" },
];

/** TER comes from ETF_PROFILE for the US funds only; UCITS profiles come back as `{}`. */
export const PROFILE_SYMBOLS: ReadonlyArray<UsTicker> = ["VOO", "VT", "AOR"];

export type ParseFailure =
  | "rate-limited"
  | "api-error"
  | "not-an-object"
  | "missing-data"
  | "symbol-mismatch"
  | "bad-number"
  | "not-positive"
  | "out-of-range"
  | "bad-date";

export type ParseResult<T> = { ok: true; value: T } | { ok: false; reason: ParseFailure };

export type Quote = { price: number; asOf: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Rate-limit and error messages arrive with HTTP 200, so they are checked before anything else. */
function apiMessage(json: Record<string, unknown>): ParseFailure | null {
  if ("Note" in json || "Information" in json) return "rate-limited";
  if ("Error Message" in json) return "api-error";
  return null;
}

/** A plain decimal string such as "551.2300" or "0.0003". No signs, exponents or "None". */
export function parseDecimalString(value: unknown): number | null {
  if (typeof value !== "string" || !/^\d+(\.\d+)?$/.test(value.trim())) return null;
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? parsed : null;
}

/** "YYYY-MM-DD" that is also a real calendar date. */
export function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** GLOBAL_QUOTE → end-of-day price and trading day, or why the response is unusable. */
export function parseGlobalQuote(json: unknown, expectedSymbol: string): ParseResult<Quote> {
  if (!isRecord(json)) return { ok: false, reason: "not-an-object" };
  const message = apiMessage(json);
  if (message) return { ok: false, reason: message };

  const quote = json["Global Quote"];
  if (!isRecord(quote) || Object.keys(quote).length === 0) return { ok: false, reason: "missing-data" };

  const symbol = quote["01. symbol"];
  if (typeof symbol === "string" && symbol.toUpperCase() !== expectedSymbol.toUpperCase()) {
    return { ok: false, reason: "symbol-mismatch" };
  }

  const price = parseDecimalString(quote["05. price"]);
  if (price === null) return { ok: false, reason: "bad-number" };
  if (price <= 0) return { ok: false, reason: "not-positive" };

  const asOf = quote["07. latest trading day"];
  if (!isIsoDate(asOf)) return { ok: false, reason: "bad-date" };

  return { ok: true, value: { price, asOf } };
}

/**
 * ETF_PROFILE → TER as a fraction (0.0003 = 0,03 %).
 * `net_assets` (whole fund, not the ETF class) and the holdings are deliberately ignored.
 */
export function parseEtfProfileTer(json: unknown): ParseResult<number> {
  if (!isRecord(json)) return { ok: false, reason: "not-an-object" };
  const message = apiMessage(json);
  if (message) return { ok: false, reason: message };
  if (!("net_expense_ratio" in json)) return { ok: false, reason: "missing-data" };

  const ter = parseDecimalString(json.net_expense_ratio);
  if (ter === null) return { ok: false, reason: "bad-number" };
  if (ter <= 0) return { ok: false, reason: "not-positive" };
  // A fraction: anything ≥ 1 (100 %) means the format changed, e.g. to a percentage.
  if (ter >= 1) return { ok: false, reason: "out-of-range" };

  return { ok: true, value: ter };
}
