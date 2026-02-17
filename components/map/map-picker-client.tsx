"use client";

import { useEffect, useRef, useState, useId } from "react";
// Import Leaflet
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Locate } from "lucide-react";
import { searchAddress, SearchAddressResult } from "@/services/address-api";

// Fix for Leaflet default icon not showing up
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const TEHRAN_CENTER: [number, number] = [35.6892, 51.3890];

interface MapPickerClientProps {
  onLocationChange: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
  placeholder?: string;
}

export default function MapPickerClient({ onLocationChange, initialLat, initialLng, placeholder }: MapPickerClientProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const mapId = useId();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchAddressResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Initialize Map
  useEffect(() => {
    // Wait for container to be ready
    const timer = setTimeout(() => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;
      
      const center: [number, number] = initialLat && initialLng ? [initialLat, initialLng] : TEHRAN_CENTER;

      // Initialize Leaflet Map
      const map = L.map(mapContainerRef.current).setView(center, 14);

      // Add OpenStreetMap Tile Layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapInstanceRef.current = map;

      // Handle map click -> Pan to location
      map.on("click", (e: L.LeafletMouseEvent) => {
        map.flyTo(e.latlng, map.getZoom());
      });

      // Update parent on move end
      map.on("moveend", () => {
        const center = map.getCenter();
        onLocationChange(center.lat, center.lng);
      });

      // Initial update
      onLocationChange(center[0], center[1]);

      // Request location if not provided
      if (!initialLat || !initialLng) {
        map.locate({ 
          setView: true, 
          maxZoom: 16,
          enableHighAccuracy: true 
        });
      }
      
      // Handle location found
      map.on("locationfound", (e) => {
        map.flyTo(e.latlng, 16);
      });

      // Handle location error
      map.on("locationerror", (e) => {
        console.error("Location access denied or failed", e);
      });
      
    }, 100);

    // Clean up
    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Run once on mount

  // Handle Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setIsSearching(true);
        try {
          const results = await searchAddress(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error(error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchResultClick = (result: SearchAddressResult) => {
    if (!mapInstanceRef.current) return;
    const newPos: [number, number] = [result.lat, result.lng];
    mapInstanceRef.current.flyTo(newPos, 15);
    setSearchResults([]);
    setSearchQuery(""); 
  };

  const handleLocateMe = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.locate({ 
      setView: true, 
      maxZoom: 16,
      enableHighAccuracy: true
    });
  };

  return (
    <div className="h-full w-full relative group">
      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-col gap-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground [html[dir=rtl]_&]:left-auto [html[dir=rtl]_&]:right-3" />
          <Input 
            className="w-full bg-white pl-9 [html[dir=rtl]_&]:pl-3 [html[dir=rtl]_&]:pr-9 shadow-sm" 
            placeholder={placeholder || "Search location..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {searchResults.length > 0 && (
          <div className="bg-white rounded-md shadow-lg border border-neutral-100 overflow-hidden max-h-48 overflow-y-auto">
             {searchResults.map((result, idx) => (
               <button
                 key={idx}
                 className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-sm flex flex-col items-start"
                 onClick={() => handleSearchResultClick(result)}
               >
                 <span className="font-medium">{result.title}</span>
                 <span className="text-xs text-neutral-500">{result.address}</span>
               </button>
             ))}
          </div>
        )}
      </div>

      {/* Locate Me Button */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute bottom-4 right-4 z-[1000] bg-white shadow-md hover:bg-neutral-100 [html[dir=rtl]_&]:right-auto [html[dir=rtl]_&]:left-4"
        onClick={handleLocateMe}
        title="Find my location"
      >
        <Locate className="h-4 w-4" />
      </Button>

      {/* Fixed Center Marker */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[400] pointer-events-none">
         <MapPin className="w-8 h-8 text-primary -mb-4 fill-current drop-shadow-md text-[#0ea5a4]" />
      </div>

      {/* Map Container */}
      <div id={mapId} ref={mapContainerRef} className="h-full w-full rounded-md z-0" />
    </div>
  );
}
