import type { Metadata } from "next";
import { Suspense } from "react";
import { UNSUBSCRIBE_TOKEN_PARAM } from "@/lib/lead/paths";
import { verifyUnsubscribeToken } from "@/lib/lead/unsubscribeToken";
import { UNSUBSCRIBE_COPY } from "./copy";
import { UnsubscribeForm } from "./UnsubscribeForm";

// The [Odhlásit] link of the guide email (DECISIONS.md D21, docs/copy.md §12).
// Opening the page changes nothing; only the button (a POST) unsubscribes.

export const metadata: Metadata = {
  title: UNSUBSCRIBE_COPY.heading,
  robots: { index: false, follow: false },
};

export default function UnsubscribePage({ searchParams }: PageProps<"/odhlasit">) {
  return (
    <main className="page-container flex-1 pt-10 pb-16 md:pt-20 lg:pb-24">
      <h1 className="text-5xl leading-[0.95] font-extrabold tracking-tight text-balance md:text-6xl">
        {UNSUBSCRIBE_COPY.heading}
      </h1>
      {/* searchParams is request data: under cacheComponents it must sit inside Suspense. */}
      <Suspense fallback={null}>
        <TokenCheck searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function TokenCheck({ searchParams }: Pick<PageProps<"/odhlasit">, "searchParams">) {
  const raw = (await searchParams)[UNSUBSCRIBE_TOKEN_PARAM];
  const token = typeof raw === "string" ? raw : "";
  const secret = process.env.UNSUBSCRIBE_SECRET;

  if (!secret) {
    console.error("Unsubscribe page: UNSUBSCRIBE_SECRET is not set");
    return <p className="mt-6 max-w-prose text-lg">{UNSUBSCRIBE_COPY.error}</p>;
  }
  // Only the signature is checked here; nothing is written on a GET.
  if (!verifyUnsubscribeToken(token, secret)) {
    return <p className="mt-6 max-w-prose text-lg">{UNSUBSCRIBE_COPY.invalid}</p>;
  }

  return (
    <>
      <p className="mt-6 max-w-prose text-lg">{UNSUBSCRIBE_COPY.text}</p>
      <UnsubscribeForm token={token} />
    </>
  );
}
