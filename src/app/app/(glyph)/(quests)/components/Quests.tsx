import Quest from "./Quest";
import type { Quest as QuestType } from "@prisma/client";

export default function Quests({ quests }: { quests: QuestType[] }) {
  return (
    <div className="container mx-auto px-4 py-8">
      {quests.length === 0 ? (
        <p className="text-center text-gray-500 p-4">Pas de quêtes disponibles !</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quests.map((quest) => <Quest key={quest.id} quest={quest} />)}
        </div>
      )}
    </div>
  );
}