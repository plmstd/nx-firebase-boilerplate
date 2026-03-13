import NextLink from 'next/link';
import { Button } from '@myapp/ui';

export default function Index() {
  return (
    <div className="min-h-screen bg-background p-8 text-text">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-xl border border-border bg-surface p-6">
        <h1 className="text-2xl font-semibold">My App</h1>
        <p className="text-text-muted">
          Open the full stylesheet page to preview all shared components.
        </p>
        <div>
          <NextLink href="/stylesheet">
            <Button>Open Stylesheet</Button>
          </NextLink>
        </div>
      </div>
    </div>
  );
}
