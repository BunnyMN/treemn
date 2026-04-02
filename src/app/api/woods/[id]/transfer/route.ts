import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Нэвтэрнэ үү" }, { status: 401 });
  }

  const { id } = await params;
  const { buyerEmail } = await req.json();

  const wood = await prisma.wood.findUnique({ where: { id } });

  if (!wood || wood.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Эрхгүй" }, { status: 403 });
  }

  const buyer = await prisma.user.findUnique({ where: { email: buyerEmail } });
  if (!buyer) {
    return NextResponse.json({ error: "Хүлээн авагч олдсонгүй" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.transaction.create({
      data: {
        type: "TRANSFER",
        status: "COMPLETED",
        woodId: wood.id,
        sellerId: session.user.id,
        buyerId: buyer.id,
      },
    }),
    prisma.wood.update({
      where: { id },
      data: { ownerId: buyer.id },
    }),
  ]);

  return NextResponse.json({ success: true });
}
