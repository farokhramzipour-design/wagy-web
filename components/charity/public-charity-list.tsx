"use client";

import { PublicCharityCard } from "@/components/charity/public-charity-card";
import { useLanguage } from "@/components/providers/language-provider";
import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import { charityPublicApi } from "@/services/charity-public-api";
import { CharityCase } from "@/types/charity-public";
import { Heart, Loader2, ArrowRight } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { SessionData } from "@/lib/session";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const content = { en, fa };

interface PublicCharityListProps {
  session: SessionData | null;
}

export function PublicCharityList({ session }: PublicCharityListProps) {
  const { lang } = useLanguage();
  const t = (content[lang] as any).charity;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState<CharityCase[]>([]);
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const data = await charityPublicApi.getCases();
      setCases(data || []);
    } catch (error) {
      console.error("Failed to fetch cases", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = useMemo(() => {
    let result = [...cases];

    // Filter by category
    if (category !== "all") {
      result = result.filter(c => {
         // Simple string matching for now since we don't have exact category IDs
         const catName = c.category?.name?.toLowerCase() || "";
         if (category === "medical") return catName.includes("medical") || catName.includes("درمانی");
         if (category === "shelter") return catName.includes("shelter") || catName.includes("پناهگاه");
         if (category === "food") return catName.includes("food") || catName.includes("غذا");
         return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "goalLowHigh":
          return a.target_amount_minor - b.target_amount_minor;
        case "goalHighLow":
          return b.target_amount_minor - a.target_amount_minor;
        default:
          return 0;
      }
    });

    return result;
  }, [cases, category, sortBy]);

  const handleJoinClick = () => {
    if (session) {
      router.push("/app/charity");
    } else {
      router.push("/auth?next=/app/charity");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#0ea5a4]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-[#f8fafc]">
      {/* Hero Section */}
      <div className="relative py-20 lg:py-28 overflow-hidden bg-[#103745]">
         {/* Background elements */}
         <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] bg-[#0ea5a4] opacity-20 blur-[80px] rounded-full animate-pulse"></div>
         <div className="absolute bottom-[-10%] left-[-5%] w-[250px] h-[250px] bg-[#ff6b6b] opacity-15 blur-[80px] rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
         
         <div className="container mx-auto px-4 relative z-10 text-center">
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#ffffff]/10 text-[#0ea5a4] text-sm font-bold backdrop-blur-sm border border-[#ffffff]/10 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
               🐾 {t.pageTitle}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
              {t.landing.title}
            </h1>
            <p className="text-lg md:text-xl text-[#dce6e8] max-w-2xl mx-auto leading-relaxed mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              {t.pageSubtitle}
            </p>
         </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="sticky top-[72px] z-30 bg-[#ffffff]/80 backdrop-blur-md border-b border-[#e2e8f0] mb-10 transition-all duration-300">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
           {/* Tabs */}
           <Tabs defaultValue="all" value={category} onValueChange={setCategory} className="w-full md:w-auto">
             <TabsList className="bg-[#f1f5f9] p-1 rounded-xl h-auto flex-wrap justify-center">
               <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#103745] data-[state=active]:shadow-sm transition-all duration-200 px-4 py-2">{t.filters.all}</TabsTrigger>
               <TabsTrigger value="medical" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#103745] data-[state=active]:shadow-sm transition-all duration-200 px-4 py-2">{t.filters.medical}</TabsTrigger>
               <TabsTrigger value="shelter" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#103745] data-[state=active]:shadow-sm transition-all duration-200 px-4 py-2">{t.filters.shelter}</TabsTrigger>
               <TabsTrigger value="food" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#103745] data-[state=active]:shadow-sm transition-all duration-200 px-4 py-2">{t.filters.food}</TabsTrigger>
             </TabsList>
           </Tabs>
           
           {/* Sort */}
           <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end">
             <span className="text-sm font-medium text-[#64748b] whitespace-nowrap hidden sm:inline-block">{t.sort.placeholder}:</span>
             <Select value={sortBy} onValueChange={setSortBy}>
               <SelectTrigger className="w-full md:w-[200px] bg-white border-[#e2e8f0] rounded-xl focus:ring-[#0ea5a4] focus:border-[#0ea5a4]">
                 <SelectValue placeholder={t.sort.placeholder} />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="newest">{t.sort.newest}</SelectItem>
                 <SelectItem value="oldest">{t.sort.oldest}</SelectItem>
                 <SelectItem value="goalLowHigh">{t.sort.goalLowHigh}</SelectItem>
                 <SelectItem value="goalHighLow">{t.sort.goalHighLow}</SelectItem>
               </SelectContent>
             </Select>
           </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 relative z-20">
        {filteredCases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCases.map((charityCase, index) => (
              <PublicCharityCard 
                key={charityCase.charity_case_id} 
                charityCase={charityCase} 
                featured={index === 0} // First one is featured
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-[#e2e8f0]">
            <div className="w-20 h-20 bg-[#f1f5f9] rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-[#94a3b8]" />
            </div>
            <h3 className="text-2xl font-bold text-[#1e293b]">{t.noDonations}</h3>
            <p className="text-[#64748b] mt-2">{t.listDesc}</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 mt-20 mb-10">
        <div className="relative rounded-[32px] overflow-hidden bg-[#103745] px-6 py-16 md:px-16 text-center">
           {/* Background decorative elements */}
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#0ea5a4] opacity-10 blur-[100px] rounded-full"></div>
           <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#ff6b6b] opacity-10 blur-[100px] rounded-full"></div>
           
           <div className="relative z-10 max-w-3xl mx-auto">
             <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
               {t.ctaSection.title}
             </h2>
             <p className="text-lg text-[#dce6e8] mb-10 leading-relaxed">
               {t.ctaSection.subtitle}
             </p>
             <button 
               onClick={handleJoinClick}
               className="bg-gradient-to-r from-[#0ea5a4] to-[#0b7c7b] text-white font-bold py-4 px-10 rounded-xl shadow-[0_10px_30px_rgba(14,165,164,0.3)] hover:translate-y-[-2px] hover:shadow-[0_15px_35px_rgba(14,165,164,0.4)] transition-all duration-300 flex items-center gap-2 mx-auto cursor-pointer"
             >
               {t.ctaSection.button}
               <ArrowRight className="w-5 h-5" />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
