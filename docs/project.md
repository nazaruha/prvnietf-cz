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

## Admin

`/admin` shows the leads table (newest first). Protected by HTTP Basic Auth in `middleware.ts` using `ADMIN_USER` / `ADMIN_PASSWORD`: `401` + `WWW-Authenticate: Basic` otherwise. `noindex`. Demo-level protection, and the README says so.

## Tracking (PostHog Cloud EU, cookieless)

Funnel events: `page_view` → `picker_q1` → `picker_q2` → `result_shown` → `form_viewed` → `form_started` → `form_submitted` → `pdf_downloaded`. Every event carries `ad_version`, `hero_variant` and all `utm_*`.

- `page_view` is PostHog's automatic `$pageview`; the other steps use `track()` from `src/lib/analytics.ts`.
- Attribution is added to every event automatically. Redirects (e.g. to `/dekujeme`) use `withAttribution()` from `src/lib/attribution.ts` to keep `v` and `utm_*`.
- Never send the email or other personal data to PostHog.

## Open items

- PDF guide content
- Privacy page `/soukromi`
