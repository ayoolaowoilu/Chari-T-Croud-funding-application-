'use client';

import LoginForm from '@/app/components/auth/loginForm';
import Image from 'next/image';
import Link from 'next/link';
import { HandHeart, Heart, Shield, Users } from 'lucide-react';
import { Logo } from '@/app/components/layout/footer';
import { Suspense } from 'react';
import { DualRingSpinner } from '@/app/components/ui/loading';

function SignInContent() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_24px_80px_rgba(15,23,42,0.08)] border border-slate-200/80 overflow-hidden flex flex-col md:flex-row">
        {/* Form column */}
        <div className="w-full md:w-[48%] p-7 sm:p-10 md:p-12 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <Link href="/" className="inline-flex mb-8">
              <Logo nav />
            </Link>

            <h1 className="text-2xl sm:text-[1.75rem] font-semibold tracking-tight text-slate-900 mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed mb-8">
              Sign in to donate, start a cause, or manage a charity center.
            </p>

            <LoginForm />

            <p className="mt-8 text-center text-xs text-slate-400 leading-relaxed">
              By continuing you agree to our{' '}
              <Link
                href="/t&c"
                className="font-medium text-slate-600 hover:text-[var(--brand)] underline-offset-2 hover:underline"
              >
                Terms
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy-policy"
                className="font-medium text-slate-600 hover:text-[var(--brand)] underline-offset-2 hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Visual column — framed, not raw full-bleed noise */}
        <div className="hidden md:block md:w-[52%] relative min-h-[28rem] bg-slate-100">
          <Image
            src="/slider1/happy-family-having-nice-thanksgiving-dinner-together.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/25 to-slate-900/10" />

          <div className="absolute top-6 left-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-sm">
              <HandHeart className="w-3.5 h-3.5 text-[var(--brand)]" />
              Trust-first crowdfunding
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/95 backdrop-blur border border-white/60 p-5 shadow-lg">
            <h2 className="text-base font-semibold text-slate-900 tracking-tight mb-1.5">
              Give with confidence
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Safety-rated campaigns, verified centers, and optional tips only — your gift goes to
              the cause.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[var(--brand)]" />
                Donors & centers
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[var(--brand)]" />
                Safety ratings
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[var(--brand)]" />
                0% platform cut
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
          <DualRingSpinner label="Loading…" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
