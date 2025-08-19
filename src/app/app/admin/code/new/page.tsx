import React from "react";
import { addCode } from "@/actions/code";
import { redirect } from "next/navigation";
import { appUrl } from "@/utils";
import { DateTime } from "luxon";

export default function NewCodePage() {
  const handleSubmit = async (formData: FormData) => {
    "use server";
    let code;

    const codeData = {
      code: formData.get("code") as string,
      description: (formData.get("description") as string) || undefined,
      isQuest: formData.get("questId") ? true : false,
      points: parseInt(formData.get("points") as string) || undefined,
      expires: formData.get("expires")
        ? DateTime.fromISO(formData.get("expires") as string, { zone: "Europe/Paris" }).toJSDate()
        : undefined,
      questId: formData.get("questId")
        ? parseInt(formData.get("questId") as string)
        : undefined,
    };

    try {
      code = await addCode(codeData);
    } catch (error) {
      console.error("Error adding code:", error);
      return redirect(
        appUrl(`/admin/code/new?error=${"Erreur lors de l'ajout du code"}`)
      );
    }
    return redirect(appUrl(`/admin/code/${code.id}`));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Ajouter un nouveau code
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
              htmlFor="points"
              className="block text-sm font-medium text-gray-700"
            >
              Points
            </label>
            <input
              type="number"
              name="points"
              id="points"
              min={0}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
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
            <label
              htmlFor="questId"
              className="block text-sm font-medium text-gray-700"
            >
              Quest ID
            </label>
            <input
              type="number"
              name="questId"
              id="questId"
              min={1}
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
