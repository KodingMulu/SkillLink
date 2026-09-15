import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, code, password } = await req.json();

    if (!email || !code || !password) {
      return NextResponse.json(
        { message: "Email, kode verifikasi, dan password baru harus diisi", code: 400 },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan", code: 404 },
        { status: 404 }
      );
    }

    if (!user.verificationExpires || new Date() > user.verificationExpires) {
      return NextResponse.json(
        { message: "Kode verifikasi telah kadaluwarsa, silakan minta ulang", code: 400 },
        { status: 400 }
      );
    }

    if (!user.verificationCode || user.verificationCode !== code) {
      return NextResponse.json(
        { message: "Kode verifikasi salah atau tidak valid", code: 400 },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        verificationCode: null,
        verificationExpires: null
      }
    });

    return NextResponse.json(
      { message: "Password berhasil diubah", code: 200 },
      { status: 200 }
    );

  } catch (error) {
    console.error("RESET_PASSWORD_ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error", code: 500 },
      { status: 500 }
    );
  }
}