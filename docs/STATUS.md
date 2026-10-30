# Status (handover between sessions)

Overwritten by `/end-session`. Last update: 30. 10. 2026, end of session 05 (lead form, handover for the lead-flow agents). Session 04 (picker, finishing the page, desktop layout) ran in parallel.

## Production (prvnietf.cz → 308 to www.prvnietf.cz, `origin/master` = cf361ff)
- The whole page is live: hero A/B, picker → result card, lead form → `/dekujeme`, social proof (mock, labelled), timeline + crash table, explainer, second CTA, disclaimer, sources, footer. Plus `/prvni-3-roky-s-etf`, `/odhlasit`, `/soukromi`, `/admin`.
- Lead flow: `LeadForm/` (client validation, ref lock against double submit) → `/api/lead` (Prisma upsert + Resend email) → `/dekujeme?etf=`. The email's "Stáhnout PDF" link opens `/prvni-3-roky-s-etf`. Signed unsubscribe (`/odhlasit` + `/api/odhlasit` one-click), init migration (incl. `utmTerm`).
- Prices: Vercel Cron `0 6 * * *` → `/api/cron/refresh-funds` → `FundSnapshot`; page reads via `getFundPrices()` (`"use cache"`, revalidated by the cron).
- `/admin`: Basic Auth in `src/proxy.ts`, Czech copy (docs/copy.md §13). Desktop layout: shared `page-container` in `globals.css`; 390 px unchanged.
- Verified by Claude in session 05:
  - `master` f6f7f97 locally: typecheck, lint, 96 tests, build.
  - HTTP GET on prod: all pages 200, `/admin` 401, `/api/send` 404, home has the form.
- The user reported prod "works good". **Not verified by Claude on prod:** a real lead (row in `/admin` → email → PDF link → unsubscribe), prices on a live card.

## Branches
- Everything is merged to `origin/master`. Open: `docs/session-04-handover` (this STATUS + NOTES session 05, not pushed).
- Local leftovers safe to delete: all merged `feat/*` (incl. `feat/lead-api`, which a `git pull` fast-forwarded to master), `fix/*`, `docs/readme`, `docs/session-handover`, `worktree-agent-*`.
- The `next start -p 3107` in `D:\repos\clientelo-form` was session 05's test server; it is stopped.

## Next steps
1. User: push `docs/session-04-handover`, save `/export` as `ai-log/05-lead-form-handover.md`.
2. Check on prod: one real form submit → `/admin` row → email → PDF link → unsubscribe; price line + date on a result card.
3. Decide the open questions below; add the approved D25–D28 to `DECISIONS.md`; then the submission email (deadline 30. 10. 2026).

## Open questions for the user
- Result card scrolls itself into view after question 2 (phone: otherwise below the fold). Keep?
- Red marker beside crash drawdowns uses `chip-red` as decoration (design.md: chips only for funds). Keep or remove?
- Sources (§7, §8) are plain text: copy.md has no URLs. Add links?
- Apex `prvnietf.cz` 308-redirects to `www.`: intended? Ads and the email should use the final host.
- DECISIONS.md D25–D27 (NOTES session 04) and D28 (NOTES session 05) proposed, not yet added.
- Still from session 03: `data/crashes.json` has no retrieval date; PDF guide content not reviewed by Claude; no consent banner (GDPR owner); Vercel Hobby is non-commercial (D14); `RESEND_API_KEY` Production only.

## Known broken / half-done
- Nothing known broken. `docs/project.md` "Open items" still lists `/soukromi` (done) and PDF content.
- `form_attempted` exists in `FunnelEvent` but nothing sends it; the README funnel doesn't list it.
