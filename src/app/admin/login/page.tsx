import { redirect } from 'next/navigation';
import { isAdminAuthenticated, setAdminSession, getAdminPassword } from '@/lib/admin-auth';
import Image from 'next/image';
import { Lock } from 'lucide-react';

export const metadata = { title: 'Admin Login' };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const authed = await isAdminAuthenticated();
  if (authed) redirect('/admin');
  redirect('/portal');

  async function login(formData: FormData) {
    'use server';
    const password = formData.get('password') as string;
    if (password === getAdminPassword()) {
      await setAdminSession();
      redirect('/admin');
    } else {
      redirect('/admin/login?error=1');
    }
  }

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(201,165,106,0.05) 0%, transparent 60%)' }} />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-10">
          <Image src="/logo.png?v=beitna1" alt="Beitna" width={110} height={110} className="mx-auto mb-4 object-contain drop-shadow-[0_0_20px_rgba(201,165,106,0.4)]" />
          <h1 className="text-2xl font-bold text-cream/90">Admin Dashboard</h1>
          <p className="text-cream/40 text-sm mt-1">بيتنا · Beitna</p>
        </div>

        <div className="glass-card p-8">
          <form action={login} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-cream/50 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  required
                  autoFocus
                  className="w-full bg-obsidian-200 border border-gold/15 hover:border-gold/35 focus:border-gold/50 px-4 py-3 pl-10 text-sm text-cream/80 placeholder:text-cream/20 outline-none transition-all duration-300"
                  placeholder="Enter admin password"
                />
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-DEFAULT/40" strokeWidth={1.5} />
              </div>
              {error && (
                <p className="text-red-400 text-xs mt-2">Incorrect password. Try again.</p>
              )}
            </div>
            <button
              type="submit"
              className="btn-gold w-full py-3 text-sm font-bold tracking-widest rounded-sm uppercase"
            >
              Sign In
            </button>
          </form>
        </div>

        <p className="text-center text-cream/20 text-xs mt-6">
          This area is restricted to restaurant staff only.
        </p>
      </div>
    </div>
  );
}
