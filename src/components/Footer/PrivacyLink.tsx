"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { readAttribution, withAttribution } from "@/lib/attribution";

// Link to /soukromi that keeps the ad attribution (`v`, `utm_*`): analytics is cookieless,
// so the next page only knows where the visitor came from through its URL.
// The server render links to the bare path; the browser adds the params after hydration.

const PATH = "/soukromi";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

const getSearch = () => window.location.search;
const getServerSearch = () => "";

export function PrivacyLink({ children, className }: { children: string; className?: string }) {
  const search = useSyncExternalStore(subscribe, getSearch, getServerSearch);

  return (
    <Link href={withAttribution(PATH, readAttribution(new URLSearchParams(search)))} className={className}>
      {children}
    </Link>
  );
}
