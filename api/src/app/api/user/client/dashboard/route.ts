import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    
    if (!user || user.role !== "CLIENT") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const [wallet, openJobsCount, newApplicantsCount, completedContractsCount] = await Promise.all([
      prisma.wallet.findUnique({
        where: { userId: user.id },
      }),
      prisma.job.count({
        where: {
          clientId: user.id,
          status: "OPEN",
        },
      }),
      prisma.proposal.count({
        where: {
          job: { clientId: user.id },
          status: "PENDING",
        },
      }),
      prisma.project.count({
        where: {
          job: { clientId: user.id },
          status: "COMPLETED",
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

    const recentApplicants = await prisma.proposal.findMany({
        where: {
            job: { clientId: user.id }
        },
        orderBy: { id: 'desc' },
        take: 3,
        include: {
            freelancer: {
                select: { username: true, title: true }
            },
            job: {
                select: { title: true }
            }
        }
    });

    const activeContracts = await prisma.project.findMany({
        where: {
            job: { clientId: user.id },
            status: "IN_PROGRESS"
        },
        include: {
            freelancer: {
                select: { username: true }
            },
            job: {
                select: { title: true, budget: true, deadline: true }
            }
        },
        take: 3
    });

    const formattedApplicants = recentApplicants.map(app => ({
        id: app.id,
        name: app.freelancer.username || "Unknown",
        role: app.freelancer.title || "Freelancer",
        appliedFor: app.job.title,
        date: "Baru saja", 
        match: 0 
    }));

    const formattedContracts = activeContracts.map(contract => ({
        id: contract.id,
        freelancerName: contract.freelancer.username || "Unknown",
        projectTitle: contract.job.title,
        progress: contract.progress,
        deadline: contract.job.deadline ? new Date(contract.job.deadline).toLocaleDateString("id-ID") : "-",
        budget: Number(contract.job.budget)
    }));

    return NextResponse.json({
      data: {
        stats: {
            totalSpent: Number(totalSpentAggregate._sum.amount) || 0,
            openJobs: openJobsCount,
            newApplicants: newApplicantsCount,
            completedContracts: completedContractsCount
        },
        recentApplicants: formattedApplicants,
        activeContracts: formattedContracts
      },
    });

  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}