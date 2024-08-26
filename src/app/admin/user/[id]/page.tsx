import React from "react";
import { getUserById, updateUser, deleteUser } from "@/actions/users";
import { userSchema, UserInput } from "@/utils/constants";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function EditUserPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUserById(params.id);

  if (!user) {
    notFound();
  }

  const updateUserAction = async (formData: FormData) => {
    "use server";

    const userData: Partial<UserInput> = {
      isAdmin: formData.get("isAdmin") === "on",
      score: parseInt(formData.get("score") as string) || 0,
      fraternityId: formData.get("fraternityId")
        ? parseInt(formData.get("fraternityId") as string)
        : null,
      name: formData.get("name") ? (formData.get("name") as string) : user.name,
      displayName: formData.get("displayName")
        ? (formData.get("displayName") as string)
        : user.displayName,
      email: formData.get("email")
        ? (formData.get("email") as string)
        : user.email,
      image: formData.get("image")
        ? (formData.get("image") as string)
        : user.image,
    };

    try {
      await updateUser(params.id, userData);
    } catch (error) {
      console.error("Error updating user:", error);
      // Handle error (e.g., display error message)
    }
    revalidatePath(
      new URL("/admin/user/" + params.id, process.env.MAIN_URL).toString()
    );
    revalidatePath(new URL("/admin/user/all", process.env.MAIN_URL).toString());
    revalidatePath(new URL("/", process.env.MAIN_URL).toString());
    return redirect(
      new URL("/admin/user/all", process.env.MAIN_URL).toString()
    );
  };

  const deleteUserAction = async () => {
    "use server";
    try {
      await deleteUser(params.id);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
    revalidatePath(new URL("/admin/user/all", process.env.MAIN_URL).toString());
    return redirect(
      new URL("/admin/user/all", process.env.MAIN_URL).toString()
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Modifier l&apos;utilisateur
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <form action={updateUserAction} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={user.name ?? undefined}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-gray-700"
            >
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              defaultValue={user.displayName ?? undefined}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={user.email || ""}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Profile Image URL
            </label>
            <input
              type="url"
              id="image"
              name="image"
              defaultValue={user.image || ""}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isAdmin"
                defaultChecked={user.isAdmin}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Is Admin</span>
            </label>
          </div>

          <div>
            <label
              htmlFor="score"
              className="block text-sm font-medium text-gray-700"
            >
              Score
            </label>
            <input
              type="number"
              id="score"
              name="score"
              defaultValue={user.score}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="fraternityId"
              className="block text-sm font-medium text-gray-700"
            >
              Fraternity ID
            </label>
            <input
              type="number"
              id="fraternityId"
              name="fraternityId"
              defaultValue={user.fraternityId || ""}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update User
            </button>
          </div>
        </form>
        <form action={deleteUserAction}>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete User
          </button>
        </form>
      </div>
    </div>
  );
}
