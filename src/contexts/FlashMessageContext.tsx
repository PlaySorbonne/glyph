"use client";

import React, { createContext, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { NotificationType } from './NotificationContext';

export interface FlashMessage {
  type: NotificationType;
  message: string;
  title?: string;
  autoClose?: number | false;
}

export interface FlashMessageContextType {
  redirectWithMessage: (url: string, message: FlashMessage) => void;
  redirectWithSuccess: (url: string, message: string, title?: string) => void;
  redirectWithError: (url: string, message: string, title?: string) => void;
  redirectWithInfo: (url: string, message: string, title?: string) => void;
  redirectWithWarning: (url: string, message: string, title?: string) => void;
}

const FlashMessageContext = createContext<FlashMessageContextType | undefined>(undefined);

const FLASH_MESSAGE_KEY = 'flash_message';

export function FlashMessageProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const redirectWithMessage = useCallback((url: string, message: FlashMessage) => {
    try {
      // Store the flash message in session storage
      sessionStorage.setItem(FLASH_MESSAGE_KEY, JSON.stringify(message));
      
      // Navigate to the URL
      router.push(url);
    } catch (error) {
      console.error('Failed to store flash message:', error);
      // Fallback to URL parameters if session storage fails
      const params = new URLSearchParams();
      params.set(message.type, message.message);
      if (message.title) {
        params.set('title', message.title);
      }
      router.push(`${url}${url.includes('?') ? '&' : '?'}${params.toString()}`);
    }
  }, [router]);

  const redirectWithSuccess = useCallback((url: string, message: string, title?: string) => {
    redirectWithMessage(url, { type: 'success', message, title });
  }, [redirectWithMessage]);

  const redirectWithError = useCallback((url: string, message: string, title?: string) => {
    redirectWithMessage(url, { type: 'error', message, title });
  }, [redirectWithMessage]);

  const redirectWithInfo = useCallback((url: string, message: string, title?: string) => {
    redirectWithMessage(url, { type: 'info', message, title });
  }, [redirectWithMessage]);

  const redirectWithWarning = useCallback((url: string, message: string, title?: string) => {
    redirectWithMessage(url, { type: 'warning', message, title });
  }, [redirectWithMessage]);

  const value: FlashMessageContextType = {
    redirectWithMessage,
    redirectWithSuccess,
    redirectWithError,
    redirectWithInfo,
    redirectWithWarning,
  };

  return (
    <FlashMessageContext.Provider value={value}>
      {children}
    </FlashMessageContext.Provider>
  );
}

export function useFlashMessage(): FlashMessageContextType {
  const context = useContext(FlashMessageContext);
  if (context === undefined) {
    throw new Error('useFlashMessage must be used within a FlashMessageProvider');
  }
  return context;
}

// Utility function to retrieve and clear flash messages
export function getAndClearFlashMessage(): FlashMessage | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = sessionStorage.getItem(FLASH_MESSAGE_KEY);
    if (stored) {
      sessionStorage.removeItem(FLASH_MESSAGE_KEY);
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to retrieve flash message:', error);
    sessionStorage.removeItem(FLASH_MESSAGE_KEY);
  }
  
  return null;
}