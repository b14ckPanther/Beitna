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
          <h1 className="text-2xl font-black text-obsidian tracking-tight">Menu Categories</h1>
          <p className="text-obsidian/40 text-sm mt-1">{categories.length} culinary sections configured</p>
        </div>
        <Link href="/admin/categories/new" className="btn-gold px-6 py-3 text-xs font-black tracking-[0.2em] rounded-sm uppercase flex items-center gap-2 shadow-lg hover:scale-[1.02] transition-transform">
          <Plus size={14} strokeWidth={3} />
          New Category
        </Link>
      </div>

      <div className="bg-white border border-gold/10 shadow-sm rounded-sm overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-20 bg-gray-50/30">
            <p className="text-obsidian/30 text-sm italic">No categories defined yet.</p>
            <Link href="/admin/categories/new" className="text-gold-dark font-bold text-sm hover:underline mt-2 inline-block">
              Add your first category
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gold/10 text-obsidian/40 text-[10px] uppercase font-bold tracking-[0.15em]">
                  <th className="text-left p-4 font-bold w-12">Rank</th>
                  <th className="text-left p-4 font-bold">Arabic Name</th>
                  <th className="text-left p-4 font-bold">Hebrew</th>
                  <th className="text-left p-4 font-bold">English</th>
                  <th className="text-left p-4 font-bold">Display Priority</th>
                  <th className="text-left p-4 font-bold">Visibility</th>
                  <th className="text-right p-4 font-bold">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gold/[0.02] transition-colors group">
                    <td className="p-4 text-obsidian/10">
                      <GripVertical size={16} />
                    </td>
                    <td className="p-4">
                      <span className="text-obsidian font-black text-base block" dir="rtl">
                        <span lang="ar">{cat.name_ar}</span>
                      </span>
                    </td>
                    <td className="p-4 text-obsidian/50 font-medium" dir="rtl">
                      {cat.name_he ?? '—'}
                    </td>
                    <td className="p-4 text-obsidian/50 font-medium">{cat.name_en ?? '—'}</td>
                    <td className="p-4">
                       <span className="bg-gray-100 text-obsidian/60 font-mono font-bold text-[10px] px-2 py-0.5 rounded-full">
                         {cat.sort_order}
                       </span>
                    </td>
                    <td className="p-4">
                      {cat.is_active ? (
                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-100">
                          <ToggleRight size={14} /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-obsidian/30 bg-gray-50 px-2 py-0.5 rounded-sm border border-gray-100">
                          <ToggleLeft size={14} /> Hidden
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/admin/categories/${cat.id}`}
                          className="p-2 text-obsidian/20 hover:text-gold-dark hover:bg-gold/5 rounded-sm transition-all duration-300 border border-transparent hover:border-gold/10"
                        >
                          <Pencil size={14} strokeWidth={2} />
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
          </div>
        )}
      </div>
    </div>
  );
}
