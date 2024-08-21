import React from "react";
import { createQuest } from "@/actions/quests";
import { questSchema, QuestInput } from "@/utils/constants";
import { ZodError } from "zod";
import { redirect } from "next/navigation";
import { generateCode } from "@/utils";

export default function NewQuestPage() {
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

    const code = (formData.get("code") as string) || generateCode();

    try {
      const newQuest = await createQuest(questData, code);
      redirect("/admin/quest/" + newQuest.id);
    } catch (error) {
      if (error instanceof ZodError) {
      } else {
        console.error("Error creating quest:", error);
      }
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
          htmlFor="lore"
          className="block text-sm font-medium text-gray-700"
        >
          Lore
        </label>
        <textarea
          name="lore"
          id="lore"
          rows={5}
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
            defaultChecked
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
          defaultValue={1}
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="code"
          className="block text-sm font-medium text-gray-700"
        >
          Quest Code (optional)
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            name="code"
            id="code"
            className="flex-1 rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter code or leave blank to auto-generate"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Quest
        </button>
      </div>
    </form>
  );
}