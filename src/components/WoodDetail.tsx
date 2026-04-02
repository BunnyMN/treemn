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
      const res = await fetch(
        `/api/qpay/callback?txId=${payment.transactionId}`
      );
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">{wood.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              &times;
            </button>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <span className="text-gray-500">Төрөл:</span>
              <span>{wood.species}</span>
            </div>
            {wood.diameter && (
              <div className="flex justify-between">
                <span className="text-gray-500">Диаметр:</span>
                <span>{wood.diameter} см</span>
              </div>
            )}
            {wood.height && (
              <div className="flex justify-between">
                <span className="text-gray-500">Өндөр:</span>
                <span>{wood.height} м</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Герчилгээ:</span>
              <span className="font-mono text-xs">{wood.certificateNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Үнэ:</span>
              <span className="font-bold text-green-700 text-lg">
                {wood.price.toLocaleString()}₮
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Төлөв:</span>
              <span
                className={
                  wood.status === "AVAILABLE"
                    ? "text-green-600 font-medium"
                    : "text-red-600 font-medium"
                }
              >
                {wood.status === "AVAILABLE" ? "Сул байна" : "Эзэмшигчтэй"}
              </span>
            </div>
            {wood.owner && (
              <div className="flex justify-between">
                <span className="text-gray-500">Эзэмшигч:</span>
                <span>{wood.owner.name}</span>
              </div>
            )}
            {wood.description && (
              <div>
                <span className="text-gray-500">Тайлбар:</span>
                <p className="mt-1">{wood.description}</p>
              </div>
            )}
          </div>

          {wood.qrCode && (
            <div className="mt-4 flex justify-center">
              <img src={wood.qrCode} alt="QR Code" className="w-32 h-32" />
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 text-red-700 p-3 rounded text-sm">
              {error}
            </div>
          )}

          {payment ? (
            <div className="mt-4 space-y-3">
              <p className="text-center font-medium text-gray-900">
                QPay-ээр төлбөрөө төлнө үү
              </p>
              {payment.qrImage && (
                <div className="flex justify-center">
                  <img
                    src={`data:image/png;base64,${payment.qrImage}`}
                    alt="QPay QR"
                    className="w-48 h-48"
                  />
                </div>
              )}
              {payment.urls && (
                <div className="grid grid-cols-2 gap-2">
                  {payment.urls.map((u) => (
                    <a
                      key={u.name}
                      href={u.link}
                      className="bg-blue-50 text-blue-700 text-center py-2 rounded text-sm hover:bg-blue-100"
                    >
                      {u.name}
                    </a>
                  ))}
                </div>
              )}
              <button
                onClick={handleCheckPayment}
                disabled={checking}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {checking ? "Шалгаж байна..." : "Төлбөр шалгах"}
              </button>
            </div>
          ) : (
            wood.status === "AVAILABLE" && (
              <div className="mt-6">
                {session ? (
                  <button
                    onClick={handleBuy}
                    disabled={buying}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    {buying ? "Уншиж байна..." : "Худалдаж авах"}
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="block w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 text-center"
                  >
                    Нэвтэрч худалдаж авах
                  </Link>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
