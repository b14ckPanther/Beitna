'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { Menu, X, Globe, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from '@/i18n/navigation';
import { useCart } from '@/components/cart/CartProvider';

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { totalItems } = useCart();

  const isRTL = locale === 'ar' || locale === 'he';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/menu', label: t('menu') },
    { href: '/cart', label: t('reservations') },
    { href: '/experiences', label: t('experiences') },
  ];

  const languages = [
    { code: 'ar', label: tCommon('lang_ar'), font: 'font-cairo' },
    { code: 'he', label: tCommon('lang_he'), font: 'font-heebo' },
    { code: 'en', label: tCommon('lang_en'), font: 'font-ubuntu' },
  ];

  const switchLocale = (newLocale: string) => {
    router.push(pathname, { locale: newLocale as 'ar' | 'he' | 'en' });
    setLangOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-obsidian/95 backdrop-blur-xl border-b border-gold/10 py-3'
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="relative group flex-shrink-0">
              <div className="relative w-16 h-16 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo.png?v=beitna1"
                  alt="Beitna بيتنا"
                  fill
                  className="object-contain drop-shadow-[0_0_12px_rgba(201,165,106,0.4)]"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8" dir={isRTL ? 'rtl' : 'ltr'}>
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href as '/'}
                    className={cn(
                      'relative text-sm font-medium tracking-wide transition-all duration-300 py-1',
                      'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gold-gradient after:scale-x-0 after:transition-transform after:duration-300 after:origin-center',
                      'hover:text-gold-DEFAULT hover:after:scale-x-100',
                      isActive
                        ? 'text-gold-DEFAULT after:scale-x-100'
                        : 'text-cream/70'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side: Lang + Cart CTA */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Language Switcher */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 text-cream/60 hover:text-gold-DEFAULT transition-colors duration-300 text-sm"
                  aria-label="Switch language"
                >
                  <Globe size={15} strokeWidth={1.5} />
                  <span className="font-medium">{locale.toUpperCase()}</span>
                </button>
                {langOpen && (
                  <div className="absolute top-full mt-3 right-0 bg-obsidian-50 border border-gold/20 rounded-sm shadow-2xl overflow-hidden min-w-[130px] z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => switchLocale(lang.code)}
                        className={cn(
                          'w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 block',
                          lang.font,
                          locale === lang.code
                            ? 'text-gold-DEFAULT bg-gold/5'
                            : 'text-cream/70 hover:text-cream hover:bg-white/5'
                        )}
                        dir={lang.code === 'ar' || lang.code === 'he' ? 'rtl' : 'ltr'}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart CTA */}
              <Link
                href="/cart"
                className="btn-gold px-5 py-2.5 text-sm font-semibold rounded-sm tracking-widest flex items-center gap-2"
              >
                <ShoppingBag size={14} />
                {t('reservations')}
                {totalItems > 0 && (
                  <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-obsidian text-[11px] px-1">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden items-center gap-3">
              <Link
                href="/cart"
                className="relative text-cream/70 hover:text-gold-DEFAULT transition-colors p-1"
                aria-label="Cart"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-gold-DEFAULT text-[10px] text-obsidian px-0.5">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMenuOpen(true)}
                className="text-cream/70 hover:text-gold-DEFAULT transition-colors p-1"
                aria-label="Open menu"
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-[60] transition-all duration-500',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-obsidian/95 backdrop-blur-xl"
          onClick={() => setMenuOpen(false)}
        />

        {/* Panel */}
        <div
          className={cn(
            'absolute inset-y-0 right-0 w-full max-w-xs bg-obsidian-50 border-l border-gold/10 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between p-6 border-b border-gold/10">
            <Image src="/logo.png?v=beitna1" alt="Beitna" width={48} height={48} className="object-contain" />
            <button
              onClick={() => setMenuOpen(false)}
              className="text-cream/60 hover:text-gold-DEFAULT transition-colors"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col flex-1 p-6 gap-1">
            {navLinks.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href as '/'}
                  onClick={() => setMenuOpen(false)}
                  style={{ transitionDelay: menuOpen ? `${i * 60}ms` : '0ms' }}
                  className={cn(
                    'text-xl font-semibold py-3 border-b border-gold/5 transition-all duration-300',
                    isActive ? 'text-gold-DEFAULT' : 'text-cream/70 hover:text-cream'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Language + CTA at bottom */}
          <div className="p-6 border-t border-gold/10 space-y-4">
            <div className="flex gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => switchLocale(lang.code)}
                  className={cn(
                    'flex-1 py-2 text-xs font-medium rounded-sm border transition-all duration-200',
                    lang.font,
                    locale === lang.code
                      ? 'border-gold-DEFAULT text-gold-DEFAULT bg-gold/5'
                      : 'border-gold/20 text-cream/50 hover:border-gold/40 hover:text-cream/70'
                  )}
                  dir={lang.code === 'ar' || lang.code === 'he' ? 'rtl' : 'ltr'}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            <Link
              href="/cart"
              onClick={() => setMenuOpen(false)}
              className="btn-gold w-full block text-center py-3 text-sm font-bold tracking-widest rounded-sm"
            >
              {t('reservations')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
