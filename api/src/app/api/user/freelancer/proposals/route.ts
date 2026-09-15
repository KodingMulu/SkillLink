import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";

export async function POST(req: NextRequest) {
    try {
        const user = await getAuthUser(req);
        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized: Token missing or invalid", code: 401 },
                { status: 401 }
            );
        }

        if (user.role !== "FREELANCER") {
            return NextResponse.json(
                { message: "Forbidden: Freelancer access only", code: 403 },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { jobId, coverLetter, bidAmount } = body;

        if (!jobId || !coverLetter || !bidAmount || isNaN(Number(bidAmount)) || Number(bidAmount) <= 0) {
            return NextResponse.json(
                { message: "Job ID, surat lamaran (cover letter), dan nominal tawaran (bid amount > 0) wajib diisi", code: 400 },
                { status: 400 }
            );
        }

        const targetJob = await prisma.job.findUnique({
            where: { id: jobId }
        });

        if (!targetJob) {
            return NextResponse.json(
                { message: "Pekerjaan tidak ditemukan", code: 404 },
                { status: 404 }
            );
        }

        if (targetJob.status !== "OPEN") {
            return NextResponse.json(
                { message: "Pekerjaan ini sudah tidak menerima lamaran baru", code: 400 },
                { status: 400 }
            );
        }

        const existingProposal = await prisma.proposal.findFirst({
            where: {
                jobId: jobId,
                freelancerId: user.id
            }
        });

        if (existingProposal) {
            return NextResponse.json(
                { message: "Anda sudah mengirimkan proposal untuk pekerjaan ini", code: 400 },
                { status: 400 }
            );
        }

        const newProposal = await prisma.proposal.create({
            data: {
                coverLetter,
                bidAmount: parseFloat(String(bidAmount)),
                status: "PENDING",
                jobId: jobId,
                freelancerId: user.id
            }
        });

        return NextResponse.json(
            {
                message: "Lamaran berhasil dikirim",
                code: 201,
                data: newProposal
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Proposal Submission Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", code: 500 },
            { status: 500 }
        );
    }
}