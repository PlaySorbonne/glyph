import Navbar from "./components/Navbar/Navbar";
import Header from "./components/Header/Header";
import styles from "./layout.module.css";
import {
  getHeaderUrl,
  getSession,
  getUserFromSession,
  logout,
} from "@/actions/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { updateUserWelcomed } from "@/actions/users";

async function checkAuth() {
  "use server";

  let pathname = await getHeaderUrl();

  const session = await getSession();

  if (!session && !pathname.includes("/login"))
    redirect(
      new URL(
        "/login?error=vous devez vous connecter pour accéder à cette page",
        process.env.MAIN_URL
      ).toString()
    );

  let user = await getUserFromSession(session);

  if (!user && !pathname.includes("/login")) {
    redirect(
      new URL(
        "/logout?error=La session n'existe plus",
        process.env.MAIN_URL
      ).toString()
    );
  }

  if (
    !pathname.includes("/welcome") &&
    !pathname.includes("/login") &&
    !pathname.includes("/admin") &&
    (!user!.name || !user!.welcomed)
  ) {
    await updateUserWelcomed({ userId: user!.id, sessionToken: undefined });
    redirect(new URL("/welcome", process.env.MAIN_URL).toString());
  }
}

export default async function GlyphLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await checkAuth();

  return (
    <>
      <main className={styles.main}>{children}</main>
      <Navbar />
    </>
  );
}
