"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Wood = {
  id: string;
  name: string;
  species: string;
  price: number;
  certificateNo: string;
  status: string;
  lat: number;
  lng: number;
  photos: string[];
  owner?: { id: string; name: string };
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [woods, setWoods] = useState<Wood[]>([]);
  const [transferId, setTransferId] = useState<string | null>(null);
  const [transferEmail, setTransferEmail] = useState("");
  const [transferMsg, setTransferMsg] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/woods")
        .then((r) => r.json())
        .then((all: (Wood & { owner?: { id: string } })[]) => {
          if (session.user.role === "ADMIN") {
            setWoods(all);
          } else {
            setWoods(all.filter((w) => w.owner?.id === session.user.id));
          }
        });
    }
  }, [session]);

  async function handleTransfer(woodId: string) {
    setTransferMsg("");
    const res = await fetch(`/api/woods/${woodId}/transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buyerEmail: transferEmail }),
    });
    const data = await res.json();
    if (res.ok) {
      setTransferMsg("Амжилттай шилжүүллээ!");
      setTransferId(null);
      setTransferEmail("");
      const all = await fetch("/api/woods").then((r) => r.json());
      if (session?.user.role === "ADMIN") {
        setWoods(all);
      } else {
        setWoods(all.filter((w: Wood & { owner?: { id: string } }) => w.owner?.id === session?.user.id));
      }
    } else {
      setTransferMsg(data.error);
    }
  }

  if (status === "loading") return <div className="p-8 text-center text-on-surface-variant">Уншиж байна...</div>;
  if (!session) return null;

  return (
    <main className="p-6 md:p-10 space-y-12">
      {/* Hero Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">Дижитал Хариуцагч</span>
            <h1 className="font-headline text-3xl font-bold mt-2 text-primary">{session.user.name}</h1>
            <p className="text-on-surface-variant mt-2 max-w-md">
              Алтанбулаг сумын бүс нутагт {woods.length} хөрөнгийг хариуцаж байна.
            </p>
          </div>
          <div className="flex gap-8 mt-8">
            <div>
              <span className="block font-headline text-2xl font-extrabold text-primary">{woods.length}</span>
              <span className="text-xs text-on-surface-variant uppercase font-semibold tracking-tighter">Бүртгэлтэй мод</span>
            </div>
            <div>
              <span className="block font-headline text-2xl font-extrabold text-secondary">
                {(woods.reduce((s, w) => s + w.price, 0) / 1000).toFixed(1)}k
              </span>
              <span className="text-xs text-on-surface-variant uppercase font-semibold tracking-tighter">TMN үнэлгээ</span>
            </div>
          </div>
        </div>
        <div className="bg-primary p-8 rounded-xl text-on-primary flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-primary-container rounded-full opacity-50 blur-3xl"></div>
          <span className="text-xs uppercase tracking-widest opacity-80 font-medium">Дансны мэдээлэл</span>
          <span className="font-headline text-lg font-bold mt-1">{session.user.email}</span>
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center border-b border-on-primary/20 pb-2">
              <span className="text-sm opacity-80">Холбосон түрийвч</span>
              <span className="text-sm font-bold">QPay Secured</span>
            </div>
          </div>
        </div>
      </section>

      {transferMsg && (
        <div className="bg-primary-fixed text-on-primary-fixed p-3 rounded-xl text-sm font-bold">{transferMsg}</div>
      )}

      {/* Tree Cards */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface">Миний модны бүртгэл</h2>
            <p className="text-on-surface-variant text-sm mt-1">Таны хариуцаж буй баталгаажсан биологийн хөрөнгө.</p>
          </div>
        </div>

        {woods.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">park</span>
            <p className="text-on-surface-variant">Танд одоогоор эзэмшлийн мод байхгүй байна.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {woods.map((wood) => (
              <div key={wood.id} className="bg-surface-container-lowest rounded-xl overflow-hidden group">
                <div className="h-48 relative overflow-hidden bg-gradient-to-br from-primary/20 to-primary-container/10">
                  {wood.photos && wood.photos.length > 0 ? (
                    <img src={wood.photos[0]} alt={wood.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-8xl text-primary/20" style={{ fontVariationSettings: "'FILL' 1" }}>park</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-surface-container-lowest/90 backdrop-blur text-primary text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider">Идэвхтэй</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-headline text-lg font-bold text-on-surface">{wood.name}</h3>
                      <p className="text-xs text-on-surface-variant font-medium">{wood.species}</p>
                    </div>
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-surface-container space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-on-surface-variant">Гэрчилгээний дугаар</span>
                      <span className="font-mono font-bold text-on-surface">{wood.certificateNo}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-on-surface-variant">GPS координат</span>
                      <span className="text-tertiary font-bold">{wood.lat.toFixed(4)}, {wood.lng.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-on-surface-variant">Үнэ</span>
                      <span className="font-bold text-on-surface">₮ {wood.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    {transferId === wood.id ? (
                      <div className="space-y-2">
                        <input
                          type="email"
                          placeholder="Хүлээн авагчийн и-мэйл"
                          value={transferEmail}
                          onChange={(e) => setTransferEmail(e.target.value)}
                          className="w-full bg-surface-container-low border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleTransfer(wood.id)}
                            className="flex-1 py-2 text-xs font-bold bg-primary text-on-primary rounded-lg hover:opacity-90 transition-opacity"
                          >
                            Батлах
                          </button>
                          <button
                            onClick={() => { setTransferId(null); setTransferEmail(""); }}
                            className="flex-1 py-2 text-xs font-bold bg-surface-container-high text-on-surface rounded-lg"
                          >
                            Болих
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <button className="flex-1 py-2 text-xs font-bold bg-surface-container-high text-on-surface rounded-lg hover:bg-surface-container-highest transition-colors">
                          Дэлгэрэнгүй
                        </button>
                        <button
                          onClick={() => setTransferId(wood.id)}
                          className="flex-1 py-2 text-xs font-bold bg-primary text-on-primary rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                        >
                          <span className="material-symbols-outlined text-sm">send</span> Шилжүүлэх
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
