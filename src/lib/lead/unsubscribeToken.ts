import { createHmac, timingSafeEqual } from "node:crypto";

// Signed /odhlasit links (DECISIONS.md D21). The token carries the lead id, never the email:
// the URL ends up in PostHog's $pageview. No expiry: an unsubscribe link must keep working.

const PURPOSE = "unsubscribe";

function signature(leadId: string, secret: string): string {
  return createHmac("sha256", secret).update(`${PURPOSE}:${leadId}`).digest("base64url");
}

/** `<leadId>.<HMAC-SHA256>`, safe in a URL. */
export function signUnsubscribeToken(leadId: string, secret: string): string {
  if (!secret) throw new Error("Unsubscribe secret is empty");
  return `${leadId}.${signature(leadId, secret)}`;
}

/** The lead id if the token is genuine, otherwise null. Compares in constant time. */
export function verifyUnsubscribeToken(token: string, secret: string): string | null {
  if (!secret) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;

  const leadId = token.slice(0, dot);
  const given = Buffer.from(token.slice(dot + 1));
  const expected = Buffer.from(signature(leadId, secret));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  return leadId;
}
