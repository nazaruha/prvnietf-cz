import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { GuideDownload } from "@/components/GuideDownload/GuideDownload";
import { ISIN_LABEL, UCITS_FUNDS, type UcitsFund } from "@/data/etfs";
import { readAttribution, withAttribution } from "@/lib/attribution";

// Thank-you page after a successful form submit (docs/copy.md §9). The form redirects here
// with `?etf=<UCITS ticker>` (or none) plus `v`/`utm_*`; the email is never in the URL.

const HEADING = "Hotovo. Průvodce je váš.";
const BACK = "← Zpět na srovnání";

export const metadata: Metadata = {
  title: HEADING,
  robots: { index: false, follow: false },
};

export default function ThankYouPage({ searchParams }: PageProps<"/dekujeme">) {
  return (
    <GuideDownload heading={HEADING} page="dekujeme">
      {/* searchParams is request data: under cacheComponents it must sit inside Suspense. */}
      <Suspense fallback={null}>
        <FundAndBackLink searchParams={searchParams} />
      </Suspense>
    </GuideDownload>
  );
}

function findUcitsFund(ticker: string | null): UcitsFund | null {
  return Object.values(UCITS_FUNDS).find((fund) => fund.ticker === ticker) ?? null;
}

async function FundAndBackLink({ searchParams }: Pick<PageProps<"/dekujeme">, "searchParams">) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === "string") query.set(key, value);
  }
  const fund = findUcitsFund(query.get("etf"));

  return (
    <>
      {fund && (
        <p className="mt-10 max-w-prose border-t-2 border-mist pt-5">
          Váš fond: <strong className="font-extrabold">{fund.ticker}</strong> · {ISIN_LABEL} {fund.isin} – podle{" "}
          {ISIN_LABEL} ho najdete u brokera.
        </p>
      )}
      <Link
        href={withAttribution("/", readAttribution(query))}
        className="mt-8 inline-block py-2 text-sm text-ink-muted underline underline-offset-4"
      >
        {BACK}
      </Link>
    </>
  );
}
