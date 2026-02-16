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
      title: "They're not just pets. They're family.",
      subtitle:
        "When you can't be there, we make sure someone loving is.",
      fields: ["Location", "Dates", "Pet Type", "Service Type"],
      primary: "Find a Loving Sitter",
      secondary: "Become a Sitter",
      trust: "Verified sitters • Secure payments • 24/7 support",
      illustrationTitle: "Calm care, even when you're away",
      illustrationBody: "A trusted sitter keeps routines, comfort, and love exactly where your pet needs it."
    },
    story: {
      title: "Leaving them shouldn't mean worrying.",
      body: "We know that anxious feeling before you leave home. We built Waggy so your pet gets loving care and you get true peace of mind.",
      imageTitle: "Care that feels like family"
    },
    trust: {
      title: "Your pet's safety is our promise.",
      items: [
        ["✅", "Identity Verified", "Every sitter goes through profile and identity checks before joining."],
        ["💬", "Real Reviews", "See honest feedback from pet parents with similar needs."],
        ["🔒", "Secure Payments", "All payments are protected on-platform with full transparency."],
        ["🛟", "24/7 Support", "If anything feels off, our support team is ready anytime."]
      ]
    },
    services: {
      title: "Services built around comfort and trust",
      items: [
        ["🏡", "Dog Boarding", "A warm and safe home while you're traveling."],
        ["🛋️", "House Sitting", "Your pet stays calm in their familiar home."],
        ["🐕", "Dog Walking", "Healthy movement, happy mood, more energy."],
        ["☀️", "Day Care", "Reliable daytime care for busy schedules."],
        ["🧡", "Drop-In Visits", "Feeding, cleaning, and gentle companionship."]
      ]
    },
    how: {
      title: "How it works",
      items: [
        ["🔎", "Search", "Explore nearby sitters and read real reviews."],
        ["📅", "Book", "Chat first, ask questions, then book in a few taps."],
        ["🌿", "Relax", "Get updates while your pet is cared for with love."]
      ]
    },
    testimonials: {
      title: "What pet parents say",
      items: [
        ["Sara", "Tehran", "I was anxious at first, but after chatting with the sitter I felt calm. Daily photo updates helped a lot."],
        ["Mohammad", "Shiraz", "I traveled without worry for the first time. Smooth and respectful experience."],
        ["نرگس", "اصفهان", "رفتار مراقب خیلی محترمانه و مسئولانه بود. با خیال راحت سپردم."]
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
      title: "Because they trust you. And you can trust us.",
      cta: "Find a Loving Sitter"
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
      title: "اون‌ها فقط حیوان خونگی نیستن… خانواده‌ان ❤️",
      subtitle:
        "وقتی تو کنارش نیستی، ما مطمئن می‌شیم یک آدم مهربون کنارش هست.",
      fields: ["موقعیت", "تاریخ‌ها", "نوع پت", "نوع سرویس"],
      primary: "پیدا کردن مراقب مطمئن",
      secondary: "من می‌خوام مراقب بشم",
      trust: "مراقبین تاییدشده • پرداخت امن • پشتیبانی ۲۴/۷",
      illustrationTitle: "مراقبت آروم و مطمئن، حتی وقتی نیستی",
      illustrationBody: "یک مراقب قابل اعتماد، روال روزانه و آرامش پتت رو حفظ می‌کنه.",
    },
    story: {
      title: "نبودن کنار اون‌ها نباید با نگرانی همراه باشه.",
      body: "ما اضطراب قبل از سفر رو می‌فهمیم. واگی رو ساختیم تا پت شما مراقبت عاشقانه بگیره و شما با خیال راحت کارهای خودت رو انجام بدی.",
      imageTitle: "مراقبتی که حس خانواده می‌ده"
    },
    trust: {
      title: "امنیت حیوانت قول ماست.",
      items: [
        ["✅", "احراز هویت کامل", "هر مراقب قبل از شروع فعالیت، بررسی و تایید می‌شود."],
        ["💬", "نظرات واقعی کاربران", "تجربه‌های واقعی از افرادی مثل شما."],
        ["🔒", "پرداخت امن", "پرداخت فقط از طریق پلتفرم، بدون ریسک."],
        ["🛟", "پشتیبانی پاسخگو", "در هر ساعت از شبانه‌روز کنار شما هستیم."]
      ]
    },
    services: {
      title: "سرویس‌ها",
      items: [
        ["🏡", "نگهداری شبانه", "وقتی سفر هستی، حیوانت تو یه محیط امن و گرم می‌مونه."],
        ["🛋️", "مراقبت در منزل خودت", "حیوانت در فضای آشنا و راحت خودش می‌مونه."],
        ["🐕", "پیاده‌روی و بازی", "تحرک، انرژی و شادی بیشتر."],
        ["☀️", "مراقبت روزانه", "چند ساعت مراقبت مطمئن وقتی سرت شلوغه."],
        ["🧡", "سرزدن کوتاه", "غذا دادن، تمیزکاری و نوازش با محبت."]
      ]
    },
    how: {
      title: "چطور کار می‌کنه",
      items: [
        ["🔎", "جستجو", "مراقبین اطرافت رو ببین و نظرات رو بخون."],
        ["📅", "رزرو", "اول پیام بده، هماهنگ کن، بعد رزروت رو نهایی کن."],
        ["🌿", "با خیال راحت", "با آپدیت‌های منظم، آرامش کامل داشته باش."]
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
      title: "چون اون‌ها به تو اعتماد دارن… و تو می‌تونی به ما اعتماد کنی.",
      cta: "پیدا کردن مراقب مهربان"
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
