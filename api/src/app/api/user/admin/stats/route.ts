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

        //Stats Users
        const totalUsers = await prisma.user.count();
        const pendingVerificationUsers = await prisma.user.count({ where: { isVerified: false }});
        const newUsersOfMonth = await prisma.user.count({ where: { createdAt: { gte: currentMonth }}});
        const newUsersLastMonth = await prisma.user.count({ where: { createdAt: { gte: lastMonth, lt: currentMonth }}});
        const userGrowth = calculateGrowth(totalUsers, totalUsers - newUsersLastMonth);

        //Stats Projects
        const activeProjects = await prisma.project.count({where: { status: "IN_PROGRESS" }});
        const completedProjects = await prisma.project.count({ where: { status: 'COMPLETED' }});
        const totalAllProjects = await prisma.project.count();

        //Stats Job
        const newProjectsThisMonth = await prisma.job.count({ where: { createdAt: { gte: currentMonth }}});
        const newProjectsLastMonth = await prisma.job.count({ where: { createdAt: { gte: lastMonth, lt: currentMonth }}});
        const projectGrowth = calculateGrowth(newProjectsThisMonth, newProjectsLastMonth);

        //Stats Transactions
        const revenueAgg = await prisma.transaction.aggregate({ _sum: { amount: true } });
        const totalRevenue = revenueAgg._sum.amount || 0;
        const revThisMonthAgg = await prisma.transaction.aggregate({ _sum: { amount: true }, where: { createdAt: { gte: currentMonth } } });
        const revThisMonth = revThisMonthAgg._sum.amount || 0;
        const revLastMonthAgg = await prisma.transaction.aggregate({ _sum: { amount: true }, where: { createdAt: { gte: lastMonth, lt: currentMonth } } });
        const revLastMonth = revLastMonthAgg._sum.amount || 0;
        const revenueGrowth = calculateGrowth(revThisMonth, revLastMonth);

        const successTrx = await prisma.transaction.count({ where: { status: 'COMPLETED' } });
        const pendingTrx = await prisma.transaction.count({ where: { status: 'PENDING' } });
        const failedTrx = await prisma.transaction.count({ where: { status: 'FAILED' } });

        //Stats Report Pending
        const pendingReports = await prisma.proposal.count({ where: { status: 'PENDING' } });
        const projectValueAgg = await prisma.job.aggregate({
            _sum: { budget: true },
            where: { project: { isNot: null } }
        });
        const totalProjectValue = projectValueAgg._sum.budget || 0;

        return NextResponse.json({
            mainStats: [
                {
                    type: "users",
                    label: "Total User",
                    value: totalUsers,
                    growth: parseFloat(userGrowth.toFixed(1)),
                    subtext: `${newUsersOfMonth} user baru bulan ini`
                },
                {
                    type: "active_projects",
                    label: "Proyek Aktif",
                    value: activeProjects,
                    growth: parseFloat(projectGrowth.toFixed(1)),
                    subtext: `${newProjectsThisMonth} proyek baru`
                },
                {
                    type: "revenue",
                    label: "Total Transaksi",
                    value: totalRevenue,
                    growth: parseFloat(revenueGrowth.toFixed(1)),
                    subtext: "Revenue bulan ini"
                },
                {
                    type: "pending",
                    label: "Laporan Pending",
                    value: pendingReports,
                    growth: -5.3,
                    subtext: "Perlu ditinjau"
                }
            ],
            projectStats: [
                {
                    type: "total",
                    label: "TOTAL PROYEK",
                    value: totalAllProjects,
                    color: "blue"
                },
                {
                    type: "completed",
                    label: "SELESAI",
                    value: completedProjects,
                    color: "emerald"
                },
                {
                    type: "in_progress",
                    label: "BERJALAN",
                    value: activeProjects,
                    color: "orange"
                },
                {
                    type: "value",
                    label: "TOTAL NILAI",
                    value: totalProjectValue,
                    color: "purple"
                }
            ],
            userStats: [
                {
                    type: "total_users",
                    label: "Total User",
                    value: totalUsers,
                    icon: "users",
                    color: "blue"
                },
                {
                    type: "pending_verification",
                    label: "Menunggu Verifikasi",
                    value: pendingVerificationUsers,
                    icon: "clock",
                    color: "orange"
                },
                {
                    type: "active_monthly",
                    label: "Aktif Bulan Ini",
                    value: newUsersOfMonth,
                    prefix: "+", 
                    icon: "check",
                    color: "emerald"
                }
            ],
            transactionStats: [
                { 
                    type: "total_volume", 
                    label: "Total Volume", 
                    value: totalRevenue, 
                    growth: parseFloat(revenueGrowth.toFixed(1)), 
                    icon: "arrow-up-right",
                    color: "blue" 
                },
                { 
                    type: "success", 
                    label: "Berhasil", 
                    value: successTrx, 
                    icon: "check-circle",
                    color: "emerald" 
                },
                { 
                    type: "pending", 
                    label: "Menunggu", 
                    value: pendingTrx, 
                    icon: "clock",
                    color: "orange" 
                },
                { 
                    type: "failed", 
                    label: "Gagal/Batal", 
                    value: failedTrx, 
                    icon: "x-circle",
                    color: "red" 
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