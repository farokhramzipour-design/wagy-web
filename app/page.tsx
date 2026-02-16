import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { LandingPageSections } from "@/components/sections/landing-page";

export default function HomePage() {
  return (
    <div className="page-shell">
      <PublicHeader />
      <main className="container">
        <LandingPageSections />
      </main>
      <PublicFooter />
    </div>
  );
}
