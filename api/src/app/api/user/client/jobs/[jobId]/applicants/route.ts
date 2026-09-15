import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ jobId: string }> }
) {
    try {
        const { jobId } = await params;

        if (!jobId) {
            return NextResponse.json(
                { message: "Job ID is required", code: 400 },
                { status: 400 }
            );
        }

        const user = await getAuthUser(req);
        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized: Token missing or invalid", code: 401 },
                { status: 401 }
            );
        }
        if (user.role !== "CLIENT") {
            return NextResponse.json(
                { message: "Forbidden: Client access only", code: 403 },
                { status: 403 }
            );
        }

        const job = await prisma.job.findUnique({
            where: { id: jobId },
            select: { clientId: true }
        });

        if (!job) {
            return NextResponse.json(
                { message: "Job not found", code: 404 },
                { status: 404 }
            );
        }

        if (job.clientId !== user.id) {
            return NextResponse.json(
                { message: "Unauthorized access to this job", code: 403 },
                { status: 403 }
            );
        }

        const proposals = await prisma.proposal.findMany({
            where: { jobId },
            include: {
                freelancer: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        title: true,
                        skills: true,
                        location: true,
                        bio: true
                    }
                }
            },
            orderBy: { id: 'desc' }
        });

        return NextResponse.json(
            {
                message: "Success",
                code: 200,
                data: proposals
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("GET_JOB_APPLICANTS_ERROR:", error);
        return NextResponse.json(
            { message: "Internal Server Error", code: 500 },
            { status: 500 }
        );
    }
}