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

async function checkAuth() {
  "use server";

  let pathname = await getHeaderUrl();

  const session = await getSession();

  if (!session && !pathname.includes("/login"))
    redirect(new URL("/login", process.env.MAIN_URL).toString());

  const user = await getUserFromSession(session);
  if (user!.name) {
    cookies().set("name", user!.name);
  }

  if (!user && !pathname.includes("/login")) {
    alert("Something went wrong");
    cookies().delete("session");
    redirect(new URL("/login", process.env.MAIN_URL).toString());
  }

  if (
    (!user!.name || !user!.welcomed) &&
    !pathname.includes("/welcome") &&
    !pathname.includes("/login") &&
    !pathname.includes("/admin")
  ) {
    redirect(new URL("/welcome", process.env.MAIN_URL).toString());
  }
}

export default async function GlyphLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await checkAuth();

  return (
    <>
      <Header title="Glyph" />
      <main className={styles.main}>{children}</main>
      <Navbar />
    </>
  );
}
