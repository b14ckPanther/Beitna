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
    <aside className="w-60 bg-obsidian-50 border-r border-gold/10 flex flex-col min-h-screen fixed left-0 top-0 bottom-0 z-30">
      {/* Logo */}
      <div className="p-6 border-b border-gold/10 flex items-center gap-3">
        <Image src="/logo.png?v=beitna1" alt="Beitna" width={52} height={52} className="object-contain" />
        <div>
          <p className="text-sm font-bold text-cream/90">Beitna-بيتنا</p>
          <p className="text-[10px] text-gold-DEFAULT tracking-widest uppercase">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-gold/10 text-gold-DEFAULT border border-gold/20'
                  : 'text-cream/50 hover:text-cream/80 hover:bg-white/5 border border-transparent'
              )}
            >
              <Icon size={15} strokeWidth={1.5} className={isActive ? 'text-gold-DEFAULT' : 'text-cream/40 group-hover:text-cream/60'} />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight size={12} className="text-gold-DEFAULT/50" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-gold/10 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-cream/40 hover:text-cream/70 transition-colors duration-200 rounded-sm hover:bg-white/5"
        >
          <ExternalLink size={14} strokeWidth={1.5} />
          <span>View Website</span>
        </a>
        <form action="/admin/logout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400/60 hover:text-red-400 transition-colors duration-200 rounded-sm hover:bg-red-400/5"
          >
            <LogOut size={14} strokeWidth={1.5} />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
