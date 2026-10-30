import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatAmount, formatDate, formatMonth, formatNumber, formatPercent } from "./format.ts";

const NBSP = " ";

describe("formatNumber", () => {
  it("separates thousands with a non-breaking space", () => {
    assert.equal(formatNumber(3821), `3${NBSP}821`);
    assert.equal(formatNumber(100000), `100${NBSP}000`);
  });

  it("uses a decimal comma", () => {
    assert.equal(formatNumber(3.5, 1), "3,5");
  });

  it("uses a typographic minus", () => {
    assert.equal(formatNumber(-24), "−24");
  });
});

describe("formatMonth", () => {
  it("names the month in Czech", () => {
    assert.equal(formatMonth("2023-12"), `prosinec${NBSP}2023`);
    assert.equal(formatMonth("2012-03"), `březen${NBSP}2012`);
  });

  it("rejects anything that isn't an ISO month", () => {
    assert.throws(() => formatMonth("2023-13"));
    assert.throws(() => formatMonth("2023-12-01"));
  });
});

describe("formatPercent", () => {
  it("formats TERs from data/ as in docs/copy.md", () => {
    assert.equal(formatPercent(0.0014, 2), `0,14${NBSP}%`);
    assert.equal(formatPercent(0.0003, 2), `0,03${NBSP}%`);
    assert.equal(formatPercent(0.0025, 2), `0,25${NBSP}%`);
  });

  it("formats country weights", () => {
    assert.equal(formatPercent(0.622), `62${NBSP}%`);
    assert.equal(formatPercent(0.035, 1), `3,5${NBSP}%`);
  });
});

describe("formatAmount", () => {
  it("puts a non-breaking space before the unit", () => {
    assert.equal(formatAmount(123.4, "EUR"), `123,40${NBSP}EUR`);
    assert.equal(formatAmount(100000, "Kč", 0), `100${NBSP}000${NBSP}Kč`);
  });
});

describe("formatDate", () => {
  it("formats an ISO date the Czech way", () => {
    assert.equal(formatDate("2026-09-30"), `30.${NBSP}9.${NBSP}2026`);
    assert.equal(formatDate("2026-10-26T21:00:00Z"), `26.${NBSP}10.${NBSP}2026`);
  });

  it("rejects anything that isn't an ISO date", () => {
    assert.throws(() => formatDate("30. 9. 2026"));
  });
});
