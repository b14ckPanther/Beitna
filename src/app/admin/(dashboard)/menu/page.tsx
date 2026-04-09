import Link from 'next/link';
import Image from 'next/image';
import { getMenuItems } from '@/lib/actions/menu-items';
import { getCategories } from '@/lib/actions/categories';
import { deleteMenuItem } from '@/lib/actions/menu-items';
import type { MenuItem } from '@/lib/supabase';
import DeleteButton from '@/components/admin/DeleteButton';
import { Plus, Pencil, ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export const metadata = { title: 'Menu Items' };

function groupByBaseName(items: MenuItem[]) {
  type Group = {
    baseName: string;
    items: MenuItem[];
    representative: MenuItem;
  };

  const groups = new Map<string, Group>();

  const getBaseName = (nameAr: string) => {
    const m = nameAr.match(/^(.*)\((.+)\)\s*$/);
    return (m ? m[1] : nameAr).trim();
  };

  for (const item of items) {
    const base = getBaseName(item.name_ar);
    const existing = groups.get(base);
    if (existing) {
      existing.items.push(item);
      // Keep the one with the smallest sort_order as representative
      if (item.sort_order < existing.representative.sort_order) {
        existing.representative = item;
      }
    } else {
      groups.set(base, { baseName: base, items: [item], representative: item });
    }
  }

  return Array.from(groups.values()).sort(
    (a, b) => a.representative.sort_order - b.representative.sort_order,
  );
}

export default async function MenuItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat: catFilter } = await searchParams;
  const [items, categories] = await Promise.all([
    getMenuItems(catFilter).catch(() => []),
    getCategories().catch(() => []),
  ]);

  const grouped = groupByBaseName(items as unknown as MenuItem[]);

  const tagColors: Record<string, string> = {
    popular: 'bg-amber-50 text-amber-700 border-amber-200',
    signature: 'bg-gold/10 text-gold-dark border-gold/20',
    new: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-obsidian tracking-tight">Menu Items</h1>
          <p className="text-obsidian/40 text-sm mt-1">{grouped.length} artisan dishes listed</p>
        </div>
        <Link href="/admin/menu/new" className="btn-gold px-6 py-3 text-xs font-black tracking-[0.2em] rounded-sm uppercase flex items-center gap-2 shadow-lg hover:scale-[1.02] transition-transform">
          <Plus size={14} strokeWidth={3} />
          Add New Dish
        </Link>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <Link
          href="/admin/menu"
          className={cn(
            "px-4 py-2 text-[10px] font-black rounded-sm border transition-all uppercase tracking-widest",
            !catFilter 
              ? "bg-gold-dark text-white border-gold-dark shadow-md" 
              : "bg-white border-gold/15 text-obsidian/40 hover:bg-gold/5 hover:text-obsidian/60"
          )}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/admin/menu?cat=${c.id}`}
            className={cn(
              "px-4 py-2 text-[10px] font-black rounded-sm border transition-all uppercase tracking-widest",
              catFilter === c.id 
                ? "bg-gold-dark text-white border-gold-dark shadow-md" 
                : "bg-white border-gold/15 text-obsidian/40 hover:bg-gold/5 hover:text-obsidian/60"
            )}
            dir="rtl"
          >
            <span lang="ar">{c.name_ar}</span>
          </Link>
        ))}
      </div>

      {/* Items Grid (grouped by base dish name) */}
      {grouped.length === 0 ? (
        <div className="bg-white border border-gold/10 rounded-sm text-center py-20 shadow-sm">
          <p className="text-obsidian/30 text-sm italic">The pantry is currently empty.</p>
          <Link href="/admin/menu/new" className="text-gold-dark font-bold text-sm hover:underline mt-2 inline-block">
            Craft your first menu item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {grouped.map((group) => {
            const item = group.representative;
            const hasVariants = group.items.length > 1;
            const priceLabel =
              hasVariants
                ? `${Math.min(...group.items.map((i) => i.price))}–${Math.max(
                    ...group.items.map((i) => i.price),
                  )}₪`
                : `${item.price}₪`;
            return (
              <div key={group.baseName} className="bg-white border border-gold/10 shadow-sm hover:shadow-md transition-all duration-300 rounded-sm overflow-hidden group">
                {/* Image */}
                <div className="relative aspect-[4/3] bg-gray-50 border-b border-gold/5 flex items-center justify-center overflow-hidden">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name_ar}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageOff size={24} className="text-obsidian/5" strokeWidth={1} />
                    </div>
                  )}
                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-obsidian/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <Link href={`/admin/menu/${item.id}`} className="p-3 bg-white text-gold-dark hover:bg-gold-dark hover:text-white rounded-full shadow-xl transition-all hover:scale-110">
                      <Pencil size={18} strokeWidth={2} />
                    </Link>
                    <DeleteButton
                      confirmMessage="Are you sure you want to delete this dish and all its variants? This action cannot be undone."
                      action={async () => {
                        'use server';
                        for (const variant of group.items) {
                          await deleteMenuItem(variant.id);
                        }
                      }}
                    />
                  </div>
                  {/* Tag */}
                  {item.tag && (
                    <span className={cn('absolute top-3 right-3 text-[9px] font-black tracking-widest uppercase border px-2 py-0.5 rounded-sm shadow-sm', tagColors[item.tag] || tagColors.signature)}>
                      {item.tag}
                    </span>
                  )}
                  {!item.is_available && (
                    <span className="absolute top-3 left-3 text-[9px] font-black tracking-widest uppercase border px-2 py-0.5 bg-red-50 text-red-700 border-red-200 shadow-sm">
                      Hidden
                    </span>
                  )}
                </div>
                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex flex-col">
                      <span className="text-gold-dark font-black text-lg font-mono">
                        {priceLabel}
                      </span>
                      {hasVariants && <span className="text-obsidian/30 text-[9px] uppercase font-bold tracking-tighter">Multiple Variants</span>}
                    </div>
                    <h3 className="text-obsidian text-base font-black text-right leading-tight" dir="rtl">
                      <span lang="ar">{group.baseName}</span>
                    </h3>
                  </div>
                  {item.desc_ar && (
                    <p className="text-obsidian/40 text-[11px] text-right line-clamp-2 leading-relaxed italic" dir="rtl">
                      <span lang="ar">{item.desc_ar}</span>
                    </p>
                  )}
                </div>
              </div>
            )})}
        </div>
      )}
    </div>
  );
}
