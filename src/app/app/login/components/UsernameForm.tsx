import { updateUserWelcomed } from "@/actions/users";
import { signIn } from "@/lib/auth";
import { appUrl, SESSION_TTL } from "@/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function UsernameForm({ allowLogin }: { allowLogin?: boolean }) {
  allowLogin = allowLogin ?? true;
  async function handleSubmit(formData: FormData) {
    "use server";

    const username = formData.get("username") as string;
    const result = await signIn({
      type: "name",
      name: username,
      allowLogin,
    });

    if (result.error) {
      console.error(result.msg);
      redirect(`?error=${result.msg}`);
    }

    (await cookies()).set("session", result.session, {
      expires:
        SESSION_TTL === -1
          ? new Date(2147483647000)
          : new Date(Date.now() + SESSION_TTL),
    });
    if (result.user.fraternityId) {
      (await cookies()).set("fraternityId", result.user.fraternityId.toString(), {
        expires:
          SESSION_TTL === -1
            ? new Date(2147483647000)
            : new Date(Date.now() + SESSION_TTL),
      });
    }

    if (result.user.name) {
      (await cookies()).set("name", result.user.name, {
        expires:
          SESSION_TTL === -1
            ? new Date(2147483647000)
            : new Date(Date.now() + SESSION_TTL),
      });
    }

    if (result.registered) {
      await updateUserWelcomed({
        userId: result.user.id,
        sessionToken: undefined,
      });
      redirect(appUrl("/welcome"));
    } else {
      redirect(appUrl("/"));
    }
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
