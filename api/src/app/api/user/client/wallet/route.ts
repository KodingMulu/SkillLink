// app/api/wallet/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";
import { snap } from "@/lib/midtrans";
import { TransactionType } from "@/generated/prisma"; 

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    let wallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
      include: {
        transactions: { orderBy: { createdAt: 'desc' }, take: 10 }
      }
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId: user.id, balance: 0 },
        include: { transactions: true }
      });
    }

    return NextResponse.json({ message: "Success", code: 200, data: wallet });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
        where: { id: auth.id }
    });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const body = await req.json();
    const { amount } = body;

    if (!amount || amount < 10000) {
      return NextResponse.json({ message: "Minimal top up Rp 10.000" }, { status: 400 });
    }

    let wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
    if (!wallet) {
      wallet = await prisma.wallet.create({ data: { userId: user.id, balance: 0 } });
    }

    const transaction = await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        amount: parseFloat(amount),
        type: TransactionType.DEPOSIT,
        status: "PENDING" 
      }
    });

    const parameter = {
      transaction_details: {
        order_id: transaction.id, 
        gross_amount: parseFloat(amount),
      },
      customer_details: {
        first_name: user.username || "Client",
        email: user.email,
      },
    };

    const midtransResponse = await snap.createTransaction(parameter);

    return NextResponse.json({
      message: "Token generated",
      code: 201,
      data: {
        token: midtransResponse.token,
        redirect_url: midtransResponse.redirect_url
      }
    });

  } catch (error) {
    console.error("Midtrans Error:", error);
    return NextResponse.json({ message: "Gagal memproses pembayaran" }, { status: 500 });
  }
}