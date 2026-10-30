# prvnietf.cz

Mobile landing page for Czech retail investors who come from an Instagram/Facebook ad. Two questions point them to a European (UCITS) ETF that is similar to a well-known US fund, then the page explains **what happens after you buy** (drops, dividends, taxes) and offers a free PDF guide in exchange for an email.

Live: [prvnietf.cz](https://prvnietf.cz). Demo project for a job application (Clientelo, test task B). Not investment advice; the page never tells anyone what to buy.

## What the visitor sees

1. **Hero** that repeats the ad's headline: variant A by default, variant B with `?v=b`.
2. **Picker**: 2 questions (time horizon, reaction to a 30 % drop) → one of `world` (VT → VWCE), `sp500` (VOO → VUAA), `mix60` (AOR → V60A, a *similar type* of fund) or `not-yet` (under 3 years).
3. **Result card**, free and not gated: TER compared with the US fund, dividends, contents, ISIN, the latest price (when the daily snapshot exists) and the data dates.
4. **Lead form** → `/dekujeme` (thank-you page with the PDF button) and the guide email.
5. Social proof (mock data, labelled), timeline "Co se stane po nákupu" with real crash data, explainer "Proč evropská verze", second CTA, disclaimer, sources, footer.

Other pages: `/prvni-3-roky-s-etf` (guide page linked from the email), `/odhlasit` (unsubscribe), `/soukromi` (privacy), `/admin` (leads table).

## Stack

Next.js 16 (App Router, `cacheComponents`) · TypeScript · Tailwind CSS 4 · Vercel · Neon Postgres + Prisma 7 · Resend · PostHog Cloud EU (cookieless) · Alpha Vantage (server-side only).

## Run locally

```bash
npm ci                      # also generates the Prisma client (postinstall)
# create .env.local with the variables below
npx prisma migrate deploy   # creates the tables (uses DIRECT_URL)
npm run dev                 # http://localhost:3000
```

Without a database the page still renders: price lines are hidden and the form shows its server-error message.

## Environment variables

Set them in Vercel and in `.env.local`. Never commit them.

| Variable | Used for |
|---|---|
| `DATABASE_URL` | Neon **pooled** connection, used by the app at runtime |
| `DIRECT_URL` | Neon direct connection, used only by `prisma migrate` |
| `RESEND_API_KEY` | Sending the guide email from `pruvodce@mail.prvnietf.cz` |
| `UNSUBSCRIBE_SECRET` | Signs the `/odhlasit` links in the email (HMAC) |
| `ALPHAVANTAGE_API_KEY` | Daily price refresh (cron only, never on a visitor request) |
| `CRON_SECRET` | Protects `/api/cron/refresh-funds`; Vercel Cron sends it as `Authorization: Bearer …` |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | Basic Auth for `/admin`; without them `/admin` refuses everyone |
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` | PostHog (public by design); without it analytics is off |

## Lead flow

1. The form validates the email and consent, then `POST /api/lead` with the fund, ad version and UTM parameters. A hidden honeypot field catches bots: they get a fake success and nothing is stored.
2. The server validates again, upserts the lead by email (a repeat submit is not an error and counts as new consent), stores the consent text as shown on the page, and sends the guide email with Resend. If the email fails, the lead is still saved and the visitor still reaches `/dekujeme`.
3. The email address is never put in a URL and never sent to PostHog.
4. **Unsubscribe:** every email has a signed `/odhlasit` link and `List-Unsubscribe` / `List-Unsubscribe-Post` headers. Opening the link changes nothing; only the button (a POST) or the mail app's one-click POST to `/api/odhlasit` unsubscribes, because mail scanners open links automatically.

## Fund data and prices

- **Static facts** (TER, ISIN, holdings, countries, allocation) come from the issuers' factsheets in `data/*.json`, each with its source and date. Crash data is in `data/crashes.json`.
- **Prices:** Vercel Cron calls `GET /api/cron/refresh-funds` once a day at 06:00 UTC (`vercel.json`). It makes 9 Alpha Vantage requests spaced 15 s apart (free tier: 25/day, 5/minute), validates every value (rate-limit messages arrive as HTTP 200) and saves only valid ones to the `FundSnapshot` table. One failed ticker doesn't block the others, and a bad response never overwrites a good snapshot.
- The page reads the snapshot through a cached function (`src/lib/prices/getFundPrices.ts`), so visitors never trigger Alpha Vantage or wait for the database. The price line shows its trading date; with no snapshot it is hidden.
- **After the first deploy**, fill the table once:

  ```bash
  curl -H "Authorization: Bearer $CRON_SECRET" https://prvnietf.cz/api/cron/refresh-funds
  ```

  It takes 2–3 minutes; the JSON reports how many values were saved.

## Admin

`/admin` lists all leads, newest first. It's protected by HTTP Basic Auth in `src/proxy.ts` (Next 16's name for middleware; it runs only on `/admin`), compares credentials in constant time and is `noindex`.

**This is demo-level protection:** one shared username and password, no rate limiting, no audit log. It keeps the leads off the public internet for the review; a real product would need proper sign-in.

## Checks

```bash
npm run typecheck && npm run lint && npm test && npm run build
```

Tests use Node's built-in runner (`node --test`, files `src/**/*.test.ts`): picker mapping and flow, Czech number formatting, lead validation and parsing, email content, unsubscribe tokens, Alpha Vantage parsing, admin auth.

## Where things are documented

- `docs/project.md`: product spec · `docs/copy.md`: approved Czech copy (all page text comes from here) · `docs/design.md`: design direction
- `DECISIONS.md`: decisions and their reasons · `docs/STATUS.md`: current state · `NOTES-ai.md` and `ai-log/`: AI session history

## Analytics (PostHog Cloud EU)

- **Cookieless setup, IP discarded; no consent banner, to be confirmed by whoever handles GDPR.** That last part is a legal judgment, not a fact from PostHog's docs.
- `cookieless_mode: "always"`: PostHog stores nothing in cookies or local/session storage. It recognises a visitor by a hash of IP, browser and a salt that changes daily and is then deleted, so the same visitor keeps one ID across pages for a day and funnels work. Trade-offs: unique visitors beyond one day are inflated, there is no country map (no GeoIP) and no session replay.
- `person_profiles: "never"`: nobody is identified, and the email from the form is never sent to PostHog.
- Every event carries `ad_version`, `hero_variant` and `utm_*` (added in `before_send`). A full page load forgets everything, so redirects keep `v` and `utm_*` in the URL via `withAttribution()` from `src/lib/attribution.ts`.
- Funnel: `$pageview` → `picker_q1` → `picker_q2` → `result_shown` → `form_viewed` → `form_started` → `form_submitted` → `pdf_downloaded`, sent with `track()` from `src/lib/analytics.ts`.
- Events go through our own domain at `/r9t` (rewrites in `next.config.ts`), so ad blockers don't drop them. If a `middleware.ts`/`proxy.ts` is added, its matcher must not catch `/r9t`.

**Setup:** set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` in Vercel and `.env.local` (without it, analytics is off). In the PostHog project settings, turn on **Enable cookieless tracking** (otherwise PostHog drops the events) and **Discard client IP data**.

# Expected conversion and A/B hypotheses

Replace the assumed funnel numbers with real PostHog numbers once traffic exists.

## Expected conversion

**Landing visitor → lead (email submitted): 4–8 %, base case about 5 %.**

| Benchmark                                                 | Median | Source                                                                                                                               |
| --------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Finance & insurance landing pages                         | 8.3 %  | [Unbounce Conversion Benchmark Report, finance](https://unbounce.com/conversion-benchmark-report/finance-insurance-conversion-rate/) |
| … investing subcategory                                   | 3.9 %  | same                                                                                                                                 |
| … paid social traffic (Facebook 10.1 %, Instagram 15.5 %) | 9.3 %  | same                                                                                                                                 |
| … mobile                                                  | 11.5 % | same                                                                                                                                 |

The report doesn't state its data year in the text; the image files are labelled 2024.

**Why the range sits here:**

- **Pulls down:**
  - Investing is the weakest finance subcategory (3.9 %).
  - The traffic is cold, from a scrolling feed.
  - The result is shown free _before_ the form (required by the brief), so some visitors leave satisfied without converting.
- **Pulls up:**
  - Paid social and mobile convert above the finance median.
  - One field plus consent.
  - The hero repeats the ad's promise word for word, so there's no "wrong page" bounce.
  - The form is offered at peak interest, right after the personal result.
  - The offer answers the visitor's next question ("what happens after I buy?").

**Assumed funnel per 100 visitors** (to be replaced with real data after ~1 000 visits):

| Step             | Visitors |
| ---------------- | -------- |
| `$pageview`      | 100      |
| `picker_q1`      | 60       |
| `picker_q2`      | 52       |
| `result_shown`   | 52       |
| `form_viewed`    | 38       |
| `form_started`   | 9        |
| `form_submitted` | 5        |

**Biggest uncertainty:** the first tap (60 %). If far fewer people start the picker, hypothesis 2 below moves up.

## A/B test hypotheses, ranked by expected impact

1. **Result behind the email vs free result (now: free).**
   - _Hypothesis:_ showing questions 1–2 and then asking for the email to reveal the fund increases submissions, because the visitor has already invested effort.
   - _Expected impact:_ the largest of the three, +30–60 % on `form_submitted / page_view`, but likely lower lead quality and more fake emails.
   - _Metric:_ `form_submitted / page_view`; secondary: share of leads who open the email / download the PDF.
   - _Note:_ the brief asks for value before the form, so the free version is the default; this test measures what that choice costs.
2. **Ad angle with matching hero: A "Které ETF si koupit jako první?" vs B "Koupeno. A co dál?" (already built, `?v=a` / `?v=b`).**
   - _Hypothesis:_ A reaches more people (everyone undecided); B speaks to a stronger fear and may bring fewer but more motivated visitors.
   - _Expected impact:_ cost per lead between the two ads could differ by 20–40 %.
   - _Metric:_ cost per `form_submitted` by `ad_version` (Meta spend ÷ PostHog leads).
3. **Lead magnet framing: generic "První 3 roky s ETF" vs personal "Váš plán na první 3 roky s [VWCE]".**
   - _Hypothesis:_ naming the visitor's own fund in the offer makes it feel made for them.
   - _Expected impact:_ +10–25 % on `form_submitted / form_viewed`. Smaller, because it only affects people who already reached the form.
   - _Metric:_ `form_submitted / form_viewed`.

Smaller ideas for later: CTA wording, consent text length, real social proof once numbers exist.
