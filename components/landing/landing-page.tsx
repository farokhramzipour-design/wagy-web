"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { TokenLoginBootstrap } from "../auth/token-login-bootstrap";
import en from "../../locales/en.json";
import fa from "../../locales/fa.json";

type Lang = "en" | "fa";

const content = { en, fa };

function stars(count = 5) {
  return "★".repeat(count);
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
        <section className="hero landing-section">
          <div className="hero-layout">
            <div>
              <h1>{t.hero.title}</h1>
              <p>{t.hero.subtitle}</p>
              <div className="actions">
                <Link href="/auth" className="btn btn-primary">{t.hero.primary}</Link>
                <Link href="/auth" className="btn btn-accent">{t.hero.secondary}</Link>
              </div>
              <p className="note">{t.hero.trust}</p>
            </div>
            <div className="hero-side">
              <article className="hero-illustration card">
                <p className="hero-illustration-emoji">🐶🧑‍🦰🐾</p>
                <h3>{t.hero.illustrationTitle}</h3>
                <p>{t.hero.illustrationBody}</p>
              </article>
              <form className="search-card" onSubmit={(e) => e.preventDefault()}>
                <input className="text-input" placeholder={t.hero.fields[0]} />
                <input className="text-input" placeholder={t.hero.fields[1]} />
                <input className="text-input" placeholder={t.hero.fields[2]} />
                <input className="text-input" placeholder={t.hero.fields[3]} />
                <button className="btn btn-primary" type="submit">{t.nav.cta}</button>
              </form>
            </div>
          </div>
        </section>

        <section className="panel landing-section story-block">
          <div className="story-layout">
            <div>
              <h2 className="section-title">{t.story.title}</h2>
              <p className="story-copy">{t.story.body}</p>
            </div>
            <article className="story-image card">
              <p className="story-image-emoji">🐕‍🦺💙</p>
              <p>{t.story.imageTitle}</p>
            </article>
          </div>
        </section>

        <section className="panel landing-section">
          <h2 className="section-title">{t.trust.title}</h2>
          <div className="grid trust-grid">
            {t.trust.items.map(([icon, title, desc]) => (
              <article className="card" key={title}>
                <p className="trust-icon">{icon}</p>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="services" className="panel landing-section">
          <h2 className="section-title">{t.services.title}</h2>
          <div className="grid services-grid">
            {t.services.items.map(([icon, title, desc]) => (
              <article className="card" key={title}>
                <p className="service-icon">{icon}</p>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how" className="panel landing-section">
          <h2 className="section-title">{t.how.title}</h2>
          <div className="grid steps-grid">
            {t.how.items.map(([icon, title, desc]) => (
              <article className="card" key={title}>
                <p className="step-icon">{icon}</p>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel landing-section">
          <h2 className="section-title">{t.testimonials.title}</h2>
          <div className="testimonials-grid">
            {t.testimonials.items.map(([name, city, quote]) => (
              <article className="card" key={name + city}>
                <p className="stars" aria-label="5 stars">{stars(5)}</p>
                <div className="avatar-badge">{name.slice(0, 1)}</div>
                <h3>{name} — {city}</h3>
                <p>"{quote}"</p>
              </article>
            ))}
          </div>
        </section>

        <section id="safety" className="panel landing-section safety-panel">
          <h2 className="section-title">{t.safety.title}</h2>
          <ul className="list">
            {t.safety.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p className="note">{t.safety.end}</p>
        </section>

        <section id="become" className="panel landing-section sitter-panel">
          <div className="sitter-layout">
            <div>
              <h2 className="section-title">{t.sitter.title}</h2>
              <p>{t.sitter.subtitle}</p>
              <ul className="list">
                {t.sitter.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
            <div className="sitter-cta-box">
              <Link href="/auth" className="btn btn-accent">{t.sitter.cta}</Link>
            </div>
          </div>
        </section>

        <section className="panel landing-section">
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

        <section className="panel landing-section final-cta">
          <h2 className="section-title">{t.final.title}</h2>
          <div className="actions">
            <Link href="/auth" className="btn btn-primary">{t.final.cta}</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
