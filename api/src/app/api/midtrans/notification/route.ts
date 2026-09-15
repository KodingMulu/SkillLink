import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      console.error("Midtrans Notification Error: MIDTRANS_SERVER_KEY is missing.");
      return NextResponse.json(
        { message: "Server Configuration Error", code: 500 },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { order_id, status_code, gross_amount, signature_key, transaction_status } = body;

    if (!order_id || !status_code || !gross_amount || !signature_key) {
      return NextResponse.json(
        { message: "Invalid payload parameters", code: 400 },
        { status: 400 }
      );
    }

    const hashString = order_id + status_code + gross_amount + serverKey;
    const generatedSignature = crypto.createHash("sha512").update(hashString).digest("hex");

    if (generatedSignature !== signature_key) {
      return NextResponse.json(
        { message: "Invalid Signature", code: 403 },
        { status: 403 }
      );
    }

    let paymentSuccess = false;
    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      paymentSuccess = true;
    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      paymentSuccess = false;
    } else if (transaction_status === 'pending') {
      return NextResponse.json(
        { message: "Transaction pending", code: 200 },
        { status: 200 }
      );
    }

    const existingTx = await prisma.transaction.findUnique({
      where: { id: order_id }
    });

    if (!existingTx) {
      return NextResponse.json(
        { message: "Transaction record not found", code: 404 },
        { status: 404 }
      );
    }

    if (paymentSuccess) {
      if (existingTx.status === 'PENDING') {
        await prisma.$transaction(async (tx) => {
          await tx.transaction.update({
            where: { id: order_id },
            data: { status: 'COMPLETED' }
          });

          await tx.wallet.update({
            where: { id: existingTx.walletId },
            data: { balance: { increment: existingTx.amount } }
          });
        });
      }
    } else {
      if (existingTx.status === 'PENDING') {
        await prisma.transaction.update({
          where: { id: order_id },
          data: { status: 'FAILED' }
        });
      }
    }

    return NextResponse.json(
      { message: "Notification processed successfully", code: 200 },
      { status: 200 }
    );

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", code: 500 },
      { status: 500 }
    );
  }
}