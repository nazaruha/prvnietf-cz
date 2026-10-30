import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getResult, getResultId, RESULTS } from "./etfs.ts";

const NBSP = " ";

describe("getResultId", () => {
  it("sends everyone under 3 years to not-yet, whatever the second answer", () => {
    assert.equal(getResultId("lt3", "sell"), "not-yet");
    assert.equal(getResultId("lt3", "wait"), "not-yet");
    assert.equal(getResultId("lt3", "buy"), "not-yet");
  });

  it("maps the reaction to a drop for 3 years and more", () => {
    assert.equal(getResultId("gte3", "sell"), "mix60");
    assert.equal(getResultId("gte3", "wait"), "world");
    assert.equal(getResultId("gte3", "buy"), "sp500");
  });
});

describe("RESULTS", () => {
  it("pairs each US fund with its UCITS fund (docs/project.md)", () => {
    assert.deepEqual(
      [RESULTS.mix60, RESULTS.world, RESULTS.sp500].map((r) => [r.us.ticker, r.ucits.ticker]),
      [["AOR", "V60A"], ["VT", "VWCE"], ["VOO", "VUAA"]],
    );
  });

  it("builds the TER lines from data/ as worded in docs/copy.md", () => {
    assert.equal(RESULTS.world.ter.value, `0,14${NBSP}%`);
    assert.equal(RESULTS.world.ter.comparison, `VT: 0,06${NBSP}%`);
    assert.equal(RESULTS.sp500.ter.comparison, `VOO: 0,03${NBSP}%`);
    assert.equal(
      RESULTS.mix60.ter.comparison,
      `AOR: 0,15${NBSP}% po dočasné slevě, bez ní 0,20${NBSP}%`,
    );
  });

  it("builds the VWCE contents, VUAA companies and V60A composition lines from data/", () => {
    const value = (id: "world" | "sp500" | "mix60", label: string) =>
      RESULTS[id].facts.find((f) => f.label === label)?.value;
    assert.equal(value("sp500", "Největší firmy"), "NVIDIA, Apple, Microsoft");
    assert.equal(value("world", "Obsahuje"), `3${NBSP}821 firem, USA 62${NBSP}%, Japonsko 6${NBSP}%, Tchaj-wan 3,5${NBSP}%`);
    assert.equal(value("mix60", "Složení"), `zhruba 60${NBSP}% akciových a 40${NBSP}% dluhopisových fondů Vanguard`);
  });

  it("labels only AOR → V60A as a similar type of fund", () => {
    assert.equal(RESULTS.mix60.similarTypeLabel, "podobný typ fondu, ne přesná obdoba");
    assert.equal(RESULTS.world.similarTypeLabel, undefined);
    assert.equal(RESULTS.sp500.similarTypeLabel, undefined);
  });

  it("getResult returns the full result for the answers", () => {
    assert.equal(getResult("gte3", "wait").id, "world");
    assert.equal(getResult("lt3", "buy").kind, "not-yet");
  });
});
