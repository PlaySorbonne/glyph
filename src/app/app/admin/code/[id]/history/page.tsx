import { getUserById, getUserScoreHistory, getUsers } from "@/actions/users";
import Table from "../../../components/Table";
import { getQuests } from "@/actions/quests";
import { getCodeById, getCodes } from "@/actions/code";
import { getHistoryByCodeId } from "@/actions/history";

export default async function HistoryPage(props: {
  params: Promise<{ id: string }>;
}) {
  let params = await props.params;
  let [history, code, users, quests] = await Promise.all([
    getHistoryByCodeId(parseInt(params.id)),
    getCodeById(parseInt(params.id)),
    getUsers(),
    getQuests(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Historique du code {code!.code}
      </h1>
      <Table
        data={history.map((h) => ({
          ...h,
          href: "/app/admin/history/" + h.id,
          codeId: code!.code,
          userId: users.find((e) => e.id === h.userId)?.name,
          questId: quests.find((q) => q.id === h.questId)?.title,
        }))}
      />
    </div>
  );
}
