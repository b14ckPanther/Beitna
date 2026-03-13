import Link from 'next/link';
import Image from 'next/image';
import { getMenuItems } from '@/lib/actions/menu-items';
import { getCategories } from '@/lib/actions/categories';
import { deleteMenuItem } from '@/lib/actions/menu-items';
import type { MenuItem } from '@/lib/supabase';
import DeleteButton from '@/components/admin/DeleteButton';
import { Plus, Pencil, ImageOff } from 'lucide-react';

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
    popular: 'bg-orange-400/10 text-orange-400 border-orange-400/20',
    signature: 'bg-gold/10 text-gold-DEFAULT border-gold/20',
    new: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cream/90">Menu Items</h1>
          <p className="text-cream/40 text-sm mt-1">{grouped.length} items (grouped)</p>
        </div>
        <Link href="/admin/menu/new" className="btn-gold px-5 py-2.5 text-sm font-bold tracking-widest rounded-sm uppercase flex items-center gap-2">
          <Plus size={14} />
          Add Item
        </Link>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <Link
          href="/admin/menu"
          className={`px-3 py-1.5 text-xs font-medium rounded-sm border transition-all ${!catFilter ? 'bg-gold/10 text-gold-DEFAULT border-gold/30' : 'border-gold/10 text-cream/40 hover:border-gold/25 hover:text-cream/60'}`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/admin/menu?cat=${c.id}`}
            className={`px-3 py-1.5 text-xs font-medium rounded-sm border transition-all ${catFilter === c.id ? 'bg-gold/10 text-gold-DEFAULT border-gold/30' : 'border-gold/10 text-cream/40 hover:border-gold/25 hover:text-cream/60'}`}
            dir="rtl"
          >
            <span lang="ar">{c.name_ar}</span>
          </Link>
        ))}
      </div>

      {/* Items Grid (grouped by base dish name) */}
      {grouped.length === 0 ? (
        <div className="glass-card text-center py-20">
          <p className="text-cream/30 text-sm">No items found.</p>
          <Link href="/admin/menu/new" className="text-gold-DEFAULT text-sm hover:underline mt-2 inline-block">
            Add your first item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
            <div key={group.baseName} className="glass-card overflow-hidden group">
              {/* Image */}
              <div className="relative aspect-video bg-obsidian-200 border-b border-gold/8 flex items-center justify-center">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.name_ar}
                    fill
                    className="object-contain object-center bg-obsidian-200"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageOff size={20} className="text-cream/10" strokeWidth={1} />
                  </div>
                )}
                {/* Actions overlay */}
                <div className="absolute inset-0 bg-obsidian/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <Link href={`/admin/menu/${item.id}`} className="p-2 bg-obsidian-50 border border-gold/30 text-gold-DEFAULT hover:bg-gold/10 rounded-sm transition-all">
                    <Pencil size={14} strokeWidth={1.5} />
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
                  <span className={`absolute top-2 right-2 text-[9px] font-bold tracking-widest uppercase border px-1.5 py-0.5 ${tagColors[item.tag]}`}>
                    {item.tag}
                  </span>
                )}
                {!item.is_available && (
                  <span className="absolute top-2 left-2 text-[9px] font-bold tracking-widest uppercase border px-1.5 py-0.5 bg-red-400/10 text-red-400 border-red-400/20">
                    Hidden
                  </span>
                )}
              </div>
              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-gold-DEFAULT font-bold">
                    {priceLabel}
                    {hasVariants && <span className="text-cream/35 text-[10px] ml-1">(variants)</span>}
                  </span>
                  <h3 className="text-cream/90 text-sm font-semibold text-right" dir="rtl">
                    <span lang="ar">{group.baseName}</span>
                  </h3>
                </div>
                {item.desc_ar && (
                  <p className="text-cream/35 text-xs text-right line-clamp-2" dir="rtl">
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
