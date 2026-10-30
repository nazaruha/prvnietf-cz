import type { Metadata } from "next";
import { GuideDownload } from "@/components/GuideDownload/GuideDownload";

// The guide's own page (docs/copy.md §11). The [Stáhnout PDF] link in the guide email points here.

// Non-breaking spaces keep "3 roky" and "s ETF" together (Czech typography).
const NBSP = " ";
const TITLE = `První 3${NBSP}roky s${NBSP}ETF`;
const SUBLINE =
  `V průvodci najdete, co čekat v${NBSP}prvních měsících, co dělat při poklesu, jak je to s${NBSP}daněmi a kdy dává smysl prodat.`;

export const metadata: Metadata = {
  title: TITLE,
  robots: { index: false, follow: false },
};

export default function GuidePage() {
  return <GuideDownload heading={TITLE} subline={SUBLINE} page="guide" />;
}
