import type { ReactNode } from "react";
import { LEAD_FORM_ID } from "@/components/LeadForm/anchor";
import { CRASH_ROWS, CRASH_TABLE_HEADERS, CRASH_TABLE_NOTE, CRASH_TABLE_SOURCE } from "@/data/crashes";

// Timeline "Co se stane po nákupu" with the crash table (docs/copy.md section 6).
// Server component: nothing here is interactive. The link is a same-page anchor, so it
// doesn't need withAttribution().

const NBSP = " ";

const HEADING = "Co se stane po nákupu";
const SUBLINE = "Pár věcí, které začátečníky překvapí – a co s nimi.";
const GUIDE_LINK = "Podrobně to máme v průvodci →";

type Step = {
  /** Bold lead-in, e.g. "První dny a týdny." */
  lead: string;
  text: string;
  /** Extra content under the text (the crash table in step 2). */
  extra?: "crashes";
};

const STEPS: Step[] = [
  {
    lead: "První dny a týdny.",
    text: "Hodnota se mění každý den. Výkyvy o pár procent jsou běžné a nic neznamenají. Nemusíte dělat nic.",
  },
  {
    lead: "První větší pokles.",
    text: "Přijde dřív nebo později. Takhle vypadaly ty největší za posledních 25 let:",
    extra: "crashes",
  },
  {
    lead: "Dividendy.",
    text: "U akumulačních fondů (Acc) se dividendy samy reinvestují. Do daňového přiznání je nepíšete.",
  },
  {
    lead: "Po 3 letech.",
    text: `Když fond držíte déle než 3 roky, zisk z prodeje je osvobozený od daně. Prodáte-li dřív, je osvobozený jen tehdy, když vaše prodeje za rok nepřesáhnou 100${NBSP}000${NBSP}Kč. Počítá se celá prodejní cena, ne zisk.`,
  },
  {
    lead: "Pravidelné investování.",
    text: `Většina lidí si nastaví pravidelný nákup, třeba 1${NBSP}000${NBSP}Kč měsíčně, a pak to nechá běžet.`,
  },
];

const HEADING_ID = "after-purchase";
const CRASH_LEAD_ID = "after-purchase-crashes";

export function AfterPurchase() {
  return (
    <section aria-labelledby={HEADING_ID} className="page-container py-12 md:py-20">
      {/* Wide: heading as a sticky left column, the steps and the crash table on the right. */}
      <div className="max-w-prose lg:grid lg:max-w-none lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-8 lg:self-start">
          <h2 id={HEADING_ID} className="text-3xl leading-none font-extrabold tracking-tight text-balance md:text-5xl">
            {HEADING}
          </h2>
          <p className="mt-3 text-lg leading-snug text-ink-muted">{SUBLINE}</p>
        </div>

        <div className="lg:max-w-2xl">
          <ol className="mt-8 lg:mt-1">
            {STEPS.map((step, index) => (
              <TimelineStep
                key={step.lead}
                number={index + 1}
                lead={step.lead}
                text={step.text}
                textId={step.extra === "crashes" ? CRASH_LEAD_ID : undefined}
              >
                {step.extra === "crashes" ? <CrashTable labelledBy={CRASH_LEAD_ID} /> : null}
              </TimelineStep>
            ))}
          </ol>
  
          <a
            href={`#${LEAD_FORM_ID}`}
            className="mt-2 inline-flex min-h-tap items-center text-lg font-bold text-ink underline decoration-2 underline-offset-4 hover:decoration-4"
          >
            {GUIDE_LINK}
          </a>
        </div>
      </div>
    </section>
  );
}

type TimelineStepProps = {
  number: number;
  lead: string;
  text: string;
  /** Id of the text paragraph, so the table below can use it as its label. */
  textId?: string;
  children?: ReactNode;
};

/** One step: ink number marker on a thin vertical rule that runs to the next step. */
function TimelineStep({ number, lead, text, textId, children }: TimelineStepProps) {
  return (
    <li className="group relative pb-8 pl-12">
      <span
        aria-hidden
        className="absolute top-0 left-0 flex size-8 items-center justify-center rounded-full bg-ink text-base font-extrabold text-paper"
      >
        {number}
      </span>
      {/* The rule connects this marker to the next one; the last step has none. */}
      <span aria-hidden className="absolute top-10 bottom-2 left-[15px] w-0.5 bg-mist group-last:hidden" />
      <p id={textId} className="pt-0.5 text-base leading-relaxed">
        <strong className="font-bold">{lead}</strong> {text}
      </p>
      {children}
    </li>
  );
}

const [PERIOD_HEADER, DRAWDOWN_HEADER, RECOVERED_HEADER] = CRASH_TABLE_HEADERS;

/** Crash table from src/data/crashes.ts; labelled by the step text above it. */
function CrashTable({ labelledBy }: { labelledBy: string }) {
  return (
    <div className="mt-4">
      <table aria-labelledby={labelledBy} className="w-full border-collapse text-sm leading-snug tabular-nums">
        <thead>
          <tr className="border-b-2 border-ink text-left align-bottom text-ink-muted">
            <th scope="col" className="pr-2 pb-2 font-semibold">
              {PERIOD_HEADER}
            </th>
            <th scope="col" className="px-2 pb-2 text-right font-semibold">
              {DRAWDOWN_HEADER}
            </th>
            <th scope="col" className="pb-2 pl-2 font-semibold">
              {RECOVERED_HEADER}
            </th>
          </tr>
        </thead>
        <tbody>
          {CRASH_ROWS.map((row) => (
            <tr key={row.id} className="border-b border-mist align-top">
              <th scope="row" className="py-3 pr-2 text-left font-normal">
                {row.period}
              </th>
              <td className="px-2 py-3 text-right font-bold whitespace-nowrap">
                {/* Red accent mark (Ad B); the figure itself stays ink for AA contrast. */}
                <span aria-hidden className="mr-1.5 inline-block h-3 w-1 rounded-full bg-chip-red align-[-1px]" />
                {row.drawdown}
              </td>
              <td className="py-3 pl-2 whitespace-nowrap">{row.recovered}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-sm leading-snug text-ink-muted">{CRASH_TABLE_NOTE}</p>
      <p className="mt-2 text-xs leading-snug text-ink-muted">{CRASH_TABLE_SOURCE}</p>
    </div>
  );
}
