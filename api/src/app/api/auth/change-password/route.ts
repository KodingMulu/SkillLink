import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Data tidak lengkap", code: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ message: "User tidak ditemukan", code: 404 });
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

    return NextResponse.json({
      message: "Password berhasil diubah",
      code: 200
    });

  } catch (error) {
    console.log("RESET_PASSWORD_ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error", code: 500 });
  }
}