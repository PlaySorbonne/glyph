import { getUserFromSession } from "@/actions/auth";
import { getFraternity } from "@/actions/fraternity";
import Setting from "./components/Setting";
import { FAQ, appUrl } from "@/utils";
import { getUserScoreHistory, getUserClassement } from "@/actions/users";
import { getFinishedMainQuests, getQuests } from "@/actions/quests";
import Link from "next/link";

export default async function Account() {
  let user = await getUserFromSession();
  let [fraternity, history, quests, finishedQuests] = await Promise.all([
    getFraternity(user!.fraternityId),
    getUserScoreHistory(user!.id),
    getQuests(),
    getFinishedMainQuests(user!.id),
  ]);
  let primaryQuests = quests.filter((quest) => !quest.secondary);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1
        className="text-3xl font-bold mb-8 text-center"
        style={{
          fontFamily: "DCC-Ash",
          fontSize: "2.25rem",
          letterSpacing: "0.1em",
        }}
      >
        Mon Compte
      </h1>
      <div className="bg-white bg-opacity-70 backdrop-blur-lg rounded-xl shadow-lg p-6">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Informations</h2>
          <div className="space-y-2">
            <p className="text-lg">
              <span className="font-semibold">Nom:</span> {user!.name}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Score:</span> {user?.score} points
            </p>
            <p className="text-lg">
              <span className="font-semibold">Classement:</span> {await getUserClassement(user!.score)}
            </p>
            <p className="text-lg">
              <span className="font-semibold">
                Progression quêtes principales:
              </span>{" "}
              {finishedQuests.length} / {primaryQuests.length}
            </p>
            {fraternity && (
              <p className="text-lg">
                <span className="font-semibold">Fraternité:</span>{" "}
                {fraternity?.name}
              </p>
            )}
          </div>
        </section>
        <section>
          <Setting label="Se déconnecter" type="children" popup>
            <div className="p-4">
              <Link
                href={appUrl("/logout")}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Êtes-vous sûr ?
              </Link>
            </div>
          </Setting>
          <Setting label="Historique des scores" type="children">
            {history.map((item) => (
              <div
                key={item.id}
                style={{
                  marginBottom: "1rem",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <p
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {item.questId
                    ? quests.find((quest) => quest.id === item.questId)?.title
                    : "Code"}
                </p>
                {item.description && item.description !== null && (
                  <p>{item.description}</p>
                )}
                <p>{item.points} points</p>
                <p>{item.date.toLocaleDateString("en-GB")}</p>
              </div>
            ))}
          </Setting>
          <Setting label="FAQ" type="children">
            {FAQ.map((item, index) => (
              <Setting key={index} label={item.question} type="children">
                <p>{item.answer}</p>
              </Setting>
            ))}
          </Setting>
        </section>
        <section style={{
          marginTop: "2rem",
          paddingLeft: "1rem"
        }}>
          <p>
            Suivez Play Sorbonne Université sur les réseaux !
          </p>
          <p>
            <Link href="https://www.instagram.com/play_sorbonne_u/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              Instagram
            </Link>
          </p>
          <p>
            <Link href="https://discord.gg/be5X7qMNSQ" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              Discord
            </Link>
          </p>
          <p>
            <Link href="https://www.youtube.com/@PlaySorbonne" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              Youtube
            </Link>
          </p>
          <p>
            <Link href="https://www.twitch.tv/play_sorbonne" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              Twitch
            </Link>
          </p>

        </section>
      </div>
    </div>
  );
}
