import { appUrl } from "@/utils";
import { permanentRedirect } from "next/navigation";

export default function AdminCodePage() {
  return permanentRedirect(appUrl("/admin/fraternity/all"));
}
