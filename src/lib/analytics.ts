import posthog from "posthog-js";
import { emptyAttribution, readAttribution, type Attribution } from "./attribution";

// Funnel from docs/project.md. Its `page_view` step is PostHog's automatic `$pageview`.
export type FunnelEvent =
  | "picker_q1"
  | "picker_q2"
  | "result_shown"
  | "form_viewed"
  | "form_started"
  | "form_submitted"
  | "pdf_downloaded";

type EventProperties = Record<string, string | number | boolean | null>;

// Kept in memory only: cookieless mode stores nothing on the device.
let carried: Attribution = emptyAttribution();

/** Attribution for the current URL, falling back to what earlier pages in this tab had. */
export function currentAttribution(): Attribution {
  carried = readAttribution(new URLSearchParams(window.location.search), carried);
  return carried;
}

/** Sends a funnel event. Attribution is added to every event in instrumentation-client.ts. */
export function track(event: FunnelEvent, properties?: EventProperties): void {
  posthog.capture(event, properties);
}
