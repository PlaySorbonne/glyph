import { auth } from "@/lib/auth";
import { LoginBtn, LogoutBtn } from "./AuthBtns";

export default async function Home() {
  const session = await auth();
  

  return (
    <main>
      {session?.user
        ? "You are signed" + session.user.name
        : "You are not signed"}
      <p>omg la meilleur page qui existe</p>

      {!session?.user ? <LoginBtn /> : <LogoutBtn />}
    </main>
  );
}
