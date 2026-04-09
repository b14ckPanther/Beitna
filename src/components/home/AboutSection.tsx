'use client';

import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { useTranslations } from 'next-intl';
import { Clock, MapPin } from 'lucide-react';

export default function AboutSection() {
  const t = useTranslations('about');

  const { ref: sectionRef, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section ref={sectionRef} className="relative py-28 sm:py-36 overflow-hidden bg-cream/30">
      {/* Signature Artisan Divider Top */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-dark to-transparent" />
        <div className="absolute bg-[#FDFCF9] px-4">
          <div className="w-1.5 h-1.5 rounded-full bg-gold-DEFAULT" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: Visual */}
          <div
            className={`relative transition-all duration-1000 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
          >
            {/* Elegant Artisan Frame */}
            <div className="relative group p-4">
              {/* Floating accents */}
              <div className="absolute -top-6 -left-6 w-12 h-12 border-t border-l border-gold/40 transition-all duration-700 group-hover:-top-2 group-hover:-left-2" />
              <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b border-r border-gold/40 transition-all duration-700 group-hover:-bottom-2 group-hover:-right-2" />

              <div className="relative bg-white shadow-2xl overflow-hidden aspect-[4/5] border border-gold/10">
                {/* Story and Heritage content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-10 p-12">
                  <div className="relative w-32 h-32 sm:w-44 sm:h-44 transform transition-transform duration-700 group-hover:scale-105">
                    <Image
                      src="/logo.png?v=beitna1"
                      alt="بيتنا Beitna"
                      fill
                      className="object-contain brightness-[0.2] contrast-[1.5]"
                    />
                  </div>

                  {/* Artisan Divider Small */}
                  <div className="relative w-3/4 flex items-center justify-center">
                    <div className="h-px w-full bg-gold-DEFAULT/30" />
                    <div className="absolute w-1 h-1 rounded-full bg-gold-DEFAULT" />
                  </div>

                  {/* Story-style stats strip */}
                  <div className="w-full">
                    <div className="bg-[#FDFCF9] border border-gold/10 px-6 py-5 text-center shadow-inner rounded-sm">
                      <p className="text-obsidian/40 text-[10px] uppercase tracking-[0.3em] font-bold mb-2" lang="ar">
                        {t('label')}
                      </p>
                      <p className="text-obsidian/80 text-sm sm:text-base leading-relaxed font-medium" lang="ar">
                        أكثر من{' '}
                        <span className="text-gold-dark font-black text-xl">30</span>{' '}
                        سنة خبرة، وأكثر من{' '}
                        <span className="text-gold-dark font-black text-xl">150+</span>{' '}
                        طبق منزلي بكل حب.
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
            {/* Section heading */}
            <div className="flex items-center gap-6 mb-10">
              <span className="text-3xl sm:text-5xl font-black text-obsidian tracking-tight leading-tight flex-shrink-0">
                {t('label')}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-gold/50 to-transparent" />
            </div>

            <p className="text-obsidian/70 text-lg sm:text-xl leading-loose mb-12 italic border-r-2 border-gold/20 pr-6">
              {t('body')}
            </p>

            {/* Info pills - Artisan Style */}
            <div className="space-y-4 mb-10">
              {[
                { icon: Clock, text: t('open_hours'), sub: t('days') },
                { icon: MapPin, text: t('location'), sub: '', href: 'https://waze.com/ul/hsvc5f2pe3' },
              ].map(({ icon: Icon, text, sub, href }) => {
                const content = (
                  <div className="flex items-center gap-5 bg-white border border-gold/10 px-6 py-5 shadow-sm group hover:border-gold-DEFAULT transition-all duration-300 rounded-sm">
                    <div className="w-11 h-11 rounded-full bg-gold/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon size={16} className="text-gold-dark" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-obsidian font-bold text-base">{text}</p>
                      {sub && <p className="text-obsidian/50 text-xs mt-0.5 tracking-wide">{sub}</p>}
                    </div>
                  </div>
                );
                return href ? (
                  <a key={text} href={href} target="_blank" rel="noopener noreferrer" className="block transform hover:-translate-x-1 transition-transform">
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
