import { getSession, getUserFromSession } from "@/actions/auth";
import { joinRandomFraternity, updateUserSelf } from "@/actions/users";
import Fraternities from "@/assets/fraternities";
import { appUrl } from "@/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Welcome1Page() {
  let user = await getUserFromSession();
  if (user?.fraternityId) {
    redirect(appUrl(`/welcome/3?fraternityId=${user.fraternityId}`));
  }

  let question = questions[Math.floor(Math.random() * questions.length)];

  async function handleSubmit() {
    "use server";
    if (user?.fraternityId) {
      redirect(appUrl(`/welcome/3?fraternityId=${user.fraternityId}`));
    }

    let fraternityId: number;
    try {
      fraternityId = await joinRandomFraternity(user!.id);
    } catch (error) {
      if (error instanceof Error) {
        redirect(appUrl(`/welcome/2?error=${error.message}`));
      } else {
        redirect(appUrl(`/welcome/2?error=Une erreur inconnue est survenue`));
      }
    }
    (await cookies()).set("fraternityId", fraternityId.toString());
    redirect(appUrl(`/welcome/3?fraternityId=${fraternityId}`));
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-6"
      style={{
        backgroundImage: `url(${Fraternities.default.fond.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-md w-full bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center" style={{
          fontFamily: "DCC-Ash",
          letterSpacing: "0.2rem",
        }}>
          Votre fratrie...
        </h1>
        <p style={{
          padding: "1rem 0"
        }}>Répondez à cette question pour que l&apos;on vous assigne votre fratrie</p>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              {question.question}
            </label>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {question.reponses.map((reponse) => (
                <div
                  key={reponse}
                  style={{
                    padding: "1rem",
                    display: "flex",
                  }}
                >
                  <input
                    type="radio"
                    name="reponse"
                    value={reponse}
                    className="rounded-full"
                    id={reponse}
                  />
                  <label htmlFor={reponse}>
                  {reponse}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-white text-purple-600 font-bold py-3 px-4 rounded-lg text-center transition duration-300 ease-in-out hover:bg-purple-100"
          >
            Continuer
          </button>
        </form>
      </div>
    </div>
  );
}

let questions = [
  {
    question: "Quel est votre animal favori ?",
    reponses: ["Poisson-zebre", "Grenouille-Taureau", "Lapin-chameau"],
  },
  {
    question: "Quel est votre sport favori ?",
    reponses: ["Hockey sur gazon", "Hockey sur glace", "Hockey en salle"],
  },
  {
    question: "Quel est votre plat favori ?",
    reponses: ["Pâtes au beurre", "Beurre aux pâtes", "Pâtes aux pâtes "],
  },
  {
    question:
      "Cliquez sur l'image qui vous fait ressentir le plus de bonheur :",
    reponses: ["Chienvoiture", "Kirbyfok", "Champsu"],
  },
  {
    question: "Si vous rencontrez un puma, que faites vous : ",
    reponses: [
      "J'achète une casquette",
      "Je rugis plus fort que lui",
      "Je grimpe a un arbre",
    ],
  },
];
