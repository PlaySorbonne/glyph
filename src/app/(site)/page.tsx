import Image from "next/image";
import Link from "next/link";

import Logo from "@/assets/logo-flat.png";
import Champsu from "@/assets/champsu.png";
import Dlc from "@/assets/dlc.png";
import styles from "./page.module.css";
import Carrousel from "./components/Carrousel";

import { FAQ } from "@/utils";

export default function Page() {
  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: "80px",
          zIndex: "100",
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
          <Image src={Logo} alt="logo" width={70} />
        </Link>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            href="https://playsorbonne.fr"
            target="_blank"
            className={styles.link}
          >
            <Image src={Champsu} alt="logo" height={70} />
          </Link>
          <Link
            href="https://playsorbonne.fr/dlc"
            target="_blank"
            className={styles.link}
          >
            <Image src={Dlc} alt="logo" height={70} />
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
            Découvrez le campus Pierre et Marie Curie de Sorbonne Université à
            travers a travers Glyph sur ce site.
          </p>
          <p>
            Vous pourrez retrouver les différents bâtiments, les lieux
            importants, les activités proposées et bien plus encore ! Explorez
            le campus, relevez des défis, et participez à la victoire de votre
            fraternité !
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Link
              href="/welcome"
              style={{
                backgroundColor: "#498",
                color: "white",
                padding: "1rem 2rem",
                borderRadius: "0.5rem",
                fontWeight: "bold",
                marginTop: "2rem",
                marginBottom: "1rem",
              }}
            >
              Rejoignez l&apos;aventure dès le 9 septembre !
            </Link>
          </div>
        </div>
      </section>
      <section id="faq" style={{
        backgroundColor: "#eee",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
      }}>
        <div style={{
          padding: "2rem",
          maxWidth: "1000px",
        }}>
          <h1 style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            fontFamily: "DCC-Ash",
            letterSpacing: "0.1rem",
          }}>Qualitatively Anticipated Fake Frequently Asked Questions :</h1>
          {FAQ.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "1rem",
              }}
            >
              <h2 style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}>{item.question}</h2>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
