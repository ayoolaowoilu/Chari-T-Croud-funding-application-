'use client';

import { motion } from 'framer-motion';
import { Check, Heart, Shield, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.06 },
  },
};

export default function Mission() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Soft section shell so content is not floating on bare white */}
      <div className="absolute inset-0 bg-slate-50/90" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        {/* Header card — composed, not naked type on canvas */}
        <motion.div
          className="relative rounded-3xl border border-slate-200/90 bg-white px-6 py-10 sm:px-10 sm:py-12 md:px-14 md:py-14 shadow-[0_16px_48px_rgba(15,23,42,0.05)] text-center overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[var(--brand-soft)]/50 blur-3xl pointer-events-none" />

          <motion.div
            variants={fadeInUp}
            className="relative inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 mb-6"
          >
            <Heart size={13} className="text-[var(--brand)]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
              What drives us
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="relative ct-display text-slate-900 max-w-2xl mx-auto"
          >
            Our mission
          </motion.h2>

          <motion.div variants={fadeInUp} className="relative mt-5 mx-auto max-w-2xl">
            <div className="absolute -left-1 sm:-left-3 top-0 text-5xl sm:text-6xl leading-none text-[var(--brand)]/15 font-serif select-none">
              “
            </div>
            <p className="relative text-lg sm:text-xl md:text-[1.35rem] text-slate-600 leading-[1.6] font-medium tracking-tight px-2 sm:px-4">
              We believe every person deserves access to food, education, and a safe place to call
              home. Our mission is to bridge the gap between compassion and action.
            </p>
          </motion.div>
        </motion.div>

        {/* Zero-fee promise — framed panel */}
        <motion.div
          className="mt-8 md:mt-10 rounded-3xl bg-slate-900 text-white p-8 sm:p-10 md:p-12 relative overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--brand)]/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="relative max-w-2xl mx-auto text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand)]/30 ring-1 ring-white/10">
              <svg
                className="w-6 h-6 text-teal-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight mb-3">
              100% of your donation goes to the cause
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base mb-6 max-w-xl mx-auto">
              We do not deduct platform fees from gifts. Every amount you give reaches the campaign.
              Operations run on optional tips — entirely your choice.
            </p>
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300">
              Zero platform cut
            </span>
          </div>
        </motion.div>

        {/* Two composed panels */}
        <motion.div
          className="mt-8 md:mt-10 grid md:grid-cols-2 gap-5 md:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeInUp}
            className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)] mb-5">
              <Shield size={18} strokeWidth={1.75} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 tracking-tight mb-3">
              Built on trust
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              Charity should be transparent, efficient, and human. We connect donors to verified
              centers and safety-rated campaigns so help reaches people quickly — without
              unnecessary bureaucracy.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              From emergency relief to education programs, we measure success by lives changed, not
              only dollars raised.
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 mb-5">
              <Zap size={18} strokeWidth={1.75} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 tracking-tight mb-5">
              How we&apos;re funded
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--brand)] text-white">
                  <Check size={14} strokeWidth={2.5} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">
                    Gifts go to the cause
                  </span>
                  <span className="block text-sm text-slate-500 mt-0.5 leading-relaxed">
                    The donation amount passes through to the campaign you choose.
                  </span>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <Check size={14} strokeWidth={2.5} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">
                    Optional tips keep us running
                  </span>
                  <span className="block text-sm text-slate-500 mt-0.5 leading-relaxed">
                    Add a voluntary tip at checkout if you want to support the platform. Never
                    required.
                  </span>
                </span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Values — three framed tiles */}
        <motion.div
          className="mt-8 md:mt-10 grid sm:grid-cols-3 gap-4 md:gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
        >
          {[
            {
              icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
              title: 'Compassion first',
              desc: 'Programs designed with dignity, respecting the agency of the communities we serve.',
            },
            {
              icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
              title: 'Radical transparency',
              desc: 'No hidden fees. Safety ratings and clear campaign details so you give with confidence.',
            },
            {
              icon: 'M13 10V3L4 14h7v7l9-11h-7z',
              title: 'Sustainable impact',
              desc: 'We aim for lasting capacity — not only one-off aid that disappears after the headline.',
            },
          ].map((value) => (
            <motion.div
              key={value.title}
              variants={fadeInUp}
              className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:border-slate-300/80 hover:shadow-[0_8px_28px_rgba(15,23,42,0.06)] transition-all"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d={value.icon}
                  />
                </svg>
              </div>
              <h4 className="text-base font-semibold text-slate-900 mb-2 tracking-tight">
                {value.title}
              </h4>
              <p className="text-sm text-slate-500 leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-10 md:mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)] hover:text-[var(--brand-hover)] transition-colors"
          >
            See how Chari-T works
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
