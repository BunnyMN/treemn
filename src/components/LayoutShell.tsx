"use client";

import { usePathname } from "next/navigation";
import TopNav from "./TopNav";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const AUTH_PAGES = ["/login", "/register"];

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PAGES.includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <TopNav />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 lg:ml-64 flex flex-col">
          {children}
          <Footer />
        </div>
      </div>
    </>
  );
}
