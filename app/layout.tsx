import './globals.css';

export const metadata = {
  title: 'Waggy',
  description: 'Waggy clean restart'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
