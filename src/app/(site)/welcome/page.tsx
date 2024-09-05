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
            Votre mission : <b>reconstituer le Glyph Ancestral</b> en explorant
            le campus, en relevant des défis donnés par notre site ou nos
            donneurs de missions en brassard et en résolvant des énigmes pour
            retrouver les fragments cachés.
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
