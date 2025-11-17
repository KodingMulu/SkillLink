/**
 * Register User
 * @route POST /api/auth/register
 * @access Public
 * @returns {message: string, code: number}
 * @requires email, username, password
 */

import { hashPassword } from "@/lib/auth";
import { sendMail } from "@/lib/mail";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
     try {
          const { email, username, password } = await req.json();

          const exists = await prisma.user.findUnique({
               where: {
                    email
               }
          });
          if (exists) {
               return NextResponse.json({
                    message: "User already exists",
                    code: 400
               });
          };

          //Generate 4 Digit Random Number
          const code = Math.floor(1000 + Math.random() * 9000).toString();

          //Hashing Password Before Save to Database
          const hashed = await hashPassword(password);

          await prisma.user.create({
               data: {
                    email,
                    username,
                    password: hashed,
                    verificationCode: code,
                    verificationExpires: new Date(Date.now() + 15 * 60 * 1000),
                    isVerified: false
               }
          });

          await sendMail(
               email,
               "Verification Code",
               `Your verification code is ${code}`
          );

          return NextResponse.json({
               message: "Verification code sent to your email",
               code: 200
          })
     } catch (error) {
          console.error(error);
          return NextResponse.json({
               message: "Something went wrong",
               code: 500
          })
     }
}