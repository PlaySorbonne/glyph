import { getQuests } from "@/actions/quests";
import Table from "../../components/Table";
import Link from "next/link";

export default async function AllQuestsPage() {

  return (
    <>
        <h1>Quêtes</h1>
        <Table data={(await getQuests()).map((e) => {return {...e, href: "/admin/quest/" + e.id}})} />
        <Link href="/admin/quest/new">Créer une quête</Link>
    </>
  );
}
