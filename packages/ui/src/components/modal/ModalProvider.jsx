'use client';

import { ModalAlert } from './ModalAlert';
import { ModalBase } from './ModalBase';
import { ModalConfirm } from './ModalConfirm';
import { ModalCustom } from './ModalCustom';
import { useModalStore } from './modalStore';

/**
 * Mounts the global modal surface used by the imperative modal API.
 */
export function ModalProvider() {
  const modal = useModalStore((state) => state.modal);

  return (
    <ModalBase panelClassName={modal?.panelClassName}>
      {modal?.window === 'alert' && <ModalAlert />}
      {modal?.window === 'confirm' && <ModalConfirm />}
      {modal?.window === 'custom' && <ModalCustom />}
    </ModalBase>
  );
}

export default ModalProvider;
