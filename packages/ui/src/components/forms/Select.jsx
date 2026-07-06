'use client';

import { cn } from '@myapp/utils';
import { ChevronDownIcon } from '@myapp/icons';
import { useState } from 'react';

export function Select({ className, ...props }) {
  return (
    <HeadlessSelect className={cn('w-full', className)} {...props}>
      {({ selectedOption, hover, disabled, focused }) => (
        <div
          className={cn(
            'flex items-center justify-between gap-2 h-10 w-full border border-border bg-background px-3 text-sm placeholder:text-text-muted rounded-lg',
            hover && !disabled && '',
            focused &&
              !disabled &&
              'outline-none ring-2 ring-primary ring-offset-2',
            disabled && '',
          )}
        >
          <span>{selectedOption?.label ?? 'Select'}</span>
          <ChevronDownIcon />
        </div>
      )}
    </HeadlessSelect>
  );
}

export function HeadlessSelect({
  id,
  value,
  options,
  onChange,
  children,
  className,
  selectClassName,
  disabled = false,
  ...selectProps
}) {
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);

  const selectedOption =
    options.find((option) => option.value === value) ?? null;

  const { onFocus, onBlur, ...restSelectProps } = selectProps;

  const trigger =
    typeof children === 'function'
      ? children({
          hover,
          focused,
          selectedOption,
          value,
          disabled,
        })
      : children;

  return (
    <div
      className={cn('relative inline-block', className)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {trigger}

      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value, event)}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        className={cn(
          'absolute inset-0 h-full w-full opacity-0',
          disabled ? 'cursor-wait' : 'cursor-pointer',
          selectClassName,
        )}
        {...restSelectProps}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
