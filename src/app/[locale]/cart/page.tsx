'use client';

import { useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useCart } from '@/components/cart/CartProvider';
import { getWhatsAppLink } from '@/lib/utils';

export default function CartPage() {
  const tMenu = useTranslations('menu');
  const locale = useLocale();
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clear } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');

  const trimmedPhone = customerPhone.trim();
  const phoneError = (() => {
    if (!trimmedPhone) return null;
    const patterns = [
      /^05\d{8}$/,        // local: 0507147134
      /^\+9725\d{8}$/,    // intl without extra 0: +972507147134
      /^\+97205\d{8}$/,   // intl with extra 0: +9720507147134
    ];
    const isValid = patterns.some((re) => re.test(trimmedPhone));
    if (isValid) return null;
    return 'تأكد جيداً من رقم الهاتف';
  })();

  const whatsappLink = useMemo(() => {
    if (!items.length || phoneError) return '#';

    const lines: string[] = [];
    lines.push('طلب جديد من موقع بيتنا');
    lines.push('');
    if (customerName.trim()) lines.push(`الاسم: ${customerName.trim()}`);
    if (customerPhone.trim()) lines.push(`رقم الهاتف: ${customerPhone.trim()}`);
    lines.push('');
    lines.push('تفاصيل الطلب:');
    items.forEach((item) => {
      const name =
        locale === 'he'
          ? item.name_he || item.name_ar
          : locale === 'en'
          ? item.name_en || item.name_ar
          : item.name_ar;
      lines.push(`- ${item.quantity} × ${name} — ${item.price} ₪`);
    });
    lines.push('');
    lines.push(`الإجمالي : ${totalPrice.toFixed(2)} ₪`);
    lines.push('');
    lines.push(`ملاحظات الزبون: ${notes.trim() || 'لا يوجد'}`);

    const message = lines.join('\n');
    // Mom's phone: +972503274101 → local 0503274101
    return getWhatsAppLink('0503274101', message);
  }, [items, totalPrice, customerName, customerPhone, notes, locale, phoneError]);

  return (
    <div className="min-h-screen bg-obsidian pt-24">
      <div className="relative py-16 sm:py-20 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center top, rgba(201,165,106,0.07) 0%, transparent 60%)' }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gold-DEFAULT/30" />
            <span className="section-label" lang="ar">
              سلة الطلبات
            </span>
            <div className="h-px w-12 bg-gold-DEFAULT/30" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-cream/90 mb-4" lang="ar">
            طلباتك
          </h1>
          <p className="text-cream/40 text-base max-w-md mx-auto" lang="ar">
            أضف الأطباق التي تريدها من القائمة، ثم أرسل الطلب عبر واتساب لتأكيده مع بيتنا.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 grid gap-8 lg:grid-cols-[2fr,1.2fr]">
        {/* Items */}
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="glass-card p-6 text-center text-cream/40 text-sm" lang="ar">
              السلة فارغة حالياً. ابدأ من صفحة القائمة وأضف الأطباق التي تريدها.
            </div>
          ) : (
            <>
              {items.map((item) => {
                const name =
                  locale === 'he'
                    ? item.name_he || item.name_ar
                    : locale === 'en'
                    ? item.name_en || item.name_ar
                    : item.name_ar;
                return (
                  <div
                    key={item.id}
                    className="glass-card flex items-center justify-between gap-4 p-4 sm:p-5"
                  >
                    <div className="flex-1 text-right min-w-0">
                      <p className="text-cream/90 font-semibold text-sm sm:text-base">
                        <span lang="ar">{name}</span>
                      </p>
                      <p className="text-gold-DEFAULT text-xs mt-1">
                        {item.price} ₪{' '}
                        <span className="text-cream/40">× {item.quantity}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gold/25 rounded-sm overflow-hidden">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, Math.max(0, item.quantity - 1))
                          }
                          className="px-2 py-1 text-sm text-cream/70 hover:bg-gold/10"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs text-cream/80">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-sm text-cream/70 hover:bg-gold/10"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-[11px] text-cream/40 hover:text-red-400 transition-colors"
                        lang="ar"
                      >
                        إزالة
                      </button>
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center justify-between text-xs text-cream/40 pt-2">
                <button
                  type="button"
                  onClick={clear}
                  className="text-red-400/70 hover:text-red-400 transition-colors"
                  lang="ar"
                >
                  مسح السلة
                </button>
                <p lang="ar">
                  المجموع: {totalItems} صنف / {totalPrice.toFixed(2)} ₪
                </p>
              </div>
            </>
          )}
        </div>

        {/* Customer info + WhatsApp CTA */}
        <div className="space-y-4">
          <div className="glass-card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-cream/80 text-right" lang="ar">
              تفاصيل التواصل
            </h2>
            <div className="space-y-3 text-right">
              <div>
                <label className="block text-[11px] text-cream/40 mb-1" lang="ar">
                  الاسم
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  dir="rtl"
                  className="w-full bg-obsidian-200 border border-gold/15 px-3 py-2 text-xs text-cream/80 placeholder:text-cream/25 outline-none focus:border-gold/40"
                  placeholder="اكتب اسمك"
                />
              </div>
              <div>
                <label className="block text-[11px] text-cream/40 mb-1" lang="ar">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  dir="ltr"
                  className={`w-full bg-obsidian-200 border px-3 py-2 text-xs text-cream/80 placeholder:text-cream/25 outline-none font-mono ${
                    phoneError ? 'border-red-400/70 focus:border-red-400' : 'border-gold/15 focus:border-gold/40'
                  }`}
                  placeholder="+9725..."
                />
                {phoneError && (
                  <p className="mt-1 text-[11px] text-red-400" lang="ar">
                    {phoneError}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-[11px] text-cream/40 mb-1" lang="ar">
                  ملاحظات إضافية
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  dir="rtl"
                  rows={3}
                  className="w-full bg-obsidian-200 border border-gold/15 px-3 py-2 text-xs text-cream/80 placeholder:text-cream/25 outline-none focus:border-gold/40 resize-none"
                  placeholder="مثلاً: عدد الأشخاص، وقت التسليم، أي طلبات خاصة..."
                />
              </div>
            </div>
          </div>

          <a
            href={items.length && !phoneError ? whatsappLink : '#'}
            target={items.length && !phoneError ? '_blank' : undefined}
            rel={items.length && !phoneError ? 'noopener noreferrer' : undefined}
            className={`btn-gold block text-center py-4 text-sm font-bold tracking-[0.2em] rounded-sm uppercase ${
              !items.length || phoneError ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            <span lang="ar">إرسال الطلب عبر واتساب</span>
          </a>

          <p className="text-[11px] text-cream/35 text-right" lang="ar">
            سيتم فتح واتساب مع رسالة جاهزة تحتوي على تفاصيل طلبك. بعد الإرسال، ستقوم بيتنا
            بتأكيد الطلب معك يدوياً.
          </p>
        </div>
      </div>
    </div>
  );
}

