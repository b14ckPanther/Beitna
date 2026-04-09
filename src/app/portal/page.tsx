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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FDFCF9]">
      {/* Ambient radial glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-gold-400/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full bg-gold-300/10 blur-[100px]" />
      </div>

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
      />

      {/* Texture grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="bg-white border border-gold/15 p-12 shadow-[0_30px_100px_rgba(0,0,0,0.06)] rounded-sm relative group">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gold-gradient" />

          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative w-32 h-32 mb-8">
              <Image
                src="/logo.png?v=beitna1"
                alt="بيتنا"
                fill
                className="brightness-[0.15] contrast-[1.5] object-contain"
                priority
              />
            </div>

            <h1 className="text-2xl font-black tracking-tight text-obsidian uppercase mb-1">
              Beitna Portal
            </h1>
            <p className="text-[10px] tracking-[0.4em] uppercase text-gold-dark font-black" lang="ar">
              بوابة الإدارة
            </p>

            {/* Divider */}
            <div className="mt-8 flex items-center gap-4 w-full">
              <div className="flex-1 h-px bg-gold/10" />
              <Lock size={12} className="text-gold-dark/30" />
              <div className="flex-1 h-px bg-gold/10" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-black tracking-[0.3em] uppercase text-obsidian/40 text-right" lang="ar">
                كلمة المرور الآمنة
              </label>

              <div className="relative group/input">
                <input
                  ref={inputRef}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="••••••••"
                  dir="ltr"
                  required
                  className="w-full bg-gray-50 text-obsidian font-black rounded-sm border border-gold/15 px-4 py-4 pr-12 text-center text-xl tracking-[0.4em] focus:bg-white focus:border-gold-dark/50 transition-all duration-300 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-dark/30 hover:text-gold-dark transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Error */}
              {error && (
                <p className="text-center text-xs text-red-600 font-bold pt-2 animate-shake">
                  <span lang="ar">{error}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="group relative w-full overflow-hidden rounded-sm py-5 text-xs font-black tracking-[0.3em] uppercase transition-all duration-500 disabled:opacity-30 disabled:grayscale btn-gold"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader2 size={16} className="animate-spin" />
                  <span lang="ar">جاري التحقق...</span>
                </div>
              ) : (
                <span lang="ar">دخول النظام</span>
              )}
            </button>
          </form>

          {/* Footer stamp */}
          <div className="mt-12 flex flex-col items-center gap-4">
             <div className="h-px w-12 bg-gold/10" />
             <p className="text-center text-[9px] font-black tracking-[0.2em] text-obsidian/20 uppercase leading-loose">
               Authorized Management Only <br/> Beitna Signature Suite
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
