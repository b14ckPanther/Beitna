import { getReservations, updateReservationStatus, deleteReservation } from '@/lib/actions/reservations';
import { CheckCircle, XCircle, Clock, Trash2, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getWhatsAppLink } from '@/lib/utils';
import type { Reservation } from '@/lib/supabase';

export const metadata = { title: 'Reservations' };

const statusConfig = {
  pending: { label: 'Pending', color: 'text-amber-700 bg-amber-50 border-amber-200', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-700 bg-red-50 border-red-200', icon: XCircle },
};

export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; date?: string }>;
}) {
  const { status: statusFilter } = await searchParams;
  const reservations = (await getReservations(statusFilter).catch(() => [])) as Reservation[];

  const counts = {
    all: reservations.length,
    pending: reservations.filter((r) => r.status === 'pending').length,
    confirmed: reservations.filter((r) => r.status === 'confirmed').length,
    cancelled: reservations.filter((r) => r.status === 'cancelled').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-obsidian tracking-tight">Reservations</h1>
          <p className="text-obsidian/40 text-sm mt-1">{reservations.length} total across systems</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {([['', 'All', counts.all], ['pending', 'Pending', counts.pending], ['confirmed', 'Confirmed', counts.confirmed], ['cancelled', 'Cancelled', counts.cancelled]] as const).map(([val, label, count]) => (
          <a
            key={val}
            href={val ? `/admin/reservations?status=${val}` : '/admin/reservations'}
            className={cn(
              'px-4 py-2 text-xs font-black rounded-sm border transition-all flex items-center gap-2 uppercase tracking-widest',
              (!statusFilter && val === '') || statusFilter === val
                ? 'bg-gold-dark text-white border-gold-dark shadow-md'
                : 'bg-white border-gold/15 text-obsidian/40 hover:bg-gold/5 hover:text-obsidian/60'
            )}
          >
            {label}
            <span className={cn(
              "font-mono text-[10px] px-1.5 py-0.5 rounded-full",
              (!statusFilter && val === '') || statusFilter === val ? "bg-white/20" : "bg-gold/10 text-gold-dark"
            )}>{count}</span>
          </a>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gold/10 shadow-sm rounded-sm overflow-hidden">
        {reservations.length === 0 ? (
          <div className="text-center py-20 bg-gray-50/30">
            <p className="text-obsidian/30 text-sm">No reservations found in the kitchen records.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gold/10 text-obsidian/40 text-[10px] uppercase font-bold tracking-[0.15em]">
                  <th className="text-left p-4 font-bold">Client Name</th>
                  <th className="text-left p-4 font-bold">Contact</th>
                  <th className="text-left p-4 font-bold">Date</th>
                  <th className="text-left p-4 font-bold">Time</th>
                  <th className="text-left p-4 font-bold">Guests</th>
                  <th className="text-left p-4 font-bold">Booking Details</th>
                  <th className="text-left p-4 font-bold">Current Status</th>
                  <th className="text-right p-4 font-bold">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {reservations.map((r) => {
                  const { color, icon: Icon } = statusConfig[r.status as keyof typeof statusConfig] || statusConfig.pending;
                  const waLink = getWhatsAppLink(r.phone, `مرحباً ${r.name}، بخصوص طلبك في بيتنا بتاريخ ${r.date} الساعة ${String(r.time).slice(0,5)}`);
                  return (
                    <tr key={r.id} className="hover:bg-gold/[0.02] transition-colors group">
                      <td className="p-4">
                        <span className="text-obsidian font-bold block">{r.name}</span>
                        <span className="text-[10px] text-obsidian/30 uppercase tracking-tighter">Verified Client</span>
                      </td>
                      <td className="p-4">
                        <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-obsidian/60 hover:text-gold-dark transition-colors font-mono font-bold flex items-center gap-1.5 group/link">
                          <Phone size={11} className="text-gold-dark opacity-40 group-hover/link:opacity-100" />
                          {r.phone}
                        </a>
                      </td>
                      <td className="p-4 text-obsidian/60 font-mono font-medium">{r.date}</td>
                      <td className="p-4">
                         <span className="text-gold-dark font-black font-mono text-base">{String(r.time).slice(0,5)}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-obsidian/60 font-medium">{r.party_size} People</span>
                      </td>
                      <td className="p-4">
                        <details className="group/details">
                          <summary className="cursor-pointer text-gold-dark/60 hover:text-gold-dark text-xs font-bold uppercase tracking-wider list-none flex items-center gap-1">
                            Review Details
                          </summary>
                          <div className="mt-3 p-3 bg-gray-50 border border-gold/10 rounded-sm space-y-1.5 text-xs text-obsidian/70">
                            <p><span className="font-bold text-gold-dark/70">Name:</span> {r.name}</p>
                            <p><span className="font-bold text-gold-dark/70">Phone:</span> {r.phone}</p>
                            <p><span className="font-bold text-gold-dark/70">Timing:</span> {r.date} @ {String(r.time).slice(0, 5)}</p>
                            {r.notes && (
                              <div className="pt-2 border-t border-gold/5">
                                <span className="font-bold text-gold-dark/70 block mb-0.5 uppercase text-[9px]">Additional Notes:</span>
                                <p className="italic">{r.notes}</p>
                              </div>
                            )}
                          </div>
                        </details>
                      </td>
                      <td className="p-4">
                        <span className={cn('inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-sm border font-black uppercase tracking-wider', color)}>
                          <Icon size={10} strokeWidth={2.5} />
                          {r.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 justify-end">
                          {r.status !== 'confirmed' && (
                            <form action={async () => { 'use server'; await updateReservationStatus(r.id, 'confirmed'); }}>
                              <button type="submit" title="Mark Confirmed" className="p-2 text-emerald-600/40 hover:text-emerald-600 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 rounded-sm transition-all">
                                <CheckCircle size={15} strokeWidth={2} />
                              </button>
                            </form>
                          )}
                          {r.status !== 'cancelled' && (
                            <form action={async () => { 'use server'; await updateReservationStatus(r.id, 'cancelled'); }}>
                              <button type="submit" title="Cancel Booking" className="p-2 text-red-600/40 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-sm transition-all">
                                <XCircle size={15} strokeWidth={2} />
                              </button>
                            </form>
                          )}
                          <form action={async () => { 'use server'; await deleteReservation(r.id); }}>
                            <button type="submit" title="Permanent Delete" className="p-2 text-obsidian/10 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-sm transition-all">
                              <Trash2 size={15} strokeWidth={2} />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
