import { getUserFromSession, logout } from "@/actions/auth";
import {
  getAvailableQuests,
  getNewlyCreatedQuests,
  getAvailableSecondaryQuests,
} from "@/actions/quests";
import { cookies } from "next/headers";
import Quests from "./components/Quests";
import { redirect } from "next/navigation";

export default async function Home() {
  let session = cookies().get("session")?.value;
  let user = await getUserFromSession(session);
  let quests = await getAvailableQuests(user!.id);
  let liveQuests = await getNewlyCreatedQuests();
  let secondaryQuests = await getAvailableSecondaryQuests(user!.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div>
        <div className="flex items-center gap-4">
          <h1 className="font-bold">{user!.name}</h1>
          <p className="font-bold">{user!.score} points</p>
        </div>
      </div>
      <div className="space-y-8">
        <section className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-600">
            Quêtes Principales
          </h2>
          <Quests quests={quests} />
        </section>
        {liveQuests.length > 0 && (
          <section className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-600">
              Quêtes nouvellement annoncées
            </h2>
            <Quests quests={liveQuests} />
          </section>
        )}
        <section className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-600">
            Quêtes secondaires
          </h2>
          <Quests quests={secondaryQuests} />
        </section>
      </div>
    </div>
  );
}
