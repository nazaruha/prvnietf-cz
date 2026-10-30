"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import {
  HORIZON_QUESTION,
  PICKER_BACK_LABEL,
  REACTION_QUESTION,
  type Question,
  type ResultId,
} from "@/data/etfs";
import { track } from "@/lib/analytics";
import { INITIAL_PICKER_STATE, pickerReducer, pickerResult, type PickerAction } from "@/lib/picker";

// Owner: picker agent. Questions, answers and the mapping come from src/data/etfs.ts;
// the flow (answer, back, change an answer) is the tested reducer in src/lib/picker.ts.
// Tracks `picker_q1` and `picker_q2` with track() from src/lib/analytics.ts.

export type PickerProps = {
  /** Called with the result once both questions are answered, and with null when the visitor goes back. */
  onResult: (result: ResultId | null) => void;
};

/** One question at a time; question 1 sits right under the hero, so the section stays compact. */
export function Picker({ onResult }: PickerProps) {
  const [state, setState] = useState(INITIAL_PICKER_STATE);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const interacted = useRef(false);

  // Move focus to the new question after an answer or "Zpět", never on the first render.
  useEffect(() => {
    if (interacted.current) headingRef.current?.focus();
  }, [state.step]);

  function dispatch(action: PickerAction): ResultId | null {
    interacted.current = true;
    const next = pickerReducer(state, action);
    const result = pickerResult(next);
    setState(next);
    onResult(result);
    return result;
  }

  const isFirst = state.step === "horizon";
  const headingId = isFirst ? "picker-q1" : "picker-q2";

  return (
    <section aria-labelledby={headingId} className="page-container pt-6 pb-8 md:pt-12 md:pb-14">
      <div className="max-w-prose md:max-w-3xl">
        <div className="flex items-center gap-3">
          <p className="text-sm font-semibold text-ink-muted">{(isFirst ? HORIZON_QUESTION : REACTION_QUESTION).step}</p>
          <span aria-hidden className="flex gap-1">
            <span className="h-1.5 w-6 rounded-full bg-ink" />
            <span className={`h-1.5 w-6 rounded-full ${isFirst ? "bg-mist" : "bg-ink"}`} />
          </span>
        </div>

        {isFirst ? (
          <QuestionStep
            id={headingId}
            headingRef={headingRef}
            question={HORIZON_QUESTION}
            selected={state.horizon}
            onAnswer={(horizon) => {
              dispatch({ type: "answerHorizon", horizon });
              track("picker_q1", { answer: horizon });
            }}
          />
        ) : (
          <>
            <QuestionStep
              id={headingId}
              headingRef={headingRef}
              question={REACTION_QUESTION}
              selected={state.reaction}
              onAnswer={(reaction) => {
                const result = dispatch({ type: "answerReaction", reaction });
                track("picker_q2", result ? { answer: reaction, result } : { answer: reaction });
              }}
            />
            <button
              type="button"
              onClick={() => dispatch({ type: "back" })}
              className="mt-3 -ml-2 min-h-tap px-2 text-sm font-semibold text-ink-muted underline-offset-4 hover:text-ink hover:underline"
            >
              {PICKER_BACK_LABEL}
            </button>
          </>
        )}
      </div>
    </section>
  );
}

// Wide screens: answers side by side, one column per answer (class names spelled out for Tailwind).
const ANSWER_COLUMNS: Record<number, string> = { 2: "md:grid-cols-2", 3: "md:grid-cols-3" };

type QuestionStepProps<T extends string> = {
  id: string;
  headingRef: RefObject<HTMLHeadingElement | null>;
  question: Question<T>;
  selected: T | null;
  onAnswer: (value: T) => void;
};

function QuestionStep<T extends string>({ id, headingRef, question, selected, onAnswer }: QuestionStepProps<T>) {
  return (
    <>
      <h2
        id={id}
        ref={headingRef}
        tabIndex={-1}
        className="mt-2 text-2xl leading-tight font-extrabold tracking-tight text-balance focus:outline-none md:text-4xl"
      >
        {question.text}
      </h2>
      <div
        role="group"
        aria-labelledby={id}
        className={`mt-4 flex flex-col gap-2 md:mt-6 md:grid md:gap-3 ${ANSWER_COLUMNS[question.options.length] ?? ""}`}
      >
        {question.options.map((option) => {
          const isSelected = option.value === selected;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onAnswer(option.value)}
              className={`min-h-tap w-full rounded-2xl border-2 border-ink px-4 py-3 text-left text-lg leading-snug font-semibold transition-colors ${
                isSelected ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-mist active:bg-mist"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
