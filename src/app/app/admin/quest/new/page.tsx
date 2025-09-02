import React from "react";
import { createQuest } from "@/actions/quests";
import { NormalQuestInput } from "@/utils/zod";
import { redirect } from "next/navigation";
import {
  appUrl,
  generateCode,
  GLYPH_MAX_SIZE,
  glyphArrayToString,
  glyphStringToArray,
  smallestContainingAllOnes,
} from "@/utils";
import PixelMatch from "@/app/app/components/PixelMatch";
import { Quest } from "@prisma/client";
import prisma from "@/lib/db";
import SubQuestsChooser from "../SubQuestsChooser";
import { DateTime } from "luxon";

export const dynamic = "force-dynamic";

export default async function NewQuestPage() {
  let EmptyQuests = await prisma.quest.findMany({
    where: { parentId: null },
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
  });
  let nonEmptyQuests = await prisma.quest.findMany({
    where: { parentId: { not: null } },
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
  });
  let quests = [...EmptyQuests, ...nonEmptyQuests].map((q) => ({
    id: q.id,
    title: `${q.title} - ${q.id}`,
  }));

  const handleSubmit = async (formData: FormData) => {
    "use server";

    const glyphInput = formData.get("glyph") as string;
    const {
      matrix: glyphArr,
      coords: [glyphPositionX, glyphPositionY],
    } = smallestContainingAllOnes(glyphStringToArray(glyphInput) || []) ?? [];
    const glyphStr = glyphArrayToString(glyphArr) || null;

    const questData: NormalQuestInput = {
      title: formData.get("title") as string,
      mission: (formData.get("mission") as string) || null,
      description: (formData.get("description") as string) || null,
      indice: (formData.get("indice") as string) || null,
      lore: (formData.get("lore") as string) || null,
      lieu: (formData.get("lieu") as string) || null,
      secondary: formData.get("secondary") === "on",
      points: parseInt(formData.get("points") as string) || 1,
      starts: formData.get("starts")
        ? DateTime.fromISO(formData.get("starts") as string, {
            zone: "Europe/Paris",
          }).toJSDate()
        : null,
      ends: formData.get("ends")
        ? DateTime.fromISO(formData.get("ends") as string, {
            zone: "Europe/Paris",
          }).toJSDate()
        : null,
      horaires: (formData.get("horaires") as string) || null,
      glyph: glyphStr,
      glyphPositionX: glyphPositionX,
      glyphPositionY: glyphPositionY,
      clickable: formData.get("clickable") === "on",
      hidden: formData.get("hidden") === "on",
    };

    const code = (formData.get("code") as string) || generateCode();

    let newQuest: Quest | null = null;
    try {
      newQuest = await createQuest(questData, code);

      const subQuests = (formData.get("subQuests") as string)
        .split(",")
        .map((id) => parseInt(id))
        .filter((id) => !isNaN(id));

      console.log("SubQuests:", subQuests);

      Promise.all(
        subQuests.map((subQuestId) =>
          prisma.quest.update({
            where: { id: subQuestId },
            data: { parentId: newQuest!.id },
          })
        )
      ).catch((error) => {
        console.error("Error updating subquests:", error);
      });
    } catch (error) {
      console.error("Error creating quest:", error);
      return;
    }
    return redirect(appUrl("/admin/quest/" + newQuest.id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Créer une nouvelle quête
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <form action={handleSubmit} className="space-y-4">
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
              htmlFor="mission"
              className="block text-sm font-medium text-gray-700"
            >
              Mission
            </label>
            <textarea
              name="mission"
              id="mission"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="horaires"
              className="block text-sm font-medium text-gray-700"
            >
              horaires
            </label>
            <input
              type="text"
              name="horaires"
              id="horaires"
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
              htmlFor="indice"
              className="block text-sm font-medium text-gray-700"
            >
              Indice
            </label>
            <textarea
              name="indice"
              id="indice"
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
            <label
              htmlFor="lieu"
              className="block text-sm font-medium text-gray-700"
            >
              Lieu
            </label>
            <input
              type="text"
              name="lieu"
              id="lieu"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jours d&apos;ouverture
            </label>
          </div>

          <div>
            <label htmlFor="clickable" className="flex items-center">
              <input
                type="checkbox"
                name="clickable"
                id="clickable"
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-700">clickable</span>
            </label>
          </div>

          <div>
            <label htmlFor="hidden" className="flex items-center">
              <input
                type="checkbox"
                name="hidden"
                id="hidden"
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">hidden</span>
            </label>
          </div>

          <div>
            <label htmlFor="secondary" className="flex items-center">
              <input
                type="checkbox"
                name="secondary"
                id="secondary"
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-700">secondary</span>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Glyph Pattern
            </label>
            <div className="mt-1">
              <PixelMatch
                size={[GLYPH_MAX_SIZE, GLYPH_MAX_SIZE]}
                name="glyph"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="subQuests"
              className="block text-sm font-medium text-gray-700"
            >
              Sub Quests
            </label>
            <SubQuestsChooser name={"subQuests"} quests={quests} />
          </div>

          <div>
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Quest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
