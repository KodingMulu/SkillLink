import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";

export async function PATCH(
    req: NextRequest,
    props: { params: Promise<{ proposalId: string }> }
) {
    try {
        const params = await props.params;
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

        const body = await req.json();
        const { status } = body; // status: 'ACCEPTED' | 'REJECTED'
        const { proposalId } = params;

        if (!proposalId) {
            return NextResponse.json(
                { message: "Proposal ID is required", code: 400 },
                { status: 400 }
            );
        }

        if (!status || (status !== "ACCEPTED" && status !== "REJECTED")) {
            return NextResponse.json(
                { message: "Status harus bertipe ACCEPTED atau REJECTED", code: 400 },
                { status: 400 }
            );
        }

        const proposal = await prisma.proposal.findUnique({
            where: { id: proposalId },
            include: { job: true }
        });

        if (!proposal || proposal.job.clientId !== user.id) {
            return NextResponse.json(
                { message: "Proposal tidak ditemukan atau tidak memiliki akses", code: 404 },
                { status: 404 }
            );
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

        return NextResponse.json(
            {
                message: `Proposal ${status.toLowerCase()}`,
                code: 200,
                data: updatedProposal
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("UPDATE_PROPOSAL_ERROR:", error);
        return NextResponse.json(
            { message: "Internal Server Error", code: 500 },
            { status: 500 }
        );
    }
}