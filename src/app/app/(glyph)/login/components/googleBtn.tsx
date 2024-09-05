import { googleCallback } from "@/lib/auth/google";
import Link from "next/link";

export default function GoogleBtn({ allowLogin }: { allowLogin?: boolean }) {
  return (
    <Link
      href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.AUTH_GOOGLE_ID}&redirect_uri=${process.env.MAIN_URL}${googleCallback}&response_type=code&scope=email+profile`}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4285F4] hover:bg-[#3367D6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4]"
    >
      {allowLogin ? "Se connecter avec Google" : "S'inscrire avec Google"}
    </Link>
  );
}
