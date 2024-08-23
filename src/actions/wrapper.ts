"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

export function handleAsyncError<T extends (...args: any[]) => Promise<any>>(
  f: T
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await f(...args);
    } catch (error) {
      console.error("Error:", error);
      const currentUrl = headers().get("x-url") || "/";
      const errorMessage = encodeURIComponent(
        (error as Error).message || "An error occurred"
      );
      return redirect(`${currentUrl}?error=${errorMessage}`) as any;
    }
  }) as T;
}
