import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, leftIcon, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              'w-full rounded-xl border bg-white text-slate-900 placeholder:text-slate-400',
              'transition-all duration-200 outline-none',
              'focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15',
              leftIcon ? 'pl-10 pr-4' : 'px-4',
              'py-3 text-sm',
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/15'
                : 'border-slate-200 hover:border-slate-300',
              className,
            ].join(' ')}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-xs text-red-600">{error}</p>
        ) : hint ? (
          <p className="text-xs text-slate-400">{hint}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
