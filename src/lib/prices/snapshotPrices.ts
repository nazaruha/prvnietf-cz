// Maps FundSnapshot price rows to the `FundPrice` objects the page renders.
// Pure (no Prisma, no Next) so `node --test` can run it.

import type { FundPrice, UcitsTicker } from "../../data/etfs.ts";
import { QUOTE_SYMBOLS } from "./alphaVantage.ts";

export const UCITS_PRICE_TICKERS: ReadonlyArray<UcitsTicker> = ["VWCE", "VUAA", "V60A"];

/** docs/project.md: a price older than this is still shown with its date, plus a server warning. */
export const STALE_AFTER_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

/** A `FundSnapshot` row with the Decimal already turned into a string. */
export type PriceRow = {
  ticker: string;
  value: string;
  currency: string | null;
  asOf: Date;
};

function isUcitsTicker(ticker: string): ticker is UcitsTicker {
  return (UCITS_PRICE_TICKERS as ReadonlyArray<string>).includes(ticker);
}

export type MappedPrices = {
  prices: Partial<Record<UcitsTicker, FundPrice>>;
  /** Tickers whose price is older than STALE_AFTER_DAYS (still included in `prices`). */
  stale: UcitsTicker[];
  /** Tickers whose row was unusable and left out. */
  rejected: string[];
};

/**
 * Keeps only UCITS rows with a positive price and the currency we expect for that ticker.
 * A rejected row hides the price line instead of showing a wrong value.
 */
export function mapPriceRows(rows: ReadonlyArray<PriceRow>, now: Date): MappedPrices {
  const result: MappedPrices = { prices: {}, stale: [], rejected: [] };
  for (const row of rows) {
    if (!isUcitsTicker(row.ticker)) continue;
    const expectedCurrency = QUOTE_SYMBOLS.find((entry) => entry.ticker === row.ticker)?.currency;
    const price = Number(row.value);
    if (!Number.isFinite(price) || price <= 0 || row.currency !== expectedCurrency || expectedCurrency === undefined) {
      result.rejected.push(row.ticker);
      continue;
    }
    if (Number.isNaN(row.asOf.getTime())) {
      result.rejected.push(row.ticker);
      continue;
    }
    result.prices[row.ticker] = {
      ticker: row.ticker,
      price,
      currency: expectedCurrency,
      // Stored as UTC midnight of the trading day.
      asOf: row.asOf.toISOString().slice(0, 10),
      source: "Alpha Vantage",
    };
    if (now.getTime() - row.asOf.getTime() > STALE_AFTER_DAYS * DAY_MS) result.stale.push(row.ticker);
  }
  return result;
}
