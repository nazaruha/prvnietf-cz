import { createHash, timingSafeEqual } from "node:crypto";

// Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`.

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

/** True only for the exact `Bearer <secret>` header. Constant time; an empty secret never matches. */
export function isAuthorizedCron(header: string | null, secret: string): boolean {
  if (!secret || header === null) return false;
  // Hashing first gives equal-length buffers, so the length of the secret doesn't leak either.
  return timingSafeEqual(digest(header), digest(`Bearer ${secret}`));
}
