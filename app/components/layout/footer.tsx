'use client';

import { Heart, Mail, Phone, MapPin, ArrowUp, Leaf, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const footerLinks = {
  causes: [
    { name: 'Education', href: '/causes/get?category=Education' },
    { name: 'Healthcare', href: '/causes/get?category=Health' },
    { name: 'Food Security', href: '/causes/get?category=Education' },
    { name: 'Emergency Relief', href: '/causes/get?category=Community' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Team', href: '/about#teams' },
  ],
  resources: [
    { name: 'Blog', href: '/blog' },
    { name: 'Safety ratings', href: '/how-it-works#ratings' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
    { name: 'How it works', href: '/how-it-works' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/t&c' },
  ],
};

const Logo: React.FC<{ nav?: boolean }> = ({ nav }) => {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${
          nav ? 'w-8 h-8' : 'w-9 h-9'
        } bg-[var(--brand)] rounded-[0.65rem] flex items-center justify-center shadow-sm shadow-teal-900/10 ring-1 ring-black/5`}
      >
        <Leaf size={nav ? 15 : 17} className="text-white" strokeWidth={2.5} />
      </div>
      <span className={`font-semibold tracking-[-0.045em] ${nav ? 'text-[21px]' : 'text-[28px]'}`}>
        Chari<span className="text-[var(--brand)]">-T</span>
      </span>
    </div>
  );
};

export { Logo };

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-5">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white text-slate-600">
      {/* Calm CTA — single band, no competing boxes */}
      <div className="border-b border-slate-100 bg-slate-50/80">
        <div className="mx-auto max-w-7xl px-6 md:px-8 py-12 md:py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <p className="ct-overline mb-3">Give with confidence</p>
              <h3 className="ct-h2 text-slate-900">Ready to make an impact?</h3>
              <p className="ct-muted mt-3 max-w-md">
                Browse safety-rated causes and verified charity centers. Optional tips only — your
                gift goes to the cause.
              </p>
            </div>
            <Link
              href="/causes/get"
              className="inline-flex items-center justify-center gap-2 self-start md:self-center h-11 px-6 rounded-full bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-hover)] transition-colors shadow-sm shadow-teal-900/10"
            >
              Start giving today
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main — airy flat columns (all content kept) */}
      <div className="mx-auto max-w-7xl px-6 md:px-8 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-10">
          {/* Brand + contact */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <Logo />
              <p className="mt-5 text-sm leading-relaxed text-slate-500 max-w-sm">
                Connecting compassionate donors with communities in need. Transparent, secure, and
                impactful giving that creates real change.
              </p>
            </div>

            <div className="space-y-4">
              <a href="mailto:hello@chari-t.org" className="flex items-start gap-3 group">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-600 group-hover:bg-[var(--brand-soft)] group-hover:text-[var(--brand)] transition-colors">
                  <Mail size={16} strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Email
                  </span>
                  <span className="block text-sm font-medium text-slate-800 mt-0.5 group-hover:text-[var(--brand)] transition-colors">
                    hello@chari-t.org
                  </span>
                </span>
              </a>

              <a href="tel:+1234567890" className="flex items-start gap-3 group">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-600 group-hover:bg-[var(--brand-soft)] group-hover:text-[var(--brand)] transition-colors">
                  <Phone size={16} strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Phone
                  </span>
                  <span className="block text-sm font-medium text-slate-800 mt-0.5">
                    +1 (234) 567-890
                  </span>
                </span>
              </a>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                  <MapPin size={16} strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Location
                  </span>
                  <span className="block text-sm font-medium text-slate-800 mt-0.5">
                    123 Hope Street, NY 10001
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 gap-10 sm:gap-8">
            <FooterColumn title="Causes" links={footerLinks.causes} />
            <FooterColumn title="Company" links={footerLinks.company} />
            <FooterColumn title="Resources" links={footerLinks.resources} />
            <FooterColumn title="Legal" links={footerLinks.legal} />
          </div>

          {/* Newsletter — quiet column, not a dark brick */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-5">
              Stay updated
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">
              Get impact stories and updates delivered to your inbox weekly.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="your@email.com"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15 transition-all"
              />
              <button
                type="submit"
                className="w-full h-11 px-6  rounded-xl bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-hover)] transition-colors shadow-sm shadow-teal-900/10"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-4 text-xs text-slate-400 leading-relaxed">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-slate-400">
            <span>© {new Date().getFullYear()} Chari-T.</span>
            <Heart size={12} className="text-slate-300 fill-slate-300 hidden sm:inline" />
            <span>Made for a better world.</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
