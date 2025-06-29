"use client";

import { useUrlNotifications } from '@/hooks/useUrlNotifications';

export function NotificationHandler() {
  useUrlNotifications();
  return null;
}