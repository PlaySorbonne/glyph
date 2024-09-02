import { getUserFromSession } from "@/actions/auth";
import { getQuest, hasUserFinishedQuest } from "@/actions/quests";
import { appUrl } from "@/utils";
import { redirect } from "next/navigation";

export default async function QuestPage({
  params,
}: {
  params: { id: string };
}) {
  let questId = parseInt(params.id);
  if (isNaN(questId)) {
    return redirect(appUrl("/?error=Cette quête n'existe pas"));
  }
  let user = await getUserFromSession();
  let hasFinishedQuest = await hasUserFinishedQuest(
    user!.id,
    parseInt(params.id)
  );
  let quest = await getQuest(params.id);

  if (!quest) {
    return redirect(appUrl("/?error=Cette quête n'existe pas"));
  }

  return <div>
      <div>
        <h1>{quest.title}</h1>
        <p>{quest.mission}</p>
      </div>
    </div>
}
