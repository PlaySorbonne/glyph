import { getSession, getUserFromSession } from "@/actions/auth";
import { joinRandomFraternity, updateUserSelf } from "@/actions/users";
import { appUrl } from "@/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Welcome1Page() {
  let user = await getUserFromSession();
  if (user?.fraternityId) {
    redirect(appUrl(`/welcome/3?fraternityId=${user.fraternityId}`));
  }

  async function handleSubmit() {
    "use server";
    if (user?.fraternityId) {
      redirect(appUrl(`/welcome/3?fraternityId=${user.fraternityId}`));
    }

    let fraternityId: number;
    try {
      fraternityId = await joinRandomFraternity(user!.id);
      console.log(fraternityId);
    } catch (error) {
      if (error instanceof Error) {
        redirect(appUrl(`/welcome/2?error=${error.message}`));
      } else {
        redirect(appUrl(`/welcome/2?error=Une erreur inconnue est survenue`));
      }
    }
    cookies().set("fraternityId", fraternityId.toString());
    redirect(appUrl(`/welcome/3?fraternityId=${fraternityId}`));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 flex flex-col justify-center items-center p-6 text-white">
      <div className="max-w-md w-full bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Répondez à cette question pour que l&apos;ont détermine votre fraternité.
        </h1>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Peut-on dire des choses plus vraies que d&apos;autres ?
            </label>
            <input
              type="text"
              placeholder="Oui, non, peut-être...."
              name="name"
              id="name"
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
