"use client";

import { useFlashMessage } from "@/contexts/FlashMessageContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();
  const { redirectWithError } = useFlashMessage();
  const redirectUrl = pathname?.startsWith("/app/admin")
    ? "/app/admin"
    : pathname?.startsWith("/app")
    ? "/app"
    : "/";

  let errorMsg = "La page demandée n'existe pas.";

  redirectWithError(redirectUrl, errorMsg, "Page non trouvée");

  return (
    <p>
      {errorMsg} Vous pouvez retourner à la{" "}
      <Link href={redirectUrl}>page d'accueil</Link>.
    </p>
  );
}
