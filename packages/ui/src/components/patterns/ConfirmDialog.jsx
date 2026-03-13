'use client';

import { Button } from '../primitives/Button';
import { Modal } from '../overlay/Modal';

export function ConfirmDialog({
  open,
  title = 'Confirm action',
  description = 'Are you sure you want to continue?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  return (
    <Modal open={open} title={title}>
      <div className="space-y-4">
        <div className="text-sm text-text-muted">{description}</div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant="danger" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </Modal>
  );
}
