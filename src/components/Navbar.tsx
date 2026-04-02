"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-green-800 text-white shadow-lg relative z-[1000]">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="text-xl font-bold tracking-tight">
          TreeMN
        </Link>

        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className={`${menuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row absolute md:static top-14 left-0 right-0 bg-green-800 md:bg-transparent items-center gap-4 p-4 md:p-0`}>
          <Link href="/" className="hover:text-green-200" onClick={() => setMenuOpen(false)}>
            Газрын зураг
          </Link>

          {session ? (
            <>
              <Link href="/profile" className="hover:text-green-200" onClick={() => setMenuOpen(false)}>
                Миний модод
              </Link>
              {session.user.role === "ADMIN" && (
                <Link href="/admin" className="hover:text-green-200" onClick={() => setMenuOpen(false)}>
                  Удирдлага
                </Link>
              )}
              <span className="text-green-300 text-sm">{session.user.name}</span>
              <button
                onClick={() => signOut()}
                className="bg-green-700 hover:bg-green-600 px-3 py-1 rounded text-sm"
              >
                Гарах
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-green-200" onClick={() => setMenuOpen(false)}>
                Нэвтрэх
              </Link>
              <Link
                href="/register"
                className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm"
                onClick={() => setMenuOpen(false)}
              >
                Бүртгүүлэх
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
