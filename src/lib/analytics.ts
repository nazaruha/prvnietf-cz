import posthog from "posthog-js";
import type { Horizon, Reaction, ResultId } from "@/data/etfs";
import { emptyAttribution, readAttribution, type AdVersion, type Attribution } from "./attribution";

// Funnel from docs/project.md. Its `page_view` step is PostHog's automatic `$pageview`.
// `form_attempted` = submit clicked (before /api/lead); `form_submitted` only after `{ ok: true }`.
export type FunnelEvent =
  | "picker_q1"
  | "picker_q2"
  | "result_shown"
  | "form_viewed"
  | "form_started"
  | "form_attempted"
  | "form_submitted"
  | "pdf_downloaded";

type EventProperties = Record<string, string | number | boolean | null>;

// Events with a fixed shape; the rest take any flat properties.
type TypedProperties = {
  picker_q1: { answer: Horizon };
  picker_q2: { answer: Reaction; result?: ResultId };
  result_shown: { result: ResultId };
};

export type FunnelEventProperties<E extends FunnelEvent> = E extends keyof TypedProperties
  ? TypedProperties[E]
  : EventProperties;

// Kept in memory only: cookieless mode stores nothing on the device.
let carried: Attribution = emptyAttribution();

/** Attribution for the current URL, falling back to what earlier pages in this tab had. */
export function currentAttribution(): Attribution {
  carried = readAttribution(new URLSearchParams(window.location.search), carried);
  return carried;
}

/**
 * Hero variant of the current visitor: B only for `?v=b` (kept across client-side
 * navigation), otherwise A. Browser only: call it in effects or event handlers.
 */
export function getVariant(): AdVersion {
  return currentAttribution().hero_variant;
}

/**
 * Sends a funnel event. Attribution is added to every event in instrumentation-client.ts.
 * Without the PostHog token, PostHog never starts and this does nothing.
 */
export function track<E extends FunnelEvent>(
  event: E,
  ...[properties]: E extends keyof TypedProperties
    ? [properties: FunnelEventProperties<E>]
    : [properties?: FunnelEventProperties<E>]
): void {
  // Before init, posthog.capture() logs a console error on every call.
  if (!posthog.__loaded) return;
  posthog.capture(event, properties);
}
