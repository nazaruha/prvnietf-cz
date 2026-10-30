import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CRASH_ROWS } from "./crashes.ts";

const NBSP = " ";
const MINUS = "−";

describe("CRASH_ROWS", () => {
  it("matches the table in docs/copy.md", () => {
    assert.deepEqual(
      CRASH_ROWS.map(({ period, drawdown, recovered }) => [period, drawdown, recovered]),
      [
        ["2022 (inflace)", `${MINUS}24${NBSP}%`, `prosinec${NBSP}2023`],
        ["2020 (covid)", `${MINUS}19${NBSP}%`, `červenec${NBSP}2020`],
        ["2007–2009 (finanční krize)", `${MINUS}51${NBSP}%`, `březen${NBSP}2012`],
        ["2000–2002 (dot-com)", `${MINUS}45${NBSP}%`, `listopad${NBSP}2006`],
      ],
    );
  });
});
