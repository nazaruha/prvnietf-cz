"use client";

// Owner: analytics/A-B agent. Mounted once on the page, renders nothing.
// Place for page-level tracking that no section owns. Funnel events go through
// track() from src/lib/analytics.ts; PostHog itself starts in src/instrumentation-client.ts.

/** Stub. */
export function Analytics() {
  return null;
}
