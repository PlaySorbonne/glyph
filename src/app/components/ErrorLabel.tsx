"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useNotifications } from "@/contexts/NotificationContext";

export default function ErrorLabel() {
  const [show, setShow] = useState(true);
  const searchParams = useSearchParams();
  const { showError } = useNotifications();
  const error = searchParams.get("error");
  
  useEffect(() => {
    if (error && show) {
      showError(decodeURIComponent(error));
      setShow(false);
    }
  }, [error, show, showError]);
  
  // This component is now deprecated in favor of the notification system
  // but kept for backward compatibility
  return null;
}