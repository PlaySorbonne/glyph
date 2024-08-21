import { googleCallback } from "@/lib/auth/google";
import Link from "next/link";

export default function GoogleBtn() {
  return (
    <Link
      href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.AUTH_GOOGLE_ID}&redirect_uri=${process.env.MAIN_URL}${googleCallback}&response_type=code&scope=email+profile`}
    >
      Google
    </Link>
  );
}
