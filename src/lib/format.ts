// Czech number formatting (docs/copy.md): decimal comma, space as thousands separator,
// non-breaking space before % and units. All spaces are U+00A0 so values never wrap mid-number.

const NBSP = " ";

/** 3821 → "3 821", 0.5 with 1 decimal → "0,5", -24 → "−24" (typographic minus). */
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat("cs-CZ", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: true,
  })
    .format(value)
    .replace(/\s/g, NBSP)
    .replace("-", "−");
}

/** A fraction from data/ (0.0014) → "0,14 %". */
export function formatPercent(fraction: number, decimals = 0): string {
  return `${formatNumber(fraction * 100, decimals)}${NBSP}%`;
}

/** 123.4 + "EUR" → "123,40 EUR"; 100000 + "Kč" → "100 000 Kč". */
export function formatAmount(value: number, unit: "EUR" | "USD" | "Kč", decimals = 2): string {
  return `${formatNumber(value, decimals)}${NBSP}${unit}`;
}

const MONTHS = [
  "leden", "únor", "březen", "duben", "květen", "červen",
  "červenec", "srpen", "září", "říjen", "listopad", "prosinec",
];

/** "2023-12" → "prosinec 2023". */
export function formatMonth(isoMonth: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(isoMonth);
  const month = match ? MONTHS[Number(match[2]) - 1] : undefined;
  if (!match || !month) throw new Error(`Not an ISO month: ${isoMonth}`);
  return `${month}${NBSP}${match[1]}`;
}

/** "2026-09-30" → "30. 9. 2026". Parsed by hand, so the server's time zone can't shift the day. */
export function formatDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate);
  if (!match) throw new Error(`Not an ISO date: ${isoDate}`);
  const [, year, month, day] = match;
  return `${Number(day)}.${NBSP}${Number(month)}.${NBSP}${year}`;
}
