import { getResultId, type Horizon, type Reaction, type ResultId } from "../data/etfs.ts";

// Picker state as a pure reducer, so the flow (answer, go back, change an answer) is unit-tested
// without React. Questions, answers and the mapping live in src/data/etfs.ts.

export type PickerStep = "horizon" | "reaction";

export type PickerState = {
  step: PickerStep;
  horizon: Horizon | null;
  reaction: Reaction | null;
};

export type PickerAction =
  | { type: "answerHorizon"; horizon: Horizon }
  | { type: "answerReaction"; reaction: Reaction }
  | { type: "back" };

export const INITIAL_PICKER_STATE: PickerState = { step: "horizon", horizon: null, reaction: null };

export function pickerReducer(state: PickerState, action: PickerAction): PickerState {
  switch (action.type) {
    case "answerHorizon":
      // A new first answer starts question 2 fresh.
      return { step: "reaction", horizon: action.horizon, reaction: null };
    case "answerReaction":
      // Ignore a stray answer to question 2 before question 1 is answered.
      if (state.step !== "reaction" || state.horizon === null) return state;
      return { ...state, reaction: action.reaction };
    case "back":
      // Keep the first answer highlighted so the visitor sees what they chose.
      return { step: "horizon", horizon: state.horizon, reaction: null };
  }
}

/** The result once both questions are answered, otherwise null. */
export function pickerResult(state: PickerState): ResultId | null {
  if (state.horizon === null || state.reaction === null) return null;
  return getResultId(state.horizon, state.reaction);
}
