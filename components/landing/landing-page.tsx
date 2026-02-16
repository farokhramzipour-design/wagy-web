"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { TokenLoginBootstrap } from "../auth/token-login-bootstrap";
import en from "../../locales/en.json";
import fa from "../../locales/fa.json";

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
    <strong className="stat-value">
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
    <div className="landing-shell">
      <Suspense fallback={null}>
        <TokenLoginBootstrap />
      </Suspense>

      <header className="topbar">
        <div className="container landing-header-row">
          <Link href="/" className="brand">Waggy</Link>
          <nav className="nav landing-nav-links">
            <a href="#services">{t.nav.services}</a>
            <a href="#how">{t.nav.how}</a>
            <a href="#safety">{t.nav.safety}</a>
            <a href="#become">{t.nav.sitter}</a>
          </nav>
          <div className="landing-header-actions">
            <div className="lang-switch" role="group" aria-label="language">
              <button className={lang === "en" ? "lang-btn active" : "lang-btn"} onClick={() => setLang("en")}>
                EN
              </button>
              <button className={lang === "fa" ? "lang-btn active" : "lang-btn"} onClick={() => setLang("fa")}>
                FA
              </button>
            </div>
            <Link href="/auth" className="btn btn-secondary">{t.nav.login}</Link>
            <Link href="/auth" className="btn btn-primary">{t.nav.cta}</Link>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="hero landing-hero-card">
          <div className="hero-layout">
            <div className="hero-copy">
              <h1>{t.hero.title}</h1>
              <p>{t.hero.subtitle}</p>
              <form className="search-card hero-search-inline" onSubmit={(e) => e.preventDefault()}>
                <input className="text-input" placeholder={t.hero.fields[0]} />
                <input className="text-input" placeholder={t.hero.fields[1]} />
                <input className="text-input" placeholder={t.hero.fields[3]} />
                <button className="btn btn-primary" type="submit">{t.nav.cta}</button>
              </form>
              <div className="hero-badges">
                {trustBadges.map((badge) => (
                  <span className="trust-badge" key={badge}>{badge}</span>
                ))}
              </div>
            </div>
            <div className="hero-side">
              <article className="hero-photo card">
                <img src={heroImage} alt={t.hero.photoLabel} className="hero-photo-image" loading="lazy" />
              </article>
            </div>
          </div>
        </section>

        <section className="social-proof-bar">
          <div className="social-proof-grid">
            {t.socialProof.items.map((item) => (
              <article className="social-proof-card" key={item.label}>
                <CountUp target={item.value} suffix={item.suffix} lang={lang} />
                <span className="stat-label">{item.label}</span>
              </article>
            ))}
          </div>
        </section>

        <section id="services" className="panel landing-section services-panel">
          <div className="services-header">
            <h2 className="section-title">{t.services.title}</h2>
            <Link href="/services" className="btn btn-secondary services-see-all">
              {t.services.seeAll}
            </Link>
          </div>
          <div className="grid services-grid">
            {t.services.items.slice(0, 3).map(([title, desc], index) => (
              <article className="card service-card" key={title}>
                <img
                  src={serviceImages[index]}
                  alt={title}
                  className="service-photo-image"
                  loading="lazy"
                />
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how" className="panel landing-section how-compact-panel">
          <h2 className="section-title">{t.how.title}</h2>
          <div className="flow-grid">
            {t.how.items.map(([title, desc], index) => (
              <article className="flow-step" key={title}>
                <span className="flow-index">{index + 1}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="safety" className="panel landing-section safety-panel compact-banner">
          <div className="banner-copy">
            <h2 className="section-title">{t.safety.title}</h2>
            <ul className="list">
              {t.safety.points.slice(0, 3).map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <img src={safetyImage} alt={t.safety.photoLabel} className="banner-image" loading="lazy" />
        </section>

        <section id="become" className="panel landing-section sitter-panel compact-banner">
          <div className="banner-copy">
            <h2 className="section-title">{t.sitter.title}</h2>
            <p>{t.sitter.subtitle}</p>
            <div className="actions">
              <Link href="/auth" className="btn btn-accent">{t.sitter.cta}</Link>
            </div>
          </div>
          <img src={sitterImage} alt={t.sitter.title} className="banner-image" loading="lazy" />
        </section>

        <section className="panel landing-section testimonials-panel compact-testimonials">
          <h2 className="section-title">{t.testimonials.title}</h2>
          <div className="testimonials-grid">
            {t.testimonials.items.map(([name, city, quote]) => (
              <article className="card testimonial-card" key={name + city}>
                <div className="avatar-badge">{name.slice(0, 1)}</div>
                <h3>{name} — {city}</h3>
                <p>"{quote}"</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel landing-section final-cta compact-final-cta">
          <h2 className="section-title">{t.final.title}</h2>
          <div className="actions">
            <Link href="/auth" className="btn btn-primary">{t.final.cta}</Link>
          </div>
        </section>

        <section className="panel landing-section faq-compact">
          <h2 className="section-title">{t.faq.title}</h2>
          <div className="faq-list">
            {t.faq.items.map(([q, a]) => (
              <details className="faq-item" key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
