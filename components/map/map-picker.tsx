"use client";

import dynamic from "next/dynamic";

const MapPickerClient = dynamic(() => import("./map-picker-client"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full rounded-md bg-neutral-100 flex items-center justify-center animate-pulse">
      <p className="text-neutral-400">Loading map...</p>
    </div>
  ),
});

interface MapPickerProps {
  onLocationChange: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
  placeholder?: string;
}

export default function MapPicker(props: MapPickerProps) {
  return <MapPickerClient {...props} />;
}
