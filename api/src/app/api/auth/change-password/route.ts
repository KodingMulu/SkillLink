import { hashPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
     try {
          const { email, code, newPassword } = await req.json();

          const user = await prisma.user.findUnique({
               where: {
                    email
               }
          });

          if (!user) {
               return NextResponse.json({
                    message: "Email not found",
                    code: 404
               });
          }

          if (user.verificationCode !== code) {
               return NextResponse.json({
                    message: "Invalid verification code",
                    code: 400
               });
          }

          if (!user.verificationExpires || user.verificationExpires < new Date()) {
               return NextResponse.json({
                    message: "Verification code expired",
                    code: 400
               });
          }

          const hashed = await hashPassword(newPassword);

          await prisma.user.update({
               where: { email },
               data: {
                    password: hashed,
                    verificationCode: null,
                    verificationExpires: null
               }
          });

          return NextResponse.json({
               message: "Password changed successfully",
               code: 200
          });
     } catch (error) {
          console.log("CHANGE PASS ERROR:", error);
          return NextResponse.json({
               message: "Something went wrong",
               code: 500
          });
     }
}