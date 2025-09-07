import React from "react";
import { updateQuest, getQuest, deleteQuest } from "@/actions/quests";
import { NormalQuestInput } from "@/utils/zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  appUrl,
  GLYPH_MAX_SIZE,
  glyphArrayToString,
  glyphStringToArray,
  smallestContainingAllOnes,
} from "@/utils";
import PixelMatch from "@/app/app/components/PixelMatch";
import prisma from "@/lib/db";
import SubQuestsChooser from "../SubQuestsChooser";
import { DateTime } from "luxon";

export default async function EditQuestPage(props: {
  params: Promise<{ id: string }>;
}) {
  let params = await props.params;
  const quest = await prisma.quest.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      subQuests: true,
    },
  });

  let EmptyQuests = await prisma.quest.findMany({
    where: { parentId: null },
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
  });
  let nonEmptyQuests = (
    await prisma.quest.findMany({
      where: { parentId: { not: null } },
      select: { id: true, title: true, parentId: true },
      orderBy: { createdAt: "desc" },
    })
  ).map((q) => {
    return { ...q, title: `${q.title} - ${q.parentId}` };
  });

  let quests = [...EmptyQuests, ...nonEmptyQuests].map((q) => ({
    id: q.id,
    title: `${q.title} - ${q.id}`,
  }));

  if (!quest) {
    return <div>Quest not found</div>;
  }

  let isWrapperQuest = quest.subQuests.length > 0;
  let isSecondary = quest.secondary;

  const submitEdit = async (formData: FormData) => {
    "use server";

    const glyphInput = formData.get("glyph") as string;
    const {
      matrix: glyphArr,
      coords: [glyphPositionX, glyphPositionY],
    } = smallestContainingAllOnes(glyphStringToArray(glyphInput) || []) ?? [];
    const glyphStr = glyphArrayToString(glyphArr) || null;


    let glyphCheckRawStr = formData.get("glyph_check") as string;
    let glyphCheckStr: string | null = null;
    if (!glyphCheckRawStr || glyphCheckRawStr.trim() === "") {
      glyphCheckStr = glyphInput;
    } else {
      const { matrix: glyphCheckArr } =
        smallestContainingAllOnes(
          glyphStringToArray(formData.get("glyph_check") as string) || []
        ) ?? [];
      glyphCheckStr = glyphArrayToString(glyphCheckArr) || null;
    }

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
      glyph: glyphStr || null,
      glyphPositionX,
      glyphPositionY,
      clickable: formData.get("clickable") === "on",
      hidden: formData.get("hidden") === "on",
      glyphCheck: glyphCheckStr,
    };

    try {
      const updatedQuest = await updateQuest(params.id, questData);
    } catch (error) {
      console.error("Error updating quest:", error);
      return redirect(
        appUrl(
          `/admin/quest/${
            params.id
          }?error=${"Erreur lors de la mise à jour de la quête"}`
        )
      );
    }
    revalidatePath(appUrl("/admin/quest/all"));
    revalidatePath(appUrl("/admin/quest/" + params.id));
    return redirect(appUrl("/admin/quest/all"));
  };

  const deleteQuestAction = async () => {
    "use server";
    try {
      await deleteQuest(params.id);
    } catch (error) {
      console.error("Error deleting quest:", error);
      return redirect(
        appUrl(
          `/admin/quest/${
            params.id
          }?error=${"Erreur lors de la suppression de la quête"}`
        )
      );
    }
    revalidatePath(appUrl("/admin/quest/all"));
    return redirect(appUrl("/admin/quest/all"));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Modifier la quête</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <form action={submitEdit} className="space-y-4">
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
              htmlFor="horaires"
              className="block text-sm font-medium text-gray-700"
            >
              horaires
            </label>
            <input
              type="text"
              name="horaires"
              id="horaires"
              defaultValue={quest.horaires || ""}
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
            <label htmlFor="clickable" className="flex items-center">
              <input
                type="checkbox"
                name="clickable"
                id="clickable"
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                defaultChecked={quest.clickable}
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
                defaultChecked={quest.hidden}
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
                defaultChecked={quest.secondary}
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
              defaultValue={
                quest.starts ? quest.starts.toISOString().slice(0, 16) : ""
              }
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
              defaultValue={
                quest.ends ? quest.ends.toISOString().slice(0, 16) : ""
              }
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
              defaultValue={quest.mission || ""}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </div>

          {!isWrapperQuest && (
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
                defaultValue={quest.indice || ""}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              ></textarea>
            </div>
          )}

          {!isWrapperQuest && (
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
                defaultValue={quest.lieu || ""}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          )}

          {!isWrapperQuest && !isSecondary && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Glyph Pattern
              </label>
              <div className="mt-1">
                <PixelMatch
                  size={[GLYPH_MAX_SIZE, GLYPH_MAX_SIZE]}
                  defaultGlyph={glyphStringToArray(quest.glyph) || undefined}
                  coords={[
                    quest.glyphPositionX ?? 0,
                    quest.glyphPositionY ?? 0,
                  ]}
                  name="glyph"
                />
              </div>
            </div>
          )}

          {!isWrapperQuest && !isSecondary && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Glyph check Pattern
              </label>
              <div className="mt-1">
                <PixelMatch
                  size={[GLYPH_MAX_SIZE, GLYPH_MAX_SIZE]}
                  defaultGlyph={
                    glyphStringToArray(quest.glyphCheck) || undefined
                  }
                  name="glyph_check"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
        <form action={deleteQuestAction}>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete Quest
          </button>
        </form>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Sub Quests</h2>
          <SubQuestsChooser
            quests={quests}
            defaultSelected={quest.subQuests.map((q) => q.id)}
            onAdd={async (id) => {
              "use server";

              await prisma.quest.update({
                where: { id },
                data: {
                  parentId: parseInt(params.id),
                },
              });
            }}
            onRemove={async (id) => {
              "use server";

              await prisma.quest.update({
                where: { id },
                data: {
                  parentId: null,
                },
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
