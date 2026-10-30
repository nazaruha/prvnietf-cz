import type { AdVersion } from "@/lib/attribution";

// Copy from docs/copy.md "1. Hero". Visuals continue the ads in ads/ (docs/design.md):
// variant A = Ad A's dark night scene, variant B = Ad B's bright room with red-orange marks.
// Kept compact so the picker's question 1 and its first answer stay above the fold at 390 px.

const LABEL = "2 otázky · 20 vteřin · bez registrace";

const VARIANTS: Record<AdVersion, { headline: string; subline: string }> = {
  a: {
    headline: "Které ETF si koupit jako první?",
    subline:
      "Odpovězte na 2 otázky a uvidíte fond, který se k vám hodí – i s poplatky a tím, jak ho koupit z Česka.",
  },
  b: {
    headline: "Koupeno. A co dál?",
    subline:
      "Poklesy, dividendy, daně. Odpovězte na 2 otázky a uvidíte, co čekat u fondu, který se k vám hodí.",
  },
};

/**
 * Ticker chips like Ad A, limited to the three UCITS funds this page covers. Decorative only
 * (the funds are named in the result card). White text sits only at large bold sizes
 * (>= 24 px, AA large text); amber carries dark text. Shown from `sm` up, where they sit
 * beside the headline instead of pushing question 1 below the fold.
 */
const CHIPS = [
  { ticker: "VWCE", tone: "bg-chip-blue text-paper", tilt: "-rotate-3" },
  { ticker: "VUAA", tone: "bg-chip-amber text-ink", tilt: "rotate-2 translate-x-10" },
  { ticker: "V60A", tone: "bg-chip-teal text-paper", tilt: "-rotate-2 translate-x-3" },
] as const;

/** Shared box so the fallback reserves the hero's height (no layout shift). */
const SHELL = "relative overflow-hidden pt-7 pb-6 min-h-64 sm:min-h-80 sm:pt-12 sm:pb-10 lg:min-h-96 lg:pt-16 lg:pb-14";

export type HeroProps = {
  variant: AdVersion;
};

/** The page's only <h1>. */
export function Hero({ variant }: HeroProps) {
  const { headline, subline } = VARIANTS[variant];
  const isA = variant === "a";

  return (
    <header className={`${SHELL} ${isA ? "bg-night text-paper" : "border-b border-mist bg-paper text-ink"}`}>
      {isA && <ScreenGlow />}
      <div className="page-container relative flex items-start justify-between gap-10">
        <div className="max-w-prose lg:max-w-3xl">
          <p className={`text-sm font-semibold ${isA ? "text-paper/80" : "text-ink-muted"}`}>{LABEL}</p>
          <h1
            className={`mt-3 leading-[0.95] font-extrabold tracking-[-0.03em] text-balance ${
              isA ? "text-[2.5rem] sm:text-6xl lg:text-7xl" : "text-5xl sm:text-7xl lg:text-8xl"
            }`}
          >
            {headline}
            {!isA && <ConfusionMarks />}
          </h1>
          <p className={`mt-4 max-w-[34rem] text-base leading-snug sm:text-lg ${isA ? "text-paper/85" : "text-ink-muted"}`}>
            {subline}
          </p>
        </div>
        {isA && <TickerChips />}
      </div>
    </header>
  );
}

/**
 * Static shell shown while the variant (from searchParams) streams in. Same box as the hero
 * and no headline, so variant B visitors never see A's headline flash.
 */
export function HeroFallback() {
  return <header aria-hidden className={`${SHELL} bg-paper`} />;
}

/** Faint light from a laptop screen, like Ad A's scene. Neutral, not a coloured gradient. */
function ScreenGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -right-24 -bottom-32 size-80 rounded-full bg-paper/[0.06] blur-3xl"
    />
  );
}

function TickerChips() {
  return (
    <div aria-hidden className="hidden shrink-0 flex-col items-start gap-3 pt-6 sm:flex lg:gap-5 lg:pt-4 lg:pr-16">
      {CHIPS.map(({ ticker, tone, tilt }) => (
        <span
          key={ticker}
          className={`${tone} ${tilt} rounded-xl px-4 py-1.5 text-2xl leading-tight font-extrabold tracking-tight shadow-lg shadow-black/30 lg:px-6 lg:py-2.5 lg:text-4xl`}
        >
          {ticker}
        </span>
      ))}
    </div>
  );
}

/** Ad B's red-orange "confusion" arcs, drawn after the question mark. */
function ConfusionMarks() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 36 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      className="ml-1 inline-block h-[0.85em] w-[0.7em] -translate-y-[0.12em] align-top text-chip-red"
    >
      {/* Concentric arcs around a point left of the marks, like the ad's ")))". */}
      <path d="M4.2 20.9 A 10 10 0 0 1 9.8 31.7" />
      <path d="M8.5 11.9 A 20 20 0 0 1 19.7 33.5" />
      <path d="M12.7 2.8 A 30 30 0 0 1 29.5 35.2" />
    </svg>
  );
}
