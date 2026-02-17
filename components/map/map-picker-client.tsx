"use client";

import { useEffect, useRef, useState, useId } from "react";
// Import Leaflet
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Locate, Plus, Minus } from "lucide-react";
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
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
      }).setView(center, 14);

      // Explicitly disable zoom control if it was added by default (redundant but safe)
      if (map.zoomControl) {
        map.removeControl(map.zoomControl);
      }

      // Add CartoDB Voyager Tile Layer (Matches landing page aesthetic better than OSM default)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
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

  const handleZoomIn = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.zoomOut();
  };

  return (
    <div className="h-full w-full relative group">
      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-col gap-1">
        <div className="relative group/search">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within/search:text-[#0ea5a4] transition-colors [html[dir=rtl]_&]:left-auto [html[dir=rtl]_&]:right-3" />
          <Input 
            className="w-full h-12 bg-white/95 backdrop-blur-sm pl-10 [html[dir=rtl]_&]:pl-3 [html[dir=rtl]_&]:pr-10 border-neutral-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus:shadow-[0_4px_12px_rgba(14,165,164,0.1)] focus:border-[#0ea5a4]/50 rounded-[14px] transition-all placeholder:text-neutral-400 text-neutral-800" 
            placeholder={placeholder || "Search location..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {searchResults.length > 0 && (
          <div className="bg-white/95 backdrop-blur-sm rounded-[14px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-neutral-100 overflow-hidden max-h-48 overflow-y-auto mt-1 p-1.5">
             {searchResults.map((result, idx) => (
               <button
                 key={idx}
                 className="w-full text-left px-3 py-2.5 hover:bg-neutral-50 rounded-[10px] transition-colors text-sm flex flex-col items-start group/item"
                 onClick={() => handleSearchResultClick(result)}
               >
                 <span className="font-semibold text-neutral-800 group-hover/item:text-[#0ea5a4] transition-colors">{result.title}</span>
                 <span className="text-xs text-neutral-500 mt-0.5">{result.address}</span>
               </button>
             ))}
          </div>
        )}
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-6 right-4 z-[1000] flex flex-col gap-2 [html[dir=rtl]_&]:right-auto [html[dir=rtl]_&]:left-4">
        {/* Zoom Controls */}
        <div className="flex flex-col rounded-[12px] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-neutral-100 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 rounded-none text-neutral-600 hover:text-[#0ea5a4] hover:bg-neutral-50 transition-all border-b border-neutral-100"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <Plus className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 rounded-none text-neutral-600 hover:text-[#0ea5a4] hover:bg-neutral-50 transition-all"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <Minus className="h-5 w-5" />
          </Button>
        </div>

        {/* Locate Me Button */}
        <Button
          variant="secondary"
          size="icon"
          className="h-11 w-11 rounded-[12px] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] border border-neutral-100 text-neutral-600 hover:text-[#0ea5a4] hover:bg-white transition-all"
          onClick={handleLocateMe}
          title="Find my location"
        >
          <Locate className="h-5 w-5" />
        </Button>
      </div>

      {/* Fixed Center Marker */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[400] pointer-events-none">
         <div className="relative -mt-[34px]">
           <MapPin className="w-[34px] h-[34px] text-[#0ea5a4] fill-[#0ea5a4]/20 drop-shadow-md animate-bounce-short" />
           <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[2px] w-1.5 h-1.5 bg-[#0ea5a4] rounded-full shadow-sm"></div>
         </div>
      </div>

      {/* Map Container */}
      <div id={mapId} ref={mapContainerRef} className="h-full w-full rounded-md z-0" />
    </div>
  );
}
