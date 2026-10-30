// PostHog Cloud EU, proxied through our own domain so ad blockers don't drop events.
// The path is deliberately not "/analytics", "/ingest" or "/posthog": blockers match those.
export const POSTHOG_PROXY_PATH = "/r9t";

export const POSTHOG_EU_API_HOST = "https://eu.i.posthog.com";
export const POSTHOG_EU_ASSETS_HOST = "https://eu-assets.i.posthog.com";
export const POSTHOG_EU_UI_HOST = "https://eu.posthog.com";
