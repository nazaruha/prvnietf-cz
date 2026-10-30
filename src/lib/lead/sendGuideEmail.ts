import { Resend } from "resend";
import type { ValidLead } from "./parseLead.ts";
import { GUIDE_EMAIL_FROM, buildGuideEmail, guideEmailLinks } from "./guideEmail.ts";
import { signUnsubscribeToken } from "./unsubscribeToken.ts";

// Sends the guide after a lead is saved. Never throws: a failed email must not cost the
// lead or the visitor's thank-you page (.claude/rules/db-and-api.md). Logs never contain the email.

export async function sendGuideEmail(origin: string, leadId: string, lead: ValidLead): Promise<boolean> {
  // Read per call, not at module level: a variable missing in Preview must not fail the build.
  const apiKey = process.env.RESEND_API_KEY;
  const secret = process.env.UNSUBSCRIBE_SECRET;
  // No unsubscribe link, no email (docs/copy.md "10. Email").
  if (!apiKey || !secret) {
    console.error(`Guide email skipped: ${!apiKey ? "RESEND_API_KEY" : "UNSUBSCRIBE_SECRET"} is not set`);
    return false;
  }

  const links = guideEmailLinks(origin, lead, signUnsubscribeToken(leadId, secret));
  const { subject, text, html } = buildGuideEmail(lead.fund, links);

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: GUIDE_EMAIL_FROM,
      to: lead.email,
      subject,
      text,
      html,
      headers: {
        "List-Unsubscribe": `<${links.oneClickUnsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });
    if (error) {
      console.error(`Guide email failed: ${error.name}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Guide email failed: ${error instanceof Error ? error.name : "unknown error"}`);
    return false;
  }
}
