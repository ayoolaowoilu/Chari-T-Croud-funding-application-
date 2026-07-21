'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Subtle route indicator — thin top bar only.
 * Never blocks the page. Skips first paint so hard loads don't flash.
 * Data loading should use skeletons / DualRingSpinner in-page, not this.
 */
export default function PageProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstNav = useRef(true);
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Initial load: content is already there — do not show a loader
    if (isFirstNav.current) {
      isFirstNav.current = false;
      return;
    }

    setActive(true);
    setProgress(18);

    const t1 = window.setTimeout(() => setProgress(55), 90);
    const t2 = window.setTimeout(() => setProgress(78), 200);
    const t3 = window.setTimeout(() => setProgress(92), 360);
    const finish = window.setTimeout(() => {
      setProgress(100);
      window.setTimeout(() => {
        setActive(false);
        setProgress(0);
      }, 180);
    }, 480);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(finish);
    };
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none fixed inset-x-0 top-0 z-[10000] h-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-label="Navigating"
        >
          <motion.div
            className="h-full origin-left rounded-r-full bg-[var(--brand)] shadow-[0_0_12px_rgba(15,118,110,0.45)]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: Math.max(progress, 8) / 100 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ transformOrigin: 'left center' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
