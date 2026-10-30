# Decisions

Where the brief was unclear, or research changed an assumption, the decision and the reason are logged here.

## D1. Task B, not task A
- **Decision:** the landing page (B).
- **Why:** it plays to my Next.js/React experience and gives a deployable result. Marketing was new to me, so I learned the basics (audience, pain points, lead magnet, message match) during planning.

## D2. "Drobný investor" = an ordinary person investing their own money
- **Decision:** the main audience is a Czech retail investor, about 25–45, who has heard of ETFs but doesn't know which one to start with and is unsure what happens after buying.
- **Why:** *drobný investor* means retail investor, not "beginner" or "experienced", so the brief leaves experience open. This group is large and fits a page about choosing a first fund. It's also an EU legal category (MiFID II), which is why PRIIPs applies (D4).

## D3. Own angle: "what happens after you buy"
- **Decision:** the page and the lead magnet focus on drops, dividends, taxes and selling after the first purchase.
- **Why:** comparison pages usually stop at "what to buy". The fear of what comes next is a real reason beginners hesitate, and almost nobody answers it.

## D4. Show the NYSE fund next to the European (UCITS) fund you can actually buy
- **Decision:** each result shows a US fund (VT, VOO, AOR) and its UCITS counterpart (VWCE, VUAA, V60A).
- **Why:** the brief asks for NYSE ETFs. Under PRIIPs, most EU brokers don't sell US-domiciled ETFs to retail investors because those funds have no KID.
- **Note:** AOR → V60A is labelled *"podobný typ fondu"*. Different issuer and index, and V60A is actively managed, so it is not a twin.

## D5. A two-question picker, result shown for free
- **Decision:** Q1 = investment horizon, Q2 = reaction to a 30 % drop. Four results, including "zatím ne" for horizons under 3 years.
- **Why:** two taps are fast on mobile, and the questions map to the two biggest fears (losses and taxes). A typical quiz funnel hides the result behind the email; the brief says value must be clear before the form, so the result is free and the email unlocks the next step (the PDF). Gating the result is A/B hypothesis material.

## D6. Lead magnet: PDF "První 3 roky s ETF: co čekat, kdy nic nedělat a jak to bude s daněmi"
- **Decision:** after submit, the thank-you page shows a download button and an email with the same link is sent.
- **Why:** it continues the page's angle. A button instead of an automatic download, because automatic downloads are unreliable on mobile and a click can be tracked.
- **Note:** the original title "Prvních 3 roky" was grammatically wrong and was corrected.

## D7. One-field form plus GDPR consent and a honeypot
- **Decision:** email field, consent checkbox, hidden honeypot field.
- **Why:** each extra field lowers conversion. Consent is required in the EU. The honeypot stops simple bots without a CAPTCHA.

## D8. Social proof uses mock data, clearly labelled
- **Decision:** a small strip with numbers, marked *"Ilustrační data – ukázka"*, driven by an `isMock` flag.
- **Why:** it shows the intended design without deceiving visitors. Before ads launch, it must show real numbers or be removed.

## D9. Data: live where reliable, issuer documents where not
- **Decision:**
  - Alpha Vantage, live: TER for VOO/VT/AOR, and end-of-day prices for all six tickers.
  - Issuer factsheets (30. 9. 2026): UCITS facts (TER, ISIN, fund size, accumulating/distributing).
- **Why:** I checked the Alpha Vantage values against Vanguard and iShares documents:
  - The TERs matched.
  - `net_assets` turned out to be the whole fund, not the ETF.
  - VT holdings lacked non-US companies and contained stale names.
  - VT sectors covered only ~60 %.
  - UCITS profiles came back empty.
  - EODHD's free plan doesn't include fund fundamentals.

## D10. Crash table from real index data
- **Decision:** SPY monthly adjusted closes, 1999–2026:

| Crash | Drop | Back at the previous high |
|---|---|---|
| 2000–02 | −45 % | Nov 2006 |
| 2007–09 | −51 % | Mar 2012 |
| 2020 | −19 % | Jul 2020 |
| 2022 | −24 % | Dec 2023 |

- **Why:** it answers "what if it drops right after I buy" with facts. Month-end data understates intra-month drops (2020 was about −34 % intra-month), and the page says so.

## D11. Czech tax rules as of 2026
- **Decision:** the page and the PDF say a sale is tax-free after 3+ years, or if yearly sale proceeds are ≤ 100 000 Kč (counted as the full sale price, not the profit). Accumulating funds need no dividend reporting.
- **Why:** checked against current sources. The 40M Kč cap from 2025 was removed for securities from 1. 1. 2026 (zákon 360/2025 Sb.). An earlier assumption that the cap still applied was wrong.

## D12. Two ads, two motivations, matching heroes
- **Ad A:** "Které ETF si koupit jako první?" (choice overload).
- **Ad B:** "Koupeno. A co dál?" (fear of what comes after).
- **Why:** they test which pain point drives cheaper leads. Each lands on a hero that repeats its promise; A is the default hero.

## D13. Ad production: AI scene, text in code
- **Decision:** scenes generated in Nano Banana without text. All text, ETF chips and the phone screen added in code. Delivered as 4:5 feed and 9:16 story formats, with text inside Instagram's safe zones.
- **Why:** image models garble Czech diacritics and numbers.
- **Notes:**
  - No company logo, since Meta already shows the advertiser and the brand belongs to Clientelo.
  - The QQQ chip became EUNL because Bricolage's Q is hard to read at large sizes.
  - The phone screen is generic, with no real broker branding.

## D14. Next.js + TypeScript on Vercel
- **Why:**
  - Vercel builds Next.js natively.
  - The brief suggests it.
  - Earlier Cloudflare deploys cost me more time fixing build errors.
- **Caveat:** Vercel Hobby is non-commercial. A real campaign needs Vercel Pro, or Cloudflare Workers via OpenNext, whose free plan allows commercial use.

## D15. Neon Postgres + Prisma for leads, not Google Sheets
- **Why:**
  - At work I've seen how unstructured Sheets data becomes messy and needs defensive code; a typed table with a unique email is cleaner.
  - Neon over Supabase because free Supabase projects pause after about a week of inactivity, and the reviewer may open the demo later.

## D16. Admin page with HTTP Basic Auth
- **Decision:** `/admin` lists leads behind Basic Auth (credentials in Vercel env variables), `noindex`. The reviewer gets the credentials in the submission email.
- **Why:** a full login system is out of scope for a lead page, but the leads must not be public. Basic Auth is demo-level, and the README says so.

## D17. Resend with an own domain
- **Decision:** `prvnietf.cz` (Wedos, no hosting, Wedos DNS + DNSSEC). Emails sent from the `mail.prvnietf.cz` subdomain, with DKIM, SPF and DMARC records.
- **Why:** sending services need a verified domain to reach strangers' inboxes, and the subdomain keeps email reputation separate from the website.

## D18. Optimised for ad message match, not SEO
- **Decision:** basic meta tags only (title, description, Open Graph, `lang="cs"`, one H1, `noindex` on thank-you/privacy/admin pages).
- **Why:** visitors come from paid ads, so search ranking barely matters.

## D19. Bricolage Grotesque
- **Decision:** used for the ads and the page.
- **Why:** compared against Fraunces and Archivo Expanded. It has a confident fintech feel without the default look. The same font on ad and page makes the jump feel seamless.

## D20. No investment or tax advice
- **Decision:** results say what people with similar answers usually choose. A disclaimer is on every result and in the footer.
- **Why:** personal investment recommendations are regulated in Czechia (ČNB).

## D21. Unsubscribe with a signed link
- **Decision:** `unsubscribedAt` on `Lead`, an HMAC-signed `/odhlasit` link that unsubscribes via a POST button, and `List-Unsubscribe` + `List-Unsubscribe-Post` headers on the email.
- **Why:** the consent copy promises one-click unsubscribe, and GDPR Art. 7(3) says withdrawing consent must be as easy as giving it. POST only, because mail scanners open links automatically.

## D22. Hero follows its ad's light or dark tone
- **Decision:** hero A is dark, hero B is light; everything below the hero is light for both variants.
- **Why:** matching the ad's tone makes the click feel continuous (D12), and the rest of the page is reading and form-filling, which is easier as dark text on a light background.

## D23. Parallel agents own folders, shared files are locked
- **Decision:** each parallel agent edits only its assigned folders. The data files, `page.tsx`, `layout.tsx`, `globals.css`, `Funnel`, `format.ts`, `db.ts`, the Prisma schema and `package.json` are locked. Agents commit on their own branch without per-commit approval and never push.
- **Why:** three agents in parallel worktrees would otherwise conflict in the same few files. `Funnel` is the only place where the picker, result card and form are connected, so no agent needs to touch the page.

## D24. Prisma 7.10.1 with the Neon adapter, pinned exactly
- **Decision:** `prisma`, `@prisma/client` and `@prisma/adapter-neon` pinned to 7.10.1; no `ws`, no `dotenv`; the client is generated on install into `src/generated/` and not committed.
- **Why:** npm's `latest` for Prisma is an 8.0 release candidate. Node 22+ has WebSocket built in, and `prisma.config.ts` loads `.env.local` with Node's `loadEnvFile`.
