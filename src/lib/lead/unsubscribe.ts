import { getDb } from "@/lib/db";
import { verifyUnsubscribeToken } from "./unsubscribeToken";

// Shared by the /odhlasit button (server action) and the one-click POST /api/odhlasit.
// Only ever called from a POST: mail scanners open GET links on their own (CLAUDE.md pitfalls).

export type UnsubscribeResult = "done" | "invalid" | "error";

export async function unsubscribe(token: string): Promise<UnsubscribeResult> {
  const secret = process.env.UNSUBSCRIBE_SECRET;
  if (!secret) {
    console.error("Unsubscribe failed: UNSUBSCRIBE_SECRET is not set");
    return "error";
  }

  const leadId = verifyUnsubscribeToken(token, secret);
  if (!leadId) return "invalid";

  try {
    // updateMany: idempotent, and a deleted lead isn't an error (nothing left to unsubscribe).
    await getDb().lead.updateMany({
      where: { id: leadId, unsubscribedAt: null },
      data: { unsubscribedAt: new Date() },
    });
    return "done";
  } catch (error) {
    console.error(`Unsubscribe failed: ${error instanceof Error ? error.name : "unknown error"}`);
    return "error";
  }
}
