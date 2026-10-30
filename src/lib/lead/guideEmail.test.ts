import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { UCITS_FUNDS } from "../../data/etfs.ts";
import { buildGuideEmail, guideEmailLinks } from "./guideEmail.ts";

const lead = {
  email: "jmeno@email.cz",
  fund: "VWCE" as const,
  adVersion: "b" as const,
  utm: { utm_source: "fb", utm_campaign: "launch" },
};

const links = {
  guideUrl: "https://prvnietf.cz/prvni-3-roky-s-etf?v=b&utm_source=fb",
  unsubscribeUrl: "https://prvnietf.cz/odhlasit?t=abc.def",
  oneClickUnsubscribeUrl: "https://prvnietf.cz/api/odhlasit?t=abc.def",
};

describe("guideEmailLinks", () => {
  it("builds absolute links; the guide link keeps v and utm, the unsubscribe links only the token", () => {
    assert.deepEqual(guideEmailLinks("https://prvnietf.cz", lead, "abc.def"), {
      guideUrl: "https://prvnietf.cz/prvni-3-roky-s-etf?v=b&utm_source=fb&utm_campaign=launch",
      unsubscribeUrl: "https://prvnietf.cz/odhlasit?t=abc.def",
      oneClickUnsubscribeUrl: "https://prvnietf.cz/api/odhlasit?t=abc.def",
    });
  });

  it("never puts the email into a link", () => {
    const all = Object.values(guideEmailLinks("https://prvnietf.cz", lead, "abc.def")).join(" ");
    assert.equal(all.includes("jmeno"), false);
  });

  it("works without attribution", () => {
    const { guideUrl } = guideEmailLinks("https://x.vercel.app", { ...lead, adVersion: null, utm: {} }, "t");
    assert.equal(guideUrl, "https://x.vercel.app/prvni-3-roky-s-etf");
  });
});

describe("buildGuideEmail", () => {
  it("uses the copy.md subject and text, with the fund and its ISIN", () => {
    const email = buildGuideEmail("VWCE", links);
    assert.equal(email.subject, "Váš průvodce: První 3 roky s ETF");
    assert.equal(
      email.text,
      [
        "Dobrý den,",
        `děkujeme za zájem. Váš průvodce si stáhnete tady: ${links.guideUrl}`,
        "V průvodci najdete, co čekat v prvních měsících, co dělat při poklesu, jak je to s daněmi a kdy dává smysl prodat.",
        `Fond, který jste si prohlédli: VWCE (ISIN ${UCITS_FUNDS.VWCE.isin}).`,
        "Nejde o investiční doporučení ani daňové poradenství.",
        `Odhlásit se můžete jedním kliknutím: ${links.unsubscribeUrl}`,
      ].join("\n\n"),
    );
  });

  it("leaves out the fund line without a fund", () => {
    const email = buildGuideEmail(null, links);
    assert.equal(email.text.includes("Fond, který"), false);
    assert.equal(email.html.includes("Fond, který"), false);
  });

  it("links the labels in HTML and escapes the hrefs", () => {
    const { html } = buildGuideEmail("VUAA", links);
    assert.match(html, /<a href="https:\/\/prvnietf\.cz\/prvni-3-roky-s-etf\?v=b&amp;utm_source=fb">Stáhnout PDF<\/a>/);
    assert.match(html, /<a href="https:\/\/prvnietf\.cz\/odhlasit\?t=abc\.def">Odhlásit<\/a>/);
    assert.match(html, new RegExp(`ISIN ${UCITS_FUNDS.VUAA.isin}`));
  });
});
