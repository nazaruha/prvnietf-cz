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
