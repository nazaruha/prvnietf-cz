import { getDb } from "@/lib/db";
import { leadColumns, parseLead } from "@/lib/lead/parseLead";
import { sendGuideEmail } from "@/lib/lead/sendGuideEmail";
import type { LeadResponse } from "@/components/LeadForm/submitLead";

// POST /api/lead (docs/project.md "Lead flow", .claude/rules/db-and-api.md).
// Logs never contain the email.

function reply(body: LeadResponse, status = 200): Response {
  return Response.json(body, { status });
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return reply({ ok: false, error: "invalid-json" }, 400);
  }

  const parsed = parseLead(body);
  // Honeypot: the bot sees success, nothing is stored or sent.
  if (parsed.kind === "bot") return reply({ ok: true });
  if (parsed.kind === "invalid") return reply({ ok: false, error: "invalid-input" }, 400);

  const { lead } = parsed;
  const columns = leadColumns(lead);
  let leadId: string;
  try {
    // A repeat email updates the row instead of failing: not an error for the visitor.
    const saved = await getDb().lead.upsert({
      where: { email: lead.email },
      create: { email: lead.email, ...columns },
      update: columns,
      select: { id: true },
    });
    leadId = saved.id;
  } catch (error) {
    console.error(`Lead not saved: ${error instanceof Error ? error.name : "unknown error"}`);
    return reply({ ok: false, error: "server" }, 500);
  }

  // The lead is saved; a failed email is logged and the visitor still gets the thank-you page.
  await sendGuideEmail(new URL(request.url).origin, leadId, lead);
  return reply({ ok: true });
}

function methodNotAllowed(): Response {
  return Response.json({ ok: false, error: "method-not-allowed" } satisfies LeadResponse, {
    status: 405,
    headers: { Allow: "POST" },
  });
}

export { methodNotAllowed as GET, methodNotAllowed as PUT, methodNotAllowed as PATCH, methodNotAllowed as DELETE };
