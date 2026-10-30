"use client";

import type { PickerResult } from "@/data/etfs";

// Owner: lead agent. Copy from docs/copy.md "4. Form"; submits through submitLead.ts.
// Tracks `form_viewed`, `form_started`, and `form_submitted` (only after `{ ok: true }`)
// with track(); redirects with withAttribution() (see CLAUDE.md pitfalls).

export type LeadFormProps = {
  /** The result shown above the form; null before the picker is finished. */
  result: PickerResult | null;
};

/** Anchor id the "scroll to the form" CTAs point at. */
export const LEAD_FORM_ID = "pruvodce";

/**
 * Placeholder: heading only.
 * TODO(copy): docs/copy.md has no heading for a visitor who reaches the form
 * (e.g. via the second CTA) before finishing the picker. Ask the user.
 */
export function LeadForm({ result }: LeadFormProps) {
  const heading =
    result === null
      ? null
      : result.kind === "fund"
        ? `Co vás čeká v prvních 3 letech s ${result.ucits.ticker}?`
        : "Průvodce na dobu, kdy budete připraveni";

  return (
    <section id={LEAD_FORM_ID} aria-label="První 3 roky s ETF" className="px-gutter py-10">
      {heading && <h2 className="text-2xl font-bold">{heading}</h2>}
    </section>
  );
}
