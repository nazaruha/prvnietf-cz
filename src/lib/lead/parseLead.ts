// Server-side check of the POST /api/lead body (docs/project.md "Lead flow").
// Relative imports with extensions, so node --test can load it.

import { UCITS_FUNDS, type UcitsTicker } from "../../data/etfs.ts";
import { UTM_KEYS, type AdVersion, type UtmKey } from "../attribution.ts";
import { CONSENT_TEXT } from "../../components/LeadForm/consent.ts";
import { normalizeEmail, validateLead } from "../../components/LeadForm/validateLead.ts";

/** Longest UTM value stored; anything longer is cut, not rejected. */
const UTM_MAX_LENGTH = 200;

export type ValidLead = {
  email: string;
  fund: UcitsTicker | null;
  adVersion: AdVersion | null;
  utm: Partial<Record<UtmKey, string>>;
};

export type ParsedLead = { kind: "bot" } | { kind: "invalid" } | { kind: "lead"; lead: ValidLead };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isUcitsTicker(value: unknown): value is UcitsTicker {
  return typeof value === "string" && Object.hasOwn(UCITS_FUNDS, value);
}

function parseUtm(value: unknown): Partial<Record<UtmKey, string>> {
  const utm: Partial<Record<UtmKey, string>> = {};
  if (!isRecord(value)) return utm;
  for (const key of UTM_KEYS) {
    const raw = value[key];
    if (typeof raw !== "string") continue;
    const trimmed = raw.trim().slice(0, UTM_MAX_LENGTH);
    if (trimmed) utm[key] = trimmed;
  }
  return utm;
}

/**
 * Bot (honeypot filled), invalid (bad email or no consent), or a clean lead.
 * Attribution is best effort: an unknown fund, ad version or UTM key is dropped, not rejected.
 */
export function parseLead(body: unknown): ParsedLead {
  if (!isRecord(body)) return { kind: "invalid" };
  if (typeof body.website === "string" && body.website.trim() !== "") return { kind: "bot" };

  const email = typeof body.email === "string" ? body.email : "";
  const consent = body.consent === true;
  const errors = validateLead({ email, consent });
  if (errors.email || errors.consent) return { kind: "invalid" };

  return {
    kind: "lead",
    lead: {
      email: normalizeEmail(email),
      fund: isUcitsTicker(body.fund) ? body.fund : null,
      adVersion: body.adVersion === "a" || body.adVersion === "b" ? body.adVersion : null,
      utm: parseUtm(body.utm),
    },
  };
}

/**
 * Columns written on create and on a repeat submit. The consent text is the server's copy,
 * never the client's; a repeat submit is a new consent, so it clears `unsubscribedAt` (D21).
 */
export function leadColumns(lead: ValidLead) {
  return {
    consent: true,
    consentText: CONSENT_TEXT,
    fund: lead.fund,
    adVersion: lead.adVersion,
    utmSource: lead.utm.utm_source ?? null,
    utmMedium: lead.utm.utm_medium ?? null,
    utmCampaign: lead.utm.utm_campaign ?? null,
    utmContent: lead.utm.utm_content ?? null,
    utmTerm: lead.utm.utm_term ?? null,
    unsubscribedAt: null,
  };
}
