# How AI was used — working notes

Running log for the README section "How I worked with AI". Updated at the end of every session by the `/end-session` skill.

## Session 00 – Planning in the Claude app (25.–29. 10. 2026)

- Chose task B, defined the audience and the "what happens after you buy" angle, approved section order and Czech copy.
- Researched and verified data:
  - Alpha Vantage TERs matched the issuer documents.
  - `net_assets` turned out to be the whole fund.
  - VT holdings were missing non-US companies and contained stale names.
  - UCITS profiles came back empty.
  - EODHD's free plan has no fund fundamentals.
- Caught AI mistakes:
  - A Czech grammar error in the PDF title ("Prvních 3 roky").
  - Two typos in drafted copy.
  - An outdated tax claim (the 40M Kč cap no longer applies from 2026).
  - Ghost bubbles left in the generated ad image.
  - The Q glyph that made "QQQ" unreadable in the chosen font.
- Ads: scenes from Nano Banana, all text added in code; feed 4:5 and story 9:16.
- Full transcript: `ai-log/00-planning-session.md`.

## Session 01 – Infrastructure and analytics (28.–30. 10. 2026)

- Built / set up:
  - Vercel deploy fixed: Framework Preset was "Other" (every page 404); set to Next.js.
  - Domain: Wedos DNS switched to Vercel (A + `www` CNAME, old AAAA removed); cert issued.
  - Neon added via Vercel Marketplace (Free, Frankfurt).
  - Resend: DKIM/SPF/DMARC records added at Wedos; `mail.prvnietf.cz` verified.
  - PostHog Cloud EU, cookieless, proxied via `/r9t`: f74f971 (feature), 8e4de8e (tests + `typecheck`/`test` scripts), 485b91e (README). Verified on prod: attribution on every event, no cookies, no IP.
  - Preview builds fixed: cbc7bc3 (Resend client created per request).
- AI mistakes and how they were caught:
  - The user brought a suggestion to use PostHog `persistence: "memory"`. Checked against PostHog's docs: every full page load would get a new ID, so the form → thank-you funnel breaks. Switched to `cookieless_mode: "always"`.
  - My own Resend example put `new Resend(key)` at module level; it was copied into `/api/send` and broke every branch preview (no key in Preview). Caught by the failed Vercel preview build, reproduced locally with an empty key.
  - Toggled PostHog "Discard client IP data" without reading its state first; it was already on, so I switched it off for about a minute. Caught by reloading the settings page; switched back on and re-verified. No events existed yet.
  - The `.ts` import in the test file failed `tsc` (TS5097). The edit hook didn't flag it (the session had started outside the repo, so its hooks weren't loaded); caught by running `npm run typecheck`.
  - Proposed one large commit with a long body mixing feature, tooling and docs. The user rejected it; split into three commits with summary lines only, staging just the `posthog-js` line of `package.json` for the feature commit.
  - Inserted D21 before D20 in `DECISIONS.md`; caught on self-review.
- Decisions: PostHog EU cookieless + first-party proxy (reasoning in README "Analytics"; a D21 draft was later removed by the user). The `phc_` token is public by design (write-only), so `NEXT_PUBLIC_` stays despite Vercel's warning.
- Full transcript: `ai-log/01-infrastructure-and-analytics.md`.

## Session 02 – Design direction and review gaps (30. 10. 2026)

- Built / set up (branch `docs/design-and-gaps`, docs only):
  - 3c9db9a `docs/design.md` (design direction from the user's brief + what the ads establish + chip contrast check) and two `CLAUDE.md` lines.
  - a11212a ads (4 PNGs + texts), 47c8044 copy update + `/soukromi` text, 8f48ecd PDF guide/cover/og-image, bd7e425 + 4bbd464 README conversion and A/B section, 48b3159 STATUS.
  - Verified: frontend-design plugin installed at project scope and enabled (skill `frontend-design`); it wasn't in this session's skill list because the session started before it was enabled.
  - Researched (current Vercel docs): Hobby cron once/day ±59 min, function max 300 s with Fluid compute → the 9-request refresh (~140 s) fits.
  - Computed WCAG contrast for the chip colours: white text 2.2–4.1:1, so only large text; dark text on `#e0a526`.
- AI mistakes and how they were caught:
  - The session-start git snapshot said branch `docs/ai-log-01`; running `git status` showed `master` with PR #5/#6 merged, and that the planned `chore: enable frontend-design plugin` commit already existed. Caught by the session routine's git check.
  - Tried to sample ad colours with Pillow without checking it was installed; it wasn't. Didn't install it (no new dependencies); deferred exact neutral hex values to the hero build.
  - Read the user's one-word "confirm" as yes to three separate questions (commit, unsubscribe, neutral base) and said so; not corrected.
  - The user's updated `copy.md` still marked sender and unsubscribe as open and said `/soukromi`/PDF text didn't exist; the pasted README section kept a "Paste into the README." note. Caught by reading the diffs before committing.
  - The suggested commit message `docs: record decisions on unsubscribe, cron and sender` was 54 chars (rule: under 50). Caught on review; shortened.
  - Tried to invoke `/end-session` via the Skill tool; it's user-only (disable-model-invocation).
- Decisions: neutral base (hero follows its ad, rest light); unsubscribe implemented with signed token + POST button + List-Unsubscribe headers; cron fits Hobby with `maxDuration = 300`; sender `pruvodce@`. Added to `DECISIONS.md` as D21 (unsubscribe) and D22 (hero tone); four new "Known pitfalls" lines in `CLAUDE.md`.
- Full transcript: `ai-log/02-design-and-gaps.md`.

## Session 03 – Skeleton and data contract for parallel agents (30. 10. 2026)

- Built (branch `chore/skeleton`, not pushed):
  - bbb921c skeleton: `src/data/etfs.ts` data contract (types, picker questions, `getResultId` + tests, results built from `data/*.json` with copy verbatim), `src/lib/format.ts` + tests, Prisma 7.10.1 + Neon adapter (schema, `prisma.config.ts`, lazy `getDb()`, `postinstall` generate), component folders with typed placeholder props (Hero, Picker, ResultCard, AfterPurchase, LeadForm, Analytics, Funnel), layout (Bricolage, `lang="cs"`, meta from copy.md), design tokens with neutrals sampled from the ad PNGs, "Parallel agents" section in `CLAUDE.md`.
  - cb98c50 VUAA top 10 holdings from the Vanguard factsheet (30. 9. 2026) into `data/ucits-funds.json`; card line built from data.
  - 20ab6d0 / a94c00c card footnote and disclaimer dated per issuer (Vanguard 30. 9., iShares 26. 10. 2026) from `asOf`.
  - a948ba2 `SKIPPED_PICKER`: the form is always open; heading "První 3 roky s ETF" when the picker was skipped.
  - bb97417 crash table numbers into `data/crashes.json` + `src/data/crashes.ts` (Czech labels, typographic minus, Czech months).
- Pushed back on the brief before coding (plan mode):
  - "Create CLAUDE.md" would have overwritten the existing one → added a section instead (user chose).
  - "4 fund results, each US + UCITS" → the spec has 3 pairs + `not-yet`.
  - Agents can't wait for per-commit approval in parallel → they commit freely on their own branch (user chose).
- AI mistakes and how they were caught:
  - Renamed props/added functions across files in the wrong order (caller before callee) four times; the PostToolUse hook reported tsc errors each time between edits. Harmless, but noisy.
  - Ran `python - 2>/dev/null || node -e …` to edit files; `python -` waited on stdin and hung for 120 s. Caught by the timeout; stopped with TaskStop and used Edit.
  - A regex in a Bash heredoc lost a backslash in Git Bash (node SyntaxError); rewrote the script with the Write tool.
  - First LeadForm placeholder showed the "zatím ne" heading for a visitor who hadn't answered yet (wrong copy for the case). Caught on self-review before the commit; raised as a missing-copy question.
  - Wrote "8.9:1" contrast for ink-muted from memory; computed 8.6:1 and fixed the comment.
  - npm `latest` for `prisma` is an 8.0 RC; caught by checking `npm view prisma dist-tags` before relying on it; pinned 7.10.1.
  - Found data/copy mismatch: footnote said "iShares k 30. 9. 2026" but AOR `asOf` is 2026-10-26. Caught by comparing copy.md with data; user chose to date per issuer.
  - `docs/STATUS.md` said `DIRECT_URL` was missing; the user says it exists in Vercel. Not verified by me.
  - WebFetch couldn't read the factsheet PDF and `Read` needs pdftoppm (not installed); extracted the text with a zero-dependency Node script instead of installing anything.
- Decisions: parallel-agent ownership and locked files (`CLAUDE.md`); Prisma 7.10.1 + `@prisma/adapter-neon` (no `ws`, Node 22+ has WebSocket; no `dotenv`, `loadEnvFile`); hero variant inside `Suspense` with a headline-less fallback; approved copy changes: "NVIDIA" spelling, per-issuer dates in footnote and disclaimer (disclaimer split into two sentences), skipped-picker form heading. Proposed D23/D24 for `DECISIONS.md` (see session end).
- Full transcript: `ai-log/03-skeleton-and-data-contract.md`.
