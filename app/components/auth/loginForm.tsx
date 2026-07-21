import SocialButtons from './socialButtons';
import { useState } from 'react';
import { DualRingSpinner } from '../ui/loading';

export default function LoginForm() {
  const [loading] = useState(false);

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-100">
          <DualRingSpinner />
          <p className="mt-4 text-slate-600 text-sm">Logging you in...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 p-8">
          <SocialButtons />
        </div>
      )}
    </div>
  );
}
