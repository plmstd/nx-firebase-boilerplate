'use client';

import { cn } from '@myapp/utils';

export function Pagination({ page, totalPages, onPageChange, className }) {
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <button
        type="button"
        disabled={prevDisabled}
        onClick={() => onPageChange(page - 1)}
        className="text-sm text-text-muted disabled:opacity-10 disabled:cursor-default cursor-pointer"
      >
        Prev
      </button>
      <span className="text-sm text-text">
        {page} / {totalPages}
      </span>
      <button
        type="button"
        disabled={nextDisabled}
        onClick={() => onPageChange(page + 1)}
        className="text-sm text-text-muted disabled:opacity-10 disabled:cursor-not-allowed cursor-pointer"
      >
        Next
      </button>
    </div>
  );
}
