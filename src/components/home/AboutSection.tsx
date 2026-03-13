'use client';

import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { useTranslations } from 'next-intl';
import { Clock, MapPin } from 'lucide-react';

export default function AboutSection() {
  const t = useTranslations('about');

  const { ref: sectionRef, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section ref={sectionRef} className="relative py-28 sm:py-36 overflow-hidden bg-obsidian">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] -translate-y-1/2 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #C9A56A, transparent 70%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: Visual */}
          <div
            className={`relative transition-all duration-1000 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
          >
            {/* Decorative frame */}
            <div className="relative">
              {/* Outer frame lines */}
              <div className="absolute -top-4 -right-4 w-full h-full border border-gold/15 rounded-none" />
              <div className="absolute -top-2 -right-2 w-full h-full border border-gold/8 rounded-none" />

              {/* Main visual block */}
              <div className="relative bg-obsidian-200 border border-gold/20 overflow-hidden aspect-[4/5]">
                {/* Atmospheric gradient inside */}
                <div className="absolute inset-0"
                  style={{ background: 'radial-gradient(ellipse at center, rgba(201,165,106,0.06) 0%, transparent 70%)' }} />

                {/* Central logo mark */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 p-12">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
                    <Image
                      src="/logo.png?v=beitna1"
                      alt="بيتنا Beitna"
                      fill
                      className="object-contain drop-shadow-[0_0_20px_rgba(201,165,106,0.3)]"
                    />
                  </div>

                  <div className="ornament-line w-full my-3" />

                  {/* Story-style stats strip */}
                  <div className="w-full mt-6">
                    <div className="glass-card px-4 py-3 text-center space-y-1">
                      <p className="text-cream/30 text-[10px]" lang="ar">
                        بالأرقام
                      </p>
                      <p className="text-cream/70 text-xs sm:text-sm leading-relaxed" lang="ar">
                        أكثر من{' '}
                        <span className="gold-text font-semibold text-base sm:text-lg">30</span>{' '}
                        سنة خبرة، وأكثر من{' '}
                        <span className="gold-text font-semibold text-base sm:text-lg">150+</span>{' '}
                        طبق منزلي، وأكثر من{' '}
                        <span className="gold-text font-semibold text-base sm:text-lg">100+</span>{' '}
                        زبون راضٍ.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right: Text */}
          <div
            className={`transition-all duration-1000 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
          >
            {/* Section label */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12 bg-gold-DEFAULT/30" />
              <span className="section-label text-xl">{t('label')}</span>
              <div className="h-px w-12 bg-gold-DEFAULT/30" />
            </div>

            <div className="ornament-line w-full mb-8" />

            <p className="text-cream/60 text-base sm:text-lg leading-loose text-center sm:text-right mb-12">
              {t('body')}
            </p>

            {/* Info pills */}
            <div className="space-y-4 mb-10">
              {[
                { icon: Clock, text: t('open_hours'), sub: t('days') },
                { icon: MapPin, text: t('location'), sub: '', href: 'https://waze.com/ul/hsvc5f2pe3' },
              ].map(({ icon: Icon, text, sub, href }) => {
                const content = (
                  <div className="flex items-center gap-4 glass-card px-5 py-4 justify-end group cursor-pointer">
                    <div className="text-right">
                      <p className="text-cream/80 text-sm font-medium">{text}</p>
                      {sub && <p className="text-cream/40 text-xs mt-0.5">{sub}</p>}
                    </div>
                    <div className="w-9 h-9 rounded-full border border-gold/20 flex items-center justify-center flex-shrink-0 group-hover:border-gold-DEFAULT group-hover:bg-gold/5 transition-all duration-300">
                      <Icon size={14} className="text-gold-DEFAULT" strokeWidth={1.5} />
                    </div>
                  </div>
                );
                return href ? (
                  <a key={text} href={href} target="_blank" rel="noopener noreferrer">
                    {content}
                  </a>
                ) : (
                  <div key={text}>{content}</div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
