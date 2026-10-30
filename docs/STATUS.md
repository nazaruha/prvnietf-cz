# Status (handover between sessions)

Overwritten by `/end-session` at the end of every session. Last update: 30. 10. 2026, end of session 01 (infrastructure + analytics).

## Works on production (prvnietf.cz, `master` = 5dc83bd)
- Next.js 16 starter on Vercel; `prvnietf.cz` → 308 → `www.prvnietf.cz`, Let's Encrypt cert (Wedos DNS: A `216.198.79.1`, `www` CNAME to Vercel).
- Resend: `mail.prvnietf.cz` verified (DKIM, SPF, DMARC `p=none`); sending works on prod.
- PostHog Cloud EU (project 326300): **verified on prod** — `$pageview` arrives via `/r9t` with `ad_version`, `hero_variant`, `utm_*`; no cookies/storage, no IP. Project settings: cookieless tracking ON, discard client IP ON. One test event has `utm_source=claude_test` (filter it out).
- Branch previews build again: `/api/send` creates the Resend client per request (cbc7bc3, PR #2).

## Branch in progress
- `docs/project-bootstrap` (pushed up to 29272e6). **Uncommitted:** `CLAUDE.md`, `.claude/rules/data.md`, `.claude/rules/db-and-api.md`, `.claude/skills/end-session/SKILL.md`, `DECISIONS.md` (D21 removed; reasoning now in README "Analytics"), `docs/project.md`, new `docs/STATUS.md`, `NOTES-ai.md` (session 01 entry).

## Vercel env (names only)
- Production + Preview: `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` (Config, public `phc_` token).
- **Production only:** `RESEND_API_KEY` → email doesn't work on previews (by design for now).
- Neon integration created `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` — **there is no `DIRECT_URL`**; use `directUrl = env("DATABASE_URL_UNPOOLED")` or add `DIRECT_URL` yourself.

## Exists, but not done
- Prisma not installed, no schema.
- `src/app/api/send/route.ts` is a test route (hardcoded recipients, unprotected). Delete when `/api/lead` exists.
- `src/app/page.tsx` is the create-next-app starter; README is the template + Analytics section.
- Funnel events after `$pageview` aren't wired (components don't exist yet).
- `/admin` not built (`ADMIN_USERNAME` / `ADMIN_PASSWORD` are set).

## Next steps (in order)
1. Prisma + `Lead` and `FundSnapshot` models, first migration.
2. Hero, picker, result cards (copy from `docs/copy.md`, data from `data/`), with `track()`.
3. Form → `/api/lead` → Resend email → `/dekujeme` via `withAttribution()`; remove the test send route.
4. Alpha Vantage cron refresh + fallback.
5. Timeline, explainer, social proof, footer, `/soukromi`.
6. `/admin` (cut first if short on time).
7. README, `ai-log/`, submission email.

## Open questions
- PDF guide content (placeholder OK until written).
- Guide email sender: docs say `pruvodce@`, test route uses `noreply@`.
- No consent banner: to be confirmed by whoever handles GDPR.
- Add `prvnietf.cz` + `www.prvnietf.cz` to PostHog "Web analytics domains"? (not done)
- Vercel Hobby is non-commercial (D14); a real campaign needs Pro.
