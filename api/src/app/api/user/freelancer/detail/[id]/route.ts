import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = await getAuthUser(req);

        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized: Token missing or invalid", code: 401 },
                { status: 401 }
            );
        }

        const freelancer = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                email: true,
                title: true,
                bio: true,
                location: true,
                skills: true,
                portfolios: {
                    select: {
                        id: true,
                        title: true,
                        tags: true,
                        image: true
                    }
                },
                freelancerProjects: {
                    where: {
                        status: "COMPLETED"
                    },
                    include: {
                        client: { select: { username: true } },
                        job: { select: { title: true, budget: true } }
                    },
                    orderBy: { updatedAt: 'desc' }
                }
            }
        });

        if (!freelancer) {
            return NextResponse.json(
                { message: "Freelancer not found", code: 404 },
                { status: 404 }
            );
        }

        const completedProjects = freelancer.freelancerProjects;
        const totalProjects = completedProjects.length;

        const totalRating = completedProjects.reduce((acc, curr) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rating = (curr as any).rating || 0;
            return acc + rating;
        }, 0);

        const averageRating = totalProjects > 0 ? (totalRating / totalProjects).toFixed(1) : "0.0";
        const successRate = totalProjects > 0 ? 100 : 0;

        const experienceHistory = completedProjects.map(proj => ({
            id: proj.id,
            role: proj.job.title,
            company: proj.client.username,
            period: new Date(proj.updatedAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            rating: (proj as any).rating
        }));

        return NextResponse.json(
            {
                message: "Success",
                code: 200,
                data: {
                    ...freelancer,
                    stats: {
                        rating: Number(averageRating),
                        reviews: totalProjects,
                        successRate: successRate
                    },
                    experiences: experienceHistory
                }
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("GET_FREELANCER_DETAIL_ERROR:", error);
        return NextResponse.json(
            { message: "Internal Server Error", code: 500 },
            { status: 500 }
        );
    }
}