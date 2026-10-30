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
      <section aria-labelledby="second-cta" className="bg-night pt-12 pb-14 text-paper md:py-20">
        {/* Wide: heading on the left, the button at the right end of the band. */}
        <div className="page-container md:flex md:items-end md:justify-between md:gap-12">
          <h2
            id="second-cta"
            className="max-w-prose text-4xl leading-[0.95] font-extrabold tracking-tight text-balance md:text-6xl"
          >
            {HEADING}
          </h2>
          <a
            href={`#${LEAD_FORM_ID}`}
            className="mt-8 inline-flex min-h-tap shrink-0 items-center rounded-full bg-cta px-7 text-lg font-extrabold text-cta-ink focus-visible:outline-paper md:mt-0 md:h-14 md:px-9"
          >
            {BUTTON}
          </a>
        </div>
      </section>
      <div className="page-container space-y-4 pt-8 pb-6 text-xs leading-relaxed text-ink-muted md:grid md:grid-cols-2 md:gap-12 md:space-y-0 md:pt-10">
        <p className="max-w-prose">{DISCLAIMER}</p>
        <p className="max-w-prose">{SOURCES}</p>
      </div>
    </>
  );
}
