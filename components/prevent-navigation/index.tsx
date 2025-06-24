'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import DialogContainer from '../dialog-container';
import { Button } from '../ui/button';
// import { LeavingDialog } from '../components/ui/LeavingDialog';

type PreventNavigationProps = {
  isDirty: boolean;
  backHref: string;
  resetData: () => void;
};

export const PreventNavigation = ({ isDirty, backHref, resetData }: PreventNavigationProps) => {
  const [leavingPage, setLeavingPage] = useState(false);
  const router = useRouter();

  /**
   * Function that will be called when the user selects `yes` in the confirmation modal,
   * redirected to the selected page.
   */
  const confirmationFn = useRef<() => void>(() => {});

  // Used to make popstate event trigger when back button is clicked.
  // Without this, the popstate event will not fire because it needs there to be a href to return.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, document.title, window.location.href);
    }
  }, []);

  useEffect(() => {
    /**
     * Used to prevent navigation when user clicks a navigation `<Link />` or `<a />`.
     * @param e The triggered event.
     */
    let lastClickTime = 0;
    const debounceTime = 300; // milliseconds

    const handleClick = (event: MouseEvent) => {
      const now = Date.now();
      if (now - lastClickTime < debounceTime) return;
      lastClickTime = now;

      let target = event.target as HTMLElement;
      while (target && target.tagName !== 'A') {
        target = target.parentElement as HTMLElement;
      }

      if (target && target.tagName === 'A') {
        target = target as HTMLAnchorElement;

        if (
          isDirty &&
          typeof window !== 'undefined' &&
          'href' in target &&
          target.href !== window.location.href
        ) {
          // 如果target.href 是 http://localhost:3000/admin/notes/editor/123
          // extract the pathname
          const targetHref = target.href as string;
          const pathname = new URL(targetHref).pathname;

          window.history.pushState(null, document.title, window.location.href);

          confirmationFn.current = () => {
            router.push(pathname);
          };

          setLeavingPage(true);
        }
      }
    };
    /**
     * Used to prevent navigation when using `back` browser buttons.
     */
    const handlePopState = () => {
      if (isDirty && typeof window !== 'undefined') {
        window.history.pushState(null, document.title, window.location.href);
        confirmationFn.current = () => {
          router.push(backHref);
        };

        setLeavingPage(true);
      } else {
        if (typeof window !== 'undefined') window.history.back();
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    if (typeof window !== 'undefined') {
      /* *************************** Open listeners ************************** */
      document.addEventListener('click', handleClick);
      window.addEventListener('popstate', handlePopState);
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    /* ************** Return from useEffect closing listeners ************** */
    return () => {
      if (typeof window !== 'undefined') {
        document.removeEventListener('click', handleClick);
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  return (
    <DialogContainer
      open={leavingPage}
      onOpenChange={setLeavingPage}
      title="尚未儲存"
      description="您尚未儲存筆記，確定要離開嗎？"
    >
      <div className="flex justify-end gap-2">
        <Button
          onClick={() => {
            setLeavingPage(false);
            confirmationFn.current = () => {};
          }}
          variant="outline"
        >
          繼續編輯
        </Button>
        <Button
          onClick={() => {
            confirmationFn.current();
            setLeavingPage(false);

            confirmationFn.current = () => {};
            resetData();
          }}
        >
          確定離開
        </Button>
      </div>
    </DialogContainer>
  );
};
