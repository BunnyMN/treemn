import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";

export async function GET() {
  const woods = await prisma.wood.findMany({
    include: { owner: { select: { id: true, name: true, phone: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(woods);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Зөвшөөрөлгүй" }, { status: 403 });
  }

  const body = await req.json();
  const { name, species, description, diameter, height, lat, lng, price, photos } = body;

  if (!name || !species || !lat || !lng || !price) {
    return NextResponse.json({ error: "Шаардлагатай талбарууд дутуу" }, { status: 400 });
  }

  const certNo = `ALT-${Date.now().toString(36).toUpperCase()}`;
  const qrData = `https://altanbulag.mn/cert/${certNo}`;
  const qrCode = await QRCode.toDataURL(qrData);

  const wood = await prisma.wood.create({
    data: {
      name,
      species,
      description,
      diameter,
      height,
      lat,
      lng,
      price,
      photos: photos || [],
      certificateNo: certNo,
      qrCode,
    },
  });

  return NextResponse.json(wood);
}
