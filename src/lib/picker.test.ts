import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { INITIAL_PICKER_STATE, pickerReducer, pickerResult, type PickerState } from "./picker.ts";

const afterQ1: PickerState = pickerReducer(INITIAL_PICKER_STATE, { type: "answerHorizon", horizon: "gte3" });

describe("pickerReducer", () => {
  it("starts on question 1 with no answers and no result", () => {
    assert.deepEqual(INITIAL_PICKER_STATE, { step: "horizon", horizon: null, reaction: null });
    assert.equal(pickerResult(INITIAL_PICKER_STATE), null);
  });

  it("moves to question 2 after the first answer, still without a result", () => {
    assert.deepEqual(afterQ1, { step: "reaction", horizon: "gte3", reaction: null });
    assert.equal(pickerResult(afterQ1), null);
  });

  it("gives the result after both answers", () => {
    const done = pickerReducer(afterQ1, { type: "answerReaction", reaction: "wait" });
    assert.equal(pickerResult(done), "world");
  });

  it("lets the visitor change the second answer", () => {
    const first = pickerReducer(afterQ1, { type: "answerReaction", reaction: "wait" });
    const changed = pickerReducer(first, { type: "answerReaction", reaction: "buy" });
    assert.equal(pickerResult(changed), "sp500");
  });

  it("goes back to question 1, keeps the first answer and clears the result", () => {
    const done = pickerReducer(afterQ1, { type: "answerReaction", reaction: "sell" });
    const back = pickerReducer(done, { type: "back" });
    assert.deepEqual(back, { step: "horizon", horizon: "gte3", reaction: null });
    assert.equal(pickerResult(back), null);
  });

  it("ignores an answer to question 2 while question 1 is shown", () => {
    const state = pickerReducer(INITIAL_PICKER_STATE, { type: "answerReaction", reaction: "buy" });
    assert.equal(state, INITIAL_PICKER_STATE);
  });

  it("asks question 2 also under 3 years and then shows not-yet", () => {
    const q2 = pickerReducer(INITIAL_PICKER_STATE, { type: "answerHorizon", horizon: "lt3" });
    assert.equal(q2.step, "reaction");
    const done = pickerReducer(q2, { type: "answerReaction", reaction: "buy" });
    assert.equal(pickerResult(done), "not-yet");
  });
});
