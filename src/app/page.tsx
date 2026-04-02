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
    <div className="relative" style={{ height: "calc(100vh - 56px)" }}>
      <Map onSelectWood={setSelectedWood} />
      {selectedWood && (
        <WoodDetail wood={selectedWood} onClose={() => setSelectedWood(null)} />
      )}
    </div>
  );
}
