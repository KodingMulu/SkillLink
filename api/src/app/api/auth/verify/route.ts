import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
     try {
          const { email, code } = await req.json();

          const user = await prisma.user.findUnique({
               where: {
                    email
               }
          });
          if (!user) {
               return NextResponse.json({
                    message: "User not found",
                    code: 400
               })
          }

          if (user.isVerified) {
               return NextResponse.json({
                    message: "User already verified",
                    code: 400
               })
          };

          if (new Date() > user.verificationExpires!) {
               return NextResponse.json({
                    message: "Verification code expired",
                    code: 400
               })
          }

          if (user.verificationCode !== code) {
               return NextResponse.json({
                    message: "Invalid verification code",
                    code: 400
               });
          }

          await prisma.user.update({
               where: { email },
               data: {
                    isVerified: true,
                    verificationCode: null,
                    verificationExpires: null
               }
          });

          return NextResponse.json({
               message: "Email verified successfully",
               code: 200
          });
     } catch (error) {
          console.error(error);
          return NextResponse.json({
               message: "Something went wrong",
               code: 500
          });
     }
}