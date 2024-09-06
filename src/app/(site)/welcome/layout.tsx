import { getSession } from "@/actions/auth"
import { appUrl } from "@/utils";
import { redirect } from "next/navigation";

export default async function WelcomeLayout(props: { children: React.ReactNode }) {
  let session = await getSession();
  if (session) return redirect(appUrl("/welcome"));

  return <>{props.children}</>
}