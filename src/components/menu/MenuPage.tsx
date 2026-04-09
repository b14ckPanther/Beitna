'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import type { MenuCategory, MenuItem } from '@/lib/supabase';
import { useCart } from '@/components/cart/CartProvider';
import { ImageOff, Flame, Sparkles, Star, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

function TagBadge({ tag }: { tag: MenuItem['tag'] }) {
  if (!tag) return null;
  const config = {
    popular: { icon: Flame, label: 'شائع', color: 'text-orange-400 border-orange-400/30 bg-orange-400/5' },
    signature: { icon: Sparkles, label: 'مميز', color: 'text-gold-DEFAULT border-gold/30 bg-gold/5' },
    new: { icon: Star, label: 'جديد', color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5' },
  };
  const { icon: Icon, label, color } = config[tag];
  return (
    <span className={cn('inline-flex items-center gap-1 text-[9px] font-bold tracking-widest uppercase border px-1.5 py-0.5 rounded-sm', color)}>
      <Icon size={8} />
      <span lang="ar">{label}</span>
    </span>
  );
}

type PriceHintMode = 'size' | 'type' | 'unit' | null;

type MenuItemWithMeta = MenuItem & {
  min_price?: number | null;
  max_price?: number | null;
  hint_mode?: PriceHintMode;
};

function MenuItemCard({
  item,
  onClick,
  onAdded,
  showAddButton = true,
  isSalad,
}: {
  item: MenuItemWithMeta;
  onClick?: () => void;
  onAdded?: (info: { name: string; price: number }) => void;
  showAddButton?: boolean;
  isSalad?: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const locale = useLocale();
  const { addItem } = useCart();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const name = locale === 'he' ? (item.name_he || item.name_ar) : locale === 'en' ? (item.name_en || item.name_ar) : item.name_ar;
  const desc = locale === 'he' ? (item.desc_he || item.desc_ar) : locale === 'en' ? (item.desc_en || item.desc_ar) : item.desc_ar;
  const nameIsArabic = locale === 'ar' || (locale === 'he' && !item.name_he) || (locale === 'en' && !item.name_en);
  const descIsArabic = locale === 'ar' || (locale === 'he' && !item.desc_he) || (locale === 'en' && !item.desc_en);

  const hintMode: PriceHintMode = item.hint_mode ?? null;
  const hintText =
    hintMode === 'size'
      ? 'انقر لاختيار الحجم'
      : hintMode === 'type'
      ? 'انقر لاختيار النوع'
      : hintMode === 'unit'
      ? 'انقر لاختيار الكمية'
      : null;

  // Artisan Kitchen Logic
  const itemIsSalad = isSalad || item.section?.includes('سلطات') || item.section?.toLowerCase().includes('salad');

  return (
    <div
      ref={ref}
      className={cn(
        'premium-card mini-tile-shadow flex flex-col transition-all duration-700 cursor-pointer group relative',
        // Forced square aspect ratio across all devices
        'w-[185px] sm:w-[280px] aspect-square',
        'rounded-3xl sm:rounded-[2.5rem] overflow-hidden bg-white',
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 sm:translate-y-12'
      )}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : -1}
      onClick={onClick}
    >
      {/* Image Section - Optimized for high-fidelity square view */}
      <div className="relative h-[110px] sm:h-[165px] w-full overflow-hidden bg-cream-100">
        {item.image_url && !imgError ? (
          <Image
            src={item.image_url as string}
            alt={name}
            fill
            className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-20">
            <ImageOff strokeWidth={1} className="w-6 h-6 sm:w-8 sm:h-8 text-gold-DEFAULT" />
          </div>
        )}
        
        {/* Floating Price Badge */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 group-hover:scale-110 transition-transform duration-500">
          <div className="bg-white/90 backdrop-blur-md border border-gold/20 px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl flex flex-col items-center group-hover:bg-gold-DEFAULT group-hover:text-white transition-all duration-500 shadow-lg">
             <div className="flex items-center gap-0.5 sm:gap-1">
               <span className="text-xs sm:text-base font-black leading-none text-obsidian">{itemIsSalad ? (locale === 'ar' ? 'يبدأ من' : 'Starts at') : ''} {item.price}</span>
               <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-tighter text-obsidian/70">₪</span>
             </div>
          </div>
        </div>

        {item.tag && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 scale-[0.7] sm:scale-90 origin-top-left">
            <TagBadge tag={item.tag} />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/20 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
      </div>

      {/* Content Section - Compact and elegant text layout */}
      <div className="p-3 sm:px-5 sm:py-4 pt-1 sm:pt-3 flex flex-col flex-1 text-right">
        <div className="mb-0.5 sm:mb-1.5">
          <h3 className="text-obsidian font-bold text-xs sm:text-base leading-tight group-hover:text-gold-DEFAULT transition-colors line-clamp-1">
            {nameIsArabic ? <span lang="ar">{name}</span> : name}
          </h3>
          {locale === 'ar' && item.name_he && (
            <p className="hidden sm:block text-obsidian/30 text-[9px] mt-0.5 font-heebo line-clamp-1" dir="rtl">
              {item.name_he}
            </p>
          )}
        </div>

        {/* Description - Adjusted for square constraints */}
        {desc && (
          <p className="text-obsidian/50 text-[9px] sm:text-[11px] leading-relaxed line-clamp-2 min-h-[1.8rem] sm:min-h-[2.4rem] mb-1 sm:mb-2 font-medium">
            {descIsArabic ? <span lang="ar">{desc}</span> : desc}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-1 sm:gap-2">
          <div className="flex-1">
            {hintText && (
              <span className="text-gold-dark/60 text-[8px] uppercase font-bold tracking-[0.2em] block text-left" lang="ar">
                {hintText}
              </span>
            )}
          </div>
          
          {showAddButton && (
            <button
               type="button"
               onClick={(e) => {
                 e.stopPropagation();
                 addItem({
                   id: item.id,
                   name_ar: item.name_ar,
                   name_he: item.name_he,
                   name_en: item.name_en,
                   price: item.price,
                 });
                 onAdded?.({ name, price: item.price });
               }}
               className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-gold-dark/10 border border-gold-dark/40 text-obsidian hover:bg-gold-dark hover:text-white hover:scale-110 active:scale-90 transition-all duration-500 shadow-md"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function HorizontalProductRow({
  label,
  labelIsArabic,
  children,
}: {
  label: string | null;
  labelIsArabic: boolean;
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const isRTL = document.documentElement.dir === 'rtl';
    
    if (isRTL) {
      setCanScrollRight(scrollLeft < 0);
      setCanScrollLeft(Math.abs(scrollLeft) < scrollWidth - clientWidth - 5);
    } else {
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScroll();
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  return (
    <div className="relative group/row">
      {label && (
        <div className="flex flex-col items-center justify-center mb-10 sm:mb-16 px-4">
          <div className="relative py-4 sm:py-6 px-12 sm:px-24 text-center group/header">
            {/* Artisan Parchment Background - High Visibility */}
            <div className="absolute inset-0 bg-gold/20 rounded-[3rem] rotate-2 scale-105 opacity-60 transition-transform duration-700" />
            <div className="absolute inset-0 bg-[#F5E6CA] shadow-inner rounded-[2.5rem] -rotate-1 border-2 border-gold/10 transition-transform duration-700" />
            
            <h2 
              className="relative text-3xl sm:text-5xl font-black text-obsidian tracking-wider sm:tracking-[0.2em] uppercase"
              {...(labelIsArabic && { lang: 'ar' })}
            >
              {label}
            </h2>
          </div>
        </div>
      )}
      
      <div className="relative overflow-visible">
        <button
          type="button"
          onClick={() => scroll('left')}
          className={cn(
            "absolute -left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 hidden lg:flex items-center justify-center rounded-full bg-white/90 backdrop-blur-xl border border-gold/30 text-gold-DEFAULT shadow-lg transition-all duration-300 hover:bg-gold-DEFAULT hover:text-white hover:scale-110 active:scale-95 disabled:opacity-0 disabled:pointer-events-none",
            canScrollLeft ? "opacity-0 group-hover/row:opacity-100" : "opacity-0 pointer-events-none"
          )}
          disabled={!canScrollLeft}
        >
          <ChevronLeft size={22} />
        </button>

        <button
          type="button"
          onClick={() => scroll('right')}
          className={cn(
            "absolute -right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 hidden lg:flex items-center justify-center rounded-full bg-white/90 backdrop-blur-xl border border-gold/30 text-gold-DEFAULT shadow-lg transition-all duration-300 hover:bg-gold-DEFAULT hover:text-white hover:scale-110 active:scale-95 disabled:opacity-0 disabled:pointer-events-none",
            canScrollRight ? "opacity-0 group-hover/row:opacity-100" : "opacity-0 pointer-events-none"
          )}
          disabled={!canScrollRight}
        >
          <ChevronRight size={22} />
        </button>

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-3 sm:gap-8 overflow-x-auto snap-x-mandatory custom-scrollbar-h pb-6 sm:pb-12 scroll-smooth scrollbar-hide sm:scrollbar-default px-1 sm:px-4"
          style={{ scrollPaddingLeft: '1rem', scrollPaddingRight: '1rem' }}
        >
          {children}
        </div>
        
        <div className="absolute left-0 top-0 bottom-8 w-12 bg-gradient-to-r from-cream to-transparent pointer-events-none opacity-0 h-full sm:group-hover/row:opacity-100 transition-opacity z-10" />
        <div className="absolute right-0 top-0 bottom-8 w-12 bg-gradient-to-l from-cream to-transparent pointer-events-none opacity-0 h-full sm:group-hover/row:opacity-100 transition-opacity z-10" />
      </div>
    </div>
  );
}

function SectionedGrid({
  items,
  onItemClick,
  showAddButton = true,
  onItemAdded,
  isSalad,
}: {
  items: MenuItemWithMeta[];
  onItemClick?: (item: MenuItem) => void;
  showAddButton?: boolean;
  onItemAdded?: (info: { name: string; price: number }) => void;
  isSalad?: boolean;
}) {
  const locale = useLocale();
  const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order);

  const groups: { label: string | null; items: MenuItem[] }[] = [];
  for (const item of sorted) {
    const label = item.section ?? null;
    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.items.push(item);
    } else {
      groups.push({ label, items: [item] });
    }
  }

  const sectionLabel = (label: string) => {
    if (label === 'بارد') return { ar: 'مشروبات باردة', he: 'שתייה קרה', en: 'Cold Drinks' };
    if (label === 'ساخن') return { ar: 'مشروبات ساخنة', he: 'שתייה חمة', en: 'Hot Drinks' };
    return { ar: label, he: label, en: label };
  };

  const getLabel = (label: string) => {
    const s = sectionLabel(label);
    return locale === 'he' ? s.he : locale === 'en' ? s.en : s.ar;
  };
  const labelIsArabic = (label: string) => /[\u0600-\u06FF]/.test(getLabel(label));

  return (
    <div className="space-y-14 sm:space-y-24">
      {groups.map((group, idx) => {
        const labelText = group.label ? getLabel(group.label) : null;
        // Salads detection based on label content
        const isSaladRow = labelText?.includes('سلطات') || labelText?.toLowerCase().includes('salad');
        
        return (
          <HorizontalProductRow
            key={idx}
            label={labelText}
            labelIsArabic={group.label ? labelIsArabic(group.label) : false}
          >
            {group.items.map((item) => (
              <div key={item.id} className="flex-shrink-0 snap-center sm:snap-start py-2 sm:py-4">
                <MenuItemCard
                  item={item}
                  onClick={onItemClick ? () => onItemClick(item) : undefined}
                  onAdded={onItemAdded}
                  showAddButton={showAddButton}
                  isSalad={isSaladRow || isSalad}
                />
              </div>
            ))}
          </HorizontalProductRow>
        );
      })}
    </div>
  );
}

function groupByBaseName(items: MenuItem[]) {
  const groups: { baseName: string; variants: MenuItem[] }[] = [];
  for (const item of items) {
    const match = item.name_ar.match(/^(.*)\((.+)\)\s*$/);
    const base = (match ? match[1] : item.name_ar).trim();
    const existing = groups.find((g) => g.baseName === base);
    if (existing) existing.variants.push(item);
    else groups.push({ baseName: base, variants: [item] });
  }
  return groups;
}

function getBaseItemsForCategory(items: MenuItem[]) {
  const groups = groupByBaseName(items);
  return groups.map((group) => {
    const sortedVariants = [...group.variants].sort((a, b) => a.sort_order - b.sort_order);
    const first = sortedVariants[0];

    const stripVariant = (value: string | null): string | null => {
      if (!value) return value;
      const match = value.match(/^(.*)\((.+)\)\s*$/);
      return (match ? match[1] : value).trim();
    };

    // For cards, show only the base dish name (no size/type in parentheses).
    // The full variant names are still kept in the original category items and
    // are used by the modal when building the size/type buttons.
    const baseItem = {
      ...first,
      name_ar: stripVariant(first.name_ar) as string,
      name_he: stripVariant(first.name_he),
      name_en: stripVariant(first.name_en),
    };

    // For cards, compute lowest and highest price among variants
    const prices = group.variants.map((v) => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return {
      ...baseItem,
      price: minPrice,
      min_price: minPrice,
      max_price: maxPrice,
    };
  });
}

function VariantGrid({
  items,
  onAdded,
}: {
  items: MenuItem[];
  onAdded?: (info: { name: string; price: number }) => void;
}) {
  const locale = useLocale();
  const { addItem } = useCart();
  const t = useTranslations('menu');

  const groups = groupByBaseName(items);
  const [lastAddedKey, setLastAddedKey] = useState<string | null>(null);

  const getVariantLabel = (item: MenuItem) => {
    const match = item.name_ar.match(/\((.+)\)\s*$/);
    return match ? match[1].trim() : t('optional_note');
  };

  useEffect(() => {
    if (!lastAddedKey) return;
    const timer = setTimeout(() => setLastAddedKey(null), 900);
    return () => clearTimeout(timer);
  }, [lastAddedKey]);

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.baseName} className="bg-cream-100/50 rounded-2xl p-5 border border-gold/5 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="text-obsidian font-bold text-base sm:text-lg" lang="ar">
              {group.baseName}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {(() => {
              const uniqueVariants = Array.from(
                new Map(
                  group.variants.map((v) => {
                    const key = `${group.baseName}-${getVariantLabel(v)}-${v.price}`;
                    return [key, v] as const;
                  }),
                ).values(),
              );

              const sizeOrder: Record<string, number> = {
                'صغير': 1,
                'وسط': 2,
                'كبير': 3,
                'كبير جداً': 4,
              };

              return uniqueVariants
                .sort((a, b) => {
                  const labelA = getVariantLabel(a);
                  const labelB = getVariantLabel(b);
                  const orderA = sizeOrder[labelA];
                  const orderB = sizeOrder[labelB];
                  if (orderA !== undefined && orderB !== undefined) return orderA - orderB;
                  return a.sort_order - b.sort_order;
                })
                .map((variant) => {
                  const key = `${group.baseName}-${getVariantLabel(variant)}-${variant.price}`;
                  const isActive = lastAddedKey === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        addItem({
                          id: variant.id,
                          name_ar: variant.name_ar,
                          name_he: variant.name_he,
                          name_en: variant.name_en,
                          price: variant.price,
                        });
                        onAdded?.({
                          name: `${group.baseName} (${getVariantLabel(variant)})`,
                          price: variant.price,
                        });
                        setLastAddedKey(key);
                      }}
                      className={cn(
                        'px-4 py-3.5 text-xs sm:text-sm rounded-2xl border-2 flex items-center justify-between transition-all duration-300 w-full',
                        isActive
                          ? 'bg-gold-DEFAULT text-white border-gold-DEFAULT shadow-md scale-[1.02]'
                          : 'bg-white border-gold/15 text-obsidian hover:border-gold/40 hover:bg-gold/5',
                      )}
                    >
                      <span className="font-bold whitespace-nowrap" lang="ar">{getVariantLabel(variant)}</span>
                      <div className={cn('h-4 w-px mx-2', isActive ? 'bg-white/30' : 'bg-gold/20')} />
                      <span className={cn('font-black whitespace-nowrap', isActive ? 'text-white' : 'text-gold-dark')}>
                        {variant.price} ₪
                      </span>
                    </button>
                  );
                });
            })()}
          </div>
        </div>
      ))}
    </div>
  );
}

type Props = { categories: MenuCategory[] };

export default function MenuPage({ categories }: Props) {
  const t = useTranslations('menu');
  const locale = useLocale();
  const { addItem } = useCart();

  // Merge any duplicate categories coming from the DB (same Arabic name)
  const mergedCategories: MenuCategory[] = useMemo(() => {
    const map = new Map<string, MenuCategory>();
    categories.forEach((cat) => {
      const key = (cat.name_ar || '').trim();
      const existing = map.get(key);
      if (!existing) {
        map.set(key, { ...cat, menu_items: [...(cat.menu_items ?? [])] });
      } else {
        existing.menu_items = [
          ...(existing.menu_items ?? []),
          ...(cat.menu_items ?? []),
        ];
      }
    });
    return Array.from(map.values()).sort((a, b) => a.sort_order - b.sort_order);
  }, [categories]);

  const [activeCategory, setActiveCategory] = useState(
    mergedCategories[0]?.id ?? '',
  );
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [lastAdded, setLastAdded] = useState<{ name: string; price: number } | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (mergedCategories.length > 0) setActiveCategory(mergedCategories[0].id);
  }, [mergedCategories]);

  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;
    const activeEl = navEl.querySelector(`[data-cat="${activeCategory}"]`) as HTMLElement;
    if (activeEl) {
      const offset = activeEl.offsetLeft - navEl.clientWidth / 2 + activeEl.clientWidth / 2;
      navEl.scrollTo({ left: offset, behavior: 'smooth' });
    }
  }, [activeCategory]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    mergedCategories.forEach((cat) => {
      const el = sectionRefs.current[cat.id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveCategory(cat.id); },
        { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [categories]);

  useEffect(() => {
    if (!lastAdded) return;
    const id = setTimeout(() => setLastAdded(null), 1400);
    return () => clearTimeout(id);
  }, [lastAdded]);

  useEffect(() => {
    if (!selectedItem) {
      setQuantity(1);
    }
  }, [selectedItem]);

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    const el = sectionRefs.current[catId];
    if (el) {
      // Offset for fixed header (~112-136px) + sticky category nav (~50px)
      const offset = 200;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const getCategoryName = (cat: MenuCategory) =>
    locale === 'he' ? (cat.name_he || cat.name_ar) : locale === 'en' ? (cat.name_en || cat.name_ar) : cat.name_ar;

  const isVariantCategory = (cat: MenuCategory) => {
    // Treat as variant category if it's explicitly a salads/pastries category
    // OR if there are multiple items sharing the same base name (text before parentheses)
    if (cat.name_ar === 'سلطات' || cat.name_ar === 'معجنات') return true;

    const items = cat.menu_items ?? [];
    if (items.length < 2) return false;

    const baseNameCounts = new Map<string, number>();
    for (const item of items) {
      const match = item.name_ar.match(/^(.*)\((.+)\)\s*$/);
      const base = (match ? match[1] : item.name_ar).trim();
      baseNameCounts.set(base, (baseNameCounts.get(base) ?? 0) + 1);
    }

    // If any base name appears more than once, we consider this a variant group
    for (const count of baseNameCounts.values()) {
      if (count > 1) return true;
    }
    return false;
  };

  if (mergedCategories.length === 0) {
    return (
      <div className="min-h-screen bg-cream pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-obsidian/30 text-sm">{t('subtitle')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-24">
      {/* Page Header — Artisan Saffron & Sage Flare */}
      <div className="relative pt-16 pb-20 sm:pt-20 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center top, rgba(201,165,106,0.12) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-10 sm:w-16 bg-gold-DEFAULT/40" />
            <span className="text-xs font-bold tracking-[0.4em] uppercase text-gold-dark/70">{t('title')}</span>
            <div className="h-px w-10 sm:w-16 bg-gold-DEFAULT/40" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-obsidian mb-4 text-center tracking-tight leading-tight">{t('subtitle')}</h1>
        </div>
      </div>

      {/* Sticky Category Nav — Artisan Glass */}
      <div className="sticky top-[112px] lg:top-[136px] z-40 bg-white/95 shadow-md backdrop-blur-xl border-y border-gold/10">
        <div ref={navRef} className="menu-scroll flex overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="flex items-center px-4 gap-1 py-1 min-w-max mx-auto">
            {mergedCategories.map((cat) => (
              <button
                key={cat.id}
                data-cat={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={cn(
                  'px-6 py-2.5 text-sm font-bold whitespace-nowrap transition-all duration-500 rounded-full',
                  activeCategory === cat.id
                    ? 'bg-gold-dark text-white shadow-lg scale-105'
                    : 'text-obsidian/50 hover:text-obsidian/70 hover:bg-gold/10'
                )}
                {...(/[\u0600-\u06FF]/.test(getCategoryName(cat)) && { lang: 'ar' })}
              >
                {getCategoryName(cat)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
        {mergedCategories.map((category) => {
          const availableItems = (category.menu_items ?? []).filter((i) => i.is_available);

          // Detect variant kind (sizes / types) based on Arabic label in parentheses
          const labels = availableItems
            .map((it) => it.name_ar.match(/\((.+)\)\s*$/)?.[1].trim())
            .filter((v): v is string => !!v);
          const sizeLabels = new Set(['صغير', 'وسط', 'كبير', 'كبير جداً']);
          const typeLabels = new Set(['كيلو عجين', 'كيلو مقلي', 'عجين', 'مقلي']);

          let detectedHint: PriceHintMode = null;
          if (labels.some((l) => sizeLabels.has(l))) detectedHint = 'size';
          else if (labels.some((l) => typeLabels.has(l))) detectedHint = 'type';

          return (
            <section
              key={category.id}
              id={category.id}
              ref={(el) => { sectionRefs.current[category.id] = el; }}
              className="scroll-mt-[210px] relative"
            >
              {/* Distinct Artisan Divider */}
              <div className="absolute -top-10 left-0 right-0 flex items-center justify-center opacity-20 pointer-events-none">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-dark to-transparent" />
                <div className="absolute bg-cream px-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-DEFAULT" />
                </div>
              </div>

              <div className="mb-0" />
              {(() => {
                const isVariantCat = isVariantCategory(category);
                const baseItems = isVariantCat ? getBaseItemsForCategory(availableItems) : availableItems;

                // For non-variant categories, treat as "per unit" for hint purposes
                const hintMode: PriceHintMode = isVariantCat ? detectedHint : 'unit';

                const itemsForGrid: MenuItemWithMeta[] = baseItems.map((item) => ({
                  ...(item as MenuItemWithMeta),
                  hint_mode: hintMode,
                }));

                if (itemsForGrid.length === 0) {
                  return (
                    <p className="text-cream/25 text-sm text-right">{t('no_image')}</p>
                  );
                }

                return (
                  <SectionedGrid
                    items={itemsForGrid}
                    onItemClick={(item) => setSelectedItem(item)}
                    showAddButton={!isVariantCat}
                    isSalad={getCategoryName(category).includes('سلطات') || getCategoryName(category).toLowerCase().includes('salad')}
                  />
                );
              })()}
            </section>
          );
        })}
      </div>

      {/* Item Details Dialog - Next Level Artisan Redesign */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-obsidian/40"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-xl w-full max-h-[90vh] overflow-y-auto bg-cream rounded-[2.5rem] shadow-[0_32px_128px_rgba(0,0,0,0.3)] border border-gold/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header/Image */}
            <div className="relative h-[250px] sm:h-[350px] w-full overflow-hidden">
              <button
                type="button"
                className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-full text-obsidian hover:bg-gold-DEFAULT hover:text-white transition-all duration-300 z-10 shadow-sm"
                onClick={() => setSelectedItem(null)}
              >
                ✕
              </button>
              {selectedItem.image_url ? (
                <Image
                  src={selectedItem.image_url}
                  alt={selectedItem.name_ar}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-cream-50 flex flex-col items-center justify-center gap-2 text-obsidian/20">
                  <ImageOff size={48} strokeWidth={1} className="text-gold-DEFAULT/40" />
                  <span className="text-xs tracking-widest uppercase">{t('no_image')}</span>
                </div>
              )}
              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-transparent opacity-80" />
            </div>

            <div className="relative -mt-10 px-6 sm:px-10 pb-10 space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
                <div className="text-center sm:text-right flex-1">
                  {(() => {
                    const name =
                      locale === 'he'
                        ? selectedItem.name_he || selectedItem.name_ar
                        : locale === 'en'
                        ? selectedItem.name_en || selectedItem.name_ar
                        : selectedItem.name_ar;
                    return (
                      <h2 className="text-3xl font-black text-obsidian leading-tight">
                        <span lang="ar">{name}</span>
                      </h2>
                    );
                  })()}
                  {locale === 'ar' && selectedItem.name_he && (
                    <p className="text-obsidian/40 text-sm mt-1 font-heebo" dir="rtl">
                      {selectedItem.name_he}
                    </p>
                  )}
                </div>
                <div className="bg-white/80 backdrop-blur-sm border-2 border-gold/20 px-5 py-2.5 rounded-2xl flex flex-col items-center shadow-sm">
                   <div className="flex items-baseline gap-1">
                     <span className="text-2xl font-black text-obsidian leading-none">{selectedItem.price}</span>
                     <span className="text-xs font-bold text-gold-dark uppercase tracking-tighter">₪</span>
                   </div>
                </div>
              </div>

              {selectedItem.desc_ar || selectedItem.desc_he || selectedItem.desc_en ? (
                <div className="text-sm sm:text-base leading-relaxed text-obsidian/70 text-right font-medium">
                  {(() => {
                    const desc =
                      locale === 'he'
                        ? selectedItem.desc_he || selectedItem.desc_ar
                        : locale === 'en'
                        ? selectedItem.desc_en || selectedItem.desc_ar
                        : selectedItem.desc_ar;
                    return desc ? <p lang="ar">{desc}</p> : null;
                  })()}
                </div>
              ) : null}

              {/* Artisan Section Divider */}
              <div className="h-px w-full bg-gold/10" />

              {/* Variants Section */}
              {(() => {
                const categoryForItem = mergedCategories.find((cat) =>
                  (cat.menu_items ?? []).some((i) => i.id === selectedItem.id),
                );
                if (!categoryForItem || !isVariantCategory(categoryForItem)) return null;

                const allItemsInCategory = (categoryForItem.menu_items ?? []).filter((i) => i.is_available);
                const baseName = selectedItem.name_ar.replace(/\((.+)\)\s*$/, '').trim();

                const itemsForBase = allItemsInCategory.filter((i) => 
                  i.name_ar.replace(/\((.+)\)\s*$/, '').trim() === baseName
                );

                if (itemsForBase.length === 0) return null;

                return (
                  <div className="space-y-4">
                    <p className="text-xs font-bold tracking-[0.2em] text-gold-dark/70 uppercase text-center">{t('optional_note')}</p>
                    <VariantGrid
                      items={itemsForBase}
                      onAdded={(info) => setLastAdded(info)}
                    />
                  </div>
                );
              })()}

              {/* Quantity Selection for Unit items */}
              {(() => {
                const categoryForItem = mergedCategories.find((cat) =>
                  (cat.menu_items ?? []).some((i) => i.id === selectedItem.id),
                );
                if (categoryForItem && isVariantCategory(categoryForItem)) return null;

                const handleAdd = () => {
                  const safeQty = Math.max(1, quantity || 1);
                  addItem(
                    {
                      id: selectedItem.id,
                      name_ar: selectedItem.name_ar,
                      name_he: selectedItem.name_he,
                      name_en: selectedItem.name_en,
                      price: selectedItem.price,
                    },
                    safeQty,
                  );
                  setLastAdded({ name: selectedItem.name_ar, price: selectedItem.price * safeQty });
                  setSelectedItem(null);
                };

                return (
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gold/10 shadow-sm">
                      <button
                        type="button"
                        className="w-10 h-10 flex items-center justify-center text-obsidian bg-cream-100 hover:bg-gold-DEFAULT hover:text-white rounded-xl transition-all font-black text-lg"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (Number.isNaN(val) || val <= 0) setQuantity(1);
                          else setQuantity(Math.floor(val));
                        }}
                        className="w-16 text-center font-black text-xl text-obsidian bg-transparent focus:outline-none"
                      />
                      <button
                        type="button"
                        className="w-10 h-10 flex items-center justify-center text-obsidian bg-cream-100 hover:bg-gold-DEFAULT hover:text-white rounded-xl transition-all font-black text-lg"
                        onClick={() => setQuantity((q) => q + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleAdd}
                      className="w-full sm:w-auto px-10 py-4 text-sm font-black rounded-2xl bg-gold-dark text-white hover:bg-gold-DEFAULT transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <span lang="ar">إضافة إلى السلة</span>
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {lastAdded && (
        <div className="fixed top-20 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
          <div className="glass-card border border-gold/30 bg-obsidian-50/95 px-4 py-3 text-xs sm:text-sm text-cream/90 flex items-center gap-2 pointer-events-auto">
            <span className="inline-block w-2 h-2 rounded-full bg-gold-DEFAULT" />
            <span lang="ar">
              تم إضافة
              {' '}
              <span className="font-semibold">{lastAdded.name}</span>
              {' '}
              إلى السلة
            </span>
            <span className="text-gold-DEFAULT text-[11px] sm:text-xs">
              {lastAdded.price} ₪
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
