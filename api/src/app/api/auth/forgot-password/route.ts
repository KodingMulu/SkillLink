import { sendMail } from "@/lib/mail";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({
        message: "Email tidak ditemukan",
        code: 400 
      });
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();

    await prisma.user.update({
      where: { email },
      data: {
        verificationCode: code,
        verificationExpires: new Date(Date.now() + 15 * 60 * 1000) 
      }
    });

    await sendMail(
      email,
      "Reset Password Code",
      `Kode reset password Anda adalah: ${code}`
    );

    return NextResponse.json({
      message: "Kode reset telah dikirim ke email",
      code: 200
    });

  } catch (error) {
    console.log("FORGOT_PASS_ERROR:", error);
    return NextResponse.json({
      message: "Terjadi kesalahan pada server",
      code: 500
    });
  }
}