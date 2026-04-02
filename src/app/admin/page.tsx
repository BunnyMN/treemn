"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    species: "",
    description: "",
    diameter: "",
    height: "",
    lat: "",
    lng: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [woods, setWoods] = useState<{ id: string; name: string; species: string; certificateNo: string; status: string; price: number }[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session && session.user.role !== "ADMIN") router.push("/");
  }, [status, session, router]);

  useEffect(() => {
    fetchWoods();
  }, []);

  function fetchWoods() {
    fetch("/api/woods")
      .then((r) => r.json())
      .then(setWoods);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const res = await fetch("/api/woods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        species: form.species,
        description: form.description || undefined,
        diameter: form.diameter ? parseFloat(form.diameter) : undefined,
        height: form.height ? parseFloat(form.height) : undefined,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        price: parseInt(form.price),
      }),
    });

    if (res.ok) {
      setMsg("Мод амжилттай бүртгэгдлээ!");
      setForm({ name: "", species: "", description: "", diameter: "", height: "", lat: "", lng: "", price: "" });
      fetchWoods();
    } else {
      const data = await res.json();
      setMsg(`Алдаа: ${data.error}`);
    }
    setLoading(false);
  }

  if (status === "loading") return <div className="p-8 text-center">Уншиж байна...</div>;
  if (!session || session.user.role !== "ADMIN") return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Мод бүртгэх</h1>

      {msg && (
        <div className={`p-3 rounded mb-4 text-sm ${msg.startsWith("Алдаа") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 shadow-sm space-y-4 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Нэр *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="жишээ: Нарс #001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Төрөл *</label>
            <select
              value={form.species}
              onChange={(e) => setForm({ ...form, species: e.target.value })}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Сонгох</option>
              <option value="Нарс">Нарс</option>
              <option value="Шинэс">Шинэс</option>
              <option value="Хуш">Хуш</option>
              <option value="Хус">Хус</option>
              <option value="Улиас">Улиас</option>
              <option value="Бургас">Бургас</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Тайлбар</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Диаметр (см)</label>
            <input
              type="number"
              step="0.1"
              value={form.diameter}
              onChange={(e) => setForm({ ...form, diameter: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Өндөр (м)</label>
            <input
              type="number"
              step="0.1"
              value={form.height}
              onChange={(e) => setForm({ ...form, height: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Өргөрөг (lat) *</label>
            <input
              type="number"
              step="0.000001"
              value={form.lat}
              onChange={(e) => setForm({ ...form, lat: e.target.value })}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="49.33"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Уртраг (lng) *</label>
            <input
              type="number"
              step="0.000001"
              value={form.lng}
              onChange={(e) => setForm({ ...form, lng: e.target.value })}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="106.5"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Үнэ (₮) *</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="50000"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Бүртгэж байна..." : "Мод бүртгэх"}
        </button>
      </form>

      <h2 className="text-lg font-bold text-gray-900 mb-4">Бүртгэлтэй модод ({woods.length})</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Нэр</th>
              <th className="text-left p-3">Төрөл</th>
              <th className="text-left p-3">Герчилгээ</th>
              <th className="text-right p-3">Үнэ</th>
              <th className="text-center p-3">Төлөв</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {woods.map((w) => (
              <tr key={w.id} className="hover:bg-gray-50">
                <td className="p-3">{w.name}</td>
                <td className="p-3">{w.species}</td>
                <td className="p-3 font-mono text-xs">{w.certificateNo}</td>
                <td className="p-3 text-right">{w.price.toLocaleString()}₮</td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs ${w.status === "AVAILABLE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {w.status === "AVAILABLE" ? "Сул" : "Эзэмшигчтэй"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
