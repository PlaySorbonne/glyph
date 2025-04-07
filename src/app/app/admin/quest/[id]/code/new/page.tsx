import React from "react";
import { addCodeToQuest } from "@/actions/code";
import { redirect } from "next/navigation";
import { appUrl } from "@/utils";

export default async function NewQuestCodePage(props: {
  params: Promise<{ id: string }>;
}) {
  let params = await props.params;
  const handleSubmit = async (formData: FormData) => {
    "use server";

    const codeData = {
      code: formData.get("code") as string,
      description: (formData.get("description") as string) || null,
      expires: formData.get("expires")
        ? new Date(formData.get("expires") as string)
        : null,
    };

    try {
      await addCodeToQuest(params.id, codeData);
    } catch (error) {
      console.error("Error adding code to quest:", error);
      return redirect(
        appUrl(
          `/admin/quest/${
            params.id
          }/code/new?error=${"Erreur lors de l'ajout du code à la quête"}`
        )
      );
    }
    return redirect(appUrl(`/admin/quest/${params.id}/code`));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Ajouter un code à la quête
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700"
            >
              Code (required)
            </label>
            <input
              type="text"
              name="code"
              id="code"
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
            <label
              htmlFor="expires"
              className="block text-sm font-medium text-gray-700"
            >
              Expiration Date
            </label>
            <input
              type="datetime-local"
              name="expires"
              id="expires"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
