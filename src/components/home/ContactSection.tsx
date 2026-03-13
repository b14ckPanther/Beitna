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
    <section ref={ref} id="contact" className="relative py-28 sm:py-36 bg-obsidian overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-DEFAULT/20 to-transparent" />
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[400px] w-full"
          style={{ background: 'radial-gradient(ellipse at center, rgba(201,165,106,0.03) 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div
            className={`text-center mb-16 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gold-DEFAULT/30" />
              <span className="section-label">{tNav('contact')}</span>
              <div className="h-px w-12 bg-gold-DEFAULT/30" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-cream/90 mb-4">
              {t('contact_title')}
            </h2>
            <p className="text-cream/40 text-sm max-w-md mx-auto" lang="ar">
              للحجز أو الاستفسار، تواصل معنا عبر الهاتف أو واتساب
            </p>
          </div>

          {/* Contact Cards */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 transition-all duration-1000 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {contacts.map(({ icon: Icon, label, href, sublabel, dir, external }) => {
              const content = (
                <div className="glass-card glass-card-hover text-center p-6 h-full flex flex-col items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center group-hover:border-gold-DEFAULT group-hover:bg-gold/5 transition-all duration-300">
                    <Icon size={16} className="text-gold-DEFAULT" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-cream/80 text-sm font-medium" dir={dir}>{label}</p>
                    <p className="text-cream/35 text-xs mt-1">{sublabel}</p>
                  </div>
                  {external && (
                    <ExternalLink size={10} className="text-gold-DEFAULT/30 group-hover:text-gold-DEFAULT/60 transition-colors" />
                  )}
                </div>
              );

              return href ? (
                <a
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                >
                  {content}
                </a>
              ) : (
                <div key={label}>{content}</div>
              );
            })}
          </div>

          {/* Primary CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-400 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <Link
              href="/experiences"
              className="btn-gold px-8 py-4 text-sm font-bold tracking-[0.2em] rounded-sm uppercase text-center"
            >
              <span lang="ar">مناسبات خاصة</span>
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold px-8 py-4 text-sm font-semibold tracking-wide rounded-sm uppercase text-center flex items-center justify-center gap-2.5"
            >
              <WhatsAppIcon size={15} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
