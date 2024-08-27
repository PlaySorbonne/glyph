import { getQuests } from "@/actions/quests";
import Table from "../../components/Table";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AllQuestsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Quêtes</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <Table
          data={(await getQuests()).map((e) => {
            return { ...e, href: "/app/admin/quest/" + e.id };
          })}
        />
        <Link
          href="/app/admin/quest/new"
          className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Créer une quête
        </Link>
      </div>
    </div>
  );
}
