import { getUserById, getUserScoreHistory } from "@/actions/users";
import Table from "../../../components/Table";
import { getQuests } from "@/actions/quests";
import { getCodes } from "@/actions/code";

export default async function HistoryPage(props: {
  params: Promise<{ id: string }>;
}) {
  let params = await props.params;
  let history = await getUserScoreHistory(params.id);
  let codes = await getCodes();
  let user = await getUserById(params.id);
  let quests = await getQuests();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Historique de {user!.name}
      </h1>
      <Table
        data={history.map((h) => ({
          ...h,
              href: "/app/admin/history/" + h.id,
              codeId: codes.find((c) => c.id === h.codeId)?.code,
              userId: user?.name,
              questId: quests.find((q) => q.id === h.questId)?.title,
        }))}
      />
    </div>
  );
}
