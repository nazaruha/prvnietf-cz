// Ad attribution (`v` + `utm_*`) for analytics events.
// Analytics runs cookieless, so nothing survives a full page load except the URL:
// these helpers read attribution from the URL and carry it into redirect URLs.

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];
export type AdVersion = "a" | "b";

export type Attribution = {
  ad_version: AdVersion | null;
  hero_variant: AdVersion;
} & Record<UtmKey, string | null>;

export function emptyAttribution(): Attribution {
  return readAttribution(new URLSearchParams());
}

function parseAdVersion(value: string | null): AdVersion | null {
  return value === "a" || value === "b" ? value : null;
}

/**
 * Reads attribution from the URL. Values missing from the URL fall back to
 * `carried`, so a client-side navigation to a page without params keeps them.
 * Hero variant B only for `?v=b`; no param or `?v=a` shows A (docs/project.md).
 */
export function readAttribution(
  search: URLSearchParams,
  carried?: Attribution,
): Attribution {
  const adVersion = parseAdVersion(search.get("v")) ?? carried?.ad_version ?? null;
  const pick = (key: UtmKey) => search.get(key) || carried?.[key] || null;

  return {
    ad_version: adVersion,
    hero_variant: adVersion === "b" ? "b" : "a",
    utm_source: pick("utm_source"),
    utm_medium: pick("utm_medium"),
    utm_campaign: pick("utm_campaign"),
    utm_content: pick("utm_content"),
    utm_term: pick("utm_term"),
  };
}

/**
 * Adds `v` and `utm_*` to a same-site path, keeping its own params,
 * e.g. `/dekujeme?etf=VWCE` → `/dekujeme?etf=VWCE&v=b&utm_source=facebook`.
 */
export function withAttribution(path: string, attribution: Attribution): string {
  // The base only lets URL parse a relative path; it never appears in the result.
  const url = new URL(path, "https://prvnietf.cz");

  if (attribution.ad_version) url.searchParams.set("v", attribution.ad_version);
  for (const key of UTM_KEYS) {
    const value = attribution[key];
    if (value) url.searchParams.set(key, value);
  }

  return `${url.pathname}${url.search}${url.hash}`;
}
