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
    <div className="max-w-xl space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/categories" className="p-2 bg-white border border-gold/20 text-gold-dark hover:bg-gold-dark hover:text-white transition-all rounded-full shadow-sm">
          <ArrowLeft size={18} strokeWidth={2.5} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-obsidian tracking-tight">New Category</h1>
          <p className="text-obsidian/40 text-sm mt-0.5">Define a new culinary section for the menu</p>
        </div>
      </div>

      <form action={handleCreate} className="bg-white border border-gold/10 p-8 space-y-6 shadow-sm rounded-sm">
        <div className="grid grid-cols-1 gap-6">
          <Field label="Arabic Nomenclature *" name="name_ar" required dir="rtl" placeholder="مثلاً: وجبات رئيسية" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Hebrew Title" name="name_he" dir="rtl" placeholder="מנות עיקריות" />
            <Field label="English Descriptor" name="name_en" placeholder="e.g. Main Dishes" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Display Priority (Order)" name="sort_order" type="number" placeholder="0" />
            <div>
              <label className="block text-[10px] font-black tracking-[0.15em] uppercase text-obsidian/40 mb-2">Visibility Status</label>
              <select name="is_active" className="w-full bg-gray-50 border border-gold/15 px-4 py-3.5 text-sm text-obsidian font-medium outline-none focus:border-gold-dark shadow-sm rounded-sm">
                <option value="true">Active (Visible on Website)</option>
                <option value="false">Hidden from Public View</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="btn-gold px-10 py-4 text-xs font-black tracking-[0.2em] rounded-sm uppercase shadow-xl hover:scale-[1.02] transition-transform">
            Create Category
          </button>
          <Link href="/admin/categories" className="btn-outline-gold px-8 py-4 text-xs font-black tracking-[0.2em] rounded-sm uppercase text-center flex-1 md:flex-none">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, type = 'text', placeholder, required, dir, defaultValue }: {
  label: string; name: string; type?: string; placeholder?: string; required?: boolean; dir?: string; defaultValue?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-black tracking-[0.15em] uppercase text-obsidian/40">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        dir={dir}
        defaultValue={defaultValue}
        className="w-full bg-gray-50 border border-gold/15 hover:border-gold/35 focus:border-gold-dark px-4 py-3.5 text-sm text-obsidian font-medium placeholder:text-obsidian/10 outline-none transition-all duration-300 shadow-sm rounded-sm"
      />
    </div>
  );
}
