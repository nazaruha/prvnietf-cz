# Status (handover between sessions)

Overwritten by `/end-session`. Last update: 30. 10. 2026, end of session 06 (analytics typing + lead flow backend). Sessions 04 (picker, finishing the page, desktop layout) and 05 (lead form) ran in parallel.

## Production (prvnietf.cz → 308 to www.prvnietf.cz, `origin/master` = af03b78)
- The whole page is live: hero A/B, picker → result card, lead form → `/dekujeme`, social proof (mock, labelled), timeline + crash table, explainer, second CTA, disclaimer, sources, footer. Plus `/prvni-3-roky-s-etf`, `/odhlasit`, `/soukromi`, `/admin`.
- Lead flow: `LeadForm/` (client validation, ref lock against double submit) → `/api/lead` (Prisma upsert + Resend email with `List-Unsubscribe` one-click) → `/dekujeme?etf=`. The email's "Stáhnout PDF" link opens `/prvni-3-roky-s-etf`. Signed unsubscribe (`/odhlasit` + `/api/odhlasit`), `t` stripped from URLs in PostHog `before_send`.
- Prices: Vercel Cron `0 6 * * *` → `/api/cron/refresh-funds` → `FundSnapshot`; page reads via `getFundPrices()` (`"use cache"`, revalidated by the cron).
- `/admin`: Basic Auth in `src/proxy.ts`, Czech copy (docs/copy.md §13). Desktop layout: shared `page-container` in `globals.css`; 390 px unchanged.
- Database: migration `20261030120000_init` (incl. `utmTerm`) applied to Neon (session 06: `migrate status` up to date, `migrate diff` no difference).
- Env: `DIRECT_URL` in `.env.local` (same value as the Neon integration's `DATABASE_URL_UNPOOLED`); `UNSUBSCRIBE_SECRET` in Vercel and `.env.local` (same value).
- Verified:
  - By the user on prod (session 06): real submit → email arrives → unsubscribe works → redirect to `/dekujeme` → PostHog events → row in Neon.
  - By Claude in dashboards (session 06, read only): Neon `fra1` Frankfurt; PostHog EU with "Discard client IP data" + cookieless on; Resend domain `mail.prvnietf.cz` in `eu-west-1` (DPA: processing mainly in the US under SCCs, as `/soukromi` says).
  - By Claude locally on `master` f6f7f97 (sessions 05 and 06): typecheck, lint, 96 tests, build. HTTP GET on prod (session 05): all pages 200, `/admin` 401, `/api/send` 404.
- **Not verified by Claude on prod:** the PDF link from the email, prices on a live card.

## Branches
- Everything is merged to `origin/master`. Open: `docs/session-06-handover` (this STATUS + NOTES session 06, not pushed).
- Local leftovers safe to delete: all merged `feat/*`, `fix/*`, `docs/*`, `worktree-agent-*`, and the worktrees `D:\repos\clientelo-form`, `clientelo-picker`, `clientelo-track`.

## Next steps
1. User: push `docs/session-06-handover`, save `/export` as `ai-log/06-analytics-and-lead-flow.md`.
2. Check on prod: PDF link from the email; price line + date on a result card; the cron ran at 06:00 UTC (`FundSnapshot` has rows), otherwise trigger it once with `CRON_SECRET`.
3. Decide the open questions below; add the approved D25–D30 to `DECISIONS.md`; then the submission email (deadline 30. 10. 2026).

## Open questions for the user
- Result card scrolls itself into view after question 2 (phone: otherwise below the fold). Keep?
- Red marker beside crash drawdowns uses `chip-red` as decoration (design.md: chips only for funds). Keep or remove?
- Sources (§7, §8) are plain text: copy.md has no URLs. Add links?
- Apex `prvnietf.cz` 308-redirects to `www.`: intended? Ads and the email should use the final host.
- `/soukromi` lists Vercel Inc. as processor but not its US data transfer. Add a line?
- DECISIONS.md D25–D27 (NOTES session 04), D28 (session 05), D29–D30 (session 06) proposed, not yet added.
- Still from session 03: `data/crashes.json` has no retrieval date; PDF guide content not reviewed by Claude; no consent banner (GDPR owner); Vercel Hobby is non-commercial (D14); `RESEND_API_KEY` Production only.

## Known broken / half-done
- Nothing known broken. `docs/project.md` "Open items" still lists `/soukromi` (done) and PDF content.
- `form_attempted` exists in `FunnelEvent` but nothing sends it (`LeadForm` should fire it on submit, before validation); the README funnel doesn't list it.
- Local only: after a route is deleted, stale `.next/dev/types` fail `tsc`; delete `.next/dev` and run `npx next typegen`.
