import { redirect } from "next/navigation";

export default function WelcomePage() {
    return redirect(new URL("/", process.env.MAIN_URL).toString());
}