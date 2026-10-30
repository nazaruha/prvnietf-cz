"use server";

import { unsubscribe, type UnsubscribeResult } from "@/lib/lead/unsubscribe";

export type UnsubscribeState = UnsubscribeResult | "idle";

/** The /odhlasit button. A server action is a POST, so mail scanners opening the link change nothing. */
export async function unsubscribeAction(_previous: UnsubscribeState, formData: FormData): Promise<UnsubscribeState> {
  const token = formData.get("token");
  return unsubscribe(typeof token === "string" ? token : "");
}
