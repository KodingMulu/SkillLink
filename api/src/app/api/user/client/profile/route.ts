import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
    try {
        const userAuth = await getAuthUser(req);
        if (!userAuth) {
            return NextResponse.json({ message: "Unauthorized", code: 401 }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userAuth.id },
            include: {
                clientJobs: {
                    orderBy: { createdAt: 'desc' },
                    take: 5
                },
                clientProjects: {
                    where: { status: "COMPLETED" },
                    include: { job: true }
                }
            }
        });

        if (!user) return NextResponse.json({ message: "User not found", code: 404 });

        const totalSpent = user.clientProjects.reduce((acc, curr) => acc + curr.job.budget, 0);

        const profileData = {
            name: user.username || "Client",
            email: user.email,
            phone: user.phone || "-",
            location: user.location || "-",
            joinDate: user.createdAt,
            bio: user.bio || "",
            stats: {
                totalJobsPosted: user.clientJobs.length,
                totalHired: user.clientProjects.length,
                totalSpent: totalSpent
            },
            avatar: user.username ? user.username.substring(0, 2).toUpperCase() : "CL",
            recentJobs: user.clientJobs.map(job => ({
                id: job.id,
                title: job.title,
                status: job.status,
                budget: job.budget,
                date: job.createdAt
            }))
        };

        return NextResponse.json({ message: "Success", code: 200, data: profileData });

    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", code: 500 }, { status: 500 });
    }
}