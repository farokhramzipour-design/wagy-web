"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import en from "../../locales/en.json";
import fa from "../../locales/fa.json";
import { Button } from "@/components/ui/button";
import { BedDouble, Home, Footprints, Sun, Dog } from "lucide-react";

type Lang = "en" | "fa";
type ServiceCategory = "all" | "overnight" | "daytime";

const content = { en, fa };

const serviceImages = [
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80", // Boarding
  "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80", // House Sitting
  "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?auto=format&fit=crop&w=800&q=80", // Dog Walking
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80", // Day Care
  "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80"  // Drop-In
];

const serviceMetadata = [
  {
    icon: BedDouble,
    subtitleKey: "inSitterHome",
    category: "overnight" as const,
    color: "text-blue-600",
    isPopular: true
  },
  {
    icon: Home,
    subtitleKey: "inYourHome",
    category: "overnight" as const,
    color: "text-blue-600",
    isPopular: false
  },
  {
    icon: Footprints,
    subtitleKey: "neighborhood",
    category: "daytime" as const,
    color: "text-green-600",
    isPopular: true
  },
  {
    icon: Sun,
    subtitleKey: "daytime",
    category: "daytime" as const,
    color: "text-orange-500",
    isPopular: false
  },
  {
    icon: Dog,
    subtitleKey: "dropIn",
    category: "daytime" as const,
    color: "text-orange-500",
    isPopular: false
  }
];

export default function ServicesPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [filter, setFilter] = useState<ServiceCategory>("all");

  useEffect(() => {
    const saved = localStorage.getItem("waggy_lang");
    if (saved === "fa" || saved === "en") {
      setLang(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("waggy_lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  }, [lang]);

  const t = useMemo(() => content[lang], [lang]);

  // Extend the translation object with subtitles if not present, or use defaults
  const subtitles = {
    inSitterHome: lang === "en" ? "In sitter's home • For dogs and cats" : "در خانه مراقب • برای سگ و گربه",
    inYourHome: lang === "en" ? "In your home • For dogs and cats" : "در خانه شما • برای سگ و گربه",
    neighborhood: lang === "en" ? "In your neighborhood • For dogs" : "در محله شما • برای سگ‌ها",
    daytime: lang === "en" ? "In sitter's home • For dogs" : "در خانه مراقب • برای سگ‌ها",
    dropIn: lang === "en" ? "In your home • For dogs and cats" : "در خانه شما • برای سگ و گربه"
  };

  const services = t.services.items.map((item, index) => {
    const meta = serviceMetadata[index] || serviceMetadata[0];
    return {
      title: item[0],
      description: item[1],
      photo: serviceImages[index],
      ...meta,
      subtitle: subtitles[meta.subtitleKey as keyof typeof subtitles]
    };
  });

  const filtered = filter === "all" ? services : services.filter((service) => service.category === filter);
  
  // Sort by popularity
  const sortedServices = [...filtered].sort((a, b) => (Number(b.isPopular) - Number(a.isPopular)));

  const filterOptions = [
    { id: "all", label: lang === "en" ? "All services" : "همه خدمات" },
    { id: "overnight", label: lang === "en" ? "Overnight care" : "مراقبت شبانه" },
    { id: "daytime", label: lang === "en" ? "Daytime care" : "مراقبت روزانه" }
  ] as const;

  return (
    <div className="bg-white min-h-screen text-neutral-900">
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <Link href="/landing" className="text-2xl font-bold tracking-tight text-[#0ea5a4]">Waggy</Link>
          
          <nav className="hidden md:flex gap-6 text-sm font-medium text-neutral-600">
            <Link href="/landing#services" className="hover:text-[#0ea5a4] transition-colors">{t.nav.services}</Link>
            <Link href="/landing#how" className="hover:text-[#0ea5a4] transition-colors">{t.nav.how}</Link>
            <Link href="/landing#safety" className="hover:text-[#0ea5a4] transition-colors">{t.nav.safety}</Link>
            <Link href="/landing#become" className="hover:text-[#0ea5a4] transition-colors">{t.nav.sitter}</Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-neutral-100 rounded-full p-1">
              <button 
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${lang === "en" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-900"}`}
                onClick={() => setLang("en")}
              >
                EN
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${lang === "fa" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-900"}`}
                onClick={() => setLang("fa")}
              >
                FA
              </button>
            </div>
            <Link href="/auth">
              <Button variant="outline" className="hidden sm:flex rounded-full border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900">
                {t.nav.login}
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="rounded-full bg-[#0ea5a4] hover:bg-[#0b7c7b] text-white px-6">
                {t.nav.cta}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto px-4 lg:px-6 py-12">
        <div className="flex flex-wrap gap-3 mb-12 justify-start">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setFilter(option.id as ServiceCategory)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                filter === option.id
                  ? "border-[#0ea5a4] text-[#0ea5a4] bg-[#f0fdfd] ring-1 ring-[#0ea5a4] ring-offset-0"
                  : "border-neutral-300 text-neutral-600 bg-white hover:border-neutral-400 hover:bg-neutral-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="space-y-12">
          {sortedServices.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.title} className="group flex flex-col md:flex-row gap-6 items-start relative">
                <div className="w-full md:w-[320px] shrink-0 relative">
                  <div className="aspect-[3/2] w-full overflow-hidden rounded-2xl bg-neutral-100">
                    <img 
                      src={service.photo} 
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {service.isPopular && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#0ea5a4] shadow-sm border border-neutral-100 flex items-center gap-1.5">
                       <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0ea5a4] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0ea5a4]"></span>
                      </span>
                      {lang === "en" ? "POPULAR" : "محبوب"}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 py-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-neutral-50 ${service.color}`}>
                      <Icon size={24} strokeWidth={2} />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900">{service.title}</h2>
                  </div>
                  
                  <p className="text-sm font-medium text-neutral-500 mb-4 flex items-center gap-2">
                    {service.subtitle}
                  </p>
                  
                  <p className="text-base leading-relaxed text-neutral-600 mb-6 max-w-xl">
                    {service.description}
                  </p>
                  
                  <Link href="/auth" className="inline-block w-full md:w-auto">
                    <Button 
                      variant="outline" 
                      className="w-full md:w-auto rounded-full border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 font-semibold px-8 h-11"
                    >
                      {lang === "en" ? `Explore ${service.title}` : `مشاهده ${service.title}`}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
