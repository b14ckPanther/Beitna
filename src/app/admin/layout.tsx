import type { Metadata } from 'next';
import { Cairo, Ubuntu } from 'next/font/google';
import '../globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-ubuntu',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Admin — Beitna', template: '%s | Admin' },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${cairo.variable} ${ubuntu.variable}`}>
      <body className="font-ubuntu bg-obsidian text-cream antialiased">
        {children}
      </body>
    </html>
  );
}
