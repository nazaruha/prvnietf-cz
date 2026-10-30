This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Analytics (PostHog Cloud EU)

- **Cookieless setup, IP discarded; no consent banner, to be confirmed by whoever handles GDPR.** That last part is a legal judgment, not a fact from PostHog's docs.
- `cookieless_mode: "always"`: PostHog stores nothing in cookies or local/session storage. It recognises a visitor by a hash of IP, browser and a salt that changes daily and is then deleted, so the same visitor keeps one ID across pages for a day and funnels work. Trade-offs: unique visitors beyond one day are inflated, there is no country map (no GeoIP) and no session replay.
- `person_profiles: "never"`: nobody is identified, and the email from the form is never sent to PostHog.
- Every event carries `ad_version`, `hero_variant` and `utm_*` (added in `before_send`). A full page load forgets everything, so redirects keep `v` and `utm_*` in the URL via `withAttribution()` from `src/lib/attribution.ts`.
- Funnel: `$pageview` → `picker_q1` → `picker_q2` → `result_shown` → `form_viewed` → `form_started` → `form_submitted` → `pdf_downloaded`, sent with `track()` from `src/lib/analytics.ts`.
- Events go through our own domain at `/r9t` (rewrites in `next.config.ts`), so ad blockers don't drop them. If a `middleware.ts`/`proxy.ts` is added, its matcher must not catch `/r9t`.

**Setup:** set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` in Vercel and `.env.local` (without it, analytics is off). In the PostHog project settings, turn on **Enable cookieless tracking** (otherwise PostHog drops the events) and **Discard client IP data**.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

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
