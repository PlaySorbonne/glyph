import WelcomePage from "./components/WelcomePage";
import WelcomeButton from "@/components/WelcomeButton";

export default async function Welcome() {
  return (
    <WelcomePage>
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
      {process.env.DISABLE_LOGIN ? (
        <>
          <p>
            Le jeu de piste démarre le <b>9 septembre</b> ! Revenez plus tard
          </p>
          <WelcomeButton link="/">Continuer</WelcomeButton>
        </>
      ) : (
        <>
          <p>
            Vous êtes sur le point de rejoindre{" "}
            <b
              style={{
                fontFamily: "DCC-Ash",
                letterSpacing: "0.1rem",
              }}
            >
              Glyph
            </b>
            , un jeu conçu pour rendre votre expérience universitaire plus
            amusante et interactive. Votre mission sera d&apos;explorez le campus,
            relevez des défis, et participez à la victoire de votre fratrie.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "1rem",
            }}
          >
            <div
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <WelcomeButton link="/welcome/2">Continuer</WelcomeButton>
            </div>
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <p>Déjà un compte ?</p>
              <WelcomeButton link="/app/login">Se connecter</WelcomeButton>
            </div>
          </div>
        </>
      )}
    </WelcomePage>
  );
}
