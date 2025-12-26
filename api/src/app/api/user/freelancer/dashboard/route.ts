import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
     try {
          //Check User
          const user = getAuthUser(req);
          if (!user) {
               return NextResponse.json({ message: "Unauthorized", code: 401 }, { status: 401 });
          }

          const userId = user.id;
          const now = new Date();
          const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

          //Get All Data
          const [
               walletData,
               totalRevenueData,
               activeProjects,
               activeProjectsLastMonth,
               completedProjects,
               completedProjectsLastMonth,
               ratingData
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
          ]);

          const totalRevenue = totalRevenueData._sum.amount || 0;

          const avgRating = ratingData._avg.rating
               ? Number(ratingData._avg.rating.toFixed(1))
               : 0;

          const calculateGrowth = (current: number, previous: number) => {
               if (previous === 0) return current > 0 ? 100 : 0;
               return Number((((current - previous) / previous) * 100).toFixed(1));
          };

          // Return Data
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
                              value: activeProjects,
                              growth: calculateGrowth(activeProjects, activeProjectsLastMonth),
                              label: "Proyek Aktif"
                         },
                         completedProjects: {
                              value: completedProjects,
                              growth: calculateGrowth(completedProjects, completedProjectsLastMonth),
                              label: "Selesai"
                         },
                         rating: {
                              value: avgRating,
                              growth: 0,
                              label: "Rating"
                         }
                    },
               },
               walletBalance: walletData?.balance || 0,
               recentTransactions: walletData?.transactions || [],
          });
     } catch (error) {
          console.error("Dashboard Error:", error);
          return NextResponse.json({ message: "Internal Server Error", code: 500 }, { status: 500 });
     }
}