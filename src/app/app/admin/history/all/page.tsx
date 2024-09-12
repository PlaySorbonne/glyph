import { getQuests } from "@/actions/quests";
import Table from "../../components/Table";
import Link from "next/link";
import { getHistories } from "@/actions/history";
import { getCodes } from "@/actions/code";
import { getUsers } from "@/actions/users";

export const dynamic = "force-dynamic";

export default async function AllHistoryPage() {
  let quests = await getQuests();
  let users = await getUsers();
  let codes = await getCodes();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Historique</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <Table
          data={(await getHistories()).map((h) => {
            return {
              ...h,
              href: "/app/admin/history/" + h.id,
              codeId: codes.find((c) => c.id === h.codeId)?.code,
              userId: users.find((e) => e.id === h.userId)?.name,
              questId: quests.find((q) => q.id === h.questId)?.title,
            };
          })}
        />
      </div>
    </div>
  );
}
