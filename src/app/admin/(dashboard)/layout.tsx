import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect('/portal');

  return (
    <div className="flex min-h-screen bg-obsidian">
      <AdminSidebar />
      <main className="flex-1 ml-60 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
