"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { TokenLoginBootstrap } from "../auth/token-login-bootstrap";
import en from "../../locales/en.json";
import fa from "../../locales/fa.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

export function LandingPage() {
  const [lang, setLang] = useState<Lang>("en");

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
  const trustBadges = t.hero.trust.split(" • ");
  const serviceImages = [
    "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80"
  ];
  const heroImage = "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1600&q=80";
  const safetyImage = "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?auto=format&fit=crop&w=1200&q=80";
  const sitterImage = "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="pb-16 bg-[#f2f4f7]">
      <Suspense fallback={null}>
        <TokenLoginBootstrap />
      </Suspense>

      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur-md">
        <div className="w-full max-w-[1280px] mx-auto px-4 lg:px-6 grid grid-cols-1 justify-items-start py-3 gap-4 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:py-0 lg:min-h-[72px]">
          <Link href="/" className="text-[22px] font-bold tracking-tight text-neutral-900">Waggy</Link>
          <nav className="flex gap-4 text-sm text-neutral-700 justify-self-start lg:justify-self-center rtl:text-xs">
            <a href="#services">{t.nav.services}</a>
            <a href="#how">{t.nav.how}</a>
            <a href="#safety">{t.nav.safety}</a>
            <a href="#become">{t.nav.sitter}</a>
          </nav>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center border border-neutral-200 rounded-full overflow-hidden bg-white" role="group" aria-label="language">
              <button className={`border-0 bg-transparent text-neutral-700 text-xs font-semibold px-3 py-2 cursor-pointer ${lang === "en" ? "bg-[#d1faf9] text-[#0b7c7b]" : ""}`} onClick={() => setLang("en")}>
                EN
              </button>
              <button className={`border-0 bg-transparent text-neutral-700 text-xs font-semibold px-3 py-2 cursor-pointer ${lang === "fa" ? "bg-[#d1faf9] text-[#0b7c7b]" : ""}`} onClick={() => setLang("fa")}>
                FA
              </button>
            </div>
            <Link href="/auth">
              <Button variant="secondary" className="bg-transparent border border-neutral-200 text-neutral-900 hover:bg-neutral-100 rounded-[12px] h-auto py-3 px-5 rtl:text-xs rtl:px-3.5 rtl:py-2.5">
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
        <section className="mt-6 p-0 overflow-hidden rounded-[20px] border border-[#dbe5e7] bg-[radial-gradient(140%_120%_at_0%_0%,rgba(14,165,164,0.16),rgba(255,255,255,0)_55%),radial-gradient(120%_100%_at_100%_0%,rgba(255,107,107,0.12),rgba(255,255,255,0)_48%),linear-gradient(180deg,#eff8f7,#f9fcfb)] relative before:content-[''] before:absolute before:-left-[120px] before:-top-[120px] before:w-[300px] before:h-[300px] before:rounded-full before:bg-[radial-gradient(circle,rgba(14,124,123,0.18),transparent_70%)] before:pointer-events-none">
          <div className="p-[28px_20px_20px] lg:p-[34px_30px_20px] relative grid gap-[18px] grid-cols-1 lg:grid-cols-[1.2fr_1fr] lg:gap-6 items-stretch">
            <div className="grid content-start gap-3.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-medium mb-4 border border-orange-100 w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                {t.hero.highDemand}
              </div>
              <h1 className="m-0 text-3xl lg:text-4xl leading-[1.2] text-[#103745] font-bold max-w-[520px] rtl:tracking-[-0.01em] rtl:text-4xl rtl:leading-[1.35]">{t.hero.title}</h1>
              <p className="mt-2 max-w-[520px] text-[16px] lg:text-[18px] leading-[1.55] text-[#37556a] m-0">{t.hero.subtitle}</p>
              
              <div className="mt-4 p-2 bg-white/92 border border-neutral-200 shadow-sm rounded-[16px]">
                <div className="px-2 pb-1 text-xs font-medium text-neutral-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0ea5a4]"></span>
                  {t.hero.step1}
                </div>
                <form className="grid grid-cols-1 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto] items-center gap-2" onSubmit={(e) => e.preventDefault()}>
                  <Input className="h-auto p-[10px_11px] text-[13px] border-neutral-200 rounded-[12px]" placeholder={t.hero.fields[0]} />
                  <Input className="h-auto p-[10px_11px] text-[13px] border-neutral-200 rounded-[12px]" placeholder={t.hero.fields[1]} />
                  <Input className="h-auto p-[10px_11px] text-[13px] border-neutral-200 rounded-[12px]" placeholder={t.hero.fields[3]} />
                  <Button className="h-auto min-h-[40px] px-4 whitespace-nowrap rounded-[12px] bg-[#ff6b6b] hover:bg-[#ff5252] text-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5" type="submit">
                    {t.nav.cta}
                    <svg className="w-4 h-4 ms-1.5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </form>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {trustBadges.map((badge) => (
                  <span className="border border-neutral-200 bg-white rounded-full text-xs text-neutral-600 px-2.5 py-1.5" key={badge}>{badge}</span>
                ))}
              </div>
            </div>
            <div className="grid gap-4 items-end">
              <article className="relative grid gap-3 bg-gradient-to-br from-white to-[#f0fbfa] p-0 rounded-[20px] border-0 shadow-none overflow-hidden aspect-[16/10] lg:max-h-[320px] lg:min-h-0 lg:aspect-auto">
                <img src={heroImage} alt={t.hero.photoLabel} className="w-full h-full min-h-0 object-cover object-center rounded-[20px] block" loading="lazy" />
              </article>
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
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
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
                <img
                  src={serviceImages[index]}
                  alt={title}
                  className="w-full h-[170px] object-cover block"
                  loading="lazy"
                />
                <h3 className="mx-4 mt-3.5 mb-1.5 text-xl text-[#123749] font-bold">{title}</h3>
                <p className="mx-4 my-0 text-base text-neutral-600">{desc}</p>
              </article>
            ))}
          </div>
        </section>

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
          <img src={safetyImage} alt={t.safety.photoLabel} className="w-full h-[220px] lg:h-[260px] object-cover rounded-2xl border border-[#dfe8ea]" loading="lazy" />
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
          <img src={sitterImage} alt={t.sitter.title} className="w-full h-[220px] lg:h-[260px] object-cover rounded-2xl border border-[#dfe8ea]" loading="lazy" />
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
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
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
