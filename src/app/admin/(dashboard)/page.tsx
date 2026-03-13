import { getCategories } from '@/lib/actions/categories';
import { getMenuItems } from '@/lib/actions/menu-items';
import { getReservations } from '@/lib/actions/reservations';
import Link from 'next/link';
import { UtensilsCrossed, List, CalendarCheck, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';

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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-cream/90">Dashboard</h1>
        <p className="text-cream/40 text-sm mt-1">Welcome back, Sultan.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, href, color, bg }) => (
          <Link key={label} href={href} className={`glass-card p-5 border ${bg} hover:scale-[1.02] transition-transform duration-200`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-sm border flex items-center justify-center ${bg}`}>
                <Icon size={16} className={color} strokeWidth={1.5} />
              </div>
            </div>
            <p className={`text-3xl font-black ${color}`}>{value}</p>
            <p className="text-cream/40 text-xs mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {/* Reservation status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-cream/70 mb-4 flex items-center gap-2">
            <CalendarCheck size={14} className="text-gold-DEFAULT" />
            Reservation Status
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Pending', value: pending, icon: Clock, color: 'text-yellow-400' },
              { label: 'Confirmed', value: confirmed, icon: CheckCircle, color: 'text-emerald-400' },
              { label: 'Cancelled', value: cancelled, icon: XCircle, color: 'text-red-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gold/5 last:border-0">
                <div className="flex items-center gap-2">
                  <Icon size={13} className={color} strokeWidth={1.5} />
                  <span className="text-sm text-cream/60">{label}</span>
                </div>
                <span className={`text-sm font-bold ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-cream/70 mb-4 flex items-center gap-2">
            <Plus size={14} className="text-gold-DEFAULT" />
            Quick Actions
          </h2>
          <div className="space-y-2">
            {[
              { href: '/admin/menu/new', label: 'Add Menu Item', icon: UtensilsCrossed },
              { href: '/admin/categories/new', label: 'Add Category', icon: List },
              { href: '/admin/reservations', label: 'View Reservations', icon: CalendarCheck },
            ].map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-4 py-3 bg-obsidian-200 border border-gold/10 hover:border-gold/30 text-sm text-cream/70 hover:text-cream transition-all duration-200 rounded-sm group"
              >
                <Icon size={14} className="text-gold-DEFAULT/60 group-hover:text-gold-DEFAULT" strokeWidth={1.5} />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Today's reservations */}
      {todayRes.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-cream/70 mb-4">Today&apos;s Reservations ({today})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold/10 text-cream/40 text-xs">
                  <th className="text-left pb-3 font-medium">Name</th>
                  <th className="text-left pb-3 font-medium">Phone</th>
                  <th className="text-left pb-3 font-medium">Time</th>
                  <th className="text-left pb-3 font-medium">Guests</th>
                  <th className="text-left pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {todayRes.map((r) => (
                  <tr key={r.id} className="border-b border-gold/5 last:border-0">
                    <td className="py-3 text-cream/80">{r.name}</td>
                    <td className="py-3 text-cream/60 font-mono">{r.phone}</td>
                    <td className="py-3 text-gold-DEFAULT font-mono">{String(r.time).slice(0,5)}</td>
                    <td className="py-3 text-cream/60">{r.party_size}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-sm font-medium ${
                        r.status === 'confirmed' ? 'bg-emerald-400/10 text-emerald-400' :
                        r.status === 'cancelled' ? 'bg-red-400/10 text-red-400' :
                        'bg-yellow-400/10 text-yellow-400'
                      }`}>{r.status}</span>
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
