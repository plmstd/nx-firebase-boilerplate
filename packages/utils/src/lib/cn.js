import clsx from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const mergeTailwindClasses = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        'display',
        'heading-1',
        'heading-2',
        'heading-3',
        'heading-4',
        'heading-5',
        'heading-6',
        'lead',
        'body-lg',
        'body',
        'body-sm',
        'label',
        'caption',
      ],
      radius: ['control', 'surface'],
      shadow: ['control', 'toast', 'overlay'],
    },
  },
});

/**
 * Combines conditional class values and resolves conflicting Tailwind
 * utilities, including the custom design-token scales used by the boilerplate.
 *
 * @param {...import('clsx').ClassValue} classes Conditional class values.
 * @returns {string} A normalized Tailwind class string.
 */
export function cn(...classes) {
  return mergeTailwindClasses(clsx(...classes));
}
