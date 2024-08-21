import React from "react";
import styles from "./page.module.css";
import Table from "./components/Table";
import { getQuests } from "@/actions/quests";
import { getUsers } from "@/actions/users";
import Link from "next/link";

export default async function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
      <div className="">
        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Quests</h2>
          <Table data={(await getQuests(10)).map((q) => {return {...q, href: `/admin/quest/${q.id}`}})} />
          <Link href="/admin/quest/all" className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
           Voir toutes les quêtes
          </Link>
        </section>
        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Users</h2>
          <Table data={(await getUsers(10)).map((u) => {return {...u, href: `/admin/user/${u.id}`}})} />
          <Link href="/admin/user/all" className="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Voir tous les utilisateurs
          </Link>
        </section>
      </div>
    </div>
  );
}