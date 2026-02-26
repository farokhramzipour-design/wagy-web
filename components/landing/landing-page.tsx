"use client";

import { CharitySection } from "@/components/landing/charity-section";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import type { SessionData } from "@/lib/session";
import { ProfileCompletionResponse } from "@/services/profile-api";
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
        <section className="relative mt-4 rounded-[24px] overflow-hidden min-h-[500px] flex flex-col items-center justify-center text-center py-12 px-4">
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
                  <svg className="w-3.5 h-3.5 text-[#0ea5a4]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </span>
              </article>
            ))}
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
            {t.services.items.slice(0, 3).map(([title, desc], index) => (
              <article className="p-0 pb-4 overflow-hidden rounded-[14px] border border-neutral-200 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-250" key={title}>
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
            <ul className="mt-3 ps-5 text-neutral-600 list-disc">
              {t.safety.points.slice(0, 3).map((point) => (
                <li key={point} className="mt-1.5">{point}</li>
              ))}
            </ul>
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
            <p className="mt-2 text-neutral-600">{t.sitter.subtitle}</p>
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
          </div>
        </section>

        <section className="mt-[18px] rounded-[20px] bg-[#fbfdfd] p-6 border border-neutral-200 shadow-sm">
          <h2 className="m-0 text-2xl lg:text-3xl leading-[1.25] text-[#103745] text-center font-bold">{t.testimonials.title}</h2>
          <div className="mt-6 flex overflow-x-auto gap-4 pb-1.5 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible lg:snap-none lg:pb-0">
            {t.testimonials.items.map(([name, city, quote]) => (
              <article className="min-w-[min(86vw,360px)] snap-start lg:min-w-0 p-6 rounded-[16px] border border-neutral-200 bg-[linear-gradient(160deg,#fff,#f9fffe)] shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-250" key={name + city}>
                <div className="w-10 h-10 rounded-full bg-[#d1faf9] text-[#0b7c7b] inline-flex items-center justify-center font-bold mb-2">{name.slice(0, 1)}</div>
                <h3 className="m-0 mb-1 text-lg leading-[1.3] font-semibold text-neutral-800">{name} — {city}</h3>
                <div className="flex items-center gap-1 mb-2 text-xs font-medium text-[#0ea5a4]">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
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
              <details className="border border-neutral-200 rounded-[12px] bg-white p-4 shadow-sm group" key={q}>
                <summary className="cursor-pointer text-neutral-800 font-semibold list-none [&::-webkit-details-marker]:hidden">{q}</summary>
                <p className="mt-2.5 text-neutral-600 m-0">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
