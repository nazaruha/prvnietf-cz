import type { AdVersion } from "@/lib/attribution";

// Owner: analytics/A-B agent. Copy from docs/copy.md "1. Hero".
// Variant A = dark (Ad A), variant B = light (Ad B); see docs/design.md "Neutral base".

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

export type HeroProps = {
  variant: AdVersion;
};

/** The page's only <h1>. Placeholder styling. */
export function Hero({ variant }: HeroProps) {
  const { headline, subline } = VARIANTS[variant];
  const tone = variant === "a" ? "bg-night text-paper" : "bg-paper text-ink";

  return (
    <header className={`${tone} px-gutter pt-8 pb-6`}>
      <p className="text-sm">{LABEL}</p>
      <h1 className="mt-3 text-4xl leading-none font-extrabold">{headline}</h1>
      <p className="mt-3">{subline}</p>
    </header>
  );
}

/**
 * Static shell shown while the variant (from searchParams) streams in. Keeps the hero's
 * height and shows no headline, so variant B visitors never see A's headline flash.
 */
export function HeroFallback() {
  return <header aria-hidden className="bg-paper min-h-48 px-gutter pt-8 pb-6" />;
}
