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
import { Briefcase, Footprints, Home, MapPin, Search, Sun } from "lucide-react";
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
    params.set("pets", pets.toString());

    if (sortBy) params.set("sort_by", sortBy);

    router.push(`/search?${params.toString()}`);
  };

  const getServiceIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("boarding") || n.includes("hotel")) return <Briefcase className="w-5 h-5 mb-2" />;
    if (n.includes("house") || n.includes("sitting")) return <Home className="w-5 h-5 mb-2" />;
    if (n.includes("drop") || n.includes("visit")) return <MapPin className="w-5 h-5 mb-2" />;
    if (n.includes("day") || n.includes("care")) return <Sun className="w-5 h-5 mb-2" />;
    if (n.includes("walk")) return <Footprints className="w-5 h-5 mb-2" />;
    return <Briefcase className="w-5 h-5 mb-2" />;
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-neutral-200 flex flex-col w-full max-w-4xl mx-auto gap-6 shadow-sm">
      {/* Service Types - Cards Grid */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider hidden md:block">
          {tSearch.select_service || "Select Service"}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {serviceTypes.map((st) => {
            const isSelected = serviceTypeId === st.service_type_id.toString();
            return (
              <button
                key={st.service_type_id}
                onClick={() => handleServiceSelect(st.service_type_id.toString())}
                className={`
                  flex flex-col items-center justify-center p-3 rounded-lg border transition-all h-24 duration-200
                  ${isSelected
                    ? "bg-primary/5 border-primary text-primary shadow-sm"
                    : "bg-white border-gray-200 text-gray-600 hover:border-[#0ea5a4]/50 hover:bg-teal-50 hover:text-teal-600 hover:-translate-y-0.5"
                  }
                `}
              >
                {getServiceIcon(st.name_en)}
                <span className="text-xs font-medium text-center leading-tight">
                  {lang === "fa" ? st.name_fa : st.name_en}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
        {/* Search Inputs Group */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
            {/* Check-in / Booking Date */}
            <div className="w-full">
              <label className="text-xs text-gray-500 font-medium mb-1 block uppercase tracking-wider">{tSearch.check_in}</label>
              <DatePicker
                date={checkInDate}
                setDate={setCheckInDate}
                locale={lang}
                placeholder={tSearch.select_date}
                className="w-full h-11 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Check-out Date */}
            <div className="w-full">
              <label className="text-xs text-gray-500 font-medium mb-1 block uppercase tracking-wider">{tSearch.check_out}</label>
              <DatePicker
                date={checkOutDate}
                setDate={setCheckOutDate}
                locale={lang}
                placeholder={tSearch.select_date}
                className="w-full h-11 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Start Time (Optional) */}
            <div className="w-full">
               <label className="text-xs text-gray-500 font-medium mb-1 block uppercase tracking-wider">{tSearch.time}</label>
               <Input
                 type="time"
                 value={startTime}
                 onChange={(e) => setStartTime(e.target.value)}
                 className="w-full h-11 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
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
                className="w-full h-11 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>
        </div>

        {/* Search Button */}
        <div className="w-full md:w-auto">
          <Button 
            size="lg" 
            className="w-full md:w-32 h-11 rounded-md bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-md transition-transform active:scale-95" 
            onClick={handleSearch}
          >
            {tSearch.search_button}
          </Button>
        </div>
      </div>
    </div>
  );
}
