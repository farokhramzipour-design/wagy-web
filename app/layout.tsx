import './globals.css';
import { cookies } from 'next/headers';
import { LanguageProvider } from '@/components/providers/language-provider';
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: 'Waggy',
  description: 'Loving care for your best friend'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const lang = (cookieStore.get("waggy_lang")?.value as "en" | "fa") || "en";
  const dir = lang === "fa" ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <body>
        <LanguageProvider initialLang={lang}>
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
