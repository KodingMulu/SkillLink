import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
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

        return NextResponse.json({
            data: formattedUsers,
            pagination: {
                total,
                page,
                totalPages: Math.ceil(total / limit),
                limit
            }
        });

    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}