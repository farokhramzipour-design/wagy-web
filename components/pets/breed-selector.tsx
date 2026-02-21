"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBreeds, type Breed } from "@/services/pet-api";
import { useLanguage } from "@/components/providers/language-provider";

interface BreedSelectorProps {
  value: number;
  onChange: (value: number) => void;
  petType: "dog" | "cat";
  accessToken: string | undefined;
  excludeIds?: number[];
  disabled?: boolean;
  placeholder?: string;
  error?: boolean;
}

export function BreedSelector({
  value,
  onChange,
  petType,
  accessToken,
  excludeIds = [],
  disabled,
  placeholder = "Select breed",
  error
}: BreedSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();

  // Fetch breeds logic
  const fetchBreeds = async (query: string = "") => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const data = await getBreeds(accessToken, petType, query);
      setBreeds(data);
    } catch (err) {
      console.error("Failed to fetch breeds", err);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (open) {
        fetchBreeds(searchTerm);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, accessToken, petType, open]);

  // Initial fetch to find selected breed name if we have a value but no breed object
  useEffect(() => {
    if (value && accessToken && !selectedBreed) {
        // We fetch all or search for this specific one if API supported by ID, but currently only by query
        // Since we don't have getBreedById, we'll fetch default list and hope it's there, 
        // or rely on parent passing the initial list?
        // Actually, let's just fetch default list on mount if we have a value.
        // Or better, when opening, we fetch.
        // For displaying the name when closed, we need the breed object.
        // If the parent component already fetches breeds, maybe we should accept `initialBreeds` or `breedName`?
        // But the requirement is to add search capability.
        // Let's just fetch once on mount to try to resolve the name.
        fetchBreeds("");
    }
  }, [accessToken, petType]); // Only run once or when dependencies change

  // Update selectedBreed when breeds list updates or value changes
  useEffect(() => {
    if (value && breeds.length > 0) {
       const found = breeds.find(b => b.breed_id === value);
       if (found) setSelectedBreed(found);
    } else if (!value) {
       setSelectedBreed(null);
    }
  }, [value, breeds]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (breed: Breed) => {
    onChange(breed.breed_id);
    setSelectedBreed(breed);
    setOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative" ref={containerRef}>
      <div 
        className={cn(
          "flex items-center justify-between w-full h-10 px-3 py-2 text-sm border rounded-md bg-white cursor-pointer hover:bg-neutral-50 transition-colors",
          error ? "border-red-500" : "border-neutral-200",
          disabled && "opacity-50 cursor-not-allowed hover:bg-white"
        )}
        onClick={() => !disabled && setOpen(!open)}
      >
        <span className={cn("truncate", !selectedBreed && "text-muted-foreground")}>
          {selectedBreed ? (lang === 'fa' ? selectedBreed.name_fa : selectedBreed.name_en) : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-neutral-500 opacity-50" />
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-md shadow-lg max-h-60 flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100">
          <div className="p-2 border-b border-neutral-100 sticky top-0 bg-white z-10">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-neutral-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={lang === 'fa' ? "جستجو..." : "Search breeds..."}
                className="pl-8 h-9 border-neutral-200 focus-visible:ring-1"
                autoFocus
              />
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1 p-1 custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center p-4 text-neutral-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {lang === 'fa' ? "در حال بارگذاری..." : "Loading..."}
              </div>
            ) : breeds.length === 0 ? (
              <div className="p-4 text-center text-sm text-neutral-500">
                {lang === 'fa' ? "نژادی یافت نشد" : "No breeds found"}
              </div>
            ) : (
              breeds
                .filter(b => !excludeIds.includes(b.breed_id))
                .map((breed) => (
                <div
                  key={breed.breed_id}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-sm rounded-sm cursor-pointer hover:bg-neutral-100 transition-colors",
                    value === breed.breed_id && "bg-neutral-50 text-neutral-900 font-medium"
                  )}
                  onClick={() => handleSelect(breed)}
                >
                  <span>{lang === 'fa' ? breed.name_fa : breed.name_en}</span>
                  {value === breed.breed_id && <Check className="w-4 h-4 text-[#0ea5a4]" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
