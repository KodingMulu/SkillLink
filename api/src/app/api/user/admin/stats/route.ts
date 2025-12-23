import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

function calculateGrowth(current: number, previous: number) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
}

export async function GET() {
    try {
        const now = new Date();

        const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        //Stats Users
        const totalUsers = await prisma.user.count();

        const newUsersOfMonth = await prisma.user.count({
            where: {
                createdAt: {
                    gte: currentMonth
                }
            }
        });

        const newUsersLastMonth = await prisma.user.count({
            where: {
                createdAt: {
                    gte: lastMonth,
                    lt: currentMonth
                }
            }
        });

        const totalUsersLastMonth = totalUsers - newUsersLastMonth;
        const userGrowth = calculateGrowth(totalUsers, totalUsersLastMonth);

        //Stats Projects
        const activeProjects = await prisma.project.count({
            where: {
                status: "IN_PROGRESS"
            }
        });

        const newProjectsThisMonth = await prisma.job.count({
            where: {
                createdAt: {
                    gte: currentMonth
                }
            }
        })

        const newProjectsLastMonth = await prisma.job.count({
            where: {
                createdAt: {
                    gte: lastMonth,
                    lt: currentMonth
                }
            }
        })

        const projectGrowth = calculateGrowth(newProjectsThisMonth, newProjectsLastMonth);

        //Stats Transactions
        const totalTransactionAgg = await prisma.transaction.aggregate({
            _sum: {
                amount: true
            }
        });
        const totalRevenue = totalTransactionAgg._sum.amount || 0;

        const revenueThisMonthAgg = await prisma.transaction.aggregate({
            _sum: {
                amount: true
            },
            where: {
                createdAt: {
                    gte: currentMonth
                }
            }
        });
        const revenueThisMonth = revenueThisMonthAgg._sum.amount || 0;

        const revenueLastMonthAgg = await prisma.transaction.aggregate({
            _sum: {
                amount: true
            },
            where: {
                createdAt: {
                    gte: lastMonth,
                    lt: currentMonth
                }
            }
        });
        const revenueLastMonth = revenueLastMonthAgg._sum.amount || 0;

        const revenueGrowth = calculateGrowth(revenueThisMonth, revenueLastMonth);

        //Stats Report Pending
        const pendingReports = await prisma.proposal.count({
            where: {
                status: 'PENDING'
            }
        });

        const pendingReportsGrowth = -5.3;

        return NextResponse.json({
            data: [
                {
                    title: "Total Users",
                    value: totalUsers,
                    growth: parseFloat(userGrowth.toFixed(1)),
                    subText: `${newUsersOfMonth} user baru bulan ini`,
                    type: "users"
                },
                {
                    title: "Projek Aktif",
                    value: activeProjects,
                    growth: parseFloat(projectGrowth.toFixed(1)),
                    subText: `${newProjectsThisMonth} projek baru bulan ini`,
                    type: "projects"
                },
                {
                    title: "Total Transaksi",
                    value: totalRevenue,
                    growth: parseFloat(revenueGrowth.toFixed(1)),
                    subtext: "Revenue bulan ini",
                    type: "transactions"
                },
                {
                    title: "Laporan Pending",
                    value: pendingReports,
                    growth: pendingReportsGrowth,
                    subtext: "Perlu ditinjau",
                    type: "reports"
                }
            ]
        })
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}