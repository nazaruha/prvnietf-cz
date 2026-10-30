import { Suspense } from "react";
import { AfterPurchase } from "@/components/AfterPurchase/AfterPurchase";
import { Analytics } from "@/components/Analytics/Analytics";
import { getHeroVariant } from "@/components/Analytics/variant";
import { Explainer } from "@/components/Explainer/Explainer";
import { Funnel } from "@/components/Funnel/Funnel";
import { Hero, HeroFallback } from "@/components/Hero/Hero";
import { SocialProof } from "@/components/SocialProof/SocialProof";

// Section order from docs/project.md "Page structure". Locked for the parallel agents.

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <>
      {/* searchParams is request data: under cacheComponents it must sit inside Suspense. */}
      <Suspense fallback={<HeroFallback />}>
        <VariantHero searchParams={searchParams} />
      </Suspense>
      <main className="flex-1">
        {/* TODO(cron): pass the latest FundSnapshot prices; until then every price line is hidden. */}
        <Funnel prices={{}} />
        <SocialProof />
        <AfterPurchase />
        <Explainer />
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
