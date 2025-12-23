import { NextRequest } from "next/server";
import { verifyToken } from "./auth";

export function getAuthUser(req: NextRequest) {
     let token = "";
     const cookieToken = req.cookies.get("token")?.value;

     if (cookieToken) {
          token = cookieToken;
     } else {
          const authHeader = req.headers.get("Authorization");
          if (authHeader && authHeader.startsWith("Bearer ")) {
               token = authHeader.split(" ")[1];
          }
     }

     if (!token) return null;
     
     const decoded = verifyToken(token);
     return decoded;
}