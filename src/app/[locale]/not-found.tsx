import { Link } from '@/i18n/navigation';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center text-center px-4">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(201,165,106,0.04) 0%, transparent 60%)' }}
      />
      <div className="relative z-10">
        <p className="gold-text text-8xl font-black mb-4">404</p>
        <div className="ornament-line w-48 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-cream/80 mb-3">الصفحة غير موجودة</h1>
        <p className="text-cream/40 text-sm mb-8">عذراً، لم نتمكن من إيجاد الصفحة المطلوبة</p>
        <Link href="/" className="btn-gold px-8 py-3.5 text-sm font-bold tracking-widest rounded-sm uppercase">
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
