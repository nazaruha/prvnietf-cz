import { createHash, timingSafeEqual } from "node:crypto";

// HTTP Basic Auth for /admin (DECISIONS.md D16). Demo-level protection: the README says so.

export const BASIC_AUTH_CHALLENGE = 'Basic realm="admin", charset="UTF-8"';

// Hashing first gives both sides the same length, so the comparison leaks neither content nor length.
function safeEqual(a: string, b: string): boolean {
  const digest = (value: string) => createHash("sha256").update(value, "utf8").digest();
  return timingSafeEqual(digest(a), digest(b));
}

/**
 * True when the `Authorization` header carries the expected credentials.
 * Missing credentials in env always deny, so an unconfigured deploy never opens /admin.
 */
export function isAuthorized(header: string | null, username: string | undefined, password: string | undefined): boolean {
  if (!username || !password || !header) return false;

  const match = /^Basic\s+([A-Za-z0-9+/=]+)$/i.exec(header.trim());
  if (!match) return false;

  const decoded = Buffer.from(match[1], "base64").toString("utf8");
  const colon = decoded.indexOf(":");
  if (colon < 0) return false;

  // Compare both parts even if the first one fails, so timing doesn't reveal which was wrong.
  const userOk = safeEqual(decoded.slice(0, colon), username);
  const passOk = safeEqual(decoded.slice(colon + 1), password);
  return userOk && passOk;
}
