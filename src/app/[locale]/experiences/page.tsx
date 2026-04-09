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
    <div className="min-h-screen bg-[#FDFCF9] pt-24">
      {/* Header */}
      <div className="relative py-16 sm:py-20 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center top, rgba(201,165,106,0.08) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gold-dark/20" />
            <span className="section-label !text-gold-dark font-black" lang="ar">
              {t('title')}
            </span>
            <div className="h-px w-12 bg-gold-dark/20" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-obsidian mb-6 tracking-tight" lang="ar">
            {t('headline')}
          </h1>
          <p className="text-obsidian/60 text-lg max-w-2xl mx-auto font-medium" lang="ar">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="bg-white border border-gold/10 shadow-[0_20px_60px_rgba(0,0,0,0.03)] p-6 sm:p-12 rounded-sm relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gold-gradient opacity-30" />
          <OccasionForm />
        </div>
      </div>
    </div>
  );
}

