import Quest from "./Quest";
import type { Quest as QuestType } from "@prisma/client";


export default function Quests({ quests }: { quests: QuestType[] }) {
    return <div>
        {quests.map((quest) => <Quest key={quest.id} quest={quest} />)}
    </div>
}

