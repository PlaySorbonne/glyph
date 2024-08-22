import { getSession, getUserFromSession } from "@/actions/auth";
import { updateUser } from "@/actions/users";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Welcome1Page() {
    const session = await getSession();
    const user = await getUserFromSession(session);
    
    if (!user) {
        console.error("Something went wrong");
        cookies().delete("session");
        redirect(new URL("/login", process.env.MAIN_URL).toString());
    }
    
    if (!user.name) {
        redirect(new URL("/welcome/2", process.env.MAIN_URL).toString());
    }
    
    async function handleSubmit(formData: FormData) {
        const name = formData.get("name") as string;
        await updateUser(user!.id, { name });
        redirect(new URL("/welcome/2", process.env.MAIN_URL).toString());
    }

  return <div>
    <h1>Tout d'abord choisis un nom d'utilisateur</h1>
    <form action={handleSubmit}>
        <input type="text" placeholder="Nom d'utilisateur" />
        <button type="submit">Continuer</button>
    </form>
  </div>
}