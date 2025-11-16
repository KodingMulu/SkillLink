/**
 * Register User
 * @route POST /api/auth/register
 * @access Public
 * @returns {message: string, code: number}
 * @requires email, username, password
 */

import { hashPassword } from "@/lib/auth";
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

          const hashed = await hashPassword(password);

          await prisma.user.create({
               data: {
                    email,
                    username,
                    password: hashed
               }
          });

          return NextResponse.json({
               message: "User registered successfully",
               code: 200
          })
     } catch (error) {
          return NextResponse.json({
               message: "Something went wrong",
               code: 500
          })
     }
}