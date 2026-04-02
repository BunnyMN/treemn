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

  const sampleWoods = [
    { name: "Нарс #001", species: "Нарс", lat: 50.315, lng: 106.495, price: 50000, diameter: 30, height: 15 },
    { name: "Шинэс #002", species: "Шинэс", lat: 50.320, lng: 106.510, price: 75000, diameter: 45, height: 20 },
    { name: "Хуш #003", species: "Хуш", lat: 50.305, lng: 106.480, price: 120000, diameter: 60, height: 25 },
    { name: "Хус #004", species: "Хус", lat: 50.310, lng: 106.520, price: 35000, diameter: 20, height: 12 },
    { name: "Нарс #005", species: "Нарс", lat: 50.325, lng: 106.490, price: 65000, diameter: 35, height: 18 },
  ];

  for (const w of sampleWoods) {
    const certNo = `ALT-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 4).toUpperCase()}`;
    await prisma.wood.create({
      data: {
        ...w,
        description: `${w.species} мод - Алтанбулаг сум`,
        certificateNo: certNo,
        photos: [],
      },
    });
    await new Promise((r) => setTimeout(r, 10));
  }

  console.log("Sample woods created:", sampleWoods.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
