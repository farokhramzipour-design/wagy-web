"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
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
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [pets, setPets] = useState<number>(1);

  // Initialize from URL params
  useEffect(() => {
    const pServiceType = searchParams.get("service_type_id");
    const pDate = searchParams.get("date");
    const pPets = searchParams.get("pets");

    // Only set from URL if state is empty or matching URL param
    if (pServiceType) {
      setServiceTypeId(pServiceType);
    } else if (initialServiceTypes.length > 0 && !serviceTypeId) {
      setServiceTypeId(initialServiceTypes[0].service_type_id.toString());
    }

    if (pDate) setDate(new Date(pDate));
    if (pPets) setPets(parseInt(pPets));
  }, [searchParams, initialServiceTypes]); // Removed serviceTypeId from deps to avoid overwriting user selection

  const handleServiceSelect = (id: string) => {
    setServiceTypeId(id);

    // Update URL without navigation to keep search params in sync if on search page
    const params = new URLSearchParams(searchParams.toString());
    params.set("service_type_id", id);
    // We don't want to push full navigation here as it might trigger page reload or complex effect chains
    // But if the user expects the URL to change immediately:
    // router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (serviceTypeId) params.set("service_type_id", serviceTypeId);
    if (date) params.set("date", format(date, "yyyy-MM-dd"));
    if (pets) params.set("pets", pets.toString());

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex flex-col items-stretch w-full max-w-4xl mx-auto gap-4">
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

      <div className="flex flex-col md:flex-row gap-4 items-center w-full">
        {/* Date */}
        <div className="flex-1 w-full">
          <label className="text-xs text-gray-500 font-medium mb-1 block uppercase tracking-wider">{tSearch.date}</label>
          <DatePicker
            date={date}
            setDate={setDate}
            locale={lang}
            placeholder={tSearch.select_date}
            className="w-full h-12 border border-gray-200 rounded-lg px-3 bg-gray-50 hover:bg-white transition-colors"
          />
        </div>

        {/* Pets */}
        <div className="w-full md:w-32">
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

        <div className="w-full md:w-auto mt-auto pt-6 md:pt-0">
          <Button size="lg" className="w-full md:w-auto h-12 px-8 rounded-lg bg-primary hover:bg-primary/90 text-white shadow-md" onClick={handleSearch}>
            <Search className="w-5 h-5 mr-2" />
            {tSearch.search_button}
          </Button>
        </div>
      </div>
    </div>
  );
}
