"use client";

import { useState } from "react";
import { RESULTS, type FundPrice, type ResultId, type UcitsTicker } from "@/data/etfs";
import { LeadForm } from "@/components/LeadForm/LeadForm";
import { Picker } from "@/components/Picker/Picker";
import { ResultCard } from "@/components/ResultCard/ResultCard";

// Wires the picker to the result card and the form. Locked for the parallel agents:
// each of them works inside its own component, never here.

export type FunnelProps = {
  /** Latest UCITS prices from FundSnapshot; a missing ticker hides its price line. */
  prices: Partial<Record<UcitsTicker, FundPrice>>;
};

export function Funnel({ prices }: FunnelProps) {
  const [resultId, setResultId] = useState<ResultId | null>(null);
  const result = resultId ? RESULTS[resultId] : null;
  const price = result?.kind === "fund" ? (prices[result.ucits.ticker] ?? null) : null;

  return (
    <>
      <Picker onResult={setResultId} />
      {result && <ResultCard result={result} price={price} />}
      <LeadForm result={result} />
    </>
  );
}
