'use client';

import { motion } from 'framer-motion';
import Card from '../layout/card';
import LoadingCards from '../layout/loadingCards';
import { useEffect, useState } from 'react';
import { getFeatured } from '@/app/lib/fetchRequests';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

export default function FeaturedCauses() {
  const [causes, setcauses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const resp = await getFeatured();
        if (Array.isArray(resp)) {
          setcauses(resp);
        } else if (resp && Array.isArray((resp as { data?: unknown }).data)) {
          setcauses((resp as { data: unknown[] }).data as any[]);
        } else {
          setcauses([]);
        }
      } catch (_error) {
        console.log(_error);
        setcauses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchdata();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span
            className="ct-overline inline-block"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 10,
              delay: 0.2,
            }}
          >
            Live now
          </motion.span>
          <motion.h2
            className="mt-3 ct-h1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Featured campaigns
          </motion.h2>
          <motion.p
            className="mt-4 ct-muted max-w-2xl mx-auto text-base md:text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Safety-rated campaigns and verified centers. Every gift goes to the cause — tips are
            optional.
          </motion.p>
        </motion.div>

        {/* Causes grid */}
        {loading ? (
          <LoadingCards />
        ) : causes?.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {causes.map((cause, index) => {
              const mainImg =
                typeof cause.main_img === 'string'
                  ? (() => {
                      try {
                        return JSON.parse(cause.main_img)?.url;
                      } catch {
                        return cause.main_img;
                      }
                    })()
                  : cause.main_img?.url;
              return (
                <Card
                  key={cause.id || index}
                  img={mainImg}
                  desc={cause.details}
                  donors={cause.donation_count || 0}
                  goal={cause.goal}
                  raised={cause.raised}
                  title={cause.name}
                  category={cause.category}
                  currency={cause.currency}
                  id={cause.id}
                  location={cause.location}
                  daysLeft={cause.date_to_completion}
                  safety_level={cause.safety_rating}
                  center_id={cause.center_id || null}
                  center_name={cause.center_name || null}
                  centerName={cause.center_name as string}
                />
              );
            })}
          </motion.div>
        ) : (
          <div className="text-center py-16 px-6 rounded-2xl border border-dashed border-gray-200 bg-white">
            <p className="text-gray-900 font-semibold text-lg mb-2">No featured campaigns yet</p>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              Be the first to launch a verified cause, or browse all campaigns when they go live.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="/startcauses"
                className="inline-flex items-center px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800"
              >
                Start a cause
              </a>
              <a
                href="/causes/get"
                className="inline-flex items-center px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50"
              >
                Browse all
              </a>
            </div>
          </div>
        )}

        {/* View all link */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="text-[var(--brand)] font-semibold hover:text-[var(--brand-hover)] transition inline-flex items-center gap-2"
            whileHover={{
              x: 5,
              transition: { type: 'spring', stiffness: 400 },
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = '/causes/get')}
          >
            View All Causes
            <motion.svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: [0, 5, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: 'easeInOut',
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
