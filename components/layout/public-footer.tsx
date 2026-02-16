"use client";

import { useAppTranslation } from "@/lib/use-app-translation";

export function PublicFooter() {
  const { t } = useAppTranslation();

  return (
    <footer className="mt-20 border-t bg-white/60">
      <div className="container grid gap-6 py-10 text-sm text-muted-foreground md:grid-cols-4">
        <div>
          <p className="text-lg font-semibold text-foreground">{t("common.brand")}</p>
          <p className="mt-2">{t("footer.tagline")}</p>
        </div>
        <div>
          <p className="font-semibold text-foreground">{t("footer.product")}</p>
          <p className="mt-2">{t("nav.services")}</p>
          <p>{t("nav.becomeSitter")}</p>
        </div>
        <div>
          <p className="font-semibold text-foreground">{t("footer.company")}</p>
          <p className="mt-2">{t("footer.support")}</p>
          <p>{t("nav.login")}</p>
        </div>
        <div>
          <p className="font-semibold text-foreground">{t("footer.legal")}</p>
          <p className="mt-2">{t("footer.privacy")}</p>
          <p>{t("footer.terms")}</p>
        </div>
      </div>
    </footer>
  );
}
