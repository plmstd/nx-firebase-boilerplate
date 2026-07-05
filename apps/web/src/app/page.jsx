import { Button, Alert, Spinner } from '@myapp/ui';
import { AddIcon } from '@myapp/icons';

export default function Index() {
  return (
    <div className="min-h-screen bg-background p-8 text-text">
      <div className="mx-auto max-w-4xl ">
        <Alert className="mb-4">This is an alert</Alert>
        <div className="flex flex-col gap-4 rounded-xl bg-surface p-6">
          <h1 className="text-2xl font-semibold">My App</h1>
          <p className="text-text-muted">
            Start building with the shared styles and minimal UI primitives.
          </p>
          <div>
            <Button>Get Started</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
