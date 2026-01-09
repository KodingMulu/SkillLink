import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";

export async function POST(req: NextRequest) {
    try {
        const user = await getAuthUser(req);
        if (!user || user.role !== "FREELANCER") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const { jobId, coverLetter, bidAmount } = body;

        // Prisma akan otomatis mengisi createdAt & updatedAt
        const newProposal = await prisma.proposal.create({
            data: {
                coverLetter,
                bidAmount: parseFloat(bidAmount),
                status: "PENDING",
                jobId: jobId,
                freelancerId: user.id
            }
        });

        return NextResponse.json({
            message: "Lamaran berhasil dikirim",
            code: 201,
            data: newProposal
        }, { status: 201 });

    } catch (error) {
        console.error("Proposal Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}