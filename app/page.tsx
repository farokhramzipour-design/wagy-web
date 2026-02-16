"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { TokenLoginBootstrap } from "../components/auth/token-login-bootstrap";

type Lang = "en" | "fa";

const content = {
  en: {
    nav: {
      services: "Services",
      how: "How It Works",
      safety: "Safety",
      sitter: "Become a Sitter",
      login: "Login",
      cta: "Find a Sitter"
    },
    hero: {
      title: "When you're away, feel completely at ease ❤️",
      subtitle:
        "Trusted, verified pet sitters near you. Someone who cares for your family member with love.",
      fields: ["Location", "Dates", "Pet Type", "Service Type"],
      primary: "Find a Trusted Sitter",
      secondary: "I Want to Become a Sitter",
      trust: "Verified identity • Real reviews • Support always available"
    },
    trust: {
      title: "We take safety seriously, first",
      items: [
        ["Verified Sitters", "Every sitter is reviewed and approved before taking bookings."],
        ["Real User Reviews", "Authentic experiences from people just like you."],
        ["Secure Payments", "Payments stay protected through the platform."],
        ["24/7 Support", "Our team is available whenever you need help."]
      ]
    },
    services: {
      title: "Services built around comfort and trust",
      items: [
        ["Boarding", "A warm and safe home while you're traveling."],
        ["House Sitting", "Your pet stays calm in their familiar home."],
        ["Dog Walking", "Healthy movement, happy mood, more energy."],
        ["Day Care", "Reliable daytime care for busy schedules."],
        ["Drop-In Visits", "Feeding, cleaning, and gentle companionship."]
      ]
    },
    how: {
      title: "How it works",
      items: [
        ["1. Search", "Explore nearby sitters and read real reviews."],
        ["2. Chat", "Message first, ask questions, and confirm details."],
        ["3. Relax", "Book with confidence and receive full updates."]
      ]
    },
    testimonials: {
      title: "What pet parents say",
      items: [
        ["Sara", "Tehran", "I was anxious at first, but after chatting with the sitter I felt calm. Daily photo updates helped a lot."],
        ["Mohammad", "Shiraz", "I traveled without worry for the first time. Smooth and respectful experience."],
        ["Narges", "Isfahan", "Very responsible and caring behavior. I truly trusted the process."]
      ]
    },
    safety: {
      title: "Your pet's safety is our priority",
      points: [
        "We verify sitter identity",
        "We monitor service quality",
        "We secure all platform payments",
        "We follow up if any issue occurs"
      ],
      end: "Because your trust means everything to us."
    },
    sitter: {
      title: "Love pets?",
      subtitle: "Turn that love into meaningful income.",
      points: [
        "Choose your own schedule",
        "No upfront investment required",
        "Respectful, meaningful work"
      ],
      cta: "Start Today"
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        ["Can I talk to the sitter before booking?", "Yes. You can message and coordinate before confirming."],
        ["What if something goes wrong?", "Our support team follows up and helps resolve it quickly."],
        ["How do payments work?", "Payments are handled securely through the platform."],
        ["Is my information private?", "Yes. Your personal data stays private and protected."],
        ["What if I am not satisfied?", "We review each case and provide clear support steps."]
      ]
    },
    final: {
      title: "They're not just pets... they're family ❤️",
      cta: "Find a Trusted Sitter"
    }
  },
  fa: {
    nav: {
      services: "سرویس‌ها",
      how: "نحوه کار",
      safety: "امنیت",
      sitter: "مراقب شو",
      login: "ورود",
      cta: "پیدا کردن مراقب"
    },
    hero: {
      title: "وقتی کنارش نیستی، خیالت راحت باشه ❤️",
      subtitle:
        "مراقبین تاییدشده و قابل اعتماد، نزدیک تو. کسی که با محبت از عضو خانواده‌ات مراقبت می‌کنه.",
      fields: ["موقعیت", "تاریخ‌ها", "نوع پت", "نوع سرویس"],
      primary: "پیدا کردن مراقب مطمئن",
      secondary: "من می‌خوام مراقب بشم",
      trust: "احراز هویت شده • نظرات واقعی کاربران • پشتیبانی همیشه در دسترس"
    },
    trust: {
      title: "ما اول امنیت رو جدی می‌گیریم",
      items: [
        ["احراز هویت کامل", "هر مراقب قبل از شروع فعالیت، بررسی و تایید می‌شود."],
        ["نظرات واقعی کاربران", "تجربه‌های واقعی از افرادی مثل شما."],
        ["پرداخت امن", "پرداخت فقط از طریق پلتفرم، بدون ریسک."],
        ["پشتیبانی پاسخگو", "در هر ساعت از شبانه‌روز کنار شما هستیم."]
      ]
    },
    services: {
      title: "سرویس‌ها",
      items: [
        ["نگهداری شبانه", "وقتی سفر هستی، حیوانت تو یه محیط امن و گرم می‌مونه."],
        ["مراقبت در منزل خودت", "حیوانت در فضای آشنا و راحت خودش می‌مونه."],
        ["پیاده‌روی و بازی", "تحرک، انرژی و شادی بیشتر."],
        ["مراقبت روزانه", "چند ساعت مراقبت مطمئن وقتی سرت شلوغه."],
        ["سرزدن کوتاه", "غذا دادن، تمیزکاری و نوازش با محبت."]
      ]
    },
    how: {
      title: "چطور کار می‌کنه",
      items: [
        ["۱. جستجو کن", "مراقبین اطرافت رو ببین و نظرات رو بخون."],
        ["۲. ارتباط بگیر", "قبل از رزرو، پیام بده و سوال بپرس."],
        ["۳. با خیال راحت بسپار", "مراقبت امن و پیگیری کامل."]
      ]
    },
    testimonials: {
      title: "تجربه کاربران",
      items: [
        ["سارا", "تهران", "اولش استرس داشتم، ولی بعد از صحبت با مراقب خیالم راحت شد. هر روز عکس می‌فرستاد."],
        ["محمد", "شیراز", "سفر رفتم بدون اینکه نگران باشم. تجربه خیلی خوبی بود."],
        ["نرگس", "اصفهان", "رفتار مراقب خیلی محترمانه و مسئولانه بود."]
      ]
    },
    safety: {
      title: "امنیت حیوانت اولویت ماست",
      points: [
        "هویت مراقبین رو بررسی می‌کنیم",
        "نظارت بر کیفیت خدمات داریم",
        "پرداخت‌ها رو امن انجام می‌دیم",
        "در صورت بروز مشکل پیگیری می‌کنیم"
      ],
      end: "چون اعتماد شما برای ما ارزشمنده."
    },
    sitter: {
      title: "عشق به حیوانات داری؟",
      subtitle: "ازش درآمد بساز.",
      points: [
        "ساعت کاری دست خودته",
        "بدون نیاز به سرمایه اولیه",
        "کار معنادار و محترمانه"
      ],
      cta: "همین امروز ثبت‌نام کن"
    },
    faq: {
      title: "سوالات پرتکرار",
      items: [
        ["آیا می‌تونم قبل از رزرو با مراقب صحبت کنم؟", "بله، قبل از تایید نهایی می‌تونی پیام بدی و هماهنگ کنی."],
        ["اگر مشکلی پیش بیاد چی؟", "تیم پشتیبانی موضوع رو پیگیری می‌کنه."],
        ["پرداخت چطور انجام میشه؟", "پرداخت امن از طریق پلتفرم انجام میشه."],
        ["اطلاعات من امن می‌مونه؟", "بله، اطلاعات شما محرمانه باقی می‌مونه."],
        ["اگر از خدمات راضی نبودم؟", "موضوع بررسی و رسیدگی میشه."]
      ]
    },
    final: {
      title: "اون‌ها فقط حیوان خونگی نیستن… خانواده‌ان ❤️",
      cta: "با خیال راحت مراقب مطمئن پیدا کن"
    }
  }
} as const;

function stars(count = 5) {
  return "★".repeat(count);
}

export default function HomePage() {
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
      <TokenLoginBootstrap />

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
            <form className="search-card" onSubmit={(e) => e.preventDefault()}>
              <input className="text-input" placeholder={t.hero.fields[0]} />
              <input className="text-input" placeholder={t.hero.fields[1]} />
              <input className="text-input" placeholder={t.hero.fields[2]} />
              <input className="text-input" placeholder={t.hero.fields[3]} />
              <button className="btn btn-primary" type="submit">{t.nav.cta}</button>
            </form>
          </div>
        </section>

        <section className="panel landing-section">
          <h2 className="section-title">{t.trust.title}</h2>
          <div className="grid trust-grid">
            {t.trust.items.map(([title, desc]) => (
              <article className="card" key={title}>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="services" className="panel landing-section">
          <h2 className="section-title">{t.services.title}</h2>
          <div className="grid services-grid">
            {t.services.items.map(([title, desc]) => (
              <article className="card" key={title}>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how" className="panel landing-section">
          <h2 className="section-title">{t.how.title}</h2>
          <div className="grid steps-grid">
            {t.how.items.map(([title, desc]) => (
              <article className="card" key={title}>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel landing-section">
          <h2 className="section-title">{t.testimonials.title}</h2>
          <div className="grid testimonials-grid">
            {t.testimonials.items.map(([name, city, quote]) => (
              <article className="card" key={name + city}>
                <p className="stars" aria-label="5 stars">{stars(5)}</p>
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
