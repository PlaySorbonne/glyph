import { getUserFromSession } from "@/actions/auth";
import { getAvailablePrimaryQuests, getFinishedQuests } from "@/actions/quests";

export default async function Book() {
  let user = await getUserFromSession();
  let quests = await getAvailablePrimaryQuests(user!.id);
  let finishedQuests = await getFinishedQuests(user!.id);
  console.log(finishedQuests);

  return (
    <div>
      {[...quests, ...finishedQuests].map((quest) => (
        <div key={quest.id}>
          <h2>{quest.title}</h2>
          <p>{quest.description}</p>
        </div>
      ))}
    </div>
  );
}
