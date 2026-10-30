"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import {
  ISIN_LABEL,
  PRICE_LINE,
  RESULT_FOOTNOTE,
  RESULT_HEADER,
  type CardFact,
  type FundPrice,
  type FundResult,
  type NotYetResult,
  type PickerResult,
  type UcitsTicker,
} from "@/data/etfs";
import { track } from "@/lib/analytics";
import { formatAmount, formatDate } from "@/lib/format";

// Owner: picker agent. All text and numbers come from `result` (src/data/etfs.ts);
// numbers are formatted with src/lib/format.ts. Hide the price line when `price` is null.
// Tracks `result_shown` with track() from src/lib/analytics.ts.

export type ResultCardProps = {
  result: PickerResult;
  /** Price of the UCITS fund; null when there is no snapshot yet (or for "not-yet"). */
  price: FundPrice | null;
};

// Chip colour per fund, as in ad A (VWCE blue, VUAA indigo). White ticker text is large (≥ 24 px bold).
const CHIP: Record<UcitsTicker, string> = {
  VWCE: "bg-chip-blue",
  VUAA: "bg-chip-indigo",
  V60A: "bg-chip-teal",
};

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function ResultCard({ result, price }: ResultCardProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // The card appears below question 2, often under the fold on a phone: bring it into view
  // and move focus to its heading, so screen readers announce the result.
  useEffect(() => {
    track("result_shown", { result: result.id });
    sectionRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    headingRef.current?.focus({ preventScroll: true });
  }, [result.id]);

  return (
    <section ref={sectionRef} aria-labelledby="result-title" className="page-container scroll-mt-4 pb-10 md:pb-16">
      <div className="max-w-prose border-t-4 border-ink pt-5 md:pt-8 lg:max-w-none">
        {result.kind === "fund" ? (
          <FundCard result={result} price={price} headingRef={headingRef} />
        ) : (
          <NotYetCard result={result} headingRef={headingRef} />
        )}
        <p className="mt-6 text-xs leading-relaxed text-ink-muted">{RESULT_FOOTNOTE}</p>
      </div>
    </section>
  );
}

type HeadingRef = RefObject<HTMLHeadingElement | null>;

function Title({ text, headingRef }: { text: string; headingRef: HeadingRef }) {
  return (
    <h2
      id="result-title"
      ref={headingRef}
      tabIndex={-1}
      className="text-3xl leading-[1.05] font-extrabold tracking-tight text-balance focus:outline-none md:text-5xl"
    >
      {text}
    </h2>
  );
}

function FundCard({ result, price, headingRef }: { result: FundResult; price: FundPrice | null; headingRef: HeadingRef }) {
  const { us, ucits } = result;
  const priceFact: CardFact | null = price && {
    label: PRICE_LINE.label,
    value: `${formatAmount(price.price, price.currency)} (${PRICE_LINE.venue}, ${formatDate(price.asOf)})`,
  };

  // Phone: one column in reading order. Wide: fund and "why it fits" left, the facts right.
  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16">
      <div className="lg:col-start-1 lg:row-start-1">
        <p className="text-sm font-semibold text-ink-muted">{RESULT_HEADER}</p>
        <div className="mt-1">
          <Title text={result.title} headingRef={headingRef} />
        </div>
  
        <p className="mt-4 text-base leading-snug">
          {result.usLead}{" "}
          <span className="rounded-md bg-mist px-1.5 py-0.5 font-extrabold">{us.ticker}</span>
          {" → "}
          {result.ucitsLead}
        </p>
  
        <div className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-2">
          <span
            className={`${CHIP[ucits.ticker]} rounded-xl px-4 py-2 text-3xl leading-none font-extrabold tracking-tight text-paper`}
          >
            {ucits.ticker}
          </span>
          {result.similarTypeLabel && (
            <span className="border-l-4 border-chip-amber pl-2 text-sm font-semibold italic">
              {result.similarTypeLabel}
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-ink-muted">{ucits.name}</p>
      </div>

      <dl className="mt-5 divide-y divide-mist self-start border-y border-mist lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0">
        <FactRow label={result.ter.label}>
          <strong className="font-extrabold">{result.ter.value}</strong>{" "}
          <span className="text-ink-muted">({result.ter.comparison})</span>
        </FactRow>
        {result.facts.map((fact) => (
          <FactRow key={fact.label} label={fact.label}>
            {fact.value}
          </FactRow>
        ))}
        {priceFact && <FactRow label={priceFact.label}>{priceFact.value}</FactRow>}
        <FactRow label={ISIN_LABEL}>
          <span className="font-semibold tracking-wide">{ucits.isin}</span>
        </FactRow>
      </dl>

      <div className="lg:col-start-1 lg:row-start-2">
        <div className="mt-5 border-l-4 border-ink pl-3 lg:mt-8">
          <p className="font-extrabold">{result.whyItFits.label}</p>
          <p className="mt-1 leading-snug">{result.whyItFits.text}</p>
        </div>

        {result.note && <p className="mt-4 text-sm leading-snug text-ink-muted">{result.note}</p>}
      </div>
    </div>
  );
}

function FactRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-0.5 py-2.5 sm:grid-cols-[11rem_1fr] sm:gap-4">
      <dt className="text-sm text-ink-muted">{label}</dt>
      <dd className="leading-snug">{children}</dd>
    </div>
  );
}

function NotYetCard({ result, headingRef }: { result: NotYetResult; headingRef: HeadingRef }) {
  return (
    <div className="max-w-prose">
      <Title text={result.title} headingRef={headingRef} />
      <p className="mt-3 leading-snug">{result.text}</p>
      <p className="mt-4 font-extrabold">{result.formLeadIn}</p>
    </div>
  );
}
