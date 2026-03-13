import { cn } from '@myapp/utils';

export function Avatar({ className, alt = '', ...props }) {
  return <img alt={alt} className={cn('size-10 rounded-full object-cover', className)} {...props} />;
}
