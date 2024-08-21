import React from "react";
import { getQuest, addCodeToQuest } from "@/actions/quests";
import { generateCode } from "@/utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function AddQuestCodePage({ params }: { params: { id: string } }) {
  const quest = await getQuest(params.id);

  if (!quest) {
    return <div>Quest not found</div>;
  }

  const submit = async (formData: FormData) => {
    "use server";

    let code = formData.get("code") as string;
    if (!code) {
      code = generateCode();
    }

    const description = formData.get("description") as string;
    const expiresString = formData.get("expires") as string;
    const expires = expiresString ? new Date(expiresString) : null;

    try {
      await addCodeToQuest(params.id, {
        code,
        description: description || undefined,
        expires,
        isQuest: true,
      });
      revalidatePath(`/admin/quest/${params.id}`);
      redirect(`/admin/quest/${params.id}`);
    } catch (error) {
      console.error("Error adding code to quest:", error);
    }
  };

  return (
    <form action={submit} className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">Add Code to Quest: {quest.title}</h1>

      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
          Code (optional)
        </label>
        <input
          type="text"
          name="code"
          id="code"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="Leave blank to generate automatically"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description (optional)
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        ></textarea>
      </div>

      <div>
        <label htmlFor="expires" className="block text-sm font-medium text-gray-700">
          Expires (optional)
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
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Code
        </button>
      </div>
    </form>
  );
}