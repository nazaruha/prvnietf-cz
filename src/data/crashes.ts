// Crash table for "Co se stane po nákupu" (docs/copy.md section 6, step 2).
// Numbers come from data/crashes.json (DECISIONS.md D10); Czech text is verbatim from docs/copy.md.
// Locked file for the parallel agents: ask before changing it.

import crashesJson from "../../data/crashes.json" with { type: "json" };
import { formatMonth, formatPercent } from "../lib/format.ts";

export type CrashId = "inflation-2022" | "covid-2020" | "financial-crisis-2007" | "dotcom-2000";

export type CrashRow = {
  id: CrashId;
  /** "2007–2009 (finanční krize)" */
  period: string;
  /** "−51 %" */
  drawdown: string;
  /** "březen 2012" */
  recovered: string;
};

const CAUSES: Record<CrashId, string> = {
  "inflation-2022": "inflace",
  "covid-2020": "covid",
  "financial-crisis-2007": "finanční krize",
  "dotcom-2000": "dot-com",
};

function isCrashId(id: string): id is CrashId {
  return id in CAUSES;
}

export const CRASH_TABLE_HEADERS = ["Období", "Pokles", "Zpátky na původní úroveň"] as const;

/** Rows in the order of docs/copy.md (newest first). */
export const CRASH_ROWS: CrashRow[] = crashesJson.crashes.map((crash) => {
  if (!isCrashId(crash.id)) throw new Error(`No Czech label for crash ${crash.id}`);
  const years = crash.fromYear === crash.toYear ? `${crash.fromYear}` : `${crash.fromYear}–${crash.toYear}`;
  return {
    id: crash.id,
    period: `${years} (${CAUSES[crash.id]})`,
    drawdown: formatPercent(crash.drawdown),
    recovered: formatMonth(crash.recoveredMonth),
  };
});

export const CRASH_TABLE_NOTE =
  "Všechny propady se zatím vrátily – některé za měsíce, jiné za roky. Minulé výnosy ale nezaručují budoucí. Počítáno z měsíčních závěrečných cen, během měsíce byly propady místy hlubší.";

export const CRASH_TABLE_SOURCE = "SPY, měsíční závěrečné ceny v USD vč. dividend (Alpha Vantage).";
