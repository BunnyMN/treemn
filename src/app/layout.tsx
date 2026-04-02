import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TreeMN - Алтанбулаг сумын модны бүртгэл",
  description: "Алтанбулаг сумын модны эзэмшлийн бүртгэлийн систем",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
