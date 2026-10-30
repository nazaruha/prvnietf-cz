// app/api/send/route.ts
import { Resend } from "resend";

export async function POST() {
  // Created per request: at module level a missing key (e.g. in Preview) fails the build.
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return Response.json({ error: "Email is not configured" }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: "PrvniETF <noreply@mail.prvnietf.cz>",
    to: [
      "test-yr1tp4jsw@srv1.mail-tester.com",
      "fedunnazarii20122001@gmail.com",
    ],
    subject: "Hello from prvnietf.cz",
    html: "<p>Hello, World!</p>",
  });
  if (error) return Response.json({ error }, { status: 500 });
  return Response.json(data);
}
