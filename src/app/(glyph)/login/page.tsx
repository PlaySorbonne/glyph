import DiscordBtn from "../components/discordBtn";
import GoogleBtn from "../components/googleBtn";
import UsernameForm from "../components/UsernameForm";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
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