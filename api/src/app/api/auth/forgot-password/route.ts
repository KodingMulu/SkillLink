import { sendMail } from "@/lib/mail";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
     try {
          const { email } = await req.json();

          const user = prisma.user.findUnique({
               where: {
                    email
               }
          });
          if (!user) {
               return NextResponse.json({
                    message: "Email Not Found",
                    code: 400
               })
          };

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
               `Your reset password code is: ${code}`
          );

          return NextResponse.json({
               message: "Reset code sent to email",
               code: 200
          });
     } catch (error) {
          console.log("FORGOT PASS ERROR:", error);
          return NextResponse.json({
               message: "Something went wrong",
               code: 500
          });
     }
}