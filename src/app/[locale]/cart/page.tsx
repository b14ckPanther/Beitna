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
    <div className="min-h-screen bg-[#FDFCF9] pt-24">
      <div className="relative py-16 sm:py-24 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center top, rgba(201,165,106,0.08) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gold-dark/20" />
            <span className="section-label !text-gold-dark font-black" lang="ar">
              سلة الطلبات
            </span>
            <div className="h-px w-12 bg-gold-dark/20" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-obsidian mb-6 tracking-tight" lang="ar">
            طلباتك المختارة
          </h1>
          <p className="text-obsidian/60 text-lg max-w-2xl mx-auto font-medium" lang="ar">
            أضف الأطباق التي تحب، ثم أرسل الطلب عبر واتساب لنبدأ التحضير لبيتك.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 grid gap-12 lg:grid-cols-[1.5fr,1fr]">
        {/* Items */}
        <div className="space-y-6">
          {items.length === 0 ? (
            <div className="bg-white border border-gold/10 p-12 text-center text-obsidian/40 text-lg font-medium rounded-sm shadow-sm" lang="ar">
              السلة فارغة حالياً. <br/>ارسم مائدتك من صفحة القائمة.
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4">
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
                      className="bg-white border border-gold/10 flex items-center justify-between gap-6 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 rounded-sm relative group"
                    >
                      <div className="absolute top-0 left-0 bottom-0 w-1 bg-gold-dark scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                      <div className="flex-1 text-right min-w-0">
                        <p className="text-obsidian font-black text-lg sm:text-xl mb-1">
                          <span lang="ar">{name}</span>
                        </p>
                        <p className="text-gold-dark font-black text-lg">
                          {item.price} ₪{' '}
                          <span className="text-obsidian/30 text-xs font-medium">× {item.quantity}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center border-2 border-gold/10 rounded-sm bg-gray-50/50">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, Math.max(0, item.quantity - 1))
                            }
                            className="px-4 py-2 text-lg font-black text-gold-dark hover:bg-gold-dark hover:text-white transition-all"
                          >
                            -
                          </button>
                          <span className="px-5 py-2 text-sm font-black text-obsidian min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-4 py-2 text-lg font-black text-gold-dark hover:bg-gold-dark hover:text-white transition-all"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-[13px] font-black text-red-500/60 hover:text-red-600 transition-colors uppercase tracking-widest"
                          lang="ar"
                        >
                          إزالة
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between p-6 border-t-2 border-gold/5 bg-white/50">
                <button
                  type="button"
                  onClick={clear}
                  className="text-red-500 font-black text-xs uppercase tracking-widest hover:text-red-600 transition-colors"
                  lang="ar"
                >
                  مسح السلة
                </button>
                <div className="text-right">
                  <p className="text-obsidian/40 text-xs font-bold uppercase tracking-widest mb-1" lang="ar">المجموع الإجمالي</p>
                  <p className="text-2xl font-black text-obsidian" lang="ar">
                    {totalPrice.toFixed(2)} ₪
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Customer info + WhatsApp CTA */}
        <div className="space-y-6">
          <div className="bg-white border border-gold/15 p-8 space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] rounded-sm relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gold-gradient" />
            <div className="flex items-center justify-between border-b border-gold/5 pb-4">
               <span className="text-[10px] font-black text-gold-dark uppercase tracking-[0.3em]">Details</span>
               <h2 className="text-sm font-black text-obsidian/80 text-right uppercase tracking-widest" lang="ar">
                 تفاصيل التواصل
               </h2>
            </div>
            
            <div className="space-y-6 text-right">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-gold-dark/60 mb-2" lang="ar">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  dir="rtl"
                  className="w-full bg-gray-50 border border-gold/10 hover:border-gold/30 focus:border-gold/50 px-4 py-4 text-sm font-medium text-obsidian placeholder:text-obsidian/20 outline-none transition-all rounded-sm"
                  placeholder="كيف نناديك؟"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-gold-dark/60 mb-2" lang="ar">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  dir="ltr"
                  className={`w-full border px-4 py-4 text-sm font-bold text-obsidian placeholder:text-obsidian/20 outline-none transition-all rounded-sm font-mono ${
                    phoneError ? 'bg-red-50/30 border-red-200 focus:border-red-400' : 'bg-gray-50 border-gold/10 focus:border-gold/50'
                  }`}
                  placeholder="05..."
                />
                {phoneError && (
                  <p className="mt-2 text-[11px] font-bold text-red-500" lang="ar">
                    {phoneError}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-gold-dark/60 mb-2" lang="ar">
                  ملاحظات إضافية
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  dir="rtl"
                  rows={4}
                  className="w-full bg-gray-50 border border-gold/10 hover:border-gold/30 focus:border-gold/50 px-4 py-4 text-sm font-medium text-obsidian placeholder:text-obsidian/20 outline-none transition-all rounded-sm resize-none"
                  placeholder="مثلاً: أي استفسار حول المكونات أو وقت التسليم..."
                />
              </div>
            </div>
          </div>

          <a
            href={items.length && !phoneError ? whatsappLink : '#'}
            target={items.length && !phoneError ? '_blank' : undefined}
            rel={items.length && !phoneError ? 'noopener noreferrer' : undefined}
            className={`btn-gold block text-center py-5 text-sm font-black tracking-[0.3em] rounded-sm uppercase shadow-xl transition-all duration-300 ${
              !items.length || phoneError ? 'opacity-30 grayscale cursor-not-allowed' : 'hover:shadow-gold/30 hover:-translate-y-1'
            }`}
          >
            <span lang="ar">تأكيد الطلب عبر واتساب</span>
          </a>

          <div className="bg-gold/5 border-r-4 border-gold-dark p-6">
            <p className="text-[12px] font-medium text-obsidian/60 leading-relaxed text-right" lang="ar">
              سنقوم بتلقي طلبك فوراً وتأكيد التفاصيل معك يدوياً عبر واتساب. <br/>
              <span className="text-gold-dark font-black">شكراً لاختيارك بيتنا!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

