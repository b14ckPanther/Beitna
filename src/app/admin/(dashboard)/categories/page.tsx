import Link from 'next/link';
import { getCategories, deleteCategory } from '@/lib/actions/categories';
import { Plus, Pencil, GripVertical, ToggleLeft, ToggleRight } from 'lucide-react';
import DeleteButton from '@/components/admin/DeleteButton';

export const metadata = { title: 'Categories' };

export default async function CategoriesPage() {
  const categories = await getCategories().catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cream/90">Menu Categories</h1>
          <p className="text-cream/40 text-sm mt-1">{categories.length} categories total</p>
        </div>
        <Link href="/admin/categories/new" className="btn-gold px-5 py-2.5 text-sm font-bold tracking-widest rounded-sm uppercase flex items-center gap-2">
          <Plus size={14} />
          Add Category
        </Link>
      </div>

      <div className="glass-card overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-cream/30 text-sm">No categories yet.</p>
            <Link href="/admin/categories/new" className="text-gold-DEFAULT text-sm hover:underline mt-2 inline-block">
              Add your first category
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold/10 text-cream/40 text-xs">
                <th className="text-left p-4 font-medium w-8"></th>
                <th className="text-left p-4 font-medium">Arabic Name</th>
                <th className="text-left p-4 font-medium">Hebrew</th>
                <th className="text-left p-4 font-medium">English</th>
                <th className="text-left p-4 font-medium">Order</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-gold/5 last:border-0 hover:bg-white/2 transition-colors">
                  <td className="p-4 text-cream/20">
                    <GripVertical size={14} />
                  </td>
                  <td className="p-4">
                    <span className="text-cream/90 font-medium" dir="rtl">
                      <span lang="ar">{cat.name_ar}</span>
                    </span>
                  </td>
                  <td className="p-4 text-cream/50" dir="rtl">
                    {cat.name_he ?? '—'}
                  </td>
                  <td className="p-4 text-cream/50">{cat.name_en ?? '—'}</td>
                  <td className="p-4 text-cream/40 font-mono">{cat.sort_order}</td>
                  <td className="p-4">
                    {cat.is_active ? (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                        <ToggleRight size={14} /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-red-400/60">
                        <ToggleLeft size={14} /> Hidden
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/categories/${cat.id}`}
                        className="p-2 text-cream/40 hover:text-gold-DEFAULT hover:bg-gold/5 rounded-sm transition-all duration-200"
                      >
                        <Pencil size={13} strokeWidth={1.5} />
                      </Link>
                      <DeleteButton
                        action={async () => {
                          'use server';
                          await deleteCategory(cat.id);
                        }}
                        confirmMessage={`Delete "${cat.name_ar}"?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
