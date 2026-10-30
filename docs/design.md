# Design direction

Read this before any UI work. Use it together with the frontend-design plugin skill; where they disagree, this file wins.

## Goal

The page must **not** look like a default AI/template page. The reviewer explicitly checks this.

## Continuity with the ads

The page continues the look of the ads in `ads/` (`ad-a-*` = variant A, `ad-b-*` = variant B; `feed-4x5` and `story-9x16` each). Look at the images before any UI work.

What the ads establish:
- Headline: heavy Bricolage, tight leading, left-aligned, top-left of the frame.
- Ticker chips: rounded rectangles in the chip colours, ticker in heavy caps, short index label underneath.
- CTA: green pill with dark text.
- A: dark night scene, white text. B: bright room, near-black text, red-orange accent marks.

## Font

- Bricolage Grotesque only, via `next/font`. Heavy weights for headlines.
- Avoid a capital **Q** in large display text (its tail is detached).

## Colour

- **CTA:** green `#1db474` with dark text `#06281a` (contrast 5.9:1).
- **ETF chips:** `#2f7de1 #e0573f #e0a526 #1f9e8f #3aa65c #d14d8b #6a7bd8`. Fund/ticker chips only, never as decoration.
  - Contrast (from the AA rule below): white text on these is 2.2–4.1:1, so it passes only as **large text** (≥ 24 px, or ≥ 18.7 px bold) and never on `#e0a526`. Use dark text on `#e0a526`. Small labels such as "S&P 500" go in dark text or outside the chip.
- **Neutral base:** the hero follows its ad, so A is dark and B is light. Everything below the hero uses one light base for both variants.
  - Why: D12 pairs each ad with a hero that repeats its promise. Matching the ad's light/dark tone is the cheapest way to make the click feel continuous, and A is the default traffic. The rest (picker result, crash table, form, sources) is reading and form-filling, where dark text on a light background is easier on a phone in daylight.
  - Exact neutral hex values: sample them from the ad backgrounds when building the hero. Don't pick generic defaults.

## Mobile first (390 px)

- Headline + label + picker question 1 visible without scrolling.
- Picker answers are large tap targets, at least 48 px high.

## One goal per page

- No navigation menu.
- One primary CTA style; the green CTA appears only for the main action.

## Numbers

- Tabular figures.
- Every number carries its source + date in small muted text.

## Accessibility

- WCAG AA contrast.
- Visible focus states.
- `prefers-reduced-motion` respected.

## Avoid

- Purple/blue gradients
- Emoji as icons
- Everything centred
- Identical rounded cards with shadows everywhere
- Stock illustrations

## Process

1. Before building a section, describe the visual approach in 3–5 lines and wait for OK.
2. After building it, take a screenshot at 390 px and 1280 px and check it against this file.
