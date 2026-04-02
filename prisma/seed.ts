import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@altanbulag.mn" },
    update: {},
    create: {
      name: "Админ",
      email: "admin@altanbulag.mn",
      phone: "99999999",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("Admin created:", admin.email);

  // Delete old data in order
  await prisma.payment.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.wood.deleteMany();

  const sampleWoods = [
    { name: "Сибирь Нарс #001", species: "Нарс", lat: 50.318, lng: 106.495, price: 58200, diameter: 42, height: 18.5,
      photos: ["https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&h=600&fit=crop"] },
    { name: "Шинэс #002", species: "Шинэс", lat: 50.322, lng: 106.510, price: 75000, diameter: 45, height: 20,
      photos: ["https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=600&fit=crop"] },
    { name: "Сибирь Хуш #003", species: "Хуш", lat: 50.305, lng: 106.480, price: 120000, diameter: 60, height: 25,
      photos: ["https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&h=600&fit=crop"] },
    { name: "Цагаан Хус #004", species: "Хус", lat: 50.310, lng: 106.520, price: 35000, diameter: 20, height: 12,
      photos: ["https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=800&h=600&fit=crop"] },
    { name: "Шотланд Нарс #005", species: "Нарс", lat: 50.325, lng: 106.490, price: 65000, diameter: 35, height: 18,
      photos: ["https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800&h=600&fit=crop"] },
    { name: "Монгол Улиас #006", species: "Улиас", lat: 50.315, lng: 106.505, price: 45000, diameter: 28, height: 16,
      photos: ["https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&h=600&fit=crop"] },
    { name: "Хайлаас #007", species: "Бургас", lat: 50.308, lng: 106.498, price: 32000, diameter: 18, height: 10,
      photos: ["https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=800&h=600&fit=crop"] },
    { name: "Сибирь Шинэс #008", species: "Шинэс", lat: 50.330, lng: 106.485, price: 88000, diameter: 50, height: 22,
      photos: ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop"] },
    { name: "Зүрхэн Хус #009", species: "Хус", lat: 50.312, lng: 106.515, price: 42000, diameter: 22, height: 14,
      photos: ["https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?w=800&h=600&fit=crop"] },
    { name: "Даваанын Нарс #010", species: "Нарс", lat: 50.320, lng: 106.470, price: 95000, diameter: 55, height: 24,
      photos: ["https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=800&h=600&fit=crop"] },
  ];

  for (const w of sampleWoods) {
    const certNo = `ALT-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 4).toUpperCase()}`;
    await prisma.wood.create({
      data: {
        ...w,
        description: `${w.species} мод - Алтанбулаг сум`,
        certificateNo: certNo,
      },
    });
    await new Promise((r) => setTimeout(r, 15));
  }

  console.log("Sample woods created:", sampleWoods.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
