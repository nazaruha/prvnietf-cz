import { revalidateTag } from "next/cache";
import { connection } from "next/server";
import { isAuthorizedCron } from "@/lib/prices/cronAuth";
import { FUND_PRICES_TAG } from "@/lib/prices/getFundPrices";
import { REQUEST_TIMEOUT_MS, refreshFunds, type RefreshResult } from "@/lib/prices/refresh";
import { saveSnapshot } from "@/lib/prices/store";

// GET /api/cron/refresh-funds, called once a day by Vercel Cron (vercel.json).
// 9 Alpha Vantage requests spaced 15 s apart take ~2-3 minutes, hence the 300 s limit.
// Logs and responses never contain the API key or a request URL.

export const maxDuration = 300;

type CronResponse =
  | { ok: false; error: "not-configured" | "unauthorized" }
  | { ok: boolean; saved: number; results: RefreshResult[] };

function reply(body: CronResponse, status: number): Response {
  return Response.json(body, { status });
}

async function fetchText(url: string): Promise<{ status: number; body: string }> {
  const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  return { status: response.status, body: await response.text() };
}

export async function GET(request: Request): Promise<Response> {
  // Never prerender at build time: this route only runs when Vercel Cron calls it.
  await connection();

  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("Fund refresh: CRON_SECRET is not set");
    return reply({ ok: false, error: "not-configured" }, 500);
  }
  if (!isAuthorizedCron(request.headers.get("authorization"), secret)) {
    return reply({ ok: false, error: "unauthorized" }, 401);
  }

  const apiKey = process.env.ALPHAVANTAGE_API_KEY;
  if (!apiKey) {
    console.error("Fund refresh: ALPHAVANTAGE_API_KEY is not set");
    return reply({ ok: false, error: "not-configured" }, 500);
  }

  const results = await refreshFunds(apiKey, {
    fetchText,
    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    save: saveSnapshot,
    now: () => new Date(),
  });

  const saved = results.filter((result) => result.ok).length;
  // New rows: let the page pick them up on its next visit instead of waiting for cacheLife.
  if (saved > 0) revalidateTag(FUND_PRICES_TAG, "max");

  const failed = results.flatMap((result) => (result.ok ? [] : [`${result.ticker} ${result.field}: ${result.reason}`]));
  console.info(`Fund refresh: ${saved}/${results.length} saved${failed.length ? `; failed ${failed.join(", ")}` : ""}`);

  // 502 when nothing was saved, so the failure is visible in Vercel's cron log.
  return reply({ ok: saved > 0, saved, results }, saved > 0 ? 200 : 502);
}
