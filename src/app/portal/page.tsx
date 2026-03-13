'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react';

export default function PortalPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Particle field ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const GOLD = 'rgba(201,165,106,';
    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.5 + 0.1,
      flicker: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.flicker += 0.025;
        const a = p.alpha * (0.7 + 0.3 * Math.sin(p.flicker));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = GOLD + a + ')';
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -4) {
          p.y = canvas.height + 4;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -4) p.x = canvas.width + 4;
        if (p.x > canvas.width + 4) p.x = -4;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `password=${encodeURIComponent(password)}`,
      });

      if (res.ok) {
        router.push('/admin');
      } else {
        setError('كلمة المرور غير صحيحة. حاول مجدداً.');
        setPassword('');
        inputRef.current?.focus();
      }
    } catch {
      setError('حدث خطأ. حاول مجدداً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-obsidian">
      {/* Ambient radial glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-gold-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full bg-gold-500/8 blur-[100px]" />
      </div>

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0"
      />

      {/* Texture grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Gold shimmer border */}
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-gold-500/50 via-gold-700/15 to-gold-500/10" />

        <div className="relative rounded-2xl bg-gradient-to-b from-[#0f2019] to-[#071611] px-8 py-12 shadow-[0_40px_80px_rgba(0,0,0,0.7)]">

          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-6">
              <div className="absolute -inset-4 rounded-full bg-gold-500/10 blur-xl" />
              <Image
                src="/logo.png?v=beitna1"
                alt="بيتنا"
                width={128}
                height={128}
                className="relative rounded-full object-contain"
                priority
              />
            </div>

            <h1 className="text-3xl font-bold tracking-wide text-gold-400 mb-1" lang="ar">
              بيتنا
            </h1>
            <p className="text-xs tracking-[0.25em] uppercase text-gold-600/60 font-light" lang="ar">
              بوابة الإدارة
            </p>

            {/* Divider */}
            <div className="mt-6 flex items-center gap-3 w-full">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold-700/30" />
              <Lock size={10} className="text-gold-700/50" />
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold-700/30" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs tracking-[0.2em] uppercase text-gold-600/70 text-right" lang="ar">
                كلمة المرور
              </label>

              <div
                className={`relative transition-all duration-300 ${
                  focused
                    ? 'shadow-[0_0_0_1px_rgba(212,175,55,0.4),0_0_20px_rgba(212,175,55,0.08)]'
                    : 'shadow-[0_0_0_1px_rgba(212,175,55,0.12)]'
                } rounded-xl`}
              >
                <input
                  ref={inputRef}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="••••••••••••"
                  dir="ltr"
                  required
                  className="w-full bg-[#0d0a05]/80 text-cream placeholder-gold-700/30 rounded-xl px-4 py-4 pr-12 text-center text-lg tracking-[0.3em] focus:outline-none transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-700/40 hover:text-gold-500/70 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Error */}
              {error && (
                <p className="text-center text-xs text-red-400/80 pt-1 animate-fade-up">
                  <span lang="ar">{error}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="group relative w-full overflow-hidden rounded-xl py-4 text-sm font-semibold tracking-[0.2em] uppercase transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {/* Base gradient */}
              <span className="absolute inset-0 bg-gradient-to-r from-gold-700 via-gold-500 to-gold-700 transition-all duration-500" />
              {/* Shimmer sweep */}
              <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />

              <span className="relative flex items-center justify-center gap-2 text-obsidian-900">
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span lang="ar">جاري التحقق...</span>
                  </>
                ) : (
                  <span lang="ar">دخول</span>
                )}
              </span>
            </button>
          </form>

          {/* Footer stamp */}
          <p className="mt-10 text-center text-[10px] tracking-[0.15em] text-gold-700/25 uppercase">
            Beitna Home Kitchen &mdash; Private Access
          </p>
        </div>
      </div>
    </div>
  );
}
