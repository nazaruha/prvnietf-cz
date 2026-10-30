# Status (handover between sessions)

Overwritten by `/end-session`. Last update: 30. 10. 2026, end of session 04 (picker, merge fix, finishing the page, desktop layout).

## Production (prvnietf.cz, `origin/master` = f6f7f97)
- The whole page is live: hero A/B, picker → result card, lead form → `/dekujeme`, social proof (mock, labelled), timeline + crash table, explainer, second CTA, disclaimer, sources, footer. Plus `/prvni-3-roky-s-etf`, `/odhlasit`, `/soukromi`, `/admin`.
- Lead flow: `/api/lead` (Prisma upsert + Resend email), signed unsubscribe (`/odhlasit` + `/api/odhlasit` one-click), init migration (incl. `utmTerm`).
- Prices: Vercel Cron `0 6 * * *` → `/api/cron/refresh-funds` → `FundSnapshot`; page reads via `getFundPrices()` (`"use cache"`, revalidated by the cron).
- `/admin`: Basic Auth in `src/proxy.ts`, Czech copy (docs/copy.md §13).
- Desktop layout: shared `page-container` utility in `globals.css` (76rem incl. padding); 390 px unchanged.
- The user reported prod "works good" after seeding prices and deploying the desktop layout. Not verified by Claude on prod: `/admin` with real leads, a real email/unsubscribe round trip, prices on the live card.

## Branches
- Everything is merged to `origin/master`. Open: `docs/session-handover` (this handover, not pushed).
- Local leftovers safe to delete: all merged `feat/*`, `fix/*`, `docs/readme`, `worktree-agent-*` branches.
- `D:\repos\clientelo-form` had a `next start -p 3107` running (not started by this session; left alone).

## Next steps
1. User: push `docs/session-handover`, save `/export` as `ai-log/04-...md`.
2. Check on prod: `/admin` table, one real form submit → email → PDF link → unsubscribe, price line + date on a result card.
3. Decide the open questions below; then the submission email (deadline 30. 10. 2026).

## Open questions for the user
- Result card scrolls itself into view after question 2 (phone: otherwise below the fold). Keep?
- Red marker beside crash drawdowns uses `chip-red` as decoration (design.md: chips only for funds). Keep or remove?
- Sources (§7, §8) are plain text: copy.md has no URLs. Add links?
- Still from session 03: `data/crashes.json` has no retrieval date; PDF guide content not reviewed by Claude; no consent banner (GDPR owner); Vercel Hobby is non-commercial (D14); `RESEND_API_KEY` Production only.
- DECISIONS.md D25–D27 proposed in NOTES-ai.md session 04, not yet added.

## Known broken / half-done
- Nothing known broken. `docs/project.md` "Open items" still lists `/soukromi` (done) and PDF content.
- `form_attempted` exists in `FunnelEvent` but nothing sends it; the README funnel doesn't list it.
