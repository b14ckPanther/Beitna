import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import ReservationForm from '@/components/reservations/ReservationForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'reservations' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function ReservationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'reservations' });

  return (
    <div className="min-h-screen bg-obsidian pt-24">
      {/* Page Header */}
      <div className="relative py-16 sm:py-20 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center top, rgba(201,165,106,0.07) 0%, transparent 60%)' }}
        />

        {/* Decorative corner ornaments */}
        <div className="absolute top-12 left-8 opacity-15 hidden lg:block">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path d="M0 60 L0 0 L60 0" stroke="#C9A56A" strokeWidth="0.5" fill="none"/>
            <circle cx="0" cy="0" r="3" fill="#C9A56A" opacity="0.6"/>
          </svg>
        </div>
        <div className="absolute top-12 right-8 opacity-15 hidden lg:block">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path d="M60 60 L60 0 L0 0" stroke="#C9A56A" strokeWidth="0.5" fill="none"/>
            <circle cx="60" cy="0" r="3" fill="#C9A56A" opacity="0.6"/>
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-xs text-cream/30 mb-8 font-mono" dir="ltr">
            <span>Home</span>
            <span>/</span>
            <span className="text-gold-DEFAULT">Reservations</span>
            <span>/</span>
            <span lang="ar">لحجز</span>
          </div>

          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gold-DEFAULT/30" />
            <span className="section-label">{t('title')}</span>
            <div className="h-px w-12 bg-gold-DEFAULT/30" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-cream/90 mb-4">
            {t('title')}
          </h1>
          <p className="text-cream/40 text-base max-w-md mx-auto">{t('subtitle')}</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <ReservationForm />
      </div>
    </div>
  );
}
