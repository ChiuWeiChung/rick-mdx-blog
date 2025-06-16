'use client';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAlertDialog } from '@/hooks/use-alert-dialog';
import { AlertCircleIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

export default function GlobalAlertDialog() {
	const { open, dialog, closeAlertDialog } = useAlertDialog();

	const handleCancel = () => {
		dialog.onCancel?.();
		closeAlertDialog();
	};

	const handleConfirm = () => {
		dialog.onConfirm?.();
		closeAlertDialog();
	};

	const renderStatusIcon = () => {
		switch (dialog.status) {
			case 'success':
				return <CheckCircleIcon className="size-6 text-green-500" />;
			case 'error':
				return <XCircleIcon className="text-destructive size-6" />;
			case 'warning':
				return <AlertCircleIcon className="size-6 text-yellow-500" />;
			default:
				return null;
		}
	};

	return (
		<AlertDialog open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<div className="flex items-center gap-2">
						{renderStatusIcon()}
						{dialog.title && <AlertDialogTitle>{dialog.title}</AlertDialogTitle>}
					</div>
					<AlertDialogDescription>{dialog.description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					{dialog.cancelText && (
						<AlertDialogCancel onClick={handleCancel}>{dialog.cancelText}</AlertDialogCancel>
					)}

					<AlertDialogAction onClick={handleConfirm}>
						{dialog.confirmText ?? '確認'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
