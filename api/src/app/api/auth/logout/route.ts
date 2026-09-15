import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    {
      message: 'Logout berhasil',
      code: 200,
    },
    { status: 200 }
  );

  response.cookies.set('token', '', {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
  });

  return response;
}