import { getSession, getUserFromSession } from "@/actions/auth";
import { updateUserSelf } from "@/actions/users";
import { appUrl } from "@/utils";
import { redirect } from "next/navigation";
import Fraternities from "@/assets/fraternities";

export default async function Welcome1Page() {
  const session = await getSession();
  const user = await getUserFromSession(session);

  if (user!.name) {
    redirect(appUrl("/welcome/1"));
  }

  async function handleSubmit(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    try {
      await updateUserSelf(session!, { name });
    } catch (error) {
      if (error instanceof Error) {
        redirect(appUrl(`/welcome/1?error=${error.message}`));
      } else {
        redirect(appUrl(`/welcome/1?error=An unknown error occurred`));
      }
    }
    redirect(appUrl("/welcome/2"));
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-6"
      style={{
        backgroundImage: `url(${Fraternities.default.fond.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-md w-full bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Tout d&apos;abord choisis un nom d&apos;utilisateur
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
