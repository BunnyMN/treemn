"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
  photos: string[];
  owner?: { id: string; name: string; phone?: string };
};

const ALTANBULAG_CENTER: [number, number] = [49.33, 106.5];
const ALTANBULAG_BOUNDS: L.LatLngBoundsExpression = [
  [49.20, 106.30],
  [49.45, 106.70],
];

const availableIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const soldIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function FitBounds({ woods }: { woods: Wood[] }) {
  const map = useMap();
  useEffect(() => {
    if (woods.length > 0) {
      const bounds = L.latLngBounds(woods.map((w) => [w.lat, w.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [woods, map]);
  return null;
}

export default function Map({
  onSelectWood,
}: {
  onSelectWood: (wood: Wood) => void;
}) {
  const [woods, setWoods] = useState<Wood[]>([]);

  useEffect(() => {
    fetch("/api/woods")
      .then((r) => r.json())
      .then(setWoods);
  }, []);

  return (
    <MapContainer
      center={ALTANBULAG_CENTER}
      zoom={13}
      minZoom={11}
      maxZoom={18}
      maxBounds={ALTANBULAG_BOUNDS}
      maxBoundsViscosity={1.0}
      className="w-full h-full"
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='Tiles &copy; Esri'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        maxZoom={18}
      />
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        maxZoom={18}
      />
      <FitBounds woods={woods} />
      {woods.map((wood) => (
        <Marker
          key={wood.id}
          position={[wood.lat, wood.lng]}
          icon={wood.status === "AVAILABLE" ? availableIcon : soldIcon}
          eventHandlers={{ click: () => onSelectWood(wood) }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-bold">{wood.name}</p>
              <p className="text-gray-600">{wood.species}</p>
              <p className="font-semibold text-green-700">
                {wood.price.toLocaleString()}₮
              </p>
              <p
                className={`text-xs ${
                  wood.status === "AVAILABLE"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {wood.status === "AVAILABLE" ? "Сул" : "Эзэмшигчтэй"}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
