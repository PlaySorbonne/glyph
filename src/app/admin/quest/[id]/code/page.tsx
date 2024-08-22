import React from "react";
import Table from "../../../components/Table";
import Link from "next/link";
import { getCodesOfQuest } from "@/actions/code";

export const dynamic = "force-dynamic";

export default async function QuestCodesPage({
  params,
}: {
  params: { id: string };
}) {
  const codes = await getCodesOfQuest(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Codes de la quête</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <Table
          data={codes.map((code) => ({
            ...code,
            href: `/admin/code/${code.id}`,
          }))}
        />
        <Link
          href={`/admin/quest/${params.id}`}
          className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Retour à la quête
        </Link>
        <Link
          href={`/admin/quest/${params.id}/code/new`}
          className="mt-4 ml-4 inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Ajouter un code
        </Link>
      </div>
    </div>
  );
}
