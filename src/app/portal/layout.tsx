import type { Metadata } from 'next';
import { Cairo, Ubuntu } from 'next/font/google';
import '../globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  weight: ['300', '400', '500', '600', '700', '900'],
  display: 'swap',
});

const ubuntu = Ubuntu({
  subsets: ['latin'],
  variable: '--font-ubuntu',
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'بيتنا — بوابة الإدارة',
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="rtl" className={`${cairo.variable} ${ubuntu.variable}`}>
      <body className="font-ubuntu bg-obsidian text-cream antialiased">
        {children}
      </body>
    </html>
  );
}
