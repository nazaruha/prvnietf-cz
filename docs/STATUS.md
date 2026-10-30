# Status (handover between sessions)

Overwritten by `/end-session` at the end of every session. Last update: 30. 10. 2026, session 02 (design direction + review gaps).

## Works on production (prvnietf.cz, `master` = a6c623a)
- Next.js 16 starter on Vercel; `prvnietf.cz` → 308 → `www.prvnietf.cz`, Let's Encrypt cert (Wedos DNS: A `216.198.79.1`, `www` CNAME to Vercel).
- Resend: `mail.prvnietf.cz` verified (DKIM, SPF, DMARC `p=none`); sending works on prod.
- PostHog Cloud EU (project 326300): **verified on prod** — `$pageview` arrives via `/r9t` with `ad_version`, `hero_variant`, `utm_*`; no cookies/storage, no IP. Project settings: cookieless tracking ON, discard client IP ON. One test event has `utm_source=claude_test` (filter it out).
- Branch previews build again: `/api/send` creates the Resend client per request (cbc7bc3, PR #2).
- frontend-design plugin (v1.1.1, skill `frontend-design`) enabled at project scope (942b387, PR #6).

## Branch in progress
- `docs/design-and-gaps` (not pushed): `docs/design.md` + `CLAUDE.md` pointer (3c9db9a); this file. `ads/` (4 PNGs) still untracked.

## Design
- **Design direction: `docs/design.md`.** Read it before any UI work; it wins over the frontend-design plugin where they disagree.
- Neutral base decided: hero follows its ad (A dark, B light); everything below the hero is light for both variants. Exact neutral hex values still to be sampled from the ad backgrounds when building the hero.
- Chip colours fail AA for small white text (2.2–4.1:1): white only for large ticker text, dark text on `#e0a526`, small labels dark or outside the chip.

## Decisions this session
- **Unsubscribe: implement, don't remove the link** (consent copy promises "Odhlásit se můžu kdykoli" and "jedním kliknutím"; GDPR Art. 7(3)). Smallest version:
  - `unsubscribedAt DateTime?` on `Lead`; re-submitting the form clears it (new consent).
  - Link `/odhlasit?id=<leadId>&t=<HMAC-SHA256(leadId, UNSUBSCRIBE_SECRET)>`; the page unsubscribes only via a **POST button**, never on GET (mail scanners prefetch links).
  - `List-Unsubscribe` + `List-Unsubscribe-Post` headers on the Resend email (RFC 8058 one-click).
  - Needs: env var `UNSUBSCRIBE_SECRET`; Czech copy for the confirmation page (from the user).
- **Cron fits Vercel Hobby.** Hobby cron: once per day, fires within ±59 min ([docs](https://vercel.com/docs/cron-jobs/usage-and-pricing), updated 2026-07-15). Hobby max duration 300 s with Fluid compute ([docs](https://vercel.com/docs/functions/limitations#max-duration), updated 2026-08-24). 9 requests × 15 s spacing ≈ 140 s.
  - Set `export const maxDuration = 300` on the cron route; confirm Fluid compute is on (Vercel → Settings → Functions, read only).
  - Manual seed/debug runs share the 25/day budget: at most one extra full run per day.
  - Fallback if it ever doesn't fit: split into 2–3 daily cron entries at different hours.
- **Guide email sender: `pruvodce@mail.prvnietf.cz`.** `docs/copy.md` and `CLAUDE.md` already match; `noreply@` exists only in the test route, which gets deleted.

## Vercel env (names only)
- Production + Preview: `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` (Config, public `phc_` token).
- **Production only:** `RESEND_API_KEY` → email doesn't work on previews (by design for now).
- Neon integration created `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` — **there is no `DIRECT_URL`**; use `directUrl = env("DATABASE_URL_UNPOOLED")` or add `DIRECT_URL` yourself.
- To add: `UNSUBSCRIBE_SECRET`.

## Exists, but not done
- Prisma not installed, no schema.
- `src/app/api/send/route.ts` is a test route (hardcoded recipients, unprotected). Delete when `/api/lead` exists.
- `src/app/page.tsx` is the create-next-app starter; README is the template + Analytics section.
- Funnel events after `$pageview` aren't wired (components don't exist yet).
- `/admin` not built (`ADMIN_USERNAME` / `ADMIN_PASSWORD` are set).

## Next steps (in order)
1. Prisma + `Lead` (incl. `unsubscribedAt`) and `FundSnapshot` models, first migration.
2. Hero, picker, result cards (copy from `docs/copy.md`, data from `data/`, look from `docs/design.md`), with `track()`.
3. Form → `/api/lead` → Resend email (from `pruvodce@`, with unsubscribe link + headers) → `/dekujeme` via `withAttribution()`; `/odhlasit`; remove the test send route.
4. Alpha Vantage cron refresh + fallback (`maxDuration = 300`).
5. Timeline, explainer, social proof, footer, `/soukromi`.
6. `/admin` (cut first if short on time).
7. README, `ai-log/`, submission email.

## Assets delivered this session
- Ads: `ads/ad-a.md`, `ads/ad-b.md` + 4 PNGs (feed 4:5, story 9:16).
- `/soukromi` text: `docs/soukromi.md`. PDF guide: `public/prvni-3-roky-s-etf.pdf` (5 pages). PDF cover: `public/pdf-cover.png` (794 × 1123). og-image: `public/og-image.png` (1200 × 630).
- README: expected conversion (4–8 %, base ~5 %) and 3 ranked A/B hypotheses.
- `docs/copy.md`: hero B headline is now "Koupeno. A co dál?" (word for word from Ad B); AOR TER shows the fee waiver (matches `data/us-funds.json`).

## Open questions (missing from the user)
- Czech copy for the unsubscribe confirmation page (`/odhlasit`).
- `docs/soukromi.md` placeholders: contact e-mail, IČO (optional), retention period; CHECK lines (Neon region — session 01 notes say Frankfurt; Resend data location; PostHog IP setting). Unsubscribe line can now be "odkazem v každém e-mailu".
- README: the conversion section still has the line "Paste into the README." and calls the A/B heroes "already built"; the rest of the README is the create-next-app template.
- No consent banner: to be confirmed by whoever handles GDPR.
- Add `prvnietf.cz` + `www.prvnietf.cz` to PostHog "Web analytics domains"? (not done)
- Vercel Hobby is non-commercial (D14); a real campaign needs Pro.
