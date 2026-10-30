// Consent copy from docs/copy.md "4. Form". A plain module (not "use client"), so the
// API route can import the text it stores: from a client module it would get a reference.

export const CONSENT_BEFORE_LINK =
  "Souhlasím se zpracováním e-mailu a se zasíláním průvodce a tipů k investování do ETF. Odhlásit se můžu kdykoli.";
export const PRIVACY_LINK = "Zásady ochrany osobních údajů";

/** Consent text as shown, stored with the lead (`consentText`, .claude/rules/copy.md). */
export const CONSENT_TEXT = `${CONSENT_BEFORE_LINK} ${PRIVACY_LINK}`;
