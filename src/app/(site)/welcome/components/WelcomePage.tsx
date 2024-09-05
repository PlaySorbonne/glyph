import Fraternities from "@/assets/fraternities";
import Link from "next/link";

export default function WelcomePage(
  props:
    | {
        title: string;
        content: string;
        children?: undefined | null;
      }
    | {
        children: React.ReactNode;
        title?: undefined | null;
        content?: undefined | null;
      }
) {
  return (
    <section
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundImage: `url(${Fraternities.default.fond.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          padding: "2rem",
          borderRadius: "1rem",
          minWidth: "70%",
          maxWidth: "90%",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }}
      >
        {props.title && (
          <>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                fontFamily: "DCC-Ash",
                letterSpacing: "0.2rem",
              }}
            >
              Bienvenue sur Glyph
            </h1>
            <p>
              Votre mission : <b>reconstituer le Glyph Ancestral</b> en
              explorant le campus, en relevant des défis donnés par notre site
              ou nos donneurs de missions en brassard et en résolvant des
              énigmes pour retrouver les fragments cachés.
            </p>
            <Link
              href="/welcome/2"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                fontWeight: "bold",
                padding: "1rem",
                marginTop: "1rem",
                borderRadius: "1rem",
                textAlign: "center",
                textDecoration: "none",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                fontFamily: "DCC-Ash",
                letterSpacing: "0.1rem",
                fontSize: "1.2rem",
              }}
            >
              Continuer
            </Link>
          </>
        )}
        {props.children}
      </div>
    </section>
  );
}
