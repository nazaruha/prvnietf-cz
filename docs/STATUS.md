# Status (handover between sessions)

Overwritten by `/end-session`. Last update: 30. 10. 2026, end of session 03 (skeleton + data contract for parallel agents).

## Production (prvnietf.cz, `master` = 9fc8db9)
- Still the Next.js starter page. PostHog EU cookieless via `/r9t` and Resend `mail.prvnietf.cz` work (see session 01/02).

## Branch `chore/skeleton` (6 commits bbb921c..a94c00c + handover docs, not pushed)
- Verified locally: typecheck, lint, 30 tests, `npm run build`; `next start` renders hero A / B (`?v=b`) / A for unknown `v`, `lang="cs"`, Q1 under the hero. No 390 px screenshot yet (sections are placeholders).
- Data contract: `src/data/etfs.ts` (picker questions, `getResultId`, 3 fund pairs + `not-yet`, `SKIPPED_PICKER`, `RESULT_FOOTNOTE`, `DISCLAIMER`), `src/data/crashes.ts` ← `data/crashes.json`. VUAA top holdings added to `data/ucits-funds.json` (factsheet 30. 9. 2026).
- `src/lib/format.ts`: Czech numbers, %, amounts, dates, months, typographic minus.
- Prisma 7.10.1 (pinned; npm `latest` is an 8.0 RC) + `@prisma/adapter-neon`; `prisma/schema.prisma` (Lead incl. `unsubscribedAt`, FundSnapshot), `prisma.config.ts` (migrations on `DIRECT_URL`, `.env.local` via `loadEnvFile`), `src/lib/db.ts` (lazy `getDb()`), client generated to `src/generated/` on `postinstall` (gitignored). **No migration run yet.**
- Components (placeholders, typed props): Hero (+ HeroFallback), Picker (`onResult`), ResultCard, AfterPurchase, LeadForm (`context: FormContext`) + `submitLead.ts`, Analytics (+ `variant.ts`), Funnel (wiring, locked).
- Layout: Bricolage (latin-ext, opsz), metadata from copy.md. `globals.css` tokens; neutrals sampled from the ads: night `#10191b`, ink `#14181f`, mist `#dadedf`, paper white, ink-muted `#494c51`.
- `CLAUDE.md` has a "Parallel agents" section: locked files, no installs, agents commit on their own branch without approval, never push.

## Next steps
1. User: push `chore/skeleton`, merge, then start the agents from `master`.
2. Parallel agents (ownership): **picker** → `Picker/`, `ResultCard/`; **lead** → `LeadForm/`, `api/lead`, delete `api/send`, `dekujeme/`, `odhlasit/`, first Prisma migration; **analytics/A-B** → `Analytics/`, `Hero/`, `src/lib/analytics.ts`, `attribution*`.
3. Unassigned: AfterPurchase (use `src/data/crashes.ts`), social proof, explainer, second CTA + disclaimer (`DISCLAIMER`) + sources + footer, `/soukromi`.
4. Alpha Vantage cron → FundSnapshot → pass `prices` to `<Funnel>` in `page.tsx` (now `{}`; price lines hidden). `maxDuration = 300`.
5. `/admin`, README, `ai-log/`, submission email.

## Open questions for the user
- Czech copy for the `/odhlasit` confirmation page.
- `docs/soukromi.md`: contact e-mail, IČO, retention; CHECK lines (Neon region, Resend data location).
- `data/crashes.json` has no retrieval date (D10 doesn't record it).
- PDF guide content not reviewed by Claude; no consent banner (GDPR owner); Vercel Hobby is non-commercial (D14).
- Env: user says `DIRECT_URL` exists in Vercel (not verified by Claude). `RESEND_API_KEY` Production only; `UNSUBSCRIBE_SECRET` to add.
