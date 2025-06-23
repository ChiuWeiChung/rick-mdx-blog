import { type ReactNode } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type StatusProps = 'neutral' | 'error' | 'success' | 'warning';

interface DialogConfig {
  title?: string | ReactNode;
  description: string | ReactNode;
  cancelText?: string;
  onCancel?: () => void;
  confirmText?: string;
  onConfirm?: () => void | Promise<void>;
  status: StatusProps;
}

interface StatusDialogState {
  open: boolean;
  dialog: DialogConfig;
  openAlertModal: (config: DialogConfig) => void;
  closeAlertModal: () => void;
}

export const useAlertModal = create<StatusDialogState>()(
  devtools(set => {
    return {
      open: false,
      dialog: { status: 'neutral', description: '' },
      openAlertModal: config => {
        set({ open: true, dialog: config });
      },
      closeAlertModal: () => {
        set({ open: false, dialog: { status: 'neutral', description: '' } });
      },
    };
  })
);
