import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";

export async function PATCH(req: NextRequest, { params }: { params: { proposalId: string } }) {
    try {
        const user = await getAuthUser(req);
        if (!user || user.role !== "CLIENT") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const { status } = await req.json(); // status: 'ACCEPTED' | 'REJECTED'
        const { proposalId } = params;

        const proposal = await prisma.proposal.findUnique({
            where: { id: proposalId },
            include: { job: true }
        });

        if (!proposal || proposal.job.clientId !== user.id) {
            return NextResponse.json({ message: "Proposal not found or unauthorized" }, { status: 404 });
        }

        const updatedProposal = await prisma.proposal.update({
            where: { id: proposalId },
            data: { status }
        });

        if (status === 'ACCEPTED') {
            await prisma.job.update({
                where: { id: proposal.jobId },
                data: { status: 'IN_PROGRESS' }
            });

            const existingProject = await prisma.project.findUnique({
                where: { jobId: proposal.jobId }
            });

            if (!existingProject) {
                await prisma.project.create({
                    data: {
                        jobId: proposal.jobId,
                        clientId: user.id,
                        freelancerId: proposal.freelancerId,
                        status: 'IN_PROGRESS',
                        progress: 0
                    }
                });
            }
        }

        return NextResponse.json({
            code: 200,
            message: `Proposal ${status.toLowerCase()}`,
            data: updatedProposal
        });

    } catch (error) {
        console.error("Update Proposal Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}