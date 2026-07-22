'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, ShieldCheck, Heart } from 'lucide-react';

const slides = [
  {
    img: '/slider1/medium-shot-boys-hugging.jpg',
    title: 'No child left behind',
    desc: 'Your donation provides food, education, and shelter to orphaned and vulnerable children.',
    tag: 'Education & care',
  },
  {
    img: '/slider1/hands.jpg',
    title: 'Give hope, change lives',
    desc: 'Your contribution goes directly to families in crisis — emergency relief and medical care.',
    tag: 'Emergency relief',
  },
  {
    img: '/slider1/close-up-smiley-kids-posing-together.jpg',
    title: 'Education for every child',
    desc: 'Books, scholarships, and community programs in underserved areas.',
    tag: 'Community',
  },
  {
    img: '/slider1/happy-family-having-nice-thanksgiving-dinner-together.jpg',
    title: 'Families belong together',
    desc: 'Meals, housing support, and counseling so families can stay whole.',
    tag: 'Family support',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrent((prev) => {
      const next = prev + newDirection;
      if (next < 0) return slides.length - 1;
      if (next >= slides.length) return 0;
      return next;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 6500);
    return () => clearInterval(timer);
  }, [paginate, current]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
      scale: 1.02,
    }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({
      x: dir < 0 ? 40 : -40,
      opacity: 0,
      scale: 0.99,
    }),
  };

  const textVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, delay, ease: 'easeOut' as const },
    }),
  } as const;

  return (
    <section className="relative w-full overflow-hidden">
      {/* Soft backdrop so media never sits raw on the page */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white" />
      <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-[var(--brand-soft)]/40 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-10 sm:pt-10 sm:pb-16">
        {/* Framed stage */}
        <div className="relative rounded-[1.75rem] sm:rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] overflow-hidden">
          {/* Mobile */}
          <div className="sm:hidden">
            <div className="relative h-[min(52vw,18rem)] min-h-[14rem]">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={current}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="absolute inset-0"
                >
                  <Image
                    src={slides[current].img}
                    alt={slides[current].title}
                    fill
                    className="object-cover"
                    priority={current === 0}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 70vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/20 to-transparent" />
                </motion.div>
              </AnimatePresence>

              <div className="absolute top-3 left-3 z-20">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-slate-800 shadow-sm">
                  <Heart size={12} className="text-[var(--brand)]" />
                  {slides[current].tag}
                </span>
              </div>

              <div className="absolute bottom-3 right-3 z-20 flex gap-1.5">
                <button
                  type="button"
                  onClick={() => paginate(-1)}
                  className="h-9 w-9 rounded-full bg-white/95 shadow-md flex items-center justify-center text-slate-800"
                  aria-label="Previous"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => paginate(1)}
                  className="h-9 w-9 rounded-full bg-white/95 shadow-md flex items-center justify-center text-slate-800"
                  aria-label="Next"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="px-5 py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -6 }}
                >
                  <motion.p custom={0} variants={textVariants} className="ct-overline mb-2">
                    Trust-first giving
                  </motion.p>
                  <motion.h1
                    custom={0.06}
                    variants={textVariants}
                    className="text-2xl font-semibold tracking-tight text-slate-900 leading-[1.15] mb-2"
                  >
                    {slides[current].title}
                  </motion.h1>
                  <motion.p
                    custom={0.12}
                    variants={textVariants}
                    className="text-sm text-slate-600 leading-relaxed mb-5"
                  >
                    {slides[current].desc}
                  </motion.p>
                  <motion.div custom={0.18} variants={textVariants} className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => (window.location.href = '/causes/get')}
                      className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-full bg-[var(--brand)] text-white text-sm font-semibold"
                    >
                      Donate now
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => (window.location.href = '/how-it-works')}
                      className="flex-1 h-11 rounded-full border border-slate-200 text-sm font-semibold text-slate-700"
                    >
                      How it works
                    </button>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-center gap-2 mt-6">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Go to slide ${idx + 1}`}
                    onClick={() => {
                      setDirection(idx > current ? 1 : -1);
                      setCurrent(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === current ? 'w-7 bg-[var(--brand)]' : 'w-1.5 bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Desktop / tablet */}
          <div className="hidden sm:grid sm:grid-cols-12 min-h-[28rem] lg:min-h-[32rem]">
            {/* Copy panel */}
            <div className="sm:col-span-5 lg:col-span-5 flex flex-col justify-center px-8 lg:px-12 xl:px-14 py-12 lg:py-14 border-r border-slate-100 bg-white">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -8 }}
                  className="max-w-md"
                >
                  <motion.div
                    custom={0}
                    variants={textVariants}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 mb-5"
                  >
                    <ShieldCheck size={14} className="text-[var(--brand)]" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                      Safety-rated causes
                    </span>
                  </motion.div>

                  <motion.h1
                    custom={0.08}
                    variants={textVariants}
                    className="ct-display text-[2rem] lg:text-[2.75rem] text-slate-900 mb-4"
                  >
                    {slides[current].title}
                  </motion.h1>

                  <motion.p
                    custom={0.14}
                    variants={textVariants}
                    className="text-base lg:text-lg text-slate-500 leading-relaxed mb-8"
                  >
                    {slides[current].desc}
                  </motion.p>

                  <motion.div custom={0.2} variants={textVariants} className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => (window.location.href = '/causes/get')}
                      className="group inline-flex items-center gap-2 h-11 px-6 rounded-full bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-hover)] transition-colors shadow-sm shadow-teal-900/10"
                    >
                      Donate now
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button
                      type="button"
                      onClick={() => (window.location.href = '/how-it-works')}
                      className="inline-flex items-center h-11 px-6 rounded-full border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                    >
                      How it works
                    </button>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-5 mt-10 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      aria-label={`Slide ${idx + 1}`}
                      onClick={() => {
                        setDirection(idx > current ? 1 : -1);
                        setCurrent(idx);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === current
                          ? 'w-8 bg-[var(--brand)]'
                          : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium tabular-nums text-slate-400">
                  {String(current + 1).padStart(2, '0')}
                  <span className="mx-1 text-slate-300">/</span>
                  {String(slides.length).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Framed media panel — never a raw edge-to-edge photo */}
            <div className="sm:col-span-7 lg:col-span-7 relative p-4 sm:p-5 lg:p-6 bg-slate-50/80">
              <div className="relative h-full min-h-[22rem] lg:min-h-[28rem] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/5">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.div
                    key={current}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={slides[current].img}
                      alt={slides[current].title}
                      fill
                      className="object-cover"
                      priority={current === 0}
                      sizes="(max-width: 1024px) 55vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/10" />
                  </motion.div>
                </AnimatePresence>

                {/* Floating caption chip on image */}
                <div className="absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between gap-3">
                  <div className="rounded-2xl bg-white/95 backdrop-blur-sm border border-white/60 shadow-lg px-4 py-3 max-w-xs">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--brand)] mb-0.5">
                      {slides[current].tag}
                    </p>
                    <p className="text-sm font-semibold text-slate-900 leading-snug">
                      {slides[current].title}
                    </p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => paginate(-1)}
                      className="h-10 w-10 rounded-full bg-white/95 shadow-md flex items-center justify-center text-slate-800 hover:bg-white transition-colors"
                      aria-label="Previous"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => paginate(1)}
                      className="h-10 w-10 rounded-full bg-white/95 shadow-md flex items-center justify-center text-slate-800 hover:bg-white transition-colors"
                      aria-label="Next"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip under hero frame */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm text-slate-500">
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
            Optional tips only
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
            Safety-rated campaigns
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
            Verified charity centers
          </span>
        </div>
      </div>
    </section>
  );
}
