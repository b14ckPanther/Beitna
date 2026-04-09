import { redirect } from 'next/navigation';
import { isAdminAuthenticated, setAdminSession, getAdminPassword } from '@/lib/admin-auth';
import Image from 'next/image';
import { Lock, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center px-4 overflow-hidden relative">
      {/* Decorative Ornaments */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-50" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl opacity-50" />
      
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(201,165,106,0.08) 0%, transparent 60%)' }} />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-12">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <Image 
              src="/logo.png?v=beitna1" 
              alt="Beitna" 
              fill 
              className="object-contain brightness-[0.2] contrast-[1.5]" 
            />
          </div>
          <h1 className="text-2xl font-black text-obsidian tracking-wider uppercase">Management Portal</h1>
          <p className="section-label !text-gold-dark mt-2">Professional Kitchen Suite</p>
        </div>

        <div className="bg-white border border-gold/10 p-10 shadow-[0_25px_70px_rgba(0,0,0,0.05)] rounded-sm relative group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gold-gradient opacity-40 group-hover:opacity-100 transition-opacity" />
          
          <form action={login} className="space-y-8">
            <div>
              <label className="block text-[10px] font-black tracking-[0.3em] uppercase text-obsidian/40 mb-3">
                Access Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  required
                  autoFocus
                  className="w-full bg-gray-50 border border-gold/15 hover:border-gold/35 focus:border-gold/50 focus:bg-white px-4 py-4 pl-12 text-sm text-obsidian font-bold placeholder:text-obsidian/20 outline-none transition-all duration-300 rounded-sm"
                  placeholder="Enter secure password"
                />
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-dark/40" strokeWidth={2} />
              </div>
              {error && (
                <div className="flex items-center gap-2 mt-3 text-red-500 font-bold text-xs animate-shake">
                  <AlertCircle size={14} />
                  <span>Access Denied. Please verify credentials.</span>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="btn-gold w-full py-4 text-xs font-black tracking-[0.3em] rounded-sm uppercase shadow-xl shadow-gold/10 group-hover:shadow-gold/20"
            >
              Authenticate
            </button>
          </form>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="h-px w-12 bg-gold/20" />
          <p className="text-center text-obsidian/30 text-[10px] font-black uppercase tracking-widest leading-loose">
            Restricted System <br/> Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
}
