import { Metadata } from "next";
import Navbar from "./components/Navbar/Navbar";
import styles from "./layout.module.css";
import { cookies } from "next/headers";
import Fraternities, { getBackground } from "@/assets/fraternities";
import Header from "./components/Header/Header";

export const metadata: Metadata = {
  title: "Glyph",
  description:
    "Jeu de piste pour découvrir le campus Jussieu de Sorbonne Université !",
  generator: "Next.js",
  manifest: "/manifest.json",
  icons: [
    { rel: "apple-touch-icon", url: "/ios/128.png" },
    { rel: "icon", url: "/ios/128.png" },
  ],
};

export default async function GlyphLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const backgroundCookie = cookies().get("fraternityId")?.value;
  const background = getBackground(parseInt(backgroundCookie ?? "-1"));

  return (
    <>
      <div
        className={styles.center}
        style={{
          backgroundImage: `url(${background.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className={styles.content}>
          <Header />
          <div style={{ height: "100px"}} />
          <main style={{
            minHeight: "calc(100vh - 150px)",
            margin: "0 1rem"
          }}>{children}</main>
          <div style={{ height: "50px "}}/>
          <Navbar />
        </div>
      </div>
    </>
  );
}
