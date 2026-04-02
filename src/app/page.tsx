"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import WoodDetail from "@/components/WoodDetail";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

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

export default function HomePage() {
  const [selectedWood, setSelectedWood] = useState<Wood | null>(null);

  return (
    <main className="flex-1 relative overflow-hidden" style={{ height: "calc(100vh - 72px)" }}>
      <Map onSelectWood={setSelectedWood} />

      {/* Map Controls HUD */}
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
        <div className="glass-panel p-2 rounded-xl shadow-sm flex flex-col gap-1 border border-white/20">
          <button className="w-10 h-10 flex items-center justify-center hover:bg-surface-container-high rounded-lg transition-colors">
            <span className="material-symbols-outlined">add</span>
          </button>
          <div className="h-px bg-outline-variant/30 mx-2"></div>
          <button className="w-10 h-10 flex items-center justify-center hover:bg-surface-container-high rounded-lg transition-colors">
            <span className="material-symbols-outlined">remove</span>
          </button>
        </div>
        <button className="glass-panel w-10 h-10 rounded-xl shadow-sm flex items-center justify-center border border-white/20">
          <span className="material-symbols-outlined">my_location</span>
        </button>
      </div>

      {selectedWood && (
        <WoodDetail wood={selectedWood} onClose={() => setSelectedWood(null)} />
      )}
    </main>
  );
}
