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
- On any API error or rate limit, show the last cached value with its date. Never show an empty card or a made-up value.
- Normalise API responses on the server into small typed objects, e.g. `{ ticker, price: number, currency: "EUR" | "USD", asOf: "YYYY-MM-DD", source: "Alpha Vantage" }`. The client never sees raw API JSON or API keys.
- Number formatting (Czech): decimal comma, non-breaking space before `%`, `Kč` and `€`, thousands separated by a space. Keep it in one tested helper.
