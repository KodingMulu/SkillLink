import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/server-auth";

export async function GET(request: NextRequest) {
    try {
        const userAuth = getAuthUser(request);
        if (!userAuth) {
            return NextResponse.json(
                { message: "Unauthorized: Token missing or invalid", code: 401 },
                { status: 401 }
            );
        }
        if (userAuth.role !== 'ADMIN') {
            return NextResponse.json(
                { message: "Forbidden: Admin access only", code: 403 },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status") || "all";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const whereCondition: Prisma.UserWhereInput = {
            AND: [
                search ? {
                    OR: [
                        { username: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } }
                    ]
                } : {},
                status !== 'all' ? {
                    status: status.toUpperCase() as Prisma.EnumUserStatusFilter
                } : {}
            ]
        };

        const [users, total] = await prisma.$transaction([
            prisma.user.findMany({
                where: whereCondition,
                select: {
                    id: true,
                    username: true,
                    email: true,
                    role: true,
                    status: true,
                    createdAt: true,
                    _count: {
                        select: {
                            freelancerProjects: true,
                            clientProjects: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit,
            }),
            prisma.user.count({ where: whereCondition })
        ]);

        const formattedUsers = users.map(user => ({
            id: user.id,
            name: user.username || "Tanpa Nama",
            email: user.email,
            role: user.role,
            status: user.status.toLowerCase(),
            joined: user.createdAt.toISOString(),
            projects: user._count.freelancerProjects + user._count.clientProjects,
            rating: 0
        }));

        return NextResponse.json(
            {
                message: "Success",
                code: 200,
                data: formattedUsers,
                pagination: {
                    total,
                    page,
                    totalPages: Math.ceil(total / limit),
                    limit
                }
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("ADMIN_LIST_USER_ERROR:", error);
        return NextResponse.json(
            { message: "Internal Server Error", code: 500 },
            { status: 500 }
        );
    }
}