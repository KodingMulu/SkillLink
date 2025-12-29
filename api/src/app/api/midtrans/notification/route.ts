import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, status_code, gross_amount, signature_key, transaction_status } = body;
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const hashString = order_id + status_code + gross_amount + serverKey;
    const generatedSignature = crypto.createHash("sha512").update(hashString).digest("hex");

    if (generatedSignature !== signature_key) {
      return NextResponse.json({ message: "Invalid Signature" }, { status: 403 });
    }

    let paymentSuccess = false;
    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      paymentSuccess = true;
    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      paymentSuccess = false;
    } else if (transaction_status === 'pending') {
      return NextResponse.json({ message: "Pending" }, { status: 200 });
    }

    if (paymentSuccess) {
      await prisma.$transaction(async (tx) => {
        const existingTx = await tx.transaction.findUnique({ where: { id: order_id } });
        if (existingTx && existingTx.status === 'PENDING') {
          await tx.transaction.update({
            where: { id: order_id },
            data: { status: 'COMPLETED' }
          });

          await tx.wallet.update({
            where: { id: existingTx.walletId },
            data: { balance: { increment: existingTx.amount } }
          });
        }
      });
    } else {
      await prisma.transaction.update({
        where: { id: order_id },
        data: { status: 'FAILED' }
      });
    }

    return NextResponse.json({ message: "Notification processed" }, { status: 200 });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}