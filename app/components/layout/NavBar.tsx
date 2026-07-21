'use client';

import {
  ChevronDown,
  Menu,
  User,
  GraduationCap,
  Stethoscope,
  Globe,
  BriefcaseBusiness,
  HandHeart,
  Info,
  ShieldCheck,
  FileText,
  Newspaper,
  TrendingUp,
  ArrowRight,
  History,
  LogOut,
  LayoutDashboard,
  Building2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SideBar from './sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Logo } from './footer';
import Link from 'next/link';

type MenuKey = 'discover' | 'about' | null;

export default function NavBar() {
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const profileRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (status !== 'unauthenticated') return;
    const publicPaths = [
      '/makedonations',
      '/causes/get',
      '/causes/cause',
      '/',
      '/about',
      '/t&c',
      '/privacy-policy',
      '/dashboard/centers/profile',
      '/causes/flier',
      '/dashboard/centers/local-centers',
      '/blog',
      '/contact',
      '/faq',
      '/how-it-works',
      '/profile',
      '/auth/signin',
    ];
    const isPublic =
      publicPaths.includes(pathname) ||
      publicPaths.some((p) => p !== '/' && pathname.startsWith(p));
    if (!isPublic) {
      router.replace(`/auth/signin?redir=${encodeURIComponent(window.location.href)}`);
    }
  }, [status, pathname, router]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const categories = [
    {
      name: 'Health',
      icon: Stethoscope,
      href: '/causes/get?category=Health',
      tint: 'bg-rose-50 text-rose-600',
    },
    {
      name: 'Education',
      icon: GraduationCap,
      href: '/causes/get?category=Education',
      tint: 'bg-sky-50 text-sky-600',
    },
    {
      name: 'Community',
      icon: Globe,
      href: '/causes/get?category=Community',
      tint: 'bg-violet-50 text-violet-600',
    },
    {
      name: 'Business',
      icon: BriefcaseBusiness,
      href: '/causes/get?category=Business',
      tint: 'bg-amber-50 text-amber-700',
    },
    {
      name: 'Crowdfunding',
      icon: TrendingUp,
      href: '/causes/get?category=CroudFunding',
      tint: 'bg-teal-50 text-teal-700',
    },
  ];

  const aboutLinks = [
    {
      name: 'Our story',
      desc: 'Mission and what we stand for',
      icon: Info,
      href: '/about',
    },
    {
      name: 'How it works',
      desc: 'Donate, fundraise, and verify',
      icon: ShieldCheck,
      href: '/how-it-works',
    },
    {
      name: 'Safety ratings',
      desc: 'How we score campaign trust',
      icon: TrendingUp,
      href: '/how-it-works#ratings',
    },
    {
      name: 'Blog',
      desc: 'Stories and product updates',
      icon: Newspaper,
      href: '/blog',
    },
  ];

  const navLink =
    'inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[13px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors';

  return (
    <>
      <header
        ref={navRef}
        className={[
          'fixed top-0 inset-x-0 z-50 transition-all duration-200',
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_1px_0_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.04)]'
            : 'bg-white border-b border-slate-200/70',
        ].join(' ')}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Brand */}
            <div className="flex items-center gap-8 min-w-0">
              <Link href="/" className="shrink-0" aria-label="Chari-T home">
                <Logo nav />
              </Link>

              {/* Desktop primary nav */}
              {/* Desktop primary nav */}
              <nav
                aria-label="Main"
                className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2"
              >
                <div className="flex items-center gap-2">
                  {/* Discover Dropdown */}
                  <div
                    className="relative"
                    onMouseEnter={() => setOpenMenu('discover')}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    <button
                      type="button"
                      className={navLink}
                      aria-expanded={openMenu === 'discover'}
                    >
                      Discover
                      <ChevronDown
                        size={15}
                        className={`ml-1.5 transition-transform duration-300 ${openMenu === 'discover' ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {openMenu === 'discover' && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[28rem]">
                        <div className="rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/80 overflow-hidden">
                          <div className="grid grid-cols-5 gap-2 p-4">
                            {categories.map((cat) => (
                              <Link
                                key={cat.name}
                                href={cat.href}
                                className="flex flex-col items-center gap-2.5 rounded-2xl p-3 hover:bg-slate-50 transition-all duration-200 group"
                              >
                                <div
                                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${cat.tint} transition-transform group-hover:scale-105`}
                                >
                                  <cat.icon size={20} strokeWidth={1.8} />
                                </div>
                                <span className="text-xs font-medium text-slate-700 text-center leading-tight">
                                  {cat.name}
                                </span>
                              </Link>
                            ))}
                          </div>

                          <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 flex gap-3">
                            <Link
                              href="/causes/get"
                              className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3 text-sm font-semibold hover:border-slate-300 transition-colors"
                            >
                              All Causes
                              <ArrowRight size={16} />
                            </Link>
                            <Link
                              href="/dashboard/centers/local-centers"
                              className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-slate-600 hover:bg-white transition-colors"
                            >
                              <Building2 size={17} />
                              Local Centers
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* About Dropdown */}
                  <div
                    className="relative"
                    onMouseEnter={() => setOpenMenu('about')}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    <button type="button" className={navLink} aria-expanded={openMenu === 'about'}>
                      About
                      <ChevronDown
                        size={15}
                        className={`ml-1.5 transition-transform duration-300 ${openMenu === 'about' ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {openMenu === 'about' && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-96">
                        <div className="rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/80 p-2">
                          {aboutLinks.map((link) => (
                            <Link
                              key={link.name}
                              href={link.href}
                              className="flex items-start gap-4 rounded-2xl p-4 hover:bg-slate-50 transition-all group"
                            >
                              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 group-hover:bg-[var(--brand-soft)] group-hover:text-[var(--brand)] transition-colors">
                                <link.icon size={18} strokeWidth={1.8} />
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900">{link.name}</div>
                                <div className="text-sm text-slate-500 mt-1 leading-snug">
                                  {link.desc}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Link href="/startcauses" className={navLink}>
                    Start a cause
                  </Link>

                  {status === 'authenticated' && (
                    <Link href="/dashboard/donor" className={navLink}>
                      Dashboard
                    </Link>
                  )}
                </div>
              </nav>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/causes/get"
                className="hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-full bg-[var(--brand)] text-white text-[13px] font-semibold hover:bg-[var(--brand-hover)] transition-colors shadow-sm shadow-teal-900/10"
              >
                <HandHeart size={15} strokeWidth={2} />
                Donate
              </Link>

              {status === 'loading' ? (
                <div className="h-9 w-20 rounded-full bg-slate-100 animate-pulse" />
              ) : status === 'authenticated' ? (
                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setProfileOpen((v) => !v)}
                    className="inline-flex items-center gap-2 h-9 pl-1 pr-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors"
                    aria-expanded={profileOpen}
                    aria-haspopup="menu"
                  >
                    <span className="relative h-7 w-7 rounded-full overflow-hidden bg-slate-100 ring-1 ring-slate-200">
                      <img
                        src={session?.user?.image || '/slider1/hands.jpg'}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span className="hidden md:inline text-[13px] font-medium text-slate-700 max-w-[7rem] truncate">
                      {session?.user?.name?.split(' ')[0] || 'Account'}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-slate-400 transition-transform ${
                        profileOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {profileOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)] overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {session?.user?.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {session?.user?.email}
                        </p>
                      </div>
                      <div className="p-1.5">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setProfileOpen(false);
                            router.push('/dashboard/donor?goto=profile');
                          }}
                          className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <User size={16} className="text-slate-400" />
                          Profile
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setProfileOpen(false);
                            router.push('/dashboard/donor');
                          }}
                          className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <LayoutDashboard size={16} className="text-slate-400" />
                          Dashboard
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setProfileOpen(false);
                            router.push('/dashboard/donor?goto=explore');
                          }}
                          className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <FileText size={16} className="text-slate-400" />
                          My campaigns
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setProfileOpen(false);
                            router.push('/dashboard/donor?goto=history');
                          }}
                          className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <History size={16} className="text-slate-400" />
                          Donation history
                        </button>
                        <div className="my-1 border-t border-slate-100" />
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut size={16} />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={`/auth/signin?redir=${encodeURIComponent(pathname)}`}
                  className="inline-flex items-center h-9 px-3.5 rounded-full border border-slate-200 bg-white text-[13px] font-semibold text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  Sign in
                </Link>
              )}

              {/* Mobile menu */}
              <button
                type="button"
                className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Thin brand accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--brand)]/25 to-transparent" />
      </header>

      {/* Offset for fixed header */}
      <div className="h-16" aria-hidden />

      <SideBar
        show={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isAuthenticated={status === 'authenticated'}
      />
    </>
  );
}
