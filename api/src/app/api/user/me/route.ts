import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

interface JwtPayload {
     id: string
     email: string
     username?: string
}
export async function GET(req: NextRequest) {
     const token = req.headers.get("cookie")?.split("=")[1];
     if (!token) {
          return NextResponse.json({
               message: "Unauthorized",
               code: 401
          });
     };

     try {
          const decoded = verifyToken(token) as JwtPayload;

          return NextResponse.json({
               user: decoded
          }, {
               status: 200
          });
     } catch (error) {
          return NextResponse.json({
               message: "Unauthorized",
               status: 401
          })
     }
}