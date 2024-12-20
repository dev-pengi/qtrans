import { useState, useCallback } from "react";

export interface ModalRef {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

export const useModalRef = (): ModalRef => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const modalRef = {
    open,
    close,
    get isOpen() {
      return isOpen;
    },
  };

  modalRef.isOpen;

  return modalRef;
};
