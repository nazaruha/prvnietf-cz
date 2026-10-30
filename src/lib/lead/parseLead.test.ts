import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CONSENT_TEXT } from "../../components/LeadForm/consent.ts";
import { leadColumns, parseLead } from "./parseLead.ts";

const valid = {
  email: "  jmeno@email.cz ",
  consent: true,
  fund: "VWCE",
  adVersion: "b",
  utm: { utm_source: "fb", utm_term: "etf" },
  website: "",
};

describe("parseLead", () => {
  it("accepts the form's payload and trims the email", () => {
    assert.deepEqual(parseLead(valid), {
      kind: "lead",
      lead: { email: "jmeno@email.cz", fund: "VWCE", adVersion: "b", utm: { utm_source: "fb", utm_term: "etf" } },
    });
  });

  it("treats a filled honeypot as a bot, even with an invalid email", () => {
    assert.deepEqual(parseLead({ ...valid, website: "https://spam.example" }), { kind: "bot" });
    assert.deepEqual(parseLead({ email: "x", website: "spam" }), { kind: "bot" });
  });

  it("ignores a honeypot of only whitespace", () => {
    assert.equal(parseLead({ ...valid, website: "  " }).kind, "lead");
  });

  it("rejects a bad email, missing consent and non-object bodies", () => {
    for (const body of [
      { ...valid, email: "jmeno@" },
      { ...valid, email: 42 },
      { ...valid, consent: false },
      { ...valid, consent: "true" },
      null,
      "jmeno@email.cz",
      [valid],
    ]) {
      assert.deepEqual(parseLead(body), { kind: "invalid" }, JSON.stringify(body));
    }
  });

  it("drops unknown funds, ad versions and UTM keys instead of rejecting the lead", () => {
    const parsed = parseLead({
      ...valid,
      fund: "VOO",
      adVersion: "c",
      utm: { utm_source: " ", utm_medium: 3, gclid: "x", utm_campaign: "a".repeat(300) },
    });
    assert.deepEqual(parsed, {
      kind: "lead",
      lead: { email: "jmeno@email.cz", fund: null, adVersion: null, utm: { utm_campaign: "a".repeat(200) } },
    });
  });

  it("does not take fund names from the prototype", () => {
    const parsed = parseLead({ ...valid, fund: "toString" });
    assert.equal(parsed.kind === "lead" && parsed.lead.fund, null);
  });
});

describe("leadColumns", () => {
  it("stores the server's consent text, maps UTMs and clears the unsubscribe", () => {
    assert.deepEqual(
      leadColumns({ email: "jmeno@email.cz", fund: null, adVersion: "a", utm: { utm_source: "fb", utm_term: "etf" } }),
      {
        consent: true,
        consentText: CONSENT_TEXT,
        fund: null,
        adVersion: "a",
        utmSource: "fb",
        utmMedium: null,
        utmCampaign: null,
        utmContent: null,
        utmTerm: "etf",
        unsubscribedAt: null,
      },
    );
  });
});
