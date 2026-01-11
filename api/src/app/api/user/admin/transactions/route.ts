import prisma from "@/lib/prisma";
import { Prisma, TransactionStatus } from "@/generated/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status") || "all";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        let statusFilter: TransactionStatus | undefined;
        if (status === 'success') statusFilter = 'COMPLETED';
        else if (status === 'pending') statusFilter = 'PENDING';
        else if (status === 'failed') statusFilter = 'FAILED';

        const whereCondition: Prisma.TransactionWhereInput = {
            AND: [
                search ? {
                    OR: [
                        { id: { contains: search, mode: 'insensitive' } },
                        { wallet: { user: { username: { contains: search, mode: 'insensitive' } } } },
                        { wallet: { user: { email: { contains: search, mode: 'insensitive' } } } }
                    ]
                } : {},
                statusFilter ? {
                    status: statusFilter
                } : {}
            ]
        };

        const [transactions, total] = await prisma.$transaction([
            prisma.transaction.findMany({
                where: whereCondition,
                include: {
                    wallet: {
                        include: {
                            user: {
                                select: { username: true, email: true }
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit,
            }),
            prisma.transaction.count({ where: whereCondition })
        ]);

        const formattedTransactions = transactions.map(tx => {
            let displayStatus = 'pending';
            if (tx.status === 'COMPLETED') displayStatus = 'success';
            else if (tx.status === 'FAILED') displayStatus = 'failed';

            let description = "Transaksi Umum";
            switch (tx.type) {
                case 'DEPOSIT': description = "Top Up Saldo"; break;
                case 'WITHDRAWAL': description = "Penarikan Dana"; break;
                case 'PAYMENT_OUT': description = "Pembayaran Proyek"; break;
                case 'PAYMENT_IN': description = "Penerimaan Dana Proyek"; break;
                case 'REFUND': description = "Pengembalian Dana"; break;
            }

            return {
                id: tx.id,
                user: tx.wallet.user.username || tx.wallet.user.email,
                project: description,
                amount: new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0
                }).format(Number(tx.amount)),
                method: tx.wallet.bankName || "Wallet",
                status: displayStatus,
                date: new Date(tx.createdAt).toLocaleDateString("id-ID", {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })
            };
        });

        return NextResponse.json({
            data: formattedTransactions,
            pagination: {
                total,
                page,
                totalPages: Math.ceil(total / limit),
                limit
            }
        });

    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}