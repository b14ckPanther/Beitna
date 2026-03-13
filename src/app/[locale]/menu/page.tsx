import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { getFullMenu } from '@/lib/actions/menu-items';
import MenuPage from '@/components/menu/MenuPage';
import type { MenuCategory } from '@/lib/supabase';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'menu' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function MenuRoute() {
  let categories: MenuCategory[] = [];
  try {
    categories = await getFullMenu() as MenuCategory[];
  } catch {
    // DB not configured yet — show empty menu gracefully
  }
  return <MenuPage categories={categories} />;
}
