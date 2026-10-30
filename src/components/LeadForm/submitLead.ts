import type { AdVersion, UtmKey } from "@/lib/attribution";
import type { UcitsTicker } from "@/data/etfs";

// Owner: lead agent. Contract for POST /api/lead (docs/project.md "Lead flow"),
// shared by LeadForm and src/app/api/lead/route.ts.

export type LeadPayload = {
  email: string;
  consent: boolean;
  /** UCITS ticker of the shown result; null for "not-yet". */
  fund: UcitsTicker | null;
  adVersion: AdVersion | null;
  utm: Partial<Record<UtmKey, string>>;
  /** Hidden honeypot. Filled = bot: the server answers 200 and stores nothing. */
  website: string;
};

export type LeadResponse = { ok: true } | { ok: false; error: string };

/** Stub: always fails until /api/lead exists. */
export async function submitLead(payload: LeadPayload): Promise<LeadResponse> {
  void payload;
  return { ok: false, error: "not-implemented" };
}
