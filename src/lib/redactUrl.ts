import { UNSUBSCRIBE_TOKEN_PARAM } from "./lead/paths.ts";

// Query params that must never reach analytics. The unsubscribe token holds the lead id,
// which the database links to an email.
const PRIVATE_PARAMS = [UNSUBSCRIBE_TOKEN_PARAM];

/** The URL without private params; anything that isn't an absolute URL comes back unchanged. */
export function redactUrl(value: string): string {
  if (!/^https?:\/\//.test(value)) return value;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return value;
  }
  if (!PRIVATE_PARAMS.some((param) => url.searchParams.has(param))) return value;
  for (const param of PRIVATE_PARAMS) url.searchParams.delete(param);
  return url.href;
}

/** Event properties with private params removed from every URL value ($current_url, $referrer, …). */
export function redactUrlProperties(properties: Record<string, unknown>): Record<string, unknown> {
  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(properties)) {
    redacted[key] = typeof value === "string" ? redactUrl(value) : value;
  }
  return redacted;
}
