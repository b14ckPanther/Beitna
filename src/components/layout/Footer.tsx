'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Phone, MapPin, Clock, Instagram } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  const whatsappLink = getWhatsAppLink('0503274101');

  return (
    <footer className="relative bg-obsidian-50 border-t border-gold/10 overflow-hidden">
      {/* Top ornamental line */}
      <div className="ornament-line w-full" />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gold-DEFAULT/3 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand Column */}
          <div className="lg:col-span-1 flex flex-col items-center md:items-start gap-5">
            <Image
              src="/logo.png?v=beitna1"
              alt="Beitna"
              width={120}
              height={120}
              className="object-contain drop-shadow-[0_0_20px_rgba(201,165,106,0.3)]"
            />
            <p className="text-cream/50 text-sm leading-relaxed text-center md:text-right max-w-[200px]">
              {t('tagline')}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-2">
              <a
                href="#"
                className="text-cream/40 transition-all duration-300 hover:scale-110 cursor-default"
                aria-label="Instagram"
              >
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/40 hover:text-gold-DEFAULT transition-all duration-300 hover:scale-110"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon size={18} />
              </a>
              <a
                href="#"
                className="text-cream/40 transition-all duration-300 hover:scale-110 cursor-default"
                aria-label="TikTok"
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.79a8.18 8.18 0 004.77 1.52V6.84a4.85 4.85 0 01-1-.15z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="text-right">
            <h3 className="text-gold-DEFAULT text-xs font-semibold tracking-widest uppercase mb-6">
              {tNav('home')}
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: tNav('home') },
                { href: '/menu', label: tNav('menu') },
                { href: '/cart', label: tNav('reservations') },
                { href: '/experiences', label: tNav('experiences') },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href as '/'}
                    className="text-cream/50 hover:text-gold-DEFAULT transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-right">
            <h3 className="text-gold-DEFAULT text-xs font-semibold tracking-widest uppercase mb-6">
              {t('contact_title')}
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${t('phone')}`}
                  className="flex items-center gap-3 text-cream/50 hover:text-gold-DEFAULT transition-colors duration-300 justify-end group"
                >
                  <span className="text-sm font-mono" dir="ltr">{t('phone')}</span>
                  <Phone size={14} strokeWidth={1.5} className="flex-shrink-0 group-hover:text-gold-DEFAULT" />
                </a>
              </li>
              <li>
                <a
                  href="https://waze.com/ul/hsvc5f2pe3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-cream/50 hover:text-gold-DEFAULT transition-colors duration-300 justify-end group"
                >
                  <span className="text-sm">{t('location')}</span>
                  <MapPin size={14} strokeWidth={1.5} className="flex-shrink-0 group-hover:text-gold-DEFAULT" />
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-cream/50 hover:text-gold-DEFAULT transition-colors duration-300 justify-end group"
                >
                  <span className="text-sm">WhatsApp</span>
                  <span className="flex-shrink-0 group-hover:text-gold-DEFAULT">
                    <WhatsAppIcon size={14} />
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="text-right">
            <h3 className="text-gold-DEFAULT text-xs font-semibold tracking-widest uppercase mb-6">
              {t('hours_title')}
            </h3>
            <div className="flex items-start gap-3 justify-end">
              <div>
                <p className="text-cream/80 text-sm font-medium">{t('hours')}</p>
                <p className="text-cream/40 text-xs mt-1">{t('days')}</p>
              </div>
              <Clock size={14} strokeWidth={1.5} className="text-gold-DEFAULT mt-0.5 flex-shrink-0" />
            </div>

            {/* Waze CTA */}
            <a
              href="https://waze.com/ul/hsvc5f2pe3"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 btn-outline-gold px-4 py-2 text-xs font-medium rounded-sm"
            >
              {t('waze')}
              <MapPin size={12} />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gold/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream/25 text-xs">
            &copy; {new Date().getFullYear()} <span lang="ar">بيتنا</span> | Beitna. {t('rights')}.
          </p>
          <p className="text-cream/25 text-xs">
            {t('designed_by')} — Noor
          </p>
        </div>
      </div>
    </footer>
  );
}
