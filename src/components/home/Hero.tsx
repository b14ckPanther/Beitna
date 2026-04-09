'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const t = useTranslations('hero');
  const [loaded, setLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Particle canvas - Updated for Light Theme
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Array<{
      x: number; y: number; r: number;
      vx: number; vy: number; alpha: number;
      targetAlpha: number;
      color: string;
    }> = [];

    // Subtle Forest Green and Gold particles
    for (let i = 0; i < 60; i++) {
      const isGold = Math.random() > 0.5;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -Math.random() * 0.3 - 0.1,
        alpha: 0,
        targetAlpha: isGold ? Math.random() * 0.3 + 0.1 : Math.random() * 0.1 + 0.05,
        color: isGold ? '201, 165, 106' : '26, 36, 33',
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += (p.targetAlpha - p.alpha) * 0.02;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#FDFCF9] lg:pt-10">
      {/* Background Masterpiece Visual */}
      <div 
        className={`absolute inset-0 z-0 transition-all duration-1500 ease-out ${loaded ? 'opacity-[0.15] scale-100 blur-0' : 'opacity-0 scale-110 blur-xl'}`}
      >
        <Image 
          src="/hero-platter.png" 
          alt="Artisan Feast" 
          fill 
          className="object-cover object-center translate-y-20 lg:translate-y-0"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FDFCF9] via-transparent to-[#FDFCF9]" />
      </div>

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-1" />

      {/* Radial soft lights for depth */}
      <div className="absolute inset-0 pointer-events-none z-1">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full opacity-[0.2]"
          style={{ background: 'radial-gradient(circle, #C9A56A15, transparent 75%)' }}
        />
      </div>

      {/* Decorative Ornaments - Dark for contrast */}
      <div className="absolute top-24 left-8 opacity-20 hidden lg:block z-10 transition-all duration-1000 delay-500">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M0 80 L0 0 L80 0" stroke="#1A2421" strokeWidth="0.5" fill="none"/>
          <path d="M8 80 L8 8 L80 8" stroke="#1A2421" strokeWidth="0.5" fill="none" opacity="0.3"/>
          <circle cx="0" cy="0" r="4" fill="#C9A56A" opacity="0.8"/>
        </svg>
      </div>
      <div className="absolute top-24 right-8 opacity-20 hidden lg:block z-10 transition-all duration-1000 delay-500">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M80 80 L80 0 L0 0" stroke="#1A2421" strokeWidth="0.5" fill="none"/>
          <path d="M72 80 L72 8 L0 8" stroke="#1A2421" strokeWidth="0.5" fill="none" opacity="0.3"/>
          <circle cx="80" cy="0" r="4" fill="#C9A56A" opacity="0.8"/>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">

        {/* Logo - floating */}
        <div
          className={`transition-all duration-1000 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="relative w-32 h-32 sm:w-48 sm:h-48 mx-auto mb-10 animate-float">
            <div className="absolute inset-0 rounded-full bg-gold-DEFAULT/10 blur-3xl scale-110" />
            <Image
              src="/logo.png?v=beitna1"
              alt="بيتنا Beitna"
              fill
              className="object-contain relative z-10 brightness-[0.2] contrast-[1.5]"
              priority
            />
          </div>
        </div>

        {/* Tagline pill */}
        <div
          className={`transition-all duration-1000 delay-400 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-10 sm:w-16 bg-gold-DEFAULT/40" />
            <span className="text-xs font-bold tracking-[0.4em] uppercase text-gold-dark/80">{t('tagline')}</span>
            <div className="h-px w-10 sm:w-16 bg-gold-DEFAULT/40" />
          </div>
        </div>

        {/* Subtitle */}
        <div
          className={`transition-all duration-1000 delay-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <p className="text-obsidian/60 text-lg sm:text-2xl font-light mb-14 max-w-lg leading-relaxed italic">
            "{t('subtitle')}"
          </p>
        </div>

        {/* CTA Button */}
        <div
          className={`transition-all duration-1000 delay-800 flex flex-col sm:flex-row gap-4 items-center ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <Link
            href="/menu"
            className="btn-gold px-12 py-5 text-sm font-bold tracking-[0.3em] rounded-sm uppercase min-w-[240px] text-center shadow-xl hover:shadow-gold-DEFAULT/20 transition-all duration-500 hover:-translate-y-1"
          >
            {t('cta_reserve')}
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 opacity-40">
        <span className="font-bold text-[0.7rem] uppercase tracking-widest text-obsidian/40">{t('scroll_hint')}</span>
        <ChevronDown
          size={18}
          className="text-gold-dark animate-bounce"
          strokeWidth={2}
        />
      </div>

      {/* Bottom Artisan Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#FDFCF9] to-transparent z-5 pointer-events-none" />
    </section>
  );
}
