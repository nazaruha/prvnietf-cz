import { LEAD_FORM_ID } from "@/components/LeadForm/anchor";
import { DISCLAIMER } from "@/data/etfs";

// Second CTA, disclaimer and sources (docs/copy.md section 8).
// The dark band echoes Ad A; the small print sits on the light base below it.
// copy.md gives no URLs for the sources, so they are plain text, not links.

const NBSP = " ";

const HEADING = "Fond máte. Teď už jen vědět, co čekat.";
const BUTTON = "Chci průvodce zdarma";
const SOURCES = [
  "Vanguard (factsheety VWCE, VUAA, V60A, VT, VOO)",
  "iShares (AOR)",
  "Alpha Vantage (ceny)",
  `Nařízení (EU) č.${NBSP}1286/2014`,
  `Zákon č.${NBSP}586/1992 Sb.`,
].join(" · ");

export function SecondCta() {
  return (
    <>
      <section aria-labelledby="second-cta" className="bg-night px-gutter pt-12 pb-14 text-paper">
        <h2
          id="second-cta"
          className="max-w-prose text-4xl leading-[0.95] font-extrabold tracking-tight text-balance"
        >
          {HEADING}
        </h2>
        <a
          href={`#${LEAD_FORM_ID}`}
          className="mt-8 inline-flex min-h-tap items-center rounded-full bg-cta px-7 text-lg font-extrabold text-cta-ink focus-visible:outline-paper"
        >
          {BUTTON}
        </a>
      </section>
      <div className="space-y-4 px-gutter pt-8 pb-6 text-xs leading-relaxed text-ink-muted">
        <p className="max-w-prose">{DISCLAIMER}</p>
        <p className="max-w-prose">{SOURCES}</p>
      </div>
    </>
  );
}
