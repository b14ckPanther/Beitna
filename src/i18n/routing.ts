import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ar', 'he', 'en'],
  defaultLocale: 'ar',
  localePrefix: 'as-needed',
  localeDetection: false, // Always default to Arabic, never auto-detect browser language
});
