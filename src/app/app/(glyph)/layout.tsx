import { Metadata } from "next";
import Navbar from "./components/Navbar/Navbar";
import styles from "./layout.module.css";

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

  return (
    <>
      <div className={styles.center}>
        <div className={styles.content}>
          <main>{children}</main>
          <Navbar />
        </div>
      </div>
    </>
  );
}
