import React from "react";
import styles from "./page.module.css";
import Table from "./components/Table";
import { getQuests } from "@/actions/quests";
import { getUsers } from "@/actions/users";
import { getCodes } from "@/actions/code";
import Link from "next/link";
import { getFraternitysWithMembersCount } from "@/actions/fraternity";
import { importDatabase } from "@/actions/db";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      {searchParams.error && (
        <p className="text-red-500 text-sm mb-4">{searchParams.error}</p>
      )}
      {searchParams.message && (
        <p className="text-green-500 text-sm mb-4">{searchParams.message}</p>
      )}
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
      <div className="space-y-8">
        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Database Actions</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="/api/admin/export-database"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-block"
              download
            >
              Download Database
            </a>
            <form action={importDatabase} className="flex flex-col">
              <input
                type="file"
                name="databaseFile"
                accept=".json"
                className="mb-2"
                id="databaseFile"
              />
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-red-600 text-white hover:text-black font-bold py-2 px-4 rounded cursor-pointer inline-block"
              >
                Import Database
              </button>
              <p className="text-sm text-red-500 mt-1">
                Warning: This will overwrite existing data!
              </p>
            </form>
          </div>
        </section>

        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Quests</h2>
          <Table
            data={(await getQuests(3)).map((q) => {
              return { ...q, href: `/app/admin/quest/${q.id}` };
            })}
          />
          <Link
            href="/app/admin/quest/all"
            className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Voir toutes les quêtes
          </Link>
        </section>
        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Users</h2>
          <Table
            data={(await getUsers({ n: 3 })).map((u) => {
              return { ...u, href: `/app/admin/user/${u.id}` };
            })}
          />
          <Link
            href="/app/admin/user/all"
            className="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Voir tous les utilisateurs
          </Link>
        </section>
        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Codes</h2>
          <Table
            data={(await getCodes(3)).map((c) => {
              return { ...c, href: `/app/admin/code/${c.id}` };
            })}
          />
          <Link
            href="/app/admin/code/all"
            className="mt-4 inline-block bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
          >
            Voir tous les codes
          </Link>
        </section>
        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Fraternities</h2>
          <Table
            data={(await getFraternitysWithMembersCount())
              .slice(0, 3)
              .map((f) => {
                return {
                  ...f,
                  href: `/app/admin/fraternity/${f.id}`,
                  _count: f._count.users,
                };
              })}
          />
          <Link
            href="/app/admin/fraternity/all"
            className="mt-4 inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
          >
            Voir toutes les fraternités
          </Link>
        </section>
      </div>
    </div>
  );
}
