'use client';

import { useEffect, useState, useCallback } from 'react';

export interface UseUnsavedChangesOptions {
  enabled?: boolean;
  message?: string;
}

export function useUnsavedChanges(
  hasChanges: boolean,
  options: UseUnsavedChangesOptions = {}
) {
  const {
    enabled = true,
    message = 'You have unsaved changes. Do you want to leave without saving?',
  } = options;

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

  // Handle browser back/forward/close
  useEffect(() => {
    if (!enabled || !hasChanges) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled, hasChanges]);

  // Handle React Router navigation (for next/link)
  useEffect(() => {
    if (!enabled || !hasChanges) return;

    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href]');
      if (target) {
        const href = target.getAttribute('href');
        // Don't warn for same-page navigation
        if (href && !href.startsWith('#')) {
          e.preventDefault();
          setShowConfirm(true);
          setPendingNavigation(() => () => {
            window.location.href = href;
          });
        }
      }
    };

    document.addEventListener('click', handleLinkClick, true);
    return () => document.removeEventListener('click', handleLinkClick, true);
  }, [enabled, hasChanges]);

  const handleConfirmLeave = useCallback(() => {
    setShowConfirm(false);
    if (pendingNavigation) {
      pendingNavigation();
    }
  }, [pendingNavigation]);

  const handleCancelLeave = useCallback(() => {
    setShowConfirm(false);
    setPendingNavigation(null);
  }, []);

  return {
    showConfirm,
    onConfirmLeave: handleConfirmLeave,
    onCancelLeave: handleCancelLeave,
    message,
  };
}
