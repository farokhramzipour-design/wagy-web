"use client";

import { CharitySection } from "@/components/landing/charity-section";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import type { SessionData } from "@/lib/session";
import { ProfileCompletionResponse } from "@/services/profile-api";
import { Check, CheckCircle, ChevronDown, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import en from "../../locales/en.json";
import fa from "../../locales/fa.json";
import { TokenLoginBootstrap } from "../auth/token-login-bootstrap";
import { Header } from "../layout/header";

type Lang = "en" | "fa";

const content = { en, fa };

function CountUp({
  target,
  lang,
  suffix
}: {
  target: number;
  lang: Lang;
  suffix: string;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const frames = 28;
    let current = 0;
    const step = target / frames;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(current);
      }
    }, 24);
    return () => clearInterval(timer);
  }, [target]);

  const rounded = target % 1 === 0 ? Math.round(value) : Number(value.toFixed(1));
  const text =
    typeof rounded === "number"
      ? lang === "fa"
        ? rounded.toLocaleString("fa-IR")
        : rounded.toLocaleString("en-US")
      : String(rounded);

  return (
    <strong className="block text-[38px] font-bold leading-[1.2] text-[#0b7c7b]">
      {text}
      {suffix}
    </strong>
  );
}

import { getDiscoveryServiceTypes, SearchDiscoveryServiceType } from "@/services/search-api";
import { DiscoverySearchBar } from "../search/discovery-search-bar";

export function LandingPage({ 
  user, 
  profileCompletion,
  initialServiceTypes = [] 
}: { 
  user: SessionData | null; 
  profileCompletion?: ProfileCompletionResponse | null;
  initialServiceTypes?: SearchDiscoveryServiceType[];
}) {
  const { lang } = useLanguage();

  const t = useMemo(() => content[lang], [lang]);
  const trustBadges = t.hero.trust.split(" • ");
  const serviceImages = [
    "/images/pet-boarding.jpg",
    "/images/home-care.jpg",
    "/images/pet-walking.jpg",
    "/images/day-care.jpg",
    "/images/drop-in.jpg"
  ];
  const heroImage = "/images/hero-bg.jpg";
  const safetyImage = "/images/safety.jpg";
  const sitterImage = "/images/love-pet.jpg";

  return (
    <div className="pb-16 bg-[#f2f4f7]">
      <Suspense fallback={null}>
        <TokenLoginBootstrap />
      </Suspense>

      <Header user={user} profileCompletion={profileCompletion} />

      <main className="w-full max-w-[1440px] mx-auto px-4 lg:px-6">
        <section className="relative mt-4 rounded-[24px] overflow-hidden min-h-[500px] flex flex-col items-center justify-center text-center py-16 md:py-20 px-4">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={heroImage}
              alt={t.hero.photoLabel}
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-6">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold px-4 py-2 rounded-full mb-2">
              <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_0_4px_rgba(74,222,128,0.2)] animate-pulse" />
              بیش از ۵۰۰ مراقب فعال در سراسر ایران
            </div>
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-md leading-relaxed md:leading-relaxed lg:leading-relaxed max-w-3xl py-2">
              {t.hero.title}
            </h1>
            <p className="text-white/90 text-lg md:text-xl font-medium drop-shadow-sm max-w-2xl leading-relaxed">
              {t.hero.subtitle}
            </p>
            
            <div className="w-full mt-4">
              <DiscoverySearchBar initialServiceTypes={initialServiceTypes} />
            </div>
            
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              {trustBadges.map((badge) => (
                <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold text-gray-800 shadow-sm flex items-center gap-2" key={badge}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {badge}
                </span>
              ))}
              <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold text-gray-800 shadow-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>بازپرداخت تضمینی
              </span>
            </div>
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/50 text-xs animate-bounce">
            <div className="w-7 h-7 rounded-full border border-white/30 flex items-center justify-center">
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>
        </section>

        <section className="mt-3.5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 bg-white rounded-[14px] border border-[#dce6e8] p-2.5">
            {t.socialProof.items.map((item) => (
              <article className="border border-neutral-200 bg-[#f7fbfb] rounded-xl shadow-none p-3.5 text-center" key={item.label}>
                <CountUp target={item.value} suffix={item.suffix} lang={lang} />
                <span className="mt-1.5 flex items-center justify-center gap-1 text-neutral-600 text-[13px]">
                  {item.label}
                  <Check className="w-3.5 h-3.5 text-[#0ea5a4]" />
                </span>
              </article>
            ))}
          </div>
          <div className="mt-3.5 flex items-center gap-6 bg-white rounded-[14px] border border-[#dce6e8] px-6 py-4 overflow-hidden">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap pl-6 border-l border-[#dce6e8] hidden sm:block">
              در رسانه‌ها
            </span>
            <div className="flex items-center gap-8 flex-1 justify-center opacity-35 grayscale flex-wrap sm:flex-nowrap">
              <span className="text-[13px] font-extrabold text-neutral-800">دیجیاتو</span>
              <span className="text-[13px] font-extrabold text-neutral-800">زومیت</span>
              <span className="text-[13px] font-extrabold text-neutral-800">ایران استارتاپ</span>
              <span className="text-[13px] font-extrabold text-neutral-800">تک‌رسا</span>
              <span className="text-[13px] font-extrabold text-neutral-800">اکوایران</span>
            </div>
          </div>
        </section>

        <section id="services" className="mt-[18px] rounded-[20px] bg-[#fbfdfd] p-6 border border-neutral-200 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
            <h2 className="m-0 text-2xl lg:text-3xl leading-[1.25] text-[#103745] text-center lg:text-start font-bold">{t.services.title}</h2>
            <Link href="/services">
              <Button variant="secondary" className="whitespace-nowrap bg-transparent border border-neutral-200 text-neutral-800 hover:bg-neutral-100 rounded-[12px] h-auto py-3 px-5">
                {t.services.seeAll}
              </Button>
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {t.services.items.slice(0, 3).map(([title, desc, , price], index) => (
              <article className="p-0 pb-4 overflow-hidden rounded-[14px] border border-neutral-200 bg-white shadow-sm hover:shadow-md hover:border-[#0ea5a4]/30 transition-all duration-250" key={title}>
                <div className="relative w-full h-[170px]">
                  <Image
                    src={serviceImages[index]}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
                <h3 className="mx-4 mt-3.5 mb-1.5 text-xl text-[#123749] font-bold">{title}</h3>
                <p className="mx-4 my-0 text-base text-neutral-600">{desc}</p>
                {price && (
                  <span className="mx-4 inline-flex items-center gap-1 mt-2.5 text-xs font-semibold text-[#0ea5a4] bg-teal-50 px-2.5 py-1 rounded-md">
                    {price}
                  </span>
                )}
              </article>
            ))}
          </div>
        </section>

        <CharitySection />

        <section id="how" className="mt-[18px] rounded-[20px] bg-[#fbfdfd] p-6 border border-neutral-200 shadow-sm">
          <h2 className="m-0 text-2xl lg:text-3xl leading-[1.25] text-[#103745] text-center font-bold">{t.how.title}</h2>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-3 rtl:rtl">
            {t.how.items.map(([title, desc], index) => (
              <article className="border border-neutral-200 bg-white rounded-2xl shadow-sm p-[18px] relative" key={title}>
                <span className="w-[30px] h-[30px] rounded-full inline-flex items-center justify-center text-[13px] font-bold text-white bg-gradient-to-br from-[#0ea5a4] to-[#28b5a9] mb-2.5">{index + 1}</span>
                <h3 className="m-0 mb-3 text-lg font-bold text-neutral-800">{title}</h3>
                <p className="m-0 text-neutral-600">{desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="safety" className="mt-[18px] rounded-[20px] p-[26px] grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] items-center gap-5 bg-[linear-gradient(165deg,rgba(14,165,164,0.05),rgba(255,255,255,0.95))] border border-neutral-200 shadow-sm">
          <div>
            <h2 className="m-0 text-2xl lg:text-3xl leading-[1.25] text-[#123749] font-bold">{t.safety.title}</h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {t.safety.points.slice(0, 3).map((point) => (
                <div key={point} className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mb-3 shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <p className="text-neutral-700 font-medium leading-relaxed text-sm">{point}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative w-full h-[220px] lg:h-[260px]">
            <Image
              src={safetyImage}
              alt={t.safety.photoLabel}
              fill
              className="object-cover rounded-2xl border border-[#dfe8ea]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </section>

        <section id="become" className="mt-[18px] rounded-[20px] p-[26px] grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] items-center gap-5 bg-[linear-gradient(165deg,rgba(255,107,107,0.06),rgba(255,255,255,0.95))] border border-neutral-200 shadow-sm">
          <div>
            <h2 className="m-0 text-2xl lg:text-3xl leading-[1.25] text-[#123749] font-bold">{t.sitter.title}</h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-xl mx-auto md:mx-0 leading-relaxed">{t.sitter.subtitle}</p>
            <div className="mt-6 flex gap-3 flex-wrap">
              <Link href="/auth">
                <Button className="rounded-[12px] h-auto py-3 px-5 bg-[#ff6b6b] hover:bg-[#ff5252] text-white shadow-sm hover:-translate-y-px transition-all">
                  {t.sitter.cta}
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative w-full h-[220px] lg:h-[260px]">
            <Image
              src={sitterImage}
              alt={t.sitter.title}
              fill
              className="object-cover rounded-2xl border border-[#dfe8ea]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-100 max-w-[200px] hidden lg:block animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                  $
                </div>
                <div>
                  <p className="text-xs text-neutral-500 font-medium">درآمد ماهانه</p>
                  <p className="text-sm font-bold text-neutral-800">۱۵٬۰۰۰٬۰۰۰ تومان</p>
                </div>
              </div>
              <p className="text-[10px] text-neutral-400">میانگین درآمد مراقبین فعال</p>
            </div>
          </div>
        </section>

        <section className="mt-[18px] rounded-[20px] bg-[#fbfdfd] p-6 border border-neutral-200 shadow-sm">
          <h2 className="m-0 text-2xl lg:text-3xl leading-[1.25] text-[#103745] text-center font-bold">{t.testimonials.title}</h2>
          <div className="mt-6 flex overflow-x-auto gap-4 pb-1.5 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible md:snap-none md:pb-0">
            {t.testimonials.items.map(([name, city, quote, petType]) => (
              <article className="min-w-[min(86vw,360px)] snap-start md:min-w-0 p-6 rounded-[16px] border border-neutral-200 bg-[linear-gradient(160deg,#fff,#f9fffe)] shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-250 flex flex-col" key={name + city}>
                <div className="flex gap-0.5 mb-3 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4" fill="currentColor" />
                  ))}
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#d1faf9] text-[#0b7c7b] inline-flex items-center justify-center font-bold shrink-0">{name.slice(0, 1)}</div>
                  <div className="flex flex-col items-start gap-1">
                    <h3 className="m-0 text-base font-semibold text-neutral-800">{name} — {city}</h3>
                    {petType && <span className="text-[10px] bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">{petType}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2 text-xs font-medium text-[#0ea5a4]">
                  <Check className="w-3.5 h-3.5" />
                  {t.testimonials.verified}
                </div>
                <p className="m-0 text-base text-neutral-600">"{quote}"</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-[18px] rounded-[20px] p-6 text-center bg-gradient-to-br from-[#0ea5a4] to-[#2dd4bf] border border-neutral-200 shadow-sm">
          <h2 className="m-0 text-2xl lg:text-3xl leading-[1.25] text-white font-bold">{t.final.title}</h2>
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <Link href="/auth">
              <Button className="rounded-[12px] h-auto py-3 px-5 bg-[#0ea5a4] text-white shadow-sm hover:bg-[#0b7c7b] border border-transparent hover:-translate-y-px transition-all bg-white text-[#0ea5a4] hover:bg-neutral-50">
                {t.final.cta}
              </Button>
            </Link>
          </div>
        </section>

        <section className="mt-[18px] rounded-[20px] bg-[#fbfdfd] p-6 border border-neutral-200 shadow-sm">
          <h2 className="m-0 text-2xl lg:text-3xl leading-[1.25] text-[#103745] text-center font-bold">{t.faq.title}</h2>
          <div className="mt-6 grid gap-3">
            {t.faq.items.map(([q, a]) => (
              <details className="border border-neutral-200 rounded-[12px] bg-white p-4 shadow-sm group hover:border-neutral-300 transition-colors duration-200" key={q}>
                <summary className="cursor-pointer text-neutral-800 font-semibold list-none [&::-webkit-details-marker]:hidden flex justify-between items-center">
                  {q}
                  <ChevronDown className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform duration-200" />
                </summary>
                <p className="mt-2.5 text-neutral-600 m-0 leading-relaxed text-sm">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
