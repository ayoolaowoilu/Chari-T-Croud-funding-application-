'use client';

import SocialButtons from './socialButtons';
import { useSearchParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

const ERROR_COPY: Record<string, string> = {
  OAuthSignin: 'Could not reach the sign-in provider. Check your network connection and try again.',
  OAuthCallback: 'Sign-in was interrupted. Please try again.',
  OAuthCreateAccount: 'We could not create your account. Please try again in a moment.',
  Callback: 'Something went wrong during sign-in. Please try again.',
  OAuthAccountNotLinked: 'This email is already linked to another sign-in method.',
  EmailCreateAccount: 'We could not create your account with that email.',
  AccessDenied: 'Access was denied. You may have cancelled sign-in.',
  Configuration: 'Sign-in is misconfigured. Please contact support.',
  Default: 'Sign-in failed. Please try again.',
};

export default function LoginForm() {
  const params = useSearchParams();
  const error = params.get('error');
  const message = error && (ERROR_COPY[error] || ERROR_COPY.Default);

  return (
    <div className="w-full space-y-4">
      {message && (
        <div
          role="alert"
          className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" strokeWidth={1.75} />
          <div>
            <p className="font-semibold text-amber-950">Sign-in issue</p>
            <p className="mt-0.5 text-amber-800/90 leading-relaxed">{message}</p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-[var(--shadow-sm)]">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 mb-4">
          Continue with
        </p>
        <SocialButtons />
      </div>
    </div>
  );
}
