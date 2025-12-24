import { NextResponse } from "next/server";

const allowedOrigins = [
     process.env.WEB_URL,
     process.env.MOBILE_URL
];

export function middleware(req: Request) {
     const origin = req.headers.get("origin") || "";
     
     if (origin && !allowedOrigins.includes(origin)) {
          return NextResponse.json({
               message: 'Blocked by CORS',
               code: 403
          }, { status: 403 });
     }

     const response = NextResponse.next();

     if (allowedOrigins.includes(origin) || !origin) {
          response.headers.set("Access-Control-Allow-Origin", origin || "*");
     }

     response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
     response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
     response.headers.set("Access-Control-Allow-Credentials", "true"); 

     if (req.method === "OPTIONS") {
          return NextResponse.json(null, {
               status: 200,
               headers: response.headers
          });
     };

     return response;
}

export const config = {
     matcher: "/api/:path*"
}