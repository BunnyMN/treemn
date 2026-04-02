"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/login" || pathname === "/register") return null;

  return (
    <footer className="hidden lg:flex w-full px-8 py-12 bg-surface-container-low justify-between items-center gap-4 border-t border-stone-200 text-xs tracking-wide uppercase z-10">
      <div className="flex flex-col gap-1">
        <span className="font-headline font-bold text-stone-800">TreeMN</span>
        <span className="text-stone-500">© 2024 Алтанбулаг сумын дижитал модны бүртгэл.</span>
      </div>
      <div className="flex gap-6">
        <a className="text-stone-500 hover:underline" href="#">Нууцлалын бодлого</a>
        <a className="text-stone-500 hover:underline" href="#">Дата ашиглах нөхцөл</a>
        <a className="text-stone-500 hover:underline" href="#">QPay аюулгүй байдал</a>
        <a className="text-stone-500 hover:underline" href="#">API хандалт</a>
      </div>
    </footer>
  );
}
