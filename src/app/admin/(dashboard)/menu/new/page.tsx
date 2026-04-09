import { getCategories } from '@/lib/actions/categories';
import { createMenuItem, uploadMenuImage } from '@/lib/actions/menu-items';
import MenuItemForm from '@/components/admin/MenuItemForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'New Menu Item' };

export default async function NewMenuItemPage() {
  const categories = await getCategories().catch(() => []);

  async function handleCreate(formData: FormData) {
    'use server';
    let imageUrl: string | null = null;
    const imageFile = formData.get('image_file') as File | null;
    if (imageFile && imageFile.size > 0) {
      const uploadData = new FormData();
      uploadData.set('file', imageFile);
      imageUrl = await uploadMenuImage(uploadData);
    }
    const variantMode = formData.get('variant_mode') as 'none' | 'size' | 'type' | 'unit' | null;

    const baseNameAr = formData.get('name_ar') as string;
    const baseNameHe = ((formData.get('name_he') as string) || null) ?? null;
    const baseNameEn = ((formData.get('name_en') as string) || null) ?? null;

    const common = {
      category_id: formData.get('category_id') as string,
      desc_ar: ((formData.get('desc_ar') as string) || null) ?? null,
      desc_he: ((formData.get('desc_he') as string) || null) ?? null,
      desc_en: ((formData.get('desc_en') as string) || null) ?? null,
      image_url: imageUrl,
      tag: ((formData.get('tag') as 'popular' | 'signature' | 'new') || null) ?? null,
      is_available: formData.get('is_available') === 'true',
      sort_order: Number(formData.get('sort_order')) || 0,
    };

    if (variantMode === 'size') {
      const sizes = [
        {
          ar: 'صغير',
          he: 'קטן',
          en: 'Small',
          price: Number(formData.get('price_size_small') || 0),
        },
        {
          ar: 'وسط',
          he: 'בינוני',
          en: 'Medium',
          price: Number(formData.get('price_size_medium') || 0),
        },
        {
          ar: 'كبير',
          he: 'גדול',
          en: 'Large',
          price: Number(formData.get('price_size_large') || 0),
        },
        {
          ar: 'كبير جداً',
          he: 'גדול מאוד',
          en: 'X-Large',
          price: Number(formData.get('price_size_xlarge') || 0),
        },
      ].filter((s) => s.price > 0);

      for (const s of sizes) {
        await createMenuItem({
          ...common,
          name_ar: `${baseNameAr} (${s.ar})`,
          name_he: baseNameHe ? `${baseNameHe} (${s.he})` : null,
          name_en: baseNameEn ? `${baseNameEn} (${s.en})` : null,
          price: s.price,
        });
      }
    } else if (variantMode === 'type') {
      const rawPrice = Number(formData.get('price_type_raw') || 0);
      const cookedPrice = Number(formData.get('price_type_cooked') || 0);

      if (rawPrice > 0) {
        await createMenuItem({
          ...common,
          name_ar: `${baseNameAr} (عجين)`,
          name_he: baseNameHe ? `${baseNameHe} (בצק)` : null,
          name_en: baseNameEn ? `${baseNameEn} (Dough)` : null,
          price: rawPrice,
        });
      }

      if (cookedPrice > 0) {
        await createMenuItem({
          ...common,
          name_ar: `${baseNameAr} (مقلي)`,
          name_he: baseNameHe ? `${baseNameHe} (מטוגן)` : null,
          name_en: baseNameEn ? `${baseNameEn} (Fried)` : null,
          price: cookedPrice,
        });
      }
    } else {
      // single price / per unit
      await createMenuItem({
        ...common,
        category_id: formData.get('category_id') as string,
        name_ar: baseNameAr,
        name_he: baseNameHe,
        name_en: baseNameEn,
        price: Number(formData.get('price')),
      });
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/menu" className="p-2 bg-white border border-gold/20 text-gold-dark hover:bg-gold-dark hover:text-white transition-all rounded-full shadow-sm">
          <ArrowLeft size={18} strokeWidth={2.5} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-obsidian tracking-tight">New Menu Item</h1>
          <p className="text-obsidian/40 text-sm mt-0.5">Craft a new culinary masterpiece for the menu</p>
        </div>
      </div>
      <div className="bg-white border border-gold/10 p-8 shadow-sm rounded-sm">
        <MenuItemForm categories={categories} onSubmit={handleCreate} />
      </div>
    </div>
  );
}
