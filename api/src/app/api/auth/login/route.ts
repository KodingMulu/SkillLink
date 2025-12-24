import { comparePassword, signToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
     try {
          const { email, password } = await req.json();

          const user = await prisma.user.findUnique({
               where: {
                    email
               }
          });
          if (!user) {
               return NextResponse.json({
                    message: "User not found",
                    code: 400
               });
          };

          const validatePassword = await comparePassword(password, user.password);
          if (!validatePassword) {
               return NextResponse.json({
                    message: "Invalid password",
                    code: 400
               });
          };

          const token = signToken({
               id: user.id,
               email: user.email,
               role: user.role
          });

          const response = NextResponse.json({
               message: "User logged in successfully",
               token: token,
               user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    username: user.username
               },
               code: 200
          });

          response.cookies.set("token", token, {
               httpOnly: true,
               path: "/",
               maxAge: 60 * 60 * 24 * 7
          });

          return response;
     } catch (error) {
          console.log(error);
          return NextResponse.json({
               message: "Something went wrong",
               code: 500
          })
     }
}