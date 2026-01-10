import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
    try {
        const userAuth = await getAuthUser(req);
        if (!userAuth || userAuth.role !== 'ADMIN') {
            return NextResponse.json({ message: "Unauthorized", code: 401 }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userAuth.id }
        });

        if (!user) return NextResponse.json({ message: "User not found", code: 404 });

        const profileData = {
            name: user.username || "Admin",
            email: user.email,
            role: "System Administrator",
            joinDate: user.createdAt,
            avatar: user.username ? user.username.substring(0, 2).toUpperCase() : "AD"
        };

        return NextResponse.json({ message: "Success", code: 200, data: profileData });

    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", code: 500 }, { status: 500 });
    }
}