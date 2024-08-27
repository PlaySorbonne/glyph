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
import { appUrl } from "@/utils";

async function checkAuth() {
  "use server";

  let pathname = await getHeaderUrl();

  const session = await getSession();

  if (!session && !pathname.includes("/login"))
    redirect(
      appUrl("/login?error=vous devez vous connecter pour accéder à cette page")
    );

  let user = await getUserFromSession(session);

  if (!user && !pathname.includes("/login")) {
    redirect(appUrl("/logout?error=La session n'existe plus"));
  }

  if (
    !pathname.includes("/welcome") &&
    !pathname.includes("/login") &&
    !pathname.includes("/admin") &&
    (!user!.name || !user!.welcomed)
  ) {
    await updateUserWelcomed({ userId: user!.id, sessionToken: undefined });
    redirect(appUrl("/welcome"));
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
