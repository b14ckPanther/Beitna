'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UtensilsCrossed, List, CalendarCheck, LogOut, ExternalLink, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/categories', label: 'Categories', icon: List },
  { href: '/admin/menu', label: 'Menu Items', icon: UtensilsCrossed },
  { href: '/admin/reservations', label: 'Reservations', icon: CalendarCheck },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gold/15 flex flex-col min-h-screen fixed left-0 top-0 bottom-0 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Logo */}
      <div className="p-8 border-b border-gold/5 flex items-center gap-4 bg-[#FDFCF9]">
        <div className="relative w-12 h-12">
          <Image 
            src="/logo.png?v=beitna1" 
            alt="Beitna" 
            fill 
            className="object-contain brightness-[0.2] contrast-[1.5]" 
          />
        </div>
        <div>
          <p className="text-sm font-black text-obsidian tracking-tight uppercase">Beitna</p>
          <p className="text-[10px] text-gold-dark font-black tracking-widest uppercase">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-6 space-y-2 mt-4">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-3.5 rounded-sm text-xs font-black tracking-widest uppercase transition-all duration-300 group relative',
                isActive
                  ? 'text-gold-dark bg-gold/5 border-l-4 border-gold-dark pl-3 shadow-sm'
                  : 'text-obsidian/40 hover:text-obsidian hover:bg-gray-50'
              )}
            >
              <Icon size={16} strokeWidth={isActive ? 2.5 : 1.5} className={cn(
                'transition-colors',
                isActive ? 'text-gold-dark' : 'text-obsidian/20 group-hover:text-gold-dark/40'
              )} />
              <span className="flex-1">{label}</span>
              {isActive && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-gold-dark animate-pulse" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-6 border-t border-gold/5 space-y-3 bg-[#FDFCF9]">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-obsidian/40 hover:text-gold-dark transition-all duration-300 rounded-sm hover:bg-white border border-transparent hover:border-gold/10"
        >
          <ExternalLink size={14} strokeWidth={2} />
          <span>View Site</span>
        </a>
        <form action="/admin/logout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500/50 hover:text-red-600 transition-all duration-300 rounded-sm hover:bg-red-50 border border-transparent hover:border-red-100"
          >
            <LogOut size={14} strokeWidth={2} />
            <span>Terminate Session</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
