import { cookies } from "next/headers";
import DiscordBtn from "./components/discordBtn";
import GoogleBtn from "./components/googleBtn";

export default async function Home() {

  let name = cookies().get("name");

  return (
    <main>
      {name?.value ?? "Welcome to the site!"}
      <DiscordBtn />
      <GoogleBtn />
    </main>
  );
}
