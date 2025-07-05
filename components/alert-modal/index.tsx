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
import { useAlertModal } from '@/hooks/use-alert-modal';
import { AlertCircleIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

export default function AlertModal() {
  const { open, dialog, closeAlertModal } = useAlertModal();

  const handleCancel = () => {
    dialog.onCancel?.();
    closeAlertModal();
  };

  const handleConfirm = () => {
    dialog.onConfirm?.();
    closeAlertModal();
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
          <AlertDialogTitle>
            <div className="flex items-center gap-2">
              {renderStatusIcon()}
              {dialog.title ?? ''}
            </div>
          </AlertDialogTitle>

          {/* <div className="flex items-center gap-2">
            {renderStatusIcon()}
            {dialog.title && <AlertDialogTitle>{dialog.title}</AlertDialogTitle>}
          </div> */}
          <AlertDialogDescription className="break-all">
            {dialog.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {dialog.cancelText && (
            <AlertDialogCancel onClick={handleCancel} className="cursor-pointer">
              {dialog.cancelText}
            </AlertDialogCancel>
          )}

          <AlertDialogAction onClick={handleConfirm} className="cursor-pointer">
            {dialog.confirmText ?? '確認'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
