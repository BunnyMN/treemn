"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { href: "/", label: "Газрын зураг" },
  { href: "/profile", label: "Бүртгэл" },
  { href: "/market", label: "Худалдаа" },
  { href: "/profile", label: "Профайл" },
];

export default function TopNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <>
      <header className="bg-surface text-emerald-900 font-headline tracking-tight flex justify-between items-center w-full px-6 py-4 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tighter text-emerald-900">
            TreeMN
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={
                  pathname === link.href
                    ? "text-emerald-900 border-b-2 border-emerald-800 font-bold pb-1 transition-colors"
                    : "text-emerald-800/60 font-medium hover:text-emerald-700 transition-colors"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center bg-surface-container-low px-3 py-1.5 rounded-full">
            <span className="material-symbols-outlined text-[20px] mr-2">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-48 outline-none"
              placeholder="Алтанбулаг сумаас хайх..."
              type="text"
            />
          </div>

          {session ? (
            <>
              <span className="material-symbols-outlined text-emerald-800/60 hover:text-emerald-700 cursor-pointer transition-colors">
                notifications
              </span>
              {session.user.role === "ADMIN" && (
                <Link href="/admin">
                  <span className="material-symbols-outlined text-emerald-800/60 hover:text-emerald-700 cursor-pointer transition-colors">
                    admin_panel_settings
                  </span>
                </Link>
              )}
              <Link
                href="/admin"
                className="bg-primary text-on-primary px-5 py-2 rounded-lg font-bold text-sm hover:bg-primary-container transition-colors"
              >
                Мод бүртгэх
              </Link>
              <button
                onClick={() => signOut()}
                className="material-symbols-outlined text-emerald-800/60 hover:text-emerald-700 cursor-pointer transition-colors"
              >
                logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-primary text-on-primary px-5 py-2 rounded-lg font-bold text-sm hover:bg-primary-container transition-colors"
            >
              Нэвтрэх
            </Link>
          )}
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface flex justify-around py-3 px-6 z-50 backdrop-blur-md border-t border-surface-container">
        <Link href="/" className={`flex flex-col items-center gap-1 ${pathname === "/" ? "text-emerald-900 font-bold" : "text-emerald-800/60"}`}>
          <span className="material-symbols-outlined" style={pathname === "/" ? { fontVariationSettings: "'FILL' 1" } : undefined}>map</span>
          <span className="text-[10px]">Газрын зураг</span>
        </Link>
        <Link href="/profile" className={`flex flex-col items-center gap-1 ${pathname === "/profile" ? "text-emerald-900 font-bold" : "text-emerald-800/60"}`}>
          <span className="material-symbols-outlined">database</span>
          <span className="text-[10px]">Бүртгэл</span>
        </Link>
        <Link href="/" className="flex flex-col items-center gap-1 text-emerald-800/60">
          <span className="material-symbols-outlined">storefront</span>
          <span className="text-[10px]">Худалдаа</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-1 text-emerald-800/60">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px]">Профайл</span>
        </Link>
      </nav>
    </>
  );
}
