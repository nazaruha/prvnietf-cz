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

> Before I run several agents in parallel in separate git worktrees, I need you
> to set up the foundation so they don't conflict.

Start in PLAN MODE. Don't write any code until I approve the plan.

1. Inspect first

- Look at the current repo: stack, folder structure, what's already built,
  what's half-done.
- Tell me in a short list: what exists, what works, what's missing.
- Don't delete or rewrite anything that already works.

2. Data contract

Create (or clean up, if it exists) one data file, e.g. src/data/etfs.ts or
data/etfs.json, with:

- the 4 fund results. Each result = US ticker + its European UCITS
  equivalent, with the fields the page shows (name, ticker, TER, short Czech
  description)
- the picker mapping: 2 questions (investment horizon + reaction to a
  hypothetical drop) → which of the 4 results
- TypeScript types for all of it

Use the values already in the repo or in my docs. If a value is missing,
DON'T make it up. Put TODO and list it for me.

3. Component skeleton

Create empty components with final names and typed props, so other agents
only fill them in:

- Picker (the 2 questions + state)
- ResultCard (one fund result)
- AfterPurchase (what happens after buying: drops, dividends, taxes)
- LeadForm (email form, submit handler stub)
- Analytics (tracking helper + A/B variant helper, stubs only)

Each component lives in its own folder. Wire them into the main page in the
right order so the page renders (placeholders are fine).

4. Shared files

Make sure these are final enough that agents won't need to change them:

- main page/layout file
- global styles / design tokens (colors, spacing, fonts), mobile-first
- package.json: install now anything the agents will clearly need, so they
  don't install packages themselves

5. CLAUDE.md

Create CLAUDE.md in the repo root with rules for the parallel agents:

- Edit ONLY files in your assigned folder.
- Never edit: CLAUDE.md, the data file, the main page/layout, global styles,
  package.json. If you need a change there, stop and tell me.
- Don't install packages.
- Small commits with clear messages. Don't squash.
- Run npm run build (and lint, if set up) before finishing. Fix your own
  errors.
- All user-facing text is in Czech.
- Short project description: target user = Czech retail investor 25–45 on
  mobile, heard of ETFs, doesn't know which to start with or what happens after
  buying.

6. Finish

- Run npm run build and make sure it passes.
- Commit with: chore: project skeleton and data contract
- Give me a short summary: files created, TODOs I need to fill, and a
  suggested folder ownership for 3 agents (picker, lead form, analytics/A/B).

● Entered plan mode
Claude is now exploring and designing an implementation approach.

Searched for 1 pattern, read 4 files, ran 1 shell command (ctrl+o to expand)
⎿  Loaded .claude\rules\copy.md

● Repo inspected. A few things in your request conflict with what's already
there, so I need your call on these before I write the plan.

● User answered Claude's questions:
⎿  · A CLAUDE.md already exists in the repo root, with the session routine,
stack, known pitfalls and definition of done. If I create a new one, all of
that is lost. How should the rules for the parallel agents be added? → Add
a section (Recommended)
· The current rules say 'wait for my OK before writing code' and 'commit
only after my approval'. Agents running in parallel worktrees would block
on both of these. What should the parallel agents do? → Commit freely on
own branch (Recommended)
· The lead form agent needs /api/lead → Neon via Prisma, and Prisma isn't
installed yet. Should I install it now as part of the skeleton, so that
agent doesn't install packages? → Install + schema now (Recommended)

Ran 2 shell commands (ctrl+o to expand)

● Updated plan
⎿  /plan to preview

● User approved Claude's plan
⎿  Plan saved to:
C:\Users\Nazarii\.claude\plans\majestic-percolating-zephyr.md · /plan to
edit
Plan: skeleton + data contract for parallel agents

     Context

     Next you'll run 3 agents in parallel worktrees (picker, lead form,
     analytics/A-B). If shared files (page, layout, styles, data, package.json)
     are still in flux, those agents will conflict. This step freezes those
     shared files, defines typed contracts, and adds empty components so each
     agent only fills in its own folder.

     1. Inspection: what exists

     - Works (keep as is): Next 16.4.3 + React 19.3 + Tailwind 4 on Vercel;
       PostHog cookieless via /r9t (src/lib/analytics.ts track(),
       src/lib/attribution.ts readAttribution/withAttribution + tests,
       src/instrumentation-client.ts, src/lib/posthog-proxy.ts, next.config.ts
       rewrites); hooks (.claude/hooks/check.mjs), skills, rules; Resend domain.
     - Data: data/us-funds.json (VOO, VT, AOR) and data/ucits-funds.json (VWCE,
       VUAA, V60A) with sources and dates. Approved copy is in docs/copy.md,
       design in docs/design.md.
     - Starter/half-done: page.tsx = create-next-app starter + a "Send email"
       test button; layout.tsx = Geist, lang="en", starter metadata; globals.css
       = starter tokens + dark mode; src/app/api/send/route.ts = unprotected
       test route.
     - Missing: Prisma/DB, all page sections, /api/lead, /dekujeme, /odhlasit,
       cron, /admin, proxy.ts, number-format helper.

     Correction to the brief: the spec has 3 fund pairs + not-yet (4 results),
     not 4 pairs: mix60 AOR→V60A, world VT→VWCE, sp500 VOO→VUAA, not-yet (no
     fund). Q1 has 2 answers and Q2 has 3.

     2. Branch

     git checkout -b chore/skeleton from master. The tree is clean and master is
     at 9fc8db9.

     3. Data contract: src/data/etfs.ts (+ etfs.test.ts)

     - Imports data/us-funds.json + data/ucits-funds.json. Fund numbers are not
       duplicated; JSON stays the source of truth.
     - Types: Horizon = "lt3" | "gte3", Reaction = "sell" | "wait" | "buy",
       ResultId, UsFund, UcitsFund, FundPair, FundResult (union of { kind:
       "fund", … } and { kind: "not-yet", … }), FundPrice = { ticker, price,
       currency: "EUR"|"USD", asOf, source }.
     - QUESTIONS: Q1/Q2 text and answer labels, verbatim from docs/copy.md.
     - RESULTS: Record<ResultId, FundResult>: per-card copy verbatim from
       copy.md (title, line, "Proč se hodí", note, the V60A label podobný typ
       fondu, ne přesná obdoba, shared header, the small text under every card)
       + references to JSON funds.
     - getResultId(horizon, reaction): a pure function, plus unit tests for all
       6 combinations (node --test).
     - TODOs (I won't invent these):
       - VUAA "Největší firmy: Nvidia, Apple, Microsoft": this is in copy.md but
         data/ucits-funds.json has no VUAA topHoldings → I'll leave a TODO. You
         add it with a source and date.
       - Prices: null until the cron/FundSnapshot exists (the price line is
         hidden).

     4. Shared helpers (locked after this step)

     - src/lib/format.ts + test: Czech number formatting (decimal comma, NBSP
       before %/Kč/€, space as thousands separator), formatPercent, formatDate
       ("30. 9. 2026").
     - Prisma 7.10.1 (pinned exact: prisma, @prisma/client,
       @prisma/adapter-neon). npm latest for the CLI is an 8.0 RC, so I'm
       avoiding it. Before writing anything I'll read the installed Prisma 7
       docs/README (generator prisma-client, prisma.config.ts, driver adapter,
       loading .env without dotenv, e.g. process.loadEnvFile). If anything else
       is needed (e.g. @neondatabase/serverless, dotenv), I'll stop and ask.
       - prisma/schema.prisma: Lead (from project.md + unsubscribedAt DateTime?)
         and FundSnapshot. No migration against Neon; the lead agent runs it.
       - src/lib/db.ts: a shared client (singleton), created lazily so a missing
         env var doesn't break the build.
       - A postinstall/build step with prisma generate, so Vercel builds work.

     5. Components (one folder each, final names, typed props, placeholders)

     - src/components/Hero/Hero.tsx (server): { variant: AdVersion }, label +
       <h1> + subline from copy.md (the page needs its single h1 now).
     - src/components/Picker/Picker.tsx (client): { onComplete(result:
       ResultId): void }; Q1/Q2 + Back placeholder.
     - src/components/ResultCard/ResultCard.tsx: { result: FundResult; price:
       FundPrice | null }.
     - src/components/AfterPurchase/AfterPurchase.tsx: no props (placeholder
       heading from copy.md).
     - src/components/LeadForm/LeadForm.tsx (client): { result: FundResult |
       null } + submitLead.ts stub with LeadPayload/LeadResponse types matching
       /api/lead from project.md.
     - src/components/Analytics/variant.ts: getHeroVariant(searchParams) (reuses
       readAttribution, not a duplicate) + Analytics.tsx client stub (returns
       null). track()/withAttribution() stay in src/lib/.
     - src/components/Funnel/Funnel.tsx (client, locked, mine): holds the picker
       state → renders Picker → ResultCard → LeadForm. This is the only wiring
       point, so agents never touch page.tsx.

     6. Page, layout, styles (locked)

     - page.tsx: Hero (variant from searchParams inside <Suspense>, which
       cacheComponents requires; I'll check node_modules/next/dist/docs/ first)
       → Funnel → AfterPurchase → TODO comments for social proof / explainer /
       second CTA / footer (unassigned). The starter content and the "Send
       email" button are removed.
     - layout.tsx: Bricolage Grotesque via next/font, lang="cs",
       title/description/OG (/og-image.png) from copy.md, metadataBase
       http://www.prvnietf.cz.
     - globals.css (mobile-first, @theme): CTA #1db474/#06281a, 7 chip colours,
       neutrals (sampled from the ad PNGs with a zero-dependency Node script in
       scratchpad: dark for hero A, light base), font-sans = Bricolage, gutter
       spacing, tabular-nums utility, visible :focus-visible,
       prefers-reduced-motion. The starter dark mode is removed (design.md:
       light base).
     - /api/send stays untouched (the lead agent deletes it).

     7. CLAUDE.md: new section "Parallel agents" at the top (everything else
     stays)

     - Edit only the folder assigned to you; locked: CLAUDE.md, data/,
       src/data/, src/app/page.tsx, src/app/layout.tsx, src/app/globals.css,
       package.json/lock, src/components/Funnel/, src/lib/format.ts,
       src/lib/db.ts, prisma/schema.prisma, next.config.ts → if you need a
       change there, stop and tell the user.
     - Don't install packages. Czech text verbatim from docs/copy.md only.
     - Overrides the session routine for agents: small Conventional Commits on
       your own branch without waiting for approval, no squash, never push/PR.
     - Before finishing: npm run typecheck && npm run lint && npm test && npm
       run build, and fix your own errors.
     - Project description (target user 25–45, mobile, …).

     8. Verification and commit

     - /checks (typecheck, lint, test, build) must pass; quick npm run dev + a
       look at 390 px (the page renders, the h1 + Q1 placeholder are visible).
     - One commit chore: project skeleton and data contract (summary line only,
       per commits.md; this is one commit because you asked for it, even though
       it touches several areas).

     9. Suggested ownership (also goes in the summary)

     - Picker agent: src/components/Picker/, src/components/ResultCard/ (events
       picker_q1, picker_q2, result_shown).
     - Lead agent: src/components/LeadForm/, src/app/api/lead/,
       src/app/api/send/ (delete), src/app/dekujeme/, src/app/odhlasit/,
       prisma/migrations/ (form/pdf events).
     - Analytics/A-B agent: src/components/Analytics/, src/components/Hero/,
       src/lib/analytics.ts, src/lib/attribution*.ts.
     - Unassigned for now: AfterPurchase, explainer/social proof/footer, cron,
       /admin.

● Bash(git checkout -b chore/skeleton && npm install --save-exact
@prisma/client@7.10.1 @prisma/adapter-neon@7.10.1 && npm install
--save-exact --save-dev prisma@7.10.…)
⎿  Updated package.json (+33 -30)
⎿  … 1 more file changed
⎿  (a git step in this command can move the working tree, so these may be
its changes, not edits) (ctrl+o to expand)
⎿  (files that changed while this command ran, by the command or by
another process; a convenience view, not a review or audit of the
command)
⎿  (timeout 5m)

● Prisma is installed. Next I'm reading its Prisma 7 config/adapter docs before
I write the schema.

Searched for 3 patterns, ran 3 shell commands (ctrl+o to expand)

● Reading the Prisma 7 init templates (generated in scratchpad) to get the
config right.

Searched for 1 pattern, ran 2 shell commands (ctrl+o to expand)

● Next, sampling the ads' neutral backgrounds with a small Node PNG decoder (no
new deps).

Made 1 scratchpad edit +51 (ctrl+o to expand)

● Let me look at the ads first to pick sensible sample points.

Read 2 files, ran 3 shell commands (ctrl+o to expand)

● Ad colours sampled: night #10191b (A), ink #14181f, mist #dadedf, white base
(B). The B accent arcs are #e0573f, which is exactly the red chip colour. Now
writing the Prisma files.

● Write(prisma\schema.prisma)
⎿  Wrote 39 lines to prisma\schema.prisma
1 // Models from docs/project.md. The connection URLs live in pris
ma.config.ts (migrations)
2 // and src/lib/db.ts (runtime, via the Neon adapter).
3
4 generator client {
5 provider = "prisma-client"
6 output = "../src/generated/prisma"
7 }
8
9 datasource db {
… +30 lines (ctrl+o to expand)

● Write(prisma.config.ts)
⎿  Wrote 20 lines to prisma.config.ts
1 import { loadEnvFile } from "node:process";
2 import { defineConfig } from "prisma/config";
3
4 // Locally the URLs come from .env.local; on Vercel they are alre
ady in the environment.
5 try {
6 loadEnvFile(".env.local");
7 } catch {
8 // No .env.local (CI, Vercel).
9 }
… +11 lines (ctrl+o to expand)
⎿  Loaded .claude\rules\db-and-api.md

● Bash(npx prisma generate 2>&1 | tail -5 && ls src/generated/prisma && grep -n
"PrismaNeon\b" -A3 node_modules/@prisma/adapter-neon/dist/index.d.ts |
head -20)
⎿  Created src\generated\prisma\browser.ts (+29 -0)
1 +  
 2 +/_ !!! This is code generated by Prisma. Do not edit directly.
+!!! _/  
 3 +/_ eslint-disable _/  
 4 +// biome-ignore-all lint: generated file  
 5 +// @ts-nocheck  
 6 +/_  
 7 + _ This file should be your main import to use Prisma-related t
+ypes and utilities in a browser.  
 8 + _ Use it to get access to models, enums, and input types.  
 9 + _  
 10 + _ This file does not contain a `PrismaClient` class, nor sever
+al other helpers that are intended as server-side only.  
 11 + _ See `client.ts` for the standard, server-side entry point.  
 12 + _  
 13 + _ 🟢 You can import this file directly.  
 14 + _/  
 15 +  
 16 +import _ as Prisma from './internal/prismaNamespaceBrowser.ts'
17 +export { Prisma }  
 18 +export _ as $Enums from './enums.ts'  
 19 +export _ from './enums.ts';  
 20 +/**  
 21 + _ Model Lead  
 22 + _  
 23 + \*/  
 24 +export type Lead = Prisma.LeadModel  
 25 +/**  
 26 + _ Model FundSnapshot  
 27 + _  
 28 + _/  
 29 +export type FundSnapshot = Prisma.FundSnapshotModel  
 ⎿  Created src\generated\prisma\client.ts (+53 -0)
1 +  
 2 +/_ !!! This is code generated by Prisma. Do not edit directly.
+!!! _/  
 3 +/_ eslint-disable _/  
 4 +// biome-ignore-all lint: generated file  
 5 +// @ts-nocheck  
 6 +/_  
 7 + _ This file should be your main import to use Prisma. Through
+it you get access to all the models, enums, and input types.  
 8 + _ If you're looking for something you can import in the client
+-side of your application, please refer to the `browser.ts` fil
+e instead.  
 9 + _  
 10 + _ 🟢 You can import this file directly.  
 11 + _/  
 12 +  
 13 +import _ as process from 'node:process'  
 14 +import _ as path from 'node:path'  
 15 +import { fileURLToPath } from 'node:url'  
 16 +globalThis['__dirname'] = path.dirname(fileURLToPath(import.met
+a.url))  
 17 +  
 18 +import _ as runtime from "@prisma/client/runtime/client"  
 19 +import _ as $Enums from "./enums.ts"  
 20 +import _ as $Class from "./internal/class.ts"                  
      21 +import * as Prisma from "./internal/prismaNamespace.ts"        
      22 +                                                               
      23 +export * as $Enums from './enums.ts'                           
      24 +export * from "./enums.ts"                                     
      25 +/**                                                            
      26 + * ## Prisma Client                                            
      27 + *                                                             
      28 + * Type-safe database client for TypeScript                    
      29 + * @example                                                    
      30 + * ```                                                         
      31 + * const prisma = new PrismaClient({                           
      32 + *   adapter: new PrismaPg({ connectionString: process.env.DATA
         +BASE_URL })                                                    
      33 + * })                                                          
      34 + * // Fetch zero or more Leads                                 
      35 + * const leads = await prisma.lead.findMany()                  
      36 + * ```                                                         
      37 + *                                                             
      38 + * Read more in our [docs](https://pris.ly/d/client).          
      39 + */                                                            
      40 +export const PrismaClient = $Class.getPrismaClientClass()      
     … 13 more lines (ctrl+o to expand)
  ⎿  Created src\generated\prisma\commonInputTypes.ts (+352 -0)
        1 +                                                              
        2 +/* !!! This is code generated by Prisma. Do not edit directly.
          + !!! */                                                       
        3 +/* eslint-disable */                                          
        4 +// biome-ignore-all lint: generated file                      
        5 +// @ts-nocheck                                                
        6 +/*                                                            
        7 + * This file exports various common sort, input & filter types
          + that are not directly linked to a particular model.          
        8 + *                                                            
        9 + * 🟢 You can import this file directly.                      
       10 + */                                                           
       11 +                                                              
       12 +import type * as runtime from "@prisma/client/runtime/client" 
       13 +import * as $Enums from "./enums.ts"                          
       14 +import type * as Prisma from "./internal/prismaNamespace.ts"  
       15 +                                                              
       16 +                                                              
       17 +export type StringFilter<$PrismaModel = never> = {  
 18 + equals?: string | Prisma.StringFieldRefInput<$PrismaModel>  
       19 +  in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>
20 + notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaMod
          +el>                                                           
       21 +  lt?: string | Prisma.StringFieldRefInput<$PrismaModel>  
 22 + lte?: string | Prisma.StringFieldRefInput<$PrismaModel>     
       23 +  gt?: string | Prisma.StringFieldRefInput<$PrismaModel>  
 24 + gte?: string | Prisma.StringFieldRefInput<$PrismaModel>     
       25 +  contains?: string | Prisma.StringFieldRefInput<$PrismaModel>
26 + startsWith?: string | Prisma.StringFieldRefInput<$PrismaMode
          +l>                                                            
       27 +  endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
28 + mode?: Prisma.QueryMode  
 29 + not?: Prisma.NestedStringFilter<$PrismaModel> | string      
       30 +}                                                             
       31 +                                                              
       32 +export type BoolFilter<$PrismaModel = never> = {  
 33 + equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>
       34 +  not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean  
 35 +}  
 36 +  
 37 +export type StringNullableFilter<$PrismaModel = never> = {    
       38 +  equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | + null  
 39 + in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>
          + | null                                                       
       40 +  notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaMod
+el> | null  
 … 312 more lines (ctrl+o to expand)
⎿  Created src\generated\prisma\enums.ts (+15 -0)
1 +  
 2 +/_ !!! This is code generated by Prisma. Do not edit directly.
+!!! _/  
 3 +/_ eslint-disable _/  
 4 +// biome-ignore-all lint: generated file  
 5 +// @ts-nocheck  
 6 +/_  
 7 +_ This file exports all enum related types from the schema.  
 8 +_  
 9 +_ 🟢 You can import this file directly.  
 10 +_/  
 11 +  
 12 +  
 13 +  
 14 +// This file is empty because there are no enums in the schema.
15 +export {}  
 ⎿  Created src\generated\prisma\internal\class.ts (+214 -0)
1 +  
 2 +/_ !!! This is code generated by Prisma. Do not edit directly. + !!! _/  
 3 +/_ eslint-disable _/  
 4 +// biome-ignore-all lint: generated file  
 5 +// @ts-nocheck  
 6 +/_  
 7 + _ WARNING: This is an internal file that is subject to change
+!  
 8 + _  
 9 + _ 🛑 Under no circumstances should you import this file direc
+tly! 🛑  
 10 + _  
 11 + _ Please import the `PrismaClient` class from the `client.ts` + file instead.  
 12 + _/  
 13 +  
 14 +import _ as runtime from "@prisma/client/runtime/client"  
 15 +import type _ as Prisma from "./prismaNamespace.ts"  
 16 +  
 17 +  
 18 +const config: runtime.GetPrismaClientConfig = {  
 19 + "previewFeatures": [],  
 20 + "clientVersion": "7.10.1",  
 21 + "engineVersion": "d1b3f377ca835d73fd50954a5e22128b9ebdd6b8",
22 + "activeProvider": "postgresql",  
 23 + "inlineSchema": "// Models from docs/project.md. The connect
+ion URLs live in prisma.config.ts (migrations)\n// and src/lib
+/db.ts (runtime, via the Neon adapter).\n\ngenerator client {\
 +n provider = \"prisma-client\"\n output = \"../src/generat
+ed/prisma\"\n}\n\ndatasource db {\n provider = \"postgresql\"
+\n}\n\nmodel Lead {\n id String @id @default(c
+uid())\n email String @unique\n consent B
+oolean\n consentText String\n fund String?\n a
+dVersion String?\n utmSource String?\n utmMedium  
 + String?\n utmCampaign String?\n utmContent String
+?\n // Set by /odhlasit, cleared when the same email submits
+the form again (DECISIONS.md D21).\n unsubscribedAt DateTime?
+\n createdAt DateTime @default(now())\n}\n\nmodel FundS
+napshot {\n ticker String\n field String // \"price\" + | \"ter\"\n value Decimal\n currency String? // \"EUR\
 +" | \"USD\" for prices\n asOf DateTime // trading day /
+last_updated from the API\n fetchedAt DateTime @default(now()
+)\n source String @default(\"Alpha Vantage\")\n\n @@id( +[ticker, field])\n}\n",  
 24 + "runtimeDataModel": {  
 25 + "models": {},  
 26 + "enums": {},  
 27 + "types": {}  
 28 + },  
 29 + "parameterizationSchema": {  
 30 + "strings": [],  
 31 + "graph": ""  
 32 + }  
 33 +}  
 34 +  
 35 +config.runtimeDataModel = JSON.parse("{\"models\":{\"Lead\":{\
 +"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"Str
+ing\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"Stri
+ng\"},{\"name\":\"consent\",\"kind\":\"scalar\",\"type\":\"Boo
+lean\"},{\"name\":\"consentText\",\"kind\":\"scalar\",\"type\"
+:\"String\"},{\"name\":\"fund\",\"kind\":\"scalar\",\"type\":\
 +"String\"},{\"name\":\"adVersion\",\"kind\":\"scalar\",\"type\
 +":\"String\"},{\"name\":\"utmSource\",\"kind\":\"scalar\",\"ty
+pe\":\"String\"},{\"name\":\"utmMedium\",\"kind\":\"scalar\",\
 +"type\":\"String\"},{\"name\":\"utmCampaign\",\"kind\":\"scala
+r\",\"type\":\"String\"},{\"name\":\"utmContent\",\"kind\":\"s
+calar\",\"type\":\"String\"},{\"name\":\"unsubscribedAt\",\"ki
+nd\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\"
+,\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null,\
 +"schema\":null},\"FundSnapshot\":{\"fields\":[{\"name\":\"tick
+er\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fiel
+d\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"value
+\",\"kind\":\"scalar\",\"type\":\"Decimal\"},{\"name\":\"curre
+ncy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"asO
+f\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"fet
+chedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":
+\"source\",\"kind\":\"scalar\",\"type\":\"String\"}],\"dbName\
 +":null,\"schema\":null}},\"enums\":{},\"types\":{}}")  
 36 +config.parameterizationSchema = {  
 37 + strings: JSON.parse("[\"where\",\"Lead.findUnique\",\"Lead.f
+indUniqueOrThrow\",\"orderBy\",\"cursor\",\"Lead.findFirst\",\
 +"Lead.findFirstOrThrow\",\"Lead.findMany\",\"data\",\"Lead.cre
+ateOne\",\"Lead.createMany\",\"Lead.createManyAndReturn\",\"Le
+ad.updateOne\",\"Lead.updateMany\",\"Lead.updateManyAndReturn\
 +",\"create\",\"update\",\"Lead.upsertOne\",\"Lead.deleteOne\",
+\"Lead.deleteMany\",\"having\",\"_count\",\"_min\",\"_max\",\"
+Lead.groupBy\",\"Lead.aggregate\",\"FundSnapshot.findUnique\",
+\"FundSnapshot.findUniqueOrThrow\",\"FundSnapshot.findFirst\",
+\"FundSnapshot.findFirstOrThrow\",\"FundSnapshot.findMany\",\"
+FundSnapshot.createOne\",\"FundSnapshot.createMany\",\"FundSna
+pshot.createManyAndReturn\",\"FundSnapshot.updateOne\",\"FundS
+napshot.updateMany\",\"FundSnapshot.updateManyAndReturn\",\"Fu
+ndSnapshot.upsertOne\",\"FundSnapshot.deleteOne\",\"FundSnapsh
+ot.deleteMany\",\"_avg\",\"_sum\",\"FundSnapshot.groupBy\",\"F
+undSnapshot.aggregate\",\"AND\",\"OR\",\"NOT\",\"ticker\",\"fi
+eld\",\"value\",\"currency\",\"asOf\",\"fetchedAt\",\"source\"
+,\"equals\",\"in\",\"notIn\",\"lt\",\"lte\",\"gt\",\"gte\",\"n
+ot\",\"contains\",\"startsWith\",\"endsWith\",\"ticker_field\"
+,\"id\",\"email\",\"consent\",\"consentText\",\"fund\",\"adVer
+sion\",\"utmSource\",\"utmMedium\",\"utmCampaign\",\"utmConten
+t\",\"unsubscribedAt\",\"createdAt\",\"set\",\"increment\",\"d
+ecrement\",\"multiply\",\"divide\"]"),  
 38 + graph: "YBMgDywAAE8AMC0AAAQAEC4AAE8AMEIBAAAAAUMBAAAAAUQgAFAA
+IUUBAEMAIUYBAEUAIUcBAEUAIUgBAEUAIUkBAEUAIUoBAEUAIUsBAEUAIUxAAF
+EAIU1AAEYAIQEAAAABACABAAAAAQAgDywAAE8AMC0AAAQAEC4AAE8AMEIBAEMA
+IUMBAEMAIUQgAFAAIUUBAEMAIUYBAEUAIUcBAEUAIUgBAEUAIUkBAEUAIUoBAE
+UAIUsBAEUAIUxAAFEAIU1AAEYAIQdGAABSACBHAABSACBIAABSACBJAABSACBK
+AABSACBLAABSACBMAABSACADAAAABAAgAwAABQAwBAAAAQAgAwAAAAQAIAMAAA
+UAMAQAAAEAIAMAAAAEACADAAAFADAEAAABACAMQgEAAAABQwEAAAABRCAAAAAB
+RQEAAAABRgEAAAABRwEAAAABSAEAAAABSQEAAAABSgEAAAABSwEAAAABTEAAAA
+ABTUAAAAABAQgAAAkAIAxCAQAAAAFDAQAAAAFEIAAAAAFFAQAAAAFGAQAAAAFH
+AQAAAAFIAQAAAAFJAQAAAAFKAQAAAAFLAQAAAAFMQAAAAAFNQAAAAAEBCAAACw
+AwAQgAAAsAMAxCAQBYACFDAQBYACFEIABfACFFAQBYACFGAQBaACFHAQBaACFI
+AQBaACFJAQBaACFKAQBaACFLAQBaACFMQABgACFNQABbACECAAAAAQAgCAAADg
+AgDEIBAFgAIUMBAFgAIUQgAF8AIUUBAFgAIUYBAFoAIUcBAFoAIUgBAFoAIUkB
+AFoAIUoBAFoAIUsBAFoAIUxAAGAAIU1AAFsAIQIAAAAEACAIAAAQACACAAAABA
+AgCAAAEAAgAwAAAAEAIA8AAAkAIBAAAA4AIAEAAAABACABAAAABAAgChUAAFwA
+IBYAAF4AIBcAAF0AIEYAAFIAIEcAAFIAIEgAAFIAIEkAAFIAIEoAAFIAIEsAAF
+IAIEwAAFIAIA8sAABIADAtAAAXABAuAABIADBCAQA0ACFDAQA0ACFEIABJACFF
+AQA0ACFGAQA2ACFHAQA2ACFIAQA2ACFJAQA2ACFKAQA2ACFLAQA2ACFMQABKAC
+FNQAA3ACEDAAAABAAgAwAAFgAwFAAAFwAgAwAAAAQAIAMAAAUAMAQAAAEAIAss
+AABCADAtAAAdABAuAABCADAvAQBDACEwAQBDACExEABEACEyAQBFACEzQABGAC
+E0QABGACE1AQBDACFBAABHACABAAAAGgAgAQAAABoAIAosAABCADAtAAAdABAu
+AABCADAvAQBDACEwAQBDACExEABEACEyAQBFACEzQABGACE0QABGACE1AQBDAC
+EBMgAAUgAgAwAAAB0AIAMAAB4AMAQAABoAIAMAAAAdACADAAAeADAEAAAaACAD
+AAAAHQAgAwAAHgAwBAAAGgAgBy8BAAAAATABAAAAATEQAAAAATIBAAAAATNAAA
+AAATRAAAAAATUBAAAAAQEIAAAiACAHLwEAAAABMAEAAAABMRAAAAABMgEAAAAB
+M0AAAAABNEAAAAABNQEAAAABAQgAACQAMAEIAAAkADAHLwEAWAAhMAEAWAAhMR
+AAWQAhMgEAWgAhM0AAWwAhNEAAWwAhNQEAWAAhAgAAABoAIAgAACcAIAcvAQBY
+ACEwAQBYACExEABZACEyAQBaACEzQABbACE0QABbACE1AQBYACECAAAAHQAgCA
+AAKQAgAgAAAB0AIAgAACkAIAMAAAAaACAPAAAiACAQAAAnACABAAAAGgAgAQAA
+AB0AIAYVAABTACAWAABWACAXAABVACAoAABUACApAABXACAyAABSACAKLAAAMw
+AwLQAAMAAQLgAAMwAwLwEANAAhMAEANAAhMRAANQAhMgEANgAhM0AANwAhNEAA
+NwAhNQEANAAhAwAAAB0AIAMAAC8AMBQAADAAIAMAAAAdACADAAAeADAEAAAaAC
+AKLAAAMwAwLQAAMA … [+2745 chars]  
 39 +}  
 40 +  
 … 174 more lines (ctrl+o to expand)
⎿  … 5 more files changed
⎿  (timeout 3m)

Ran 1 shell command (ctrl+o to expand)

● Now the db client, gitignore, eslint ignore, and the postinstall script.

● Write(src\lib\db.ts)
⎿  Wrote 20 lines to src\lib\db.ts
1 import { PrismaNeon } from "@prisma/adapter-neon";
2 import { PrismaClient } from "@/generated/prisma/client";
3
4 // One client per server instance; in dev it survives hot reload
s on globalThis.
5 const globalForPrisma = globalThis as unknown as { prisma?: Pris
maClient };
6
7 /\*_
8 _ Shared Prisma client on Neon's pooled `DATABASE_URL`.
… +12 lines (ctrl+o to expand)

● Bash(printf '\n# prisma client (generated on install)\n/src/generated/\n' >>
.gitignore && sed -i 's| "next-env.d.ts",| "next-env.d.ts",\n //
Prisma client,…) ⎿  Updated .gitignore (+3 -0)
39 # typescript
40 _.tsbuildinfo
41 next-env.d.ts
42 +  
 43 +# prisma client (generated on install)  
 44 +/src/generated/  
 ⎿  Updated eslint.config.mjs (+2 -0)
12 "out/**",
13 "build/**",
14 "next-env.d.ts",
15 + // Prisma client, generated by `prisma generate`.  
 16 + "src/generated/**",  
 17 ]),
18 ]);
19  
 ⎿  Updated package.json (+34 -33)
1 -{  
 2 - "name": "prvnietf-cz",  
 3 - "version": "0.1.0",  
 4 - "private": true,  
 5 - "scripts": {  
 6 - "dev": "next dev",  
 7 - "build": "next build",  
 8 - "start": "next start",  
 9 - "lint": "eslint",  
 10 - "typecheck": "tsc --noEmit",  
 11 - "test": "node --test \"src/**/_.test.ts\""  
 12 - },  
 13 - "dependencies": {  
 14 - "@prisma/adapter-neon": "7.10.1",  
 15 - "@prisma/client": "7.10.1",  
 16 - "next": "16.4.3",  
 17 - "posthog-js": "^1.442.1",  
 18 - "react": "19.3.0",  
 19 - "react-dom": "19.3.0",  
 20 - "resend": "^6.35.0"  
 21 - },  
 22 - "devDependencies": {  
 23 - "@tailwindcss/turbopack": "^4",  
 24 - "@types/node": "^20",  
 25 - "@types/react": "^19",  
 26 - "@types/react-dom": "^19",  
 27 - "eslint": "^9",  
 28 - "eslint-config-next": "16.4.3",  
 29 - "prisma": "7.10.1",  
 30 - "tailwindcss": "^4",  
 31 - "typescript": "^5"  
 32 - }  
 33 -}  
 1 +{  
 2 + "name": "prvnietf-cz",  
 3 + "version": "0.1.0",  
 4 + "private": true,  
 5 + "scripts": {  
 6 + "dev": "next dev",  
 7 + "build": "next build",  
 … 27 more lines (ctrl+o to expand)
⎿  Loaded .claude\rules\data.md

● Now the tested Czech number/date formatting helper.

● Write(src\lib\format.ts)
⎿  Wrote 33 lines to src\lib\format.ts
1 // Czech number formatting (docs/copy.md): decimal comma, space
as thousands separator,
2 // non-breaking space before % and units. All spaces are U+00A0
so values never wrap mid-number.
3
4 const NBSP = " ";
5
6 /\*_ 3821 → "3 821", 0.5 with 1 decimal → "0,5". _/
7 export function formatNumber(value: number, decimals = 0): strin
g {
… +26 lines (ctrl+o to expand)

● Write(src\lib\format.test.ts)
⎿  Wrote 47 lines to src\lib\format.test.ts
1 import assert from "node:assert/strict";
2 import { describe, it } from "node:test";
3 import { formatAmount, formatDate, formatNumber, formatPercent }
from "./format.ts";
4
5 const NBSP = " ";
6
7 describe("formatNumber", () => {
8 it("separates thousands with a non-breaking space", () => {
9 assert.equal(formatNumber(3821), `3${NBSP}821`);
… +38 lines (ctrl+o to expand)

Ran 1 shell command (ctrl+o to expand)

● Now the data contract.

● Write(src\data\etfs.ts)
⎿  Wrote 290 lines to src\data\etfs.ts
1 // Data contract for the picker and the result cards.
2 // Fund facts come from data/\*.json (the source of truth, with s
ources and dates);
3 // Czech text is verbatim from docs/copy.md. Components read onl
y from here.
4 // Locked file for the parallel agents: ask before changing it.
5
6 import usFundsJson from "../../data/us-funds.json" with { type:
"json" };
7 import ucitsFundsJson from "../../data/ucits-funds.json" with {
… +284 lines (~9 KB) (ctrl+o to expand)

● Write(src\data\etfs.test.ts)
⎿  Wrote 56 lines to src\data\etfs.test.ts
1 import assert from "node:assert/strict";
2 import { describe, it } from "node:test";
3 import { getResult, getResultId, RESULTS } from "./etfs.ts";
4
5 const NBSP = " ";
6
7 describe("getResultId", () => {
8 it("sends everyone under 3 years to not-yet, whatever the seco
nd answer", () => {
9 assert.equal(getResultId("lt3", "sell"), "not-yet");
… +47 lines (ctrl+o to expand)

Ran 1 shell command (ctrl+o to expand)

● Data contract passes typecheck and tests. Now the components, beginning with a
check for the font export name.

Searched for 1 pattern, ran 1 shell command (ctrl+o to expand)

● Write(src\app\layout.tsx)
⎿  Added 23 lines, removed 15 lines
1 import type { Metadata } from "next";
2 -import { Geist, Geist_Mono } from "next/font/google";  
 2 +import { Bricolage_Grotesque } from "next/font/google";  
 3 import "./globals.css";
4  
 5 -const geistSans = Geist({  
 6 - variable: "--font-geist-sans",  
 7 - subsets: ["latin"],  
 5 +// Variable font (weights 200–800). latin-ext carries the Czech + letters (ř, ě, ů).  
 6 +// The optical size axis keeps large headlines tight and small
+text readable.  
 7 +const bricolage = Bricolage_Grotesque({  
 8 + variable: "--font-bricolage",  
 9 + subsets: ["latin", "latin-ext"],  
 10 + axes: ["opsz"],  
 11 });
12  
 10 -const geistMono = Geist_Mono({  
 11 - variable: "--font-geist-mono",  
 12 - subsets: ["latin"],  
 13 -});  
 13 +// Title and description from docs/copy.md ("Meta").  
 14 +const title = "Které ETF koupit jako první? Srovnání pro invest
+ory z Česka";  
 15 +const description =  
 16 + "Odpovězte na 2 otázky a uvidíte ETF, které se k vám hodí – s + poplatky, daněmi a tím, co čekat po nákupu. Zdarma, bez regist
+race.";  
 17  
 18 export const metadata: Metadata = {
16 - title: "Create Next App",  
 17 - description: "Generated by create next app",  
 19 + metadataBase: new URL("https://www.prvnietf.cz"),  
 20 + title,  
 21 + description,  
 22 + openGraph: {  
 23 + title,  
 24 + description,  
 25 + locale: "cs_CZ",  
 26 + type: "website",  
 27 + images: [{ url: "/og-image.png", width: 1200, height: 630 }
+],  
 28 + },  
 29 };
30  
 31 export default function RootLayout({ children }: LayoutProps<"/
">) {
32 return (
22 - <html  
 23 - lang="en"  
 24 - className={`${geistSans.variable} ${geistMono.variable} h
         --full antialiased`}  
 25 - >  
 26 - <body className="min-h-full flex flex-col">{children}</bo
-dy>  
 33 + <html lang="cs" className={`${bricolage.variable} h-full an
         +tialiased`}>  
 34 + <body className="flex min-h-full flex-col">{children}</bo
+dy>  
 35 </html>
36 );
37 }

● Write(src\app\globals.css)
⎿  Added 58 lines, removed 17 lines
1 @import "tailwindcss";
2  
 3 -:root {  
 4 - --background: #ffffff;  
 5 - --foreground: #171717;  
 6 -}  
 3 +/_  
 4 + _ Design tokens (docs/design.md). Locked for the parallel agen
+ts: ask before changing.  
 5 + _ Neutrals are sampled from the ads in ads/ (ad-a-feed-4x5.png
+, ad-b-feed-4x5.png).  
 6 + _ Mobile first: base styles target 390 px, wider screens are t
+he exception.  
 7 + _/  
 8 +@theme {  
 9 + --font-sans: var(--font-bricolage), ui-sans-serif, system-ui, + sans-serif;  
 10  
 8 -@theme inline {  
 9 - --color-background: var(--background);  
 10 - --color-foreground: var(--foreground);  
 11 - --font-sans: var(--font-geist-sans);  
 12 - --font-mono: var(--font-geist-mono);  
 11 + /_ Neutrals _/  
 12 + --color-night: #10191b; /_ Ad A background: hero variant A _/
13 + --color-paper: #ffffff; /_ Ad B base: everything below the he
+ro, hero variant B _/  
 14 + --color-mist: #dadedf; /_ Ad B wall: tinted sections, lines _
+/  
 15 + --color-ink: #14181f; /_ Ad B headline: main text on light _/
16 + --color-ink-muted: #494c51; /_ Small text: sources, dates, no
+tes (8.9:1 on paper) _/  
 17 +  
 18 + /_ CTA: green pill, dark text (5.9:1). Only for the main acti
+on. _/  
 19 + --color-cta: #1db474;  
 20 + --color-cta-ink: #06281a;  
 21 +  
 22 + /_  
 23 + _ ETF chips: fund/ticker chips only, never decoration. White + text only as large text  
 24 + _ (>= 24 px, or >= 18.7 px bold) and never on amber; use dar
+k text on amber.  
 25 + _ Red is also Ad B's accent mark colour.  
 26 + _/  
 27 + --color-chip-blue: #2f7de1;  
 28 + --color-chip-red: #e0573f;  
 29 + --color-chip-amber: #e0a526;  
 30 + --color-chip-teal: #1f9e8f;  
 31 + --color-chip-green: #3aa65c;  
 32 + --color-chip-pink: #d14d8b;  
 33 + --color-chip-indigo: #6a7bd8;  
 34 +  
 35 + /_ Spacing: 16 px side gutter at 390 px; tap targets at least + 48 px high _/  
 36 + --spacing-gutter: 1rem;  
 37 + --spacing-tap: 3rem;  
 38 +  
 39 + /_ Readable line length for body text on wide screens _/  
 40 + --container-prose: 36rem;  
 41 }
42  
 15 -@media (prefers-color-scheme: dark) {  
 16 - :root {  
 17 - --background: #0a0a0a;  
 18 - --foreground: #ededed;  
 43 +@layer base {  
 44 + body {  
 45 + background: var(--color-paper);  
 46 + color: var(--color-ink);  
 47 + font-family: var(--font-sans);  
 48 + /_ Numbers line up in tables and cards _/  
 49 + font-variant-numeric: tabular-nums;  
 50 }
51 +  
 52 + :focus-visible {  
 53 + outline: 3px solid var(--color-chip-blue);  
 54 + outline-offset: 2px;  
 55 + }  
 56 }
57  
 22 -body {  
 23 - background: var(--background);  
 24 - color: var(--foreground);  
 25 - font-family: Arial, Helvetica, sans-serif;  
 58 +@media (prefers-reduced-motion: reduce) {  
 59 + _,  
 60 + _::before,  
 61 + \*::after {  
 62 + animation-duration: 0.01ms !important;  
 63 + animation-iteration-count: 1 !important;  
 64 + transition-duration: 0.01ms !important;  
 65 + scroll-behavior: auto !important;  
 66 + }  
 67 }

Ran 1 shell command (ctrl+o to expand)

● Update(src\app\globals.css)
⎿  Added 1 line, removed 1 line
13 --color-paper: #ffffff; /_ Ad B base: everything below the he
ro, hero variant B _/
14 --color-mist: #dadedf; /_ Ad B wall: tinted sections, lines _
/
15 --color-ink: #14181f; /_ Ad B headline: main text on light _/
16 - --color-ink-muted: #494c51; /_ Small text: sources, dates, no
-tes (8.9:1 on paper) _/  
 16 + --color-ink-muted: #494c51; /_ Small text: sources, dates, no
+tes (8.6:1 on paper, 6.4:1 on mist) _/  
 17  
 18 /_ CTA: green pill, dark text (5.9:1). Only for the main acti
on. _/
19 --color-cta: #1db474;

● Now the component stubs.

● Write(src\components\Hero\Hero.tsx)
⎿  Wrote 45 lines to src\components\Hero\Hero.tsx
1 import type { AdVersion } from "@/lib/attribution";
2
3 // Owner: analytics/A-B agent. Copy from docs/copy.md "1. Hero".
4 // Variant A = dark (Ad A), variant B = light (Ad B); see docs/d
esign.md "Neutral base".
5
6 const LABEL = "2 otázky · 20 vteřin · bez registrace";
7
8 const VARIANTS: Record<AdVersion, { headline: string; subline: s
tring }> = {
… +37 lines (ctrl+o to expand)

● Write(src\components\Picker\Picker.tsx)
⎿  Wrote 26 lines to src\components\Picker\Picker.tsx
1 "use client";
2
3 import { HORIZON_QUESTION, type ResultId } from "@/data/etfs";
4
5 // Owner: picker agent. Questions, answers and the mapping come
from src/data/etfs.ts
6 // (HORIZON_QUESTION, REACTION_QUESTION, PICKER_BACK_LABEL, getR
esultId).
7 // Tracks `picker_q1` and `picker_q2` with track() from src/lib/
analytics.ts.
… +19 lines (ctrl+o to expand)

● Write(src\components\ResultCard\ResultCard.tsx)
⎿  Wrote 22 lines to src\components\ResultCard\ResultCard.tsx
1 import type { FundPrice, PickerResult } from "@/data/etfs";
2
3 // Owner: picker agent. All text and numbers come from `result`
(src/data/etfs.ts);
4 // numbers are formatted with src/lib/format.ts. Hide the price
line when `price` is null.
5 // Tracks `result_shown` with track() from src/lib/analytics.ts.
6
7 export type ResultCardProps = {
8 result: PickerResult;
… +14 lines (ctrl+o to expand)

● Write(src\components\AfterPurchase\AfterPurchase.tsx)
⎿  Wrote 13 lines to src\components\AfterPurchase\AfterPurchase.tsx
1 // Timeline "Co se stane po nákupu" with the crash table (docs/c
opy.md section 6). Unassigned for now.
2
3 /\*_ Placeholder: heading and subline only. _/
4 export function AfterPurchase() {
5 return (
6 <section aria-labelledby="after-purchase" className="px-gutt
         er py-10">
7 <h2 id="after-purchase" className="text-2xl font-bold">
8 Co se stane po nákupu
… +5 lines (ctrl+o to expand)

● Write(src\components\LeadForm\submitLead.ts)
⎿  Wrote 24 lines to src\components\LeadForm\submitLead.ts
1 import type { AdVersion, UtmKey } from "@/lib/attribution";
2 import type { UcitsTicker } from "@/data/etfs";
3
4 // Owner: lead agent. Contract for POST /api/lead (docs/project.
md "Lead flow"),
5 // shared by LeadForm and src/app/api/lead/route.ts.
6
7 export type LeadPayload = {
8 email: string;
9 consent: boolean;
… +15 lines (ctrl+o to expand)

● Write(src\components\LeadForm\LeadForm.tsx)
⎿  Wrote 31 lines to src\components\LeadForm\LeadForm.tsx
1 "use client";
2
3 import type { PickerResult } from "@/data/etfs";
4
5 // Owner: lead agent. Copy from docs/copy.md "4. Form"; submits
through submitLead.ts.
6 // Tracks `form_viewed`, `form_started`, and `form_submitted` (o
nly after `{ ok: true }`)
7 // with track(); redirects with withAttribution() (see CLAUDE.md
pitfalls).
… +24 lines (ctrl+o to expand)

● Update(src\components\LeadForm\LeadForm.tsx)
⎿  Added 12 lines, removed 8 lines
14 /** Anchor id the "scroll to the form" CTAs point at. \*/
15 export const LEAD_FORM_ID = "pruvodce";
16  
 17 -/** Placeholder: heading only. _/  
 17 +/\*\*  
 18 + _ Placeholder: heading only.  
 19 + _ TODO(copy): docs/copy.md has no heading for a visitor who re
+aches the form  
 20 + _ (e.g. via the second CTA) before finishing the picker. Ask t
+he user.  
 21 + \*/  
 22 export function LeadForm({ result }: LeadFormProps) {
23 const heading =
20 - result?.kind === "fund"  
 21 - ? `Co vás čeká v prvních 3 letech s ${result.ucits.ticker
         -}?`  
 22 - : "Průvodce na dobu, kdy budete připraveni";  
 24 + result === null  
 25 + ? null  
 26 + : result.kind === "fund"  
 27 + ? `Co vás čeká v prvních 3 letech s ${result.ucits.tick
         +er}?`  
 28 + : "Průvodce na dobu, kdy budete připraveni";  
 29  
 30 return (
25 - <section id={LEAD_FORM_ID} aria-labelledby="lead-form" clas
-sName="px-gutter py-10">  
 26 - <h2 id="lead-form" className="text-2xl font-bold">  
 27 - {heading}  
 28 - </h2>  
 31 + <section id={LEAD_FORM_ID} aria-label="První 3 roky s ETF"
+className="px-gutter py-10">  
 32 + {heading && <h2 className="text-2xl font-bold">{heading}<
+/h2>}  
 33 </section>
34 );
35 }

● Write(src\components\Analytics\variant.ts)
⎿  Wrote 12 lines to src\components\Analytics\variant.ts
1 import { readAttribution, type AdVersion } from "@/lib/attributi
on";
2
3 // Owner: analytics/A-B agent. Server-side A/B helper for the he
ro.
4
5 export type PageSearchParams = Record<string, string | string[]
| undefined>;
6
7 /** Hero variant from the page's searchParams: B only for `?v=b`
… +6 lines (ctrl+o to expand)
● Write(src\components\Analytics\Analytics.tsx)
⎿  Wrote 10 lines to src\components\Analytics\Analytics.tsx
1 "use client";
2
3 // Owner: analytics/A-B agent. Mounted once on the page, renders
nothing.
4 // Place for page-level tracking that no section owns. Funnel ev
ents go through
5 // track() from src/lib/analytics.ts; PostHog itself starts in s
rc/instrumentation-client.ts.
6
7 /** Stub. \*/
… +3 lines (ctrl+o to expand)

● Write(src\components\Funnel\Funnel.tsx)
⎿  Wrote 29 lines to src\components\Funnel\Funnel.tsx
1 "use client";
2
3 import { useState } from "react";
4 import { RESULTS, type FundPrice, type ResultId, type UcitsTicke
r } from "@/data/etfs";
5 import { LeadForm } from "@/components/LeadForm/LeadForm";
6 import { Picker } from "@/components/Picker/Picker";
7 import { ResultCard } from "@/components/ResultCard/ResultCard";
8
9 // Wires the picker to the result card and the form. Locked for
… +21 lines (ctrl+o to expand)

Ran 1 shell command (ctrl+o to expand)

● My stray command got stuck waiting for input, so I'm stopping it and using
Edit for the rename.

● Stop Task
⎿  python - 2>/dev/null || node -e '
const fs=require("fs");… · stopped

● Update(src\components\Picker\Picker.tsx)
⎿  Added 4 lines, removed 4 lines
7 // Tracks `picker_q1` and `picker_q2` with track() from src/lib
/analytics.ts.
8  
 9 export type PickerProps = {
10 - /** Called once both questions are answered. \*/  
 11 - onComplete: (result: ResultId) => void;  
 10 + /** Called with the result once both questions are answered,
+and with null when the visitor goes back. _/  
 11 + onResult: (result: ResultId | null) => void;  
 12 };
13  
 14 /\*\* Placeholder: shows question 1 only. _/
15 -export function Picker({ onComplete }: PickerProps) {  
 16 - void onComplete;  
 15 +export function Picker({ onResult }: PickerProps) {  
 16 + void onResult;  
 17  
 18 return (
19 <section aria-labelledby="picker-q1" className="px-gutter p
          y-6">
⎿  PostToolUse:Edit hook returned blocking error
⎿  [node .claude/hooks/check.mjs]: Checks failed after editing
D:\repos\prvnietf-cz\src\components\Picker\Picker.tsx. Fix these before
continuing:

     npx tsc --noEmit
     src/components/Funnel/Funnel.tsx(24,15): error TS2322: Type '{ onComplete:
     Dispatch<SetStateAction<ResultId | null>>; }' is not assignable to type
     'IntrinsicAttributes & PickerProps'.
       Property 'onComplete' does not exist on type 'IntrinsicAttributes &
     PickerProps'.

● Update(src\components\Funnel\Funnel.tsx)
⎿  Added 1 line, removed 1 line
21  
 22 return (
23 <>
24 - <Picker onComplete={setResultId} />  
 24 + <Picker onResult={setResultId} />  
 25 {result && <ResultCard result={result} price={price} />}
26 <LeadForm result={result} />
27 </>

● That type error came from the gap between the two edits; Funnel is updated
now. Next I'm writing the page.

● Write(src\app\page.tsx)
⎿  Added 27 lines, removed 100 lines
1 -"use client";  
 1 +import { Suspense } from "react";  
 2 +import { AfterPurchase } from "@/components/AfterPurchase/Afte
+rPurchase";  
 3 +import { Analytics } from "@/components/Analytics/Analytics";
4 +import { getHeroVariant } from "@/components/Analytics/variant
+";  
 5 +import { Funnel } from "@/components/Funnel/Funnel";  
 6 +import { Hero, HeroFallback } from "@/components/Hero/Hero";  
 7  
 3 -import Image from "next/image";  
 4 -import { useState } from "react";  
 8 +// Section order from docs/project.md "Page structure". Locked + for the parallel agents.  
 9  
 6 -export default function Home() {  
 7 - const [status, setStatus] = useState<"idle" | "loading" | "s
-uccess" | "error">(  
 8 - "idle"  
 9 - );  
 10 -  
 11 - async function handleSendEmail() {  
 12 - setStatus("loading");  
 13 - try {  
 14 - const res = await fetch("/api/send", { method: "POST" })
-;  
 15 - setStatus(res.ok ? "success" : "error");  
 16 - } catch {  
 17 - setStatus("error");  
 18 - }  
 19 - }  
 20 -  
 10 +export default function Home({ searchParams }: PageProps<"/">) + {  
 11 return (
22 - <div className="flex flex-col flex-1 items-center justify-
          -center bg-zinc-50 font-sans dark:bg-black">  
 23 - <main className="flex flex-1 w-full max-w-3xl flex-col i
          -tems-center justify-between py-32 px-16 bg-white dark:bg-black
          - sm:items-start">  
 24 - <Image  
 25 - className="dark:invert h-5 w-[100px]"  
 26 - src="/next.svg"  
 27 - alt="Next.js logo"  
 28 - width={100}  
 29 - height={20}  
 30 - priority  
 31 - />  
 32 - <div className="flex flex-col items-center gap-6 text-
          -center sm:items-start sm:text-left">  
 33 - <h1 className="max-w-xs text-3xl font-semibold leadi
          -ng-10 tracking-tight text-black dark:text-zinc-50">  
 34 - To get started, edit the{" "}  
 35 - <code className="rounded bg-black/[.06] px-1.5 py-
          -0.5 font-mono text-[0.9em] dark:bg-white/[.08]">  
 36 - page.tsx  
 37 - </code>{" "}  
 38 - file.  
 39 - </h1>  
 40 - <p className="max-w-md text-lg leading-8 text-zinc-6
          -00 dark:text-zinc-400">  
 41 - Looking for a starting point or more instructions? - Head over to{" "}  
 42 - <a  
 43 - href="https://vercel.com/templates?framework=nex
-t.js&utm_source=create-next-app&utm_medium=appdir-template-tw&
-utm_campaign=create-next-app"  
 44 - className="font-medium text-zinc-950 dark:text-z
-inc-50"  
 45 - >  
 46 - Templates  
 47 - </a>{" "}  
 48 - or the{" "}  
 49 - <a  
 50 - href="https://nextjs.org/learn?utm_source=create
--next-app&utm_medium=appdir-template-tw&utm_campaign=create-ne
-xt-app"  
 51 - className="font-medium text-zinc-950 dark:text-z
-inc-50"  
 52 - >  
 53 - Learning  
 54 - </a>{" "}  
 55 - center.  
 56 - </p>  
 57 - </div>  
 58 - <div className="flex flex-col gap-4 text-base font-med
          -ium sm:flex-row">  
 59 - <a  
 60 - className="flex h-12 w-full items-center justify-c
-enter gap-2 rounded-full bg-foreground px-5 text-background tr
-ansition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[
-158px]"  
 61 - href="https://vercel.com/new?utm_source=create-nex
-t-app&utm_medium=appdir-template-tw&utm_campaign=create-next-a
-pp"  
 62 - target="\_blank"  
 63 - rel="noopener noreferrer"  
 64 - >  
 65 - <Image  
 66 - className="dark:invert h-[14px] w-4"  
 67 - src="/vercel.svg"  
 68 - alt="Vercel logomark"  
 69 - width={16}  
 70 - height={14}  
 71 - />  
 72 - Deploy Now  
 73 - </a>  
 74 - <a  
 75 - className="flex h-12 w-full items-center justify-c
-enter rounded-full border border-solid border-black/[.08] px-5 - transition-colors hover:border-transparent hover:bg-black/[.0
-4] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158p
-x]"  
 76 - href="https://nextjs.org/docs?utm_source=create-ne
-xt-app&utm_medium=appdir-template-tw&utm_campaign=create-next-
-app"  
 77 - target="\_blank"  
 78 - rel="noopener noreferrer"  
 79 - >  
 80 - Documentation  
 81 - </a>  
 82 - </div>  
 83 - <div className="flex flex-col items-center gap-2 sm:it
          -ems-start">  
 84 - <button  
 85 - type="button"  
 86 - onClick={handleSendEmail}  
 87 - disabled={status === "loading"}  
 88 - className="flex h-12 w-full items-center justify-c
-enter rounded-full border border-solid border-black/[.08] px-5 - text-base font-medium transition-colors hover:border-transpar
-ent hover:bg-black/[.04] disabled:cursor-not-allowed disabled:
-opacity-50 dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md
-:w-[158px]"  
 89 - >  
 90 - {status === "loading" ? "Sending..." : "Send email
-"}  
 91 - </button>  
 92 - {status === "success" && (  
 93 - <p className="text-sm text-green-600 dark:text-gre
          -en-400">  
 94 - Email sent successfully!  
 95 - </p>  
 96 - )}  
 97 - {status === "error" && (  
 98 - <p className="text-sm text-red-600 dark:text-red-4
          -00">  
 99 - Failed to send email.  
 100 - </p>  
 101 - )}  
 102 - </div>  
 12 + <>  
 13 + {/_ searchParams is request data: under cacheComponents
+it must sit inside Suspense. _/}  
 14 + <Suspense fallback={<HeroFallback />}>  
 15 + <VariantHero searchParams={searchParams} />  
 16 + </Suspense>  
 17 + <main className="flex-1">  
 18 + {/_ TODO(cron): pass the latest FundSnapshot prices; u
+ntil then every price line is hidden. _/}  
 19 + <Funnel prices={{}} />  
 20 + {/_ TODO: social proof strip (docs/copy.md section 5) +_/}  
 21 + <AfterPurchase />  
 22 + {/_ TODO: explainer "Proč evropská verze" (section 7) +_/}  
 23 + {/_ TODO: second CTA, disclaimer, sources (section 8) +_/}  
 24 </main>
104 - </div>  
 25 + {/_ TODO: footer (section 8) _/}  
 26 + <Analytics />  
 27 + </>  
 28 );
29 }
30 +  
 31 +async function VariantHero({ searchParams }: Pick<PageProps<"/
+">, "searchParams">) {  
 32 + return <Hero variant={getHeroVariant(await searchParams)} />
+;  
 33 +}

● Now the "Parallel agents" section at the top of CLAUDE.md.

● Update(CLAUDE.md)
⎿  Added 12 lines
2  
 3 @AGENTS.md
4  
 5 +## Parallel agents (read first if you run in a worktree)  
 6 +  
 7 +Target user: a Czech retail investor, 25–45, on a phone, coming + from an ad. They have heard of ETFs but don't know which to st
+art with or what happens after buying (drops, dividends, taxes, + currency).  
 8 +  
 9 +- **Edit only the folder(s) assigned to you** in your task prom
+pt.  
 10 +- **Never edit (locked):** `CLAUDE.md`, `data/`, `src/data/` (d
+ata contract), `src/app/page.tsx`, `src/app/layout.tsx`, `src/a
         +pp/globals.css` (design tokens), `src/components/Funnel/` (wiri
+ng), `src/lib/format.ts`, `src/lib/db.ts`, `prisma/schema.prism
         +a`, `prisma.config.ts`, `next.config.ts`, `eslint.config.mjs`, +`package.json`, `package-lock.json`. If you need a change there
+, **stop and tell the user** what you need and why.  
 11 +- **Don't install packages.**  
 12 +- All user-facing text is Czech, verbatim from `docs/copy.md` (
+or `src/data/etfs.ts`). Missing text → ask, never write it.  
 13 +- Numbers come from `src/data/etfs.ts` / `data/` and are format
+ted with `src/lib/format.ts`. Styling uses the tokens in `globa
         +ls.css` (`bg-night`, `text-ink`, `bg-cta`, `bg-chip-*`, `px-gut
         +ter`, …).  
 14 +- **This overrides the session routine and `.claude/rules/commi
         +ts.md` for you:** work on your own feature branch, make small C
+onventional Commits without waiting for approval, never squash. + Still **never push** and never open PRs.  
 15 +- Before you finish: `npm run typecheck && npm run lint && npm 
         +test && npm run build` must pass. Fix your own errors; if the f
+ailure is in a file you don't own, report it instead.  
 16 +  
 17 **Current state, open work and next steps: @docs/STATUS.md** (r
ead it first; it is how sessions hand over to each other).
18  
 19 Mobile lead-magnet landing page for Czech retail investors comp
aring NYSE ETFs with the European (UCITS) funds they can actual
ly buy. Angle: **"what happens after you buy"**. Reviewer's tes
t: _could we launch ads on it tomorrow?_ Deadline **30. 10. 202
6**.

● Running the full checks now.

Ran 1 shell command (ctrl+o to expand)

● All checks pass and / is a partial prerender. Next I'm doing a quick runtime
check of both hero variants.

Ran 1 shell command (ctrl+o to expand)

● Variants A, B and the fallback (?v=x → A) render correctly, with lang="cs" and
Q1 under the hero. Committing now.

Ran 1 shell command (ctrl+o to expand)

● I've set up the skeleton on branch chore/skeleton and committed it as bbb921c
chore: project skeleton and data contract. Typecheck, lint, the 24 tests and
npm run build all pass. I also started the production build: /, ?v=b and ?v=x
show the right headline, with lang="cs" and question 1 right under the hero. I
didn't take a 390 px screenshot, since the sections are still placeholders.
Nothing is pushed, so push and merge it yourself; the agents should branch
from it.

What I created

- Data contract: src/data/etfs.ts plus a test. It has the types, both picker
  questions, the mapping function and the 4 results (3 fund pairs + not-yet).
  Fund numbers are read from data/\*.json, not copied, and the Czech text is
  verbatim from docs/copy.md.
- Number formatting: src/lib/format.ts plus a test, for Czech numbers,
  percentages, amounts and dates.
- Prisma 7.10.1: pinned exact, because npm's latest for Prisma is an 8.0
  release candidate. Added prisma/schema.prisma with Lead (including
  unsubscribedAt) and FundSnapshot, prisma.config.ts and a shared client in
  src/lib/db.ts. The generated client is gitignored and rebuilt on every
  install, so Vercel builds work. No migration has been run.
- Components: Hero, Picker, ResultCard, AfterPurchase, LeadForm (+
  submitLead.ts with the /api/lead types), Analytics (+ variant.ts) and
  Funnel. Funnel connects the picker, result card and form, so no agent needs
  to touch the page.
- Shared files:
  - page.tsx (src/app/page.tsx): sections in the approved order. The hero
    variant loads inside Suspense, and its placeholder shows no headline, so B
    visitors never see A's headline first.
  - layout.tsx (src/app/layout.tsx): Bricolage Grotesque with Czech
    characters, title, description and OG image from docs/copy.md.
  - globals.css (src/app/globals.css): design tokens. The neutral colours were
    sampled from the ad images: #10191b (ad A background), #14181f (text),
    #dadedf, white. Ad B's red-orange marks turned out to be exactly the red
    chip colour.
- CLAUDE.md: added a "Parallel agents" section at the top; everything else is
  unchanged. It lists the locked files, says don't install packages and that
  all text is Czech from docs/copy.md, lets agents commit without approval on
  their own branch (still never push), and requires all checks to pass before
  finishing.

Things you need to fill in or decide

1. VUAA's largest companies: docs/copy.md lists "Nvidia, Apple, Microsoft",
   but data/ucits-funds.json has no VUAA holdings. I used the copy text and
   marked it TODO; please add the holdings to the data file with a source and
   date.
2. Card footnote date: it says "factsheety Vanguard a iShares k 30. 9. 2026",
   but the AOR (iShares) data is dated 26. 10. 2026. Should the text or the
   data change?
3. Form heading before the picker is answered: a visitor who jumps to the form
   from the second button hasn't picked a fund yet, and there's no heading
   for that case in docs/copy.md. It currently shows no heading.
4. DIRECT_URL is missing in Vercel. Prisma's migration config reads it; per
   STATUS only DATABASE_URL_UNPOOLED exists. Add DIRECT_URL with that value
   before the lead agent runs the first migration.
5. Crash table numbers exist only in docs/copy.md, not in data/. This matters
   later for AfterPurchase.

One change from the plan: the Picker callback is called onResult(result |
null), so going back can also clear the result.

Suggested folder ownership for the 3 agents

┌───────────┬────────────────────────────────────────┬───────────────────┐
│ Agent │ Folders │ Events │
├───────────┼────────────────────────────────────────┼───────────────────┤
│ │ src/components/Picker/, │ picker*q1, │
│ Picker │ src/components/ResultCard/ │ picker_q2, │
│ │ │ result_shown │
├───────────┼────────────────────────────────────────┼───────────────────┤
│ │ src/components/LeadForm/, │ │
│ Lead form │ src/app/api/lead/, src/app/api/send/ │ form*_, │
│ │ (delete it), src/app/dekujeme/, │ pdf_downloaded │
│ │ src/app/odhlasit/, prisma/migrations/ │ │
├───────────┼────────────────────────────────────────┼───────────────────┤
│ │ src/components/Analytics/, │ checks every │
│ Analytics │ src/components/Hero/, │ event carries the │
│ / A/B │ src/lib/analytics.ts, │ ad version │
│ │ src/lib/attribution_.ts │ │
└───────────┴────────────────────────────────────────┴───────────────────┘

Not assigned yet: AfterPurchase, social proof, the "Proč evropská verze"
explainer, the footer, the price cron and /admin.

> 1. VUAA's largest companies: Provide a reasearch of those data and add them.
>    If you cannot find them just remove it
> 2. Card footnote date: change the text
> 3. Form heading before the picker is answered:: Open the form in that case
>    and use some default types that he chose nothing in that picker which will be
>    meaning that he skipped the picker
> 4. I see DIRECT_URL in environemnt settings for this project
> 5. Crash table numbers: add them also into the data/

● I'll take these in order. First, VUAA's holdings from the Vanguard factsheet
that data/ already cites, and D10 for the crash data's source.

Ran 1 shell command (ctrl+o to expand)

● Fetch(https://fund-docs.vanguard.com/SandP_500_UCITS_ETF_USD_Accumulating_9694
\_NETH_INT_EN.pdf)
⎿  Received 407KB (200 OK)

● The PDF was saved locally, so I'll read it directly.

Read 1 file (ctrl+o to expand)

● No PDF renderer installed, so I'll try decompressing its text streams with a
small Node script.

Made 1 scratchpad edit +30, ran 4 shell commands (ctrl+o to expand)

● The Vanguard factsheet dated 30.9.2026 confirms VUAA's top holdings (NVIDIA
8.4%, Apple 7.4%, Microsoft 5.8%). I'll make the four changes one at a time,
snapshotting each, starting with VUAA holdings.

● Update(data\ucits-funds.json)
⎿  Added 4 lines
38 "inception": "2019-05-14",
39 "fundAssetsUsdM": 88973,
40 "shareClassAssetsUsdM": 36337,
41 + "topHoldings": [  
 42 + ["NVIDIA", 0.084], ["Apple", 0.074], ["Microsoft", 0.058]
+, ["Alphabet", 0.055], ["Amazon", 0.037],  
 43 + ["Broadcom", 0.025], ["Meta", 0.024], ["Micron", 0.018], +["Tesla", 0.015], ["AMD", 0.015]  
 44 + ],  
 45 "asOf": "2026-09-30",
46 "retrieved": "2026-10-27",
47 "source": "https://fund-docs.vanguard.com/SandP_500_UCITS_E
TF_USD_Accumulating_9694_NETH_INT_EN.pdf"

● Update(src\data\etfs.ts)
⎿  Added 1 line, removed 3 lines
251 ter: fundTer(VUAA, US_FUNDS.VOO),
252 facts: [
253 dividendsFact(VUAA),
254 - // TODO(data): docs/copy.md names these, but data/ucits-
-funds.json has no VUAA topHoldings.
 255 - // Add them there with source + date, then build this li
-ne from the data like VWCE's.
 256 - { label: "Největší firmy", value: "Nvidia, Apple, Micros
-oft" },
 254 + { label: "Největší firmy", value: vuaaTopCompanies() },
255 ],
256 whyItFits: {
257 label: "Proč se hodí", ⎿  PostToolUse:Edit hook returned blocking error
⎿  [node .claude/hooks/check.mjs]: Checks failed after editing
D:\repos\prvnietf-cz\src\data\etfs.ts. Fix these before continuing:

     npx tsc --noEmit
     src/data/etfs.ts(254,41): error TS2304: Cannot find name
     'vuaaTopCompanies'.

● Update(src\data\etfs.ts)
⎿  Added 8 lines
214 return [`${formatNumber(raw.numberOfStocks)} firem`, ...coun
tries].join(", ");
215 }
216  
 217 +// "Největší firmy: NVIDIA, Apple, Microsoft": the three large
+st holdings, names as in data/.  
 218 +function vuaaTopCompanies(): string {  
 219 + return ucitsFundsJson.VUAA.topHoldings  
 220 + .slice(0, 3)  
 221 + .map(([name]) => name)  
 222 + .join(", ");  
 223 +}  
 224 +  
 225 function v60aComposition(): string {
226 const { equity, bonds } = ucitsFundsJson.V60A.targetAllocati
on;
227 return `zhruba ${formatPercent(equity)} akciových a ${format
           Percent(bonds)} dluhopisových fondů Vanguard`;

● Update(src\data\etfs.test.ts)
⎿  Added 3 lines, removed 2 lines
36 );
37 });
38  
 39 - it("builds the VWCE contents and V60A composition lines from
-data/", () => {  
 40 - const value = (id: "world" | "mix60", label: string) =>  
 39 + it("builds the VWCE contents, VUAA companies and V60A composi
+tion lines from data/", () => {  
 40 + const value = (id: "world" | "sp500" | "mix60", label: stri
+ng) =>  
 41 RESULTS[id].facts.find((f) => f.label === label)?.value;
42 + assert.equal(value("sp500", "Největší firmy"), "NVIDIA, App
+le, Microsoft");  
 43 assert.equal(value("world", "Obsahuje"), `3${NBSP}821 firem
          , USA 62${NBSP}%, Japonsko 6${NBSP}%, Tchaj-wan 3,5${NBSP}%`);
44 assert.equal(value("mix60", "Složení"), `zhruba 60${NBSP}% 
          akciových a 40${NBSP}% dluhopisových fondů Vanguard`);
45 });

● Update(docs\copy.md)
⎿  Added 1 line, removed 1 line
59 - Full name: Vanguard S&P 500 UCITS ETF (USD) Accumulating
60 - Roční poplatek (TER): **0,07 %** (VOO: 0,03 %)
61 - Dividendy: automaticky se reinvestují
62 -- Největší firmy: Nvidia, Apple, Microsoft  
 62 +- Největší firmy: NVIDIA, Apple, Microsoft (the 3 largest holdi
+ngs in `data/ucits-funds.json`, spelled as in the factsheet)  
 63 - Cena: [price] EUR (Xetra, [date])
64 - ISIN: IE00BFMXXD54
65 - Proč se hodí: Poklesy berete jako příležitost. Fond je soustř
eděnější než celý svět – víc USA, víc technologií, větší výkyvy
.

● That error was between the two edits; the function exists now. Checking, then
snapshotting step 1.

Ran 2 shell commands (ctrl+o to expand)

● Step 1 passes. Step 2: the footnote, with dates built from each issuer's data.

● Update(src\data\etfs.ts)
⎿  Added 1 line, removed 1 line
5  
 6 import usFundsJson from "../../data/us-funds.json" with { type:
"json" };
7 import ucitsFundsJson from "../../data/ucits-funds.json" with {
type: "json" };
8 -import { formatNumber, formatPercent } from "../lib/format.ts";
8 +import { formatDate, formatNumber, formatPercent } from "../lib
+/format.ts";  
 9  
 10 const NBSP = " ";
11

● Update(src\data\etfs.ts)
⎿  Added 9 lines, removed 2 lines
174  
 175 export const RESULT_HEADER = "Lidé s podobnými odpověďmi obvyk
le volí:";
176  
 177 -/** Small text under every card (docs/copy.md). \*/  
 177 +/** Data date shared by all Vanguard funds; fails loudly if a
+factsheet update makes them differ. _/  
 178 +function vanguardAsOf(): string {  
 179 + const dates = new Set([US_FUNDS.VOO.asOf, US_FUNDS.VT.asOf,
+...Object.values(UCITS_FUNDS).map((f) => f.asOf)]);  
 180 + if (dates.size !== 1) throw new Error(`Vanguard funds have d
          +ifferent data dates: ${[...dates].join(", ")}`);  
 181 + return [...dates][0];  
 182 +}  
 183 +  
 184 +/\*\* Small text under every card (docs/copy.md). Each issuer's
+date comes from data/. _/  
 185 export const RESULT_FOOTNOTE =
179 - `Ceny jsou závěrečné z předchozího obchodního dne. Údaje o f
          -ondech: factsheety Vanguard a iShares k 30.${NBSP}9.${NBSP}202
          -6. Nejde o investiční doporučení.`;  
 186 + `Ceny jsou závěrečné z předchozího obchodního dne. Údaje o f
          +ondech: factsheety Vanguard k ${formatDate(vanguardAsOf())}, i
          +Shares k ${formatDate(US_FUNDS.AOR.asOf)}. Nejde o investiční 
          +doporučení.`;  
 187  
 188 /\*_ Price line: "Cena: [price] EUR (Xetra, [date])". Hidden wh
en there is no snapshot. _/
189 export const PRICE_LINE = { label: "Cena", venue: "Xetra" } as
const;

● Update(src\data\etfs.test.ts)
⎿  Added 1 line, removed 1 line
1 import assert from "node:assert/strict";
2 import { describe, it } from "node:test";
3 -import { getResult, getResultId, RESULTS } from "./etfs.ts";  
 3 +import { getResult, getResultId, RESULT_FOOTNOTE, RESULTS } from + "./etfs.ts";  
 4  
 5 const NBSP = " ";
6

● Update(src\data\etfs.test.ts)
⎿  Added 7 lines
50 assert.equal(RESULTS.sp500.similarTypeLabel, undefined);
51 });
52  
 53 + it("dates the footnote per issuer from data/", () => {  
 54 + assert.equal(  
 55 + RESULT_FOOTNOTE,  
 56 + `Ceny jsou závěrečné z předchozího obchodního dne. Údaje 
         +o fondech: factsheety Vanguard k 30.${NBSP}9.${NBSP}2026, iShar
         +es k 26.${NBSP}10.${NBSP}2026. Nejde o investiční doporučení.`,
57 + );  
 58 + });  
 59 +  
 60 it("getResult returns the full result for the answers", () =>
{
61 assert.equal(getResult("gte3", "wait").id, "world");
62 assert.equal(getResult("lt3", "buy").kind, "not-yet");

● Update(docs\copy.md)
⎿  Added 1 line, removed 1 line
81 - Text: Když peníze budete potřebovat do 3 let, pokles se nemus
í stihnout vrátit. A při prodeji dřív než za 3 roky můžete plat
it daň ze zisku. Na krátkou dobu se obvykle hodí spořicí účet n
ebo termínovaný vklad.
82 - Lead-in to the form: Až budete připraveni, průvodce se vám bu
de hodit.
83  
 84 -**Under every card (small text):** Ceny jsou závěrečné z předch
-ozího obchodního dne. Údaje o fondech: factsheety Vanguard a iS
-hares k 30. 9. 2026. Nejde o investiční doporučení.  
 84 +**Under every card (small text):** Ceny jsou závěrečné z předch
+ozího obchodního dne. Údaje o fondech: factsheety Vanguard k [3
+0. 9. 2026], iShares k [26. 10. 2026]. Nejde o investiční dopor
+učení. (Dates from `asOf` in `data/`.)  
 85  
 86 ## 4. Form
87

Ran 1 shell command (ctrl+o to expand)

● Step 2 passes. Step 3: an explicit "skipped" state for the form.

● Update(src\data\etfs.ts)
⎿  Added 8 lines
172  
 173 export type PickerResult = FundResult | NotYetResult;
174  
 175 +/** The visitor reached the form (e.g. via the second CTA) wit
+hout finishing the picker. \*/  
 176 +export type SkippedPicker = { kind: "skipped"; id: "skipped" }
+;  
 177 +  
 178 +export const SKIPPED_PICKER: SkippedPicker = { kind: "skipped"
+, id: "skipped" };  
 179 +  
 180 +/** What the lead form is shown for: a picker result, or a ski
+pped picker. _/  
 181 +export type FormContext = PickerResult | SkippedPicker;  
 182 +  
 183 export const RESULT_HEADER = "Lidé s podobnými odpověďmi obvyk
le volí:";
184  
 185 /\*\* Data date shared by all Vanguard funds; fails loudly if a
factsheet update makes them differ. _/

● Update(src\components\Funnel\Funnel.tsx)
⎿  Added 1 line, removed 1 line
1 "use client";
2  
 3 import { useState } from "react";
4 -import { RESULTS, type FundPrice, type ResultId, type UcitsTicke
-r } from "@/data/etfs";  
 4 +import { RESULTS, SKIPPED_PICKER, type FundPrice, type ResultId, + type UcitsTicker } from "@/data/etfs";  
 5 import { LeadForm } from "@/components/LeadForm/LeadForm";
6 import { Picker } from "@/components/Picker/Picker";
7 import { ResultCard } from "@/components/ResultCard/ResultCard";

● Update(src\components\Funnel\Funnel.tsx)
⎿  Added 1 line, removed 1 line
23 <>
24 <Picker onResult={setResultId} />
25 {result && <ResultCard result={result} price={price} />}
26 - <LeadForm result={result} />  
 26 + <LeadForm context={result ?? SKIPPED_PICKER} />  
 27 </>
28 );
29 }
⎿  PostToolUse:Edit hook returned blocking error
⎿  [node .claude/hooks/check.mjs]: Checks failed after editing
D:\repos\prvnietf-cz\src\components\Funnel\Funnel.tsx. Fix these before
continuing:

     npx tsc --noEmit
     src/components/Funnel/Funnel.tsx(26,17): error TS2322: Type '{ context:
     FundResult | NotYetResult | SkippedPicker; }' is not assignable to type
     'IntrinsicAttributes & LeadFormProps'.
       Property 'context' does not exist on type 'IntrinsicAttributes &
     LeadFormProps'.

● Write(src\components\LeadForm\LeadForm.tsx)
⎿  Added 20 lines, removed 17 lines
1 "use client";
2  
 3 -import type { PickerResult } from "@/data/etfs";  
 3 +import type { FormContext } from "@/data/etfs";  
 4  
 5 // Owner: lead agent. Copy from docs/copy.md "4. Form"; submits
through submitLead.ts.
6 // Tracks `form_viewed`, `form_started`, and `form_submitted` (
only after `{ ok: true }`)
7 // with track(); redirects with withAttribution() (see CLAUDE.m
d pitfalls).
8  
 9 export type LeadFormProps = {
10 - /** The result shown above the form; null before the picker i
-s finished. \*/  
 11 - result: PickerResult | null;  
 10 + /** The result shown above the form, or SKIPPED_PICKER when t
+he picker isn't finished. _/  
 11 + context: FormContext;  
 12 };
13  
 14 /\*\* Anchor id the "scroll to the form" CTAs point at. _/
15 export const LEAD_FORM_ID = "pruvodce";
16  
 17 -/**  
 18 - _ Placeholder: heading only.  
 19 - _ TODO(copy): docs/copy.md has no heading for a visitor who re
-aches the form  
 20 - _ (e.g. via the second CTA) before finishing the picker. Ask t
-he user.  
 21 - _/  
 22 -export function LeadForm({ result }: LeadFormProps) {  
 23 - const heading =  
 24 - result === null  
 25 - ? null  
 26 - : result.kind === "fund"  
 27 - ? `Co vás čeká v prvních 3 letech s ${result.ucits.tick
         -er}?`  
 28 - : "Průvodce na dobu, kdy budete připraveni";  
 17 +/** Form heading per context (docs/copy.md "4. Form"). _/  
 18 +function headingFor(context: FormContext): string {  
 19 + switch (context.kind) {  
 20 + case "fund":  
 21 + return `Co vás čeká v prvních 3 letech s ${context.ucits.
         +ticker}?`;  
 22 + case "not-yet":  
 23 + return "Průvodce na dobu, kdy budete připraveni";  
 24 + case "skipped":  
 25 + return "První 3 roky s ETF";  
 26 + }  
 27 +}  
 28  
 29 +/\*\* Placeholder: heading only. The form is always open, also wh
+en the picker was skipped. _/  
 30 +export function LeadForm({ context }: LeadFormProps) {  
 31 return (
31 - <section id={LEAD_FORM_ID} aria-label="První 3 roky s ETF"
-className="px-gutter py-10">  
 32 - {heading && <h2 className="text-2xl font-bold">{heading}<
-/h2>}  
 32 + <section id={LEAD_FORM_ID} aria-labelledby="lead-form" clas
+sName="px-gutter py-10">  
 33 + <h2 id="lead-form" className="text-2xl font-bold">  
 34 + {headingFor(context)}  
 35 + </h2>  
 36 </section>
37 );
38 }

● Update(src\components\LeadForm\submitLead.ts)
⎿  Added 1 line, removed 1 line
7 export type LeadPayload = {
8 email: string;
9 consent: boolean;
10 - /** UCITS ticker of the shown result; null for "not-yet". \*/
10 + /** UCITS ticker of the shown result; null for "not-yet" and
+for a skipped picker. \*/  
 11 fund: UcitsTicker | null;
12 adVersion: AdVersion | null;
13 utm: Partial<Record<UtmKey, string>>;

● Update(docs\copy.md)
⎿  Added 1 line
89  
 90 - Heading: **Co vás čeká v prvních 3 letech s [VWCE]?**
91 - Heading for "zatím ne": **Průvodce na dobu, kdy budete připra
veni**
92 +- Heading when the picker was skipped (e.g. via the second CTA; + the form is open, `fund` is empty): **První 3 roky s ETF**  
 93 - Subline: Krátký průvodce v PDF. Hned si ho stáhnete a pošleme
vám ho i e-mailem.
94 - What's inside:
95 - Co čekat v prvních měsících po nákupu

● That's another between-edits error (LeadForm was rewritten right after).
Verifying and snapshotting step 3:

Ran 1 shell command (ctrl+o to expand)

● Step 4: crash table data. First I'm checking how Intl formats negative numbers
in Czech.

Ran 1 shell command (ctrl+o to expand)

● Write(data\crashes.json) ⎿  Wrote 13 lines to data\crashes.json
1 {
2 "\_note": "Largest drops of the S&P 500 (SPY) in 1999–2026, fro
m monthly adjusted closes. Calculated in session 00 (DECISIONS.m
d D10). Month-end data understates intra-month drops (2020 was a
bout -34 % intra-month).",
3 "series": "SPY",
4 "measure": "Monthly adjusted close in USD, incl. dividends",
5 "range": "1999–2026",
6 "source": "Alpha Vantage (TIME_SERIES_MONTHLY_ADJUSTED)",
7 "crashes": [
… +6 lines (ctrl+o to expand)

● Update(src\lib\format.ts)
⎿  Added 3 lines, removed 2 lines
3  
 4 const NBSP = " ";
5  
 6 -/** 3821 → "3 821", 0.5 with 1 decimal → "0,5". \*/  
 6 +/** 3821 → "3 821", 0.5 with 1 decimal → "0,5", -24 → "−24" (typ
+ographic minus). _/  
 7 export function formatNumber(value: number, decimals = 0): strin
g {
8 return new Intl.NumberFormat("cs-CZ", {
9 minimumFractionDigits: decimals,
...
11 useGrouping: true,
12 })
13 .format(value)
14 - .replace(/\s/g, NBSP);  
 14 + .replace(/\s/g, NBSP)  
 15 + .replace("-", "−");  
 16 }
17  
 18 /\*\* A fraction from data/ (0.0014) → "0,14 %". _/

● Update(src\lib\format.ts)
⎿  Added 13 lines
25 return `${formatNumber(value, decimals)}${NBSP}${unit}`;
26 }
27  
 28 +const MONTHS = [
 29 + "leden", "únor", "březen", "duben", "květen", "červen",
 30 + "červenec", "srpen", "září", "říjen", "listopad", "prosinec",
31 +];  
 32 +  
 33 +/** "2023-12" → "prosinec 2023". \*/  
 34 +export function formatMonth(isoMonth: string): string {  
 35 + const match = /^(\d{4})-(\d{2})$/.exec(isoMonth);            
      36 +  const month = match ? MONTHS[Number(match[2]) - 1] : undefine
         +d;                                                             
      37 +  if (!match || !month) throw new Error(`Not an ISO month: ${is
         +oMonth}`);                                                     
      38 +  return `${month}${NBSP}${match[1]}`;  
 39 +}  
 40 +  
 41 /** "2026-09-30" → "30. 9. 2026". Parsed by hand, so the server
's time zone can't shift the day. \*/
42 export function formatDate(isoDate: string): string {
43 const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate);

● Update(src\lib\format.test.ts)
⎿  Added 16 lines
13 it("uses a decimal comma", () => {
14 assert.equal(formatNumber(3.5, 1), "3,5");
15 });
16 +  
 17 + it("uses a typographic minus", () => {  
 18 + assert.equal(formatNumber(-24), "−24");  
 19 + });  
 20 });
21  
 22 +describe("formatMonth", () => {  
 23 + it("names the month in Czech", () => {  
 24 + assert.equal(formatMonth("2023-12"), `prosinec${NBSP}2023`)
+;  
 25 + assert.equal(formatMonth("2012-03"), `březen${NBSP}2012`);
26 + });  
 27 +  
 28 + it("rejects anything that isn't an ISO month", () => {  
 29 + assert.throws(() => formatMonth("2023-13"));  
 30 + assert.throws(() => formatMonth("2023-12-01"));  
 31 + });  
 32 +});  
 33 +  
 34 describe("formatPercent", () => {
35 it("formats TERs from data/ as in docs/copy.md", () => {
36 assert.equal(formatPercent(0.0014, 2), `0,14${NBSP}%`);
⎿  PostToolUse:Edit hook returned blocking error
⎿  [node .claude/hooks/check.mjs]: Checks failed after editing
D:\repos\prvnietf-cz\src\lib\format.test.ts. Fix these before continuing:

     npx tsc --noEmit
     src/lib/format.test.ts(24,18): error TS2552: Cannot find name
     'formatMonth'. Did you mean 'formatAmount'?
     src/lib/format.test.ts(25,18): error TS2552: Cannot find name
     'formatMonth'. Did you mean 'formatAmount'?
     src/lib/format.test.ts(29,25): error TS2552: Cannot find name
     'formatMonth'. Did you mean 'formatAmount'?
     src/lib/format.test.ts(30,25): error TS2552: Cannot find name
     'formatMonth'. Did you mean 'formatAmount'?

● Update(src\lib\format.test.ts)
⎿  Added 1 line, removed 1 line
1 import assert from "node:assert/strict";
2 import { describe, it } from "node:test";
3 -import { formatAmount, formatDate, formatNumber, formatPercent } - from "./format.ts";  
 3 +import { formatAmount, formatDate, formatMonth, formatNumber, fo
+rmatPercent } from "./format.ts";  
 4  
 5 const NBSP = " ";
6

● Between-edits again; the import is in place now. Next, the typed crash-table
module with the copy's Czech labels.

● Write(src\data\crashes.ts)
⎿  Wrote 48 lines to src\data\crashes.ts
1 // Crash table for "Co se stane po nákupu" (docs/copy.md section
6, step 2).
2 // Numbers come from data/crashes.json (DECISIONS.md D10); Czech
text is verbatim from docs/copy.md.
3 // Locked file for the parallel agents: ask before changing it.
4
5 import crashesJson from "../../data/crashes.json" with { type: "
json" };
6 import { formatMonth, formatPercent } from "../lib/format.ts";
7
… +41 lines (ctrl+o to expand)

● Write(src\data\crashes.test.ts)
⎿  Wrote 20 lines to src\data\crashes.test.ts
1 import assert from "node:assert/strict";
2 import { describe, it } from "node:test";
3 import { CRASH_ROWS } from "./crashes.ts";
4
5 const NBSP = " ";
6 const MINUS = "−";
7
8 describe("CRASH_ROWS", () => {
9 it("matches the table in docs/copy.md", () => {
10 assert.deepEqual(
… +10 lines (ctrl+o to expand)

● Also noting in copy.md where the table's numbers live now, then the full
checks.

● Update(docs\copy.md)
⎿  Added 2 lines
120 1. **První dny a týdny.** Hodnota se mění každý den. Výkyvy o
pár procent jsou běžné a nic neznamenají. Nemusíte dělat nic.
121 2. **První větší pokles.** Přijde dřív nebo později. Takhle vy
padaly ty největší za posledních 25 let:
122  
 123 + (Numbers: `data/crashes.json`, rendered by `src/data/crashe
          +s.ts`.)  
 124 +  
 125 | Období | Pokles | Zpátky na původní úroveň |
126 |---|---|---|
127 | 2022 (inflace) | −24 % | prosinec 2023 |

Ran 1 shell command (ctrl+o to expand)

● I've made all four changes on chore/skeleton. Typecheck, lint, all 29 tests
and the build pass.

1. VUAA's largest companies: found, so I kept the line. Vanguard's VUAA
   factsheet (data as at 30. 9. 2026, the same PDF data/ucits-funds.json already
   cites) lists the top 10 holdings: NVIDIA 8,4 %, Apple 7,4 %, Microsoft 5,8 %,
   Alphabet 5,5 %, Amazon 3,7 % and so on. I added all 10 to the data file, and
   the card line is now built from the top 3. The factsheet spells it "NVIDIA"
   while the copy had "Nvidia", so I used the factsheet spelling and updated
   docs/copy.md to match.

2. Card footnote: changed. It now reads "…factsheety Vanguard k 30. 9. 2026,
   iShares k 26. 10. 2026…". Both dates come from data/. If the Vanguard funds
   ever end up with different dates, the build fails instead of showing a wrong
   one. The disclaimer in section 8 has the same problem: it says "Údaje o
   fondech k 30. 9. 2026" for all funds, and AOR's data is from 26. 10. Should I
   change it the same way?

3. Visitor skips the picker: the form is now always shown. There is a new
   "skipped" state, so when the picker isn't finished the form still opens and
   sends no fund. Its heading reuses the guide's title, První 3 roky s ETF, which
   is already approved copy, so I didn't write new Czech. I added that heading
   to docs/copy.md too.

4. Crash table: moved into data/crashes.json with its source, kept separate
   from the Czech labels. The rows are tested to render exactly like the table in
   docs/copy.md. To match it, Czech number formatting now uses a proper minus
   sign (−24 %) and can format a month ("prosinec 2023"). One gap: nothing
   records the date the crash data was retrieved, so the file has no date.

DIRECT_URL: thanks, I'll treat it as set. docs/STATUS.md still says it's
missing; /end-session will update that.

Proposed commits (one per change; I saved each step's files so they split
cleanly):

1. chore: add VUAA top holdings to fund data: holdings data, card line, test,
   copy.md
2. fix: date card footnote per fund issuer: footnote, test, copy.md
3. feat: open lead form when picker is skipped: new state, form, wiring,
   request type, copy.md
4. chore: move crash table numbers to data: crash data and table module with
   test, minus sign and month formatting with tests, copy.md

Shall I commit these four?

> yes, commit

Ran 2 shell commands (ctrl+o to expand)

● All four commits are in, on chore/skeleton, and the working tree is clean:

bb97417 chore: move crash table numbers to data
a948ba2 feat: open lead form when picker is skipped
20ab6d0 fix: date card footnote per fund issuer
cb98c50 chore: add VUAA top holdings to fund data
bbb921c chore: project skeleton and data contract

I built each commit from the files exactly as they were when I checked that
step: typecheck and tests for each, plus lint for the form change. The last
commit's files are the same as the version where typecheck, lint, all tests
and the build passed.

Two open points:

- Disclaimer date: section 8 still says "Údaje o fondech k 30. 9. 2026" for
  all funds, but AOR's data is from 26. 10. 2026. Do you want it dated per
  issuer like the card footnote?
- Next step for you: push the branch and merge it before you start the agents,
  so their worktrees branch from it. The folder ownership from my earlier
  summary still applies.

> Date it per issuer like the card footnote

Ran 1 shell command (ctrl+o to expand)

● It's not pushed yet, so I'll add this to chore/skeleton. Both texts will share
one helper for the issuer dates.

● Update(src\data\etfs.ts)
⎿  Added 9 lines, removed 2 lines
189 return [...dates][0];
190 }
191  
 192 -/** Small text under every card (docs/copy.md). Each issuer's
-date comes from data/. \*/  
 192 +/** "Vanguard k 30. 9. 2026, iShares k 26. 10. 2026": each iss
+uer's data date from data/. _/  
 193 +const ISSUER_DATES = `Vanguard k ${formatDate(vanguardAsOf())}
          +, iShares k ${formatDate(US_FUNDS.AOR.asOf)}`;  
 194 +  
 195 +/\*\* Small text under every card (docs/copy.md). _/  
 196 export const RESULT_FOOTNOTE =
194 - `Ceny jsou závěrečné z předchozího obchodního dne. Údaje o f
          -ondech: factsheety Vanguard k ${formatDate(vanguardAsOf())}, i
          -Shares k ${formatDate(US_FUNDS.AOR.asOf)}. Nejde o investiční 
          -doporučení.`;  
 197 + `Ceny jsou závěrečné z předchozího obchodního dne. Údaje o f
          +ondech: factsheety ${ISSUER_DATES}. Nejde o investiční doporuč
          +ení.`;  
 198  
 199 +/** Disclaimer above the sources and footer (docs/copy.md sect
+ion 8). \*/  
 200 +export const DISCLAIMER =  
 201 + `Nejde o investiční doporučení ani daňové poradenství. Strán
          +ka srovnává veřejně dostupné údaje o fondech. Hodnota investic
          +e může klesat i růst a minulé výnosy nezaručují budoucí. Údaje
          + o fondech: ${ISSUER_DATES}. Ceny z předchozího obchodního dne
          +. Daňová pravidla podle zákona č.${NBSP}586/1992 Sb. ve znění 
          +pro rok 2026.`;  
 202 +  
 203 /** Price line: "Cena: [price] EUR (Xetra, [date])". Hidden wh
en there is no snapshot. \*/
204 export const PRICE_LINE = { label: "Cena", venue: "Xetra" } as
const;
205 export const ISIN_LABEL = "ISIN";

● Update(src\data\etfs.test.ts)
⎿  Added 1 line, removed 1 line
1 import assert from "node:assert/strict";
2 import { describe, it } from "node:test";
3 -import { getResult, getResultId, RESULT_FOOTNOTE, RESULTS } from - "./etfs.ts";  
 3 +import { DISCLAIMER, getResult, getResultId, RESULT_FOOTNOTE, RE
+SULTS } from "./etfs.ts";  
 4  
 5 const NBSP = " ";
6

● Update(src\data\etfs.test.ts)
⎿  Added 8 lines
57 );
58 });
59  
 60 + it("dates the disclaimer per issuer from data/", () => {  
 61 + assert.ok(  
 62 + DISCLAIMER.includes(  
 63 + `Údaje o fondech: Vanguard k 30.${NBSP}9.${NBSP}2026, i
         +Shares k 26.${NBSP}10.${NBSP}2026. Ceny z předchozího obchodníh
         +o dne.`,  
 64 + ),  
 65 + );  
 66 + });  
 67 +  
 68 it("getResult returns the full result for the answers", () =>
{
69 assert.equal(getResult("gte3", "wait").id, "world");
70 assert.equal(getResult("lt3", "buy").kind, "not-yet");

● Update(docs\copy.md)
⎿  Added 1 line, removed 1 line
149  
 150 - Heading: **Fond máte. Teď už jen vědět, co čekat.**
151 - Button: **Chci průvodce zdarma** (scrolls to the form)
152 -- Disclaimer: Nejde o investiční doporučení ani daňové poraden
-ství. Stránka srovnává veřejně dostupné údaje o fondech. Hodno
-ta investice může klesat i růst a minulé výnosy nezaručují bud
-oucí. Údaje o fondech k 30. 9. 2026, ceny z předchozího obchod
-ního dne. Daňová pravidla podle zákona č. 586/1992 Sb. ve zněn
-í pro rok 2026.  
 152 +- Disclaimer: Nejde o investiční doporučení ani daňové poraden
+ství. Stránka srovnává veřejně dostupné údaje o fondech. Hodno
+ta investice může klesat i růst a minulé výnosy nezaručují bud
+oucí. Údaje o fondech: Vanguard k [30. 9. 2026], iShares k [26
+. 10. 2026]. Ceny z předchozího obchodního dne. Daňová pravidl
+a podle zákona č. 586/1992 Sb. ve znění pro rok 2026. (Dates f
+rom `asOf` in `data/`; built as `DISCLAIMER` in `src/data/etfs
          +.ts`.)  
 153 - Sources: Vanguard (factsheety VWCE, VUAA, V60A, VT, VOO) · i
Shares (AOR) · Alpha Vantage (ceny) · Nařízení (EU) č. 1286/20
14 · Zákon č. 586/1992 Sb.
154 - Footer: Demo projekt pro výběrové řízení · Ochrana osobních
údajů
155

Ran 1 shell command (ctrl+o to expand)

● The disclaimer is now dated per issuer, the same way as the card footnote.
Typecheck, lint, all 30 tests and the build pass. Nothing is committed yet.

The new disclaimer reads (dates come from data/):

▎ …minulé výnosy nezaručují budoucí. Údaje o fondech: Vanguard k 30. 9. 2026,
▎ iShares k 26. 10. 2026. Ceny z předchozího obchodního dne. Daňová pravidla
▎ podle zákona č. 586/1992 Sb. ve znění pro rok 2026.

To fit two dates, I made one wording change to the approved copy: "Údaje o
fondech k 30. 9. 2026, ceny z předchozího obchodního dne" became two
sentences. A comma after the iShares date would have run straight into the
prices clause. Tell me if you want it phrased differently.

The full disclaimer is now a ready-made text in src/data/etfs.ts, so whoever
builds the footer uses it as is, with no hardcoded date. Both texts take the
dates from one shared helper.

Changed files:

- src/data/etfs.ts: the new disclaimer text and the date helper it shares with
  the card footnote.
- src/data/etfs.test.ts: a test that the disclaimer shows both dates.
- docs/copy.md: section 8 disclaimer updated to the new wording.

Proposed commit: fix: date disclaimer per fund issuer (36 chars). Shall I
commit it?

> that's fits. Commit

Ran 1 shell command (ctrl+o to expand)

● The disclaimer change is committed as a94c00c fix: date disclaimer per fund
issuer, and the working tree is clean.

chore/skeleton now holds all 6 commits and is ready. Push it and merge it into
master before you start the agents, so their worktrees start from the
skeleton.

> /end-session
> Ran 1 shell command (ctrl+o to expand)

● Write(docs\STATUS.md)
⎿  Added 20 lines, removed 28 lines
1 # Status (handover between sessions)
2  
 3 -Overwritten by `/end-session`. Last update: 30. 10. 2026, end o
-f session 02 (design direction + review gaps).  
 3 +Overwritten by `/end-session`. Last update: 30. 10. 2026, end o
+f session 03 (skeleton + data contract for parallel agents).  
 4  
 5 -## Production (prvnietf.cz, `master` = a6c623a)  
 6 -- Next.js 16 starter on Vercel; `prvnietf.cz` → 308 → `www`. Re
-send `mail.prvnietf.cz` verified. PostHog EU cookieless via `/r
         -9t`, verified (one test event `utm_source=claude_test`, filter
-it out).  
 7 -- frontend-design plugin v1.1.1 enabled at project scope (942b3
-87). Not yet seen in a session's skill list: check it loads at
-the start of the next session.  
 5 +## Production (prvnietf.cz, `master` = 9fc8db9)  
 6 +- Still the Next.js starter page. PostHog EU cookieless via `/r
         +9t` and Resend `mail.prvnietf.cz` work (see session 01/02).  
 7  
 9 -## Branch `docs/design-and-gaps` (7 commits 3c9db9a..4bbd464, n
-ot pushed)  
 10 -- `docs/design.md` (design direction; read before any UI work)
-+ `CLAUDE.md` pointers.  
 11 -- `ads/` (4 PNGs + `ad-a.md`, `ad-b.md`), `docs/soukromi.md`, u
-pdated `docs/copy.md`, `public/` PDF guide + cover + og-image,
-README conversion + A/B section.  
 8 +## Branch `chore/skeleton` (6 commits bbb921c..a94c00c + handov
+er docs, not pushed)  
 9 +- Verified locally: typecheck, lint, 30 tests, `npm run build`; + `next start` renders hero A / B (`?v=b`) / A for unknown `v`, +`lang="cs"`, Q1 under the hero. No 390 px screenshot yet (secti
+ons are placeholders).  
 10 +- Data contract: `src/data/etfs.ts` (picker questions, `getResu
         +ltId`, 3 fund pairs + `not-yet`, `SKIPPED_PICKER`, `RESULT_FOOT
         +NOTE`, `DISCLAIMER`), `src/data/crashes.ts` ← `data/crashes.jso
         +n`. VUAA top holdings added to `data/ucits-funds.json` (factshe
+et 30. 9. 2026).  
 11 +- `src/lib/format.ts`: Czech numbers, %, amounts, dates, months
+, typographic minus.  
 12 +- Prisma 7.10.1 (pinned; npm `latest` is an 8.0 RC) + `@prisma/
         +adapter-neon`; `prisma/schema.prisma` (Lead incl. `unsubscribed
         +At`, FundSnapshot), `prisma.config.ts` (migrations on `DIRECT_U
         +RL`, `.env.local` via `loadEnvFile`), `src/lib/db.ts` (lazy `ge
         +tDb()`), client generated to `src/generated/` on `postinstall`
+(gitignored). **No migration run yet.**  
 13 +- Components (placeholders, typed props): Hero (+ HeroFallback)
+, Picker (`onResult`), ResultCard, AfterPurchase, LeadForm (`co
         +ntext: FormContext`) + `submitLead.ts`, Analytics (+ `variant.t
         +s`), Funnel (wiring, locked).  
 14 +- Layout: Bricolage (latin-ext, opsz), metadata from copy.md. `
         +globals.css` tokens; neutrals sampled from the ads: night `#101
         +91b`, ink `#14181f`, mist `#dadedf`, paper white, ink-muted `#4
         +94c51`.  
 15 +- `CLAUDE.md` has a "Parallel agents" section: locked files, no + installs, agents commit on their own branch without approval,
+never push.  
 16  
 13 -## Decisions (session 02)  
 14 -- **Neutral base:** hero follows its ad (A dark, B light); belo
-w the hero light for both. Sample exact neutrals from the ads w
-hen building the hero.  
 15 -- **Unsubscribe: implement.** `Lead.unsubscribedAt DateTime?` (
-cleared on re-submit); `/odhlasit?id=…&t=HMAC-SHA256(id, UNSUBS
         -CRIBE_SECRET)`; unsubscribes only on a POST button, never on GE
-T (mail scanners prefetch); `List-Unsubscribe` + `List-Unsubscr
         -ibe-Post` headers.  
 16 -- **Cron fits Hobby:** daily only, ±59 min ([docs](https://verc
-el.com/docs/cron-jobs/usage-and-pricing)); 300 s max with Fluid - compute ([docs](https://vercel.com/docs/functions/limitations#
-max-duration)). 9 requests × 15 s ≈ 140 s → `export const maxDu
         -ration = 300`. Manual runs share 25/day (max one extra full run
-). Fallback: 2–3 daily cron entries.  
 17 -- **Sender:** `pruvodce@mail.prvnietf.cz` (`noreply@` only in t
-he test route, which gets deleted).  
 18 -  
 19 -## Not done / known gaps  
 20 -- Prisma not installed; `page.tsx` is the starter; `/admin`, fu
-nnel events after `$pageview` not built.  
 21 -- `src/app/api/send/route.ts` is an unprotected test route; del
-ete when `/api/lead` exists.  
 22 -- Env: `RESEND_API_KEY` is Production only; no `DIRECT_URL` (us
-e `DATABASE_URL_UNPOOLED`); `UNSUBSCRIBE_SECRET` to add.  
 23 -  
 17 ## Next steps
25 -1. Prisma: `Lead` (incl. `unsubscribedAt`) + `FundSnapshot`, fi
-rst migration.  
 26 -2. Hero, picker, result cards (`docs/copy.md`, `data/`, `docs/d
         -esign.md`), with `track()`.  
 27 -3. Form → `/api/lead` → email (`pruvodce@`, unsubscribe link +
-headers) → `/dekujeme`; `/odhlasit`; remove test route.  
 28 -4. Alpha Vantage cron + fallback (`maxDuration = 300`; first ve
-rify Fluid compute is on, read only).  
 29 -5. Timeline, explainer, social proof, footer, `/soukromi`.  
 30 -6. `/admin` (cut first if short on time).  
 31 -7. README (check claims match what's built, e.g. A/B heroes "al
-ready built"), `ai-log/`, submission email.  
 18 +1. User: push `chore/skeleton`, merge, then start the agents fr
+om `master`.  
 19 +2. Parallel agents (ownership): **picker** → `Picker/`, `Result
         +Card/`; **lead** → `LeadForm/`, `api/lead`, delete `api/send`, +`dekujeme/`, `odhlasit/`, first Prisma migration; **analytics/A
+-B** → `Analytics/`, `Hero/`, `src/lib/analytics.ts`, `attribut
         +ion*`.  
 20 +3. Unassigned: AfterPurchase (use `src/data/crashes.ts`), socia
+l proof, explainer, second CTA + disclaimer (`DISCLAIMER`) + so
+urces + footer, `/soukromi`.  
 21 +4. Alpha Vantage cron → FundSnapshot → pass `prices` to `<Funne
         +l>` in `page.tsx` (now `{}`; price lines hidden). `maxDuration 
         += 300`.  
 22 +5. `/admin`, README, `ai-log/`, submission email.  
 23  
 24 ## Open questions for the user
25 - Czech copy for the `/odhlasit` confirmation page.
35 -- `docs/soukromi.md`: contact e-mail, IČO (optional), retention - period; CHECK lines (Neon region, Resend data location). Unsub
-scribe line → "odkazem v každém e-mailu".  
 36 -- PDF guide content not reviewed by Claude (tax/crash figures).
37 -- No consent banner (confirm with GDPR owner); PostHog web anal
-ytics domains; Vercel Hobby is non-commercial (D14).  
 26 +- `docs/soukromi.md`: contact e-mail, IČO, retention; CHECK lin
+es (Neon region, Resend data location).  
 27 +- `data/crashes.json` has no retrieval date (D10 doesn't record + it).  
 28 +- PDF guide content not reviewed by Claude; no consent banner (
+GDPR owner); Vercel Hobby is non-commercial (D14).  
 29 +- Env: user says `DIRECT_URL` exists in Vercel (not verified by + Claude). `RESEND_API_KEY` Production only; `UNSUBSCRIBE_SECRET
         +` to add.

● Bash(cat >> NOTES-ai.md <<'EOF'…)
⎿  Updated NOTES-ai.md (+80 -55)
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
 … 98 more lines (ctrl+o to expand)

● Handover written. Running the checks:

Ran 1 shell command (ctrl+o to expand)

● I've rewritten the handover and added the session notes. Typecheck, lint, the
30 tests and the build all pass.

Uncommitted changes:

- docs/STATUS.md: rewritten for session 03. It covers what's on
  chore/skeleton, agent ownership, next steps and open questions.
- NOTES-ai.md: new "Session 03" entry listing what was built (with commit
  hashes), the mistakes and how each was caught, and the decisions.

Proposed commit: docs: add session 03 handover

Proposed DECISIONS.md entries (not added yet):

- D23. Parallel agents work only in their own folders.
  - Decision: shared files are locked: the data files, page.tsx, layout.tsx,
    globals.css, Funnel, format.ts, db.ts, the Prisma schema and package.json.
    Agents commit on their own branch without per-commit approval and never
    push.
  - Why: three agents in parallel worktrees would otherwise get merge
    conflicts in the same few files. Funnel is the only place where the
    picker, result card and form are connected.
- D24. Prisma 7.10.1 with the Neon adapter, pinned exactly.
  - Decision: no ws and no dotenv; the client is generated on install and not
    committed.
  - Why: npm's latest for Prisma is an 8.0 release candidate. Node 22+ has
    WebSocket built in, and Node can load .env.local itself.

Proposed "Known pitfalls" lines for CLAUDE.md:

- When a change spans files (renaming a prop, adding a function), edit the
  definition before its callers, or the edit hook reports type errors in
  between.
- Never run python - in Bash: it waits for input and hangs. Use Edit/Write, or
  node with a script file.
- Write scripts that contain regexes or backslashes with the Write tool, not a
  Bash heredoc; Git Bash changes the backslashes.
- Check npm view <pkg> dist-tags before installing: latest can be a release
  candidate (Prisma 8.0). Pin an exact stable version.
- docs/STATUS.md can be wrong about env vars: it said DIRECT_URL was missing,
  but you say it exists in Vercel. Check Vercel's env settings before relying
  on STATUS.

Skills or hooks: none proposed. You didn't have to correct the same kind of
thing twice. The repeated type errors from editing in the wrong order were my
own and are covered by the first pitfall line.

Do you want me to commit the handover, add D23/D24, and add any of the pitfall
lines?

After that:

1. Run /export and save the transcript as
   ai-log/03-skeleton-and-data-contract.md (commit: docs: add ai log 03).
2. Push chore/skeleton, open the PR and merge it before you start the agents.

> Do you want me to commit the handover, add D23/D24, and add any of the
> pitfall lines? - YES

Ran 1 shell command (ctrl+o to expand)

● Bash(cat >> DECISIONS.md <<'EOF'…)
⎿  Updated DECISIONS.md (+126 -118)
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
 … 204 more lines (ctrl+o to expand)

● Update(CLAUDE.md)
⎿  Added 5 lines
89 - Chip colours with white text are under 4.5:1: white only for
large text, dark text on `#e0a526`.
90 - The session-start git snapshot can be stale. Trust `git statu
          s`, not the reminder.
91 - Commits: **summary line only**, one concern per commit. If `p
          ackage.json` mixes concerns, stage only the relevant lines.
92 +- A change across files (rename a prop, add a function): edit t
+he **definition before its callers**, or the edit hook reports
+type errors in between.  
 93 +- Never run `python -` in Bash: it waits on stdin and hangs. Us
+e Edit/Write, or `node` with a script file.  
 94 +- Scripts with regexes or backslashes: write them with the Writ
+e tool, not a Bash heredoc (Git Bash mangles backslashes).  
 95 +- Check `npm view <pkg> dist-tags` before installing: `latest`
+can be a release candidate (Prisma 8.0). Pin an exact stable ve
+rsion.  
 96 +- `docs/STATUS.md` can be wrong about env vars (it said `DIRECT
         +_URL` was missing): check Vercel's env settings before relying
+on it.

Ran 1 shell command (ctrl+o to expand)

● I committed all three, and the working tree is clean:

5f1c25d docs: add session 03 pitfalls
25538e8 docs: record parallel agents and prisma decisions
7536257 docs: add session 03 handover

- Handover: docs/STATUS.md and the session 03 entry in NOTES-ai.md.
- Decisions: D23 (parallel agents own folders, shared files locked) and D24
  (Prisma 7.10.1 with the Neon adapter, pinned) are in DECISIONS.md.
- Pitfalls: all 5 lines are added under "Known pitfalls" in CLAUDE.md.

chore/skeleton now has 9 commits and nothing is pushed. Two things left for
you:

1. Run /export and save the transcript as
   ai-log/03-skeleton-and-data-contract.md (commit: docs: add ai log 03).
2. Push chore/skeleton, open the PR and merge it before you start the parallel
   agents.
