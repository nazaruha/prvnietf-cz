"use client";

import type { FormContext } from "@/data/etfs";

// Owner: lead agent. Copy from docs/copy.md "4. Form"; submits through submitLead.ts.
// Tracks `form_viewed`, `form_started`, and `form_submitted` (only after `{ ok: true }`)
// with track(); redirects with withAttribution() (see CLAUDE.md pitfalls).

export type LeadFormProps = {
  /** The result shown above the form, or SKIPPED_PICKER when the picker isn't finished. */
  context: FormContext;
};

/** Anchor id the "scroll to the form" CTAs point at. */
export const LEAD_FORM_ID = "pruvodce";

/** Form heading per context (docs/copy.md "4. Form"). */
function headingFor(context: FormContext): string {
  switch (context.kind) {
    case "fund":
      return `Co vás čeká v prvních 3 letech s ${context.ucits.ticker}?`;
    case "not-yet":
      return "Průvodce na dobu, kdy budete připraveni";
    case "skipped":
      return "První 3 roky s ETF";
  }
}

/** Placeholder: heading only. The form is always open, also when the picker was skipped. */
export function LeadForm({ context }: LeadFormProps) {
  return (
    <section id={LEAD_FORM_ID} aria-labelledby="lead-form" className="px-gutter py-10">
      <h2 id="lead-form" className="text-2xl font-bold">
        {headingFor(context)}
      </h2>
    </section>
  );
}
