import { redirect } from "next/navigation";

export default function NotFound() {
  return redirect("/?error=La page demandée n'existe pas.");
}