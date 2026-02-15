"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, BadgeCheck, Headset, WalletCards, PawPrint, House, Footprints, Sun, Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PublicHeader } from "@/components/layout/public-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const fade = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.35 }
};

export function LandingPageSections() {
  const { t } = useTranslation();

  const trustItems = [
    { key: "verified", icon: BadgeCheck },
    { key: "insurance", icon: ShieldCheck },
    { key: "payments", icon: WalletCards },
    { key: "support", icon: Headset }
  ];

  const services = [
    { key: "boarding", icon: Home },
    { key: "houseSitting", icon: House },
    { key: "walking", icon: Footprints },
    { key: "daycare", icon: Sun },
    { key: "dropIn", icon: PawPrint }
  ];

  return (
    <div>
      <PublicHeader />
      <main>
        <section className="container-hero section-pad grid gap-8 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-balance text-[38px] font-bold leading-[1.2] text-secondary-foreground md:text-h1">{t("landing.heroTitle")}</h1>
            <p className="mt-4 max-w-xl text-body-lg text-muted-foreground">{t("landing.heroSubtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/auth">{t("landing.heroCta")}</Link>
              </Button>
              <Button asChild variant="accent" size="lg">
                <Link href="/app/become-sitter">{t("landing.heroSecondary")}</Link>
              </Button>
            </div>
            <p className="mt-4 text-small text-muted-foreground">{t("landing.trustLine")}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-border bg-white/92 p-6 shadow-card"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input placeholder={t("landing.search.location")} />
              <Input placeholder={t("landing.search.dates")} />
              <Input placeholder={t("landing.search.petType")} />
              <Input placeholder={t("landing.search.serviceType")} />
            </div>
            <Button className="mt-4 w-full rounded-xl">{t("landing.heroCta")}</Button>
          </motion.div>
        </section>

        <section className="container-main pb-16 md:pb-20">
          <motion.h2 {...fade} className="mb-5 text-h3">
            {t("landing.trust.title")}
          </motion.h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.key} {...fade} transition={{ duration: 0.4, delay: i * 0.05 }}>
                  <Card className="h-full bg-white/95">
                    <CardContent className="space-y-3 p-5">
                      <div className="inline-flex rounded-full bg-secondary p-2">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="font-medium">{t(`landing.trust.${item.key}Title`)}</p>
                      <p className="text-small text-muted-foreground">{t(`landing.trust.${item.key}Description`)}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section id="services" className="container-main pb-16 md:pb-20">
          <motion.h2 {...fade} className="mb-5 text-h3">
            {t("landing.services.title")}
          </motion.h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <motion.div key={service.key} whileHover={{ y: -3, scale: 1.01 }} transition={{ duration: 0.25 }}>
                  <Card className="h-full bg-white/95">
                    <CardContent className="flex flex-col items-start gap-3 p-5">
                      <Icon className="h-5 w-5" />
                      <p className="font-medium">{t(`landing.services.${service.key}Title`)}</p>
                      <p className="text-small text-muted-foreground">{t(`landing.services.${service.key}Description`)}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="container-main pb-16 md:pb-20">
          <motion.h2 {...fade} className="mb-5 text-h3">{t("landing.howItWorks.title")}</motion.h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <motion.div key={n} {...fade}>
                <Card>
                  <CardHeader>
                    <CardTitle>{t(`landing.howItWorks.step${n}Title`)}</CardTitle>
                  </CardHeader>
                  <CardContent>{t(`landing.howItWorks.step${n}Description`)}</CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container-main pb-16 md:pb-20">
          <motion.h2 {...fade} className="mb-5 text-h3">{t("landing.testimonials.title")}</motion.h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((n) => (
              <motion.div key={n} {...fade}>
                <Card className="bg-white/95">
                  <CardContent className="space-y-3 p-6">
                    <p className="font-medium">{t(`landing.testimonials.author${n}`)}</p>
                    <p className="text-sm leading-6 text-muted-foreground">{t(`landing.testimonials.quote${n}`)}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container-main pb-16 md:pb-20">
          <motion.div {...fade}>
            <Card className="bg-gradient-to-r from-primary/10 to-brand-light/90">
              <CardHeader>
                <CardTitle>{t("landing.safety.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-body text-muted-foreground">
                <p>{t("landing.safety.point1")}</p>
                <p>{t("landing.safety.point2")}</p>
                <p>{t("landing.safety.point3")}</p>
                <p>{t("landing.safety.point4")}</p>
                <p className="pt-2 font-medium text-foreground">{t("landing.safety.outro")}</p>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <section className="container-main pb-16 md:pb-20">
          <motion.div {...fade}>
            <Card className="border-accent/30 bg-accent/10">
              <CardHeader>
                <CardTitle>{t("landing.becomeSitter.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-body text-muted-foreground">{t("landing.becomeSitter.point1")}</p>
                <p className="text-body text-muted-foreground">{t("landing.becomeSitter.point2")}</p>
                <p className="text-body text-muted-foreground">{t("landing.becomeSitter.point3")}</p>
                <Button asChild variant="accent" className="mt-3">
                  <Link href="/app/become-sitter">{t("landing.becomeSitter.cta")}</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <section className="container-main pb-16 md:pb-20">
          <motion.h2 {...fade} className="mb-5 text-h3">{t("landing.faq.title")}</motion.h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <motion.div key={n} {...fade}>
                <Card>
                  <CardContent className="p-5">
                    <p className="font-medium">{t(`landing.faq.q${n}`)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{t(`landing.faq.a${n}`)}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container-main pb-16 md:pb-24">
          <motion.div {...fade} className="rounded-2xl border border-primary/20 bg-white/90 p-8 text-center shadow-card">
            <p className="text-h3">{t("landing.finalCta.line1")}</p>
            <p className="mt-2 text-h3 text-primary">{t("landing.finalCta.line2")}</p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/auth">{t("landing.finalCta.button")}</Link>
            </Button>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-border/80 bg-white/85">
        <div className="container-main grid gap-4 py-10 md:grid-cols-4">
          <div>
            <p className="text-lg font-semibold">{t("common.brand")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t("landing.footer.tagline")}</p>
          </div>
          <div>
            <p className="font-medium">{t("landing.footer.product")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("header.services")}</p>
          </div>
          <div>
            <p className="font-medium">{t("landing.footer.company")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("landing.footer.about")}</p>
            <p className="text-sm text-muted-foreground">{t("landing.footer.careers")}</p>
          </div>
          <div>
            <p className="font-medium">{t("landing.footer.resources")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("landing.footer.help")}</p>
            <p className="text-sm text-muted-foreground">{t("landing.footer.safety")}</p>
            <p className="text-sm text-muted-foreground">{t("landing.footer.privacy")}</p>
            <p className="text-sm text-muted-foreground">{t("landing.footer.terms")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
