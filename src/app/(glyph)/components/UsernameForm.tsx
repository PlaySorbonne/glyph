import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function UsernameForm() {
  const handleSubmit = async (formData: FormData) => {
    "use server";

    const username = formData.get("username") as string;
    console.log(username);
    const result = await signIn({ type: "name", name: username });

    if (result.error) {
      // You might want to handle this error differently in a server component
      console.error(result.msg);
      return { error: result.msg };
    } else {
      redirect(new URL("/", process.env.MAIN_URL).toString());
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
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
        Login with Username
      </button>
    </form>
  );
}