import { SpinnerIcon } from '@myapp/icons';
import { cn } from '@myapp/utils';

export function Spinner({ className, style = {}, size = '1.2em', ...props }) {
  return (
    <SpinnerIcon
      style={{ fontSize: size, animationDuration: '1.2s', ...style }}
      className={cn('animate-spin', className)}
      {...props}
    />
  );
}
