'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Calendar, Users, Phone, User, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { getWhatsAppLink } from '@/lib/utils';

type OccasionType = 'wedding' | 'birthday' | 'corporate' | 'other';

const OCCASION_TYPES: { value: OccasionType; labelKey: string }[] = [
  { value: 'wedding', labelKey: 'wedding' },
  { value: 'birthday', labelKey: 'birthday' },
  { value: 'corporate', labelKey: 'corporate' },
  { value: 'other', labelKey: 'other' },
];

export default function OccasionForm() {
  const t = useTranslations('occasions');

  const today = new Date().toISOString().split('T')[0];
  const todayDate = new Date();

  const addDays = (base: Date, days: number) => {
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    return d;
  };

  const [form, setForm] = useState({
    name: '',
    phone: '',
    occasion_type: 'wedding' as OccasionType,
    date: today,
    guests: 20,
    notes: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const trimmedPhone = form.phone.trim();
  const phoneError = (() => {
    if (!trimmedPhone) return t('phone_required_hint');
    const patterns = [
      /^05\d{8}$/,
      /^\+9725\d{8}$/,
      /^\+97205\d{8}$/,
    ];
    const isValid = patterns.some((re) => re.test(trimmedPhone));
    if (isValid) return null;
    return t('phone_invalid_message');
  })();

  const isDateAllowed = (dateStr: string) => {
    const target = new Date(dateStr);
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.floor((target.getTime() - todayDate.getTime()) / oneDay);

    if (diffDays < 0) return false; // never allow past dates

    if (form.occasion_type === 'wedding') {
      // at least 10 days in advance
      return diffDays >= 10;
    }
    if (form.occasion_type === 'birthday') {
      // at least 2 days in advance
      return diffDays >= 2;
    }
    if (form.occasion_type === 'corporate') {
      // at least 1 day in advance
      return diffDays >= 1;
    }
    // "other" – any future date including today
    return diffDays >= 0;
  };

  const validateLeadTime = () => isDateAllowed(form.date);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = t('required_field');
    if (!trimmedPhone) newErrors.phone = t('required_field');
    else if (phoneError) newErrors.phone = phoneError;

    if (!form.date) newErrors.date = t('required_field');
    else if (!validateLeadTime()) {
      newErrors.date =
        form.occasion_type === 'wedding'
          ? t('leadtime_wedding')
          : t('leadtime_other');
    }

    if (!form.guests || form.guests < 1) newErrors.guests = t('required_field');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    try {
      const occasionLabel = t(`type_labels.${form.occasion_type}` as any);
      const notesPrefix = `[${occasionLabel}] الضيوف: ${form.guests}\n`;

      const { error } = await supabase.from('reservations').insert([
        {
          name: form.name,
          phone: trimmedPhone,
          date: form.date,
          time: '12:00', // generic midday time for kitchen planning
          party_size: form.guests,
          notes: notesPrefix + (form.notes || ''),
          status: 'pending',
        },
      ]);

      if (error) throw error;
      setStatus('success');

      // Also send full summary to WhatsApp so mom sees it immediately
      const summaryLines = [
        'طلب مناسبة جديد من موقع بيتنا',
        '',
        `الاسم: ${form.name || '—'}`,
        `الهاتف: ${trimmedPhone || '—'}`,
        `نوع المناسبة: ${occasionLabel}`,
        `التاريخ: ${form.date}`,
        `عدد الضيوف التقريبي: ${form.guests || '—'}`,
        '',
        `تفاصيل إضافية: ${form.notes || 'لا يوجد'}`,
      ];
      const waLink = getWhatsAppLink('0503274101', summaryLines.join('\n'));
      if (typeof window !== 'undefined') {
        window.open(waLink, '_blank');
      }
    } catch {
      setStatus('error');
    }
  };

  const whatsappFallback = getWhatsAppLink(
    '0503274101',
    t('whatsapp_template', {
      name: form.name || 'ضيف',
      occasion: t(`type_labels.${form.occasion_type}` as any),
      date: form.date,
      guests: String(form.guests),
    }),
  );

  if (status === 'success') {
    return (
      <div className="max-w-3xl mx-auto min-h-[50vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(201,165,106,0.1)]">
            <CheckCircle size={40} className="text-gold-dark" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-black text-obsidian mb-4" lang="ar">
            {t('success_title')}
          </h2>
          <p className="text-obsidian/60 text-lg leading-relaxed font-medium" lang="ar">
            {t('success_body')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Occasion & date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <label className="block text-xs font-black tracking-[0.2em] uppercase text-gold-dark/60 mb-5 text-right">
              <span className="flex items-center gap-2 justify-end">
                {t('occasion_type')}
              </span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {OCCASION_TYPES.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, occasion_type: opt.value }))}
                  className={cn(
                    'px-4 py-3 text-xs rounded-sm border transition-all duration-300 text-right uppercase tracking-widest font-black',
                    form.occasion_type === opt.value
                      ? 'border-gold-dark bg-gold-dark text-white shadow-lg shadow-gold/10'
                      : 'border-gold/15 bg-white text-obsidian/60 hover:border-gold/40 hover:text-obsidian'
                  )}
                >
                  <span lang="ar">{t(`type_labels.${opt.value}` as any)}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black tracking-[0.2em] uppercase text-gold-dark/60 mb-5 text-right">
              <span className="flex items-center gap-2 justify-end">
                {t('date')}
                <Calendar size={14} strokeWidth={2} className="text-gold-dark" />
              </span>
            </label>
            <div className="bg-gray-50/50 border border-gold/10 p-4 rounded-sm shadow-inner">
              <div className="grid grid-cols-7 gap-1 text-[11px] font-black text-gold-dark/40 mb-3" dir="ltr">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
                  <span key={`${d}-${idx}`} className="text-center">
                    {d}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1.5" dir="ltr">
                {Array.from({ length: 30 }).map((_, idx) => {
                  const d = addDays(todayDate, idx);
                  const iso = d.toISOString().split('T')[0];
                  const day = d.getDate();
                  const isSelected = form.date === iso;
                  const selectable = isDateAllowed(iso);
                  return (
                    <button
                      key={iso}
                      type="button"
                      disabled={!selectable}
                      onClick={() => selectable && setForm((f) => ({ ...f, date: iso }))}
                      className={cn(
                        'h-9 text-[11px] font-bold rounded-sm border transition-all flex items-center justify-center',
                        !selectable
                          ? 'bg-transparent border-gray-100 text-gray-200 cursor-not-allowed'
                          : isSelected
                            ? 'border-gold-dark bg-gold-dark text-white font-black shadow-md'
                            : 'bg-white border-gold/10 text-obsidian/70 hover:border-gold/40 hover:text-gold-dark'
                      )}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
            <p className="text-obsidian/40 text-[11px] mt-3 italic text-right" lang="ar">
              {t('urgent_note')}
            </p>
            {errors.date && (
              <p className="text-red-500 font-bold text-xs mt-2 text-right" lang="ar">
                {errors.date}
              </p>
            )}
          </div>
        </div>

        {/* Guests & Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-black tracking-[0.2em] uppercase text-gold-dark/60 mb-4 text-right">
              <span className="flex items-center gap-2 justify-end">
                {t('guests')}
                <Users size={14} strokeWidth={2} className="text-gold-dark" />
              </span>
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: Number(e.target.value) || 0 })}
                className={cn(
                  'w-full bg-gray-50 border px-5 py-4 text-sm text-obsidian transition-all duration-300 outline-none font-bold rounded-sm',
                  errors.guests ? 'border-red-300 bg-red-50/30' : 'border-gold/15 focus:border-gold/50 focus:bg-white focus:shadow-sm'
                )}
              />
            </div>
            {errors.guests && (
              <p className="text-red-500 font-bold text-xs mt-2 text-right" lang="ar">
                {errors.guests}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-black tracking-[0.2em] uppercase text-gold-dark/60 mb-4 text-right">
              <span className="flex items-center gap-2 justify-end">
                {t('name')}
                <User size={14} strokeWidth={2} className="text-gold-dark" />
              </span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              dir="rtl"
              className={cn(
                'w-full bg-gray-50 border px-5 py-4 text-sm text-obsidian placeholder:text-obsidian/30 transition-all duration-300 outline-none rounded-sm font-medium',
                errors.name ? 'border-red-300 bg-red-50/30' : 'border-gold/15 focus:border-gold/50 focus:bg-white focus:shadow-sm'
              )}
              placeholder={t('name_placeholder')}
            />
            {errors.name && (
              <p className="text-red-500 font-bold text-xs mt-2 text-right" lang="ar">
                {errors.name}
              </p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-black tracking-[0.2em] uppercase text-gold-dark/60 mb-4 text-right">
            <span className="flex items-center gap-2 justify-end">
              {t('phone')}
              <Phone size={14} strokeWidth={2} className="text-gold-dark" />
            </span>
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            dir="ltr"
            className={cn(
              'w-full bg-gray-50 border px-5 py-4 text-sm text-obsidian placeholder:text-obsidian/30 transition-all duration-300 outline-none font-bold rounded-sm',
              errors.phone ? 'border-red-300 bg-red-50/30' : 'border-gold/15 focus:border-gold/50 focus:bg-white focus:shadow-sm'
            )}
            placeholder="05..."
          />
          {errors.phone && (
            <p className="text-red-500 font-bold text-xs mt-2 text-right" lang="ar">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-black tracking-[0.2em] uppercase text-gold-dark/60 mb-4 text-right">
            <span className="flex items-center gap-2 justify-end">
              {t('notes')}
              <MessageSquare size={14} strokeWidth={2} className="text-gold-dark" />
            </span>
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={5}
            dir="rtl"
            className="w-full bg-gray-50 border border-gold/15 focus:border-gold/50 focus:bg-white focus:shadow-sm px-5 py-4 text-sm text-obsidian placeholder:text-obsidian/30 transition-all duration-300 outline-none resize-none rounded-sm font-medium"
            placeholder={t('notes_placeholder')}
          />
        </div>

        {/* Error banner */}
        {status === 'error' && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 px-6 py-4 text-red-600 text-sm font-bold rounded-sm shadow-sm animate-shake">
            <AlertCircle size={16} />
            <span>{t('submit_error')}</span>
          </div>
        )}

        {/* Submit + WhatsApp helper */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between pt-6 border-t border-gold/5">
          <a
            href={whatsappFallback}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-sm text-gold-dark/60 hover:text-gold-dark transition-all duration-300 font-bold group"
          >
            <MessageSquare size={16} className="group-hover:scale-110 transition-transform" />
            <span className="border-b border-transparent group-hover:border-gold-dark/30">{t('whatsapp_fallback')}</span>
          </a>
          <button
            type="submit"
            disabled={status === 'loading'}
            className={cn(
              'btn-gold px-14 py-5 text-sm font-black tracking-[0.2em] rounded-sm uppercase min-w-[280px] text-center shadow-xl shadow-gold/10 hover:shadow-gold/20 active:scale-[0.98]',
              status === 'loading' && 'opacity-70 cursor-not-allowed'
            )}
          >
            {status === 'loading' ? t('submitting') : t('cta_submit')}
          </button>
        </div>
      </form>
    </div>
  );
}

