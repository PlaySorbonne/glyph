import { appUrl } from "@/utils";
import { redirect } from "next/navigation";

export default function AdminCodePage() {
  return redirect(appUrl("/admin/fraternity/all"));
}
