'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const t = useTranslations('hero');
  const tNav = useTranslations('nav');
  const [loaded, setLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Particle canvas
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
    }> = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        alpha: 0,
        targetAlpha: Math.random() * 0.5 + 0.1,
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
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 165, 106, ${p.alpha})`;
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
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-obsidian lg:pt-10">
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Radial ambient lights */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #C9A56A, transparent 65%)' }}
        />
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #F4C095, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[320px] h-[320px] rounded-full opacity-[0.14]"
          style={{ background: 'radial-gradient(circle, #3D5A40, transparent 70%)' }}
        />
      </div>

      {/* Decorative corner ornaments */}
      <div className="absolute top-24 left-8 opacity-10 hidden lg:block">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M0 80 L0 0 L80 0" stroke="#C9A56A" strokeWidth="0.5" fill="none"/>
          <path d="M8 80 L8 8 L80 8" stroke="#C9A56A" strokeWidth="0.5" fill="none" opacity="0.5"/>
          <circle cx="0" cy="0" r="4" fill="#C9A56A" opacity="0.6"/>
        </svg>
      </div>
      <div className="absolute top-24 right-8 opacity-10 hidden lg:block">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M80 80 L80 0 L0 0" stroke="#C9A56A" strokeWidth="0.5" fill="none"/>
          <path d="M72 80 L72 8 L0 8" stroke="#C9A56A" strokeWidth="0.5" fill="none" opacity="0.5"/>
          <circle cx="80" cy="0" r="4" fill="#C9A56A" opacity="0.6"/>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">

        {/* Logo - floating */}
        <div
          className={`transition-all duration-1000 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="relative w-32 h-32 sm:w-44 sm:h-44 mx-auto mb-8 animate-float">
            <div className="absolute inset-0 rounded-full bg-gold-DEFAULT/5 blur-2xl scale-150" />
            <Image
              src="/logo.png?v=beitna1"
              alt="بيتنا Beitna"
              fill
              className="object-contain relative z-10 drop-shadow-[0_0_30px_rgba(201,165,106,0.5)]"
              priority
            />
          </div>
        </div>

        {/* Tagline pill */}
        <div
          className={`transition-all duration-1000 delay-400 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-gold-DEFAULT/40" />
            <span className="section-label text-[0.65rem]">{t('tagline')}</span>
            <div className="w-8 h-px bg-gold-DEFAULT/40" />
          </div>
        </div>

        {/* Subtitle */}
        <div
          className={`transition-all duration-1000 delay-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <p className="text-cream/60 text-lg sm:text-xl font-light mb-12 max-w-md leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* CTA Button */}
        <div
          className={`transition-all duration-1000 delay-800 flex flex-col sm:flex-row gap-4 items-center ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <Link
            href="/menu"
            className="btn-gold px-8 py-4 text-sm font-bold tracking-[0.2em] rounded-sm uppercase min-w-[200px] text-center"
          >
            {t('cta_reserve')}
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="section-label text-[0.6rem] text-cream/30">{t('scroll_hint')}</span>
        <ChevronDown
          size={16}
          className="text-gold-DEFAULT/50 animate-bounce"
          strokeWidth={1.5}
        />
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-obsidian to-transparent z-5 pointer-events-none" />
    </section>
  );
}
