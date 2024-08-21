import { redirect } from "next/navigation";

export default function Page() {
    return redirect(new URL("/admin/user/all", process.env.MAIN_URL).toString());
}