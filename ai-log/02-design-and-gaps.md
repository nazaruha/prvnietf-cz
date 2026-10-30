> <ide_opened_file>The user opened the file
> d:\repos\prvnietf-cz\.claude\settings.json in the IDE. This may or may not be
> related to the current task.</ide_opened_file>

> <browser_instruction># Claude in Chrome browser automation

You have access to browser automation tools (mcp**claude-in-chrome**\*) for
interacting with web pages in Chrome. Follow these guidelines for effective
browser automation.

## Loading deferred tools

If the mcp**claude-in-chrome**\* tools are deferred (must be loaded via
ToolSearch before use), load every tool you expect to need in ONE ToolSearch
call — the select query accepts a comma-separated list — never one call per
tool. Start with the core set:

ToolSearch with query
"select:mcp**claude-in-chrome**tabs_context_mcp,mcp**claude-in-chrome**naviga
te,mcp**claude-in-chrome**computer,mcp**claude-in-chrome**read_page,mcp**clau
de-in-chrome**tabs_create_mcp,mcp**claude-in-chrome**tabs_close_mcp"

Add task-specific tools to the same call when the task obviously needs them:
read_console_messages / read_network_requests for debugging, form_input for
forms, gif_creator for recordings, javascript_tool for page scripting.

## GIF recording

When performing multi-step browser interactions that the user may want to
review or share, use mcp**claude-in-chrome**gif_creator to record them.

You must ALWAYS:

- Capture extra frames before and after taking actions to ensure smooth
  playback
- Name the file meaningfully to help the user identify it later (e.g.,
  "login_process.gif")

## Console log debugging

You can use mcp**claude-in-chrome**read_console_messages to read console
output. Console output may be verbose. If you are looking for specific log
entries, use the 'pattern' parameter with a regex-compatible pattern. This
filters results efficiently and avoids overwhelming output. For example, use
pattern: "[MyApp]" to filter for application-specific logs rather than
reading all console output.

## Alerts and dialogs

IMPORTANT: Do not trigger JavaScript alerts, confirms, prompts, or browser
modal dialogs through your actions. These browser dialogs block all further
browser events and will prevent the extension from receiving any subsequent
commands. Instead, when possible, use console.log for debugging and then use
the mcp**claude-in-chrome**read_console_messages tool to read those log
messages. If a page has dialog-triggering elements:

1. Avoid clicking buttons or links that may trigger alerts (e.g., "Delete"
   buttons with confirmation dialogs)
2. If you must interact with such elements, warn the user first that this may
   interrupt the session
3. Use mcp**claude-in-chrome**javascript_tool to check for and dismiss any
   existing dialogs before proceeding

If you accidentally trigger a dialog and lose responsiveness, inform the user
they need to manually dismiss it in the browser.

## Avoid rabbit holes and loops

When using browser automation tools, stay focused on the specific task. If
you encounter any of the following, stop and ask the user for guidance:

- Unexpected complexity or tangential browser exploration
- Browser tool calls failing or returning errors after 2-3 attempts
- No response from the browser extension
- Page elements not responding to clicks or input
- Pages not loading or timing out
- Unable to complete the browser task despite multiple approaches

Explain what you attempted, what went wrong, and ask how the user would like
to proceed. Do not keep retrying the same failing browser action or explore
unrelated pages without checking in first.

## Tab context and session startup

IMPORTANT: At the start of each browser automation session, call
mcp**claude-in-chrome**tabs_context_mcp first to get information about the
user's current browser tabs. Use this context to understand what the user
might want to work with before creating new tabs.

Never reuse tab IDs from a previous/other session. Follow these guidelines:

1. Only reuse an existing tab if the user explicitly asks to work with it
2. Otherwise, create a new tab with mcp**claude-in-chrome**tabs_create_mcp
3. If a tool returns an error indicating the tab doesn't exist or is invalid,
   call tabs_context_mcp to get fresh tab IDs
4. When a tab is closed by the user or a navigation error occurs, call
   tabs_context_mcp to see what tabs are available</browser_instruction>

> This is a setup session. No feature code. Follow the session routine in
> CLAUDE.md (read it, docs/STATUS.md and the latest NOTES-ai.md entry, check
> git, propose a plan, wait for my OK).

Create branch docs/design-and-gaps from an up-to-date master. The tasks below
only change docs and config.

1. Verify the frontend-design plugin
   - Confirm it's installed and enabled at project scope
     (.claude/settings.json → enabledPlugins), and list the skills it provides.
   - If it isn't there, stop and tell me.
2. Create docs/design.md: the design direction for every UI task. Use exactly
   this content, structured and concise. Do not invent extra brand rules:
   - Goal: must NOT look like a default AI/template page. The reviewer
     explicitly checks this.
   - Continuity with the ads: the page continues the look of the ads in ads/.
     If they aren't in the repo yet, say so and leave a TODO. Look at the images
     before any UI work.
   - Font: Bricolage Grotesque only (via next/font), heavy weights for
     headlines. Avoid a capital Q in large display text.
   - Colour: - CTA green #1db474 with dark text #06281a. - ETF chip colours #2f7de1 #e0573f #e0a526 #1f9e8f #3aa65c #d14d8b
     #6a7bd8, used for fund/ticker chips only, not as decoration everywhere. - Neutral base chosen deliberately. Ad A is dark, ad B is light; propose
     which base fits the hero and explain why.
   - Mobile-first at 390 px: headline + label + picker question 1 visible
     without scrolling. Picker answers are large tap targets (min 48 px high).
   - One goal per page: no nav menu, one primary CTA style, the green CTA
     appears only for the main action.
   - Numbers: tabular figures; every number with source + date in small muted
     text.
   - Accessibility: WCAG AA contrast, visible focus states,
     prefers-reduced-motion respected.
   - Avoid: purple/blue gradients, emoji as icons, everything centred,
     identical rounded cards with shadows everywhere, stock illustrations.
   - Process: before building a section, describe the visual approach in 3–5
     lines and wait for my OK. After building it, take a screenshot at 390 px and
     1280 px and check it against this file.
3. Update CLAUDE.md (keep it short):
   - Under "Where things are": "Design direction: docs/design.md. Read it
     before any UI work."
   - Under "Rules for working with me": "For all UI work, use the
     frontend-design plugin skills together with docs/design.md. docs/design.md
     wins where they disagree."
4. Close the gaps found in review. Research and propose; don't implement
   features:
   a) Unsubscribe: docs/copy.md has an "Odhlásit" link in the email, but
   nothing implements it. Propose the smallest correct solution (e.g.
   unsubscribedAt on Lead + /api/unsubscribe?token=… with a signed token) or
   removing the link. Recommend one; I decide.
   b) Cron on Vercel Hobby: check the CURRENT official Vercel docs for Hobby
   cron frequency and max function duration. The planned refresh is 9 Alpha
   Vantage requests with ≥15 s spacing (>2 min). Tell me if it fits; if not,
   propose an alternative that stays within 25 requests/day and 5/minute. Cite
   the doc pages.
   c) Guide email sender: the test route uses noreply@mail.prvnietf.cz, the
   docs say pruvodce@mail.prvnietf.cz. Ask me which one, then update
   docs/copy.md and CLAUDE.md to match.
5. Update docs/STATUS.md:
   - Add the design direction file.
   - Record the decisions from step 4.
   - Under "Open questions", list what's still missing from me: PDF guide
     text, /soukromi text, PDF cover image, og-image, the 4 ad images + ad text
     files in ads/, expected conversion rate and the 3 ranked A/B hypotheses for
     the README.
6. Commits
   - Show me the changed files and proposed Conventional Commit messages
     (e.g. docs: add design direction, docs: record decisions on unsubscribe, cron
     and sender, chore: enable frontend-design plugin). Commit only after I
     approve. Never push.
7. End with /end-session.

● I'll start with the session routine: notes, git state, and a quick read-only
look at the plugin config and ads/.

Ran 2 shell commands (ctrl+o to expand)

● Start-of-session check done. A few things in the repo don't match the notes,
and the code wins:

- Git: you're on an up-to-date master at a6c623a, not docs/ai-log-01. PR #5
  (ai-log) and PR #6 are both merged.
- Step 6 commit chore: enable frontend-design plugin already exists (942b387,
  merged in #6). I won't make it again.
- docs/STATUS.md is out of date. It still lists docs/project-bootstrap changes
  as uncommitted, but they were merged in #4. I'll fix that in step 5.
- ads/ is empty. The folder exists but has no files, so git doesn't track it.
  docs/design.md will get a TODO for the ads.
- Plugin check (read-only, step 1 is basically done):
  frontend-design@claude-plugins-official v1.1.1 is installed with scope
  project and enabled in .claude/settings.json. It provides one skill,
  frontend-design (skills/frontend-design/SKILL.md). But it doesn't show up in
  my skill list for this session, probably because the session started before
  it was enabled. It should load in a fresh session. I'll confirm that at the
  next UI session.

What we're doing: a session that only changes docs. It sets the UI design
direction and settles three gaps from the review (unsubscribe, cron limits on
Hobby, email sender). No feature code.

Plan (branch docs/design-and-gaps from master):

1. Read the plugin's SKILL.md and list what it covers.
2. Write docs/design.md from your bullet list only. For the neutral base, I'll
   recommend one in a single line and mark it as needing confirmation once
   the ads exist.
3. Add your two lines to CLAUDE.md.
4. a) Write up the unsubscribe options and recommend one. b) Read the current
   Vercel docs on cron and function duration for Hobby, then report whether
   the refresh fits, with links to the pages. c) Ask you which sender to use.
5. Update STATUS.md with the decisions and open questions, and correct the
   stale parts.
6. Propose commits:
   - docs: add design direction (design.md + CLAUDE.md)
   - docs: record decisions on unsubscribe, cron and sender (copy.md /
     CLAUDE.md / STATUS.md / DECISIONS.md if you want them there)
7. Run /end-session.

Question you can answer now (4c): which sender should the guide email use?

- pruvodce@mail.prvnietf.cz, which the docs already use. This is my
  recommendation: a reply-able, named sender reads more like a real guide and
  less like a system message.
- noreply@mail.prvnietf.cz, which only the test route uses, and that route is
  getting deleted anyway.

OK to start with this plan?

> - I have just added the ads into the ads/ directory. There are 2 types: for
>   story and feed.

- I approve your plan and your mail recommendation

Ran 1 shell command (ctrl+o to expand)

● The ad variants are done, in feed and story sizes. The sender already uses
pruvodce@ in the docs and config, so nothing needs changing there, and I'm
checking the ads next.

Read 4 files (ctrl+o to expand)

● The ads differ in a few visible ways: A is a dark night scene with white type,
while B is a bright room with near-black type and red-orange accents. Both
share the green pill CTA and Bricolage font, and I'll sample the actual
colours rather than guess the hex values.

Ran 1 shell command (ctrl+o to expand)

● Pillow isn't installed, and I won't add a dependency just for this. The design
doc will say to sample the exact neutral values when the hero is built. Next,
the current Vercel docs for 4b:

● Fetch(https://vercel.com/docs/cron-jobs/usage-and-pricing)
⎿  Received 5.1KB (200 OK)

● Fetch(https://vercel.com/docs/functions/limitations)
⎿  Received 18.3KB (200 OK)

● The Vercel limits are clear. I'll also check that maxDuration still works as a
route segment config when cacheComponents is on in Next 16:

Searched for 1 pattern (ctrl+o to expand)

● maxDuration is still supported in route handlers. Before I write anything,
I'll read the email section of docs/copy.md and the format of DECISIONS.md:

Ran 1 shell command (ctrl+o to expand)

● DECISIONS.md D12 talks about "matching heroes", which bears directly on the
neutral-base question. I'll read D12 and D13:

Ran 1 shell command (ctrl+o to expand)

● I have what I need for the design doc. One check first: the ad chips put white
text on each chip colour, and WCAG AA needs 4.5:1 for small text. I'll
compute the real ratios rather than assume them:

Ran 1 shell command (ctrl+o to expand)

● No chip colour reaches 4.5:1 against white text, and yellow fails even the 3:1
large-text threshold. I'm recording this in docs/design.md as a consequence
of the AA rule rather than a new brand rule.

● Write(docs\design.md)
⎿  Wrote 65 lines to docs\design.md
1 # Design direction
2
3 Read this before any UI work. Use it together with the frontend-d
esign plugin skill; where they disagree, this file wins.
4
5 ## Goal
6
7 The page must **not** look like a default AI/template page. The r
eviewer explicitly checks this.
8
… +57 lines (ctrl+o to expand)

● The design doc is written. Next, the two lines in CLAUDE.md:

● Update(CLAUDE.md)
⎿  Added 1 line
10  
 11 - Product spec (audience, page structure, picker, lead flow, ad
min): @docs/project.md
12 - Approved Czech copy (use it verbatim, never invent copy): `do
          cs/copy.md`
13 +- Design direction: `docs/design.md`. Read it before any UI wor
+k.  
 14 - Decisions and their reasons: `DECISIONS.md`
15 - Fund facts with sources and dates: `data/us-funds.json`, `dat
          a/ucits-funds.json`
16 - Session history: `NOTES-ai.md` (one entry per session, append
-only; read the latest entry at the start) and the full transcr
ipts in `ai-log/`.

● Update(CLAUDE.md)
⎿  Added 1 line
46 ## Rules for working with me
47  
 48 - **Be critical.** If my request is a bad idea, say so and expl
ain why before doing it.
49 +- For all UI work, use the frontend-design plugin skills togeth
+er with `docs/design.md`. `docs/design.md` wins where they disa
+gree.  
 50 - **Ask instead of guessing.** If something is unclear or missi
ng, ask. Never fill gaps with invented data, copy, tickers, num
bers or APIs.
51 - **Read before you write.** Before changing a file, read it an
d the files that import it. Don't rely on memory of earlier ses
sions.
52 - **No shortcuts:** no `any`, no `@ts-ignore`, no disabled lint
rules, no skipped tests, no hardcoded values that belong in `d
          ata/` or env variables.

● Steps 1–3 are done. Here are the 4a/4b findings and the first commit for
approval.

4b. Cron on Vercel Hobby: it fits

- Cron: Hobby allows only one run per day, and it fires up to 59 minutes late.
  So 0 6 \* \* \* runs sometime between 06:00 and 06:59 UTC, which is still
  after the US close. Source: Usage & Pricing for Cron Jobs
  (https://vercel.com/docs/cron-jobs/usage-and-pricing) (updated 2026-07-15).
- Duration: Hobby functions get 300 s (default and maximum) with Fluid
  compute. Source: Vercel Functions Limits → Max duration
  (https://vercel.com/docs/functions/limitations#max-duration) (updated
  2026-08-24).
- Our run: 9 requests with 8 gaps of 15 s is 120 s, plus response times, so
  about 140 s. That's well under 300 s. Alpha Vantage sees at most 4 requests
  per minute, and 9 of the 25 daily requests are used.
- Conditions:
  - Set export const maxDuration = 300 on the route. It's still a valid
    segment config in Next 16 (bundled docs
    route-segment-config/maxDuration.md).
  - Confirm Fluid compute is on in Vercel (Settings → Functions; just read
    it). It's the default for new projects.
  - Manual seed or debug runs use the same 25/day. One extra full run (18/day)
    is fine; two extra runs (27) would hit the limit.
- Fallback if it ever doesn't fit: split the job into 2–3 cron entries at
  different hours. Each is still daily, and the project can have up to 100
  cron jobs.

4a. Unsubscribe: I recommend implementing it, not removing the link

Removing the link isn't actually the smaller option. The approved consent text
promises "Odhlásit se můžu kdykoli" plus future tipy, and the line under the
button promises "jedním kliknutím". GDPR Art. 7(3) also says withdrawing
consent must be as easy as giving it. Dropping the link would mean rewriting
approved copy and still providing some other way to opt out.

Smallest correct version:

- unsubscribedAt DateTime? on Lead.
- Link /odhlasit?id=<leadId>&t=<HMAC(leadId, UNSUBSCRIBE_SECRET)>. The page
  has one button that POSTs. A GET alone must not unsubscribe, because mail
  scanners like Outlook Safe Links open every link in an email automatically.
- List-Unsubscribe + List-Unsubscribe-Post headers on the Resend email, so
  Gmail and Apple Mail show their own one-click unsubscribe (RFC 8058).
- If an unsubscribed email submits the form again, that counts as new consent,
  so unsubscribedAt is cleared.
- What I need from you: a new env var UNSUBSCRIBE_SECRET, and Czech copy for
  the confirmation page (button + "done" text). That copy isn't in
  docs/copy.md, and I won't write it myself.

4c. Sender

pruvodce@mail.prvnietf.cz, as you approved. docs/copy.md and CLAUDE.md already
say that, so they don't change. Only the test route uses noreply@, and it
gets deleted with /api/lead.

Commit 1, ready for approval

┌────────────────┬─────────────────────────────────────────────────────────┐
│ File │ Change │
├────────────────┼─────────────────────────────────────────────────────────┤
│ docs/design.md │ new: design direction, what the ads establish, chip │
│ │ contrast limits, neutral-base proposal │
├────────────────┼─────────────────────────────────────────────────────────┤
│ CLAUDE.md │ design.md pointer + rule to use the frontend-design │
│ │ plugin │
└────────────────┴─────────────────────────────────────────────────────────┘

Message: docs: add design direction

Two notes on the design doc:

- Neutral base proposal: each hero matches its ad (A dark, B light), and the
  rest of the page is light for both variants. The reason is in the file. It's
  marked "awaiting OK".
- Chip contrast: white text on the chips is 2.2–4.1:1, so it's fine for big
  tickers but not for small labels, and never on the yellow chip.

Please confirm:

1. Commit 1 as proposed?
2. Unsubscribe: implement as above, or remove the link?
3. Neutral base: OK as proposed?

Then I'll update STATUS.md and propose commit 2.

> <browser_instruction>[Browser disconnected: The browser connection has been
> closed. Browser tools are no longer available.]</browser_instruction>

> confirm

● I'm taking "confirm" as yes to all three: commit 1, implement unsubscribe, and
the neutral base. The base is approved, so I'll drop "awaiting OK" from the
doc before committing.
● Update(docs\design.md)
⎿  Added 1 line, removed 1 line
26 - **CTA:** green `#1db474` with dark text `#06281a` (contrast 5
.9:1).
27 - **ETF chips:** `#2f7de1 #e0573f #e0a526 #1f9e8f #3aa65c #d14d
          8b #6a7bd8`. Fund/ticker chips only, never as decoration.
28 - Contrast (from the AA rule below): white text on these is 2
.2–4.1:1, so it passes only as **large text** (≥ 24 px, or ≥ 18
.7 px bold) and never on `#e0a526`. Use dark text on `#e0a526`.
Small labels such as "S&P 500" go in dark text or outside the
chip.
29 -- **Neutral base (proposal, awaiting OK):** the hero follows it
-s ad, so A is dark and B is light. Everything below the hero us
-es one light base for both variants.  
 29 +- **Neutral base:** the hero follows its ad, so A is dark and B + is light. Everything below the hero uses one light base for bo
+th variants.  
 30 - Why: D12 pairs each ad with a hero that repeats its promise
. Matching the ad's light/dark tone is the cheapest way to make
the click feel continuous, and A is the default traffic. The r
est (picker result, crash table, form, sources) is reading and
form-filling, where dark text on a light background is easier o
n a phone in daylight.
31 - Exact neutral hex values: sample them from the ad backgroun
ds when building the hero. Don't pick generic defaults.
32

Ran 1 shell command (ctrl+o to expand)

● Commit 3c9db9a is done with a summary-only message. The ads folder is still
untracked, so I'm suggesting a separate commit for its roughly 9 MB of PNGs,
then I'll update STATUS.md.

Read 1 file (ctrl+o to expand)

● Write(docs\STATUS.md)
⎿  Added 34 lines, removed 10 lines
1 # Status (handover between sessions)
2  
 3 -Overwritten by `/end-session` at the end of every session. Last - update: 30. 10. 2026, end of session 01 (infrastructure + anal
-ytics).  
 3 +Overwritten by `/end-session` at the end of every session. Last + update: 30. 10. 2026, session 02 (design direction + review ga
+ps).  
 4  
 5 -## Works on production (prvnietf.cz, `master` = 5dc83bd)  
 5 +## Works on production (prvnietf.cz, `master` = a6c623a)  
 6 - Next.js 16 starter on Vercel; `prvnietf.cz` → 308 → `www.prvn
          ietf.cz`, Let's Encrypt cert (Wedos DNS: A `216.198.79.1`, `www
          ` CNAME to Vercel).
7 - Resend: `mail.prvnietf.cz` verified (DKIM, SPF, DMARC `p=none
          `); sending works on prod.
8 - PostHog Cloud EU (project 326300): **verified on prod** — `$p
          ageview` arrives via `/r9t` with `ad_version`, `hero_variant`,
`utm_*`; no cookies/storage, no IP. Project settings: cookieles
s tracking ON, discard client IP ON. One test event has `utm_so
          urce=claude_test` (filter it out).
9 - Branch previews build again: `/api/send` creates the Resend c
lient per request (cbc7bc3, PR #2).
10 +- frontend-design plugin (v1.1.1, skill `frontend-design`) enab
+led at project scope (942b387, PR #6).  
 11  
 12 ## Branch in progress
12 -- `docs/project-bootstrap` (pushed up to 29272e6). **Uncommitte
-d:** `CLAUDE.md`, `.claude/rules/data.md`, `.claude/rules/db-an
         -d-api.md`, `.claude/skills/end-session/SKILL.md`, `DECISIONS.md
         -` (D21 removed; reasoning now in README "Analytics"), `docs/pro
         -ject.md`, new `docs/STATUS.md`, `NOTES-ai.md` (session 01 entry
-).  
 13 +- `docs/design-and-gaps` (not pushed): `docs/design.md` + `CLAU
         +DE.md` pointer (3c9db9a); this file. `ads/` (4 PNGs) still untr
+acked.  
 14  
 15 +## Design  
 16 +- **Design direction: `docs/design.md`.** Read it before any UI + work; it wins over the frontend-design plugin where they disag
+ree.  
 17 +- Neutral base decided: hero follows its ad (A dark, B light);
+everything below the hero is light for both variants. Exact neu
+tral hex values still to be sampled from the ad backgrounds whe
+n building the hero.  
 18 +- Chip colours fail AA for small white text (2.2–4.1:1): white
+only for large ticker text, dark text on `#e0a526`, small label
+s dark or outside the chip.  
 19 +  
 20 +## Decisions this session  
 21 +- **Unsubscribe: implement, don't remove the link** (consent co
+py promises "Odhlásit se můžu kdykoli" and "jedním kliknutím";
+GDPR Art. 7(3)). Smallest version:  
 22 + - `unsubscribedAt DateTime?` on `Lead`; re-submitting the for
+m clears it (new consent).  
 23 + - Link `/odhlasit?id=<leadId>&t=<HMAC-SHA256(leadId, UNSUBSCR
         +IBE_SECRET)>`; the page unsubscribes only via a **POST button**
+, never on GET (mail scanners prefetch links).  
 24 + - `List-Unsubscribe` + `List-Unsubscribe-Post` headers on the + Resend email (RFC 8058 one-click).  
 25 + - Needs: env var `UNSUBSCRIBE_SECRET`; Czech copy for the con
+firmation page (from the user).  
 26 +- **Cron fits Vercel Hobby.** Hobby cron: once per day, fires w
+ithin ±59 min ([docs](https://vercel.com/docs/cron-jobs/usage-a
+nd-pricing), updated 2026-07-15). Hobby max duration 300 s with + Fluid compute ([docs](https://vercel.com/docs/functions/limita
+tions#max-duration), updated 2026-08-24). 9 requests × 15 s spa
+cing ≈ 140 s.  
 27 + - Set `export const maxDuration = 300` on the cron route; con
+firm Fluid compute is on (Vercel → Settings → Functions, read o
+nly).  
 28 + - Manual seed/debug runs share the 25/day budget: at most one + extra full run per day.  
 29 + - Fallback if it ever doesn't fit: split into 2–3 daily cron
+entries at different hours.  
 30 +- **Guide email sender: `pruvodce@mail.prvnietf.cz`.** `docs/co
         +py.md` and `CLAUDE.md` already match; `noreply@` exists only in + the test route, which gets deleted.  
 31 +  
 32 ## Vercel env (names only)
33 - Production + Preview: `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` (Co
nfig, public `phc_` token).
34 - **Production only:** `RESEND_API_KEY` → email doesn't work on
previews (by design for now).
35 - Neon integration created `DATABASE_URL` (pooled) and `DATABAS
          E_URL_UNPOOLED` — **there is no `DIRECT_URL`**; use `directUrl 
          = env("DATABASE_URL_UNPOOLED")` or add `DIRECT_URL` yourself.
36 +- To add: `UNSUBSCRIBE_SECRET`.  
 37  
 38 ## Exists, but not done
39 - Prisma not installed, no schema.
...
43 - `/admin` not built (`ADMIN_USERNAME` / `ADMIN_PASSWORD` are s
et).
44  
 45 ## Next steps (in order)
27 -1. Prisma + `Lead` and `FundSnapshot` models, first migration.
28 -2. Hero, picker, result cards (copy from `docs/copy.md`, data f
-rom `data/`), with `track()`.  
 29 -3. Form → `/api/lead` → Resend email → `/dekujeme` via `withAtt
         -ribution()`; remove the test send route.  
 30 -4. Alpha Vantage cron refresh + fallback.  
 46 +1. Prisma + `Lead` (incl. `unsubscribedAt`) and `FundSnapshot`
+models, first migration.  
 47 +2. Hero, picker, result cards (copy from `docs/copy.md`, data f
+rom `data/`, look from `docs/design.md`), with `track()`.  
 48 +3. Form → `/api/lead` → Resend email (from `pruvodce@`, with un
+subscribe link + headers) → `/dekujeme` via `withAttribution()`
+; `/odhlasit`; remove the test send route.  
 49 +4. Alpha Vantage cron refresh + fallback (`maxDuration = 300`).
50 5. Timeline, explainer, social proof, footer, `/soukromi`.
51 6. `/admin` (cut first if short on time).
52 7. README, `ai-log/`, submission email.
53  
 35 -## Open questions  
 36 -- PDF guide content (placeholder OK until written).  
 37 -- Guide email sender: docs say `pruvodce@`, test route uses `no
         -reply@`.  
 54 +## Open questions (missing from the user)  
 55 +- PDF guide text.  
 56 +- `/soukromi` text.  
 57 +- PDF cover image.  
 58 +- og-image.  
 59 +- Ad text files in `ads/` (the 4 images are there, untracked).
60 +- Czech copy for the unsubscribe confirmation page.  
 61 +- Expected conversion rate and the 3 ranked A/B hypotheses for
+the README.  
 62 - No consent banner: to be confirmed by whoever handles GDPR.
63 - Add `prvnietf.cz` + `www.prvnietf.cz` to PostHog "Web analyti
cs domains"? (not done)
64 - Vercel Hobby is non-commercial (D14); a real campaign needs P
ro.

● STATUS.md is updated. Two more commits are ready for approval:

Commit 2: docs: record decisions on unsubscribe, cron and sender

File: docs/STATUS.md
Change: Records the design direction and the three decisions (unsubscribe
plan,
cron fit with doc links, pruvodce@ sender) and adds UNSUBSCRIBE_SECRET to the
env list. It also updates the open questions and next steps and fixes the
parts that were out of date (old master hash, the "uncommitted" list that has
since merged).

docs/copy.md and CLAUDE.md don't change for the sender because both already
say pruvodce@.

Commit 3 (optional): docs: add ad creatives. It adds the 4 PNGs in ads/, about
9 MB, so docs/design.md points at files that are in the repo.

Still missing from you, also listed in STATUS:

- the ad text files
- Czech copy for the unsubscribe page
- PDF guide text, PDF cover image, /soukromi text, og-image
- the expected conversion rate and the 3 A/B hypotheses

OK to make commit 2? And should I make commit 3 as well? After that I'll run
/end-session.

> <ide_opened_file>The user opened the file d:\repos\prvnietf-cz\README.md in
> the IDE. This may or may not be related to the current
> task.</ide_opened_file>

> - Added the ad text files into the ads/ directory.

- the copy.md in docs/ is up to date now
- the PDF guide text, PDF cover image, /soukromi text, og-image are added
  also
- the expected conversion rate and teh 3 A/B hypotheses are also added into
  the README.md

● I'll check what landed and where before updating STATUS.md:

Ran 2 shell commands (ctrl+o to expand)

● Everything listed is in place. Next I'll confirm that AOR's TER copy, now 0,15
% with the temporary discount and 0,20 % without, also appears in data/,
before updating STATUS.md.

Searched for 1 pattern (ctrl+o to expand)

● The AOR figures in data/us-funds.json back up the copy change. I'm now
correcting the three lines in copy.md that still list decided items as open,
and leaving the rest untouched.

● Update(docs\copy.md)
⎿  Added 1 line, removed 1 line
1 # Page copy (Czech) — approved
2  
 3 -Last checked 30. 10. 2026. Not written yet: `/soukromi` (privacy - page) text and the PDF guide text. Ask before inventing either.
3 +Last checked 30. 10. 2026. `/soukromi` text: `docs/soukromi.md`. + PDF guide: `public/prvni-3-roky-s-etf.pdf`. Not written yet: th
+e unsubscribe confirmation page; ask before inventing it.  
 4  
 5 Formal _vy_. Decimal comma (0,14 %), non-breaking space before %
and Kč, thousands separated by a space (100 000 Kč). Text in `[
         brackets]` is filled in by the page.
6

● Update(docs\copy.md)
⎿  Added 1 line, removed 1 line
160  
 161 ## 10. Email (Resend)
162  
 163 -- From: `pruvodce@mail.prvnietf.cz` (**open decision**: the te
-st route uses `noreply@`; pick one)  
 163 +- From: `pruvodce@mail.prvnietf.cz`  
 164 - Subject: **Váš průvodce: První 3 roky s ETF**
165  
 166 ```

● Update(docs\copy.md)
⎿  Added 1 line, removed 1 line
177 Odhlásit se můžete jedním kliknutím: [Odhlásit]
178 ```      179  
      180 -**Open:** the [Odhlásit] link needs a working unsubscribe endp
          -oint, or must be removed. Don't ship a link that does nothing.
      180 +[Odhlásit] links to`/odhlasit`(signed token, unsubscribes vi
          +a a button, plus`List-Unsubscribe`headers); see`docs/STATUS
+.md`. Don't ship the email before that page works.

● Update(docs\STATUS.md)
⎿  Added 9 lines, removed 7 lines
51 6. `/admin` (cut first if short on time).
52 7. README, `ai-log/`, submission email.
53  
 54 +## Assets delivered this session  
 55 +- Ads: `ads/ad-a.md`, `ads/ad-b.md` + 4 PNGs (feed 4:5, story 9
+:16).  
 56 +- `/soukromi` text: `docs/soukromi.md`. PDF guide: `public/prvn
         +i-3-roky-s-etf.pdf` (5 pages). PDF cover: `public/pdf-cover.png
         +` (794 × 1123). og-image: `public/og-image.png` (1200 × 630).  
 57 +- README: expected conversion (4–8 %, base ~5 %) and 3 ranked A
+/B hypotheses.  
 58 +- `docs/copy.md`: hero B headline is now "Koupeno. A co dál?" (
+word for word from Ad B); AOR TER shows the fee waiver (matches + `data/us-funds.json`).  
 59 +  
 60 ## Open questions (missing from the user)
55 -- PDF guide text.  
 56 -- `/soukromi` text.  
 57 -- PDF cover image.  
 58 -- og-image.  
 59 -- Ad text files in `ads/` (the 4 images are there, untracked).
60 -- Czech copy for the unsubscribe confirmation page.  
 61 -- Expected conversion rate and the 3 ranked A/B hypotheses for
-the README.  
 61 +- Czech copy for the unsubscribe confirmation page (`/odhlasit`
+).  
 62 +- `docs/soukromi.md` placeholders: contact e-mail, IČO (optiona
+l), retention period; CHECK lines (Neon region — session 01 not
+es say Frankfurt; Resend data location; PostHog IP setting). Un
+subscribe line can now be "odkazem v každém e-mailu".  
 63 +- README: the conversion section still has the line "Paste into + the README." and calls the A/B heroes "already built"; the res
+t of the README is the create-next-app template.  
 64 - No consent banner: to be confirmed by whoever handles GDPR.
65 - Add `prvnietf.cz` + `www.prvnietf.cz` to PostHog "Web analyti
cs domains"? (not done)
66 - Vercel Hobby is non-commercial (D14); a real campaign needs P
ro.
⎿  Loaded .claude\rules\copy.md

● I checked everything you added. copy.md and STATUS.md are updated to match.
Two content items are still open, and the remaining commits are below for
approval.

Fixed in docs/copy.md: your updated version still marked the sender and
unsubscribe as open, and its header said /soukromi and the PDF text didn't
exist yet. I changed only those three lines to match today's decisions. Your
other changes there are fine:

- The hero B headline now repeats Ad B word for word.
- AOR's TER now mentions the fee waiver, and data/us-funds.json has the same
  numbers (ter 0.0015, terGross 0.0020).

Still open:

- Unsubscribe page copy (/odhlasit) isn't in copy.md. I won't write Czech copy
  myself.
- docs/soukromi.md still has gaps to fill: contact e-mail, IČO, how long data
  is kept, and the CHECK lines (Resend data location, Neon region).
  - Session 01 notes say Neon is in Frankfurt.
  - The unsubscribe line can now be "odkazem v každém e-mailu".
- README.md has two problems in the new conversion section:
  - The instruction line "Paste into the README." was pasted in too.
  - Hypothesis 2 says the A/B heroes are "already built", but they aren't yet.

  Should I remove the paste line and change "already built" to "planned"? Or
  leave both for the README rewrite in step 7?

I haven't reviewed the PDF's contents (its tax and crash figures). I only
checked that it's a 5-page PDF. The cover is 794 × 1123 and the og-image is
1200 × 630, the right size for social sharing.

Proposed commits, one concern each, in this order:

┌─────┬───────────────────────┬───────────────────────────────────────────┐
│ # │ Message │ Files │
├─────┼───────────────────────┼───────────────────────────────────────────┤
│ 2 │ docs: add ad │ ads/ (4 PNGs, ad-a.md, ad-b.md) │
│ │ creatives and texts │ │
├─────┼───────────────────────┼───────────────────────────────────────────┤
│ 3 │ docs: update copy and │ docs/copy.md, docs/soukromi.md │
│ │ add privacy text │ │
├─────┼───────────────────────┼───────────────────────────────────────────┤
│ 4 │ chore: add guide pdf, │ public/prvni-3-roky-s-etf.pdf, │
│ │ cover and og image │ public/pdf-cover.png, public/og-image.png │
├─────┼───────────────────────┼───────────────────────────────────────────┤
│ │ docs: add expected │ │
│ 5 │ conversion and ab │ README.md │
│ │ hypotheses │ │
├─────┼───────────────────────┼───────────────────────────────────────────┤
│ │ docs: record │ │
│ 6 │ unsubscribe, cron, │ docs/STATUS.md │
│ │ sender decisions │ │
└─────┴───────────────────────┴───────────────────────────────────────────┘

For #6 I shortened your suggested message, because the original is 54
characters and the commit rule allows under 50.

OK to make all five? And what should I do about the two README lines?

> <ide_selection>The user selected the lines 1 to 61 from
> c:\Users\Nazarii\Downloads\readme-conversion-and-ab.md:
> README sections: expected conversion and A/B hypotheses

Paste into the README. Replace the assumed funnel numbers with real PostHog
numbers once traffic exists.

Expected conversion

Landing visitor → lead (email submitted): 4–8 %, base case about 5 %.

| Benchmark                         | Median | Source                         |
| --------------------------------- | ------ | ------------------------------ |
| Finance & insurance landing pages | 8.3 %  | [Unbounce Conversion Benchmark |

Report, finance](https://unbounce.com/conversion-benchmark-report/finance-ins
urance-conversion-rate/) |
| … investing subcategory | 3.9 % | same |
| … paid social traffic (Facebook 10.1 %, Instagram 15.5 %) | 9.3 % | same |
| … mobile | 11.5 % | same |

The report doesn't state its data year in the text; the image files are
labelled 2024.

Why the range sits here:

- Pulls down:
  - Investing is the weakest finance subcategory (3.9 %).
  - The traffic is cold, from a scrolling feed.
  - The result is shown free before the form (required by the brief), so some
    visitors leave satisfied without converting.
- Pulls up:
  - Paid social and mobile convert above the finance median.
  - One field plus consent.
  - The hero repeats the ad's promise word for word, so there's no "wrong
    page" bounce.
  - The form is offered at peak interest, right after the personal result.
  - The offer answers the visitor's next question ("what happens after I
    buy?").

Assumed funnel per 100 visitors (to be replaced with real data after ~1 000
visits):

| Step           | Visitors |
| -------------- | -------- |
| $pageview      | 100      |
| picker_q1      | 60       |
| picker_q2      | 52       |
| result_shown   | 52       |
| form_viewed    | 38       |
| form_started   | 9        |
| form_submitted | 5        |

Biggest uncertainty: the first tap (60 %). If far fewer people start the
picker, hypothesis 2 below moves up.

A/B test hypotheses, ranked by expected impact

1. Result behind the email vs free result (now: free).
   - Hypothesis: showing questions 1–2 and then asking for the email to
     reveal the fund increases submissions, because the visitor has already
     invested effort.
   - Expected impact: the largest of the three, +30–60 % on form_submitted /
     page_view, but likely lower lead quality and more fake emails.
   - Metric: form_submitted / page_view; secondary: share of leads who open
     the email / download the PDF.
   - Note: the brief asks for value before the form, so the free version is
     the default; this test measures what that choice costs.
2. Ad angle with matching hero: A "Které ETF si koupit jako první?" vs B
   "Koupeno. A co dál?" (already built, ?v=a / ?v=b).
   - Hypothesis: A reaches more people (everyone undecided); B speaks to a
     stronger fear and may bring fewer but more motivated visitors.
   - Expected impact: cost per lead between the two ads could differ by 20–40
     %.
   - Metric: cost per form_submitted by ad_version (Meta spend ÷ PostHog
     leads).
3. Lead magnet framing: generic "První 3 roky s ETF" vs personal "Váš plán na
   první 3 roky s [VWCE]".
   - Hypothesis: naming the visitor's own fund in the offer makes it feel
     made for them.
   - Expected impact: +10–25 % on form_submitted / form_viewed. Smaller,
     because it only affects people who already reached the form.
   - Metric: form_submitted / form_viewed.

Smaller ideas for later: CTA wording, consent text length, real social proof
once numbers exist.

This may or may not be related to the current task.</ide_selection>

> OK and but I don't get about those two README lines

● I'll make the five commits now, then explain the two README lines.

Ran 1 shell command (ctrl+o to expand)

● All five are committed (a11212a … 48b3159) and the working tree is clean. The
branch now has 6 commits; I haven't pushed anything.

About the two README lines. You pasted the section from
readme-conversion-and-ab.md in your Downloads. Two of its lines were written
for the moment of pasting, not for the reviewer who reads the README:

1. "Paste into the README." (just below the "Expected conversion and A/B
   hypotheses" heading). This was a note for whoever pastes the text in. In
   the README itself, a reviewer reads it as a leftover. The sentence right
   after it ("Replace the assumed funnel numbers with real PostHog numbers
   once traffic exists.") is worth keeping.
2. "(already built, ?v=a / ?v=b)" in hypothesis 2. Right now this isn't true:
   src/app/page.tsx is still the create-next-app starter. It will be true once
   the hero is built (next step 2), and the README rewrite is step 7, before
   you submit.

My suggestion: delete only "Paste into the README." now. Leave "already
built", and add a line to step 7 in STATUS.md saying "check README claims
match what's built". That's a small follow-up commit, docs: remove paste note
from readme. Should I do that?

After that I'll run /end-session.

> <ide_opened_file>The user opened the file d:\repos\prvnietf-cz\CLAUDE.md in
> the IDE. This may or may not be related to the current
> task.</ide_opened_file>

> yes

● Update(README.md)
⎿  Added 1 line, removed 1 line
48  
 49 # Expected conversion and A/B hypotheses
50  
 51 -Paste into the README. Replace the assumed funnel numbers with
-real PostHog numbers once traffic exists.  
 51 +Replace the assumed funnel numbers with real PostHog numbers on
+ce traffic exists.  
 52  
 53 ## Expected conversion
54

● Update(docs\STATUS.md)
⎿  Added 1 line, removed 1 line
49 4. Alpha Vantage cron refresh + fallback (`maxDuration = 300`).
50 5. Timeline, explainer, social proof, footer, `/soukromi`.
51 6. `/admin` (cut first if short on time).
52 -7. README, `ai-log/`, submission email.  
 52 +7. README, `ai-log/`, submission email. Check README claims mat
+ch what's built (e.g. "already built" for the A/B heroes).  
 53  
 54 ## Assets delivered this session
55 - Ads: `ads/ad-a.md`, `ads/ad-b.md` + 4 PNGs (feed 4:5, story 9
:16).

● Update(docs\STATUS.md)
⎿  Added 1 line, removed 1 line
60 ## Open questions (missing from the user)
61 - Czech copy for the unsubscribe confirmation page (`/odhlasit`
).
62 - `docs/soukromi.md` placeholders: contact e-mail, IČO (optiona
l), retention period; CHECK lines (Neon region — session 01 not
es say Frankfurt; Resend data location; PostHog IP setting). Un
subscribe line can now be "odkazem v každém e-mailu".
63 -- README: the conversion section still has the line "Paste into - the README." and calls the A/B heroes "already built"; the res
-t of the README is the create-next-app template.  
 63 +- README: the conversion section calls the A/B heroes "already
+built" (true only after step 2); the rest of the README is the
+create-next-app template.  
 64 - No consent banner: to be confirmed by whoever handles GDPR.
65 - Add `prvnietf.cz` + `www.prvnietf.cz` to PostHog "Web analyti
cs domains"? (not done)
66 - Vercel Hobby is non-commercial (D14); a real campaign needs P
ro.

Ran 1 shell command (ctrl+o to expand)

● Committed 4bbd464 (README only). The STATUS.md note stays uncommitted on
purpose: /end-session rewrites that file anyway, so it goes into the
end-of-session commit. Running /end-session now:
● Skill(end-session)
⎿  Initializing…
⎿  Error: Skill end-session cannot be used with Skill tool due to
disable-model-invocation. Ask the user to run /end-session themselves — it
cannot be invoked via the Skill tool. Do not replicate this skill's
workflow by other means — it is reserved for explicit user invocation.

● I committed the README fix as 4bbd464. But I can't start /end-session myself,
because that skill only runs when you type it. Please type /end-session to
close the session.

- Branch: docs/design-and-gaps has 7 commits from 3c9db9a to 4bbd464. Nothing
  is pushed; push it when you're ready.
- Uncommitted: docs/STATUS.md. It now says step 7 must check the README
  claims, such as hypothesis 2 saying the A/B heroes are "already built".
  /end-session rewrites that file anyway, so the change goes into its commit.
- Still open, all noted in STATUS.md:
  - Czech copy for the unsubscribe confirmation page (/odhlasit).
  - The gaps in docs/soukromi.md: contact e-mail, how long data is kept, and
    the lines marked CHECK.
  - A new env var, UNSUBSCRIBE_SECRET.
  - A read-only check that Fluid compute is on in Vercel. Without it the daily
    price refresh won't fit the 300 s limit.
- frontend-design plugin: it's enabled, but this session started before you
  turned it on, so I couldn't use it. It should load in the next session.

> /end-session

● Starting /end-session. I'll rewrite STATUS.md from what this session actually
verified, keeping it under 40 lines.

● Write(docs\STATUS.md)
⎿  Added 27 lines, removed 56 lines
1 # Status (handover between sessions)
2  
 3 -Overwritten by `/end-session` at the end of every session. Last - update: 30. 10. 2026, session 02 (design direction + review ga
-ps).  
 3 +Overwritten by `/end-session`. Last update: 30. 10. 2026, end o
+f session 02 (design direction + review gaps).  
 4  
 5 -## Works on production (prvnietf.cz, `master` = a6c623a)  
 6 -- Next.js 16 starter on Vercel; `prvnietf.cz` → 308 → `www.prvn
         -ietf.cz`, Let's Encrypt cert (Wedos DNS: A `216.198.79.1`, `www
         -` CNAME to Vercel).  
 7 -- Resend: `mail.prvnietf.cz` verified (DKIM, SPF, DMARC `p=none
         -`); sending works on prod.  
 8 -- PostHog Cloud EU (project 326300): **verified on prod** — `$p
         -ageview` arrives via `/r9t` with `ad_version`, `hero_variant`, -`utm_*`; no cookies/storage, no IP. Project settings: cookieles
-s tracking ON, discard client IP ON. One test event has `utm_so
         -urce=claude_test` (filter it out).  
 9 -- Branch previews build again: `/api/send` creates the Resend c
-lient per request (cbc7bc3, PR #2).  
 10 -- frontend-design plugin (v1.1.1, skill `frontend-design`) enab
-led at project scope (942b387, PR #6).  
 5 +## Production (prvnietf.cz, `master` = a6c623a)  
 6 +- Next.js 16 starter on Vercel; `prvnietf.cz` → 308 → `www`. Re
+send `mail.prvnietf.cz` verified. PostHog EU cookieless via `/r
         +9t`, verified (one test event `utm_source=claude_test`, filter
+it out).  
 7 +- frontend-design plugin v1.1.1 enabled at project scope (942b3
+87). Not yet seen in a session's skill list: check it loads at
+the start of the next session.  
 8  
 12 -## Branch in progress  
 13 -- `docs/design-and-gaps` (not pushed): `docs/design.md` + `CLAU
         -DE.md` pointer (3c9db9a); this file. `ads/` (4 PNGs) still untr
-acked.  
 9 +## Branch `docs/design-and-gaps` (7 commits 3c9db9a..4bbd464, n
+ot pushed)  
 10 +- `docs/design.md` (design direction; read before any UI work)
++ `CLAUDE.md` pointers.  
 11 +- `ads/` (4 PNGs + `ad-a.md`, `ad-b.md`), `docs/soukromi.md`, u
+pdated `docs/copy.md`, `public/` PDF guide + cover + og-image,
+README conversion + A/B section.  
 12  
 15 -## Design  
 16 -- **Design direction: `docs/design.md`.** Read it before any UI - work; it wins over the frontend-design plugin where they disag
-ree.  
 17 -- Neutral base decided: hero follows its ad (A dark, B light);
-everything below the hero is light for both variants. Exact neu
-tral hex values still to be sampled from the ad backgrounds whe
-n building the hero.  
 18 -- Chip colours fail AA for small white text (2.2–4.1:1): white
-only for large ticker text, dark text on `#e0a526`, small label
-s dark or outside the chip.  
 13 +## Decisions (session 02)  
 14 +- **Neutral base:** hero follows its ad (A dark, B light); belo
+w the hero light for both. Sample exact neutrals from the ads w
+hen building the hero.  
 15 +- **Unsubscribe: implement.** `Lead.unsubscribedAt DateTime?` (
+cleared on re-submit); `/odhlasit?id=…&t=HMAC-SHA256(id, UNSUBS
         +CRIBE_SECRET)`; unsubscribes only on a POST button, never on GE
+T (mail scanners prefetch); `List-Unsubscribe` + `List-Unsubscr
         +ibe-Post` headers.  
 16 +- **Cron fits Hobby:** daily only, ±59 min ([docs](https://verc
+el.com/docs/cron-jobs/usage-and-pricing)); 300 s max with Fluid + compute ([docs](https://vercel.com/docs/functions/limitations#
+max-duration)). 9 requests × 15 s ≈ 140 s → `export const maxDu
         +ration = 300`. Manual runs share 25/day (max one extra full run
+). Fallback: 2–3 daily cron entries.  
 17 +- **Sender:** `pruvodce@mail.prvnietf.cz` (`noreply@` only in t
+he test route, which gets deleted).  
 18  
 20 -## Decisions this session  
 21 -- **Unsubscribe: implement, don't remove the link** (consent co
-py promises "Odhlásit se můžu kdykoli" and "jedním kliknutím";
-GDPR Art. 7(3)). Smallest version:  
 22 - - `unsubscribedAt DateTime?` on `Lead`; re-submitting the for
-m clears it (new consent).  
 23 - - Link `/odhlasit?id=<leadId>&t=<HMAC-SHA256(leadId, UNSUBSCR
         -IBE_SECRET)>`; the page unsubscribes only via a **POST button**
-, never on GET (mail scanners prefetch links).  
 24 - - `List-Unsubscribe` + `List-Unsubscribe-Post` headers on the - Resend email (RFC 8058 one-click).  
 25 - - Needs: env var `UNSUBSCRIBE_SECRET`; Czech copy for the con
-firmation page (from the user).  
 26 -- **Cron fits Vercel Hobby.** Hobby cron: once per day, fires w
-ithin ±59 min ([docs](https://vercel.com/docs/cron-jobs/usage-a
-nd-pricing), updated 2026-07-15). Hobby max duration 300 s with - Fluid compute ([docs](https://vercel.com/docs/functions/limita
-tions#max-duration), updated 2026-08-24). 9 requests × 15 s spa
-cing ≈ 140 s.  
 27 - - Set `export const maxDuration = 300` on the cron route; con
-firm Fluid compute is on (Vercel → Settings → Functions, read o
-nly).  
 28 - - Manual seed/debug runs share the 25/day budget: at most one - extra full run per day.  
 29 - - Fallback if it ever doesn't fit: split into 2–3 daily cron
-entries at different hours.  
 30 -- **Guide email sender: `pruvodce@mail.prvnietf.cz`.** `docs/co
         -py.md` and `CLAUDE.md` already match; `noreply@` exists only in - the test route, which gets deleted.  
 19 +## Not done / known gaps  
 20 +- Prisma not installed; `page.tsx` is the starter; `/admin`, fu
+nnel events after `$pageview` not built.  
 21 +- `src/app/api/send/route.ts` is an unprotected test route; del
+ete when `/api/lead` exists.  
 22 +- Env: `RESEND_API_KEY` is Production only; no `DIRECT_URL` (us
+e `DATABASE_URL_UNPOOLED`); `UNSUBSCRIBE_SECRET` to add.  
 23  
 32 -## Vercel env (names only)  
 33 -- Production + Preview: `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` (Co
-nfig, public `phc_` token).  
 34 -- **Production only:** `RESEND_API_KEY` → email doesn't work on - previews (by design for now).  
 35 -- Neon integration created `DATABASE_URL` (pooled) and `DATABAS
         -E_URL_UNPOOLED` — **there is no `DIRECT_URL`**; use `directUrl 
         -= env("DATABASE_URL_UNPOOLED")` or add `DIRECT_URL` yourself.  
 36 -- To add: `UNSUBSCRIBE_SECRET`.  
 37 -  
 38 -## Exists, but not done  
 39 -- Prisma not installed, no schema.  
 40 -- `src/app/api/send/route.ts` is a test route (hardcoded recipi
-ents, unprotected). Delete when `/api/lead` exists.  
 41 -- `src/app/page.tsx` is the create-next-app starter; README is
-the template + Analytics section.  
 42 -- Funnel events after `$pageview` aren't wired (components don'
-t exist yet).  
 43 -- `/admin` not built (`ADMIN_USERNAME` / `ADMIN_PASSWORD` are s
-et).  
 44 -  
 45 -## Next steps (in order)  
 46 -1. Prisma + `Lead` (incl. `unsubscribedAt`) and `FundSnapshot`
-models, first migration.  
 47 -2. Hero, picker, result cards (copy from `docs/copy.md`, data f
-rom `data/`, look from `docs/design.md`), with `track()`.  
 48 -3. Form → `/api/lead` → Resend email (from `pruvodce@`, with un
-subscribe link + headers) → `/dekujeme` via `withAttribution()`
-; `/odhlasit`; remove the test send route.  
 49 -4. Alpha Vantage cron refresh + fallback (`maxDuration = 300`).
24 +## Next steps  
 25 +1. Prisma: `Lead` (incl. `unsubscribedAt`) + `FundSnapshot`, fi
+rst migration.  
 26 +2. Hero, picker, result cards (`docs/copy.md`, `data/`, `docs/d
         +esign.md`), with `track()`.  
 27 +3. Form → `/api/lead` → email (`pruvodce@`, unsubscribe link +
+headers) → `/dekujeme`; `/odhlasit`; remove test route.  
 28 +4. Alpha Vantage cron + fallback (`maxDuration = 300`; first ve
+rify Fluid compute is on, read only).  
 29 5. Timeline, explainer, social proof, footer, `/soukromi`.
30 6. `/admin` (cut first if short on time).
52 -7. README, `ai-log/`, submission email. Check README claims mat
-ch what's built (e.g. "already built" for the A/B heroes).  
 31 +7. README (check claims match what's built, e.g. A/B heroes "al
+ready built"), `ai-log/`, submission email.  
 32  
 54 -## Assets delivered this session  
 55 -- Ads: `ads/ad-a.md`, `ads/ad-b.md` + 4 PNGs (feed 4:5, story 9
-:16).  
 56 -- `/soukromi` text: `docs/soukromi.md`. PDF guide: `public/prvn
         -i-3-roky-s-etf.pdf` (5 pages). PDF cover: `public/pdf-cover.png
         -` (794 × 1123). og-image: `public/og-image.png` (1200 × 630).  
 57 -- README: expected conversion (4–8 %, base ~5 %) and 3 ranked A
-/B hypotheses.  
 58 -- `docs/copy.md`: hero B headline is now "Koupeno. A co dál?" (
-word for word from Ad B); AOR TER shows the fee waiver (matches - `data/us-funds.json`).  
 59 -  
 60 -## Open questions (missing from the user)  
 61 -- Czech copy for the unsubscribe confirmation page (`/odhlasit`
-).  
 62 -- `docs/soukromi.md` placeholders: contact e-mail, IČO (optiona
-l), retention period; CHECK lines (Neon region — session 01 not
-es say Frankfurt; Resend data location; PostHog IP setting). Un
-subscribe line can now be "odkazem v každém e-mailu".  
 63 -- README: the conversion section calls the A/B heroes "already
-built" (true only after step 2); the rest of the README is the
-create-next-app template.  
 64 -- No consent banner: to be confirmed by whoever handles GDPR.  
 65 -- Add `prvnietf.cz` + `www.prvnietf.cz` to PostHog "Web analyti
-cs domains"? (not done)  
 66 -- Vercel Hobby is non-commercial (D14); a real campaign needs P
-ro.  
 33 +## Open questions for the user  
 34 +- Czech copy for the `/odhlasit` confirmation page.  
 35 +- `docs/soukromi.md`: contact e-mail, IČO (optional), retention + period; CHECK lines (Neon region, Resend data location). Unsub
+scribe line → "odkazem v každém e-mailu".  
 36 +- PDF guide content not reviewed by Claude (tax/crash figures).
37 +- No consent banner (confirm with GDPR owner); PostHog web anal
+ytics domains; Vercel Hobby is non-commercial (D14).

● Now the session entry in NOTES-ai.md (append-only):

● Bash(tail -c 200 NOTES-ai.md | od -c | tail -3 && cat >> NOTES-ai.md <<'EOF'…)
⎿  Updated NOTES-ai.md (+55 -37)
1 -# How AI was used — working notes  
 1 +# How AI was used — working notes  
 2 +  
 3 +Running log for the README section "How I worked with AI". Upda
+ted at the end of every session by the `/end-session` skill.  
 4 +  
 5 +## Session 00 – Planning in the Claude app (25.–29. 10. 2026)  
 6 +  
 7 +- Chose task B, defined the audience and the "what happens afte
+r you buy" angle, approved section order and Czech copy.  
 8 +- Researched and verified data:  
 9 + - Alpha Vantage TERs matched the issuer documents.  
 10 + - `net_assets` turned out to be the whole fund.  
 11 + - VT holdings were missing non-US companies and contained sta
+le names.  
 12 + - UCITS profiles came back empty.  
 13 + - EODHD's free plan has no fund fundamentals.  
 14 +- Caught AI mistakes:  
 15 + - A Czech grammar error in the PDF title ("Prvních 3 roky").
16 + - Two typos in drafted copy.  
 17 + - An outdated tax claim (the 40M Kč cap no longer applies fro
+m 2026).  
 18 + - Ghost bubbles left in the generated ad image.  
 19 + - The Q glyph that made "QQQ" unreadable in the chosen font.
20 +- Ads: scenes from Nano Banana, all text added in code; feed 4:
+5 and story 9:16.  
 21 +- Full transcript: `ai-log/00-planning-session.md`.  
 22 +  
 23 +## Session 01 – Infrastructure and analytics (28.–30. 10. 2026)
24 +  
 25 +- Built / set up:  
 26 + - Vercel deploy fixed: Framework Preset was "Other" (every pa
+ge 404); set to Next.js.  
 27 + - Domain: Wedos DNS switched to Vercel (A + `www` CNAME, old
+AAAA removed); cert issued.  
 28 + - Neon added via Vercel Marketplace (Free, Frankfurt).  
 29 + - Resend: DKIM/SPF/DMARC records added at Wedos; `mail.prvnie
         +tf.cz` verified.  
 30 + - PostHog Cloud EU, cookieless, proxied via `/r9t`: f74f971 (
+feature), 8e4de8e (tests + `typecheck`/`test` scripts), 485b91e + (README). Verified on prod: attribution on every event, no coo
+kies, no IP.  
 31 + - Preview builds fixed: cbc7bc3 (Resend client created per re
+quest).  
 32 +- AI mistakes and how they were caught:  
 33 + - The user brought a suggestion to use PostHog `persistence: 
         +"memory"`. Checked against PostHog's docs: every full page load + would get a new ID, so the form → thank-you funnel breaks. Swi
+tched to `cookieless_mode: "always"`.  
 34 + - My own Resend example put `new Resend(key)` at module level
+; it was copied into `/api/send` and broke every branch preview + (no key in Preview). Caught by the failed Vercel preview build
+, reproduced locally with an empty key.  
 35 + - Toggled PostHog "Discard client IP data" without reading it
+s state first; it was already on, so I switched it off for abou
+t a minute. Caught by reloading the settings page; switched bac
+k on and re-verified. No events existed yet.  
 36 + - The `.ts` import in the test file failed `tsc` (TS5097). Th
+e edit hook didn't flag it (the session had started outside the + repo, so its hooks weren't loaded); caught by running `npm run
         + typecheck`.  
 37 + - Proposed one large commit with a long body mixing feature,
+tooling and docs. The user rejected it; split into three commit
+s with summary lines only, staging just the `posthog-js` line o
+f `package.json` for the feature commit.  
 38 + - Inserted D21 before D20 in `DECISIONS.md`; caught on self-r
+eview.  
 39 +- Decisions: PostHog EU cookieless + first-party proxy (reasoni
+ng in README "Analytics"; a D21 draft was later removed by the
+user). The `phc_` token is public by design (write-only), so `N
         +EXT_PUBLIC_` stays despite Vercel's warning.  
 … 55 more lines (ctrl+o to expand)
⎿  (files that changed while this command ran, by the command or by
another process; a convenience view, not a review or audit of the
command)

● The notes entry is appended. Next, /checks:

● Skill(checks)
⎿  Successfully loaded skill

Ran 1 shell command (ctrl+o to expand)

● All four checks pass. These were docs-only changes, so that was expected:

- npm run typecheck: no errors
- npm run lint: no errors
- npm test: 10 pass, 0 fail
- npm run build: succeeds (routes /, /\_not-found, /api/send)

Closing commit, ready for approval

┌────────────────┬─────────────────────────────────────────────────────────┐
│ File │ Change │
├────────────────┼─────────────────────────────────────────────────────────┤
│ docs/STATUS.md │ Rewritten for the next session, about 40 lines. │
├────────────────┼─────────────────────────────────────────────────────────┤
│ │ New entry "Session 02 – Design direction and review │
│ NOTES-ai.md │ gaps": what was built with commit hashes, the six │
│ │ mistakes and how each was caught, and the decisions. │
└────────────────┴─────────────────────────────────────────────────────────┘

Message: docs: add session 02 handover

Proposed lines for "Known pitfalls" in CLAUDE.md (I'll add them only if you
approve)

1. Unsubscribe and any other state-changing email link: act only on POST,
   never on GET, because mail scanners open links automatically.
2. Vercel Hobby: cron runs once a day at most and up to 59 min late; functions
   stop at 300 s (with Fluid compute). Long jobs set maxDuration.
3. Chip colours with white text are under 4.5:1: white only for large text,
   dark text on #e0a526.
4. The session-start git snapshot can be stale. Trust git status, not the
   reminder.

Proposed DECISIONS.md entries

Last session you removed D21 and kept its reasoning in the README, so I'm only
proposing these. Should I add them?

- D21. Unsubscribe with a signed link.
  - Decision: unsubscribedAt on Lead, an HMAC-signed /odhlasit link that
    unsubscribes via a POST button, and List-Unsubscribe headers.
  - Why: the consent copy promises one-click unsubscribe, and GDPR Art. 7(3)
    says withdrawing consent must be as easy as giving it.
- D22. Hero follows its ad's light or dark tone.
  - Decision: hero A is dark and hero B is light; everything below the hero is
    light for both.
  - Why: matching the ad's tone makes the click feel continuous (D12), and the
    rest of the page is reading and form-filling.

Skills or hooks: none proposed. Nothing got corrected more than once this
session.

Please confirm:

1. The closing commit?
2. Which pitfall lines should go in?
3. Should D21/D22 be added?

After the commit

- Run /export and save it as ai-log/02-design-and-gaps.md. Proposed commit:
  docs: add ai log 02.
- Then push docs/design-and-gaps and open the PR. I won't push.

> 1. Approve the closing commit
> 2. Add all pitfalls into the CLAUDE.md
> 3. Add D21/D22

● Update(NOTES-ai.md)
⎿  Added 1 line, removed 1 line
54 - The user's updated `copy.md` still marked sender and unsubs
cribe as open and said `/soukromi`/PDF text didn't exist; the p
asted README section kept a "Paste into the README." note. Caug
ht by reading the diffs before committing.
55 - The suggested commit message `docs: record decisions on uns
          ubscribe, cron and sender` was 54 chars (rule: under 50). Caugh
t on review; shortened.
56 - Tried to invoke `/end-session` via the Skill tool; it's use
r-only (disable-model-invocation).
57 -- Decisions: neutral base (hero follows its ad, rest light); un
-subscribe implemented with signed token + POST button + List-Un
-subscribe headers; cron fits Hobby with `maxDuration = 300`; se
-nder `pruvodce@`. Proposed `DECISIONS.md` entries are in the se
-ssion transcript (not added without approval).  
 57 +- Decisions: neutral base (hero follows its ad, rest light); un
+subscribe implemented with signed token + POST button + List-Un
+subscribe headers; cron fits Hobby with `maxDuration = 300`; se
+nder `pruvodce@`. Added to `DECISIONS.md` as D21 (unsubscribe)
+and D22 (hero tone); four new "Known pitfalls" lines in `CLAUDE
         +.md`.  
 58 - Full transcript: `ai-log/02-design-and-gaps.md`.

● Update(CLAUDE.md)
⎿  Added 4 lines
72 - `src/app/api/send/route.ts` is a **test route** with hardcode
d recipients and no protection. Remove it when the real `/api/l
          ead` exists; it must not ship.
73 - Create SDK clients that need secrets (Resend, Alpha Vantage,
…) **inside the handler**, never at module level: a variable mi
ssing in Preview fails the whole build.
74 - In third-party dashboards (Vercel, PostHog, Wedos, Resend), \*
\*read a setting's current state before toggling it**, and confi
rm it after a reload.
75 +- Unsubscribe and any other state-changing email link: act only + on **POST**, never on GET, because mail scanners open links au
+tomatically.  
 76 +- Vercel Hobby: cron runs **once a day** at most and up to 59 m
+in late; functions stop at **300 s** (with Fluid compute). Long + jobs set `maxDuration`.  
 77 +- Chip colours with white text are under 4.5:1: white only for
+large text, dark text on `#e0a526`.  
 78 +- The session-start git snapshot can be stale. Trust `git statu
         +s`, not the reminder.  
 79 - Commits: **summary line only\*\*, one concern per commit. If `p
          ackage.json` mixes concerns, stage only the relevant lines.

● Bash(cat >> DECISIONS.md <<'EOF'…)
⎿  Updated DECISIONS.md (+118 -110)
1 -# Decisions  
 2 -  
 3 -Where the brief was unclear, or research changed an assumption
-, the decision and the reason are logged here.  
 4 -  
 5 -## D1. Task B, not task A  
 6 -- **Decision:** the landing page (B).  
 7 -- **Why:** it plays to my Next.js/React experience and gives a - deployable result. Marketing was new to me, so I learned the
-basics (audience, pain points, lead magnet, message match) dur
-ing planning.  
 8 -  
 9 -## D2. "Drobný investor" = an ordinary person investing their
-own money  
 10 -- **Decision:** the main audience is a Czech retail investor,
-about 25–45, who has heard of ETFs but doesn't know which one
-to start with and is unsure what happens after buying.  
 11 -- **Why:** _drobný investor_ means retail investor, not "begin
-ner" or "experienced", so the brief leaves experience open. Th
-is group is large and fits a page about choosing a first fund. - It's also an EU legal category (MiFID II), which is why PRIIP
-s applies (D4).  
 12 -  
 13 -## D3. Own angle: "what happens after you buy"  
 14 -- **Decision:** the page and the lead magnet focus on drops, d
-ividends, taxes and selling after the first purchase.  
 15 -- **Why:** comparison pages usually stop at "what to buy". The - fear of what comes next is a real reason beginners hesitate,
-and almost nobody answers it.  
 16 -  
 17 -## D4. Show the NYSE fund next to the European (UCITS) fund yo
-u can actually buy  
 18 -- **Decision:** each result shows a US fund (VT, VOO, AOR) and - its UCITS counterpart (VWCE, VUAA, V60A).  
 19 -- **Why:** the brief asks for NYSE ETFs. Under PRIIPs, most EU - brokers don't sell US-domiciled ETFs to retail investors beca
-use those funds have no KID.  
 20 -- **Note:** AOR → V60A is labelled _"podobný typ fondu"_. Diff
-erent issuer and index, and V60A is actively managed, so it is - not a twin.  
 21 -  
 22 -## D5. A two-question picker, result shown for free  
 23 -- **Decision:** Q1 = investment horizon, Q2 = reaction to a 30 - % drop. Four results, including "zatím ne" for horizons under - 3 years.  
 24 -- **Why:** two taps are fast on mobile, and the questions map
-to the two biggest fears (losses and taxes). A typical quiz fu
-nnel hides the result behind the email; the brief says value m
-ust be clear before the form, so the result is free and the em
-ail unlocks the next step (the PDF). Gating the result is A/B
-hypothesis material.  
 25 -  
 26 -## D6. Lead magnet: PDF "První 3 roky s ETF: co čekat, kdy nic - nedělat a jak to bude s daněmi"  
 27 -- **Decision:** after submit, the thank-you page shows a downl
-oad button and an email with the same link is sent.  
 28 -- **Why:** it continues the page's angle. A button instead of
-an automatic download, because automatic downloads are unrelia
-ble on mobile and a click can be tracked.  
 29 -- **Note:** the original title "Prvních 3 roky" was grammatica
-lly wrong and was corrected.  
 30 -  
 31 -## D7. One-field form plus GDPR consent and a honeypot  
 32 -- **Decision:** email field, consent checkbox, hidden honeypot - field.  
 33 -- **Why:** each extra field lowers conversion. Consent is requ
-ired in the EU. The honeypot stops simple bots without a CAPTC
-HA.  
 34 -  
 35 -## D8. Social proof uses mock data, clearly labelled  
 36 -- **Decision:** a small strip with numbers, marked _"Ilustračn
-í data – ukázka"_, driven by an `isMock` flag.  
 37 -- **Why:** it shows the intended design without deceiving visi
-tors. Before ads launch, it must show real numbers or be remov
-ed.  
 38 -  
 39 -## D9. Data: live where reliable, issuer documents where not  
 40 -- **Decision:**  
 … 188 more lines (ctrl+o to expand)

● I made the closing commit as 7d2d836. Before committing, I changed one line in
the NOTES-ai.md entry so it says D21/D22 and the pitfalls were added rather
than "proposed".

The four pitfall lines are now in CLAUDE.md, and D21/D22 are appended after
D20 in DECISIONS.md. I haven't committed either yet. Each change needs your OK
before it's committed, and they're two separate topics, so I propose two
commits:

┌─────┬──────────────────────────────────────────────────┬──────────────┐
│ # │ Message │ File │
├─────┼──────────────────────────────────────────────────┼──────────────┤
│ 1 │ docs: add session 02 pitfalls │ CLAUDE.md │
├─────┼──────────────────────────────────────────────────┼──────────────┤
│ 2 │ docs: record unsubscribe and hero tone decisions │ DECISIONS.md │
└─────┴──────────────────────────────────────────────────┴──────────────┘

OK to commit both?

After those two commits:

- Run /export and save the transcript as ai-log/02-design-and-gaps.md (commit:
  docs: add ai log 02).
- Push docs/design-and-gaps and open the PR yourself.
