# Status (handover between sessions)

Overwritten by `/end-session`. Last update: 30. 10. 2026, end of session 02 (design direction + review gaps).

## Production (prvnietf.cz, `master` = a6c623a)
- Next.js 16 starter on Vercel; `prvnietf.cz` → 308 → `www`. Resend `mail.prvnietf.cz` verified. PostHog EU cookieless via `/r9t`, verified (one test event `utm_source=claude_test`, filter it out).
- frontend-design plugin v1.1.1 enabled at project scope (942b387). Not yet seen in a session's skill list: check it loads at the start of the next session.

## Branch `docs/design-and-gaps` (7 commits 3c9db9a..4bbd464, not pushed)
- `docs/design.md` (design direction; read before any UI work) + `CLAUDE.md` pointers.
- `ads/` (4 PNGs + `ad-a.md`, `ad-b.md`), `docs/soukromi.md`, updated `docs/copy.md`, `public/` PDF guide + cover + og-image, README conversion + A/B section.

## Decisions (session 02)
- **Neutral base:** hero follows its ad (A dark, B light); below the hero light for both. Sample exact neutrals from the ads when building the hero.
- **Unsubscribe: implement.** `Lead.unsubscribedAt DateTime?` (cleared on re-submit); `/odhlasit?id=…&t=HMAC-SHA256(id, UNSUBSCRIBE_SECRET)`; unsubscribes only on a POST button, never on GET (mail scanners prefetch); `List-Unsubscribe` + `List-Unsubscribe-Post` headers.
- **Cron fits Hobby:** daily only, ±59 min ([docs](https://vercel.com/docs/cron-jobs/usage-and-pricing)); 300 s max with Fluid compute ([docs](https://vercel.com/docs/functions/limitations#max-duration)). 9 requests × 15 s ≈ 140 s → `export const maxDuration = 300`. Manual runs share 25/day (max one extra full run). Fallback: 2–3 daily cron entries.
- **Sender:** `pruvodce@mail.prvnietf.cz` (`noreply@` only in the test route, which gets deleted).

## Not done / known gaps
- Prisma not installed; `page.tsx` is the starter; `/admin`, funnel events after `$pageview` not built.
- `src/app/api/send/route.ts` is an unprotected test route; delete when `/api/lead` exists.
- Env: `RESEND_API_KEY` is Production only; no `DIRECT_URL` (use `DATABASE_URL_UNPOOLED`); `UNSUBSCRIBE_SECRET` to add.

## Next steps
1. Prisma: `Lead` (incl. `unsubscribedAt`) + `FundSnapshot`, first migration.
2. Hero, picker, result cards (`docs/copy.md`, `data/`, `docs/design.md`), with `track()`.
3. Form → `/api/lead` → email (`pruvodce@`, unsubscribe link + headers) → `/dekujeme`; `/odhlasit`; remove test route.
4. Alpha Vantage cron + fallback (`maxDuration = 300`; first verify Fluid compute is on, read only).
5. Timeline, explainer, social proof, footer, `/soukromi`.
6. `/admin` (cut first if short on time).
7. README (check claims match what's built, e.g. A/B heroes "already built"), `ai-log/`, submission email.

## Open questions for the user
- Czech copy for the `/odhlasit` confirmation page.
- `docs/soukromi.md`: contact e-mail, IČO (optional), retention period; CHECK lines (Neon region, Resend data location). Unsubscribe line → "odkazem v každém e-mailu".
- PDF guide content not reviewed by Claude (tax/crash figures).
- No consent banner (confirm with GDPR owner); PostHog web analytics domains; Vercel Hobby is non-commercial (D14).
