import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const wood = await prisma.wood.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, phone: true } },
      transactions: {
        include: {
          buyer: { select: { name: true } },
          seller: { select: { name: true } },
          payment: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!wood) {
    return NextResponse.json({ error: "Олдсонгүй" }, { status: 404 });
  }

  return NextResponse.json(wood);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Зөвшөөрөлгүй" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  const wood = await prisma.wood.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(wood);
}
