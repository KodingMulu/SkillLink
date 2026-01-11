import prisma from "@/lib/prisma";
import { Prisma, JobStatus } from "@/generated/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status") || "all";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        let statusFilter: JobStatus | undefined;
        if (status === 'active') statusFilter = 'IN_PROGRESS';
        else if (status === 'completed') statusFilter = 'COMPLETED';
        else if (status === 'cancelled') statusFilter = 'CANCELLED';
        else if (status === 'pending') statusFilter = 'OPEN';

        const whereCondition: Prisma.ProjectWhereInput = {
            AND: [
                search ? {
                    OR: [
                        { job: { title: { contains: search, mode: 'insensitive' } } },
                        { client: { username: { contains: search, mode: 'insensitive' } } },
                        { client: { email: { contains: search, mode: 'insensitive' } } },
                        { freelancer: { username: { contains: search, mode: 'insensitive' } } }
                    ]
                } : {},
                statusFilter ? {
                    status: statusFilter
                } : {}
            ]
        };

        const [projects, total] = await prisma.$transaction([
            prisma.project.findMany({
                where: whereCondition,
                include: {
                    job: {
                        select: {
                            title: true,
                            budget: true,
                            deadline: true,
                        }
                    },
                    client: {
                        select: { username: true, email: true }
                    },
                    freelancer: {
                        select: { username: true }
                    }
                },
                orderBy: {
                    updatedAt: 'desc'
                },
                skip,
                take: limit,
            }),
            prisma.project.count({ where: whereCondition })
        ]);

        const formattedProjects = projects.map(project => {
            let displayStatus = 'pending';
            if (project.status === 'IN_PROGRESS') displayStatus = 'active';
            else if (project.status === 'COMPLETED') displayStatus = 'completed';
            else if (project.status === 'CANCELLED') displayStatus = 'cancelled';

            return {
                id: project.id,
                title: project.job.title,
                client: project.client.username || project.client.email,
                freelancer: project.freelancer.username || "Belum ada",
                budget: new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0
                }).format(project.job.budget),
                deadline: project.job.deadline
                    ? new Date(project.job.deadline).toLocaleDateString("id-ID")
                    : "-",
                status: displayStatus,
                progress: project.progress
            };
        });

        return NextResponse.json({
            data: formattedProjects,
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