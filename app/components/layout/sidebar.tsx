'use client';

import {
  HandHeart,
  House,
  Info,
  TrendingUp,
  Newspaper,
  ShieldCheck,
  Megaphone,
  Building2,
  X,
  ChevronRight,
  LogIn,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Logo } from './footer';

interface SideBarProps {
  show: boolean;
  isAuthenticated: boolean;
  onClose: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ show, onClose, isAuthenticated }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show) return;

    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.body.style.overflow = 'hidden';
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onClose]);

  if (!show) return null;

  const primary = [
    {
      name: 'Browse causes',
      desc: 'Find campaigns to support',
      icon: HandHeart,
      href: '/causes/get',
    },
    {
      name: 'Start a cause',
      desc: 'Launch your fundraiser',
      icon: Megaphone,
      href: '/startcauses',
    },
    {
      name: 'Local centers',
      desc: 'Verified charity organizations',
      icon: Building2,
      href: '/dashboard/centers/local-centers',
    },
  ];

  const secondary = [
    { name: 'How it works', icon: ShieldCheck, href: '/how-it-works' },
    { name: 'Our story', icon: Info, href: '/about' },
    { name: 'Safety ratings', icon: TrendingUp, href: '/how-it-works#ratings' },
    { name: 'Blog', icon: Newspaper, href: '/blog' },
    { name: 'Contact', icon: Info, href: '/contact' },
  ];

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
      <div
        ref={sidebarRef}
        className="absolute top-0 right-0 h-full w-[min(100%,22rem)] bg-white shadow-2xl flex flex-col animate-in"
        style={{ animation: 'ct-slide-in 0.22s ease-out' }}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100">
          <Logo nav />
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {isAuthenticated && (
            <Link
              href="/dashboard/donor"
              onClick={onClose}
              className="flex items-center gap-3 rounded-2xl bg-slate-900 text-white px-4 py-3.5 hover:bg-slate-800 transition-colors"
            >
              <House size={18} />
              <span className="font-semibold text-sm">Dashboard</span>
              <ChevronRight size={16} className="ml-auto opacity-60" />
            </Link>
          )}

          <div>
            <p className="px-1 mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Get started
            </p>
            <div className="space-y-1.5">
              {primary.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-3.5 py-3 hover:bg-white hover:border-slate-200 transition-colors"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <link.icon size={18} strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-900">{link.name}</span>
                    <span className="block text-xs text-slate-500 truncate">{link.desc}</span>
                  </span>
                  <ChevronRight size={16} className="ml-auto text-slate-300" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="px-1 mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Learn more
            </p>
            <div className="space-y-0.5">
              {secondary.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <link.icon size={16} className="text-slate-400" />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 p-4 space-y-2">
          <Link
            href="/causes/get"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full h-11 rounded-full bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-hover)]"
          >
            <HandHeart size={16} />
            Donate now
          </Link>
          {!isAuthenticated && (
            <Link
              href="/auth/signin"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full h-11 rounded-full border border-slate-200 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              <LogIn size={16} />
              Sign in
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
