import { getUserFromSession } from "@/actions/auth";
import { getAvailableQuests } from "@/actions/quests";
import { cookies } from "next/headers";
import Quests from "./components/Quests";

export default async function Home() {
  let session = cookies().get("session")!.value;
  let user = await getUserFromSession(session);
  let quests = await getAvailableQuests(user!.id);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-600">Available Quests</h2>
        <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg p-8">
          <Quests quests={quests} />
        </div>
      </div>
    </div>
  );
}