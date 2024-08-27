import { getSession, getUserFromSession } from "@/actions/auth";
import { updateUser } from "@/actions/users";
import { appUrl } from "@/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Welcome1Page() {
  const session = await getSession();
  const user = await getUserFromSession(session);

  if (user!.name) {
    redirect(appUrl("/welcomeS/2"));
  }

  async function handleSubmit(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    console.log(name, user!.id);
    await updateUser(user!.id, { name });
    redirect(appUrl("/welcomeS/2"));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 flex flex-col justify-center items-center p-6 text-white">
      <div className="max-w-md w-full bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Tout d&aposa;bord choisis un nom d&apos;utilisateur
        </h1>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nom d&apos;utilisateur
            </label>
            <input
              type="text"
              placeholder="Entrez votre nom d'utilisateur"
              name="name"
              id="name"
              required
              className="w-full px-3 py-2 bg-white bg-opacity-50 rounded-lg text-purple-900 placeholder-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-purple-600 font-bold py-3 px-4 rounded-lg text-center transition duration-300 ease-in-out hover:bg-purple-100"
          >
            Continuer
          </button>
        </form>
      </div>
    </div>
  );
}
