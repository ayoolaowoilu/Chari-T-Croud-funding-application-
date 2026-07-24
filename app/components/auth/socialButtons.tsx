'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const GoogleSvg = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SocialButtons = () => {
  const search = useSearchParams();
  const goto = search.get('goto');
  const redir =
    search.get('redir') ||
    search.get('redirect') ||
    search.get('callbackUrl') ||
    search.get('next');

  let targetUrl = '/';
  if (goto) {
    targetUrl = goto.startsWith('/') ? goto : `/dashboard/donor?goto=${goto}`;
  } else if (redir) {
    targetUrl = redir;
  }

  const [pending, setPending] = useState<string | null>(null);

  const handleSignIn = async (provider: string) => {
    try {
      setPending(provider);
      await signIn(provider, { callbackUrl: targetUrl });
    } catch {
      setPending(null);
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={!!pending}
        onClick={() => handleSignIn('google')}
        className="w-full flex items-center justify-center gap-3 h-12 px-5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all duration-200 disabled:opacity-60 disabled:cursor-wait"
      >
        {pending === 'google' ? (
          <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
        ) : (
          <GoogleSvg />
        )}
        <span className="text-sm font-semibold text-slate-800">
          {pending === 'google' ? 'Connecting…' : 'Continue with Google'}
        </span>
      </button>

      <button
        type="button"
        disabled
        title="Coming soon"
        className="w-full flex items-center justify-center gap-3 h-12 px-5 rounded-xl bg-slate-900 text-white opacity-40 cursor-not-allowed"
      >
        <XIcon />
        <span className="text-sm font-semibold">Continue with X</span>
      </button>

      <p className="text-center text-xs text-slate-400 pt-1">More sign-in options coming soon</p>
    </div>
  );
};

export default SocialButtons;
