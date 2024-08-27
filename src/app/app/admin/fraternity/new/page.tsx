import { redirect } from "next/navigation";
import { addFraternity } from "@/actions/fraternity";
import { appUrl } from "@/utils";

export default function NewFraternityPage() {
  const handleSubmit = async (formData: FormData) => {
    "use server";

    let data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    };
    let newFraternity;

    try {
      newFraternity = await addFraternity(data);
    } catch (error) {
      console.error("Error creating fraternity:", error);
      return redirect(
        appUrl("/admin/fraternity/new?error=Error creating fraternity")
      );
    }
    return redirect(appUrl("/admin/fraternity/" + newFraternity.id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Create a New Fraternity
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <form action={handleSubmit} className="space-y-4">
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </div>

          <div>
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Fraternity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
