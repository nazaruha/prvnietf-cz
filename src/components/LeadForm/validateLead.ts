// Client-side checks before POST /api/lead. The server validates again (docs/project.md "Lead flow").
// Messages verbatim from docs/copy.md "4. Form" → Errors.

export const LEAD_ERRORS = {
  email: "Zkontrolujte prosím e-mail, něco v něm chybí.",
  consent: "Bez souhlasu vám průvodce nemůžeme poslat.",
  server: "Něco se nepovedlo. Zkuste to prosím znovu za chvíli.",
} as const;

export type LeadFieldErrors = { email?: string; consent?: string };

// Pragmatic, not RFC 5322: one @, no spaces, a dot in the domain, a TLD of 2+ letters.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/;

/** Normalised email as it is sent and stored. */
export function normalizeEmail(email: string): string {
  return email.trim();
}

export function isValidEmail(email: string): boolean {
  const normalized = normalizeEmail(email);
  return normalized.length <= 254 && EMAIL_PATTERN.test(normalized);
}

/** Field errors for the form; an empty object means the lead can be sent. */
export function validateLead(input: { email: string; consent: boolean }): LeadFieldErrors {
  const errors: LeadFieldErrors = {};
  if (!isValidEmail(input.email)) errors.email = LEAD_ERRORS.email;
  if (!input.consent) errors.consent = LEAD_ERRORS.consent;
  return errors;
}
