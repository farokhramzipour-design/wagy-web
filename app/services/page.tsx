"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import en from "../../locales/en.json";
import fa from "../../locales/fa.json";
import { Button } from "@/components/ui/button";

type Lang = "en" | "fa";
type ServiceFilter = "all" | "sitter" | "home" | "daily";

const content = { en, fa };

const serviceImages = [
  "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1611003229186-80e40cd54966?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80"
];

const categoryByIndex: ServiceFilter[] = ["sitter", "home", "daily", "daily", "home"];

export default function ServicesPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [filter, setFilter] = useState<ServiceFilter>("all");

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
  const services = t.services.items.map((item, index) => ({
    title: item[0],
    description: item[1],
    photo: serviceImages[index] ?? serviceImages[0],
    category: categoryByIndex[index] ?? "daily"
  }));

  const filtered = filter === "all" ? services : services.filter((service) => service.category === filter);
  const filterOptions: ServiceFilter[] = ["all", "sitter", "home", "daily"];

  return (
    <div className="pb-16 bg-[#f2f4f7] min-h-screen">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/88 backdrop-blur-md">
        <div className="w-full max-w-[1280px] mx-auto px-4 lg:px-6 grid grid-cols-1 justify-items-start py-3 gap-4 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:py-0 lg:min-h-[72px]">
          <Link href="/landing" className="text-[22px] font-bold tracking-tight text-neutral-800">Waggy</Link>
          <nav className="flex gap-4 text-sm text-neutral-600 justify-self-start lg:justify-self-center rtl:text-xs">
            <Link href="/landing#services">{t.nav.services}</Link>
            <Link href="/landing#how">{t.nav.how}</Link>
            <Link href="/landing#safety">{t.nav.safety}</Link>
            <Link href="/landing#become">{t.nav.sitter}</Link>
          </nav>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center border border-neutral-200 rounded-full overflow-hidden bg-white" role="group" aria-label="language">
              <button className={`border-0 bg-transparent text-neutral-600 text-xs font-semibold px-3 py-2 cursor-pointer ${lang === "en" ? "bg-[#d1faf9] text-[#0b7c7b]" : ""}`} onClick={() => setLang("en")}>EN</button>
              <button className={`border-0 bg-transparent text-neutral-600 text-xs font-semibold px-3 py-2 cursor-pointer ${lang === "fa" ? "bg-[#d1faf9] text-[#0b7c7b]" : ""}`} onClick={() => setLang("fa")}>FA</button>
            </div>
            <Link href="/auth">
              <Button variant="secondary" className="bg-transparent border border-neutral-200 text-neutral-800 hover:bg-neutral-100 rounded-[12px] h-auto py-3 px-5 rtl:text-xs rtl:px-3.5 rtl:py-2.5">
                {t.nav.login}
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="rounded-[12px] h-auto py-3 px-5 bg-[#0ea5a4] hover:bg-[#0b7c7b] rtl:text-xs rtl:px-3.5 rtl:py-2.5">
                {t.nav.cta}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1280px] mx-auto px-4 lg:px-6">
        <section className="mt-6 rounded-[20px] bg-[radial-gradient(120%_100%_at_0%_0%,rgba(14,165,164,0.14),rgba(255,255,255,0)_58%),radial-gradient(120%_100%_at_100%_100%,rgba(255,107,107,0.12),rgba(255,255,255,0)_46%),#f7fcfb] p-6 border border-neutral-200 shadow-sm">
          <div>
            <h1 className="m-0 mb-3 text-[48px] leading-[1.2] font-bold text-neutral-800 max-md:text-[36px]">{t.servicesPage.title}</h1>
            <p className="m-0 text-neutral-600 max-w-[760px] mt-2">{t.servicesPage.subtitle}</p>
            <div className="mt-6 flex gap-3 flex-wrap">
              <Link href="/landing">
                <Button variant="secondary" className="bg-transparent border border-neutral-200 text-neutral-800 hover:bg-neutral-100 rounded-[12px] h-auto py-3 px-5">
                  {t.servicesPage.back}
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3.5">
            {t.servicesPage.highlights.map((highlight) => (
              <span className="border border-neutral-200 bg-white rounded-full text-xs text-neutral-600 px-2.5 py-1.5" key={highlight}>{highlight}</span>
            ))}
          </div>
        </section>

        <section className="mt-3.5 p-3.5 rounded-[16px] border border-neutral-200 bg-white/92 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option, index) => (
              <button
                key={option}
                className={`border border-neutral-200 rounded-full bg-white text-neutral-600 px-3.5 py-2 cursor-pointer transition-all hover:border-[#0ea5a4] hover:text-[#0b7c7b] text-sm ${filter === option ? "bg-[#d1faf9] border-[#0ea5a4] text-[#0b7c7b]" : ""}`}
                onClick={() => setFilter(option)}
              >
                {t.servicesPage.filters[index]}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((service) => (
            <article className="overflow-hidden p-0 rounded-[14px] border border-neutral-200 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-250" key={service.title}>
              <img src={service.photo} alt={service.title} className="w-full h-[220px] object-cover block" loading="lazy" />
              <div className="p-[18px] grid gap-2.5">
                <h3 className="m-0 text-[30px] text-[#123749] font-bold max-lg:text-[24px]">{service.title}</h3>
                <p className="m-0 text-base text-neutral-600">{service.description}</p>
                <Link href="/auth">
                  <Button className="rounded-[12px] h-auto py-3 px-5 bg-[#0ea5a4] text-white shadow-sm hover:bg-[#0b7c7b]">
                    {t.servicesPage.primary}
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
