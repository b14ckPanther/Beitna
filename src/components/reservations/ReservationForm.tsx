'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, Calendar, Clock, Users, CheckCircle, AlertCircle, Phone, User, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { getWhatsAppLink } from '@/lib/utils';

// 12:30 PM — 12:00 midnight (all week)
const TIME_SLOTS = [
  '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15',
  '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:30',
];

const PARTY_SIZES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// "09:30" → "9:30", "14:00" → "14:00"
const formatSlot = (slot: string) => slot.replace(/^0/, '');

// How many concurrent reservations before a slot is considered "full"
const MAX_PER_SLOT = 3;

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function ReservationForm() {
  const t = useTranslations('reservations');

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    name: '',
    phone: '',
    date: today,
    time: '19:45',
    party_size: 2,
    notes: '',
  });

  const [partySizeOpen, setPartySizeOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slotCounts, setSlotCounts] = useState<Record<string, number>>({});
  const [now, setNow] = useState(() => new Date());

  // Tick every minute so disabled slots update in real-time
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Returns true if the slot time has already passed for today (+ 30 min buffer)
  const isSlotPast = useCallback((slot: string): boolean => {
    if (form.date !== today) return false;
    const [h, m] = slot.split(':').map(Number);
    const slotMinutes = h * 60 + m;
    const nowMinutes = now.getHours() * 60 + now.getMinutes() + 30; // 30-min buffer
    return slotMinutes <= nowMinutes;
  }, [form.date, today, now]);

  const fetchAvailability = useCallback(async (date: string) => {
    try {
      const res = await fetch(`/api/availability?date=${date}`);
      if (res.ok) setSlotCounts(await res.json());
    } catch { /* ignore — degrade gracefully */ }
  }, []);

  useEffect(() => { fetchAvailability(form.date); }, [form.date, fetchAvailability]);

  // When date changes to today, auto-select the next available future slot
  useEffect(() => {
    if (form.date !== today) return;
    const nowMinutes = now.getHours() * 60 + now.getMinutes() + 30;
    const nextSlot = TIME_SLOTS.find((s) => {
      const [h, m] = s.split(':').map(Number);
      return h * 60 + m > nowMinutes;
    });
    if (nextSlot && isSlotPast(form.time)) {
      setForm((f) => ({ ...f, time: nextSlot }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.date, today]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = t('required_field');
    if (!form.phone.trim()) newErrors.phone = t('required_field');
    else if (!/^[\d\s\-\+]{7,15}$/.test(form.phone)) newErrors.phone = t('invalid_phone');
    if (!form.date) newErrors.date = t('required_field');
    if (!form.time) newErrors.time = t('required_field');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    try {
      const { error } = await supabase.from('reservations').insert([
        {
          name: form.name,
          phone: form.phone,
          date: form.date,
          time: form.time,
          party_size: form.party_size,
          notes: form.notes || null,
          status: 'pending',
        },
      ]);
      if (error) throw error;
      setStatus('success');
      fetchAvailability(form.date);
    } catch {
      setStatus('error');
    }
  };

  const whatsappLink = getWhatsAppLink(
    '0503274101',
    `مرحباً، أود الاستفسار عن طلب طعام من بيتنا-بيتنا بتاريخ ${form.date}`
  );

  if (status === 'success') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6 animate-glow-pulse">
            <CheckCircle size={32} className="text-gold-DEFAULT" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-black text-cream/90 mb-3">{t('booking_success')}</h2>
          <p className="text-cream/40 text-sm">
            {form.name} — {form.date} — {form.time}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Step 1: Party details row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Party Size */}
          <div className="relative">
            <label className="block text-xs font-semibold tracking-widest uppercase text-cream/50 mb-3 text-right">
              <span className="flex items-center gap-2 justify-end">
                {t('party_size')}
                <Users size={12} strokeWidth={1.5} className="text-gold-DEFAULT" />
              </span>
            </label>
            <button
              type="button"
              onClick={() => setPartySizeOpen(!partySizeOpen)}
              className="w-full bg-obsidian-200 border border-gold/15 hover:border-gold/35 px-4 py-3.5 flex items-center justify-between text-sm transition-all duration-300 text-right"
            >
              <ChevronDown size={14} className={cn('text-gold-DEFAULT/60 transition-transform duration-300', partySizeOpen && 'rotate-180')} />
              <span className="text-cream/80">
                {form.party_size > 10 ? t('guests_plus') : `${form.party_size} ${t('guests_suffix')}`}
              </span>
            </button>
            {partySizeOpen && (
              <div className="absolute top-full left-0 right-0 bg-obsidian-50 border border-gold/20 z-20 max-h-48 overflow-y-auto shadow-2xl">
                {[...PARTY_SIZES, 11].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => { setForm({ ...form, party_size: n }); setPartySizeOpen(false); }}
                    className={cn(
                      'w-full px-4 py-2.5 text-sm text-right transition-colors duration-200',
                      form.party_size === n
                        ? 'text-gold-DEFAULT bg-gold/5'
                        : 'text-cream/60 hover:text-cream hover:bg-white/5'
                    )}
                  >
                    {n > 10 ? t('guests_plus') : `${n} ${t('guests_suffix')}`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-cream/50 mb-3 text-right">
              <span className="flex items-center gap-2 justify-end">
                {t('date')}
                <Calendar size={12} strokeWidth={1.5} className="text-gold-DEFAULT" />
              </span>
            </label>
            <input
              type="date"
              value={form.date}
              min={today}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={cn(
                'w-full bg-obsidian-200 border px-4 py-3.5 text-sm text-cream/80 text-right transition-all duration-300 outline-none',
                'focus:border-gold/50 focus:bg-obsidian-200/80',
                '[color-scheme:dark]',
                errors.date ? 'border-red-500/50' : 'border-gold/15 hover:border-gold/35'
              )}
            />
            {errors.date && <p className="text-red-400 text-xs mt-1 text-right">{errors.date}</p>}
          </div>

          {/* Empty for grid balance */}
          <div className="hidden sm:block" />
        </div>

        {/* Time Slots */}
        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-cream/50 mb-4 text-right">
            <span className="flex items-center gap-2 justify-end">
              {t('select_time')}
              <Clock size={12} strokeWidth={1.5} className="text-gold-DEFAULT" />
            </span>
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-9 gap-2">
            {TIME_SLOTS.map((slot) => {
              const count = slotCounts[slot] ?? 0;
              const isPast = isSlotPast(slot);
              const isFull = !isPast && count >= MAX_PER_SLOT;
              const isBusy = !isPast && count > 0 && count < MAX_PER_SLOT;
              const isDisabled = isPast || isFull;
              const isSelected = form.time === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => !isDisabled && setForm({ ...form, time: slot })}
                  title={
                    isPast ? 'هذا الوقت مضى' :
                    isFull ? 'هذا الوقت محجوز بالكامل' :
                    isBusy ? 'متاح — حجوزات محدودة' : undefined
                  }
                  className={cn(
                    'relative py-2.5 text-xs font-mono font-medium border transition-all duration-200',
                    isPast
                      ? 'border-white/4 bg-white/2 text-cream/15 cursor-not-allowed'
                      : isFull
                        ? 'border-red-500/20 bg-red-500/5 text-red-400/30 cursor-not-allowed line-through'
                        : isSelected
                          ? 'time-slot-active font-bold'
                          : isBusy
                            ? 'border-amber-500/30 bg-amber-500/5 text-amber-300/70 hover:border-amber-400/50'
                            : 'border-gold/15 text-cream/50 hover:border-gold/35 hover:text-cream/80 bg-obsidian-200'
                  )}
                >
                  {formatSlot(slot)}
                  {isBusy && !isSelected && (
                    <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-amber-400/60" />
                  )}
                  {isFull && (
                    <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-red-400/60" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 mt-3 justify-end text-[10px] text-cream/30">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-cream/20" /> <span lang="ar">متاح</span></span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400/60" /> <span lang="ar">حجوزات محدودة</span></span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-400/60" /> <span lang="ar">ممتلئ</span></span>
          </div>
        </div>

        {/* Personal details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-cream/50 mb-3 text-right">
              <span className="flex items-center gap-2 justify-end">
                {t('name')}
                <User size={12} strokeWidth={1.5} className="text-gold-DEFAULT" />
              </span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t('name')}
              dir="rtl"
              className={cn(
                'w-full bg-obsidian-200 border px-4 py-3.5 text-sm text-cream/80 text-right placeholder:text-cream/20 transition-all duration-300 outline-none',
                'focus:border-gold/50 focus:bg-obsidian-200/80',
                errors.name ? 'border-red-500/50' : 'border-gold/15 hover:border-gold/35'
              )}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1 text-right">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-cream/50 mb-3 text-right">
              <span className="flex items-center gap-2 justify-end">
                {t('phone')}
                <Phone size={12} strokeWidth={1.5} className="text-gold-DEFAULT" />
              </span>
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="054-XXXXXXX"
              dir="ltr"
              className={cn(
                'w-full bg-obsidian-200 border px-4 py-3.5 text-sm text-cream/80 placeholder:text-cream/20 transition-all duration-300 outline-none font-mono',
                'focus:border-gold/50 focus:bg-obsidian-200/80',
                errors.phone ? 'border-red-500/50' : 'border-gold/15 hover:border-gold/35'
              )}
            />
            {errors.phone && <p className="text-red-400 text-xs mt-1 text-right">{errors.phone}</p>}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-cream/50 mb-3 text-right">
            <span className="flex items-center gap-2 justify-end">
              {t('notes')}
              <MessageSquare size={12} strokeWidth={1.5} className="text-gold-DEFAULT" />
            </span>
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder={t('notes_placeholder')}
            rows={3}
            dir="rtl"
            className="w-full bg-obsidian-200 border border-gold/15 hover:border-gold/35 focus:border-gold/50 px-4 py-3.5 text-sm text-cream/80 text-right placeholder:text-cream/20 transition-all duration-300 outline-none resize-none"
          />
        </div>

        {/* Summary bar */}
        <div className="glass-card p-4 flex flex-wrap items-center justify-end gap-4 text-sm">
          <span className="text-cream/30 text-xs">{t('select_time')}</span>
          <div className="flex items-center gap-3 text-cream/60 text-xs">
            <span className="font-mono text-gold-DEFAULT">{formatSlot(form.time)}</span>
            <span>·</span>
            <span>{form.date}</span>
            <span>·</span>
            <span>{form.party_size > 10 ? '11+' : form.party_size} {t('guests_suffix')}</span>
          </div>
        </div>

        {/* Error state */}
        {status === 'error' && (
          <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/20 px-4 py-3 text-red-400 text-sm">
            <AlertCircle size={14} />
            <span>{t('booking_error')}</span>
          </div>
        )}

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-sm text-cream/40 hover:text-gold-DEFAULT transition-colors duration-300"
          >
            <WhatsAppIcon size={14} />
            <span>{t('whatsapp_fallback')}</span>
          </a>
          <button
            type="submit"
            disabled={status === 'loading'}
            className={cn(
              'btn-gold px-10 py-4 text-sm font-bold tracking-[0.2em] rounded-sm uppercase min-w-[200px] text-center',
              status === 'loading' && 'opacity-70 cursor-not-allowed'
            )}
          >
            {status === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
                <span>جاري...</span>
              </span>
            ) : t('book_now')}
          </button>
        </div>
      </form>
    </div>
  );
}
