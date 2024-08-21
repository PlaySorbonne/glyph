import { cookies } from "next/headers";
import DiscordBtn from "./discordBtn";
import GoogleBtn from "./googleBtn";

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
