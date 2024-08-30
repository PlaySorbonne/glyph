import Navbar from "./components/Navbar/Navbar";
import styles from "./layout.module.css";

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
