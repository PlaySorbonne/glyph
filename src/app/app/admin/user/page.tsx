import { appUrl } from "@/utils";
import { redirect } from "next/navigation";

export default function Page() {
  return redirect(appUrl("/admin/user/all"));
}
