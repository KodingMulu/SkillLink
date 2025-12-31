import { hashPassword } from "@/lib/auth";
import { sendMail } from "@/lib/mail";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
     try {
          const { email, username, password, role } = await req.json();
          if (!role || (role !== "FREELANCER" && role !== "CLIENT")) {
               return NextResponse.json(
                    { message: "Invalid role. Please select either FREELANCER or CLIENT." },
                    { status: 400 } 
               );
          }

          const exists = await prisma.user.findUnique({
               where: { email }
          });

          if (exists) {
               return NextResponse.json(
                    { message: "User already exists" },
                    { status: 400 } 
               );
          };

          const code = Math.floor(1000 + Math.random() * 9000).toString();
          const hashed = await hashPassword(password);

          await prisma.user.create({
               data: {
                    email,
                    username,
                    password: hashed,
                    role: role,
                    verificationCode: code,
                    verificationExpires: new Date(Date.now() + 15 * 60 * 1000),
                    isVerified: false,
                    wallet: {
                         create: {
                              balance: 0
                         }
                    }
               }
          });

          try {
               await sendMail(
                    email,
                    "Verification Code",
                    `Your verification code is ${code}`
               );
          } catch (emailError) {
               console.error("Email failed to send:", emailError);
          }

          return NextResponse.json(
               { message: "Verification code sent to your email" },
               { status: 201 } 
          );

     } catch (error) {
          console.error("Registration Error:", error);
          return NextResponse.json(
               { message: "Something went wrong" },
               { status: 500 } 
          );
     }
}