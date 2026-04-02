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
        .then((all: Wood[]) =>
          setWoods(all.filter((w: Wood & { owner?: { id: string } }) => w.owner?.id === session.user.id))
        );
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
      setWoods(all.filter((w: { owner?: { id: string } }) => w.owner?.id === session?.user.id));
    } else {
      setTransferMsg(data.error);
    }
  }

  if (status === "loading") return <div className="p-8 text-center">Уншиж байна...</div>;
  if (!session) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Миний модод</h1>
      <p className="text-gray-600 mb-6">{session.user.name} - {session.user.email}</p>

      {transferMsg && (
        <div className="bg-green-50 text-green-700 p-3 rounded mb-4 text-sm">
          {transferMsg}
        </div>
      )}

      {woods.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500">
          Танд одоогоор эзэмшлийн мод байхгүй байна.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {woods.map((wood) => (
            <div key={wood.id} className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{wood.name}</h3>
                  <p className="text-sm text-gray-500">{wood.species}</p>
                </div>
                <span className="text-green-700 font-bold">
                  {wood.price.toLocaleString()}₮
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-2">
                {wood.certificateNo}
              </p>
              <div className="mt-3 flex gap-2">
                {transferId === wood.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="email"
                      placeholder="Хүлээн авагчийн и-мэйл"
                      value={transferEmail}
                      onChange={(e) => setTransferEmail(e.target.value)}
                      className="flex-1 border rounded px-2 py-1 text-sm"
                    />
                    <button
                      onClick={() => handleTransfer(wood.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Шилжүүлэх
                    </button>
                    <button
                      onClick={() => { setTransferId(null); setTransferEmail(""); }}
                      className="text-gray-400 hover:text-gray-600 text-sm"
                    >
                      Болих
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setTransferId(wood.id)}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200"
                  >
                    Шилжүүлэх
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
