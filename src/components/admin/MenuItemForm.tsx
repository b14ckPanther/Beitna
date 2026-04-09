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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: Image upload */}
        <div className="space-y-4">
          <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-obsidian/40">
            Dish Visual <span className="text-obsidian/20">(High Resolution)</span>
          </label>
          <div
            className="relative aspect-square bg-gray-50 border-2 border-dashed border-gold/20 hover:border-gold/40 transition-all cursor-pointer overflow-hidden rounded-sm group flex items-center justify-center shadow-inner"
            onClick={() => fileRef.current?.click()}
          >
            {imagePreview ? (
              <>
                <Image src={imagePreview} alt="Preview" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-obsidian/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <Upload size={24} className="text-white" strokeWidth={2.5} />
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setImagePreview(null); setImageFile(null); }}
                  className="absolute top-3 right-3 p-1.5 bg-white/90 border border-red-100 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all z-10 shadow-lg"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-obsidian/10">
                <div className="p-4 bg-white rounded-full shadow-sm">
                  <ImageOff size={32} strokeWidth={1} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Tap to Upload</span>
                <span className="text-[9px] text-obsidian/20">Artisan Visuals Recommended</span>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          <p className="text-obsidian/20 text-[10px] text-center font-medium italic">Landscape aspect ratio preferred</p>
        </div>

        {/* Right: Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category */}
          <div>
            <label className="block text-[10px] font-black tracking-[0.15em] uppercase text-obsidian/40 mb-2">Category Selection *</label>
            <select name="category_id" required defaultValue={item?.category_id ?? ''} className="w-full bg-white border border-gold/15 hover:border-gold/35 focus:border-gold-dark px-4 py-3.5 text-sm text-obsidian font-medium outline-none transition-all shadow-sm rounded-sm appearance-none">
              <option value="">Choose a culinary category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name_ar} {c.name_en ? `/ ${c.name_en}` : ''}</option>
              ))}
            </select>
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 gap-4">
            <F
              label="Arabic Nomenclature *"
              name="name_ar"
              required
              dir="rtl"
              defaultValue={stripVariant(item?.name_ar)}
              placeholder="مثلاً: كبة مقلية"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <F
                label="Hebrew Title"
                name="name_he"
                dir="rtl"
                defaultValue={stripVariant(item?.name_he ?? '')}
                placeholder="קובּה מטוגנת"
              />
              <F
                label="English Descriptor"
                name="name_en"
                defaultValue={stripVariant(item?.name_en ?? '')}
                placeholder="Fried Kebbe"
              />
            </div>
          </div>

          {/* Pricing mode, price fields & tag */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-black tracking-[0.15em] uppercase text-obsidian/40 mb-2">
                Pricing Strategy
              </label>
              <select
                name="variant_mode"
                value={variantMode}
                onChange={(e) => setVariantMode(e.target.value as typeof variantMode)}
                className="w-full bg-white border border-gold/15 hover:border-gold/35 focus:border-gold-dark px-3 py-3.5 text-sm text-obsidian font-medium outline-none transition-all shadow-sm rounded-sm"
              >
                <option value="none">Fixed Individual</option>
                <option value="size">Tiered Sizes (4)</option>
                <option value="type">Raw / Prepared (2)</option>
                <option value="unit">Per Signature Unit</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black tracking-[0.15em] uppercase text-obsidian/40 mb-2">Menu Tag</label>
              <select
                name="tag"
                defaultValue={item?.tag ?? ''}
                className="w-full bg-white border border-gold/15 hover:border-gold/35 focus:border-gold-dark px-3 py-3.5 text-sm text-obsidian font-medium outline-none transition-all shadow-sm rounded-sm"
              >
                <option value="">No Tag</option>
                <option value="popular">Popular Highlight</option>
                <option value="signature">Beitna Signature</option>
                <option value="new">Seasonal New</option>
              </select>
            </div>
            <F label="Archive Sort" name="sort_order" type="number" defaultValue={String(item?.sort_order ?? 0)} />
          </div>

          {/* Price Fields */}
          {variantMode === 'none' || variantMode === 'unit' ? (
            <div className="grid grid-cols-1 gap-4">
              <F
                label={variantMode === 'unit' ? 'Unit Valuation (₪) *' : 'Base Price (₪) *'}
                name="price"
                type="number"
                required
                defaultValue={String(item?.price ?? '')}
                placeholder="0"
              />
            </div>
          ) : null}

          {variantMode === 'size' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <F label="Small (₪)" name="price_size_small" type="number" defaultValue={sizeDefaults.small} placeholder="0" />
              <F label="Medium (₪)" name="price_size_medium" type="number" defaultValue={sizeDefaults.medium} placeholder="0" />
              <F label="Large (₪)" name="price_size_large" type="number" defaultValue={sizeDefaults.large} placeholder="0" />
              <F label="X-Large (₪)" name="price_size_xlarge" type="number" defaultValue={sizeDefaults.xlarge} placeholder="0" />
            </div>
          )}

          {variantMode === 'type' && (
            <div className="grid grid-cols-2 gap-4">
              <F label="Artisan Raw (₪)" name="price_type_raw" type="number" defaultValue={typeDefaults.raw} placeholder="0" />
              <F label="Chef Prepared (₪)" name="price_type_cooked" type="number" defaultValue={typeDefaults.cooked} placeholder="0" />
            </div>
          )}

          {/* Availability */}
          <div>
            <label className="block text-[10px] font-black tracking-[0.15em] uppercase text-obsidian/40 mb-2">Display Visibility</label>
            <select name="is_available" defaultValue={String(item?.is_available ?? true)} className="w-full bg-white border border-gold/15 px-4 py-3.5 text-sm text-obsidian font-medium outline-none focus:border-gold-dark shadow-sm rounded-sm">
              <option value="true">Visible on Virtual Menu</option>
              <option value="false">Hidden from Public View</option>
            </select>
          </div>
        </div>
      </div>

      {/* Descriptions */}
      <div className="grid grid-cols-1 gap-4 bg-gray-50/50 p-6 rounded-sm border border-gold/10 shadow-inner">
        <T label="Arabic Narrative Details" name="desc_ar" dir="rtl" defaultValue={item?.desc_ar ?? ''} placeholder="اوصف الطبق بأسلوب شهي..." />
        <T label="Hebrew Narrative Details" name="desc_he" dir="rtl" defaultValue={item?.desc_he ?? ''} placeholder="תיאור המנה בצורה מעוררת תיאבון..." />
        <T label="English Narrative Details" name="desc_en" defaultValue={item?.desc_en ?? ''} placeholder="Describe this dish in a tempting way..." />
      </div>

      {error && (
        <p className="text-red-700 text-xs font-bold font-mono bg-red-50 border border-red-200 px-5 py-4 flex items-center gap-2">
          <Loader2 size={14} className="rotate-45" /> {error}
        </p>
      )}

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="btn-gold px-10 py-4 text-xs font-black tracking-[0.2em] rounded-sm uppercase flex items-center justify-center gap-2 disabled:opacity-60 shadow-xl hover:scale-[1.02] transition-transform flex-1 md:flex-none"
        >
          {submitting && <Loader2 size={14} className="animate-spin" />}
          {item ? 'Commit Variations' : 'Craft New Entry'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline-gold px-8 py-4 text-xs font-black tracking-[0.2em] rounded-sm uppercase transition-all flex-1 md:flex-none">
          Discard
        </button>
      </div>
    </form>
  );
}

function F({ label, name, type = 'text', required, dir, defaultValue, placeholder }: {
  label: string; name: string; type?: string; required?: boolean; dir?: string; defaultValue?: string; placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-black tracking-[0.15em] uppercase text-obsidian/40">{label}</label>
      <input type={type} name={name} required={required} dir={dir} defaultValue={defaultValue} placeholder={placeholder}
        className="w-full bg-white border border-gold/15 hover:border-gold/35 focus:border-gold-dark px-4 py-3.5 text-sm text-obsidian font-medium placeholder:text-obsidian/10 outline-none transition-all duration-300 shadow-sm rounded-sm" />
    </div>
  );
}

function T({ label, name, dir, defaultValue, placeholder }: {
  label: string; name: string; dir?: string; defaultValue?: string; placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-black tracking-[0.15em] uppercase text-obsidian/40">{label}</label>
      <textarea name={name} dir={dir} defaultValue={defaultValue} placeholder={placeholder} rows={2}
        className="w-full bg-white border border-gold/15 hover:border-gold/35 focus:border-gold-dark px-4 py-3.5 text-sm text-obsidian font-medium placeholder:text-obsidian/10 outline-none transition-all duration-300 shadow-sm rounded-sm resize-none" />
    </div>
  );
}
