import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const allowedOrigins = [
  process.env.WEB_URL,    
  process.env.MOBILE_URL, 
  "http://localhost:3000"
];

export async function middleware(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  
  const setCorsHeaders = (res: NextResponse) => {
    const targetOrigin = allowedOrigins.includes(origin) ? origin : "*";
    
    res.headers.set("Access-Control-Allow-Origin", targetOrigin);
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version");
    res.headers.set("Access-Control-Allow-Credentials", "true");
    return res;
  };

  if (request.method === "OPTIONS") {
    const res = new NextResponse(null, { status: 200 });
    return setCorsHeaders(res);
  }

  const loginUrl = new URL('/auth/login', request.url);
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith('/api/auth') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/public') ||
    pathname === '/'
  ) {
    const res = NextResponse.next();
    return setCorsHeaders(res);
  }

  let token = request.cookies.get('token')?.value;
  
  const authHeader = request.headers.get('authorization');
  if (!token && authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (!token) {
    if (pathname.startsWith('/api')) {
       const res = NextResponse.json({ message: "Unauthorized" }, { status: 401 });
       return setCorsHeaders(res);
    }
    const res = NextResponse.redirect(loginUrl);
    return setCorsHeaders(res);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'rahasia_default');
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as string;

    if (pathname.startsWith('/dashboard/admin') && role !== 'ADMIN') {
      let redirectUrl = loginUrl;
      if (role === 'CLIENT') redirectUrl = new URL('/dashboard/client', request.url);
      if (role === 'FREELANCER') redirectUrl = new URL('/dashboard/freelancer', request.url);
      
      const res = NextResponse.redirect(redirectUrl);
      return setCorsHeaders(res);
    }

    if (pathname.startsWith('/dashboard/client') && role !== 'CLIENT') {
      if (role === 'ADMIN') {
         const res = NextResponse.next(); return setCorsHeaders(res);
      }
      const res = NextResponse.redirect(new URL('/dashboard/freelancer', request.url));
      return setCorsHeaders(res);
    }

    if (pathname.startsWith('/dashboard/freelancer') && role !== 'FREELANCER') {
      if (role === 'ADMIN') {
         const res = NextResponse.next(); return setCorsHeaders(res);
      }
      const res = NextResponse.redirect(new URL('/dashboard/client', request.url));
      return setCorsHeaders(res);
    }

    const res = NextResponse.next();
    return setCorsHeaders(res);

  } catch (error) {
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete('token'); 
    return setCorsHeaders(res);
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/api/:path*',       
  ],
};