import { redirect } from "next/navigation";

export default function Page() {
    return redirect("/admin/user/all");
}