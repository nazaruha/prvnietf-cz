// The guide email from docs/copy.md "10. Email (Resend)", as plain text and HTML.

import { UCITS_FUNDS, type UcitsTicker } from "../../data/etfs.ts";
import { readAttribution, withAttribution } from "../attribution.ts";
import type { ValidLead } from "./parseLead.ts";

export const GUIDE_EMAIL_FROM = "pruvodce@mail.prvnietf.cz";
export const GUIDE_EMAIL_SUBJECT = "Váš průvodce: První 3 roky s ETF";

export const GUIDE_PAGE_PATH = "/prvni-3-roky-s-etf";
export const UNSUBSCRIBE_PAGE_PATH = "/odhlasit";
/** One-click target for `List-Unsubscribe-Post` (RFC 8058); mail apps POST here. */
export const UNSUBSCRIBE_API_PATH = "/api/odhlasit";
export const UNSUBSCRIBE_TOKEN_PARAM = "t";

export type GuideEmailLinks = {
  guideUrl: string;
  unsubscribeUrl: string;
  oneClickUnsubscribeUrl: string;
};

/** Absolute links for the email. The guide link keeps the ad attribution (CLAUDE.md pitfalls). */
export function guideEmailLinks(origin: string, lead: ValidLead, token: string): GuideEmailLinks {
  const params = new URLSearchParams(lead.utm);
  if (lead.adVersion) params.set("v", lead.adVersion);
  const unsubscribe = (path: string) =>
    new URL(`${path}?${new URLSearchParams({ [UNSUBSCRIBE_TOKEN_PARAM]: token })}`, origin).href;

  return {
    guideUrl: new URL(withAttribution(GUIDE_PAGE_PATH, readAttribution(params)), origin).href,
    unsubscribeUrl: unsubscribe(UNSUBSCRIBE_PAGE_PATH),
    oneClickUnsubscribeUrl: unsubscribe(UNSUBSCRIBE_API_PATH),
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

type Paragraph = string | { before: string; link: { label: string; href: string } };

/** Subject, text and HTML. The fund line is left out when the visitor saw no fund. */
export function buildGuideEmail(fund: UcitsTicker | null, links: GuideEmailLinks) {
  const ucits = fund ? UCITS_FUNDS[fund] : null;
  const paragraphs: Paragraph[] = [
    "Dobrý den,",
    {
      before: "děkujeme za zájem. Váš průvodce si stáhnete tady: ",
      link: { label: "Stáhnout PDF", href: links.guideUrl },
    },
    "V průvodci najdete, co čekat v prvních měsících, co dělat při poklesu, jak je to s daněmi a kdy dává smysl prodat.",
    ...(ucits ? [`Fond, který jste si prohlédli: ${ucits.ticker} (ISIN ${ucits.isin}).`] : []),
    "Nejde o investiční doporučení ani daňové poradenství.",
    {
      before: "Odhlásit se můžete jedním kliknutím: ",
      link: { label: "Odhlásit", href: links.unsubscribeUrl },
    },
  ];

  const text = paragraphs
    .map((p) => (typeof p === "string" ? p : `${p.before}${p.link.href}`))
    .join("\n\n");
  const html = paragraphs
    .map((p) =>
      typeof p === "string"
        ? `<p>${escapeHtml(p)}</p>`
        : `<p>${escapeHtml(p.before)}<a href="${escapeHtml(p.link.href)}">${escapeHtml(p.link.label)}</a></p>`,
    )
    .join("\n");

  return { subject: GUIDE_EMAIL_SUBJECT, text, html };
}
