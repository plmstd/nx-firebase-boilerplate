import { cn } from '@myapp/utils';

export function Slider({ className, ...props }) {
  return <input type="range" className={cn('w-full accent-primary', className)} {...props} />;
}
