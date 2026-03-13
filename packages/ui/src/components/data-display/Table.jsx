import { cn } from '@myapp/utils';

export function Table({ className, ...props }) {
  return <table className={cn('w-full border-collapse text-sm text-text', className)} {...props} />;
}
