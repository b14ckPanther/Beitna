'use client';

import { useInView } from 'react-intersection-observer';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Phone, MapPin, Clock, ExternalLink } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function ContactSection() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const whatsappLink = getWhatsAppLink(
    '0503274101',
    'مرحباً، أود الاستفسار عن طلب من قائمة بيتنا-بيتنا'
  );

  const contacts = [
    {
      icon: Phone,
      label: t('phone'),
      href: `tel:${t('phone')}`,
      sublabel: t('contact_title'),
      dir: 'ltr' as const,
    },
    {
      icon: MapPin,
      label: t('location'),
      href: 'https://waze.com/ul/hsvc5f2pe3',
      sublabel: t('waze'),
      dir: 'rtl' as const,
      external: true,
    },
    {
      icon: Clock,
      label: t('hours'),
      href: null,
      sublabel: t('days'),
      dir: 'ltr' as const,
    },
  ];

  return (
    <section ref={ref} id="contact" className="relative py-28 sm:py-36 bg-[#FDFCF9] overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-DEFAULT/40 to-transparent opacity-30" />
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[500px] w-full"
          style={{ background: 'radial-gradient(ellipse at center, rgba(201,165,106,0.06) 0%, transparent 75%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div
            className={`text-center mb-16 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-10 bg-gold-DEFAULT/50" />
              <span className="text-xs font-bold tracking-[0.4em] uppercase text-gold-dark/80">{tNav('contact')}</span>
              <div className="h-px w-10 bg-gold-DEFAULT/50" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-obsidian tracking-tight mb-6">
              {t('contact_title')}
            </h2>
            <p className="text-obsidian/50 text-base max-w-md mx-auto italic" lang="ar">
              للحجز أو الاستفسار، تواصل معنا عبر الهاتف أو واتساب
            </p>
          </div>

          {/* Contact Cards */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 transition-all duration-1000 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {contacts.map(({ icon: Icon, label, href, sublabel, dir, external }) => {
              const content = (
                <div className="bg-white border border-gold/10 shadow-sm hover:shadow-xl hover:border-gold-DEFAULT text-center p-8 h-full flex flex-col items-center gap-5 group transition-all duration-500 rounded-sm">
                  <div className="w-14 h-14 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center group-hover:bg-gold/10 transition-all duration-300">
                    <Icon size={18} className="text-gold-dark" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-obsidian font-black text-base" dir={dir}>{label}</p>
                    <p className="text-obsidian/40 text-[10px] uppercase tracking-widest mt-1.5 font-bold">{sublabel}</p>
                  </div>
                  {external && (
                    <div className="mt-auto">
                      <ExternalLink size={12} className="text-gold-DEFAULT/40 group-hover:text-gold-dark transition-colors" />
                    </div>
                  )}
                </div>
              );

              return href ? (
                <a
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className="block h-full"
                >
                  {content}
                </a>
              ) : (
                <div key={label} className="h-full">{content}</div>
              );
            })}
          </div>

          {/* Primary CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-5 justify-center transition-all duration-1000 delay-400 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <Link
              href="/experiences"
              className="btn-gold px-10 py-5 text-sm font-bold tracking-[0.2em] rounded-sm uppercase text-center shadow-lg hover:-translate-y-1 transition-all"
            >
              <span lang="ar">مناسبات خاصة</span>
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 text-sm font-bold tracking-[0.2em] border-2 border-gold-dark text-gold-dark hover:bg-gold-dark hover:text-white rounded-sm uppercase text-center flex items-center justify-center gap-3 transition-all duration-500 hover:-translate-y-1"
            >
              <WhatsAppIcon size={18} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
