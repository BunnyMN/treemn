import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createInvoice } from "@/lib/qpay";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Нэвтэрнэ үү" }, { status: 401 });
  }

  const { id } = await params;
  const wood = await prisma.wood.findUnique({ where: { id } });

  if (!wood) {
    return NextResponse.json({ error: "Мод олдсонгүй" }, { status: 404 });
  }

  if (wood.status !== "AVAILABLE") {
    return NextResponse.json({ error: "Энэ мод аль хэдийн эзэмшигчтэй" }, { status: 400 });
  }

  const transaction = await prisma.transaction.create({
    data: {
      type: "SALE",
      price: wood.price,
      woodId: wood.id,
      sellerId: wood.ownerId,
      buyerId: session.user.id,
    },
  });

  try {
    const invoiceCode = process.env.QPAY_INVOICE_CODE || "";
    const callbackUrl = `${process.env.NEXTAUTH_URL}/api/qpay/callback?txId=${transaction.id}`;

    const invoice = await createInvoice({
      invoiceCode,
      senderCode: transaction.id,
      amount: wood.price,
      description: `${wood.name} мод худалдан авах - ${wood.certificateNo}`,
      callbackUrl,
    });

    await prisma.payment.create({
      data: {
        amount: wood.price,
        qpayInvoiceId: invoice.invoice_id,
        qpayQrCode: invoice.qr_text,
        qpayUrl: invoice.qr_image,
        qpayUrls: invoice.urls,
        transactionId: transaction.id,
      },
    });

    return NextResponse.json({
      transactionId: transaction.id,
      qrImage: invoice.qr_image,
      qrText: invoice.qr_text,
      urls: invoice.urls,
    });
  } catch (e) {
    // Cancel the transaction if QPay fails
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: "CANCELLED" },
    });
    console.error("QPay error:", e);
    return NextResponse.json(
      { error: `QPay төлбөрийн систем алдаа: ${(e as Error).message}` },
      { status: 502 }
    );
  }
}
