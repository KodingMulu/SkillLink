import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ message: "User tidak ditemukan", code: 404 });
    }

    if (user.verificationCode !== code) {
      return NextResponse.json({ message: "Kode verifikasi salah", code: 400 });
    }

    if (!user.verificationExpires || new Date() > user.verificationExpires) {
      return NextResponse.json({ message: "Kode telah kadaluwarsa, silakan minta ulang", code: 400 });
    }

    return NextResponse.json({
      message: "Kode valid",
      code: 200
    });

  } catch (error) {
    console.log("VERIFY_CODE_ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error", code: 500 });
  }
}