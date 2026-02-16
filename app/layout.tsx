import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Waggy',
  description: 'Waggy clean restart'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <div className="container">
            <Link href="/" className="brand">Waggy</Link>
            <nav className="nav">
              <Link href="/">Home</Link>
              <Link href="/auth">Auth</Link>
              <Link href="/app/dashboard">Dashboard</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
