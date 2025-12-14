import { NextRequest } from "next/server";
import { verifyToken } from "./auth";

export function getAuthUser(req: NextRequest) {
     const token = req.cookies.get("token")?.value;

     if (!token) return null;

     const decoded = verifyToken(token);
     return decoded;
}