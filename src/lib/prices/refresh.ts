// Daily refresh from Alpha Vantage into FundSnapshot (docs/project.md "Market data cache").
// Pure orchestration: fetching, waiting and saving are injected, so tests run on fixtures and
// never touch the network, the clock or the database. The API key stays inside this module:
// it is never logged, returned or put into an error message.

import {
  PROFILE_SYMBOLS,
  QUOTE_SYMBOLS,
  parseEtfProfileTer,
  parseGlobalQuote,
  type FundTicker,
  type ParseFailure,
  type PriceCurrency,
} from "./alphaVantage.ts";

const API_URL = "https://www.alphavantage.co/query";

/** Free tier: 5 requests per minute. 15 s between requests keeps us at 4. */
export const REQUEST_SPACING_MS = 15_000;
/** 9 requests × 10 s + 8 × 15 s spacing stays well under the route's 300 s. */
export const REQUEST_TIMEOUT_MS = 10_000;

export type SnapshotField = "price" | "ter";

/** One validated value, ready for `FundSnapshot` (`@@id([ticker, field])`). */
export type SnapshotRow = {
  ticker: FundTicker;
  field: SnapshotField;
  value: number;
  currency: PriceCurrency | null;
  /** Trading day for prices; the fetch day for TER (ETF_PROFILE has no date). */
  asOf: string;
};

export type RefreshFailure = ParseFailure | "fetch-failed" | "http-error" | "invalid-json" | "db-error";

export type RefreshResult =
  | { ticker: FundTicker; field: SnapshotField; ok: true; asOf: string }
  | { ticker: FundTicker; field: SnapshotField; ok: false; reason: RefreshFailure };

export type RefreshDeps = {
  /** GET a URL, resolve with its HTTP status and body text. Rejects on network errors/timeouts. */
  fetchText: (url: string) => Promise<{ status: number; body: string }>;
  sleep: (ms: number) => Promise<void>;
  save: (row: SnapshotRow) => Promise<void>;
  now: () => Date;
};

type Job = {
  ticker: FundTicker;
  field: SnapshotField;
  params: Record<string, string>;
  toRow: (json: unknown, today: string) => { ok: true; row: SnapshotRow } | { ok: false; reason: ParseFailure };
};

function jobs(): Job[] {
  const quotes: Job[] = QUOTE_SYMBOLS.map(({ ticker, symbol, currency }) => ({
    ticker,
    field: "price",
    params: { function: "GLOBAL_QUOTE", symbol },
    toRow: (json) => {
      const parsed = parseGlobalQuote(json, symbol);
      if (!parsed.ok) return parsed;
      return { ok: true, row: { ticker, field: "price", value: parsed.value.price, currency, asOf: parsed.value.asOf } };
    },
  }));
  const profiles: Job[] = PROFILE_SYMBOLS.map((ticker) => ({
    ticker,
    field: "ter",
    params: { function: "ETF_PROFILE", symbol: ticker },
    toRow: (json, today) => {
      const parsed = parseEtfProfileTer(json);
      if (!parsed.ok) return parsed;
      return { ok: true, row: { ticker, field: "ter", value: parsed.value, currency: null, asOf: today } };
    },
  }));
  return [...quotes, ...profiles];
}

/** Number of Alpha Vantage requests one refresh makes (GLOBAL_QUOTE ×6, ETF_PROFILE ×3). */
export const REQUESTS_PER_REFRESH = QUOTE_SYMBOLS.length + PROFILE_SYMBOLS.length;

async function runJob(job: Job, apiKey: string, deps: RefreshDeps): Promise<RefreshResult> {
  const { ticker, field } = job;
  const url = `${API_URL}?${new URLSearchParams({ ...job.params, apikey: apiKey })}`;

  let response: { status: number; body: string };
  try {
    response = await deps.fetchText(url);
  } catch {
    return { ticker, field, ok: false, reason: "fetch-failed" };
  }
  if (response.status !== 200) return { ticker, field, ok: false, reason: "http-error" };

  let json: unknown;
  try {
    json = JSON.parse(response.body);
  } catch {
    return { ticker, field, ok: false, reason: "invalid-json" };
  }

  const today = deps.now().toISOString().slice(0, 10);
  const parsed = job.toRow(json, today);
  if (!parsed.ok) return { ticker, field, ok: false, reason: parsed.reason };

  try {
    await deps.save(parsed.row);
  } catch {
    return { ticker, field, ok: false, reason: "db-error" };
  }
  return { ticker, field, ok: true, asOf: parsed.row.asOf };
}

/**
 * Fetch every ticker one after another, spaced ≥ 15 s apart, and save only valid values.
 * A failed ticker is reported and skipped; it never blocks the others or overwrites a good row.
 */
export async function refreshFunds(apiKey: string, deps: RefreshDeps): Promise<RefreshResult[]> {
  const results: RefreshResult[] = [];
  const all = jobs();
  for (const [index, job] of all.entries()) {
    if (index > 0) await deps.sleep(REQUEST_SPACING_MS);
    results.push(await runJob(job, apiKey, deps));
  }
  return results;
}
