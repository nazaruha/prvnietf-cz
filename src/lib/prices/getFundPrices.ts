import { cacheLife, cacheTag } from "next/cache";
import type { FundPrice, UcitsTicker } from "@/data/etfs";
import { getDb } from "@/lib/db";
import { STALE_AFTER_DAYS, UCITS_PRICE_TICKERS, mapPriceRows } from "./snapshotPrices";

// Server-side reader for the latest UCITS prices (docs/project.md "Market data cache").
// Visitors never trigger Alpha Vantage: this reads only what the daily cron stored.

/** Tag on the cached prices; /api/cron/refresh-funds revalidates it after saving new rows. */
export const FUND_PRICES_TAG = "fund-prices";

/**
 * Latest stored price per UCITS ticker. A missing ticker means "hide the price line".
 *
 * Cached with `"use cache"` so the prices are part of the page's static shell (no Suspense
 * needed, no database hit per visitor). A good read lives for `hours` and is refreshed early by
 * the cron's `revalidateTag`; a failed read is cached only for `minutes` so it recovers quickly.
 */
export async function getFundPrices(): Promise<Partial<Record<UcitsTicker, FundPrice>>> {
  "use cache";
  cacheTag(FUND_PRICES_TAG);

  if (!process.env.DATABASE_URL) {
    console.warn("Fund prices: DATABASE_URL is not set, price lines are hidden");
    cacheLife("minutes");
    return {};
  }

  let rows;
  try {
    rows = await getDb().fundSnapshot.findMany({
      where: { field: "price", ticker: { in: [...UCITS_PRICE_TICKERS] } },
      select: { ticker: true, value: true, currency: true, asOf: true },
    });
  } catch (error) {
    console.warn(`Fund prices: database read failed (${error instanceof Error ? error.name : "unknown error"})`);
    cacheLife("minutes");
    return {};
  }

  const { prices, stale, rejected } = mapPriceRows(
    rows.map((row) => ({ ...row, value: row.value.toString() })),
    new Date(),
  );
  if (stale.length > 0) {
    console.warn(`Fund prices older than ${STALE_AFTER_DAYS} days (shown with their date): ${stale.join(", ")}`);
  }
  if (rejected.length > 0) console.warn(`Fund prices: unusable rows left out: ${rejected.join(", ")}`);

  // Before the first cron run the table is empty: check again soon instead of caching nothing.
  if (Object.keys(prices).length > 0) cacheLife("hours");
  else cacheLife("minutes");
  return prices;
}
