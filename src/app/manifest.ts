import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'بيتنا | Beitna Home Kitchen',
    short_name: 'بيتنا',
    description: 'الأصالة في كل لقمة - أفضل المأكولات المنزلية',
    start_url: '/',
    display: 'standalone',
    background_color: '#FDFCF9',
    theme_color: '#071611',
    icons: [
      {
        src: '/icon-192.png?v=beitna2',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png?v=beitna2',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png?v=beitna2',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
