'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, X, ImageOff, Loader2 } from 'lucide-react';
import type { MenuCategory, MenuItem } from '@/lib/supabase';

type Props = {
  categories: MenuCategory[];
  item?: MenuItem;
  groupItems?: MenuItem[];
  initialVariantMode?: 'none' | 'size' | 'type' | 'unit';
  onSubmit: (data: FormData) => Promise<void>;
};

export default function MenuItemForm({ categories, item, groupItems, initialVariantMode, onSubmit }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(item?.image_url ?? null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [variantMode, setVariantMode] = useState<'none' | 'size' | 'type' | 'unit'>(initialVariantMode ?? 'none');

  const stripVariant = (value?: string | null) => {
    if (!value) return '';
    const m = value.match(/^(.*)\((.+)\)\s*$/);
    return (m ? m[1] : value).trim();
  };

  const allForGroup = groupItems && groupItems.length > 0 ? groupItems : item ? [item] : [];
  const sizeDefaults: Record<'small' | 'medium' | 'large' | 'xlarge', string> = {
    small: '',
    medium: '',
    large: '',
    xlarge: '',
  };
  const typeDefaults: Record<'raw' | 'cooked', string> = {
    raw: '',
    cooked: '',
  };

  for (const it of allForGroup) {
    const m = it.name_ar.match(/\((.+)\)\s*$/);
    const label = m?.[1].trim();
    switch (label) {
      case 'صغير':
        sizeDefaults.small = String(it.price);
        break;
      case 'وسط':
        sizeDefaults.medium = String(it.price);
        break;
      case 'كبير':
        sizeDefaults.large = String(it.price);
        break;
      case 'كبير جداً':
        sizeDefaults.xlarge = String(it.price);
        break;
      case 'كيلو عجين':
      case 'عجين':
        typeDefaults.raw = String(it.price);
        break;
      case 'كيلو مقلي':
      case 'مقلي':
        typeDefaults.cooked = String(it.price);
        break;
      default:
        break;
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const formData = new FormData(e.currentTarget);
      if (imageFile) formData.set('image_file', imageFile);
      if (item?.image_url && !imageFile) formData.set('existing_image_url', item.image_url);
      await onSubmit(formData);
      const categoryId = formData.get('category_id') as string | null;
      if (categoryId) {
        router.push(`/admin/menu?cat=${categoryId}`);
      } else {
        router.push('/admin/menu');
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Image upload */}
        <div className="space-y-4">
          <label className="block text-xs font-semibold tracking-widest uppercase text-cream/50">
            Dish Image <span className="text-cream/25">(optional)</span>
          </label>
          <div
            className="relative aspect-square bg-obsidian-200 border-2 border-dashed border-gold/20 hover:border-gold/40 transition-colors cursor-pointer overflow-hidden rounded-sm group flex items-center justify-center"
            onClick={() => fileRef.current?.click()}
          >
            {imagePreview ? (
              <>
                <Image src={imagePreview} alt="Preview" fill className="object-contain object-center bg-obsidian-200" />
                <div className="absolute inset-0 bg-obsidian/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload size={20} className="text-gold-DEFAULT" strokeWidth={1.5} />
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setImagePreview(null); setImageFile(null); }}
                  className="absolute top-2 right-2 p-1 bg-obsidian-50 border border-red-400/30 text-red-400 rounded-sm hover:bg-red-400/10 transition-all z-10"
                >
                  <X size={12} />
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-cream/20">
                <ImageOff size={28} strokeWidth={1} />
                <span className="text-xs">Click to upload image</span>
                <span className="text-[10px]">JPG, PNG, WEBP</span>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          <p className="text-cream/25 text-xs text-center">Recommended: 800×600px</p>
        </div>

        {/* Right: Fields */}
        <div className="lg:col-span-2 space-y-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-cream/50 mb-2">Category *</label>
            <select name="category_id" required defaultValue={item?.category_id ?? ''} className="w-full bg-obsidian-200 border border-gold/15 hover:border-gold/35 focus:border-gold/50 px-4 py-3 text-sm text-cream/80 outline-none transition-all">
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name_ar} {c.name_en ? `/ ${c.name_en}` : ''}</option>
              ))}
            </select>
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 gap-3">
            <F
              label="Arabic Name *"
              name="name_ar"
              required
              dir="rtl"
              defaultValue={stripVariant(item?.name_ar)}
              placeholder="اسم الطبق"
            />
            <F
              label="Hebrew Name"
              name="name_he"
              dir="rtl"
              defaultValue={stripVariant(item?.name_he ?? '')}
              placeholder="שם המנה"
            />
            <F
              label="English Name"
              name="name_en"
              defaultValue={stripVariant(item?.name_en ?? '')}
              placeholder="Dish name"
            />
          </div>

          {/* Pricing mode, price fields & tag */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-cream/50 mb-2">
                Pricing Mode
              </label>
              <select
                name="variant_mode"
                value={variantMode}
                onChange={(e) => setVariantMode(e.target.value as typeof variantMode)}
                className="w-full bg-obsidian-200 border border-gold/15 hover:border-gold/35 focus:border-gold/50 px-3 py-3 text-sm text-cream/80 outline-none transition-all"
              >
                <option value="none">Single price</option>
                <option value="size">Sizes (4)</option>
                <option value="type">Types (2)</option>
                <option value="unit">Per unit</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-cream/50 mb-2">Tag</label>
              <select
                name="tag"
                defaultValue={item?.tag ?? ''}
                className="w-full bg-obsidian-200 border border-gold/15 hover:border-gold/35 focus:border-gold/50 px-3 py-3 text-sm text-cream/80 outline-none transition-all"
              >
                <option value="">None</option>
                <option value="popular">Popular</option>
                <option value="signature">Signature</option>
                <option value="new">New</option>
              </select>
            </div>
            <F label="Sort Order" name="sort_order" type="number" defaultValue={String(item?.sort_order ?? 0)} />
          </div>

          {/* Price Fields */}
          {variantMode === 'none' || variantMode === 'unit' ? (
            <div className="grid grid-cols-1 gap-3">
              <F
                label={variantMode === 'unit' ? 'Price per unit (₪) *' : 'Price (₪) *'}
                name="price"
                type="number"
                required
                defaultValue={String(item?.price ?? '')}
                placeholder="0"
              />
            </div>
          ) : null}

          {variantMode === 'size' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <F label="Small (₪)" name="price_size_small" type="number" defaultValue={sizeDefaults.small} placeholder="0" />
              <F label="Medium (₪)" name="price_size_medium" type="number" defaultValue={sizeDefaults.medium} placeholder="0" />
              <F label="Large (₪)" name="price_size_large" type="number" defaultValue={sizeDefaults.large} placeholder="0" />
              <F label="X-Large (₪)" name="price_size_xlarge" type="number" defaultValue={sizeDefaults.xlarge} placeholder="0" />
            </div>
          )}

          {variantMode === 'type' && (
            <div className="grid grid-cols-2 gap-3">
              <F label="Dough / Raw (₪)" name="price_type_raw" type="number" defaultValue={typeDefaults.raw} placeholder="0" />
              <F label="Fried / Cooked (₪)" name="price_type_cooked" type="number" defaultValue={typeDefaults.cooked} placeholder="0" />
            </div>
          )}

          {/* Availability */}
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-cream/50 mb-2">Availability</label>
            <select name="is_available" defaultValue={String(item?.is_available ?? true)} className="w-full bg-obsidian-200 border border-gold/15 px-4 py-3 text-sm text-cream/80 outline-none focus:border-gold/50">
              <option value="true">Available (shown on menu)</option>
              <option value="false">Unavailable (hidden)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Descriptions */}
      <div className="grid grid-cols-1 gap-4">
        <T label="Arabic Description" name="desc_ar" dir="rtl" defaultValue={item?.desc_ar ?? ''} placeholder="وصف الطبق بالعربية..." />
        <T label="Hebrew Description" name="desc_he" dir="rtl" defaultValue={item?.desc_he ?? ''} placeholder="תיאור המנה בעברית..." />
        <T label="English Description" name="desc_en" defaultValue={item?.desc_en ?? ''} placeholder="Dish description in English..." />
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-400/5 border border-red-400/20 px-4 py-3">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="btn-gold px-8 py-3 text-sm font-bold tracking-widest rounded-sm uppercase flex items-center gap-2 disabled:opacity-60"
        >
          {submitting && <Loader2 size={14} className="animate-spin" />}
          {item ? 'Save Changes' : 'Create Item'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline-gold px-6 py-3 text-sm font-semibold tracking-widest rounded-sm uppercase">
          Cancel
        </button>
      </div>
    </form>
  );
}

function F({ label, name, type = 'text', required, dir, defaultValue, placeholder }: {
  label: string; name: string; type?: string; required?: boolean; dir?: string; defaultValue?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-widest uppercase text-cream/50 mb-2">{label}</label>
      <input type={type} name={name} required={required} dir={dir} defaultValue={defaultValue} placeholder={placeholder}
        className="w-full bg-obsidian-200 border border-gold/15 hover:border-gold/35 focus:border-gold/50 px-4 py-3 text-sm text-cream/80 placeholder:text-cream/20 outline-none transition-all duration-300" />
    </div>
  );
}

function T({ label, name, dir, defaultValue, placeholder }: {
  label: string; name: string; dir?: string; defaultValue?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-widest uppercase text-cream/50 mb-2">{label}</label>
      <textarea name={name} dir={dir} defaultValue={defaultValue} placeholder={placeholder} rows={2}
        className="w-full bg-obsidian-200 border border-gold/15 hover:border-gold/35 focus:border-gold/50 px-4 py-3 text-sm text-cream/80 placeholder:text-cream/20 outline-none transition-all duration-300 resize-none" />
    </div>
  );
}
