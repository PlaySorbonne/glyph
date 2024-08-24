import { redirect } from "next/navigation";

export default function QuestPage() {
    return redirect(new URL("/", process.env.MAIN_URL).toString());
}
