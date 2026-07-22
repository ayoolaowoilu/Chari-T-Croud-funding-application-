import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'node_modules/**']),
  {
    rules: {
      // User-uploaded Cloudinary / remote assets — <img> is intentional in many places
      '@next/next/no-img-element': 'off',

      // MySQL2 row results are loosely shaped; we type critical paths, not every SELECT
      '@typescript-eslint/no-explicit-any': 'off',

      // Allow intentionally unused args with _
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // React 19 compiler-style rules are very strict for existing UI code
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/exhaustive-deps': 'warn',

      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: true, allowTernary: true },
      ],

      // Content-heavy pages (FAQ, T&C, copy) use natural punctuation
      'react/no-unescaped-entities': 'off',
    },
  },
]);

export default eslintConfig;
