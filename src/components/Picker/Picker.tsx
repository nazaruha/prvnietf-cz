"use client";

import { HORIZON_QUESTION, type ResultId } from "@/data/etfs";

// Owner: picker agent. Questions, answers and the mapping come from src/data/etfs.ts
// (HORIZON_QUESTION, REACTION_QUESTION, PICKER_BACK_LABEL, getResultId).
// Tracks `picker_q1` and `picker_q2` with track() from src/lib/analytics.ts.

export type PickerProps = {
  /** Called with the result once both questions are answered, and with null when the visitor goes back. */
  onResult: (result: ResultId | null) => void;
};

/** Placeholder: shows question 1 only. */
export function Picker({ onResult }: PickerProps) {
  void onResult;

  return (
    <section aria-labelledby="picker-q1" className="px-gutter py-6">
      <p className="text-sm text-ink-muted">{HORIZON_QUESTION.step}</p>
      <h2 id="picker-q1" className="mt-1 text-xl font-bold">
        {HORIZON_QUESTION.text}
      </h2>
    </section>
  );
}
