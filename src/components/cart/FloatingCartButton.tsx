'use client';

import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { cn } from '@/lib/utils';

export default function FloatingCartButton() {
  const { items, totalItems, totalPrice } = useCart();
  const locale = useLocale();
  const pathname = usePathname();

  const label = useMemo(() => {
    if (!totalItems) return '';
    const itemWord =
      locale === 'he'
        ? 'מוצרים'
        : locale === 'en'
        ? 'items'
        : 'أطباق';
    return `${totalItems} ${itemWord} • ${totalPrice.toFixed(0)} ₪`;
  }, [totalItems, totalPrice, locale]);

  // Hide when cart is empty or when we're already on the cart page
  if (!items.length || pathname.endsWith('/cart')) return null;

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <Link
        href="/cart"
        className={cn(
          'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-full shadow-lg',
          'bg-obsidian-50/95 border border-gold/40 backdrop-blur-md',
          'hover:bg-gold-DEFAULT hover:text-obsidian transition-colors duration-200',
        )}
      >
        <div className="relative">
          <ShoppingBag size={18} className="text-gold-DEFAULT group-hover:text-obsidian" />
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-gold-DEFAULT text-obsidian text-[10px] font-bold flex items-center justify-center">
            {totalItems}
          </span>
        </div>
        <div className="flex flex-col text-xs text-right">
          <span className="font-semibold" lang={locale === 'ar' ? 'ar' : undefined}>
            {locale === 'he'
              ? 'צפייה בסל'
              : locale === 'en'
              ? 'View cart'
              : 'عرض السلة'}
          </span>
          <span className="text-cream/60 text-[11px]" lang={locale === 'ar' ? 'ar' : undefined}>
            {label}
          </span>
        </div>
      </Link>
    </div>
  );
}


