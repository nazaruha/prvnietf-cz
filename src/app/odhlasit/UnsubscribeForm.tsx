"use client";

import { useActionState } from "react";
import { unsubscribeAction, type UnsubscribeState } from "./actions";
import { UNSUBSCRIBE_COPY } from "./copy";

/** The button, replaced in place by the result. */
export function UnsubscribeForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState<UnsubscribeState, FormData>(unsubscribeAction, "idle");

  if (state === "done" || state === "invalid") {
    return (
      <p role="status" className="mt-8 max-w-prose border-l-4 border-ink pl-3 text-lg font-bold">
        {UNSUBSCRIBE_COPY[state]}
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-8" aria-busy={pending}>
      <input type="hidden" name="token" value={token} />
      {/* Outlined, not the green CTA: unsubscribing isn't the page's main goal (docs/design.md). */}
      <button
        type="submit"
        disabled={pending}
        className="h-tap w-full rounded-full border-2 border-ink px-8 text-lg font-extrabold transition-opacity disabled:cursor-wait disabled:opacity-60 md:w-auto"
      >
        {UNSUBSCRIBE_COPY.button}
      </button>
      <div aria-live="polite">
        {state === "error" && (
          <p className="mt-3 border-l-4 border-chip-red pl-2 text-sm font-bold">{UNSUBSCRIBE_COPY.error}</p>
        )}
      </div>
    </form>
  );
}
