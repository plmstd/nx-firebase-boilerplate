import { SpinnerIcon } from '@myapp/icons';
import { cn } from '@myapp/utils';

/**
 * Shared loading indicator with a static reduced-motion fallback.
 */
export function Spinner({ className, style = {}, size = '1.2em', ...props }) {
  return (
    <SpinnerIcon
      style={{ fontSize: size, animationDuration: '1.2s', ...style }}
      className={cn('animate-spin motion-reduce:animate-none', className)}
      {...props}
    />
  );
}
