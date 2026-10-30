import { UNSUBSCRIBE_TOKEN_PARAM } from "@/lib/lead/paths";
import { unsubscribe } from "@/lib/lead/unsubscribe";

// One-click unsubscribe (RFC 8058): mail apps POST `List-Unsubscribe=One-Click` to the
// `List-Unsubscribe` URL from the guide email. POST only; a GET must never unsubscribe.

const STATUS = { done: 200, invalid: 400, error: 500 } as const;

export async function POST(request: Request): Promise<Response> {
  const token = new URL(request.url).searchParams.get(UNSUBSCRIBE_TOKEN_PARAM) ?? "";
  const result = await unsubscribe(token);
  return Response.json({ ok: result === "done" }, { status: STATUS[result] });
}

export function GET(): Response {
  return Response.json({ ok: false }, { status: 405, headers: { Allow: "POST" } });
}
