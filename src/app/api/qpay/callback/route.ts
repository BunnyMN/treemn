import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkPayment } from "@/lib/qpay";

export async function GET(req: NextRequest) {
  const txId = req.nextUrl.searchParams.get("txId");
  if (!txId) {
    return NextResponse.json({ error: "txId missing" }, { status: 400 });
  }

  const payment = await prisma.payment.findFirst({
    where: { transactionId: txId },
    include: { transaction: true },
  });

  if (!payment || !payment.qpayInvoiceId) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  const result = await checkPayment(payment.qpayInvoiceId);

  if (result.count > 0) {
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: "PAID" },
      }),
      prisma.transaction.update({
        where: { id: txId },
        data: { status: "COMPLETED" },
      }),
      prisma.wood.update({
        where: { id: payment.transaction.woodId },
        data: {
          status: "SOLD",
          ownerId: payment.transaction.buyerId,
        },
      }),
    ]);

    return NextResponse.json({ status: "PAID" });
  }

  return NextResponse.json({ status: "PENDING" });
}
