import { getDb } from "@/lib/db";
import type { SnapshotRow } from "./refresh";

// Writes one validated value. Only refresh.ts decides what is valid; this never sees raw API JSON.

/** Upserts `FundSnapshot` by `(ticker, field)`. `asOf` is stored as UTC midnight of that day. */
export async function saveSnapshot(row: SnapshotRow): Promise<void> {
  const data = {
    value: row.value,
    currency: row.currency,
    asOf: new Date(`${row.asOf}T00:00:00Z`),
    fetchedAt: new Date(),
    source: "Alpha Vantage",
  };
  await getDb().fundSnapshot.upsert({
    where: { ticker_field: { ticker: row.ticker, field: row.field } },
    create: { ticker: row.ticker, field: row.field, ...data },
    update: data,
  });
}
