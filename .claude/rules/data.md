---
paths:
  - "data/**"
  - "src/lib/**"
  - "src/app/api/**"
  - "src/app/**/*.tsx"
  - "src/components/**"
---

# Data rules

- Every number shown on the page comes from `data/*.json` or an API, never typed into a component. Each one is shown with its **source and date**.
- Never invent, estimate or "round to look nicer" a value. If a value is missing, stop and ask.
- **Live (Alpha Vantage, server-side, cached ~1×/day):**
  - `ETF_PROFILE` → TER for VOO, VT, AOR only.
  - `GLOBAL_QUOTE` → end-of-day prices for VWCE.DEX, VUAA.DEX, V60A.DEX (EUR) and VOO, VT, AOR (USD). Show as "Cena k [datum]".
- **Static (issuer factsheets, 30. 9. 2026):** everything else about the UCITS funds (TER, ISIN, fund size, accumulating/distributing, holdings, countries), plus VT countries and top holdings.
- **Caching and fallback (see `docs/project.md` → "Market data cache"):**
  - Visitor requests **never** call Alpha Vantage. Pages read the latest snapshot from the `FundSnapshot` table in Neon.
  - A daily Vercel Cron job calls `/api/cron/refresh-funds`. It fetches all tickers and saves each value **only if the response is valid**.
  - A response is invalid when the HTTP status isn't 200, when the JSON contains `Note`, `Information` or `Error Message` (Alpha Vantage answers rate limits with HTTP 200 and such a message), when the expected fields are missing or empty, or when a number fails to parse or isn't positive.
  - An invalid response never overwrites a good snapshot. The old value stays, with its own `asOf` date.
  - If no snapshot exists yet for a ticker, show the static factsheet values from `data/` and hide the price line instead of showing a placeholder.
- Never show an empty card or a made-up value.
- Normalise API responses on the server into small typed objects, e.g. `{ ticker, price: number, currency: "EUR" | "USD", asOf: "YYYY-MM-DD", source: "Alpha Vantage" }`. The client never sees raw API JSON or API keys.
- Number formatting (Czech): decimal comma, non-breaking space before `%`, `Kč` and `€`, thousands separated by a space. Keep it in one tested helper.
