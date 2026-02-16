"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import en from "../../locales/en.json";
import fa from "../../locales/fa.json";

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
    <div className="landing-shell services-shell">
      <header className="topbar">
        <div className="container landing-header-row">
          <Link href="/landing" className="brand">Waggy</Link>
          <nav className="nav landing-nav-links">
            <Link href="/landing#services">{t.nav.services}</Link>
            <Link href="/landing#how">{t.nav.how}</Link>
            <Link href="/landing#safety">{t.nav.safety}</Link>
            <Link href="/landing#become">{t.nav.sitter}</Link>
          </nav>
          <div className="landing-header-actions">
            <div className="lang-switch" role="group" aria-label="language">
              <button className={lang === "en" ? "lang-btn active" : "lang-btn"} onClick={() => setLang("en")}>EN</button>
              <button className={lang === "fa" ? "lang-btn active" : "lang-btn"} onClick={() => setLang("fa")}>FA</button>
            </div>
            <Link href="/auth" className="btn btn-secondary">{t.nav.login}</Link>
            <Link href="/auth" className="btn btn-primary">{t.nav.cta}</Link>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="panel services-hero">
          <div>
            <h1>{t.servicesPage.title}</h1>
            <p>{t.servicesPage.subtitle}</p>
            <div className="actions">
              <Link href="/landing" className="btn btn-secondary">{t.servicesPage.back}</Link>
            </div>
          </div>
          <div className="service-highlight-list">
            {t.servicesPage.highlights.map((highlight) => (
              <span className="trust-badge" key={highlight}>{highlight}</span>
            ))}
          </div>
        </section>

        <section className="panel services-filter-panel">
          <div className="services-filter-row">
            {filterOptions.map((option, index) => (
              <button
                key={option}
                className={filter === option ? "filter-pill active" : "filter-pill"}
                onClick={() => setFilter(option)}
              >
                {t.servicesPage.filters[index]}
              </button>
            ))}
          </div>
        </section>

        <section className="landing-section services-all-grid">
          {filtered.map((service) => (
            <article className="card service-full-card" key={service.title}>
              <img src={service.photo} alt={service.title} className="service-photo-image" loading="lazy" />
              <div className="service-full-content">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link href="/auth" className="btn btn-primary">{t.servicesPage.primary}</Link>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
