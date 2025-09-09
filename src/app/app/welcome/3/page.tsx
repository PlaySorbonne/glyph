import Link from "next/link";
import {
  getBackground,
  getName,
  getLogo,
} from "@/assets/fraternities";
import Image from "next/image";
import { getUserFromSession } from "@/actions/auth";

export default async function WelcomePage() {
  const fraternityId = await getUserFromSession().then(
    (user) => user!.fraternityId! as 1 | 2 | 3
  );
  const background = getBackground(fraternityId);
  const fraternity = getName(fraternityId);
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-6"
      style={{
        backgroundImage: `url(${background.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Image
        src={getLogo(fraternityId)}
        alt={fraternity}
        width={100}
        height={100}
      />
      <div className="max-w-md w-full bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg p-8">
        <h1
          className="text-3xl font-bold mb-6 text-center"
          style={{
            fontFamily: "DCC-Ash",
            letterSpacing: "0.2rem",
          }}
        >
          Hmm... {fraternity} !
        </h1>
        <p className="text-lg mb-8 text-center">
          {phrase[fraternityId] ??
            "Vous avez été choisi pour rejoindre une fraternité légendaire. Rocher, Ciseaux ou Feuille, vous portez désormais les couleurs d'un.e des fondateur.ice de Glyph. Votre aventure commence maintenant ! "}
        </p>
        <Link
          href="/app"
          className="block w-full bg-white text-purple-600 font-bold py-3 px-4 rounded-lg text-center transition duration-300 ease-in-out hover:bg-purple-100"
        >
          Commencer
        </Link>
      </div>
    </div>
  );
}

let phrase = {
  1: "Votre force et votre détermination inébranlables vous ancrent dans la fraternité du Rocher. Comme son fondateur Pietr, vous êtes une véritable force de la nature, prêt à surmonter tous les obstacles avec bravoure.",
  2: "Votre esprit aiguisé et votre rapidité d'exécution vous placent sous la bannière de la fraternité des Ciseaux. Comme sa fondatrice Saka, vous coupez à travers les mystères avec finesse et intelligence.",
  3: "Votre imagination fertile et votre connexion intuitive à l'essence-jeu vous lient à la fraternité de la Feuille. Comme san fondateur.ice Foli, vous suivez les courants du savoir avec sagesse et créativité.",
};
