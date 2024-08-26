import { getSession, getUserFromSession } from "@/actions/auth";
import { updateUserWelcomed } from "@/actions/users";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function WelcomePage() {
  try {
    await updateUserWelcomed({
      sessionToken: (await getSession()) as string,
      userId: undefined,
    });
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 flex flex-col justify-center items-center p-6 text-white">
      <div className="max-w-md w-full bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Bienvenue sur Glyph !
        </h1>
        <p className="text-lg mb-8 text-center">
          Découvrez un monde de quêtes passionnantes et de défis stimulants.
          Préparez-vous à explorer, apprendre et vous amuser !
        </p>
        <Link
          href="/welcome/1"
          className="block w-full bg-white text-purple-600 font-bold py-3 px-4 rounded-lg text-center transition duration-300 ease-in-out hover:bg-purple-100"
        >
          Commencer l&apos;aventure
        </Link>
      </div>
    </div>
  );
}
