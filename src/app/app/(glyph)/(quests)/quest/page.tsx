import { appUrl } from "@/utils";
import { redirect } from "next/navigation";

export default function QuestPage() {
    return redirect(appUrl("/"));
}
