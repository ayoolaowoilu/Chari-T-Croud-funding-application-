'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from './layout/footer'

const TIPS = [
  'Every donation brings hope to someone in need.',
  '100% of proceeds go directly to verified causes.',
  'Small acts, when multiplied, transform the world.',
  'Your support helps communities rebuild and thrive.',
  'Transparency is at the heart of everything we do.',
  'Join thousands of donors making a difference today.',
]

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [tipIndex, setTipIndex] = useState(0)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    setIsLoading(true)
    setProgress(0)
    setTipIndex(Math.floor(Math.random() * TIPS.length))


    const p1 = setTimeout(() => setProgress(40), 50)
    const p2 = setTimeout(() => setProgress(75), 150)
    const p3 = setTimeout(() => setProgress(95), 300)


    const done = setTimeout(() => {
      setProgress(100)
      setTimeout(() => setIsLoading(false), 400)
    }, 500)

    return () => {
      clearTimeout(p1)
      clearTimeout(p2)
      clearTimeout(p3)
      clearTimeout(done)
    }
  }, [pathname, searchParams])


  useEffect(() => {
    if (!isLoading) return
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [isLoading])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-10"
          >
           <Logo />
          </motion.div>

          <div className="w-64 h-0.75 bg-gray-100 rounded-full overflow-hidden mb-8">
            <motion.div
              className="h-full bg-gray-800 rounded-full origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress / 100 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />
          </div>

          {/* Tips */}
          <div className="h-6 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={tipIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="text-sm text-gray-500 text-center max-w-xs px-4"
              >
                {TIPS[tipIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}