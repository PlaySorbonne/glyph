import { getSession } from "@/actions/auth";
import DiscordBtn from "./components/discordBtn";
import GoogleBtn from "./components/googleBtn";
import UsernameForm from "./components/UsernameForm";
import { redirect } from "next/navigation";

export default async function Login({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const session = await getSession();
  if (session) {
    redirect(new URL("/", process.env.MAIN_URL).toString());
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {searchParams.error && (
          <p className="text-red-500 text-sm mb-4">{searchParams.error}</p>
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
