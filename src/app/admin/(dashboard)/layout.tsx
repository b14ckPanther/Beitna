import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect('/portal');

  return (
    <div className="flex min-h-screen bg-[#FDFCF9]">
      <AdminSidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
