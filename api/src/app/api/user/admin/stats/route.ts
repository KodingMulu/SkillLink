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

        return NextResponse.json({
            data: [
                {
                    title: "Total Users",
                    value: totalUsers,
                    growth: parseFloat(userGrowth.toFixed(1)),
                    subText: `${newUsersOfMonth} user baru bulan ini`,
                    type: "projects"
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