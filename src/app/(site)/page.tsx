import Image from "next/image";
import Link from "next/link";

import Logo from "@/assets/logo-flat.png";
import Champsu from "@/assets/champsu.png";
import Dlc from "@/assets/dlc.png";
import styles from "./page.module.css";
import Carrousel from "./components/Carrousel";

export default function Page() {
  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: "150px",
          zIndex: "1000",
          position: "fixed",
          top: "0",
          width: "100vw",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Link href="/" className={styles.link}>
          <Image src={Logo} alt="logo" width={100} />
        </Link>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            href="https://playsorbonne.fr"
            target="_blank"
            className={styles.link}
          >
            <Image src={Champsu} alt="logo" height={100} />
          </Link>
          <Link
            href="https://playsorbonne.fr/dlc"
            target="_blank"
            className={styles.link}
          >
            <Image src={Dlc} alt="logo" height={100} />
          </Link>
        </div>
      </header>
      <section>
        <Carrousel />
      </section>
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            padding: "2rem",
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              fontFamily: "DCC-Ash",
            }}
          >
            Découvrez le campus !
          </h1>
          <p>
            Avec glyph, vous pourrez découvrir le campus Jussieu de la Sorbonne
            Université à travers ce site.
          </p>
          <p>
            Vous pourrez retrouver les différents bâtiments, les lieux
            importants, les activités proposées et bien plus encore ! Explorer
            le campus, relevez des défis, et partipez à la victoire de votre
            fratrie.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Link
              href="/app"
              style={{
                backgroundColor: "#498",
                color: "white",
                padding: "1rem 2rem",
                borderRadius: "0.5rem",
                fontWeight: "bold",
                marginTop: "2rem",
              }}
            >
              Rejoignez l&apos;aventure dès le 9 septembre !
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
