'use client';

import { useInView } from 'react-intersection-observer';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Sparkles, Heart, Star } from 'lucide-react';

const experienceIcons = [Sparkles, Heart, Star];

const experienceKeys = ['ramadan', 'private', 'newyear'] as const;

const experienceColors = [
  'from-gold-DEFAULT/20 to-transparent',
  'from-rose-500/10 to-transparent',
  'from-purple-500/10 to-transparent',
];

export default function ExperiencesPreview() {
  const t = useTranslations('experiences');
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section ref={ref} className="relative py-28 sm:py-36 bg-obsidian-50 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="ornament-line absolute top-0 left-0 right-0" />
        <div className="ornament-line absolute bottom-0 left-0 right-0" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gold-DEFAULT/30" />
            <span className="section-label">{t('title')}</span>
            <div className="h-px w-12 bg-gold-DEFAULT/30" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-cream/90 mb-4">
            {t('subtitle')}
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {experienceKeys.map((key, i) => {
            const Icon = experienceIcons[i];
            return (
              <div
                key={key}
                style={{ transitionDelay: `${i * 150}ms` }}
                className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              >
                <div className="glass-card glass-card-hover relative overflow-hidden group h-full p-8 rounded-none">
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${experienceColors[i]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  {/* Top line accent */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-DEFAULT/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center mb-6 group-hover:border-gold-DEFAULT group-hover:bg-gold/8 transition-all duration-300 mr-auto">
                      <Icon size={18} className="text-gold-DEFAULT" strokeWidth={1.5} />
                    </div>

                    <h3 className="text-xl font-bold text-cream/90 mb-3 text-right">
                      {t(`${key}.title` as `ramadan.title`)}
                    </h3>
                    <p className="text-cream/50 text-sm leading-relaxed text-right">
                      {t(`${key}.desc` as `ramadan.desc`)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div
          className={`text-center mt-12 transition-all duration-1000 delay-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <Link
            href="/experiences"
            className="inline-flex items-center gap-3 btn-outline-gold px-8 py-3.5 text-sm font-semibold tracking-widest rounded-sm uppercase group"
          >
            <span>{t('title')}</span>
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
