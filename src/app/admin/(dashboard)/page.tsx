import { getCategories } from '@/lib/actions/categories';
import { getMenuItems } from '@/lib/actions/menu-items';
import { getReservations } from '@/lib/actions/reservations';
import Link from 'next/link';
import { UtensilsCrossed, List, CalendarCheck, Clock, CheckCircle, XCircle, Plus, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const metadata = { title: 'Dashboard' };

export default async function AdminDashboard() {
  const [categories, items, reservations] = await Promise.all([
    getCategories().catch(() => []),
    getMenuItems().catch(() => []),
    getReservations().catch(() => []),
  ]);

  const pending = reservations.filter((r) => r.status === 'pending').length;
  const confirmed = reservations.filter((r) => r.status === 'confirmed').length;
  const cancelled = reservations.filter((r) => r.status === 'cancelled').length;

  const today = new Date().toISOString().split('T')[0];
  const todayRes = reservations.filter((r) => r.date === today);

  const stats = [
    { label: 'Categories', value: categories.length, icon: List, href: '/admin/categories', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
    { label: 'Menu Items', value: items.length, icon: UtensilsCrossed, href: '/admin/menu', color: 'text-gold-DEFAULT', bg: 'bg-gold/10 border-gold/20' },
    { label: 'Total Reservations', value: reservations.length, icon: CalendarCheck, href: '/admin/reservations', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
    { label: "Today's Bookings", value: todayRes.length, icon: Clock, href: '/admin/reservations', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-obsidian tracking-tight uppercase">Dashboard</h1>
          <p className="text-obsidian/40 text-sm font-medium mt-1 uppercase tracking-widest">Global Kitchen Overview</p>
        </div>
        <div className="h-px w-24 bg-gold/20" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, href, color, bg }) => (
          <Link 
            key={label} 
            href={href} 
            className="group bg-white border border-gold/10 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 rounded-sm relative overflow-hidden"
          >
            <div className={cn("absolute top-0 right-0 w-16 h-16 opacity-[0.03] transition-opacity group-hover:opacity-[0.08]", bg)}>
               <Icon className="w-full h-full -rotate-12 translate-x-4 -translate-y-4" />
            </div>
            <div className="flex items-center gap-3 mb-4">
               <div className={cn("p-2 rounded-sm border", bg)}>
                 <Icon size={14} className={color} strokeWidth={2.5} />
               </div>
               <span className="text-[10px] font-black text-obsidian/30 uppercase tracking-[0.2em]">{label}</span>
            </div>
            <p className={cn("text-4xl font-black tracking-tight", color)}>{value}</p>
          </Link>
        ))}
      </div>

      {/* Reservation status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gold/10 p-8 shadow-sm rounded-sm">
          <h2 className="text-xs font-black text-obsidian/40 uppercase tracking-[0.3em] mb-8 flex items-center justify-between">
            <span>Live Bookings</span>
            <div className="flex gap-1">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
            </div>
          </h2>
          <div className="space-y-5">
            {[
              { label: 'Pending', value: pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Confirmed', value: confirmed, icon: CheckCircle, color: 'text-emerald-700', bg: 'bg-emerald-50' },
              { label: 'Cancelled', value: cancelled, icon: XCircle, color: 'text-rose-700', bg: 'bg-rose-50' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="flex items-center justify-between p-4 rounded-sm border border-transparent hover:border-gold/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", bg)}>
                    <Icon size={16} className={color} strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-black text-obsidian/60 uppercase tracking-widest">{label}</span>
                </div>
                <span className={cn("text-xl font-black", color)}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white border border-gold/10 p-8 shadow-sm rounded-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full translate-x-10 -translate-y-10 blur-2xl" />
          <h2 className="text-xs font-black text-obsidian/40 uppercase tracking-[0.3em] mb-8">Management Shortcuts</h2>
          <div className="grid grid-cols-1 gap-3 relative z-10">
            {[
              { href: '/admin/menu/new', label: 'Add Masterpiece Item', icon: UtensilsCrossed },
              { href: '/admin/categories/new', label: 'New Category Layer', icon: List },
              { href: '/admin/reservations', label: 'Audit Reservations', icon: CalendarCheck },
            ].map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between px-5 py-4 bg-gray-50/50 border border-gold/10 hover:border-gold-dark hover:bg-white text-xs font-black uppercase tracking-widest text-obsidian/60 hover:text-gold-dark transition-all duration-300 rounded-sm group shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                   <Icon size={14} className="text-gold-dark/40 group-hover:text-gold-dark" strokeWidth={2.5} />
                   {label}
                </div>
                <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Today's reservations */}
      {todayRes.length > 0 && (
        <div className="bg-white border border-gold/10 p-8 shadow-sm rounded-sm">
          <div className="flex items-center justify-between mb-8 border-b border-gold/5 pb-6">
             <h2 className="text-xs font-black text-obsidian/40 uppercase tracking-[0.3em]">Today&apos;s Operations ({today})</h2>
             <span className="text-[10px] bg-gold-dark text-white px-3 py-1 font-black rounded-full uppercase tracking-widest">Active Schedule</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-separate border-spacing-y-2">
              <thead>
                <tr className="text-obsidian/30 text-[10px] font-black uppercase tracking-widest text-left">
                  <th className="px-4 pb-4">Patron</th>
                  <th className="px-4 pb-4">Contact</th>
                  <th className="px-4 pb-4">Timing</th>
                  <th className="px-4 pb-4">Party Size</th>
                  <th className="px-4 pb-4">Auth Status</th>
                </tr>
              </thead>
              <tbody className="space-y-4">
                {todayRes.map((r) => (
                  <tr key={r.id} className="bg-gray-50/50 hover:bg-white border-y border-gold/5 transition-colors group">
                    <td className="py-5 px-4 text-obsidian font-black rounded-l-sm">{r.name}</td>
                    <td className="py-5 px-4 text-obsidian/60 font-mono text-xs">{r.phone}</td>
                    <td className="py-5 px-4 text-gold-dark font-black tracking-tighter text-lg">{String(r.time).slice(0,5)}</td>
                    <td className="py-5 px-4 text-obsidian/70 font-bold">{r.party_size} Souls</td>
                    <td className="py-5 px-4 rounded-r-sm">
                      <span className={cn(
                        "text-[10px] px-3 py-1 font-black uppercase tracking-widest rounded-sm",
                        r.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                        r.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      )}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
