import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import AboutSection from '@/components/home/AboutSection';
import ContactSection from '@/components/home/ContactSection';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  return { title: 'بيتنا | Beitna — أكل بيتنا لبيتك', description: t('subtitle') };
}

export default async function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ContactSection />
    </>
  );
}
