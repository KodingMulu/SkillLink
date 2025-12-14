import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> } 
) {
  try {
    const { jobId } = await params; 

    const user = getAuthUser(req);
    if (!user || user.role !== "CLIENT") {
      return NextResponse.json({ message: "Forbidden", code: 403 }, { status: 403 });
    }

    const job = await prisma.job.findUnique({
        where: { id: jobId }
    });

    if (!job || job.clientId !== user.id) {
        return NextResponse.json({ message: "Job not found or Unauthorized", code: 404 }, { status: 404 });
    }

    const proposals = await prisma.proposal.findMany({
      where: {
        jobId: jobId,
      },
      include: {
        freelancer: {
          select: {
            id: true,
            username: true,
            email: true,
            skills: true,
          },
        },
      },
      orderBy: {
        bidAmount: "asc", 
      }
    });

    return NextResponse.json({
      message: "Success fetching proposals",
      code: 200,
      data: proposals,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error", code: 500 }, { status: 500 });
  }
}