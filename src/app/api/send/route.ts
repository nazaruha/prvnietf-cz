// app/api/send/route.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
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
