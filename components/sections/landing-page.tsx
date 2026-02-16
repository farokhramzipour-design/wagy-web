"use client";

import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, HeartHandshake, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppTranslation } from "@/lib/use-app-translation";

const reveal = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 }
};

export function LandingPageSections() {
  const { t } = useAppTranslation();

  const trust = [
    {
      icon: ShieldCheck,
      title: t("landing.trust.items.verified.title"),
      description: t("landing.trust.items.verified.description")
    },
    {
      icon: HeartHandshake,
      title: t("landing.trust.items.insurance.title"),
      description: t("landing.trust.items.insurance.description")
    },
    {
      icon: CreditCard,
      title: t("landing.trust.items.payments.title"),
      description: t("landing.trust.items.payments.description")
    },
    {
      icon: PhoneCall,
      title: t("landing.trust.items.support.title"),
      description: t("landing.trust.items.support.description")
    }
  ];

  const services = [
    { title: t("landing.services.boarding"), description: t("landing.services.boardingDesc") },
    { title: t("landing.services.house"), description: t("landing.services.houseDesc") },
    { title: t("landing.services.walking"), description: t("landing.services.walkingDesc") },
    { title: t("landing.services.daycare"), description: t("landing.services.daycareDesc") },
    { title: t("landing.services.dropin"), description: t("landing.services.dropinDesc") }
  ];

  const faq = [
    { q: t("landing.faq.q1"), a: t("landing.faq.a1") },
    { q: t("landing.faq.q2"), a: t("landing.faq.a2") },
    { q: t("landing.faq.q3"), a: t("landing.faq.a3") },
    { q: t("landing.faq.q4"), a: t("landing.faq.a4") },
    { q: t("landing.faq.q5"), a: t("landing.faq.a5") }
  ];

  return (
    <div className="space-y-16 py-10">
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <motion.div initial="hidden" animate="show" variants={reveal} transition={{ duration: 0.45 }}>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">{t("landing.hero.headline")}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("landing.hero.subheadline")}</p>
          <div className="mt-6 grid gap-3 rounded-2xl border bg-white/80 p-4 backdrop-blur sm:grid-cols-2">
            <Input placeholder={t("landing.hero.location")} />
            <Input placeholder={t("landing.hero.dates")} />
            <Input placeholder={t("landing.hero.petType")} />
            <Input placeholder={t("landing.hero.serviceType")} />
            <Button className="sm:col-span-2">{t("landing.hero.primaryCta")}</Button>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{t("landing.hero.trustLine")}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="gradient-card animate-float rounded-3xl border p-8 shadow-glow"
        >
          <p className="text-sm text-muted-foreground">{t("landing.hero.secondaryCta")}</p>
          <p className="mt-3 text-2xl font-semibold">{t("app.ownerCta")}</p>
          <Button className="mt-6" variant="secondary">
            {t("app.ownerCtaButton")}
          </Button>
        </motion.div>
      </section>

      <section>
        <h2 className="mb-6 text-3xl font-semibold">{t("landing.trust.title")}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {trust.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <item.icon className="h-5 w-5 text-primary" />
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="services">
        <h2 className="mb-6 text-3xl font-semibold">{t("landing.services.title")}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-3xl font-semibold">{t("landing.how.title")}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{t(`landing.how.step${idx}Title`)}</CardTitle>
                <CardDescription>{t(`landing.how.step${idx}Desc`)}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-3xl font-semibold">{t("landing.testimonials.title")}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[t("landing.testimonials.one"), t("landing.testimonials.two"), t("landing.testimonials.three")].map((quote) => (
            <Card key={quote}>
              <CardContent className="pt-6 text-sm text-muted-foreground">"{quote}"</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border bg-white/80 p-8">
        <h2 className="text-3xl font-semibold">{t("landing.safety.title")}</h2>
        <ul className="mt-4 grid gap-2 text-muted-foreground md:grid-cols-2">
          {[t("landing.safety.v1"), t("landing.safety.v2"), t("landing.safety.v3"), t("landing.safety.v4")].map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </section>

      <section id="become" className="rounded-3xl border bg-secondary p-8">
        <h2 className="text-3xl font-semibold">{t("app.ownerCta")}</h2>
        <Button className="mt-4">{t("app.ownerCtaButton")}</Button>
      </section>

      <section>
        <h2 className="mb-6 text-3xl font-semibold">{t("landing.faq.title")}</h2>
        <div className="space-y-3">
          {faq.map((item) => (
            <Card key={item.q}>
              <CardHeader>
                <CardTitle className="text-base">{item.q}</CardTitle>
                <CardDescription>{item.a}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border bg-primary p-8 text-primary-foreground">
        <h2 className="text-3xl font-semibold">{t("landing.final.headline")}</h2>
        <Button className="mt-4" variant="secondary">
          {t("landing.final.cta")}
        </Button>
      </section>
    </div>
  );
}
