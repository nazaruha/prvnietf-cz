import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { LEAD_ERRORS, isValidEmail, normalizeEmail, validateLead } from "./validateLead.ts";

describe("isValidEmail", () => {
  it("accepts common addresses", () => {
    for (const email of ["jmeno@email.cz", "jan.novak+etf@seznam.cz", "a@b.co", "  jmeno@email.cz  "]) {
      assert.equal(isValidEmail(email), true, email);
    }
  });

  it("rejects incomplete addresses", () => {
    for (const email of ["", "   ", "jmeno", "jmeno@", "@email.cz", "jmeno@email", "jmeno@email.c", "jm eno@email.cz", "a@@b.cz"]) {
      assert.equal(isValidEmail(email), false, email);
    }
  });

  it("rejects addresses longer than 254 characters", () => {
    assert.equal(isValidEmail(`${"a".repeat(250)}@b.cz`), false);
  });
});

describe("normalizeEmail", () => {
  it("trims surrounding whitespace", () => {
    assert.equal(normalizeEmail("  jmeno@email.cz\n"), "jmeno@email.cz");
  });
});

describe("validateLead", () => {
  it("returns no errors for a valid email with consent", () => {
    assert.deepEqual(validateLead({ email: "jmeno@email.cz", consent: true }), {});
  });

  it("reports the email and the missing consent with the copy.md messages", () => {
    assert.deepEqual(validateLead({ email: "jmeno@", consent: false }), {
      email: LEAD_ERRORS.email,
      consent: LEAD_ERRORS.consent,
    });
  });

  it("requires consent even for a valid email", () => {
    assert.deepEqual(validateLead({ email: "jmeno@email.cz", consent: false }), { consent: LEAD_ERRORS.consent });
  });
});
