import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import TopNav from "@/components/TopNav";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "TreeMN | Алтанбулаг сумын модны бүртгэл",
  description: "Алтанбулаг Дижитал Консерватори - Модны эзэмшлийн бүртгэлийн систем",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" className="h-full">
      <body className="min-h-full flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed">
        <AuthProvider>
          <TopNav />
          <div className="flex flex-1">
            <Sidebar />
            <div className="flex-1 lg:ml-64 flex flex-col">
              {children}
              <Footer />
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
