import { NextResponse, type NextRequest } from "next/server";
import { BASIC_AUTH_CHALLENGE, isAuthorized } from "@/lib/admin/basicAuth";

// Next 16's name for middleware. Runs only on /admin (never on /r9t, the PostHog proxy).

export function proxy(request: NextRequest) {
  const ok = isAuthorized(
    request.headers.get("authorization"),
    process.env.ADMIN_USERNAME,
    process.env.ADMIN_PASSWORD,
  );
  if (ok) return NextResponse.next();

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": BASIC_AUTH_CHALLENGE, "X-Robots-Tag": "noindex" },
  });
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
