import { getSession } from "@/actions/auth";
import DiscordBtn from "./components/discordBtn";
import GoogleBtn from "./components/googleBtn";
import UsernameForm from "./components/UsernameForm";
import { redirect } from "next/navigation";
import { appUrl } from "@/utils";
import Link from "next/link";
import Fraternities from "@/assets/fraternities";
import { SearchParams } from "next/dist/server/request/search-params";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  let error = (await searchParams).error;
  if (process.env.DISABLE_LOGIN) {
    error = "La connexion est désactivée, veillez revenir ultérieurement";
  }
  const session = await getSession();
  if (session) {
    redirect(appUrl("/"));
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url(${Fraternities.default.fond.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center" 
          style={{
            fontFamily: "DCC-Ash",
            letterSpacing: "0.1rem",
          }}
        >Connexion</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="space-y-4">
          <DiscordBtn />
          <GoogleBtn />
          <div className="text-center my-4">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
          <UsernameForm />
        </div>
        <div className="my-4">
          <Link
            href="/welcome"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4285F4] hover:bg-[#3367D6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4]"
          >
            Pas de compte ? Inscrivez-vous
          </Link>
        </div>
      </div>
    </div>
  );
}
