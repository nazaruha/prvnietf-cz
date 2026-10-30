import type { AdVersion, UtmKey } from "@/lib/attribution";
import type { UcitsTicker } from "@/data/etfs";

// Owner: lead agent. Contract for POST /api/lead (docs/project.md "Lead flow"),
// shared by LeadForm and src/app/api/lead/route.ts.

export type LeadPayload = {
  email: string;
  consent: boolean;
  /** UCITS ticker of the shown result; null for "not-yet" and for a skipped picker. */
  fund: UcitsTicker | null;
  adVersion: AdVersion | null;
  utm: Partial<Record<UtmKey, string>>;
  /** Hidden honeypot. Filled = bot: the server answers 200 and stores nothing. */
  website: string;
};

export type LeadResponse = { ok: true } | { ok: false; error: string };

export const LEAD_ENDPOINT = "/api/lead";

function isLeadResponse(value: unknown): value is LeadResponse {
  if (typeof value !== "object" || value === null || !("ok" in value)) return false;
  if (value.ok === true) return true;
  return value.ok === false && "error" in value && typeof value.error === "string";
}

/** Posts the lead. Never throws: network, HTTP and parse failures come back as `{ ok: false }`. */
export async function submitLead(payload: LeadPayload): Promise<LeadResponse> {
  let response: Response;
  try {
    response = await fetch(LEAD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, error: "network" };
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return { ok: false, error: `http-${response.status}` };
  }

  if (!isLeadResponse(body)) return { ok: false, error: `http-${response.status}` };
  if (body.ok && !response.ok) return { ok: false, error: `http-${response.status}` };
  return body;
}
