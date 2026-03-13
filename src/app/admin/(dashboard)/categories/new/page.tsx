import { redirect } from 'next/navigation';
import { createCategory } from '@/lib/actions/categories';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'New Category' };

export default function NewCategoryPage() {
  async function handleCreate(formData: FormData) {
    'use server';
    await createCategory({
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
          <h1 className="text-2xl font-bold text-cream/90">New Category</h1>
          <p className="text-cream/40 text-sm mt-0.5">Add a new menu section</p>
        </div>
      </div>

      <form action={handleCreate} className="glass-card p-6 space-y-5">
        <div className="grid grid-cols-1 gap-4">
          <Field label="Arabic Name *" name="name_ar" required dir="rtl" placeholder="مثلاً: وجبات رئيسية" />
          <Field label="Hebrew Name" name="name_he" dir="rtl" placeholder="מנות עיקריות" />
          <Field label="English Name" name="name_en" placeholder="e.g. Main Dishes" />
          <Field label="Sort Order" name="sort_order" type="number" placeholder="0" />
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-cream/50 mb-2">Status</label>
          <select name="is_active" className="w-full bg-obsidian-200 border border-gold/15 px-4 py-3 text-sm text-cream/80 outline-none focus:border-gold/50">
            <option value="true">Active (visible on website)</option>
            <option value="false">Hidden</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-gold px-6 py-3 text-sm font-bold tracking-widest rounded-sm uppercase">
            Create Category
          </button>
          <Link href="/admin/categories" className="btn-outline-gold px-6 py-3 text-sm font-semibold tracking-widest rounded-sm uppercase text-center">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, type = 'text', placeholder, required, dir }: {
  label: string; name: string; type?: string; placeholder?: string; required?: boolean; dir?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-widest uppercase text-cream/50 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        dir={dir}
        className="w-full bg-obsidian-200 border border-gold/15 hover:border-gold/35 focus:border-gold/50 px-4 py-3 text-sm text-cream/80 placeholder:text-cream/20 outline-none transition-all duration-300"
      />
    </div>
  );
}
