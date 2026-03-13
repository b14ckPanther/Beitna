import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import OccasionForm from '@/components/occasions/OccasionForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'occasions' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function OccasionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'occasions' });

  return (
    <div className="min-h-screen bg-obsidian pt-24">
      {/* Header */}
      <div className="relative py-16 sm:py-20 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center top, rgba(201,165,106,0.07) 0%, transparent 60%)' }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gold-DEFAULT/30" />
            <span className="section-label" lang="ar">
              {t('title')}
            </span>
            <div className="h-px w-12 bg-gold-DEFAULT/30" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-cream/90 mb-4" lang="ar">
            {t('headline')}
          </h1>
          <p className="text-cream/40 text-base max-w-xl mx-auto" lang="ar">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="glass-card p-6 sm:p-10">
          <OccasionForm />
        </div>
      </div>
    </div>
  );
}

