'use client';

import { useInView } from 'react-intersection-observer';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { MenuCategory } from '@/lib/supabase';

type Props = { categories: MenuCategory[] };

export default function MenuPreview({ categories }: Props) {
  const t = useTranslations('menu');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const featured = categories.slice(0, 4);

  const getCategoryName = (cat: MenuCategory) =>
    locale === 'he' ? (cat.name_he || cat.name_ar) : locale === 'en' ? (cat.name_en || cat.name_ar) : cat.name_ar;

  const getItemName = (item: { name_ar: string; name_he?: string | null; name_en?: string | null }) =>
    locale === 'he' ? (item.name_he || item.name_ar) : locale === 'en' ? (item.name_en || item.name_ar) : item.name_ar;

  const getItemDesc = (item: { desc_ar?: string | null; desc_he?: string | null; desc_en?: string | null }) =>
    locale === 'he' ? (item.desc_he || item.desc_ar) : locale === 'en' ? (item.desc_en || item.desc_ar) : item.desc_ar;

  if (categories.length === 0) return null;

  return (
    <section ref={ref} className="relative py-28 sm:py-36 bg-obsidian overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`mb-16 transition-all duration-1000 text-center ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gold-DEFAULT/30" />
            <span className="section-label">{t('title')}</span>
            <div className="h-px w-12 bg-gold-DEFAULT/30" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-cream/90 text-center">{t('subtitle')}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {featured.map((category, i) => {
            const topItems = (category.menu_items ?? []).filter((item) => item.is_available).slice(0, 3);
            return (
              <div
                key={category.id}
                style={{ transitionDelay: `${i * 100}ms` }}
                className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              >
                <Link href="/menu" className="block glass-card group hover:border-gold/25 transition-all duration-500 overflow-hidden">
                  <div className="px-6 pt-6 pb-4 border-b border-gold/8 flex items-center justify-between">
                    <div className="w-1.5 h-1.5 bg-gold-DEFAULT rounded-full" />
                    <h3 className="text-gold-DEFAULT font-bold text-lg" {...(/[\u0600-\u06FF]/.test(getCategoryName(category)) && { lang: 'ar' })}>{getCategoryName(category)}</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {topItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4">
                        <div className="text-left">
                          <span className="text-gold-DEFAULT text-sm font-semibold">{item.price}<span className="text-gold-DEFAULT/70 text-xs">₪</span></span>
                        </div>
                        <div className="text-right flex-1 min-w-0">
                          <p className="text-cream/80 text-sm font-medium truncate" {...(/[\u0600-\u06FF]/.test(getItemName(item)) && { lang: 'ar' })}>{getItemName(item)}</p>
                          {getItemDesc(item) && <p className="text-cream/35 text-xs mt-0.5 truncate" {...(/[\u0600-\u06FF]/.test(getItemDesc(item) || '') && { lang: 'ar' })}>{getItemDesc(item)}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-DEFAULT/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
              </div>
            );
          })}
        </div>

        <div className={`text-center mt-12 transition-all duration-1000 delay-600 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link href="/menu" className="btn-gold inline-block px-10 py-4 text-sm font-bold tracking-[0.2em] rounded-sm uppercase">
            {tNav('menu')}
          </Link>
        </div>
      </div>
    </section>
  );
}
