'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

interface DialogContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  goBackOnClose?: boolean;
}

export default function DialogContainer({
  title,
  description,
  children,
  open,
  onOpenChange,
  goBackOnClose = false,
}: DialogContainerProps) {
  const handleOpenChange = (open: boolean) => {
    if (goBackOnClose && !open) {
      router.back();
    }
    onOpenChange?.(open);
  };

  const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description ?? ''}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
