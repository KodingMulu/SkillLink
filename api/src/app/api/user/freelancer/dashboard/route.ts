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

          //Get Data Wallet and Transaction
          const walletData = await prisma.wallet.findUnique({
               where: { userId: user.id },
               include: {
                    transactions: {
                         take: 5,
                         orderBy: { createdAt: "desc" },
                    },
               },
          });

          // Count Statistic Project
          const [activeProjects, completedProjects, totalApplied] = await Promise.all([
               prisma.project.count({
                    where: {
                         freelancerId: user.id,
                         status: "IN_PROGRESS",
                    },
               }),
               prisma.project.count({
                    where: {
                         freelancerId: user.id,
                         status: "COMPLETED",
                    },
               }),
               prisma.proposal.count({
                    where: {
                         freelancerId: user.id,
                         status: "PENDING",
                    },
               }),
          ]);

          // Return Data
          return NextResponse.json({
               message: "Success fetching dashboard data",
               code: 200,
               data: {
                    balance: walletData?.balance || 0,
                    stats: {
                         activeProjects,
                         completedProjects,
                         totalApplied,
                    },
                    recentTransactions: walletData?.transactions || [],
               },
          });
     } catch (error) {
          console.error("Dashboard Error:", error);
          return NextResponse.json({ message: "Internal Server Error", code: 500 }, { status: 500 });
     }
}