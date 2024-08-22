import { discordCallback } from "@/lib/auth/discord";
import Link from "next/link";

export default function DiscordBtn() {
  return (
    <Link
      href={`https://discord.com/oauth2/authorize?client_id=${process.env.AUTH_DISCORD_ID}&redirect_uri=${process.env.MAIN_URL}${discordCallback}&response_type=code&scope=email+identify`}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7289DA] hover:bg-[#5f73bc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7289DA]"
    >
      Login with Discord
    </Link>
  );
}
