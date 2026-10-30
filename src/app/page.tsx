import { Suspense } from "react";
import { AfterPurchase } from "@/components/AfterPurchase/AfterPurchase";
import { Analytics } from "@/components/Analytics/Analytics";
import { getHeroVariant } from "@/components/Analytics/variant";
import { Funnel } from "@/components/Funnel/Funnel";
import { Hero, HeroFallback } from "@/components/Hero/Hero";
import { getFundPrices } from "@/lib/prices/getFundPrices";

// Section order from docs/project.md "Page structure". Locked for the parallel agents.

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <>
      {/* searchParams is request data: under cacheComponents it must sit inside Suspense. */}
      <Suspense fallback={<HeroFallback />}>
        <VariantHero searchParams={searchParams} />
      </Suspense>
      <main className="flex-1">
        <PricedFunnel />
        {/* TODO: social proof strip (docs/copy.md section 5) */}
        <AfterPurchase />
        {/* TODO: explainer "Proč evropská verze" (section 7) */}
        {/* TODO: second CTA, disclaimer, sources (section 8) */}
      </main>
      {/* TODO: footer (section 8) */}
      <Analytics />
    </>
  );
}

async function VariantHero({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  return <Hero variant={getHeroVariant(await searchParams)} />;
}

/** Prices from the daily FundSnapshot cache ("use cache"), so this stays in the static shell. */
async function PricedFunnel() {
  return <Funnel prices={await getFundPrices()} />;
}
