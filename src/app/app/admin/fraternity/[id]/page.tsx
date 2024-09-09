import { redirect } from "next/navigation";
import { getFraternity, updateFraternity } from "@/actions/fraternity";
import Link from "next/link";
import { appUrl } from "@/utils";

export default async function EditFraternityPage({
  params,
}: {
  params: { id: string };
}) {
  const fraternity = await getFraternity(parseInt(params.id));

  if (!fraternity) {
    return <div>Fraternity not found</div>;
  }

  const handleSubmit = async (formData: FormData) => {
    "use server";

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    try {
      await updateFraternity(parseInt(params.id), { name, description });
    } catch (error) {
      console.error("Error updating fraternity:", error);
      return redirect(
        appUrl(`/admin/fraternity/${params.id}?error=Error updating fraternity`)
      );
    }
    return redirect(appUrl(`/admin/fraternity/all`));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Edit Fraternity: {fraternity.name}
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <form action={handleSubmit} className="space-y-4">
        <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Id
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              defaultValue={fraternity.id}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name (required)
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              defaultValue={fraternity.name}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              defaultValue={fraternity.description || ""}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Fraternity
            </button>
            <Link
              href="/app/admin/fraternity/all"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
