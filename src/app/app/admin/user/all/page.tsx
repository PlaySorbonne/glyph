import { getUsers } from "@/actions/users";
import Table from "../../components/Table";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AllUsersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Utilisateurs</h1>
      <Table
        data={(await getUsers()).map((u) => {
          return { ...u, href: `/app/admin/user/${u.id}` };
        })}
      />
    </div>
  );
}
