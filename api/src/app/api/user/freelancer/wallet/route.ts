import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";

const ADMIN_FEE = 5000;

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== "FREELANCER") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    let wallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: user.id,
        },
        include: {
          transactions: true,
        },
      });
    }

    return NextResponse.json({
      code: 200,
      data: {
        ...wallet,
        balance: Number(wallet.balance),
        transactions: wallet.transactions.map((t) => ({
          ...t,
          amount: Number(t.amount),
        })),
      },
    });
  } catch (error) {
    console.error("GET WALLET ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== "FREELANCER") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const withdrawAmount = Number(body.amount);

    if (!withdrawAmount || withdrawAmount <= 0) {
      return NextResponse.json(
        { message: "Invalid withdraw amount" },
        { status: 400 }
      );
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
    });

    if (!wallet) {
      return NextResponse.json(
        { message: "Wallet not found" },
        { status: 404 }
      );
    }

    const currentBalance = Number(wallet.balance);
    const totalDeduction = withdrawAmount + ADMIN_FEE;

    if (currentBalance < totalDeduction) {
      return NextResponse.json(
        { message: "Saldo tidak mencukupi + biaya admin" },
        { status: 400 }
      );
    }

    const [updatedWallet] = await prisma.$transaction([
      prisma.wallet.update({
        where: { userId: user.id },
        data: {
          balance: {
            decrement: totalDeduction,
          },
        },
      }),
      prisma.transaction.create({
        data: {
          walletId: wallet.id,
          amount: withdrawAmount,
          type: "WITHDRAWAL",
          status: "COMPLETED",
        },
      }),
    ]);

    return NextResponse.json({
      code: 200,
      message: "Withdrawal successful",
      data: {
        newBalance: Number(updatedWallet.balance),
        adminFee: ADMIN_FEE,
      },
    });
  } catch (error) {
    console.error("WITHDRAW ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
