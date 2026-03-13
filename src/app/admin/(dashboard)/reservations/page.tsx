import { getReservations, updateReservationStatus, deleteReservation } from '@/lib/actions/reservations';
import { CheckCircle, XCircle, Clock, Trash2, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getWhatsAppLink } from '@/lib/utils';

export const metadata = { title: 'Reservations' };

const statusConfig = {
  pending: { label: 'Pending', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: XCircle },
};

export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; date?: string }>;
}) {
  const { status: statusFilter } = await searchParams;
  const reservations = await getReservations(statusFilter).catch(() => []);

  const counts = {
    all: reservations.length,
    pending: reservations.filter((r) => r.status === 'pending').length,
    confirmed: reservations.filter((r) => r.status === 'confirmed').length,
    cancelled: reservations.filter((r) => r.status === 'cancelled').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cream/90">Reservations</h1>
        <p className="text-cream/40 text-sm mt-1">{reservations.length} total</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {([['', 'All', counts.all], ['pending', 'Pending', counts.pending], ['confirmed', 'Confirmed', counts.confirmed], ['cancelled', 'Cancelled', counts.cancelled]] as const).map(([val, label, count]) => (
          <a
            key={val}
            href={val ? `/admin/reservations?status=${val}` : '/admin/reservations'}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-sm border transition-all flex items-center gap-1.5',
              (!statusFilter && val === '') || statusFilter === val
                ? 'bg-gold/10 text-gold-DEFAULT border-gold/30'
                : 'border-gold/10 text-cream/40 hover:border-gold/25 hover:text-cream/60'
            )}
          >
            {label}
            <span className="font-mono">{count}</span>
          </a>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {reservations.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-cream/30 text-sm">No reservations found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold/10 text-cream/40 text-xs">
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-left p-4 font-medium">Phone</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Time</th>
                  <th className="text-left p-4 font-medium">Guests</th>
                  <th className="text-left p-4 font-medium">Details</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => {
                  const { color, icon: Icon } = statusConfig[r.status as keyof typeof statusConfig];
                  const waLink = getWhatsAppLink(r.phone, `مرحباً ${r.name}، بخصوص طلبك في بيتنا بتاريخ ${r.date} الساعة ${String(r.time).slice(0,5)}`);
                  return (
                    <tr key={r.id} className="border-b border-gold/5 last:border-0 hover:bg-white/2 transition-colors">
                      <td className="p-4 text-cream/80 font-medium">{r.name}</td>
                      <td className="p-4">
                        <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-gold-DEFAULT transition-colors font-mono flex items-center gap-1.5 group">
                          <Phone size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          {r.phone}
                        </a>
                      </td>
                      <td className="p-4 text-cream/60 font-mono">{r.date}</td>
                      <td className="p-4 text-gold-DEFAULT font-mono font-bold">{String(r.time).slice(0,5)}</td>
                      <td className="p-4 text-cream/60">{r.party_size}</td>
                      <td className="p-4 text-cream/40 align-top">
                        {r.notes || r.status || r.party_size ? (
                          <details className="group">
                            <summary className="cursor-pointer text-cream/50 hover:text-gold-DEFAULT text-xs list-none">
                              View
                            </summary>
                            <div className="mt-2 space-y-1 text-xs text-cream/60 max-w-xs">
                              <p>
                                <span className="font-semibold">Name:</span> {r.name}
                              </p>
                              <p>
                                <span className="font-semibold">Phone:</span> {r.phone}
                              </p>
                              <p>
                                <span className="font-semibold">Date:</span> {r.date}{' '}
                                <span className="font-semibold">Time:</span> {String(r.time).slice(0, 5)}
                              </p>
                              <p>
                                <span className="font-semibold">Guests:</span> {r.party_size}
                              </p>
                              {r.notes && (
                                <p className="pt-1 whitespace-pre-wrap">
                                  <span className="font-semibold">Notes:</span> {r.notes}
                                </p>
                              )}
                            </div>
                          </details>
                        ) : (
                          <span>—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={cn('inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-sm border font-medium', color)}>
                          <Icon size={10} />
                          {r.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 justify-end">
                          {r.status !== 'confirmed' && (
                            <form action={async () => { 'use server'; await updateReservationStatus(r.id, 'confirmed'); }}>
                              <button type="submit" title="Confirm" className="p-1.5 text-emerald-400/50 hover:text-emerald-400 hover:bg-emerald-400/5 rounded-sm transition-all">
                                <CheckCircle size={13} strokeWidth={1.5} />
                              </button>
                            </form>
                          )}
                          {r.status !== 'cancelled' && (
                            <form action={async () => { 'use server'; await updateReservationStatus(r.id, 'cancelled'); }}>
                              <button type="submit" title="Cancel" className="p-1.5 text-red-400/50 hover:text-red-400 hover:bg-red-400/5 rounded-sm transition-all">
                                <XCircle size={13} strokeWidth={1.5} />
                              </button>
                            </form>
                          )}
                          <form action={async () => { 'use server'; await deleteReservation(r.id); }}>
                            <button type="submit" title="Delete" className="p-1.5 text-cream/20 hover:text-red-400 hover:bg-red-400/5 rounded-sm transition-all">
                              <Trash2 size={13} strokeWidth={1.5} />
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
