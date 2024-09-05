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
      console.log(fraternityId);
    } catch (error) {
      if (error instanceof Error) {
        redirect(appUrl(`/welcome/2?error=${error.message}`));
      } else {
        redirect(appUrl(`/welcome/2?error=Une erreur inconnue est survenue`));
      }
    }
    cookies().set("fraternityId", fraternityId.toString());
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
        <h1 className="text-3xl font-bold mb-6 text-center">
          Votre fraternité...
        </h1>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              {question.question}
            </label>
            <div
              style={{
                display: "flex",
              }}
            >
              {question.reponses.map((reponse) => (
                <div
                  key={reponse}
                  className="flex items-center justify-center space-y-2"
                >
                  <input
                    type="radio"
                    name="reponse"
                    value={reponse}
                    className="rounded-full"
                  />
                  {reponse}
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
    question: "Si vous vous sentez triste que faites vous : ",
    reponses: ["Je pleure", "J'utilise l'appel à un ami", "J'arrête "],
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
