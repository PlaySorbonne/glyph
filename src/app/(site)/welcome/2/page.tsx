import DiscordBtn from "@/app/app/login/components/discordBtn";
import GoogleBtn from "@/app/app/login/components/googleBtn";
import UsernameForm from "@/app/app/login/components/UsernameForm";
import WelcomePage from "../components/WelcomePage";

export default async function Welcome2({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  let error = (await searchParams).error;
  return (
    <WelcomePage>
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          fontFamily: "DCC-Ash",
          letterSpacing: "0.1rem",
        }}
      >
        Créez un compte...
      </h1>{" "}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="space-y-4">
        <DiscordBtn allowLogin={false} />
        <GoogleBtn allowLogin={false} />
        <div className="text-center my-4">
          <span className="px-2 text-gray-500">ou</span>
        </div>
        <UsernameForm allowLogin={false} />
      </div>
    </WelcomePage>
  );
}
