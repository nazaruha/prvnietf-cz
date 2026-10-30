// Data contract for the picker and the result cards.
// Fund facts come from data/*.json (the source of truth, with sources and dates);
// Czech text is verbatim from docs/copy.md. Components read only from here.
// Locked file for the parallel agents: ask before changing it.

import usFundsJson from "../../data/us-funds.json" with { type: "json" };
import ucitsFundsJson from "../../data/ucits-funds.json" with { type: "json" };
import { formatDate, formatNumber, formatPercent } from "../lib/format.ts";

const NBSP = " ";

// ---------- Picker ----------

export type Horizon = "lt3" | "gte3";
export type Reaction = "sell" | "wait" | "buy";
export type ResultId = "not-yet" | "mix60" | "world" | "sp500";

export type Question<T extends string> = {
  step: string;
  text: string;
  options: ReadonlyArray<{ value: T; label: string }>;
};

export const HORIZON_QUESTION: Question<Horizon> = {
  step: "Otázka 1 ze 2",
  text: "Jak dlouho chcete peníze nechat investované?",
  options: [
    { value: "lt3", label: "Méně než 3 roky" },
    { value: "gte3", label: "3 roky a víc" },
  ],
};

export const REACTION_QUESTION: Question<Reaction> = {
  step: "Otázka 2 ze 2",
  text: `Představte si, že vaše investice za rok klesne o 30${NBSP}%. Co uděláte?`,
  options: [
    { value: "sell", label: "Prodám, nechci přijít o víc" },
    { value: "wait", label: "Nechám to být a počkám" },
    { value: "buy", label: "Přikoupím, je to sleva" },
  ],
};

export const PICKER_BACK_LABEL = "← Zpět";

/** Picker mapping from docs/project.md. Under 3 years the answer to question 2 doesn't matter. */
export function getResultId(horizon: Horizon, reaction: Reaction): ResultId {
  if (horizon === "lt3") return "not-yet";
  switch (reaction) {
    case "sell":
      return "mix60";
    case "wait":
      return "world";
    case "buy":
      return "sp500";
  }
}

// ---------- Funds ----------

export type UsTicker = "VOO" | "VT" | "AOR";
export type UcitsTicker = "VWCE" | "VUAA" | "V60A";

export type UsFund = {
  ticker: UsTicker;
  name: string;
  /** Fraction, 0.0003 = 0,03 %. Net of any fee waiver. */
  ter: number;
  /** TER before a temporary fee waiver, if there is one (AOR). */
  terGross?: number;
  asOf: string;
  source: string;
};

export type UcitsFund = {
  ticker: UcitsTicker;
  name: string;
  isin: string;
  /** Alpha Vantage symbol for the price, e.g. "VWCE.DEX". */
  avSymbol: string;
  tradingCurrency: "EUR";
  ter: number;
  income: "accumulating" | "distributing";
  asOf: string;
  retrieved: string;
  source: string;
};

/** End-of-day price from the FundSnapshot table. `null` until the cron has stored one. */
export type FundPrice = {
  ticker: UcitsTicker | UsTicker;
  price: number;
  currency: "EUR" | "USD";
  /** Trading day, "YYYY-MM-DD". */
  asOf: string;
  source: "Alpha Vantage";
};

function toUsFund(ticker: UsTicker, raw: (typeof usFundsJson)[UsTicker]): UsFund {
  return {
    ticker,
    name: raw.name,
    ter: raw.ter,
    terGross: "terGross" in raw ? raw.terGross : undefined,
    asOf: raw.asOf,
    source: raw.source,
  };
}

function toUcitsFund(ticker: UcitsTicker, raw: (typeof ucitsFundsJson)[UcitsTicker]): UcitsFund {
  if (raw.tradingCurrency !== "EUR") throw new Error(`${ticker}: unexpected currency ${raw.tradingCurrency}`);
  if (raw.income !== "accumulating" && raw.income !== "distributing") {
    throw new Error(`${ticker}: unexpected income type ${raw.income}`);
  }
  return {
    ticker,
    name: raw.name,
    isin: raw.isin,
    avSymbol: raw.avSymbol,
    tradingCurrency: raw.tradingCurrency,
    ter: raw.ter,
    income: raw.income,
    asOf: raw.asOf,
    retrieved: raw.retrieved,
    source: raw.source,
  };
}

export const US_FUNDS: Record<UsTicker, UsFund> = {
  VOO: toUsFund("VOO", usFundsJson.VOO),
  VT: toUsFund("VT", usFundsJson.VT),
  AOR: toUsFund("AOR", usFundsJson.AOR),
};

export const UCITS_FUNDS: Record<UcitsTicker, UcitsFund> = {
  VWCE: toUcitsFund("VWCE", ucitsFundsJson.VWCE),
  VUAA: toUcitsFund("VUAA", ucitsFundsJson.VUAA),
  V60A: toUcitsFund("V60A", ucitsFundsJson.V60A),
};

// ---------- Results ----------

/** One labelled line on the card, e.g. { label: "Dividendy", value: "automaticky se reinvestují" }. */
export type CardFact = { label: string; value: string };

export type FundResult = {
  kind: "fund";
  id: Exclude<ResultId, "not-yet">;
  title: string;
  us: UsFund;
  ucits: UcitsFund;
  /** Text before the US ticker: "Známý americký fond **VT** → …". */
  usLead: string;
  /** Text between the arrow and the UCITS ticker: "… → evropská verze: **VUAA**". */
  ucitsLead: string;
  /** Only for AOR → V60A (never call it a twin). */
  similarTypeLabel?: string;
  /** "Roční poplatek (TER)" with the UCITS TER and the US comparison in brackets. */
  ter: { label: string; value: string; comparison: string };
  /** Dividends + the fund-specific line (contents, top companies, allocation). */
  facts: CardFact[];
  whyItFits: { label: string; text: string };
  note?: string;
};

export type NotYetResult = {
  kind: "not-yet";
  id: "not-yet";
  title: string;
  text: string;
  formLeadIn: string;
};

export type PickerResult = FundResult | NotYetResult;

/** The visitor reached the form (e.g. via the second CTA) without finishing the picker. */
export type SkippedPicker = { kind: "skipped"; id: "skipped" };

export const SKIPPED_PICKER: SkippedPicker = { kind: "skipped", id: "skipped" };

/** What the lead form is shown for: a picker result, or a skipped picker. */
export type FormContext = PickerResult | SkippedPicker;

export const RESULT_HEADER = "Lidé s podobnými odpověďmi obvykle volí:";

/** Data date shared by all Vanguard funds; fails loudly if a factsheet update makes them differ. */
function vanguardAsOf(): string {
  const dates = new Set([US_FUNDS.VOO.asOf, US_FUNDS.VT.asOf, ...Object.values(UCITS_FUNDS).map((f) => f.asOf)]);
  if (dates.size !== 1) throw new Error(`Vanguard funds have different data dates: ${[...dates].join(", ")}`);
  return [...dates][0];
}

/** "Vanguard k 30. 9. 2026, iShares k 26. 10. 2026": each issuer's data date from data/. */
const ISSUER_DATES = `Vanguard k ${formatDate(vanguardAsOf())}, iShares k ${formatDate(US_FUNDS.AOR.asOf)}`;

/** Small text under every card (docs/copy.md). */
export const RESULT_FOOTNOTE =
  `Ceny jsou závěrečné z předchozího obchodního dne. Údaje o fondech: factsheety ${ISSUER_DATES}. Nejde o investiční doporučení.`;

/** Disclaimer above the sources and footer (docs/copy.md section 8). */
export const DISCLAIMER =
  `Nejde o investiční doporučení ani daňové poradenství. Stránka srovnává veřejně dostupné údaje o fondech. Hodnota investice může klesat i růst a minulé výnosy nezaručují budoucí. Údaje o fondech: ${ISSUER_DATES}. Ceny z předchozího obchodního dne. Daňová pravidla podle zákona č.${NBSP}586/1992 Sb. ve znění pro rok 2026.`;

/** Price line: "Cena: [price] EUR (Xetra, [date])". Hidden when there is no snapshot. */
export const PRICE_LINE = { label: "Cena", venue: "Xetra" } as const;
export const ISIN_LABEL = "ISIN";

const TER_LABEL = "Roční poplatek (TER)";

function terComparison(us: UsFund): string {
  const net = `${us.ticker}: ${formatPercent(us.ter, 2)}`;
  return us.terGross === undefined ? net : `${net} po dočasné slevě, bez ní ${formatPercent(us.terGross, 2)}`;
}

function dividendsFact(ucits: UcitsFund): CardFact {
  // docs/copy.md has text only for accumulating funds, and all three are accumulating.
  if (ucits.income !== "accumulating") throw new Error(`${ucits.ticker}: no approved copy for distributing funds`);
  return { label: "Dividendy", value: "automaticky se reinvestují" };
}

function fundTer(ucits: UcitsFund, us: UsFund): FundResult["ter"] {
  return { label: TER_LABEL, value: formatPercent(ucits.ter, 2), comparison: terComparison(us) };
}

// "Obsahuje: 3 821 firem, USA 62 %, Japonsko 6 %, Tchaj-wan 3,5 %": country names and decimals as in docs/copy.md.
const VWCE_COUNTRIES = [
  ["United States", "USA", 0],
  ["Japan", "Japonsko", 0],
  ["Taiwan", "Tchaj-wan", 1],
] as const;

function vwceContents(): string {
  const raw = ucitsFundsJson.VWCE;
  const countries = VWCE_COUNTRIES.map(
    ([key, label, decimals]) => `${label} ${formatPercent(raw.topCountries[key], decimals)}`,
  );
  return [`${formatNumber(raw.numberOfStocks)} firem`, ...countries].join(", ");
}

// "Největší firmy: NVIDIA, Apple, Microsoft": the three largest holdings, names as in data/.
function vuaaTopCompanies(): string {
  return ucitsFundsJson.VUAA.topHoldings
    .slice(0, 3)
    .map(([name]) => name)
    .join(", ");
}

function v60aComposition(): string {
  const { equity, bonds } = ucitsFundsJson.V60A.targetAllocation;
  return `zhruba ${formatPercent(equity)} akciových a ${formatPercent(bonds)} dluhopisových fondů Vanguard`;
}

const VWCE = UCITS_FUNDS.VWCE;
const VUAA = UCITS_FUNDS.VUAA;
const V60A = UCITS_FUNDS.V60A;

export const RESULTS: { "not-yet": NotYetResult } & Record<FundResult["id"], FundResult> = {
  world: {
    kind: "fund",
    id: "world",
    title: "Celý svět v jednom fondu",
    us: US_FUNDS.VT,
    ucits: VWCE,
    usLead: "Známý americký fond",
    ucitsLead: "evropská verze, kterou koupíte u běžných brokerů:",
    ter: fundTer(VWCE, US_FUNDS.VT),
    facts: [dividendsFact(VWCE), { label: "Obsahuje", value: vwceContents() }],
    whyItFits: {
      label: "Proč se hodí",
      text: "Nečekáte rychlé peníze a pokles vás nerozhodí. Jeden fond, široké rozložení, nic dalšího neřešíte.",
    },
    note: "Evropská verze je o něco dražší. Platíte za to, že ji jako drobný investor v EU běžně koupíte.",
  },
  sp500: {
    kind: "fund",
    id: "sp500",
    title: "500 největších firem v USA",
    us: US_FUNDS.VOO,
    ucits: VUAA,
    usLead: "Známý americký fond",
    ucitsLead: "evropská verze:",
    ter: fundTer(VUAA, US_FUNDS.VOO),
    facts: [
      dividendsFact(VUAA),
      { label: "Největší firmy", value: vuaaTopCompanies() },
    ],
    whyItFits: {
      label: "Proč se hodí",
      text: "Poklesy berete jako příležitost. Fond je soustředěnější než celý svět – víc USA, víc technologií, větší výkyvy.",
    },
  },
  mix60: {
    kind: "fund",
    id: "mix60",
    title: `Klidnější mix: 60${NBSP}% akcie, 40${NBSP}% dluhopisy`,
    us: US_FUNDS.AOR,
    ucits: V60A,
    usLead: "Podobný americký fond",
    ucitsLead: "evropský fond podobného typu:",
    similarTypeLabel: "podobný typ fondu, ne přesná obdoba",
    ter: fundTer(V60A, US_FUNDS.AOR),
    facts: [dividendsFact(V60A), { label: "Složení", value: v60aComposition() }],
    whyItFits: {
      label: "Proč se hodí",
      text: "Pokles by vás lákal prodat. Dluhopisy výkyvy tlumí, takže je snazší vydržet.",
    },
  },
  "not-yet": {
    kind: "not-yet",
    id: "not-yet",
    title: "Na ETF je teď možná brzy",
    text: "Když peníze budete potřebovat do 3 let, pokles se nemusí stihnout vrátit. A při prodeji dřív než za 3 roky můžete platit daň ze zisku. Na krátkou dobu se obvykle hodí spořicí účet nebo termínovaný vklad.",
    formLeadIn: "Až budete připraveni, průvodce se vám bude hodit.",
  },
};

export function getResult(horizon: Horizon, reaction: Reaction): PickerResult {
  return RESULTS[getResultId(horizon, reaction)];
}
