"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { track } from "@/lib/analytics";
import { GUIDE_PDF_PATH } from "@/lib/lead/paths";

// The guide download block of /dekujeme and /prvni-3-roky-s-etf (docs/copy.md §9, §11).
// Same tilted cover as the form, so it reads as the thing the visitor just asked for.
// The PDF opens in a new tab; no automatic download (CLAUDE.md pitfalls).

const GUIDE_TITLE = "První 3 roky s ETF";
const DOWNLOAD = "Stáhnout PDF";

export type GuideDownloadProps = {
  heading: string;
  subline?: string;
  /** Where the download happened, sent with `pdf_downloaded`. */
  page: "dekujeme" | "guide";
  /** Rendered under the button: the fund reminder, the back link. */
  children?: ReactNode;
};

export function GuideDownload({ heading, subline, page, children }: GuideDownloadProps) {
  return (
    <main className="flex-1 px-gutter pt-10 pb-16 md:mx-auto md:grid md:w-full md:max-w-4xl md:grid-cols-[16rem_1fr] md:grid-rows-[auto_1fr] md:gap-x-12 md:pt-20">
      <h1 className="text-5xl leading-[0.95] font-extrabold tracking-tight text-balance md:col-start-2 md:text-6xl">
        {heading}
      </h1>

      <Image
        src="/pdf-cover.png"
        alt={`Obálka průvodce ${GUIDE_TITLE}`}
        width={794}
        height={1123}
        sizes="(min-width: 768px) 16rem, 9rem"
        preload
        className="mt-8 w-36 -rotate-3 rounded-sm shadow-[0_8px_24px_-8px_rgb(20_24_31/0.45)] md:col-start-1 md:row-span-2 md:row-start-1 md:mt-0 md:w-full md:rotate-0"
      />

      <div className="md:col-start-2">
        {subline && <p className="mt-8 max-w-prose text-lg md:mt-5">{subline}</p>}

        <a
          href={GUIDE_PDF_PATH}
          target="_blank"
          rel="noopener"
          onClick={() => track("pdf_downloaded", { page })}
          className="mt-8 flex h-14 w-full items-center justify-center rounded-full bg-cta px-6 text-lg font-extrabold text-cta-ink md:w-auto md:max-w-xs"
        >
          {DOWNLOAD}
        </a>

        {children}
      </div>
    </main>
  );
}
