import { LanguageProvider } from '@/components/providers/language-provider';
import { JsonLd } from '@/components/seo/json-ld';
import { Toaster } from "@/components/ui/sonner";
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import en from '../locales/en.json';
import fa from '../locales/fa.json';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = cookies();
  const lang = (cookieStore.get("waggy_lang")?.value as "en" | "fa") || "en";
  const dict = lang === 'fa' ? fa : en;
  const isRtl = lang === 'fa';

  return {
    metadataBase: new URL('https://waggy.ir'),
    title: {
      default: dict.metadata.title,
      template: `%s | ${isRtl ? 'واگی' : 'Waggy'}`
    },
    description: dict.metadata.description,
    keywords: ['pet sitting', 'dog walking', 'pet care', 'dog grooming', 'cat sitting', 'pet boarding', 'Waggy'],
    authors: [{ name: 'Waggy Team' }],
    creator: 'Waggy',
    publisher: 'Waggy',
    openGraph: {
      type: 'website',
      locale: isRtl ? 'fa_IR' : 'en_US',
      url: 'https://waggy.ir',
      title: dict.metadata.title,
      description: dict.metadata.description,
      siteName: isRtl ? 'واگی' : 'Waggy',
      images: [
        {
          url: '/og-image.jpg', // Placeholder
          width: 1200,
          height: 630,
          alt: isRtl ? 'واگی - خدمات مراقبت از حیوانات' : 'Waggy - Pet Care Services',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.metadata.title,
      description: dict.metadata.description,
      creator: '@waggy',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const lang = (cookieStore.get("waggy_lang")?.value as "en" | "fa") || "en";
  const dir = lang === "fa" ? "rtl" : "ltr";

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Waggy',
    url: 'https://waggy.ir',
    logo: 'https://waggy.ir/logo.png',
    sameAs: [
      'https://twitter.com/waggy',
      'https://instagram.com/waggy',
      'https://facebook.com/waggy'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-555-5555',
      contactType: 'customer service'
    }
  };

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <body>
        <JsonLd data={jsonLd} />
        <LanguageProvider initialLang={lang}>
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
