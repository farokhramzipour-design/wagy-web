import './globals.css';

export const metadata = {
  title: 'Waggy',
  description: 'Loving care for your best friend'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
