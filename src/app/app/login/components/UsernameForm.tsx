"use client";

import { updateUserWelcomed } from "@/actions/users";
import { useNotifications } from "@/contexts/NotificationContext";
import { signIn } from "@/lib/auth";
import { appUrl, SESSION_TTL } from "@/utils";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

export default function UsernameForm({ allowLogin }: { allowLogin?: boolean }) {
  allowLogin = allowLogin ?? true;
  const { showError } = useNotifications();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const username = formData.get("username") as string;
      const result = await signIn({
        type: "name",
        name: username,
        allowLogin,
      });

      if (result.error) {
        console.error(result.msg);
        showError(result.msg);
        return;
      }

      if (result.registered) {
        router.push(appUrl("/welcome"));
      } else {
        router.push(appUrl("/"));
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Nom d&apos;utilisateur
        </label>
        <input
          type="text"
          id="username"
          name="username"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {allowLogin ? "Se connecter" : "S'inscrire"}
      </button>
    </form>
  );
}
