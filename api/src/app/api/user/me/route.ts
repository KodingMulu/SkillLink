import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

interface JwtPayload {
     id: string
     email: string
     role: string
     username?: string
}

export async function GET(req: NextRequest) {
     const token = req.cookies.get("token")?.value;

     if (!token) {
          return NextResponse.json({
               message: "Unauthorized: Token not found",
               code: 401
          }, { status: 401 });
     };

     try {
          const decoded = verifyToken(token) as JwtPayload | null;

          if (!decoded) {
               return NextResponse.json({
                    message: "Unauthorized: Invalid token",
                    code: 401
               }, { status: 401 });
          }

          return NextResponse.json({
               message: "Authenticated",
               user: decoded,
               code: 200
          }, {
               status: 200
          });

     } catch (error) {
          return NextResponse.json({
               message: "Internal Server Error",
               status: 500
          }, { status: 500 })
     }
}