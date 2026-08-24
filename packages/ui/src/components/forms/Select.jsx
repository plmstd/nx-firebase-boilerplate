'use client';

import { forwardRef, useState } from 'react';
import { ChevronDownIcon } from '@myapp/icons';
import { cn } from '@myapp/utils';

/**
 * Styled native select. `className` customizes the root while
 * `triggerClassName` customizes the visible control surface.
 */
export const Select = forwardRef(function Select(
  { className, triggerClassName, placeholder = 'Select', ...props },
  ref,
) {
  return (
    <HeadlessSelect ref={ref} className={cn('w-full', className)} {...props}>
      {({ selectedOption, hover, disabled, focused }) => (
        <div
          className={cn(
            'flex h-10 w-full items-center justify-between gap-2 rounded-control border border-border-strong bg-surface-elevated px-3 text-sm text-text shadow-control transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-out group-active:scale-[0.99] group-active:duration-75 motion-reduce:transform-none',
            hover && !disabled && 'border-text-subtle bg-surface/50',
            focused &&
              !disabled &&
              'outline-none ring-2 ring-focus ring-offset-2 ring-offset-background',
            disabled && 'opacity-50 group-active:scale-100',
            triggerClassName,
          )}
        >
          <span>{selectedOption?.label ?? placeholder}</span>
          <ChevronDownIcon className="text-text-muted" aria-hidden="true" />
        </div>
      )}
    </HeadlessSelect>
  );
});

Select.displayName = 'Select';

/**
 * Accessible native select overlay for callers that need a custom trigger.
 */
export const HeadlessSelect = forwardRef(function HeadlessSelect(
  {
    id,
    value,
    options = [],
    onChange,
    children,
    className,
    selectClassName,
    disabled = false,
    ...selectProps
  },
  ref,
) {
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
      className={cn('group relative inline-block', className)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {trigger}

      <select
        ref={ref}
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
          'absolute inset-0 h-full w-full touch-manipulation opacity-0',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
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
});

HeadlessSelect.displayName = 'HeadlessSelect';
