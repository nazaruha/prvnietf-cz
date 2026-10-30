# Product spec

## Audience

Czech retail investor (*drobný investor*), roughly 25–45, on a phone, coming from an Instagram/Facebook ad, gives the page a few seconds. Has heard of ETFs but doesn't know which to start with, and is unsure what happens after buying (drops, dividends, taxes, currency).

## Page structure (approved order)

1. **Hero** — headline repeats the ad's promise; label "2 otázky · 20 vteřin · bez registrace"; picker question 1 on the first screen. Variant A is the default (no param or `?v=a`); variant B only for `?v=b`.
2. **Picker question 2**
3. **Result card** (free, not gated)
4. **Form** — PDF cover image, 4 bullets, email, GDPR consent, button "Poslat mi průvodce", hidden honeypot
5. **Social proof strip** (mock, labelled)
6. **Timeline "Co se stane po nákupu"** with the crash table
7. **Explainer "Proč evropská verze"** (short)
8. **Second CTA, disclaimer, sources, footer**

One goal: no navigation menu, no links leading away except sources at the bottom.

## Picker

- Q1: *Jak dlouho chcete peníze nechat investované?* → `lt3` (méně než 3 roky) | `gte3` (3 roky a víc)
- Q2: *Investice za rok klesne o 30 %. Co uděláte?* → `sell` | `wait` | `buy`

| Q1 | Q2 | Result id | US fund → UCITS fund |
|---|---|---|---|
| lt3 | any | `not-yet` | — |
| gte3 | sell | `mix60` | AOR → V60A (*podobný typ fondu*) |
| gte3 | wait | `world` | VT → VWCE |
| gte3 | buy | `sp500` | VOO → VUAA |

The mapping is a pure function with unit tests. Every result, including `not-yet`, leads to the form.

## Lead flow

1. Client validates the email and consent → `POST /api/lead` with `{ email, consent, fund, adVersion, utm }` and the honeypot field.
2. Server:
   - validates again
   - honeypot filled → fake `200`, nothing stored
   - upserts the lead with Prisma; a duplicate email is not an error for the user
   - sends the Resend email
   - returns `{ ok: true }`
3. Client redirects to `/dekujeme?etf=<ticker>`, keeping `v` and `utm_*`.
4. Thank-you page: "Stáhnout PDF" button (new tab), fund + ISIN reminder. PDF lives in `/public`.

```prisma
model Lead {
  id          String   @id @default(cuid())
  email       String   @unique
  consent     Boolean
  consentText String
  fund        String?
  adVersion   String?
  utmSource   String?
  utmMedium   String?
  utmCampaign String?
  utmContent  String?
  createdAt   DateTime @default(now())
}
```

## Market data cache

Goal: fresh-enough data, no dependency on Alpha Vantage while a visitor is on the page, and well within the free limit (25 requests/day).

- **Refresh:** Vercel Cron, once a day (e.g. 06:00 UTC, after the US close), calls `GET /api/cron/refresh-funds`.
  - The route is protected: it requires the `CRON_SECRET` that Vercel sends in the `Authorization` header and returns `401` otherwise.
  - It makes 9 requests: `GLOBAL_QUOTE` for VWCE.DEX, VUAA.DEX, V60A.DEX, VOO, VT, AOR, and `ETF_PROFILE` for VOO, VT, AOR. Requests are spaced ≥ 15 s apart to respect the 5/minute limit; the route sets a long enough `maxDuration` or splits the work.
- **Validation:** see `.claude/rules/data.md`. Only valid values are written; one failed ticker doesn't block the others.
- **Storage:** one row per ticker and field, upserted.

```prisma
model FundSnapshot {
  ticker    String
  field     String   // "price" | "ter"
  value     Decimal
  currency  String?  // "EUR" | "USD" for prices
  asOf      DateTime // trading day / last_updated from the API
  fetchedAt DateTime @default(now())
  source    String   @default("Alpha Vantage")

  @@id([ticker, field])
}
```

- **Reading:** server components read `FundSnapshot`. A missing row → fall back to `data/*.json` and hide the price line.
- **Staleness:** the page always shows `asOf` ("Cena k 26. 10. 2026"). If a price is older than 7 days, show it with the date and log a warning; never hide that it's old.
- **Seeding:** run the refresh route once manually after deploy so the table isn't empty.

## Admin

`/admin` shows the leads table (newest first). Protected by HTTP Basic Auth in `proxy.ts` (Next 16 name for middleware; matcher limited to `/admin`, never `/r9t`) using `ADMIN_USERNAME` / `ADMIN_PASSWORD`: `401` + `WWW-Authenticate: Basic` otherwise. `noindex`. Demo-level protection, and the README says so.

## Tracking (PostHog Cloud EU, implemented)

Setup and reasoning are in the README section "Analytics". Funnel: `$pageview` → `picker_q1` → `picker_q2` → `result_shown` → `form_viewed` → `form_started` → `form_submitted` → `pdf_downloaded`. Every event carries `ad_version`, `hero_variant` and `utm_*` (added in `before_send`). Use `track()` and `withAttribution()`; never call `posthog.capture` directly in components.

## Open items

- PDF guide content
- Privacy page `/soukromi`
