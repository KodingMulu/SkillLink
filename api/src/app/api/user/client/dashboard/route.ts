import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    if (!user || user.role !== "CLIENT") {
      return NextResponse.json({ message: "Forbidden: Client access only", code: 403 }, { status: 403 });
    }

    const [wallet, openJobsCount, activeProjectsCount] = await Promise.all([
      prisma.wallet.findUnique({
        where: { userId: user.id },
      }),
      prisma.job.count({
        where: {
          clientId: user.id,
          status: "OPEN",
        },
      }),

      prisma.project.count({
        where: {
          job: {
            clientId: user.id,
          },
          status: "IN_PROGRESS",
        },
      }),
    ]);

    const totalSpentAggregate = await prisma.transaction.aggregate({
        where: {
            wallet: { userId: user.id },
            type: "PAYMENT_OUT"
        },
        _sum: { amount: true }
    });

    return NextResponse.json({
      message: "Success fetching client dashboard",
      code: 200,
      data: {
        balance: wallet?.balance || 0,
        totalSpent: totalSpentAggregate._sum.amount || 0,
        stats: {
          openJobs: openJobsCount,
          activeProjects: activeProjectsCount,
        },
      },
    });

  } catch (error) {
    console.error("Client Dashboard Error:", error);
    return NextResponse.json({ message: "Internal Server Error", code: 500 }, { status: 500 });
  }
}