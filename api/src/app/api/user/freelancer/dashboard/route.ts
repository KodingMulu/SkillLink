import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized", code: 401 },
        { status: 401 }
      );
    }

    const userId = user.id;
    const now = new Date();
    const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      walletData,
      totalRevenueData,
      activeProjectsCount,
      activeProjectsLastMonth,
      completedProjectsCount,
      completedProjectsLastMonth,
      ratingData,
      activeProjectsList,
      recommendedJobs
    ] = await Promise.all([
      prisma.wallet.findUnique({
        where: { userId: userId },
        include: {
          transactions: {
            take: 5,
            orderBy: { createdAt: "desc" },
          },
        },
      }),

      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          wallet: { userId: userId },
          type: "PAYMENT_IN",
        },
      }),

      prisma.project.count({
        where: { freelancerId: userId, status: "IN_PROGRESS" },
      }),
      prisma.project.count({
        where: {
          freelancerId: userId,
          status: "IN_PROGRESS",
          createdAt: { lte: endLastMonth },
        },
      }),

      prisma.project.count({
        where: { freelancerId: userId, status: "COMPLETED" },
      }),
      prisma.project.count({
        where: {
          freelancerId: userId,
          status: "COMPLETED",
          updatedAt: { lte: endLastMonth },
        },
      }),

      prisma.review.aggregate({
        _avg: { rating: true },
        where: { project: { freelancerId: userId } },
      }),

      prisma.project.findMany({
        where: {
          freelancerId: userId,
          status: "IN_PROGRESS",
        },
        take: 5, 
        orderBy: { updatedAt: "desc" },
        include: {
          job: {
            select: {
              title: true,
              deadline: true, 
              client: {       
                select: {
                  username: true,
                  email: true
                }
              }
            }
          }
        }
      }),

      prisma.job.findMany({
        where: {
          status: "OPEN",
          proposals: {
            none: {
              freelancerId: userId 
            }
          }
        },
        take: 3, 
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          budget: true,
          tags: true,
        }
      })
    ]);

    const totalRevenue = totalRevenueData._sum.amount || 0;
    const avgRating = ratingData._avg.rating
      ? Number(ratingData._avg.rating.toFixed(1))
      : 0;

    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Number((((current - previous) / previous) * 100).toFixed(1));
    };

    const formatDeadline = (date: Date | null | undefined) => {
      if (!date) return "Tidak ada deadline";
      const deadlineDate = new Date(date);
      const diffTime = deadlineDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return "Terlewat";
      if (diffDays === 0) return "Hari ini";
      return `${diffDays} Hari lagi`;
    };

    const formatBudgetShort = (amount: number) => {
      if (amount >= 1000000) {
        return `Rp ${(amount / 1000000).toLocaleString('id-ID')}jt`;
      } else if (amount >= 1000) {
        return `Rp ${(amount / 1000).toLocaleString('id-ID')}rb`;
      }
      return `Rp ${amount.toLocaleString('id-ID')}`;
    };

    const formattedActiveProjects = activeProjectsList.map((project) => ({
      id: project.id,
      title: project.job.title,
      client: project.job.client?.username || project.job.client?.email || "Client",
      deadline: formatDeadline(project.job.deadline),
      progress: project.progress,
      status: "On Progress",
    }));

    const formattedRecommendations = recommendedJobs.map((job) => ({
      id: job.id,
      title: job.title,
      description: job.description,
      budget: formatBudgetShort(job.budget),
      tags: job.tags.length > 0 ? job.tags : ["Remote", "Project"] 
    }));

    return NextResponse.json({
      message: "Success fetching dashboard data",
      code: 200,
      data: {
        stats: {
          revenue: {
            value: totalRevenue,
            growth: 12.5, 
            label: "Total Pendapatan"
          },
          activeProjects: {
            value: activeProjectsCount,
            growth: calculateGrowth(activeProjectsCount, activeProjectsLastMonth),
            label: "Proyek Aktif"
          },
          completedProjects: {
            value: completedProjectsCount,
            growth: calculateGrowth(completedProjectsCount, completedProjectsLastMonth),
            label: "Selesai"
          },
          rating: {
            value: avgRating,
            growth: 0,
            label: "Rating"
          }
        },
        activeProjects: formattedActiveProjects,
        recommendedJobs: formattedRecommendations,
        walletBalance: walletData?.balance || 0,
        recentTransactions: walletData?.transactions || [],
      },
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", code: 500 },
      { status: 500 }
    );
  }
}