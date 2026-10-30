---
paths:
  - "prisma/**"
  - "src/app/api/**"
  - "src/lib/**"
  - "src/proxy.ts"
  - "proxy.ts"
  - "src/app/admin/**"
---

# Database, API and admin rules

- Prisma reads `DATABASE_URL` (Neon **pooled**) at runtime; `directUrl = env("DIRECT_URL")` is used for migrations. Never swap them.
- Schema changes go through `prisma migrate dev` with a named migration, committed as `build:` or `feat:`.
- Use a single shared Prisma client instance (avoid creating a new client per request in development hot reload).
- `/api/lead` validates on the server even though the client validates too. It returns `{ ok: true }` or `{ ok: false, error }` with a proper status code (400 invalid input, 405 wrong method, 500 server error). A filled honeypot gets a fake `200` and nothing is stored.
- A duplicate email is not an error for the visitor (upsert or catch the unique-constraint error).
- If the Resend email fails, the lead is still saved; log the error and still return success to the visitor so they reach the thank-you page.
- `/admin` is protected by HTTP Basic Auth in `proxy.ts` (Next 16; not `middleware.ts`), matcher only `/admin/:path*`, with `ADMIN_USERNAME` / `ADMIN_PASSWORD`; compare credentials in constant time; `401` with `WWW-Authenticate: Basic realm="admin"` otherwise.
- Never log full email addresses or secrets in production logs.
