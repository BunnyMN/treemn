"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const navItems = [
  { href: "/", icon: "map", label: "Хиймэл дагуулын зураг" },
  { href: "/profile", icon: "database", label: "Модны бүртгэл" },
  { href: "/market", icon: "storefront", label: "Зах зээл" },
  { href: "/wallet", icon: "account_balance_wallet", label: "Хэтэвч" },
];

const adminItem = { href: "/admin", icon: "dashboard", label: "Админ удирдлага" };

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-[72px] h-[calc(100vh-72px)] w-64 p-4 bg-surface text-sm z-40">
      <div className="flex items-center gap-3 mb-8 px-4">
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary-container">park</span>
        </div>
        <div>
          <h2 className="font-headline font-black text-emerald-900 tracking-tight leading-none">TreeMN</h2>
          <p className="text-xs text-stone-500">Алтанбулаг сум</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 transition-all duration-200 ${
              pathname === item.href
                ? "bg-emerald-100 text-emerald-900 rounded-lg font-semibold"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
        {session?.user?.role === "ADMIN" && (
          <Link
            href={adminItem.href}
            className={`flex items-center gap-3 px-4 py-2 transition-all duration-200 ${
              pathname === adminItem.href
                ? "bg-emerald-100 text-emerald-900 rounded-lg font-semibold"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <span className="material-symbols-outlined">{adminItem.icon}</span>
            <span>{adminItem.label}</span>
          </Link>
        )}
      </nav>

      <div className="mt-auto space-y-1 pt-4 border-t border-surface-container">
        <a className="flex items-center gap-3 text-stone-600 px-4 py-2 hover:bg-stone-100 transition-all" href="#">
          <span className="material-symbols-outlined">settings</span>
          <span>Тохиргоо</span>
        </a>
        <a className="flex items-center gap-3 text-stone-600 px-4 py-2 hover:bg-stone-100 transition-all" href="#">
          <span className="material-symbols-outlined">help</span>
          <span>Тусламж</span>
        </a>
        <button className="w-full mt-4 bg-primary text-on-primary py-3 rounded-xl font-bold tracking-tight hover:opacity-90 transition-opacity">
          Худалдаа хийх
        </button>
      </div>
    </aside>
  );
}
