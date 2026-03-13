import { notFound } from 'next/navigation';
import { getMenuItemById, updateMenuItem, uploadMenuImage, deleteMenuImage, createMenuItem } from '@/lib/actions/menu-items';
import { getCategories } from '@/lib/actions/categories';
import { getSupabaseAdmin } from '@/lib/supabase';
import MenuItemForm from '@/components/admin/MenuItemForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Edit Menu Item' };

function baseNameFrom(nameAr: string) {
  const m = nameAr.match(/^(.*)\((.+)\)\s*$/);
  return (m ? m[1] : nameAr).trim();
}

export default async function EditMenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, categories] = await Promise.all([
    getMenuItemById(id).catch(() => null),
    getCategories().catch(() => []),
  ]);
  if (!item) notFound();

  const db = getSupabaseAdmin();

  const { data: siblings } = await db
    .from('menu_items')
    .select('*')
    .eq('category_id', item.category_id);

  const baseName = baseNameFrom(item.name_ar);
  const groupItems = (siblings ?? []).filter((row) => baseNameFrom(row.name_ar) === baseName);

  const labels = groupItems
    .map((it) => it.name_ar.match(/\((.+)\)\s*$/)?.[1].trim())
    .filter((v): v is string => !!v);

  const sizeLabels = new Set(['صغير', 'وسط', 'كبير', 'كبير جداً']);
  const typeLabels = new Set(['كيلو عجين', 'كيلو مقلي', 'عجين', 'مقلي']);

  let initialVariantMode: 'none' | 'size' | 'type' | 'unit' = 'none';
  if (labels.some((l) => sizeLabels.has(l))) initialVariantMode = 'size';
  else if (labels.some((l) => typeLabels.has(l))) initialVariantMode = 'type';

  async function handleUpdate(formData: FormData) {
    'use server';
    let imageUrl: string | null = item.image_url;
    const db = getSupabaseAdmin();

    const imageFile = formData.get('image_file') as File | null;
    const existingUrl = formData.get('existing_image_url') as string | null;

    if (imageFile && imageFile.size > 0) {
      // Delete old image if exists
      if (item.image_url) await deleteMenuImage(item.image_url).catch(() => {});
      const uploadData = new FormData();
      uploadData.set('file', imageFile);
      imageUrl = await uploadMenuImage(uploadData);
    } else if (!existingUrl && item.image_url) {
      // Image was removed
      await deleteMenuImage(item.image_url).catch(() => {});
      imageUrl = null;
    }

    const variantMode = (formData.get('variant_mode') as 'none' | 'size' | 'type' | 'unit' | null) ?? 'none';

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

    // Find all items that belong to this base dish in the same category
    const { data: siblingsForUpdate, error: siblingsError } = await db
      .from('menu_items')
      .select('id, name_ar')
      .eq('category_id', item.category_id);
    if (siblingsError) throw new Error(siblingsError.message);

    const currentBase = (() => {
      const m = item.name_ar.match(/^(.*)\((.+)\)\s*$/);
      return (m ? m[1] : item.name_ar).trim();
    })();

    const groupIds =
      siblingsForUpdate
        ?.filter((row) => {
          const m = row.name_ar.match(/^(.*)\((.+)\)\s*$/);
          const b = (m ? m[1] : row.name_ar).trim();
          return b === currentBase;
        })
        .map((row) => row.id) ?? [];

    if (variantMode === 'size' || variantMode === 'type') {
      // When switching to size/type pricing, remove all existing variants for this base dish
      if (groupIds.length) {
        await db.from('menu_items').delete().in('id', groupIds);
      }

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
      }
    } else {
      // Single price / per unit:
      // Remove other variants for this base dish so future edits detect this as a single-price dish.
      const idsToDelete = groupIds.filter((gid) => gid !== id);
      if (idsToDelete.length) {
        await db.from('menu_items').delete().in('id', idsToDelete);
      }

      // Then update the current item to the clean base name with single/unit price.
      await updateMenuItem(id, {
        ...common,
        name_ar: baseNameAr,
        name_he: baseNameHe,
        name_en: baseNameEn,
        price: Number(formData.get('price')),
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/menu" className="text-cream/40 hover:text-cream/70 transition-colors">
          <ArrowLeft size={16} strokeWidth={1.5} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-cream/90">Edit Menu Item</h1>
          <p className="text-cream/40 text-sm mt-0.5" dir="rtl">
            <span lang="ar">{item.name_ar}</span>
          </p>
        </div>
      </div>
      <div className="glass-card p-6">
        <MenuItemForm
          categories={categories}
          item={item}
          groupItems={groupItems}
          initialVariantMode={initialVariantMode}
          onSubmit={handleUpdate}
        />
      </div>
    </div>
  );
}
