import type { FundPrice, PickerResult } from "@/data/etfs";

// Owner: picker agent. All text and numbers come from `result` (src/data/etfs.ts);
// numbers are formatted with src/lib/format.ts. Hide the price line when `price` is null.
// Tracks `result_shown` with track() from src/lib/analytics.ts.

export type ResultCardProps = {
  result: PickerResult;
  /** Price of the UCITS fund; null when there is no snapshot yet (or for "not-yet"). */
  price: FundPrice | null;
};

/** Placeholder: title only. */
export function ResultCard({ result, price }: ResultCardProps) {
  void price;

  return (
    <section aria-label={result.title} className="px-gutter py-6">
      <h2 className="text-xl font-bold">{result.title}</h2>
    </section>
  );
}
