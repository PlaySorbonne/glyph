import React from "react";
import { getCode, updateCode, deleteCode, getCodeById } from "@/actions/code";
import { redirect } from "next/navigation";
import { codeFormat } from "@/utils/constants";
import { appUrl } from "@/utils";
import Link from "next/link";

export default async function EditCodePage({
  params,
}: {
  params: { id: string };
}) {
  const code = await getCodeById(parseInt(params.id));


  if (!code) {
    return <div>Code not found</div>;
  }

  const handleSubmit = async (formData: FormData) => {
    "use server";
    
    const codeData = {
      code: formData.get("code") as string,
      description: (formData.get("description") as string) || null,
      isQuest: formData.get("questId") ? true : false,
      points: parseInt(formData.get("points") as string) || undefined,
      expires: formData.get("expires")
        ? new Date(formData.get("expires") as string)
        : null,
      questId: formData.get("questId")
        ? parseInt(formData.get("questId") as string)
        : null,
    };
    try {
      await updateCode(parseInt(params.id), codeData);
    } catch (error) {
      console.error("Error updating code:", error);
      return redirect(
        appUrl(
          `/admin/code/${
            params.id
          }?error=${"Erreur lors de la mise à jour du code"}`
        )
      );
    }
    return redirect(appUrl("/admin/code/all"));
  };

  const handleDelete = async () => {
    "use server";
    try {
      await deleteCode(parseInt(params.id));
    } catch (error) {
      console.error("Error deleting code:", error);
      return redirect(
        appUrl(
          `/admin/code/${
            params.id
          }?error=${"Erreur lors de la suppression du code"}`
        )
      );
    }
    return redirect(appUrl("/admin/code/all"));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Modifier le code</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mt-6 border-b pt-4">
          <h2 className="text-lg font-semibold mb-2">Afficher QRcode</h2>
            <Link href={`/s/${code.code}`}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Afficher QRcode
            </Link>
        </div>
        <div className="mt-6 border-b pt-4">
          <h2 className="text-lg font-semibold mb-2">Afficher Histrique</h2>
            <Link href={`/app/admin/code/${code.id}/history`}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Afficher l&apos;Historique
            </Link>
        </div>
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
              defaultValue={code.code}
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
              defaultValue={code.description || ""}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="points"
              className="block text-sm font-medium text-gray-700"
            >
              Points (laisser prérempli si c&apos;est un code à quêtes)
            </label>
            <input
              required
              type="number"
              name="points"
              id="points"
              min={0}
              defaultValue={code.points || ""}
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
              defaultValue={
                code.expires ? code.expires.toISOString().slice(0, 16) : ""
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="questId"
              className="block text-sm font-medium text-gray-700"
            >
              Quest ID (laisser vide si c&apos;est un code à points)
            </label>
            <input
              type="number"
              name="questId"
              id="questId"
              min={1}
              defaultValue={code.questId || ""}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Code
            </button>
          </div>
        </form>
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Delete Code</h2>
          <form action={handleDelete}>
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Code
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
