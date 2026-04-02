import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import LayoutShell from "@/components/LayoutShell";

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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed">
        <AuthProvider>
          <LayoutShell>{children}</LayoutShell>
        </AuthProvider>
      </body>
    </html>
  );
}
