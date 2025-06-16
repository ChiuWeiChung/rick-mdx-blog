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
	openAlertDialog: (config: DialogConfig) => void;
	closeAlertDialog: () => void;
}

export const useAlertDialog = create<StatusDialogState>()(
	devtools(set => {
		return {
			open: false,
			dialog: { status: 'neutral', description: '' },
			openAlertDialog: config => {
				set({ open: true, dialog: config });
			},
			closeAlertDialog: () => {
				set({ open: false, dialog: { status: 'neutral', description: '' } });
			},
		};
	})
);
