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

async function checkAuth() {
  "use server";

  let pathname = await getHeaderUrl();

  const session = await getSession();

  if (!session && !pathname.includes("/login"))
    redirect(new URL("/login", process.env.MAIN_URL).toString());
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
