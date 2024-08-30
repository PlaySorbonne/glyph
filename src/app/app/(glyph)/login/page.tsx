import { getSession } from "@/actions/auth";
import DiscordBtn from "./components/discordBtn";
import GoogleBtn from "./components/googleBtn";
import UsernameForm from "./components/UsernameForm";
import { redirect } from "next/navigation";
import { appUrl } from "@/utils";

export default async function Login({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  let error = searchParams.error;
  if (process.env.DISABLE_LOGIN) {
    error ??= "La connexion est désactivée, veillez revenir ultérieurement";
  }
  const session = await getSession();
  if (session) {
    redirect(appUrl("/"));
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}
        <div className="space-y-4">
          <DiscordBtn />
          <GoogleBtn />
          <div className="text-center my-4">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
          <UsernameForm />
        </div>
      </div>
    </div>
  );
}
