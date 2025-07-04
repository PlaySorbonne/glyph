import React from "react";
import { updateQuest, getQuest, deleteQuest } from "@/actions/quests";
import { QuestInput } from "@/utils/zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  appUrl,
  GLYPH_SIZE,
  glyphArrayToString,
  glyphStringToArray,
  smallestContainingAllOnes,
} from "@/utils";
import PixelMatch from "@/app/app/components/PixelMatch";

export default async function EditQuestPage(props: {
  params: Promise<{ id: string }>;
}) {
  let params = await props.params;
  const quest = await getQuest(params.id);

  if (!quest) {
    return <div>Quest not found</div>;
  }

  const submit = async (formData: FormData) => {
    "use server";

    const glyphInput = formData.get("glyph") as string;
    const {
      matrix: glyphArr,
      coords: [glyphPositionX, glyphPositionY],
    } =
      smallestContainingAllOnes(glyphStringToArray(glyphInput) || []) ??
      [];
    const glyphStr = glyphArrayToString(glyphArr) || null;

    const questData: QuestInput = {
      title: formData.get("title") as string,
      img: (formData.get("img") as string) || null,
      mission: (formData.get("mission") as string) || null,
      description: (formData.get("description") as string) || null,
      indice: (formData.get("indice") as string) || null,
      lore: (formData.get("lore") as string) || null,
      lieu: (formData.get("lieu") as string) || null,
      daysOpen: Array.from(formData.getAll("daysOpen")).join(","),
      hourOpen: (formData.get("hourOpen") as string) || null,
      hourClose: (formData.get("hourClose") as string) || null,
      secondary: formData.get("secondary") === "on",
      points: parseInt(formData.get("points") as string) || 1,
      starts: formData.get("starts")
        ? new Date(formData.get("starts") as string)
        : null,
      ends: formData.get("ends")
        ? new Date(formData.get("ends") as string)
        : null,
      horaires: (formData.get("horaires") as string) || null,
      glyph: glyphStr || null,
      glyphPositionX,
      glyphPositionY,
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jours d&apos;ouverture
            </label>
            <div className="space-y-2">
              {["L", "M", "Me", "J", "V", "S", "D"].map((day) => (
                <label key={day} className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    name="daysOpen"
                    value={day}
                    defaultChecked={quest.daysOpen?.includes(day)}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2">{day}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="hourOpen"
              className="block text-sm font-medium text-gray-700"
            >
              Heure d&apos;ouverture (HH:MM)
            </label>
            <input
              type="time"
              name="hourOpen"
              id="hourOpen"
              defaultValue={quest.hourOpen || ""}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="hourClose"
              className="block text-sm font-medium text-gray-700"
            >
              Heure de fermeture (HH:MM)
            </label>
            <input
              type="time"
              name="hourClose"
              id="hourClose"
              defaultValue={quest.hourClose || ""}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Glyph Pattern
            </label>
            <div className="mt-1">
              <PixelMatch
                size={GLYPH_SIZE}
                defaultGlyph={glyphStringToArray(quest.glyph) || undefined}
                coords={[
                  quest.glyphPositionX ?? 0,
                  quest.glyphPositionY ?? 0,
                ]}
                name="glyph"
              />
            </div>
          </div>

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
    </div>
  );
}
