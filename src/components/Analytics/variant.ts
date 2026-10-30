import { readAttribution, type AdVersion } from "@/lib/attribution";

// Owner: analytics/A-B agent. Server-side A/B helper for the hero.

export type PageSearchParams = Record<string, string | string[] | undefined>;

/** Hero variant from the page's searchParams: B only for `?v=b`, otherwise A (docs/project.md). */
export function getHeroVariant(searchParams: PageSearchParams): AdVersion {
  const v = searchParams.v;
  const params = new URLSearchParams(typeof v === "string" ? { v } : {});
  return readAttribution(params).hero_variant;
}
