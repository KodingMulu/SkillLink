import { sendMail } from "@/lib/mail";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email harus diisi", code: 400 },
        { status: 400 }
      );
    }

    const genericSuccessResponse = NextResponse.json(
      {
        message: "Jika email terdaftar, kode reset password telah dikirim ke email Anda",
        code: 200
      },
      { status: 200 }
    );

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Return generic response to prevent email enumeration attacks
      return genericSuccessResponse;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.user.update({
      where: { email },
      data: {
        verificationCode: code,
        verificationExpires: new Date(Date.now() + 15 * 60 * 1000)
      }
    });

    try {
      await sendMail(
        email,
        "Reset Password Code",
        `Kode reset password Anda adalah: ${code}`
      );
    } catch (mailErr) {
      console.error("Failed to send reset password email:", mailErr);
    }

    return genericSuccessResponse;

  } catch (error) {
    console.error("FORGOT_PASS_ERROR:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server", code: 500 },
      { status: 500 }
    );
  }
}