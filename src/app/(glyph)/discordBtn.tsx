import { discordCallback, signIn } from "@/lib/auth";
import Link from "next/link";

export default function DiscordBtn() {
  return (
    <Link
      href={`https://discord.com/oauth2/authorize?client_id=${process.env.AUTH_DISCORD_ID}&redirect_uri=${process.env.MAIN_URL}${discordCallback}&response_type=code&scope=email+identify`}
    >
      discord
    </Link>
  );
}
