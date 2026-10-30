// Czech number formatting (docs/copy.md): decimal comma, space as thousands separator,
// non-breaking space before % and units. All spaces are U+00A0 so values never wrap mid-number.

const NBSP = " ";

/** 3821 → "3 821", 0.5 with 1 decimal → "0,5". */
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat("cs-CZ", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: true,
  })
    .format(value)
    .replace(/\s/g, NBSP);
}

/** A fraction from data/ (0.0014) → "0,14 %". */
export function formatPercent(fraction: number, decimals = 0): string {
  return `${formatNumber(fraction * 100, decimals)}${NBSP}%`;
}

/** 123.4 + "EUR" → "123,40 EUR"; 100000 + "Kč" → "100 000 Kč". */
export function formatAmount(value: number, unit: "EUR" | "USD" | "Kč", decimals = 2): string {
  return `${formatNumber(value, decimals)}${NBSP}${unit}`;
}

/** "2026-09-30" → "30. 9. 2026". Parsed by hand, so the server's time zone can't shift the day. */
export function formatDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate);
  if (!match) throw new Error(`Not an ISO date: ${isoDate}`);
  const [, year, month, day] = match;
  return `${Number(day)}.${NBSP}${Number(month)}.${NBSP}${year}`;
}
