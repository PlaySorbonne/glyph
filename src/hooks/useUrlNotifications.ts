"use client";

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { type NotificationType, useNotifications } from '@/contexts/NotificationContext';
import { getAndClearFlashMessage } from '@/contexts/FlashMessageContext';

export function useUrlNotifications() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showNotification } = useNotifications();

  useEffect(() => {
    // First, check for flash messages from session storage
    const flashMessage = getAndClearFlashMessage();
    if (flashMessage) {
      showNotification(flashMessage);
      return;
    }

    // Then check URL parameters for backward compatibility
    const notificationTypes: NotificationType[] = ['error', 'success', 'info', 'warning'];
    
    for (const type of notificationTypes) {
      const message = searchParams.get(type);
      if (message) {
        const title = searchParams.get('title') || undefined;
        
        showNotification({
          type,
          message: decodeURIComponent(message),
          title: title ? decodeURIComponent(title) : undefined,
        });

        // Clean up URL parameters
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete(type);
        newSearchParams.delete('title');
        
        const newUrl = newSearchParams.toString() 
          ? `${window.location.pathname}?${newSearchParams.toString()}`
          : window.location.pathname;
        
        router.replace(newUrl);
        break; // Only show one notification at a time
      }
    }
  }, [searchParams, router, showNotification]);
}