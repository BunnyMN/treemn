"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Wood = {
  id: string;
  name: string;
  species: string;
  certificateNo: string;
  status: string;
  price: number;
  lat: number;
  lng: number;
  owner?: { name: string };
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", species: "", description: "", diameter: "", height: "", lat: "", lng: "", price: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [woods, setWoods] = useState<Wood[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session && session.user.role !== "ADMIN") router.push("/");
  }, [status, session, router]);

  useEffect(() => { fetchWoods(); }, []);

  function fetchWoods() {
    fetch("/api/woods").then((r) => r.json()).then(setWoods);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const res = await fetch("/api/woods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name, species: form.species, description: form.description || undefined,
        diameter: form.diameter ? parseFloat(form.diameter) : undefined,
        height: form.height ? parseFloat(form.height) : undefined,
        lat: parseFloat(form.lat), lng: parseFloat(form.lng), price: parseInt(form.price),
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

  if (status === "loading") return <div className="p-8 text-center text-on-surface-variant">Уншиж байна...</div>;
  if (!session || session.user.role !== "ADMIN") return null;

  return (
    <main className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-primary tracking-tight">Консерваторийн Админ</h1>
            <p className="text-on-surface-variant mt-1">Алтанбулаг Дижитал Консерваторийн бүртгэлийн нэгдсэн удирдлага.</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Идэвхтэй хөрөнгө</span>
            <span className="text-2xl font-headline font-black text-primary">{woods.length.toLocaleString()}</span>
          </div>
        </header>

        {msg && (
          <div className={`p-3 rounded-xl mb-6 text-sm font-bold ${msg.startsWith("Алдаа") ? "bg-error-container text-on-error-container" : "bg-primary-fixed text-on-primary-fixed"}`}>
            {msg}
          </div>
        )}

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-6 mb-12">
          {/* Registration Panel */}
          <section className="col-span-12 lg:col-span-5 bg-surface-container-lowest rounded-xl p-6 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">add_location</span>
                Шинэ мод бүртгэх
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant uppercase">Өргөрөг</label>
                    <input
                      type="number" step="0.000001" value={form.lat}
                      onChange={(e) => setForm({ ...form, lat: e.target.value })}
                      required placeholder="50.3100"
                      className="w-full bg-surface-container-low border-none focus:ring-0 rounded-md text-sm border-l-2 border-l-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant uppercase">Уртраг</label>
                    <input
                      type="number" step="0.000001" value={form.lng}
                      onChange={(e) => setForm({ ...form, lng: e.target.value })}
                      required placeholder="106.5000"
                      className="w-full bg-surface-container-low border-none focus:ring-0 rounded-md text-sm border-l-2 border-l-primary"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase">Модны нэр</label>
                  <input
                    type="text" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required placeholder="Нарс #006"
                    className="w-full bg-surface-container-low border-none focus:ring-0 rounded-md text-sm border-l-2 border-l-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase">Модны төрөл</label>
                  <select
                    value={form.species}
                    onChange={(e) => setForm({ ...form, species: e.target.value })}
                    required
                    className="w-full bg-surface-container-low border-none focus:ring-0 rounded-md text-sm border-l-2 border-l-primary"
                  >
                    <option value="">Сонгох</option>
                    <option value="Нарс">Сибирь Нарс (Larix sibirica)</option>
                    <option value="Шинэс">Шинэс (Pinus sylvestris)</option>
                    <option value="Хуш">Хуш (Pinus sibirica)</option>
                    <option value="Хус">Цагаан Хус (Betula platyphylla)</option>
                    <option value="Улиас">Улиас (Populus tremula)</option>
                    <option value="Бургас">Бургас (Salix)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant uppercase">Диаметр (см)</label>
                    <input type="number" step="0.1" value={form.diameter} onChange={(e) => setForm({ ...form, diameter: e.target.value })}
                      className="w-full bg-surface-container-low border-none focus:ring-0 rounded-md text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant uppercase">Өндөр (м)</label>
                    <input type="number" step="0.1" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })}
                      className="w-full bg-surface-container-low border-none focus:ring-0 rounded-md text-sm" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase">Анхны үнэ (₮)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required placeholder="55000"
                    className="w-full bg-surface-container-low border-none focus:ring-0 rounded-md text-sm border-l-2 border-l-primary" />
                </div>
                <button
                  type="submit" disabled={loading}
                  className="w-full bg-primary text-on-primary font-bold py-3 rounded-lg mt-4 flex items-center justify-center gap-2 hover:bg-primary-container transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">verified</span>
                  {loading ? "Бүртгэж байна..." : "Бүртгэлийг баталгаажуулах"}
                </button>
              </form>
            </div>
            <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none">
              <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>park</span>
            </div>
          </section>

          {/* HUD Map Panel */}
          <section className="col-span-12 lg:col-span-7 bg-surface-container rounded-xl overflow-hidden relative min-h-[300px]">
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop"
                alt="Forest satellite"
                className="w-full h-full object-cover grayscale opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent opacity-60"></div>
            </div>
            <div className="relative z-10 p-6 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start">
                <div className="backdrop-blur-md bg-surface-container-lowest/80 p-3 rounded-lg border border-outline-variant/15">
                  <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-1">Хиймэл дагуулын HUD</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-[10px] font-bold uppercase">Сул</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-error"></div>
                      <span className="text-[10px] font-bold uppercase">Эзэмшигчтэй</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="backdrop-blur-md bg-primary/90 text-on-primary px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">gps_fixed</span>
                  Алтанбулаг Консерватори
                </div>
              </div>
            </div>
          </section>

          {/* Assets Table */}
          <section className="col-span-12 bg-surface-container-lowest rounded-xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-primary tracking-tight">Бүртгэлийн нэгдсэн жагсаалт</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-surface-container-low rounded-lg text-xs font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">filter_list</span> Шүүх
                </button>
                <button className="px-4 py-2 bg-surface-container-low rounded-lg text-xs font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">download</span> CSV татах
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.1em]">
                    <th className="pb-4 px-4">Модны дугаар</th>
                    <th className="pb-4 px-4">Төрөл</th>
                    <th className="pb-4 px-4">Координат</th>
                    <th className="pb-4 px-4">Төлөв</th>
                    <th className="pb-4 px-4">Эзэмшигч</th>
                    <th className="pb-4 px-4">Зах зээлийн үнэ</th>
                    <th className="pb-4 px-4 text-right">Үйлдэл</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {woods.map((w, i) => (
                    <tr key={w.id} className={`${i % 2 === 0 ? "bg-surface" : "bg-surface-container-low"} hover:bg-surface-container-high transition-colors`}>
                      <td className="py-4 px-4 font-mono text-xs font-bold">{w.certificateNo}</td>
                      <td className="py-4 px-4 font-medium">{w.species}</td>
                      <td className="py-4 px-4 text-on-surface-variant">{w.lat.toFixed(2)}, {w.lng.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-tighter ${
                          w.status === "AVAILABLE"
                            ? "bg-primary-fixed text-on-primary-fixed"
                            : "bg-secondary-container text-on-secondary-container"
                        }`}>
                          {w.status === "AVAILABLE" ? "Сул" : "Эзэмшигчтэй"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {w.owner ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-tertiary-fixed text-[8px] flex items-center justify-center font-bold">
                              {w.owner.name.charAt(0)}
                            </div>
                            <span className="text-xs">{w.owner.name}</span>
                          </div>
                        ) : (
                          <span className="italic text-on-surface-variant">Байхгүй</span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-bold">₮ {w.price.toLocaleString()}</td>
                      <td className="py-4 px-4 text-right">
                        <button className="text-primary hover:bg-primary-fixed-dim p-1 rounded transition-colors">
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button className="text-primary hover:bg-primary-fixed-dim p-1 rounded transition-colors">
                          <span className="material-symbols-outlined text-base">history</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
