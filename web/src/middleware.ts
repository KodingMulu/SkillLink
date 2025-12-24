import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value; 
  
  const loginUrl = new URL('/auth/login', request.url);

  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'rahasia_default'); 
    const { payload } = await jwtVerify(token, secret);

    const role = payload.role as string; 
    const pathname = request.nextUrl.pathname;

    if (pathname.startsWith('/dashboard/admin') && role !== 'ADMIN') {
        if (role === 'CLIENT') return NextResponse.redirect(new URL('/dashboard/client', request.url));
        if (role === 'FREELANCER') return NextResponse.redirect(new URL('/dashboard/freelancer', request.url));
        return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith('/dashboard/client') && role !== 'CLIENT') {
        if (role === 'ADMIN') return NextResponse.next(); 
        return NextResponse.redirect(new URL('/dashboard/freelancer', request.url));
    }

    if (pathname.startsWith('/dashboard/freelancer') && role !== 'FREELANCER') {
        if (role === 'ADMIN') return NextResponse.next();
        return NextResponse.redirect(new URL('/dashboard/client', request.url));
    }

    return NextResponse.next();

  } catch (error) {
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};