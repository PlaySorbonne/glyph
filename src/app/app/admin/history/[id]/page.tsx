import React from "react";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { appUrl } from "@/utils";
import { History } from "@prisma/client";
import {
  deleteHistory,
  getHistories,
  getHistoryById,
  updateHistory,
} from "@/actions/history";
import prisma from "@/lib/db";
import { get } from "http";

export default async function EditHistoryPage(props: {
  params: Promise<{ id: string }>;
}) {
  let params = await props.params;
  const history = await getHistoryById(parseInt(params.id));

  if (!history) {
    notFound();
  }

  const updateHistoryAction = async (formData: FormData) => {
    "use server";

    const historyData: Partial<History> = {
      id: parseInt(params.id),
      userId: formData.get("userId") as string,
      codeId: parseInt(formData.get("codeId") as string),
      questId: formData.get("questId")
        ? parseInt(formData.get("questId") as string)
        : null,
      points: parseInt(formData.get("points") as string),
    };
    try {
      await updateHistory(parseInt(params.id), historyData);
    } catch (error: any) {
      console.error("Error updating history:", error);
      redirect(`?error=${error.message}`);
    }
    revalidatePath(appUrl("/admin/history/" + params.id));
    revalidatePath(appUrl("/"));
    return redirect(appUrl("/admin/history/all"));
  };

  const deleteHistoryAction = async () => {
    "use server";
    try {
      await deleteHistory(parseInt(params.id));
    } catch (error) {
      console.error("Error deleting history:", error);
    }
    revalidatePath(appUrl("/admin/history/all"));
    return redirect(appUrl("/admin/history/all"));
  };

  const deletePossibleDuplicate = async () => {
    "use server";

    let time = 5 * 60 * 1000;
    //delete history with same userid and codeid in last and next 5 minutes
    let histories = await prisma.history.findMany({
      where: {
        userId: history.userId,
        codeId: history.codeId,
        date: {
          // HACK
          // @ts-ignore
          gte: new Date(history.date - time),
          // HACK
          // @ts-ignore
          lte: new Date(history.date - -time),
        },
        id: {
          not: history.id,
        },
      },
    });

    console.log(
      "histories",
      histories.map((h) => h.id)
    );

    histories.forEach(async (h) => {
      try {
        await deleteHistory(h.id);
      } catch (error) {
        console.error("Error deleting history", h.id, " : ", error);
      }
    });
    revalidatePath(appUrl("/admin/"));
    redirect(`?error=removed duplicates ${histories.map((h) => h.id)}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Modifier l&apos;utilisateur
      </h1>
      <form action={updateHistoryAction} className="space-y-4">
        <div>
          <label
            htmlFor="userId"
            className="block text-sm font-medium text-gray-700"
          >
            user ID
          </label>
          <input
            required
            type="text"
            id="userId"
            name="userId"
            defaultValue={history.userId ?? undefined}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="codeId"
            className="block text-sm font-medium text-gray-700"
          >
            code ID
          </label>
          <input
            required
            type="text"
            id="codeId"
            name="codeId"
            defaultValue={history.codeId ?? undefined}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="questId"
            className="block text-sm font-medium text-gray-700"
          >
            quest ID
          </label>
          <input
            type="text"
            id="questId"
            name="questId"
            defaultValue={history.questId ?? undefined}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="points"
            className="block text-sm font-medium text-gray-700"
          >
            points
          </label>
          <input
            type="number"
            id="points"
            name="points"
            defaultValue={history.points ?? undefined}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update History
          </button>
        </div>
      </form>
      <form action={deleteHistoryAction}>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete History
        </button>
      </form>
      <form action={deletePossibleDuplicate}>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          Delete Possible Duplicate
        </button>
      </form>
    </div>
  );
}
