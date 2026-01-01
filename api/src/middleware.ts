import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowedOrigins = [
  process.env.WEB_URL,
  process.env.MOBILE_URL,
].filter(Boolean);

export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin");

  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse("Blocked by CORS", { status: 403 });
  }

  if (req.method === "OPTIONS") {
    const res = new NextResponse(null, { status: 200 });
    if (origin) {
      res.headers.set("Access-Control-Allow-Origin", origin);
    }
    res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.headers.set("Access-Control-Allow-Credentials", "true");
    return res;
  }

  const res = NextResponse.next();

  if (origin) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Credentials", "true");
  }

  return res;
}

export const config = {
  matcher: "/api/:path*",
};
