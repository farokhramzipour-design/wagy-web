"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { SearchDiscoveryServiceType } from "@/services/search-api";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const content = { en, fa };

interface DiscoverySearchBarProps {
  initialServiceTypes?: SearchDiscoveryServiceType[];
}

export function DiscoverySearchBar({ initialServiceTypes = [] }: DiscoverySearchBarProps) {
  const { lang } = useLanguage();
  const t = content[lang];
  const tSearch = content[lang].search_sitter;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [serviceTypes, setServiceTypes] = useState<SearchDiscoveryServiceType[]>(initialServiceTypes);

  // Form State
  const [serviceTypeId, setServiceTypeId] = useState<string>("");
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("");
  const [pets, setPets] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("distance");

  // Initialize from URL params
  useEffect(() => {
    const pServiceType = searchParams.get("service_type_id");
    const pBookingDate = searchParams.get("booking_date");
    const pCheckInDate = searchParams.get("check_in_date");
    const pCheckOutDate = searchParams.get("check_out_date");
    const pDate = searchParams.get("date"); // Legacy support
    const pStartTime = searchParams.get("start_time");
    const pPets = searchParams.get("pets");
    const pSortBy = searchParams.get("sort_by");

    // Service Type
    if (pServiceType) {
      setServiceTypeId(pServiceType);
    } else if (initialServiceTypes.length > 0 && !serviceTypeId) {
      setServiceTypeId(initialServiceTypes[0].service_type_id.toString());
    }

    // Dates
    if (pCheckInDate) setCheckInDate(new Date(pCheckInDate));
    else if (pBookingDate) setCheckInDate(new Date(pBookingDate));
    else if (pDate) setCheckInDate(new Date(pDate));

    if (pCheckOutDate) setCheckOutDate(new Date(pCheckOutDate));

    // Other fields
    if (pStartTime) setStartTime(pStartTime);
    if (pPets) setPets(parseInt(pPets));
    if (pSortBy) setSortBy(pSortBy);

  }, [searchParams, initialServiceTypes]);

  const handleServiceSelect = (id: string) => {
    setServiceTypeId(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set("service_type_id", id);
    // router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (serviceTypeId) params.set("service_type_id", serviceTypeId);

    // Date Logic
    if (checkInDate) {
      if (checkOutDate) {
        // Range mode
        params.set("check_in_date", format(checkInDate, "yyyy-MM-dd"));
        params.set("check_out_date", format(checkOutDate, "yyyy-MM-dd"));
      } else {
        // Single date mode
        params.set("booking_date", format(checkInDate, "yyyy-MM-dd"));
      }
    }

    if (startTime) params.set("start_time", startTime);
    if (pets) params.set("number_of_pets", pets.toString());
    // Also support legacy 'pets' param if needed, but schema says 'number_of_pets'.
    // However, existing code might expect 'pets'. I'll set both or switch to new one.
    // The schema user provided says "number_of_pets".
    // I'll use "number_of_pets" but keep "pets" for now if other components use it, or just switch.
    // The SearchPageClient uses "pets". I should update it to use "number_of_pets" preferably, or map it.
    // I'll stick to what SearchPageClient expects for now, which is "pets" in the URL -> mapped to "number_of_pets" in API.
    // Wait, SearchPageClient currently reads "pets".
    // I will use "pets" in URL for consistency, and map it to "number_of_pets" in API call.
    params.set("pets", pets.toString());

    if (sortBy) params.set("sort_by", sortBy);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex flex-col items-stretch w-full max-w-5xl mx-auto gap-4">
      {/* Service Types - Horizontal Radio List */}
      <div className="w-full overflow-x-auto pb-2 -mb-2">
        <div className="flex gap-2">
          {serviceTypes.map((st) => {
            const isSelected = serviceTypeId === st.service_type_id.toString();
            return (
              <button
                key={st.service_type_id}
                onClick={() => handleServiceSelect(st.service_type_id.toString())}
                className={`
                            px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                            ${isSelected
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }
                        `}
              >
                {lang === "fa" ? st.name_fa : st.name_en}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end w-full">
        {/* Check-in / Booking Date */}
        <div className="w-full">
          <label className="text-xs text-gray-500 font-medium mb-1 block uppercase tracking-wider">{tSearch.check_in}</label>
          <DatePicker
            date={checkInDate}
            setDate={setCheckInDate}
            locale={lang}
            placeholder={tSearch.select_date}
            className="w-full h-12 border border-gray-200 rounded-lg px-3 bg-gray-50 hover:bg-white transition-colors"
          />
        </div>

        {/* Check-out Date (Optional) */}
        <div className="w-full">
          <label className="text-xs text-gray-500 font-medium mb-1 block uppercase tracking-wider">{tSearch.check_out} <span className="text-gray-300 text-[10px] lowercase">{tSearch.optional}</span></label>
          <DatePicker
            date={checkOutDate}
            setDate={setCheckOutDate}
            locale={lang}
            placeholder={tSearch.select_date}
            className="w-full h-12 border border-gray-200 rounded-lg px-3 bg-gray-50 hover:bg-white transition-colors"
          />
        </div>

        {/* Start Time */}
        <div className="w-full">
          <label className="text-xs text-gray-500 font-medium mb-1 block uppercase tracking-wider">{tSearch.time}</label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full h-12 border border-gray-200 rounded-lg px-3 bg-gray-50 hover:bg-white transition-colors"
          />
        </div>

        {/* Pets */}
        <div className="w-full">
          <label className="text-xs text-gray-500 font-medium mb-1 block uppercase tracking-wider">{tSearch.pets}</label>
          <Input
            type="number"
            min={1}
            max={10}
            value={pets}
            onChange={(e) => setPets(parseInt(e.target.value) || 1)}
            className="w-full h-12 border border-gray-200 rounded-lg px-3 bg-gray-50 hover:bg-white transition-colors"
          />
        </div>

        {/* Sort By */}
        <div className="w-full">
          <label className="text-xs text-gray-500 font-medium mb-1 block uppercase tracking-wider">{tSearch.sort_by}</label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full h-12 border border-gray-200 rounded-lg px-3 bg-gray-50 hover:bg-white transition-colors">
              <SelectValue placeholder={tSearch.sort_by} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="distance">{tSearch.distance}</SelectItem>
              <SelectItem value="price">{tSearch.price}</SelectItem>
              <SelectItem value="rating">{tSearch.rating}</SelectItem>
              <SelectItem value="response_time">{tSearch.response_time}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <div className="w-full md:col-span-2 lg:col-span-5 mt-2">
          <Button size="lg" className="w-full h-12 px-8 rounded-lg bg-primary hover:bg-primary/90 text-white shadow-md" onClick={handleSearch}>
            <Search className="w-5 h-5 mr-2" />
            {tSearch.search_button}
          </Button>
        </div>
      </div>
    </div>
  );
}
