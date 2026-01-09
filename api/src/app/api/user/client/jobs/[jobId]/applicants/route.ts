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
            return NextResponse.json({ message: "Job ID is required" }, { status: 400 });
        }

        const user = await getAuthUser(req);
        if (!user || user.role !== "CLIENT") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const job = await prisma.job.findUnique({
            where: { id: jobId },
            select: { clientId: true }
        });

        if (!job) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        if (job.clientId !== user.id) {
            return NextResponse.json({ message: "Unauthorized access to this job" }, { status: 403 });
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

        return NextResponse.json({
            code: 200,
            data: proposals
        });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}