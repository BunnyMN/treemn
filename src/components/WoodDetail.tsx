"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

type Wood = {
  id: string;
  name: string;
  species: string;
  description?: string;
  diameter?: number;
  height?: number;
  lat: number;
  lng: number;
  price: number;
  status: string;
  certificateNo: string;
  qrCode?: string;
  photos: string[];
  owner?: { id: string; name: string; phone?: string };
};

type PaymentResult = {
  transactionId: string;
  qrImage: string;
  urls: { name: string; link: string }[];
};

export default function WoodDetail({
  wood,
  onClose,
}: {
  wood: Wood;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const [buying, setBuying] = useState(false);
  const [payment, setPayment] = useState<PaymentResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  async function handleBuy() {
    if (!session) return;
    setBuying(true);
    setError("");
    try {
      const res = await fetch(`/api/woods/${wood.id}/buy`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPayment(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBuying(false);
    }
  }

  async function handleCheckPayment() {
    if (!payment) return;
    setChecking(true);
    try {
      const res = await fetch(`/api/qpay/callback?txId=${payment.transactionId}`);
      const data = await res.json();
      if (data.status === "PAID") {
        alert("Төлбөр амжилттай! Мод таны эзэмшилд шилжлээ.");
        onClose();
        window.location.reload();
      } else {
        alert("Төлбөр хүлээгдэж байна...");
      }
    } finally {
      setChecking(false);
    }
  }

  return (
    <aside className="absolute top-6 bottom-6 right-6 w-[400px] z-30 glass-panel rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-white/40">
      {/* Header */}
      <div className="relative h-48 w-full bg-surface-container-high">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary-container/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 glass-panel rounded-full flex items-center justify-center text-on-surface hover:bg-white/90 transition-colors z-10"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
        <div className="absolute bottom-4 left-4 text-white">
          <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold ${
            wood.status === "AVAILABLE" ? "bg-primary" : "bg-error"
          }`}>
            {wood.status === "AVAILABLE" ? "Сул" : "Эзэмшигчтэй"}
          </span>
          <h2 className="font-headline text-2xl font-extrabold tracking-tighter mt-1">
            {wood.species}
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-4">
          {wood.diameter && (
            <div className="bg-surface-container-high p-4 rounded-xl border-l-4 border-primary">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Диаметр</p>
              <p className="text-xl font-headline font-black text-primary">
                {wood.diameter} <span className="text-xs font-medium opacity-60">см</span>
              </p>
            </div>
          )}
          {wood.height && (
            <div className="bg-surface-container-high p-4 rounded-xl">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Өндөр</p>
              <p className="text-xl font-headline font-black text-primary">
                {wood.height} <span className="text-xs font-medium opacity-60">м</span>
              </p>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-tertiary">location_on</span>
              <span className="text-sm font-medium text-on-surface-variant">GPS байршил</span>
            </div>
            <span className="text-xs font-mono font-bold bg-surface-container-highest px-2 py-1 rounded">
              {wood.lat.toFixed(4)}° N, {wood.lng.toFixed(4)}° E
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-tertiary">verified_user</span>
              <span className="text-sm font-medium text-on-surface-variant">Гэрчилгээний дугаар</span>
            </div>
            <span className="text-xs font-bold text-primary">{wood.certificateNo}</span>
          </div>
          {wood.owner && (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary">person</span>
                <span className="text-sm font-medium text-on-surface-variant">Эзэмшигч</span>
              </div>
              <span className="text-xs font-bold">{wood.owner.name}</span>
            </div>
          )}
        </div>

        {/* Price + QR */}
        <div className="bg-surface-container-low p-5 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Үнэ</p>
            <span className="text-2xl font-headline font-black text-on-surface">
              ₮ {wood.price.toLocaleString()}
            </span>
          </div>
          {wood.qrCode && (
            <div className="w-16 h-16 bg-white p-1 rounded-lg shadow-inner border border-outline-variant/20">
              <img src={wood.qrCode} alt="QR" className="w-full h-full" />
            </div>
          )}
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded text-sm">
            {error}
          </div>
        )}

        {/* Payment UI */}
        {payment ? (
          <div className="space-y-3">
            <p className="text-center font-medium text-on-surface">QPay-ээр төлбөрөө төлнө үү</p>
            {payment.qrImage && (
              <div className="flex justify-center">
                <img src={`data:image/png;base64,${payment.qrImage}`} alt="QPay QR" className="w-48 h-48 rounded-lg" />
              </div>
            )}
            {payment.urls && (
              <div className="grid grid-cols-2 gap-2">
                {payment.urls.map((u) => (
                  <a key={u.name} href={u.link} className="bg-surface-container-high text-on-surface text-center py-2 rounded text-xs font-bold hover:bg-surface-container-highest transition-colors">
                    {u.name}
                  </a>
                ))}
              </div>
            )}
            <button
              onClick={handleCheckPayment}
              disabled={checking}
              className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold hover:bg-primary-container transition-all disabled:opacity-50"
            >
              {checking ? "Шалгаж байна..." : "Төлбөр шалгах"}
            </button>
          </div>
        ) : (
          wood.status === "AVAILABLE" && (
            session ? (
              <button
                onClick={handleBuy}
                disabled={buying}
                className="w-full bg-primary hover:bg-primary-container text-on-primary py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20 group disabled:opacity-50"
              >
                <span>{buying ? "Уншиж байна..." : "Худалдаж авах"}</span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="w-full bg-primary hover:bg-primary-container text-on-primary py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
              >
                Нэвтэрч худалдаж авах
              </Link>
            )
          )
        )}

        {wood.status === "AVAILABLE" && (
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase">Баталгаа</span>
            <div className="flex items-center text-primary font-bold italic text-xs tracking-tighter">
              <span className="material-symbols-outlined text-xs mr-1">payments</span>
              QPay-ээр баталгаажсан
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
