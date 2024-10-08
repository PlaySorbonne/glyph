import {
  createDefaultFraternitys,
  getFraternitysWithMembersCount,
} from "@/actions/fraternity";
import Table from "../../components/Table";

export const dynamic = "force-dynamic";

export default async function AllFraternitiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Fraternités</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <Table
          data={(await getFraternitysWithMembersCount()).map((f) => {
            return {
              ...f,
              href: `/app/admin/fraternity/${f.id}`,
              _count: f._count.users,
            };
          })}
        />
        <form action={createDefaultFraternitys}>
          <button
            type="submit"
            className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Créer les fraternités par défaut
          </button>
        </form>
      </div>
    </div>
  );
}
