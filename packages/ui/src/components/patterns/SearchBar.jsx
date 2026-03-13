'use client';

import { cn } from '@myapp/utils';
import { Button } from '../primitives/Button';
import { Input } from '../forms/Input';

export function SearchBar({ value, placeholder = 'Search...', onChange, onSubmit, className }) {
  function handleSubmit(event) {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem('query');
    if (onSubmit) onSubmit(input ? input.value : '');
  }

  return (
    <form className={cn('flex items-center gap-2', className)} onSubmit={handleSubmit}>
      <Input name="query" placeholder={placeholder} value={value} onChange={(event) => onChange && onChange(event.target.value)} />
      <Button type="submit" variant="secondary">Search</Button>
    </form>
  );
}
