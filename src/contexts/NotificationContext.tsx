"use client";

import React, { createContext, useContext, useCallback } from 'react';
import { toast, ToastContainer, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationData {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  autoClose?: number | false;
  position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';
}


export interface NotificationContextType {
  showNotification: (notification: Omit<NotificationData, 'id'>) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
}


const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const defaultToastOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const showNotification = useCallback((notification: Omit<NotificationData, 'id'>) => {
    const { type, message, title, autoClose, position } = notification;
    
    const options: ToastOptions = {
      ...defaultToastOptions,
      autoClose: autoClose !== undefined ? autoClose : defaultToastOptions.autoClose,
      position: position || defaultToastOptions.position,
    };

    const content = title ? (
      <div>
        <div className="font-semibold">{title}</div>
        <div>{message}</div>
      </div>
    ) : message;

    switch (type) {
      case 'success':
        toast.success(content, options);
        break;
      case 'error':
        toast.error(content, options);
        break;
      case 'info':
        toast.info(content, options);
        break;
      case 'warning':
        toast.warning(content, options);
        break;
      default:
        toast(content, options);
    }
  }, []);

  const showSuccess = useCallback((message: string, title?: string) => {
    showNotification({ type: 'success', message, title });
  }, [showNotification]);

  const showError = useCallback((message: string, title?: string) => {
    showNotification({ type: 'error', message, title });
  }, [showNotification]);

  const showInfo = useCallback((message: string, title?: string) => {
    showNotification({ type: 'info', message, title });
  }, [showNotification]);

  const showWarning = useCallback((message: string, title?: string) => {
    showNotification({ type: 'warning', message, title });
  }, [showNotification]);

  const value: NotificationContextType = {
    showNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-[9999]"
      />
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}