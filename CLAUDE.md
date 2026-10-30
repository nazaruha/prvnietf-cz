# prvnietf.cz — Clientelo test task B

@AGENTS.md

## Parallel agents (read first if you run in a worktree)

Target user: a Czech retail investor, 25–45, on a phone, coming from an ad. They have heard of ETFs but don't know which to start with or what happens after buying (drops, dividends, taxes, currency).

- **Edit only the folder(s) assigned to you** in your task prompt.
- **Never edit (locked):** `CLAUDE.md`, `data/`, `src/data/` (data contract), `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css` (design tokens), `src/components/Funnel/` (wiring), `src/lib/format.ts`, `src/lib/db.ts`, `prisma/schema.prisma`, `prisma.config.ts`, `next.config.ts`, `eslint.config.mjs`, `package.json`, `package-lock.json`. If you need a change there, **stop and tell the user** what you need and why.
- **Don't install packages.**
- All user-facing text is Czech, verbatim from `docs/copy.md` (or `src/data/etfs.ts`). Missing text → ask, never write it.
- Numbers come from `src/data/etfs.ts` / `data/` and are formatted with `src/lib/format.ts`. Styling uses the tokens in `globals.css` (`bg-night`, `text-ink`, `bg-cta`, `bg-chip-*`, `px-gutter`, …).
- **This overrides the session routine and `.claude/rules/commits.md` for you:** work on your own feature branch, make small Conventional Commits without waiting for approval, never squash. Still **never push** and never open PRs.
- Before you finish: `npm run typecheck && npm run lint && npm test && npm run build` must pass. Fix your own errors; if the failure is in a file you don't own, report it instead.

**Current state, open work and next steps: @docs/STATUS.md** (read it first; it is how sessions hand over to each other).

Mobile lead-magnet landing page for Czech retail investors comparing NYSE ETFs with the European (UCITS) funds they can actually buy. Angle: **"what happens after you buy"**. Reviewer's test: *could we launch ads on it tomorrow?* Deadline **30. 10. 2026**.

## Where things are

- Product spec (audience, page structure, picker, lead flow, admin): @docs/project.md
- Approved Czech copy (use it verbatim, never invent copy): `docs/copy.md`
- Design direction: `docs/design.md`. Read it before any UI work.
- Decisions and their reasons: `DECISIONS.md`
- Fund facts with sources and dates: `data/us-funds.json`, `data/ucits-funds.json`
- Session history: `NOTES-ai.md` (one entry per session, append-only; read the latest entry at the start) and the full transcripts in `ai-log/`.
- Topic rules load automatically from `.claude/rules/` (commits, data, copy, database/API).

## Stack

Next.js **16** (App Router) + TypeScript + Tailwind CSS 4 · Vercel (live on **prvnietf.cz**) · Neon Postgres + Prisma · Resend (domain `mail.prvnietf.cz` verified; guide email from `pruvodce@mail.prvnietf.cz`) · PostHog Cloud EU (cookieless, proxied via `/r9t`, see README "Analytics") · Alpha Vantage (server-side only) · font Bricolage Grotesque via `next/font`.

Secrets live only in Vercel / `.env.local`: `DATABASE_URL` (pooled), `DIRECT_URL`, `RESEND_API_KEY`, `ALPHAVANTAGE_API_KEY`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `CRON_SECRET`, `UNSUBSCRIBE_SECRET` (signs `/odhlasit` links), `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` (public by design). Never print, log or commit them.

## Session routine

1. **Start:** read this file, `docs/STATUS.md` and the latest entry in `NOTES-ai.md`. Run `git status` and `git log --oneline -10` to see the real state (the code wins over the notes if they disagree; say so). Restate the task in 1–2 sentences, propose a short plan (max ~15 lines), and **wait for my OK** before writing code.
2. **Work** on a new branch from `master`, in small steps. After each logical step, show me the changed files and a proposed commit message, and **commit only after my approval**. Never push and never create PRs; I do that myself (see `.claude/rules/commits.md`).
3. **End:** run the `/end-session` skill. It rewrites `docs/STATUS.md` for the next session, appends to `NOTES-ai.md`, proposes new pitfalls, and reminds me to run `/export` into `ai-log/NN-topic.md`.

## Next.js 16 in this repo (your training data is older)

- `AGENTS.md` applies: check `node_modules/next/dist/docs/` before using an API you're not sure about.
- Request interception lives in **`proxy.ts`**, not `middleware.ts` (renamed in Next 16). Its matcher must **not** catch `/r9t` (PostHog proxy).
- `cacheComponents` is enabled in `next.config.ts`. Caching and dynamic data follow its rules (`"use cache"`, `Suspense` around dynamic parts); read the docs in `node_modules/next/dist/docs/` before building data fetching.
- Tests use Node's built-in runner: `node --test` on `src/**/*.test.ts` with `node:test` and `node:assert`. No Vitest or Jest.

## Definition of done (every task)

- `npm run typecheck`, `npm run lint` and `npm test` pass (use the `/checks` skill).
- Works at **390 px** width; headline and picker question 1 visible without scrolling.
- Every text matches `docs/copy.md`; every number comes from `data/` or an API, with source and date shown.
- No new dependency added without asking me first.
- Proposed as a Conventional Commit on its own feature branch, committed after my approval.

## Rules for working with me

- **Be critical.** If my request is a bad idea, say so and explain why before doing it.
- For all UI work, use the frontend-design plugin skills together with `docs/design.md`. `docs/design.md` wins where they disagree.
- **Ask instead of guessing.** If something is unclear or missing, ask. Never fill gaps with invented data, copy, tickers, numbers or APIs.
- **Read before you write.** Before changing a file, read it and the files that import it. Don't rely on memory of earlier sessions.
- **No shortcuts:** no `any`, no `@ts-ignore`, no disabled lint rules, no skipped tests, no hardcoded values that belong in `data/` or env variables.
- **Repeated actions → hooks or skills.** When you notice we do the same thing more than twice, propose a hook or a skill. Explain in 2–3 sentences what it does and why it helps, and **create it only after I approve**.
- **Repeated corrections → skills.** When you hallucinate, skip reading relevant code, or take a bad shortcut and I correct you, propose a skill (in `.claude/skills/<name>/SKILL.md`) or a new "Known pitfalls" line that prevents it next time. Also only after I approve.

## Known pitfalls (do not repeat these)

- Alpha Vantage returns **all numbers as strings** (`"0.0003"`, `"0.4135%"`) → parse them.
- Alpha Vantage prices come **without a currency** → currency is a constant per ticker (`.DEX` = EUR, US tickers = USD).
- Alpha Vantage `net_assets` is the **whole fund**, not the ETF share class → don't show it as ETF size.
- Alpha Vantage VT holdings are incomplete and partly stale, VT sectors cover only ~60 %, AOR holdings are empty, and `ETF_PROFILE` for UCITS tickers returns `{}` → use the factsheet data in `data/`.
- Alpha Vantage free tier is **25 requests/day, 5/minute**, and a rate-limited request returns **HTTP 200 with a `Note`/`Information` message** instead of data → never call it on visitor requests; a daily cron saves only validated values to `FundSnapshot`, and the page falls back to the last good snapshot (with its date) or to `data/`.
- Neon: the app uses the **pooled** `DATABASE_URL`; `prisma migrate` uses `DIRECT_URL`.
- AOR → V60A is a **similar type of fund**, never call it a twin.
- Never write *doporučujeme* or tell the visitor what to buy.
- Social proof is mock data: keep `isMock: true` and the visible label.
- Bricolage Grotesque's capital **Q** has a detached tail → avoid Q in large display text.
- Tax: the 40M Kč cap no longer applies to securities from 2026; the 100 000 Kč limit counts **sale proceeds**, not profit.
- PDF: open in a new tab with a button; **no automatic download**.
- Analytics is cookieless: nothing survives a full page load, so every redirect/link to another page uses `withAttribution()` from `src/lib/attribution.ts`; funnel events go through `track()` from `src/lib/analytics.ts`; `form_submitted` fires only after `/api/lead` returns `ok`.
- The email to PostHog: never. `person_profiles: "never"`, no `identify()`.
- Values a server route or page needs (copy, constants) must not live in a `"use client"` module: imported on the server they are a client reference, not the value. Put them in a plain module (e.g. `LeadForm/consent.ts`).
- Create SDK clients that need secrets (Resend, Alpha Vantage, …) **inside the handler**, never at module level: a variable missing in Preview fails the whole build.
- In third-party dashboards (Vercel, PostHog, Wedos, Resend), **read a setting's current state before toggling it**, and confirm it after a reload.
- Unsubscribe and any other state-changing email link: act only on **POST**, never on GET, because mail scanners open links automatically.
- Vercel Hobby: cron runs **once a day** at most and up to 59 min late; functions stop at **300 s** (with Fluid compute). Long jobs set `maxDuration`.
- Chip colours with white text are under 4.5:1: white only for large text, dark text on `#e0a526`.
- The session-start git snapshot can be stale. Trust `git status`, not the reminder.
- Commits: **summary line only**, one concern per commit. If `package.json` mixes concerns, stage only the relevant lines.
- A change across files (rename a prop, add a function): edit the **definition before its callers**, or the edit hook reports type errors in between.
- Never run `python -` in Bash: it waits on stdin and hangs. Use Edit/Write, or `node` with a script file.
- Scripts with regexes or backslashes: write them with the Write tool, not a Bash heredoc (Git Bash mangles backslashes).
- Check `npm view <pkg> dist-tags` before installing: `latest` can be a release candidate (Prisma 8.0). Pin an exact stable version.
- `docs/STATUS.md` can be wrong about env vars (it said `DIRECT_URL` was missing): check Vercel's env settings before relying on it.
