import React from "react";
import Table from "../../components/Table";
import Link from "next/link";
import { getCodes } from "@/actions/code";

export const dynamic = "force-dynamic";

export default async function AdminCodeAllPage() {
  const codes = await getCodes();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Tous les codes</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <Table
          data={codes.map((code) => ({
            ...code,
            href: `/admin/code/${code.id}`,
          }))}
        />
        <Link
          href="/admin/code/new"
          className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Créer un nouveau code
        </Link>
      </div>
    </div>
  );
}
