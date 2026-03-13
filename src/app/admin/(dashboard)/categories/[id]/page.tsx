import { redirect, notFound } from 'next/navigation';
import { getCategoryById, updateCategory } from '@/lib/actions/categories';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Edit Category' };

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cat = await getCategoryById(id).catch(() => null);
  if (!cat) notFound();

  async function handleUpdate(formData: FormData) {
    'use server';
    await updateCategory(id, {
      name_ar: formData.get('name_ar') as string,
      name_he: (formData.get('name_he') as string) || null,
      name_en: (formData.get('name_en') as string) || null,
      sort_order: Number(formData.get('sort_order')) || 0,
      is_active: formData.get('is_active') === 'true',
    });
    redirect('/admin/categories');
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/categories" className="text-cream/40 hover:text-cream/70 transition-colors">
          <ArrowLeft size={16} strokeWidth={1.5} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-cream/90">Edit Category</h1>
          <p className="text-cream/40 text-sm mt-0.5" dir="rtl">
            <span lang="ar">{cat.name_ar}</span>
          </p>
        </div>
      </div>

      <form action={handleUpdate} className="glass-card p-6 space-y-5">
        <div className="grid grid-cols-1 gap-4">
          <Field label="Arabic Name *" name="name_ar" required dir="rtl" defaultValue={cat.name_ar} />
          <Field label="Hebrew Name" name="name_he" dir="rtl" defaultValue={cat.name_he ?? ''} />
          <Field label="English Name" name="name_en" defaultValue={cat.name_en ?? ''} />
          <Field label="Sort Order" name="sort_order" type="number" defaultValue={String(cat.sort_order)} />
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-cream/50 mb-2">Status</label>
          <select name="is_active" defaultValue={String(cat.is_active)} className="w-full bg-obsidian-200 border border-gold/15 px-4 py-3 text-sm text-cream/80 outline-none focus:border-gold/50">
            <option value="true">Active (visible on website)</option>
            <option value="false">Hidden</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-gold px-6 py-3 text-sm font-bold tracking-widest rounded-sm uppercase">
            Save Changes
          </button>
          <Link href="/admin/categories" className="btn-outline-gold px-6 py-3 text-sm font-semibold tracking-widest rounded-sm uppercase text-center">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, type = 'text', defaultValue, required, dir }: {
  label: string; name: string; type?: string; defaultValue?: string; required?: boolean; dir?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-widest uppercase text-cream/50 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={defaultValue}
        dir={dir}
        className="w-full bg-obsidian-200 border border-gold/15 hover:border-gold/35 focus:border-gold/50 px-4 py-3 text-sm text-cream/80 placeholder:text-cream/20 outline-none transition-all duration-300"
      />
    </div>
  );
}
