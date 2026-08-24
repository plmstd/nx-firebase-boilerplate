'use client';

import { Alert, Badge, Button, Surface, modal, toast } from '@myapp/ui';
import { KitSection } from '../components/KitSection';

/** Displays semantic feedback components and their interactive APIs. */
export function FeedbackSection() {
  return (
    <KitSection
      eyebrow="Feedback"
      title="Status, dialogs, and toasts"
      description="Semantic colors remain reserved for feedback and shared interaction behavior respects reduced-motion preferences."
    >
      <div className="space-y-5">
        <Surface className="flex flex-wrap gap-3">
          <Badge dot>Neutral</Badge>
          <Badge variant="success" dot>
            Complete
          </Badge>
          <Badge variant="warning" dot>
            Needs attention
          </Badge>
          <Badge variant="error" dot>
            Failed
          </Badge>
        </Surface>
        <Surface className="space-y-3">
          <Alert>General information for this surface.</Alert>
          <Alert variant="success">Changes have been saved.</Alert>
          <Alert variant="warning">Review the highlighted fields.</Alert>
          <Alert variant="error">The request could not be completed.</Alert>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() =>
                toast.success({
                  title: 'Saved',
                  message: 'The toast uses the same shared primitives.',
                })
              }
            >
              Show toast
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                toast.show({
                  title: 'Item removed',
                  message: 'The action can be undone.',
                  action: {
                    label: 'Undo',
                    onClick: () => toast.success('Item restored'),
                  },
                })
              }
            >
              Toast with action
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                void toast.promise(
                  new Promise((resolve) => window.setTimeout(resolve, 1200)),
                  {
                    loading: 'Saving…',
                    success: 'Saved',
                    error: 'Save failed',
                  },
                )
              }
            >
              Promise toast
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                modal.alert({
                  title: 'Example dialog',
                  message:
                    'Dialogs compose the shared typography and action primitives.',
                  confirmText: 'Got it',
                })
              }
            >
              Show modal
            </Button>
          </div>
        </Surface>
      </div>
    </KitSection>
  );
}
