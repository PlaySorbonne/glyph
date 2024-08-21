import React from "react";
import { updateQuest, getQuest } from "@/actions/quests";
import { questSchema, QuestInput } from "@/utils/constants";
import { ZodError } from "zod";
import { revalidatePath } from "next/cache";

export default async function EditQuestPage({ params }: { params: { id: string } }) {
  const quest = await getQuest(params.id);

  if (!quest) {
    return <div>Quest not found</div>;
  }

  const submit = async (formData: FormData) => {
    "use server";

    const questData: QuestInput = {
      title: formData.get("title") as string,
      img: (formData.get("img") as string) || null,
      description: (formData.get("description") as string) || null,
      lore: (formData.get("lore") as string) || null,
      global: formData.get("global") === "on",
      points: parseInt(formData.get("points") as string) || 1,
      starts: formData.get("starts")
        ? new Date(formData.get("starts") as string)
        : null,
      ends: formData.get("ends")
        ? new Date(formData.get("ends") as string)
        : null,
    };

    try {
      const updatedQuest = await updateQuest(params.id, questData);
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle validation errors
      } else {
        console.error("Error updating quest:", error);
      }
      revalidatePath("/admin/quest/" + params.id);
    }
  };

  return (
    <form action={submit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title (required)
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          defaultValue={quest.title}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="img"
          className="block text-sm font-medium text-gray-700"
        >
          Image URL
        </label>
        <input
          type="text"
          name="img"
          id="img"
          defaultValue={quest.img || ""}
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
          defaultValue={quest.description || ""}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        ></textarea>
      </div>

      <div>
        <label
          htmlFor="lore"
          className="block text-sm font-medium text-gray-700"
        >
          Lore
        </label>
        <textarea
          name="lore"
          id="lore"
          rows={5}
          defaultValue={quest.lore || ""}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        ></textarea>
      </div>

      <div>
        <label htmlFor="global" className="flex items-center">
          <input
            type="checkbox"
            name="global"
            id="global"
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            defaultChecked={quest.global}
          />
          <span className="ml-2 text-sm text-gray-700">Global</span>
        </label>
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
          defaultValue={quest.points}
          min={1}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="starts"
          className="block text-sm font-medium text-gray-700"
        >
          Start Date
        </label>
        <input
          type="datetime-local"
          name="starts"
          id="starts"
          defaultValue={quest.starts ? quest.starts.toISOString().slice(0, 16) : ""}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="ends"
          className="block text-sm font-medium text-gray-700"
        >
          End Date
        </label>
        <input
          type="datetime-local"
          name="ends"
          id="ends"
          defaultValue={quest.ends ? quest.ends.toISOString().slice(0, 16) : ""}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Update Quest
        </button>
      </div>
    </form>
  );
}
